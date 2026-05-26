// src/app/(admin)/admin/knowledge/KnowledgeClient.tsx
"use client";

import { useState } from "react";
import type { KnowledgeDoc, KnowledgeCategory } from "@/types/index";
import { ingestUrl, ingestText, reindexDocument, deleteDocument } from "./actions";

interface KnowledgeClientProps {
  initialDocs: KnowledgeDoc[];
}

const CATEGORY_LABELS: Record<KnowledgeCategory, string> = {
  products:       "สินค้า",
  reward_plan:    "แผนรายได้ (UBC)",
  promotion:      "โปรโมชั่น",
  sales_strategy: "กลยุทธ์การขาย",
  general:        "ข้อมูลทั่วไป",
};

const CATEGORY_COLORS: Record<KnowledgeCategory, string> = {
  products:       "bg-blue-50 text-blue-700 border-blue-200",
  reward_plan:    "bg-purple-50 text-purple-700 border-purple-200",
  promotion:      "bg-orange-50 text-orange-700 border-orange-200",
  sales_strategy: "bg-red-50 text-red-700 border-red-200",
  general:        "bg-gray-50 text-gray-700 border-gray-200",
};

export default function KnowledgeClient({ initialDocs }: KnowledgeClientProps) {
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

  // Status
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
      await ingestUrl(url, urlCategory);
      setSuccessMsg("นำเข้า URL สำเร็จ ระบบกำลังเริ่มดูดข้อมูลและฝัง Vector ความรู้...");
      setUrl("");
      // Reload page to refresh doc list and show processing status
      setTimeout(() => window.location.reload(), 1500);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการนำเข้า URL");
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
      await ingestText(title, textCategory, textContent);
      setSuccessMsg("นำเข้าบทความสำเร็จ ข้อมูลถูกสับย่อยและฝัง Vector ลงในฐานข้อมูลแล้ว!");
      setTitle("");
      setTextContent("");
      setTimeout(() => window.location.reload(), 1500);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการนำเข้าข้อความ");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReindex = async (docId: string) => {
    if (!confirm("ต้องการสั่งให้ AI สกัดและทำดัชนีความรู้ (Re-index) จากเอกสารนี้ใหม่อีกครั้งใช่หรือไม่?")) return;
    try {
      // Optimistically update status
      setDocs(prev => prev.map(d => d.id === docId ? { ...d, status: "processing" } : d));
      await reindexDocument(docId);
      alert("สั่ง Re-index สำเร็จระบบกำลังประมวลผลข้อมูลใหม่");
      window.location.reload();
    } catch (err) {
      alert("ประมวลผลใหม่ล้มเหลว: " + (err instanceof Error ? err.message : ""));
    }
  };

  const handleDelete = async (docId: string, title: string) => {
    if (!confirm(`คุณต้องการลบเอกสารความรู้ "${title}" และล้าง Vector Chunks ทั้งหมดใช่หรือไม่?`)) return;
    try {
      await deleteDocument(docId);
      setDocs(prev => prev.filter(d => d.id !== docId));
    } catch (err) {
      alert("ลบไม่สำเร็จ: " + (err instanceof Error ? err.message : ""));
    }
  };

  const filteredDocs = docs.filter(d => {
    const matchesSearch = d.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = filterCategory === "all" || d.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* ── Left Side: Ingestion Forms ── */}
      <div className="bg-bg-card border border-border-default rounded-2xl p-6 shadow-card h-fit sticky top-24">
        <h3 className="font-display font-bold text-lg text-text-primary mb-4 flex items-center gap-2">
          <span>🧠 เพิ่มฐานความรู้ให้ AI Coach</span>
        </h3>

        {/* Tab Selector */}
        <div className="flex bg-[#f4f2ee] p-1 rounded-xl mb-6">
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
          <div className="mb-4 p-3.5 bg-red-50 text-red-700 border border-red-200 rounded-xl text-xs font-semibold">
            ⚠️ {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3.5 bg-green-50 text-green-700 border border-green-200 rounded-xl text-xs font-semibold">
            🎉 {successMsg}
          </div>
        )}

        {/* URL Form */}
        {tab === "url" && (
          <form onSubmit={handleUrlSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-text-secondary mb-1">
                หมวดหมู่ของความรู้
              </label>
              <select
                value={urlCategory}
                onChange={(e) => setUrlCategory(e.target.value as KnowledgeCategory)}
                className="field-input text-xs font-medium"
              >
                {Object.entries(CATEGORY_LABELS).map(([key, val]) => (
                  <option key={key} value={key}>{val}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-text-secondary mb-1">
                ลิงก์หน้าเว็บ (URL)
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/product-info"
                className="field-input text-xs"
                required
              />
              <span className="text-[10px] text-text-muted mt-1 block">
                * ระบบจะดูดเนื้อหาบทความและข้อความหลักเฉพาะในหน้าเว็บภายนอกโดยอัตโนมัติ
              </span>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn-gold w-full justify-center py-2.5 shadow-md mt-2"
            >
              {submitting ? "กำลังวิเคราะห์ลิงก์..." : "⚡ สกัดข้อมูลเว็บ & เรียนรู้"}
            </button>
          </form>
        )}

        {/* Plain Text Form */}
        {tab === "text" && (
          <form onSubmit={handleTextSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-text-secondary mb-1">
                หมวดหมู่ของความรู้
              </label>
              <select
                value={textCategory}
                onChange={(e) => setTextCategory(e.target.value as KnowledgeCategory)}
                className="field-input text-xs font-medium"
              >
                {Object.entries(CATEGORY_LABELS).map(([key, val]) => (
                  <option key={key} value={key}>{val}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-text-secondary mb-1">
                หัวข้อบทความ / ชื่อความรู้
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="เช่น การปรับแนวคิด UBC Level 1"
                className="field-input"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-text-secondary mb-1">
                เนื้อหาความรู้เชิงลึก (สำหรับ AI)
              </label>
              <textarea
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                placeholder="เขียนข้อมูลความรู้ เช่น จุดเด่น คุณภาพ แผนการรับรายได้ เพื่อให้ AI เข้าใจและนำไปอ้างอิงตอนตอบคำถามสมาชิก..."
                className="field-input text-xs min-h-[160px]"
                required
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn-gold w-full justify-center py-2.5 shadow-md"
            >
              {submitting ? "กำลังสับ Chunk & ฝัง Vector..." : "💾 บันทึกและวิเคราะห์ความรู้"}
            </button>
          </form>
        )}
      </div>

      {/* ── Right Side: Document Table ── */}
      <div className="lg:col-span-2 space-y-4">
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex gap-2 w-full sm:w-auto">
            <input
              type="text"
              placeholder="ค้นหาเอกสารความรู้..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="field-input max-w-xs"
            />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="field-input max-w-xs text-xs"
            >
              <option value="all">ทุกหมวดหมู่</option>
              {Object.entries(CATEGORY_LABELS).map(([key, val]) => (
                <option key={key} value={key}>{val}</option>
              ))}
            </select>
          </div>
          <span className="text-xs font-bold text-text-muted">
            จำนวนเอกสารทั้งหมด {filteredDocs.length} รายการ
          </span>
        </div>

        {/* Table */}
        <div className="bg-bg-card border border-border-default rounded-2xl overflow-hidden shadow-card">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-border-default bg-[#faf8f4] text-[11px] font-bold text-text-muted uppercase tracking-wider">
                <th className="px-4 py-3.5">ประเภท</th>
                <th className="px-4 py-3.5">ชื่อเอกสารความรู้ / ลิงก์</th>
                <th className="px-4 py-3.5">หมวดหมู่</th>
                <th className="px-4 py-3.5 text-center">Chunks</th>
                <th className="px-4 py-3.5 text-center">สถานะ AI</th>
                <th className="px-4 py-3.5 text-right">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {filteredDocs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-text-muted">
                    ยังไม่มีข้อมูลความรู้ในฐานข้อมูล RAG
                  </td>
                </tr>
              ) : (
                filteredDocs
                  .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                  .map((doc) => (
                    <tr key={doc.id} className="border-b border-border-muted hover:bg-[#faf8f4] transition-colors">
                      {/* Type */}
                      <td className="px-4 py-3 text-center w-20">
                        {doc.source_type === "url" ? (
                          <span className="text-xs bg-amber-50 text-amber-700 border border-amber-200 rounded px-1.5 py-0.5 font-bold">
                            🔗 เว็บไซต์
                          </span>
                        ) : (
                          <span className="text-xs bg-blue-50 text-blue-700 border border-blue-200 rounded px-1.5 py-0.5 font-bold">
                            📝 ข้อความ
                          </span>
                        )}
                      </td>

                      {/* Title */}
                      <td className="px-4 py-3 max-w-xs sm:max-w-sm">
                        <div className="font-bold text-text-primary truncate" title={doc.title}>
                          {doc.title}
                        </div>
                        {doc.source_url && (
                          <a 
                            href={doc.source_url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-[10px] text-brand-gold hover:underline font-mono truncate block"
                          >
                            เปิดลิงก์ข้อมูล →
                          </a>
                        )}
                      </td>

                      {/* Category */}
                      <td className="px-4 py-3">
                        <span className={`text-[10px] border rounded-full px-2 py-0.5 font-bold uppercase tracking-tighter ${
                          CATEGORY_COLORS[doc.category] || CATEGORY_COLORS.general
                        }`}>
                          {CATEGORY_LABELS[doc.category] || "ทั่วไป"}
                        </span>
                      </td>

                      {/* Chunks */}
                      <td className="px-4 py-3 text-center font-bold text-text-secondary">
                        {doc.chunk_count}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3 text-center">
                        <span className={`badge font-bold px-2 py-0.5 rounded text-xs select-none ${
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

                      {/* Actions */}
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
  );
}
