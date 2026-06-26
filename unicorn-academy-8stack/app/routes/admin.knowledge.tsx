import { useState, useMemo } from "react";
import { useLoaderData, useNavigate } from "react-router";
import type { LoaderFunctionArgs, ActionFunctionArgs } from "react-router";
import { createServiceSupabase, requireUser } from "@/lib/supabase-server";
import { ingestDocument } from "@/lib/rag";
import type { KnowledgeDoc, KnowledgeCategory } from "@/types";
import AdminLayout from "@/components/layout/AdminLayout";

const CATEGORY_LABELS: Record<KnowledgeCategory, string> = {
  products:       "สินค้า",
  reward_plan:    "แผนรายได้ (UBC)",
  promotion:      "โปรโมชั่น",
  sales_strategy: "กลยุทธ์การขาย",
  general:        "ข้อมูลทั่วไป",
};

const CATEGORY_COLORS: Record<KnowledgeCategory, string> = {
  products:       "bg-blue-50 text-blue-700 border-blue-100",
  reward_plan:    "bg-purple-50 text-purple-700 border-purple-100",
  promotion:      "bg-orange-50 text-orange-700 border-orange-100",
  sales_strategy: "bg-red-50 text-red-700 border-red-100",
  general:        "bg-gray-50 text-gray-700 border-gray-100",
};

export function meta() {
  return [
    { title: "AI Knowledge Base — Admin Panel" },
  ];
}

export async function loader({ request }: LoaderFunctionArgs) {
  const responseHeaders = new Headers();
  const { user } = await requireUser(request, responseHeaders);

  const supabase = createServiceSupabase();
  const { data: docs } = await supabase
    .from("knowledge_docs")
    .select("*")
    .order("created_at", { ascending: false });

  return {
    userEmail: user.email || "admin@unicorn.com",
    docs: (docs || []) as KnowledgeDoc[],
  };
}

export async function action({ request }: ActionFunctionArgs) {
  await requireUser(request);
  const method = request.method;
  const supabase = createServiceSupabase();
  const workersUrl = process.env.WORKERS_URL!;

  if (method === "DELETE") {
    const data = await request.json();
    const { error } = await supabase
      .from("knowledge_docs")
      .delete()
      .eq("id", data.id);

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 400 });
    }
    return { success: true };
  }

  // Handle URL index, Text Ingest, or Reindex
  const data = await request.json();

  if (method === "POST") {
    const { type, category } = data;

    if (type === "url") {
      const { url } = data;
      const { data: doc, error } = await supabase
        .from("knowledge_docs")
        .insert({ title: url, category, source_type: "url", source_url: url })
        .select().single();

      if (error || !doc) {
        return new Response(JSON.stringify({ error: error?.message || "Failed to create document record" }), { status: 400 });
      }

      // Trigger Crawl via Cloudflare Worker
      try {
        const res = await fetch(`${workersUrl}/crawl`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url }),
        });

        if (!res.ok) throw new Error(`Crawler returned error: ${res.status}`);
        const { text } = await res.json() as { text: string };
        if (!text || text.length < 50) throw new Error("Crawled content is too short or empty");

        // Run batch embedding & chunk indexing
        await ingestDocument(doc.id, text, { source_url: url, category });
      } catch (err: any) {
        // Mark document as error
        await supabase.from("knowledge_docs")
          .update({ status: "error", error_msg: err.message, updated_at: new Date().toISOString() })
          .eq("id", doc.id);

        return new Response(JSON.stringify({ error: `การประมวลผลล้มเหลว: ${err.message}` }), { status: 400 });
      }
      return { success: true };
    }

    if (type === "text") {
      const { title, content } = data;
      const { data: doc, error } = await supabase
        .from("knowledge_docs")
        .insert({ title, category, source_type: "txt" })
        .select().single();

      if (error || !doc) {
        return new Response(JSON.stringify({ error: error?.message || "Failed to create document record" }), { status: 400 });
      }

      try {
        await ingestDocument(doc.id, content, { title, category });
      } catch (err: any) {
        return new Response(JSON.stringify({ error: `การฝัง Vector ล้มเหลว: ${err.message}` }), { status: 400 });
      }
      return { success: true };
    }
  }

  if (method === "PUT") {
    // Reindex Action
    const { id } = data;
    await supabase.from("knowledge_chunks").delete().eq("doc_id", id);

    const { data: doc } = await supabase
      .from("knowledge_docs").select("*").eq("id", id).single<KnowledgeDoc>();

    if (!doc) {
      return new Response(JSON.stringify({ error: "Document record not found" }), { status: 404 });
    }

    if (doc.source_url) {
      try {
        const res = await fetch(`${workersUrl}/crawl`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: doc.source_url }),
        });
        if (!res.ok) throw new Error(`Crawler returned error status: ${res.status}`);
        const { text } = await res.json() as { text: string };
        await ingestDocument(id, text, { source_url: doc.source_url, category: doc.category });
      } catch (err: any) {
        await supabase.from("knowledge_docs")
          .update({ status: "error", error_msg: err.message, updated_at: new Date().toISOString() })
          .eq("id", id);
        return new Response(JSON.stringify({ error: `Reindex failed: ${err.message}` }), { status: 400 });
      }
      return { success: true };
    } else {
      return new Response(JSON.stringify({ error: "Re-indexing is only supported for URL-source documents" }), { status: 400 });
    }
  }

  return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
}

