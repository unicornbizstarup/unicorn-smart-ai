import { useState, useMemo } from "react";
import { useLoaderData, Link } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { ChevronLeft, Search } from "lucide-react";
import { createServerSupabase, requireUser } from "@/lib/supabase-server";
import type { Profile } from "@/types";
import MemberLayout from "@/components/layout/MemberLayout";

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

export function meta() {
  return [
    { title: "คลังความรู้และสื่อการตลาด — Unicorn Academy" },
    { name: "description", content: "คลังสื่อการสอนและเครื่องมือทางการตลาดเพื่อยกระดับนักธุรกิจมืออาชีพ" },
  ];
}

export async function loader({ request }: LoaderFunctionArgs) {
  const responseHeaders = new Headers();
  const { user, supabase } = await requireUser(request, responseHeaders);

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single<Profile>();

  return { profile };
}

export default function MemberKnowledgePage() {
  const { profile } = useLoaderData<typeof loader>();

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedFormat, setSelectedFormat] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredItems = useMemo(() => {
    return KNOWLEDGE_ITEMS.filter((item) => {
      const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
      const matchesFormat = selectedFormat === "all" || item.format === selectedFormat;
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesFormat && matchesSearch;
    });
  }, [selectedCategory, selectedFormat, searchQuery]);

  return (
    <MemberLayout
      profile={profile}
      title="Knowledge Library"
      subtitle="คลังสื่อการสอนและเครื่องมือทางการตลาดเพื่อยกระดับนักธุรกิจมืออาชีพ"
    >
      <div className="space-y-6 max-w-5xl font-body text-text-primary">
        {/* Navigation Header */}
        <div className="flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-1.5 text-text-secondary hover:text-brand-gold font-semibold text-xs transition-colors">
            <ChevronLeft size={16} />
            <span>กลับหน้าแดชบอร์ด</span>
          </Link>
          <span className="text-brand-gold font-bold tracking-wider text-[10px] uppercase bg-brand-gold-light/40 px-3 py-1 rounded-full border border-brand-gold-muted/20">
            Knowledge Catalog
          </span>
        </div>

        {/* Search and Filters Card */}
        <div className="bg-white border border-border-default rounded-3xl p-5 shadow-sm space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted w-4.5 h-4.5" />
            <input
              className="w-full pl-11 pr-4 py-3 bg-bg-input border border-border-strong rounded-xl focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none font-medium text-xs sm:text-sm text-text-primary"
              placeholder="ค้นหาเอกสาร STP สไลด์สอน คลิป หรือสื่อประชาสัมพันธ์..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Dual Filter Rows */}
          <div className="space-y-4 pt-2">
            {/* Category Filter */}
            <div className="space-y-1.5">
              <div className="text-[10px] font-bold text-text-muted uppercase tracking-wider">หมวดหมู่เนื้อหา</div>
              <div className="flex gap-2 overflow-x-auto pb-1.5 no-scrollbar">
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
                    className={`px-4.5 py-1.5 rounded-full text-xs font-bold transition-all border shrink-0 ${
                      selectedCategory === cat.id
                        ? "bg-brand-gold text-white border-brand-gold shadow-sm"
                        : "bg-white text-text-secondary border-border-strong hover:bg-bg-hover hover:border-brand-gold-muted"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Media Format Filter */}
            <div className="space-y-1.5">
              <div className="text-[10px] font-bold text-text-muted uppercase tracking-wider">รูปแบบสื่อ</div>
              <div className="flex gap-2 overflow-x-auto pb-1.5 no-scrollbar">
                {[
                  { id: "all", label: "📁 ทุกรูปแบบ" },
                  { id: "pdf", label: "📄 PDF" },
                  { id: "video", label: "🎬 วิดีโอ" },
                  { id: "image", label: "🖼️ รูปภาพ" },
                  { id: "link", label: "🔗 ลิงก์" }
                ].map((fmt) => (
                  <button
                    key={fmt.id}
                    onClick={() => setSelectedFormat(fmt.id)}
                    className={`px-4.5 py-1.5 rounded-full text-xs font-bold transition-all border shrink-0 ${
                      selectedFormat === fmt.id
                        ? "bg-brand-dark text-white border-brand-dark shadow-sm"
                        : "bg-white text-text-secondary border-border-strong hover:bg-bg-hover hover:border-brand-gold-muted"
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
        <div className="grid grid-cols-1 gap-4">
          {filteredItems.map((item) => (
            <div key={item.id} className="card-premium bg-white border border-border-default rounded-3xl overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
              {/* Top Preview */}
              <div className="bg-bg-input h-28 relative flex items-center justify-center border-b border-border-default select-none">
                <span className="absolute top-4 right-4 text-[9px] font-black uppercase tracking-widest text-text-muted">
                  {item.formatLabel}
                </span>
                
                <div className="w-11 h-11 rounded-2xl bg-white border border-border-default shadow-sm flex items-center justify-center text-xl">
                  {item.icon}
                </div>
              </div>

              {/* Content Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-bold text-xs sm:text-sm text-text-primary leading-snug">{item.title}</h3>
                  <p className="text-xs text-text-secondary mt-1.5 leading-relaxed line-clamp-2">{item.description}</p>
                </div>

                {/* Card Footer */}
                <div className="flex items-center justify-between pt-3.5 border-t border-border-default">
                  <span className="text-[10px] font-black text-brand-gold uppercase tracking-wider">
                    {item.categoryLabel}
                  </span>

                  <button
                    onClick={() => alert(`กำลังเปิด/ดาวน์โหลด: ${item.title}`)}
                    className="bg-brand-dark hover:bg-black text-white text-xs font-bold px-4 py-2 rounded-xl border-none transition-colors flex items-center gap-1.5 shadow-sm"
                  >
                    {item.format === "pdf" ? "⬇ ดาวน์โหลด" : item.format === "video" ? "▶ รับชม" : "📂 เปิดดู"}
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredItems.length === 0 && (
            <div className="col-span-full bg-white border border-border-default rounded-3xl p-12 text-center text-text-muted italic">
              ไม่พบสื่อการสอนหรือเอกสารคู่มือที่ตรงกับการค้นหาของคุณ
            </div>
          )}
        </div>
      </div>
    </MemberLayout>
  );
}
