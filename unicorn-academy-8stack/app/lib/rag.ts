// app/lib/rag.ts
// ═══════════════════════════════════════════════════════
// RAG (Retrieval-Augmented Generation) Core Library
// ═══════════════════════════════════════════════════════
import type { KnowledgeSearchResult } from "@/types/index";

function getWorkersUrl(): string {
  // @ts-ignore
  const cfEnv = (typeof globalThis !== "undefined" ? (globalThis as any).CF_ENV : null) || {};
  return cfEnv.WORKERS_URL || process.env.WORKERS_URL || "https://unicorn-smart-ai-proxy.lifetutorthailand.workers.dev";
}

// ── Generate embedding via CF Workers → Gemini ──
export async function embedText(text: string): Promise<number[]> {
  // Try direct embedding using GEMINI_API_KEY from env if available
  // @ts-ignore
  const cfEnv = (typeof globalThis !== "undefined" ? (globalThis as any).CF_ENV : null) || {};
  const geminiApiKey = cfEnv.GEMINI_API_KEY || process.env.GEMINI_API_KEY;

  if (geminiApiKey && !geminiApiKey.includes("placeholder")) {
    try {
      const directRes = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/text-embedding-004:embedContent?key=${geminiApiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "models/text-embedding-004",
            content: { parts: [{ text: text.slice(0, 8192) }] },
          }),
        }
      );

      if (directRes.ok) {
        const data = await directRes.json() as { embedding?: { values: number[] } };
        if (data.embedding?.values) {
          return data.embedding.values;
        }
      } else {
        console.error("Direct embedding failed status:", directRes.status);
      }
    } catch (err) {
      console.error("Direct embedding error:", err);
    }
  }

  // Fallback to CF Workers Proxy
  const workersUrl = getWorkersUrl();
  const res = await fetch(`${workersUrl}/embed`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify({ text: text.slice(0, 8192) }), // Gemini limit
  });
  if (!res.ok) throw new Error(`Embed failed: ${res.status}`);
  const { embedding } = await res.json() as { embedding: number[] };
  return embedding;
}

// ── Vector similarity search in Supabase pgvector ──
export async function searchKnowledge(
  query:      string,
  matchCount: number  = 5,
  minScore:   number  = 0.65
): Promise<KnowledgeSearchResult[]> {
  const { createServiceSupabase } = await import("@/lib/supabase-server");
  const supabase = createServiceSupabase();

  const embedding = await embedText(query);

  const { data, error } = await supabase.rpc("search_knowledge", {
    query_embedding: embedding,
    match_count:     matchCount,
    min_score:       minScore,
  }) as { data: KnowledgeSearchResult[] | null; error: unknown };

  if (error) {
    console.error("searchKnowledge error:", error);
    return [];
  }
  return data ?? [];
}

// ── Split text into overlapping chunks ──
function splitIntoChunks(text: string, size = 500, overlap = 50): string[] {
  const chunks: string[] = [];
  const clean = text.replace(/\s+/g, " ").trim();
  if (!clean) return [];

  let start = 0;
  while (start < clean.length) {
    const end = Math.min(start + size, clean.length);
    let boundary = end;
    if (end < clean.length) {
      const lastSpace = clean.lastIndexOf(" ", end);
      if (lastSpace > start) boundary = lastSpace;
    }
    const chunk = clean.slice(start, boundary).trim();
    if (chunk.length > 20) chunks.push(chunk);
    start = boundary - overlap;
    if (start <= 0 || boundary >= clean.length) break;
  }
  return chunks;
}

// ── Ingest document: chunk → embed → store ──
export async function ingestDocument(
  docId:    string,
  text:     string,
  metadata: Record<string, unknown>
): Promise<void> {
  const { createServiceSupabase } = await import("@/lib/supabase-server");
  const supabase = createServiceSupabase();

  // Mark as processing
  await supabase.from("knowledge_docs")
    .update({ status: "processing", updated_at: new Date().toISOString() })
    .eq("id", docId);

  try {
    const chunks = splitIntoChunks(text, 500, 50);
    if (chunks.length === 0) throw new Error("No text content to ingest");

    // Process in batches of 5 to avoid rate limits
    const BATCH = 5;
    for (let i = 0; i < chunks.length; i += BATCH) {
      const batch  = chunks.slice(i, i + BATCH);
      const embeds = await Promise.all(batch.map(embedText));

      const rows = batch.map((content, j) => ({
        doc_id:      docId,
        content,
        embedding:   embeds[j],
        metadata:    { ...metadata, chunk_index: i + j },
        chunk_index: i + j,
      }));

      const { error } = await supabase.from("knowledge_chunks").insert(rows);
      if (error) throw new Error(error.message);
    }

    // Mark as indexed
    await supabase.from("knowledge_docs")
      .update({
        status:      "indexed",
        chunk_count: chunks.length,
        updated_at:  new Date().toISOString(),
      })
      .eq("id", docId);

  } catch (err) {
    await supabase.from("knowledge_docs")
      .update({
        status:    "error",
        error_msg: err instanceof Error ? err.message : "Unknown error",
        updated_at: new Date().toISOString(),
      })
      .eq("id", docId);
    throw err;
  }
}

// ── Build RAG context string for AI prompt ──
export function buildRagContext(results: KnowledgeSearchResult[]): string {
  if (results.length === 0) return "";
  return [
    "\n--- ข้อมูลอ้างอิงจากระบบ ---",
    ...results.map((r, i) => `[${i + 1}] ${r.content}`),
    "--- สิ้นสุดข้อมูลอ้างอิง ---\n",
  ].join("\n\n");
}
