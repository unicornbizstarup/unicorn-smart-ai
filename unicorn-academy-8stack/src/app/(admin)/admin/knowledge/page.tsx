// src/app/(admin)/admin/knowledge/page.tsx
export const runtime = "edge";
import { createServiceSupabase } from "@/lib/supabase-server";
import KnowledgeClient from "./KnowledgeClient";
import type { KnowledgeDoc } from "@/types/index";

export const metadata = { title: "AI Knowledge Base — Admin Panel" };

export default async function AdminKnowledgePage() {
  const supabase = createServiceSupabase();

  const { data: docs } = await supabase
    .from("knowledge_docs")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-display font-bold text-2xl text-text-primary">AI Knowledge Base (RAG)</h1>
        <p className="text-sm text-text-muted mt-0.5">
          จัดการคลังความรู้เชิงลึกของแบรนด์ สินค้า แผนการตลาด และโปรโมชั่น เพื่อเป็นสติปัญญาป้อนเข้าสู่ระบบ AI Coach (น้องยูนิ)
        </p>
      </div>

      {/* Main interactive RAG client dashboard */}
      <KnowledgeClient initialDocs={(docs ?? []) as KnowledgeDoc[]} />
    </div>
  );
}
