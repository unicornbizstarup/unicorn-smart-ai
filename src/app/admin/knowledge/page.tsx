'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  FileText,
  Upload,
  Trash2,
  BookOpen,
  Search,
  Filter,
  Loader2,
  CheckCircle,
  AlertTriangle,
  FileDown
} from 'lucide-react';

interface KnowledgeDoc {
  id: string;
  title: string;
  category: 'products' | 'reward_plan' | 'promotion' | 'sales_strategy' | 'general';
  source_type: 'pdf' | 'txt' | 'url' | 'docx' | 'youtube';
  source_url?: string;
  file_size?: number;
  status: 'pending' | 'processing' | 'indexed' | 'error';
  chunk_count: number;
  error_msg?: string;
  created_at: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  products: 'ข้อมูลสินค้า',
  reward_plan: 'แผนรายได้ (UBC)',
  promotion: 'โปรโมชั่น',
  sales_strategy: 'กลยุทธ์การขาย',
  general: 'ข้อมูลทั่วไป/คำถามพบบ่อย',
};

const CATEGORY_COLORS: Record<string, string> = {
  products: 'bg-blue-50 text-blue-700 border-blue-100',
  reward_plan: 'bg-purple-50 text-purple-700 border-purple-100',
  promotion: 'bg-orange-50 text-orange-700 border-orange-100',
  sales_strategy: 'bg-red-50 text-red-700 border-red-100',
  general: 'bg-gray-50 text-gray-700 border-gray-100',
};

