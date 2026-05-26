"use client";
import { useState } from "react";
import type { Profile } from "@/types";

interface KnowledgeItem {
  id: string;
  title: string;
  description: string;
  category: "teaching" | "docs" | "marketing" | "shorts";
  categoryLabel: string;
  format: "pdf" | "video" | "image" | "link";
  formatLabel: string;
  icon: string;
  badgeBg: string;
  url: string;
}

const KNOWLEDGE_ITEMS: KnowledgeItem[] = [
  {
    id: "k-1",
    title: "สไลด์เปิดโอกาสทางธุรกิจ (STP)",
    description: "ชุดสไลด์นำเสนอธุรกิจฉบับมาตรฐานสำหรับแนะนำพันธมิตร Unicorn",
    category: "teaching",
    categoryLabel: "สื่อการสอน",
    format: "pdf",
    formatLabel: "PDF",
    icon: "📄",
    badgeBg: "bg-red-50 text-red-700 border-red-200",
    url: "#"
  },
  {
    id: "k-2",
    title: "วิดีโอเจาะลึกระบบแผน 5 รายได้",
    description: "วิดีโอเจาะลึกวิธีการคำนวณและสร้างรายได้ระยะยาวโดย Diamond Master",
    category: "teaching",
    categoryLabel: "สื่อการสอน",
    format: "video",
    formatLabel: "วิดีโอ",
    icon: "🎬",
    badgeBg: "bg-blue-50 text-blue-700 border-blue-200",
    url: "#"
  },
  {
    id: "k-3",
    title: "แผนยุทธศาสตร์ธุรกิจ 3 ปี Unicorn",
    description: "เอกสารคู่มือแนวทางการวางแผนขยายฐานผู้บริโภคและสร้าง Passive Income",
    category: "docs",
    categoryLabel: "เอกสารการเรียนรู้",
    format: "pdf",
    formatLabel: "PDF",
    icon: "📑",
    badgeBg: "bg-amber-50 text-[#7a4e10] border-amber-200",
    url: "#"
  },
  {
    id: "k-4",
    title: "คลิปสั้นโปรโมท Social Media Kit",
    description: "คลิปพร้อมใช้งานสำหรับนำไปแชร์ดึงดูดผู้มุ่งหวังบน TikTok / Reels / Shorts",
    category: "marketing",
    categoryLabel: "สื่อการตลาด",
    format: "video",
    formatLabel: "วิดีโอ",
    icon: "📱",
    badgeBg: "bg-green-50 text-green-700 border-green-200",
    url: "#"
  },
  {
    id: "k-5",
    title: "รีวิวผลลัพธ์จากผู้ใช้จริง MINA S",
    description: "ชุดรูปภาพและประโยคคำอธิบายสำหรับโปรโมตผลิตภัณฑ์ลดไขมันช่องท้อง",
    category: "marketing",
    categoryLabel: "สื่อการตลาด",
    format: "image",
    formatLabel: "รูปภาพ",
    icon: "🖼️",
    badgeBg: "bg-[#f0eeff] text-[#7c3aed] border-[#dbeafe]",
    url: "#"
  },
  {
    id: "k-6",
    title: "แนวทางการพูด STP (STP Speaking Script)",
    description: "บทพูดสคริปต์ทีละหน้าสำหรับสมาชิกระดับเริ่มต้นฝึกพูดแบ่งปันโอกาส",
    category: "teaching",
    categoryLabel: "สื่อการสอน",
    format: "link",
    formatLabel: "ลิงก์ภายนอก",
    icon: "🔗",
    badgeBg: "bg-teal-50 text-teal-700 border-teal-200",
    url: "#"
  }
];

