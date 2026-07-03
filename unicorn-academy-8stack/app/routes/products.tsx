import { useState, useMemo } from "react";
import { useLoaderData, Link } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { ChevronLeft, Search } from "lucide-react";
import { createServerSupabase, requireUser } from "@/lib/supabase-server";
import type { Profile, Product, ProductCategory } from "@/types";
import MemberLayout from "@/components/layout/MemberLayout";

export function meta() {
  return [
    { title: "คลังสินค้าและนวัตกรรม — Unicorn Smart AI" },
    { name: "description", content: "คลังสินค้าพาร์ทเนอร์และตารางวิเคราะห์คำนวณกำไรสมาชิก" },
  ];
}

export async function loader({ request }: LoaderFunctionArgs) {
  const responseHeaders = new Headers();
  const { user, supabase } = await requireUser(request, responseHeaders);

  // Fetch logged in profile for MemberLayout
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single<Profile>();

  // Fetch product categories
  const { data: categories } = await supabase
    .from("product_categories")
    .select("*")
    .eq("is_active", true)
    .order("sort_order");

  // Fetch products joined with category details
  const { data: products } = await supabase
    .from("products")
    .select("*, category:product_categories(id,name,slug)")
    .eq("is_active", true)
    .order("sort_order");

  return {
    profile,
    categories: (categories || []) as ProductCategory[],
    products: (products || []) as Product[],
  };
}