export default function AdminKnowledgePage() {
  const [docs, setDocs] = useState<KnowledgeDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  
  // Form State
  const [file, setFile] = useState<File | null>(null);
  const [category, setCategory] = useState<KnowledgeDoc['category']>('general');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Fetch documents list
  const fetchDocs = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/knowledge/list');
      const data = await res.json();
      if (data.success) {
        setDocs(data.docs);
      } else {
        throw new Error(data.error || 'Failed to fetch');
      }
    } catch (err: any) {
      console.error(err);
      setMessage({ type: 'error', text: 'ไม่สามารถโหลดรายการเอกสารได้: ' + err.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  // Handle File Input Change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type !== 'application/pdf' && !selectedFile.name.toLowerCase().endsWith('.pdf')) {
        setMessage({ type: 'error', text: 'กรุณาอัปโหลดไฟล์ PDF เท่านั้น' });
        setFile(null);
        return;
      }
      setFile(selectedFile);
      setMessage(null);
    }
  };

  // Handle Upload Submission
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', category);

    try {
      const res = await fetch('/api/knowledge/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        setMessage({ type: 'success', text: 'อัปโหลดและวิเคราะห์เอกสาร PDF เรียบร้อยแล้ว!' });
        setFile(null);
        // Clear file input
        const fileInput = document.getElementById('pdf-file-input') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
        
        // Refresh docs
        await fetchDocs();
      } else {
        throw new Error(data.error || 'เกิดข้อผิดพลาดในการวิเคราะห์เอกสาร');
      }
    } catch (err: any) {
      console.error(err);
      setMessage({ type: 'error', text: err.message || 'ไม่สามารถอัปโหลดไฟล์ได้' });
    } finally {
      setUploading(false);
    }
  };

  // Handle Delete Document
  const handleDelete = async (docId: string, title: string) => {
    if (!confirm(`คุณต้องการลบเอกสาร "${title}" และล้างข้อมูล Vector Chunks ทั้งหมดใช่หรือไม่?`)) return;

    try {
      const res = await fetch('/api/knowledge/list', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: docId }),
      });

      const data = await res.json();
      if (data.success) {
        setDocs(prev => prev.filter(d => d.id !== docId));
        setMessage({ type: 'success', text: 'ลบข้อมูลสำเร็จ' });
      } else {
        throw new Error(data.error || 'ลบไม่สำเร็จ');
      }
    } catch (err: any) {
      console.error(err);
      setMessage({ type: 'error', text: 'เกิดข้อผิดพลาดในการลบ: ' + err.message });
    }
  };

  // Filter & Search Documents
  const filteredDocs = useMemo(() => {
    return docs.filter(d => {
      const matchesSearch = d.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === 'all' || d.category === filterCategory;
      return matchesSearch && matchesCategory;
    });
  }, [docs, searchTerm, filterCategory]);

  return (
    <div className="min-h-screen bg-[#f7f4ef] text-[#1a1209] font-sans antialiased">
      {/* Container */}
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight flex items-center gap-2.5 text-slate-900">
              <BookOpen className="text-[#b8924a]" size={32} />
              AI Knowledge Base (RAG)
            </h1>
            <p className="text-sm font-semibold text-[#6b5e4a] mt-1.5 opacity-80">
              ระบบนำเข้าข้อมูลและคลังความรู้เชิงลึกของแบรนด์ เพื่อเป็นฐานข้อมูลอ้างอิงให้ AI Coach (น้องยูนิ)
            </p>
          </div>
        </header>

        {/* Grid Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left: Upload Form */}
          <div className="bg-white border border-[#e8e2d9] rounded-[2rem] p-6 shadow-sm">
            <h3 className="text-lg font-black mb-4 text-slate-800 flex items-center gap-2">
              <Upload className="text-[#b8924a]" size={20} />
              นำเข้าไฟล์ความรู้ (PDF)
            </h3>

            {message && (
              <div className={`p-4 rounded-2xl mb-5 text-xs font-bold flex items-start gap-2 animate-pulse ${
                message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                {message.type === 'success' ? <CheckCircle size={16} className="shrink-0 mt-0.5" /> : <AlertTriangle size={16} className="shrink-0 mt-0.5" />}
                <span>{message.text}</span>
              </div>
            )}

            <form onSubmit={handleUpload} className="space-y-5">
              <div>
                <label className="block text-[10px] font-black text-[#6b5e4a] uppercase tracking-wider mb-2">
                  หมวดหมู่ความรู้
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as KnowledgeDoc['category'])}
                  className="w-full px-4 py-3 bg-[#f4f2ee] border border-[#d6cfc4] rounded-xl focus:border-[#b8924a] outline-none font-bold text-sm"
                >
                  {Object.entries(CATEGORY_LABELS).map(([key, val]) => (
                    <option key={key} value={key}>{val}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black text-[#6b5e4a] uppercase tracking-wider mb-2">
                  ไฟล์ PDF เอกสาร
                </label>
                <div className="border-2 border-dashed border-[#d6cfc4] hover:border-[#b8924a] rounded-2xl p-6 text-center cursor-pointer transition-colors relative group">
                  <input
                    id="pdf-file-input"
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <FileText className="mx-auto text-[#9a8a72] group-hover:text-[#b8924a] mb-2 transition-colors" size={40} />
                  <p className="text-xs font-black text-slate-800">
                    {file ? file.name : 'เลือกไฟล์ PDF หรือลากไฟล์มาวางที่นี่'}
                  </p>
                  <p className="text-[10px] text-[#9a8a72] mt-1.5 font-bold">
                    {file ? `${(file.size / (1024 * 1024)).toFixed(2)} MB` : 'จำกัดไฟล์ไม่เกิน 15MB'}
                  </p>
                </div>
              </div>

              <button
                type="submit"
                disabled={uploading || !file}
                className="w-full bg-[#b8924a] hover:bg-[#a37e39] disabled:bg-[#d6cfc4] text-white py-3.5 px-4 rounded-xl font-bold text-sm shadow-sm transition-colors flex items-center justify-center gap-2"
              >
                {uploading ? (
                  <>
                    <Loader2 className="animate-spin" size={16} />
                    กำลังประมวลผล PDF...
                  </>
                ) : (
                  <>
                    ⚡ วิเคราะห์และบันทึกเวกเตอร์
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right: Documents List */}
          <div className="lg:col-span-2 space-y-5">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 justify-between items-center bg-white border border-[#e8e2d9] rounded-[1.5rem] p-4 shadow-sm">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9a8a72]" size={16} />
                <input
                  type="text"
                  placeholder="ค้นหาชื่อเอกสาร..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-[#f4f2ee] border border-[#d6cfc4] rounded-xl focus:border-[#b8924a] outline-none text-xs font-semibold"
                />
              </div>

              <div className="flex gap-2 w-full sm:w-auto">
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-3 py-2 bg-[#f4f2ee] border border-[#d6cfc4] rounded-xl focus:border-[#b8924a] outline-none text-xs font-bold text-[#6b5e4a]"
                >
                  <option value="all">ทุกหมวดหมู่</option>
                  {Object.entries(CATEGORY_LABELS).map(([key, val]) => (
                    <option key={key} value={key}>{val}</option>
                  ))}
                </select>

                <button
                  onClick={fetchDocs}
                  className="px-3 py-2 border border-[#d6cfc4] hover:bg-[#f4f2ee] rounded-xl text-xs font-bold transition-colors"
                >
                  รีเฟรช
                </button>
              </div>
            </div>

            {/* List Table */}
            <div className="bg-white border border-[#e8e2d9] rounded-[2rem] overflow-hidden shadow-sm">
              {loading ? (
                <div className="p-12 text-center text-[#9a8a72] font-semibold flex flex-col items-center gap-2">
                  <Loader2 className="animate-spin text-[#b8924a]" size={36} />
                  <span>กำลังโหลดข้อมูลคลังความรู้...</span>
                </div>
              ) : filteredDocs.length === 0 ? (
                <div className="p-12 text-center text-[#9a8a72] font-semibold italic">
                  ไม่มีรายการเอกสารความรู้ในระบบ
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-[#f4f2ee] border-b border-[#e8e2d9] text-[10px] font-black text-[#6b5e4a] uppercase tracking-wider">
                        <th className="px-5 py-4 w-12 text-center">ลำดับ</th>
                        <th className="px-5 py-4">ชื่อเอกสาร PDF</th>
                        <th className="px-5 py-4 w-28">หมวดหมู่</th>
                        <th className="px-5 py-4 w-20 text-center">Chunks</th>
                        <th className="px-5 py-4 w-24 text-center">สถานะ</th>
                        <th className="px-5 py-4 w-16 text-center">จัดการ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e8e2d9]">
                      {filteredDocs.map((doc, idx) => (
                        <tr key={doc.id} className="hover:bg-[#fcfbf9] transition-colors">
                          <td className="px-5 py-4 text-center font-bold text-[#9a8a72]">{idx + 1}</td>
                          <td className="px-5 py-4">
                            <div className="font-bold text-slate-800 line-clamp-1 flex items-center gap-1.5" title={doc.title}>
                              <FileText size={14} className="text-red-500 shrink-0" />
                              {doc.title}
                            </div>
                            {doc.file_size && (
                              <span className="text-[10px] text-[#9a8a72] font-bold block mt-0.5">
                                ขนาด: {(doc.file_size / (1024 * 1024)).toFixed(2)} MB • {new Date(doc.created_at).toLocaleDateString('th-TH')}
                              </span>
                            )}
                          </td>
                          <td className="px-5 py-4">
                            <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 border rounded-full ${
                              CATEGORY_COLORS[doc.category] || CATEGORY_COLORS.general
                            }`}>
                              {CATEGORY_LABELS[doc.category] || 'ทั่วไป'}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-center font-bold font-mono text-[#6b5e4a]">
                            {doc.chunk_count}
                          </td>
                          <td className="px-5 py-4 text-center">
                            <span className={`inline-block text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                              doc.status === 'indexed' ? 'bg-green-100 text-green-800' :
                              doc.status === 'processing' ? 'bg-blue-100 text-blue-800 animate-pulse' :
                              doc.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {doc.status === 'indexed' && '✓ Indexed'}
                              {doc.status === 'processing' && '⚡ Processing'}
                              {doc.status === 'pending' && '⏳ Pending'}
                              {doc.status === 'error' && '⚠️ Error'}
                            </span>
                            {doc.error_msg && (
                              <span className="block text-[8px] text-red-500 line-clamp-1 mt-0.5" title={doc.error_msg}>
                                {doc.error_msg}
                              </span>
                            )}
                          </td>
                          <td className="px-5 py-4 text-center">
                            <button
                              onClick={() => handleDelete(doc.id, doc.title)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded-lg transition-colors inline-block"
                              title="ลบเอกสาร"
                            >
                              <Trash2 size={15} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
