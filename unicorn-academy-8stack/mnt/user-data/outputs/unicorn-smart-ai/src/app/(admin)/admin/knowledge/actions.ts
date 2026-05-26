// src/app/(admin)/admin/knowledge/actions.ts
"use server";
import { createServiceSupabase } from "@/lib/supabase-server";
import { ingestDocument } from "@/lib/rag";
import { revalidatePath } from "next/cache";
import type { KnowledgeCategory } from "@/types/index";

// ── Ingest from URL ──
export async function ingestUrl(
  url:      string,
  category: KnowledgeCategory
): Promise<void> {
  const supabase = createServiceSupabase();

  const { data: doc, error } = await supabase
    .from("knowledge_docs")
    .insert({ title: url, category, source_type: "url", source_url: url })
    .select().single();

  if (error || !doc) throw new Error(error?.message ?? "Failed to create doc");

  // Crawl via Workers
  const workersUrl = process.env.WORKERS_URL!;
  const res = await fetch(`${workersUrl}/crawl`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify({ url }),
  });

  const { text } = await res.json() as { text: string };
  if (!text || text.length < 50) throw new Error("Crawled content too short");

  await ingestDocument(doc.id, text, { source_url: url, category });
  revalidatePath("/admin/knowledge");
}

// ── Ingest from plain text (manual) ──
export async function ingestText(
  title:    string,
  category: KnowledgeCategory,
  content:  string
): Promise<void> {
  const supabase = createServiceSupabase();

  const { data: doc, error } = await supabase
    .from("knowledge_docs")
    .insert({ title, category, source_type: "txt" })
    .select().single();

  if (error || !doc) throw new Error(error?.message ?? "Failed");

  await ingestDocument(doc.id, content, { title, category });
  revalidatePath("/admin/knowledge");
}

// ── Re-index existing document ──
export async function reindexDocument(docId: string): Promise<void> {
  const supabase = createServiceSupabase();

  // Delete existing chunks
  await supabase.from("knowledge_chunks").delete().eq("doc_id", docId);

  const { data: doc } = await supabase
    .from("knowledge_docs").select("*").eq("id", docId).single();

  if (!doc) throw new Error("Document not found");

  if (doc.source_url) {
    const workersUrl = process.env.WORKERS_URL!;
    const res = await fetch(`${workersUrl}/crawl`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ url: doc.source_url }),
    });
    const { text } = await res.json() as { text: string };
    await ingestDocument(docId, text, { source_url: doc.source_url, category: doc.category });
  }

  revalidatePath("/admin/knowledge");
}

// ── Delete document + chunks ──
export async function deleteDocument(docId: string): Promise<void> {
  const supabase = createServiceSupabase();
  await supabase.from("knowledge_docs").delete().eq("id", docId);
  revalidatePath("/admin/knowledge");
}