export default function KnowledgeClient() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedFormat, setSelectedFormat] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Filter items
  const filteredItems = KNOWLEDGE_ITEMS.filter((item) => {
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    const matchesFormat = selectedFormat === "all" || item.format === selectedFormat;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesFormat && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Search and Category Filters */}
      <div className="bg-white border border-[#e8e2d9] rounded-2xl p-5 shadow-sm space-y-4">
        {/* Search */}
        <input
          className="field-input w-full px-4 py-2 border border-[#d6cfc4] rounded-lg focus:outline-none"
          placeholder="🔍 ค้นหาเอกสาร STP สไลด์สอน คลิป หรือสื่อประชาสัมพันธ์..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {/* Dual Filter Rows */}
        <div className="space-y-3 pt-2">
          {/* Content Type Filter */}
          <div>
            <div className="text-[10px] font-bold text-[#9a8a72] uppercase tracking-wider mb-2">หมวดหมู่เนื้อหา</div>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
              {[
                { id: "all", label: "⊞ ทุกหมวดหมู่" },
                { id: "teaching", label: "▶ สื่อการสอน" },
                { id: "docs", label: "📋 เอกสารการเรียนรู้" },
                { id: "marketing", label: "🛒 สื่อการตลาด" },
                { id: "shorts", label: "🎬 คลิปสั้น" }
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${
                    selectedCategory === cat.id ? "bg-[#1a1209] text-white border-[#1a1209]" : "bg-white text-[#6b5e4a] border-[#e8e2d9] hover:bg-[#faf5ec]"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Media Format Filter */}
          <div>
            <div className="text-[10px] font-bold text-[#9a8a72] uppercase tracking-wider mb-2">รูปแบบสื่อ</div>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
              {[
                { id: "all", label: "📁 ทุกรูปแบบ" },
                { id: "pdf", label: "📄 PDF" },
                { id: "video", label: "🎬 วิดีโอ" },
                { id: "image", label: "🖼️ รูปภาพ" },
                { id: "link", label: "🔗 ลิงก์ภายนอก" }
              ].map((fmt) => (
                <button
                  key={fmt.id}
                  onClick={() => setSelectedFormat(fmt.id)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${
                    selectedFormat === fmt.id ? "bg-[#b8924a] text-white border-[#b8924a]" : "bg-white text-[#6b5e4a] border-[#e8e2d9] hover:bg-[#faf5ec]"
                  }`}
                >
                  {fmt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Knowledge Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredItems.map((item) => (
          <div key={item.id} className="bg-white border border-[#e8e2d9] rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            {/* Top Preview */}
            <div className="bg-[#faf8f4] h-24 relative flex items-center justify-center border-b border-[#e8e2d9]">
              <span className="absolute top-3 right-3 text-[9px] font-black uppercase tracking-widest text-[#9a8a72]">
                {item.formatLabel}
              </span>
              
              <div className="w-10 h-10 rounded-xl bg-white shadow-sm border border-[#e8e2d9] flex items-center justify-center text-xl">
                {item.icon}
              </div>
            </div>

            {/* Content Body */}
            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <h3 className="font-bold text-xs sm:text-sm text-[#1a1209] leading-snug">{item.title}</h3>
                <p className="text-[11px] sm:text-xs text-[#9a8a72] mt-1 leading-relaxed line-clamp-2">{item.description}</p>
              </div>

              {/* Card Footer */}
              <div className="flex items-center justify-between pt-2 border-t border-[#f0ebe3]">
                <span className="text-[10px] font-bold text-[#9a8a72] uppercase tracking-wider">
                  {item.categoryLabel}
                </span>

                <button
                  onClick={() => alert(`กำลังเปิด/ดาวน์โหลด: ${item.title}`)}
                  className={`btn-sm-action text-[11px] font-bold px-3 py-1.5 rounded-lg border transition-colors flex items-center gap-1 bg-[#1a1209] hover:bg-black text-white`}
                >
                  {item.format === "pdf" ? "⬇ ดาวน์โหลด" : item.format === "video" ? "▶ รับชม" : "📂 เปิดดู"}
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredItems.length === 0 && (
          <div className="col-span-full bg-white border border-[#e8e2d9] rounded-2xl p-8 text-center text-[#9a8a72] italic">
            ไม่พบสื่อหรือเอกสารคู่มือที่ตรงกับการค้นหาของคุณ
          </div>
        )}
      </div>
    </div>
  );
}