export default function AdminKnowledgePage() {
  const { userEmail, docs: initialDocs } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  const [docs, setDocs] = useState<KnowledgeDoc[]>(initialDocs);
  const [tab, setTab] = useState<"url" | "text">("url");
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");

  // Form URL
  const [url, setUrl] = useState("");
  const [urlCategory, setUrlCategory] = useState<KnowledgeCategory>("general");

  // Form Text
  const [title, setTitle] = useState("");
  const [textContent, setTextContent] = useState("");
  const [textCategory, setTextCategory] = useState<KnowledgeCategory>("general");

  // Status flags
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    setSubmitting(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch("/admin/knowledge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "url",
          url,
          category: urlCategory,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "เกิดข้อผิดพลาดในการนำเข้า URL");
      }

      setSuccessMsg("นำเข้า URL สำเร็จ ระบบกำลังเริ่มดูดข้อมูลและฝัง Vector ความรู้...");
      setUrl("");
      
      // Reload lists
      setTimeout(() => {
        navigate("/admin/knowledge", { replace: true });
        window.location.reload();
      }, 1500);
    } catch (err: any) {
      setErrorMsg(err.message || "เกิดข้อผิดพลาด");
    } finally {
      setSubmitting(false);
    }
  };

  const handleTextSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !textContent) return;
    setSubmitting(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch("/admin/knowledge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "text",
          title,
          content: textContent,
          category: textCategory,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "เกิดข้อผิดพลาดในการวิเคราะห์บทความ");
      }

      setSuccessMsg("นำเข้าบทความสำเร็จ ข้อมูลถูกสับย่อยและฝัง Vector ลงในฐานข้อมูลแล้ว!");
      setTitle("");
      setTextContent("");
      
      setTimeout(() => {
        navigate("/admin/knowledge", { replace: true });
        window.location.reload();
      }, 1500);
    } catch (err: any) {
      setErrorMsg(err.message || "เกิดข้อผิดพลาด");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReindex = async (docId: string) => {
    if (!confirm("ต้องการสั่งให้ AI สกัดและทำดัชนีความรู้ (Re-index) จากเอกสารนี้ใหม่อีกครั้งใช่หรือไม่?")) return;
    try {
      // Optimistically update UI status
      setDocs(prev => prev.map(d => d.id === docId ? { ...d, status: "processing" } : d));

      const res = await fetch("/admin/knowledge", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: docId }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "เกิดข้อผิดพลาดในการ Re-index");
      }

      alert("สั่ง Re-index สำเร็จ ระบบกำลังประมวลผลข้อมูลใหม่");
      navigate("/admin/knowledge", { replace: true });
      window.location.reload();
    } catch (err: any) {
      alert(err.message || "การสั่งประมวลผลล้มเหลว");
      // Restore initial list on error
      setDocs(initialDocs);
    }
  };

  const handleDelete = async (docId: string, title: string) => {
    if (!confirm(`คุณต้องการลบเอกสารความรู้ "${title}" และล้าง Vector Chunks ทั้งหมดใช่หรือไม่?`)) return;
    try {
      const res = await fetch("/admin/knowledge", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: docId }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "เกิดข้อผิดพลาดในการลบ");
      }

      setDocs(prev => prev.filter(d => d.id !== docId));
    } catch (err: any) {
      alert(err.message || "เกิดข้อผิดพลาดในการลบ");
    }
  };

  const filteredDocs = useMemo(() => {
    return docs.filter(d => {
      const matchesSearch = d.title.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = filterCategory === "all" || d.category === filterCategory;
      return matchesSearch && matchesCategory;
    });
  }, [docs, search, filterCategory]);

  return (
    <AdminLayout userEmail={userEmail}>
      <div className="space-y-6 max-w-5xl font-body text-text-primary">
        {/* Header */}
        <div className="mb-6">
          <h1 className="font-display font-bold text-2xl text-text-primary">AI Knowledge Base (RAG)</h1>
          <p className="text-xs text-text-muted mt-1.5">
            จัดการคลังความรู้เชิงลึกของแบรนด์ สินค้า แผนการตลาด และโปรโมชั่น เพื่อเป็นฐานความรู้อ้างอิงสำหรับการตอบคำถามของ AI Coach (น้องยูนิ)
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Left Side: Ingestion Forms */}
          <div className="bg-white border border-border-default rounded-3xl p-5 shadow-sm space-y-4">
            <h3 className="font-display font-bold text-base text-text-primary flex items-center gap-2 select-none">
              <span>🧠 เพิ่มฐานความรู้ใหม่</span>
            </h3>

            {/* Tab Selector */}
            <div className="flex bg-bg-input p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setTab("url")}
                className={`flex-1 text-xs font-bold py-2 rounded-lg transition-all ${
                  tab === "url" 
                    ? "bg-white text-brand-gold shadow-sm" 
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                🔗 ดึงจากหน้าเว็บ (URL)
              </button>
              <button
                type="button"
                onClick={() => setTab("text")}
                className={`flex-1 text-xs font-bold py-2 rounded-lg transition-all ${
                  tab === "text" 
                    ? "bg-white text-brand-gold shadow-sm" 
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                📝 เขียนบทความเอง
              </button>
            </div>

            {errorMsg && (
              <div className="p-3.5 bg-red-50 text-red-700 border border-red-100 rounded-xl text-xs font-bold animate-pulse">
                ⚠️ {errorMsg}
              </div>
            )}

            {successMsg && (
              <div className="p-3.5 bg-green-50 text-green-700 border border-green-100 rounded-xl text-xs font-bold">
                🎉 {successMsg}
              </div>
            )}

            {/* URL Form */}
            {tab === "url" && (
              <form onSubmit={handleUrlSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-text-muted uppercase tracking-wider mb-1.5 select-none">
                    หมวดหมู่ของความรู้
                  </label>
                  <select
                    value={urlCategory}
                    onChange={(e) => setUrlCategory(e.target.value as KnowledgeCategory)}
                    className="w-full px-4 py-2.5 bg-bg-input border border-border-strong rounded-xl focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none font-bold text-xs sm:text-sm text-text-primary"
                  >
                    {Object.entries(CATEGORY_LABELS).map(([key, val]) => (
                      <option key={key} value={key}>{val}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-text-muted uppercase tracking-wider mb-1.5 select-none">
                    ลิงก์หน้าเว็บ (URL)
                  </label>
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com/product-info"
                    className="w-full px-4 py-2.5 bg-bg-input border border-border-strong rounded-xl focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none font-semibold text-xs text-text-primary"
                    required
                  />
                  <span className="text-[10px] text-text-muted mt-1.5 block leading-relaxed">
                    * ระบบจะดูดเนื้อหาข้อความสำคัญในหน้าเว็บโดยอัตโนมัติ สลัดเป็นย่อยๆ และฝังเวกเตอร์
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full btn-gold justify-center py-3 shadow-sm mt-2 text-xs font-bold"
                >
                  {submitting ? "กำลังสแกนลิงก์..." : "⚡ สกัดข้อมูลเว็บ & เรียนรู้"}
                </button>
              </form>
            )}

            {/* Plain Text Form */}
            {tab === "text" && (
              <form onSubmit={handleTextSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-text-muted uppercase tracking-wider mb-1.5 select-none">
                    หมวดหมู่ของความรู้
                  </label>
                  <select
                    value={textCategory}
                    onChange={(e) => setTextCategory(e.target.value as KnowledgeCategory)}
                    className="w-full px-4 py-2.5 bg-bg-input border border-border-strong rounded-xl focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none font-bold text-xs sm:text-sm text-text-primary"
                  >
                    {Object.entries(CATEGORY_LABELS).map(([key, val]) => (
                      <option key={key} value={key}>{val}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-text-muted uppercase tracking-wider mb-1.5 select-none">
                    หัวข้อบทความ / ชื่อความรู้
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="เช่น การตอบข้อโต้แย้งเรื่องราคา"
                    className="w-full px-4 py-2.5 bg-bg-input border border-border-strong rounded-xl focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none font-bold text-xs sm:text-sm text-text-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-text-muted uppercase tracking-wider mb-1.5 select-none">
                    เนื้อหาความรู้เชิงลึก (สำหรับ AI)
                  </label>
                  <textarea
                    value={textContent}
                    onChange={(e) => setTextContent(e.target.value)}
                    placeholder="เขียนข้อมูลความรู้ เช่น รายละเอียดการสะสมคะแนน 2,000 PV..."
                    className="w-full px-4 py-2.5 bg-bg-input border border-border-strong rounded-xl focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none font-semibold text-xs text-text-primary min-h-[160px]"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full btn-gold justify-center py-3 shadow-sm text-xs font-bold"
                >
                  {submitting ? "กำลังสับย่อยและประมวลผล..." : "💾 บันทึกและวิเคราะห์ความรู้"}
                </button>
              </form>
            )}
          </div>

          {/* Right Side: Document Table */}
          <div className="lg:col-span-2 space-y-4">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex gap-2 w-full sm:w-auto">
                <input
                  type="text"
                  placeholder="ค้นหาเอกสารความรู้..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full sm:w-48 px-4 py-2.5 bg-white border border-border-strong rounded-xl focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none font-medium text-xs text-text-primary"
                />
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-3 py-2 bg-white border border-border-strong rounded-xl focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none font-bold text-xs text-text-secondary"
                >
                  <option value="all">ทุกหมวดหมู่</option>
                  {Object.entries(CATEGORY_LABELS).map(([key, val]) => (
                    <option key={key} value={key}>{val}</option>
                  ))}
                </select>
              </div>
              <span className="text-xs font-bold text-text-muted shrink-0 select-none">
                พบเอกสารทั้งหมด {filteredDocs.length} รายการ
              </span>
            </div>

            {/* Table */}
            <div className="bg-white border border-border-default rounded-3xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-border-default bg-bg-input text-[10px] font-bold text-text-muted uppercase tracking-wider select-none">
                      <th className="px-4 py-4 w-20 text-center">ประเภท</th>
                      <th className="px-4 py-4">ชื่อเอกสารความรู้ / แหล่งที่มา</th>
                      <th className="px-4 py-4">หมวดหมู่</th>
                      <th className="px-4 py-4 text-center">Chunks</th>
                      <th className="px-4 py-4 text-center">สถานะ AI</th>
                      <th className="px-4 py-4 text-right">เครื่องมือ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-muted">
                    {filteredDocs.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-text-muted italic select-none">
                          ยังไม่มีข้อมูลความรู้ในคลังความรู้ RAG
                        </td>
                      </tr>
                    ) : (
                      filteredDocs
                        .sort((a, b) => new Date(b.created_at || "").getTime() - new Date(a.created_at || "").getTime())
                        .map((doc) => (
                          <tr key={doc.id} className="hover:bg-bg-hover/30 transition-colors">
                            {/* Source Type */}
                            <td className="px-4 py-3 text-center">
                              {doc.source_type === "url" ? (
                                <span className="text-[10px] bg-amber-50 text-amber-700 border border-amber-100 rounded px-1.5 py-0.5 font-bold">
                                  🔗 เว็บไซต์
                                </span>
                              ) : (
                                <span className="text-[10px] bg-blue-50 text-blue-700 border border-blue-100 rounded px-1.5 py-0.5 font-bold">
                                  📝 ข้อความ
                                </span>
                              )}
                            </td>

                            {/* Title & URL */}
                            <td className="px-4 py-3 max-w-[160px] sm:max-w-[200px]">
                              <div className="font-bold text-text-primary truncate" title={doc.title}>
                                {doc.title}
                              </div>
                              {doc.source_url && (
                                <a 
                                  href={doc.source_url} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="text-[9px] text-brand-gold hover:text-brand-gold-hover hover:underline font-mono truncate block mt-0.5"
                                >
                                  ลิงก์เว็บหลัก ↗
                                </a>
                              )}
                            </td>

                            {/* Category Badge */}
                            <td className="px-4 py-3">
                              <span className={`text-[9px] border rounded-full px-2.5 py-0.5 font-bold uppercase tracking-wider ${
                                CATEGORY_COLORS[doc.category] || CATEGORY_COLORS.general
                              }`}>
                                {CATEGORY_LABELS[doc.category] || "ทั่วไป"}
                              </span>
                            </td>

                            {/* Chunk Count */}
                            <td className="px-4 py-3 text-center font-bold text-text-secondary font-mono">
                              {doc.chunk_count}
                            </td>

                            {/* Processing Status Badge */}
                            <td className="px-4 py-3 text-center">
                              <span className={`badge font-black px-2 py-0.5 rounded text-[10px] select-none ${
                                doc.status === "indexed" ? "badge-success" :
                                doc.status === "processing" ? "badge-info animate-pulse" :
                                doc.status === "pending" ? "badge-warning" :
                                "badge-danger"
                              }`}>
                                {doc.status === "indexed" && "✓ Indexed"}
                                {doc.status === "processing" && "⚙ Processing"}
                                {doc.status === "pending" && "⏳ Pending"}
                                {doc.status === "error" && "⚠️ Error"}
                              </span>
                              {doc.error_msg && (
                                <span className="block text-[8px] text-red-600 line-clamp-1 mt-0.5" title={doc.error_msg}>
                                  {doc.error_msg}
                                </span>
                              )}
                            </td>

                            {/* Delete & Reindex Actions */}
                            <td className="px-4 py-3 text-right space-x-3">
                              {doc.source_type === "url" && (
                                <button
                                  type="button"
                                  onClick={() => handleReindex(doc.id)}
                                  disabled={doc.status === "processing"}
                                  className="text-xs font-bold text-brand-gold hover:underline disabled:opacity-50"
                                >
                                  Re-index
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => handleDelete(doc.id, doc.title)}
                                className="text-xs font-bold text-red-600 hover:underline"
                              >
                                ลบ
                              </button>
                            </td>
                          </tr>
                        ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
