"use client";
import { useState } from "react";
import type { Product, ProductCategory } from "@/types";

interface Props {
  initialProducts: Product[];
  categories: ProductCategory[];
}

export default function ProductsClient({ initialProducts, categories }: Props) {
  const [selectedCat, setSelectedCat] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeDetailsId, setActiveDetailsId] = useState<string | null>(null);

  // Fallback mock products if database is currently empty
  const mockProducts: Product[] = [
    {
      id: "mock-1",
      category_id: "cat-1",
      name: "DEEZE SHOT GLUCONA",
      description: "อินซูลินธรรมชาติแบบช็อต ดูแลระดับน้ำตาล",
      member_price: 1250,
      retail_price: 1590,
      pv: 300,
      image_url: null,
      ingredients: ["FIR Technology", "Chromium Picolinate", "Gymnema Sylvestre", "Cinnamon Extract"],
      highlights: ["ช่วยกระตุ้นการหลั่งอินซูลินธรรมชาติ", "ลดภาวะดื้ออินซูลิน", "ลดการดูดซึมน้ำตาลเข้าสู่กระแสเลือด"],
      selling_points: ["นวัตกรรม Shot ดูดซึมไวกว่าแบบเม็ด 10 เท่า", "สะดวกไม่ต้องชง", "น้ำตาล 0% รสมิกซ์เบอร์รี่อร่อยทานง่าย"],
      u_selling_msg: "อินซูลินธรรมชาติ ดูดซึมทันทีไม่ต้องชง ลดน้ำตาลสะสม",
      usage_guide: "ทานวันละ 1 ช็อต ก่อนอาหารเช้า 15 นาที",
      package_size: "15 ซอง / กล่อง",
      is_active: true,
      is_featured: true,
      sort_order: 1,
      created_at: "",
      updated_at: ""
    },
    {
      id: "mock-2",
      category_id: "cat-1",
      name: "DEEZE SHOT CHOLESSNA",
      description: "ช็อตดูแลหัวใจและหลอดเลือด ลดไขมันเลว LDL",
      member_price: 1250,
      retail_price: 1590,
      pv: 300,
      image_url: null,
      ingredients: ["Red Yeast Rice", "Coenzyme Q10", "Phytosterols", "Garlic Extract"],
      highlights: ["ช่วยบล็อกการสร้างคอเลสเตอรอลในตับ", "ทำความสะอาดหลอดเลือด", "เพิ่มระดับไขมันดี HDL"],
      selling_points: ["นวัตกรรมช็อตเพื่อหัวใจแข็งแรง", "รสชาติดี ปราศจากสารเคมีตกค้าง"],
      u_selling_msg: "ล้างท่อเลือดเคลียร์ไขมันเลว ดูแลหัวใจระดับเซลล์",
      usage_guide: "ทานวันละ 1 ช็อต ก่อนนอน",
      package_size: "15 ซอง / กล่อง",
      is_active: true,
      is_featured: true,
      sort_order: 2,
      created_at: "",
      updated_at: ""
    },
    {
      id: "mock-3",
      category_id: "cat-1",
      name: "MINA S",
      description: "นวัตกรรมเบิร์นไขมันช่องท้องและยับยั้งแป้งจากเกาหลี",
      member_price: 890,
      retail_price: 1190,
      pv: 200,
      image_url: null,
      ingredients: ["Garcinia Cambogia", "Green Tea Extract", "L-Carnitine L-Tartrate", "Chitosan"],
      highlights: ["บล็อกการแปลงแป้งและน้ำตาลเป็นไขมันสะสม", "เร่งอัตราการเผาผลาญไขมันช่องท้อง", "คุมหิวอิ่มนาน ปลอดภัย"],
      selling_points: ["นำเข้าจากเกาหลีใต้", "ผสานนวัตกรรมยับยั้งไขมันช่องท้องลึก"],
      u_selling_msg: "เบิร์นไขมันช่องท้องลึก นำเข้าจากเกาหลี คุมหิวอิ่มนาน",
      usage_guide: "ทานวันละ 1-2 แคปซูล ก่อนอาหารกลางวัน 30 นาที",
      package_size: "30 แคปซูล / กล่อง",
      is_active: true,
      is_featured: true,
      sort_order: 3,
      created_at: "",
      updated_at: ""
    },
    {
      id: "mock-4",
      category_id: "cat-1",
      name: "U TENA",
      description: "อาหารเสริมดูแลดวงตา ปกป้องแสงสีฟ้าจากหน้าจอมือถือ",
      member_price: 750,
      retail_price: 990,
      pv: 180,
      image_url: null,
      ingredients: ["Lutein & Zeaxanthin", "Bilberry Extract", "Goji Berry", "Vitamin A"],
      highlights: ["ลดอาการตาแห้ง ล้า พร่ามัว จากการมองจอ", "กรองแสงสีฟ้าอันตราย", "ชะลอการเสื่อมของจอประสาทตา"],
      selling_points: ["สูตรเข้มข้น ลูทีน 20mg ตามเกณฑ์สากล", "บำรุงประสาทตาแบบเร่งด่วน"],
      u_selling_msg: "แว่นตาดิจิทัลกินได้ ปกป้องแสงสีฟ้า คืนตาใสสดชื่น",
      usage_guide: "ทานวันละ 1 แคปซูล หลังอาหารเช้า",
      package_size: "30 แคปซูล / กระปุก",
      is_active: true,
      is_featured: false,
      sort_order: 4,
      created_at: "",
      updated_at: ""
    }
  ];

  // Use DB products if available, otherwise fallback to mock
  const displayProducts = initialProducts.length > 0 ? initialProducts : mockProducts;

  // Filter products based on category and search query
  const filteredProducts = displayProducts.filter((product) => {
    const matchesCategory = selectedCat === "all" || product.category_id === selectedCat || (product.category as any)?.slug === selectedCat;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Search and Category Filters */}
      <div className="bg-white border border-[#e8e2d9] rounded-2xl p-4 shadow-sm space-y-4">
        {/* Search Bar */}
        <div className="flex gap-2">
          <input
            className="field-input flex-1 px-4 py-2 border border-[#d6cfc4] rounded-lg focus:outline-none"
            placeholder="🔍 ค้นหาสินค้า จุดขาย หรือส่วนประกอบสำคัญ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Category Filter Chips */}
        <div>
          <div className="text-[10px] font-bold text-[#9a8a72] uppercase tracking-wider mb-2">กลุ่มสินค้า</div>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
            <button
              onClick={() => setSelectedCat("all")}
              className={`filter-chip px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${
                selectedCat === "all" ? "bg-[#1a1209] text-white border-[#1a1209]" : "bg-white text-[#6b5e4a] border-[#e8e2d9] hover:bg-[#faf5ec]"
              }`}
            >
              ทั้งหมด
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCat(cat.id)}
                className={`filter-chip px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${
                  selectedCat === cat.id ? "bg-[#1a1209] text-white border-[#1a1209]" : "bg-white text-[#6b5e4a] border-[#e8e2d9] hover:bg-[#faf5ec]"
                }`}
              >
                {cat.name}
              </button>
            ))}
            {/* Fallback mock categories if DB empty */}
            {categories.length === 0 && (
              <>
                <button
                  onClick={() => setSelectedCat("cat-1")}
                  className={`filter-chip px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${
                    selectedCat === "cat-1" ? "bg-[#1a1209] text-white border-[#1a1209]" : "bg-white text-[#6b5e4a] border-[#e8e2d9] hover:bg-[#faf5ec]"
                  }`}
                >
                  Health Care
                </button>
                <button
                  onClick={() => setSelectedCat("cat-2")}
                  className={`filter-chip px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${
                    selectedCat === "cat-2" ? "bg-[#1a1209] text-white border-[#1a1209]" : "bg-white text-[#6b5e4a] border-[#e8e2d9] hover:bg-[#faf5ec]"
                  }`}
                >
                  Skin Care
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredProducts.map((p) => {
          const profit = p.retail_price - p.member_price;
          const showDetails = activeDetailsId === p.id;
          return (
            <div key={p.id} className="p2-card bg-white border border-[#e8e2d9] rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              {/* Card Header Thumb */}
              <div className="p2-card-thumb bg-[#faf8f4] h-28 relative flex items-center justify-center border-b border-[#e8e2d9]">
                <div className="absolute top-3 left-3 bg-[#fef3dc] text-[#8a5a00] text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-[#f5e2c0]">
                  {(p.category as any)?.name || "HEALTH CARE"}
                </div>
                
                {/* Thumb Icon/Image */}
                {p.image_url ? (
                  <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-2xl border border-[#e8e2d9]">
                    {p.name.includes("GLUCONA") ? "📄" : p.name.includes("CHOLESSNA") ? "📦" : p.name.includes("MINA S") ? "💊" : "👁️"}
                  </div>
                )}
                
                <div className="absolute top-3 right-3 text-[9px] font-bold text-[#9a8a72] uppercase tracking-widest">
                  PDF Product Kit
                </div>
              </div>

              {/* Card Body */}
              <div className="p2-card-body p-4 space-y-3">
                <div>
                  <h3 className="p2-card-title font-bold text-sm text-[#1a1209] leading-snug">{p.name}</h3>
                  <p className="p2-card-desc text-xs text-[#9a8a72] mt-0.5 leading-relaxed line-clamp-2">{p.description}</p>
                </div>

                {/* Pricing Table */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-[#faf8f4] rounded-lg p-2 text-center border border-[#e8e2d9]">
                    <div className="text-[9px] text-[#9a8a72] font-semibold">ราคาสมาชิก</div>
                    <div className="text-xs font-black text-[#1a1209] mt-0.5">฿{p.member_price.toLocaleString()}</div>
                  </div>
                  <div className="bg-[#faf8f4] rounded-lg p-2 text-center border border-[#e8e2d9]">
                    <div className="text-[9px] text-[#9a8a72] font-semibold">ราคาขายปลีก</div>
                    <div className="text-xs font-black text-[#1a1209] mt-0.5">฿{p.retail_price.toLocaleString()}</div>
                  </div>
                  <div className="bg-[#fef6ea] rounded-lg p-2 text-center border border-[#f5e2c0]">
                    <div className="text-[9px] text-[#b8924a] font-bold">กำไรสะสม</div>
                    <div className="text-xs font-black text-[#b8924a] mt-0.5">฿{profit.toLocaleString()}</div>
                  </div>
                </div>

                {/* Expanded Details Section */}
                {showDetails && (
                  <div className="bg-[#faf8f4] rounded-xl p-3 border border-[#e8e2d9] space-y-3 animate-fade-in">
                    {p.u_selling_msg && (
                      <div className="text-xs font-bold text-[#b8924a] italic border-l-2 border-[#b8924a] pl-2">
                        "{p.u_selling_msg}"
                      </div>
                    )}
                    
                    {p.highlights.length > 0 && (
                      <div>
                        <div className="text-[10px] font-bold text-[#9a8a72] uppercase tracking-wider mb-1">จุดเด่น / ประสิทธิภาพ</div>
                        <ul className="list-disc pl-4 text-xs text-[#6b5e4a] space-y-0.5">
                          {p.highlights.map((hl, index) => <li key={index}>{hl}</li>)}
                        </ul>
                      </div>
                    )}

                    {p.ingredients.length > 0 && (
                      <div>
                        <div className="text-[10px] font-bold text-[#9a8a72] uppercase tracking-wider mb-1">ส่วนประกอบสำคัญ</div>
                        <div className="flex gap-1.5 flex-wrap">
                          {p.ingredients.map((ing, index) => (
                            <span key={index} className="bg-white border border-[#e8e2d9] text-[#6b5e4a] text-[10px] font-semibold px-2 py-0.5 rounded-md">
                              {ing}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {p.usage_guide && (
                      <div className="text-[11px] text-[#6b5e4a] leading-relaxed">
                        <strong className="text-[#1a1209]">วิธีใช้:</strong> {p.usage_guide} · {p.package_size}
                      </div>
                    )}
                  </div>
                )}

                {/* Toggle Detail Button */}
                <button
                  onClick={() => setActiveDetailsId(showDetails ? null : p.id)}
                  className="btn-sm-dark bg-[#1a1209] hover:bg-black text-white text-xs font-bold rounded-lg py-2 w-full flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>⚡</span>
                  {showDetails ? "ซ่อนรายละเอียดและส่วนประกอบ" : "ดูจุดขายและส่วนประกอบสินค้า"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