export default function MemberProductsPage() {
  const { profile, categories, products } = useLoaderData<typeof loader>();

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

  const displayProducts = products.length > 0 ? products : mockProducts;

  const filteredProducts = useMemo(() => {
    return displayProducts.filter((product) => {
      const matchesCategory = selectedCat === "all" || product.category_id === selectedCat || (product.category as any)?.slug === selectedCat;
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            product.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [displayProducts, selectedCat, searchQuery]);

  return (
    <MemberLayout
      profile={profile}
      title="Product Library"
      subtitle="คลังสินค้าและนวัตกรรมเพื่อสุขภาพความงาม พร้อมตารางวิเคราะห์คำนวณกำไรสมาชิก"
    >
      <div className="space-y-6 max-w-5xl font-body text-text-primary">
        {/* Navigation Header */}
        <div className="flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-1.5 text-text-secondary hover:text-brand-gold font-semibold text-xs transition-colors">
            <ChevronLeft size={16} />
            <span>กลับหน้าแดชบอร์ด</span>
          </Link>
          <span className="text-brand-gold font-bold tracking-wider text-[10px] uppercase bg-brand-gold-light/40 px-3 py-1 rounded-full border border-brand-gold-muted/20">
            Products Catalog
          </span>
        </div>

        {/* Search and Filters Card */}
        <div className="bg-white border border-border-default rounded-3xl p-5 shadow-sm space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted w-4.5 h-4.5" />
            <input
              className="w-full pl-11 pr-4 py-3 bg-bg-input border border-border-strong rounded-xl focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none font-medium text-xs sm:text-sm text-text-primary"
              placeholder="ค้นหาสินค้า จุดขาย หรือส่วนประกอบสำคัญ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Category Filters */}
          <div className="space-y-2">
            <div className="text-[10px] font-bold text-text-muted uppercase tracking-wider">กลุ่มสินค้า</div>
            <div className="flex gap-2 overflow-x-auto pb-1.5 no-scrollbar">
              <button
                onClick={() => setSelectedCat("all")}
                className={`px-4.5 py-1.5 rounded-full text-xs font-bold transition-all border shrink-0 ${
                  selectedCat === "all"
                    ? "bg-brand-gold text-white border-brand-gold shadow-sm"
                    : "bg-white text-text-secondary border-border-strong hover:bg-bg-hover hover:border-brand-gold-muted"
                }`}
              >
                ทั้งหมด
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCat(cat.id)}
                  className={`px-4.5 py-1.5 rounded-full text-xs font-bold transition-all border shrink-0 ${
                    selectedCat === cat.id
                      ? "bg-brand-gold text-white border-brand-gold shadow-sm"
                      : "bg-white text-text-secondary border-border-strong hover:bg-bg-hover hover:border-brand-gold-muted"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
              {categories.length === 0 && (
                <>
                  <button
                    onClick={() => setSelectedCat("cat-1")}
                    className={`px-4.5 py-1.5 rounded-full text-xs font-bold transition-all border shrink-0 ${
                      selectedCat === "cat-1"
                        ? "bg-brand-gold text-white border-brand-gold shadow-sm"
                        : "bg-white text-text-secondary border-border-strong hover:bg-bg-hover hover:border-brand-gold-muted"
                    }`}
                  >
                    Health Care
                  </button>
                  <button
                    onClick={() => setSelectedCat("cat-2")}
                    className={`px-4.5 py-1.5 rounded-full text-xs font-bold transition-all border shrink-0 ${
                      selectedCat === "cat-2"
                        ? "bg-brand-gold text-white border-brand-gold shadow-sm"
                        : "bg-white text-text-secondary border-border-strong hover:bg-bg-hover hover:border-brand-gold-muted"
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
        <div className="grid grid-cols-1 gap-5">
          {filteredProducts.map((p) => {
            const profit = p.retail_price - p.member_price;
            const showDetails = activeDetailsId === p.id;
            return (
              <div key={p.id} className="card-premium bg-white border border-border-default rounded-3xl overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
                {/* Thumbnail Header */}
                <div className="bg-bg-input h-32 relative flex items-center justify-center border-b border-border-default select-none">
                  <div className="absolute top-4 left-4 bg-brand-gold-light/65 text-brand-gold text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-brand-gold-muted/15">
                    {(p.category as any)?.name || "HEALTH CARE"}
                  </div>
                  
                  {p.image_url ? (
                    <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-border-default flex items-center justify-center text-2xl">
                      {p.name.includes("GLUCONA") ? "📄" : p.name.includes("CHOLESSNA") ? "📦" : p.name.includes("MINA S") ? "💊" : "👁️"}
                    </div>
                  )}
                  
                  <div className="absolute top-4 right-4 text-[9px] font-bold text-text-muted uppercase tracking-widest">
                    PDF Product Kit
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 space-y-4">
                  <div>
                    <h3 className="font-bold text-sm text-text-primary leading-snug">{p.name}</h3>
                    <p className="text-xs text-text-muted mt-1 leading-relaxed line-clamp-2">{p.description}</p>
                  </div>

                  {/* Pricing Table */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-bg-input rounded-xl p-2.5 text-center border border-border-default">
                      <div className="text-[9px] text-text-muted font-bold">ราคาสมาชิก</div>
                      <div className="text-xs font-black text-text-primary mt-0.5">฿{p.member_price.toLocaleString()}</div>
                    </div>
                    <div className="bg-bg-input rounded-xl p-2.5 text-center border border-border-default">
                      <div className="text-[9px] text-text-muted font-bold">ราคาขายปลีก</div>
                      <div className="text-xs font-black text-text-primary mt-0.5">฿{p.retail_price.toLocaleString()}</div>
                    </div>
                    <div className="bg-brand-gold-light/40 rounded-xl p-2.5 text-center border border-brand-gold-muted/20">
                      <div className="text-[9px] text-brand-gold font-bold">กำไรสมาชิก</div>
                      <div className="text-xs font-black text-brand-gold mt-0.5">฿{profit.toLocaleString()}</div>
                    </div>
                  </div>

                  {/* Details Section */}
                  {showDetails && (
                    <div className="bg-bg-input rounded-2xl p-4 border border-border-default space-y-3.5 animate-fade-in">
                      {p.u_selling_msg && (
                        <div className="text-xs font-bold text-brand-gold border-l-2 border-brand-gold pl-2.5 italic">
                          "{p.u_selling_msg}"
                        </div>
                      )}
                      
                      {p.highlights && p.highlights.length > 0 && (
                        <div>
                          <div className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">จุดเด่นสำคัญ</div>
                          <ul className="list-disc pl-4 text-xs text-text-secondary space-y-0.5">
                            {p.highlights.map((hl, index) => <li key={index}>{hl}</li>)}
                          </ul>
                        </div>
                      )}

                      {p.ingredients && p.ingredients.length > 0 && (
                        <div>
                          <div className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">ส่วนประกอบหลัก</div>
                          <div className="flex gap-1.5 flex-wrap">
                            {p.ingredients.map((ing, index) => (
                              <span key={index} className="bg-white border border-border-strong text-text-secondary text-[10px] font-bold px-2 py-0.5 rounded-md">
                                {ing}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {p.usage_guide && (
                        <div className="text-[11px] text-text-secondary leading-relaxed pt-1.5 border-t border-border-muted">
                          <strong className="text-text-primary font-bold">วิธีรับประทาน:</strong> {p.usage_guide} · {p.package_size}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Toggle Detail Button */}
                  <button
                    onClick={() => setActiveDetailsId(showDetails ? null : p.id)}
                    className="w-full bg-brand-dark hover:bg-black text-white text-xs font-bold rounded-xl py-3 flex items-center justify-center gap-1.5 transition-colors shadow-sm"
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
    </MemberLayout>
  );
}
