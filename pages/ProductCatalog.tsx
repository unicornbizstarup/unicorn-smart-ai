import React, { useState } from 'react';
import {
    Search,
    Filter,
    Zap,
    Bot,
    GraduationCap,
    ChevronRight,
    ShoppingBag,
    Star,
    CheckCircle2,
    FlaskConical,
    Target,
    Activity,
    Package
} from 'lucide-react';
import { AppView } from '../types';

interface Product {
    id: number;
    name: string;
    category: string;
    description: string;
    price_member: number;
    price_retail: number;
    pv: number;
    benefits: string;
    ingredients: string;
    marketing_points: string;
    usage_step?: number;
    packaging: string;
    how_to_use: string;
}

// Data extracted from product_schema.sql
const PRODUCTS: Product[] = [
    {
        id: 111,
        name: 'DEEZE SHOT GLUCONA',
        category: 'Health Care',
        description: 'อินซูลินธรรมชาติแบบช็อต ดูแลระดับน้ำตาลและพลังงานชีวิต',
        price_member: 1250,
        price_retail: 1590,
        pv: 100,
        benefits: 'ลดภาวะดื้ออินซูลิน ชะลอการดูดซึมน้ำตาล',
        ingredients: 'FIR Technology, มะระขี้นก, อบเชย, Resveratrol, Chromium, Vit B Complex',
        marketing_points: 'นวัตกรรม FIR เพิ่มการดูดซึม ละลายไวไม่ต้องชง 0% Sugar',
        packaging: '30 ซอง',
        how_to_use: 'วันละ 1-2 ซอง ก่อนอาหาร 15-30 นาที'
    },
    {
        id: 125,
        name: 'DEEZE SHOT CHOLESSNA',
        category: 'Health Care',
        description: 'ช็อตดูแลหัวใจและหลอดเลือด ลดไขมันเลว',
        price_member: 1250,
        price_retail: 1590,
        pv: 100,
        benefits: 'ลด LDL/ไตรกลีเซอไรด์ เพิ่ม HDL ช่วยการไหลเวียนเลือด',
        ingredients: 'สารสกัดกระเทียม (Allicin), CoQ10, Hawthorn, สารสกัดเมล็ดองุ่น',
        marketing_points: 'เกราะป้องกันหลอดเลือด ดูแลลึกถึงระดับเซลล์ รสทับทิมทานง่าย',
        packaging: '30 ซอง',
        how_to_use: 'วันละ 1 ซอง หลังอาหารมื้อหลัก'
    },
    {
        id: 139,
        name: 'DEEZE SHOT IMUNA',
        category: 'Health Care',
        description: 'สูตรฟื้นฟูภูมิคุ้มกันเชิงลึก เสริมปราการป้องกันเชื้อโรค',
        price_member: 1250,
        price_retail: 1590,
        pv: 100,
        benefits: 'เสริมสร้างภูมิคุ้มกันตั้งแต่ระดับเซลล์',
        ingredients: 'กระชายขาว, เบต้ากลูแคน, Zinc, Selenium, Vit B, C, D3, E',
        marketing_points: 'ช็อตเดียวสู้เชื้อโรค ผสานสมุนไพรไทยและสารสกัดสากลกว่า 16 ชนิด',
        packaging: '30 ซอง',
        how_to_use: 'วันละ 1 ซอง'
    },
    {
        id: 167,
        name: 'MINA S',
        category: 'Health Care',
        description: 'นวัตกรรมลดไขมันช่องท้องจากเกาหลี',
        price_member: 1250,
        price_retail: 1590,
        pv: 100,
        benefits: 'ลดไขมันช่องท้อง ปรับระบบเผาผลาญ ไม่ใจสั่น',
        ingredients: 'นวัตกรรม OB-X (เลม่อนบาล์ม, หม่อน, โกฐจุฬาลัมพา), L-Phenylalanine',
        marketing_points: 'ลดไขมันช่องท้องสูงสุด 20% ใน 12 สัปดาห์ มีงานวิจัย RCT รองรับ ปลอดภัยต่อตับ',
        packaging: '20 แคปซูล',
        how_to_use: '1 เม็ด ก่อนอาหาร 20-30 นาที'
    },
    {
        id: 223,
        name: 'U TENA',
        category: 'Health Care',
        description: 'ดูแลดวงตา ปกป้องสายตาจากแสงหน้าจอ แสงแดด และอนุมูลอิสระ',
        price_member: 1250,
        price_retail: 1650,
        pv: 100,
        benefits: 'เห็นชัดขึ้น ลดความเสี่ยงต้อกระจก เหมาะกับทุกเพศทุกวัย',
        ingredients: 'ลูทีน, ซีแซนทีน, บิลเบอร์รี่, วิตามินเอ',
        marketing_points: 'บำรุงลึก เห็นชัด ลดแห้ง ลดเมื่อยล้าได้จริง',
        packaging: '30 ซอฟต์เจล',
        how_to_use: 'วันละ 2 ซอฟต์เจล ก่อนอาหารเช้า'
    },
    {
        id: 96,
        name: 'U Dental Premium Diamond Herbal',
        category: 'Personal Care',
        description: 'ยาสีฟันสมุนไพรพรีเมียมออกแบบตามหลักทันตกรรม',
        price_member: 250,
        price_retail: 350,
        pv: 50,
        benefits: 'ดูแล 6 กลไก: ลดกลิ่นปาก/คราบ/แบคทีเรีย/เสียวฟัน/ฟันสะอาด/เหงือกแข็งแรง',
        ingredients: 'Diamond Powder, Potassium Nitrate, Guava Leaf, Green Tea, Hyaluronic Acid',
        marketing_points: 'ยาสีฟันผสมผงเพชร - ขัดฟันเงาแบบพรีเมียมโดยไม่ทำลายเคลือบฟัน',
        packaging: '80 กรัม',
        how_to_use: 'แปรงฟันอย่างน้อย 2 นาที วันละ 2 ครั้ง'
    },
    {
        id: 39,
        name: 'U CAYLA Peptide Hydrate White Facial Foam',
        category: 'Skin care',
        description: 'โฟมล้างหน้าทำความสะอาดล้ำลึกและเติมความชุ่มชื้น',
        price_member: 450,
        price_retail: 590,
        pv: 50,
        benefits: 'ผิวไม่แห้งตึง รักษา pH',
        ingredients: 'Neoclair Pro, White Tea, Pentavitin',
        marketing_points: 'มากกว่าแค่ล้างหน้า ผิวอิ่มน้ำทันที',
        packaging: '100 กรัม',
        how_to_use: 'ล้างหน้าเช้า-เย็น'
    }
];

const CATEGORIES = ['All', 'Health Care', 'Skin care', 'Personal Care', 'Agriculture', 'Technology'];

const ProductCatalog: React.FC<{ onNavigate: (view: AppView) => void }> = ({ onNavigate }) => {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const filteredProducts = PRODUCTS.filter(p => {
        const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.category.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="space-y-8 pb-20 animate-fade-in">
            {/* --- Header & Search --- */}
            <div className="bg-dark-gradient rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl border border-white/10">
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="space-y-4 text-center md:text-left">
                        <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight">
                            คลังข้อมูล <span className="text-amber-400">สินค้า</span>
                        </h1>
                        <p className="text-indigo-100/70 text-base md:text-lg max-w-xl font-medium">
                            เรียนรู้ข้อมูลเชิงลึก จุดเด่น และวิธีใช้ เพื่อการเป็นที่ปรึกษาธุรกิจมืออาชีพ
                        </p>
                    </div>
                    <div className="w-full md:w-96 relative group">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-amber-400 transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="ค้นหาสินค้า หรือ หมวดหมู่..."
                            className="w-full pl-14 pr-6 py-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl focus:ring-4 focus:ring-amber-500/30 outline-none transition-all font-bold text-white placeholder:text-white/40"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* --- Category Filter --- */}
            <div className="flex overflow-x-auto gap-3 no-scrollbar pb-2">
                {CATEGORIES.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`
                            px-6 py-3 rounded-full text-sm font-black whitespace-nowrap transition-all
                            ${selectedCategory === cat
                                ? 'bg-slate-900 text-white shadow-xl scale-105'
                                : 'bg-white text-slate-500 border border-slate-200 hover:border-amber-400 hover:text-amber-600'}
                        `}
                    >
                        {cat === 'All' ? 'ทั้งหมด' : cat}
                    </button>
                ))}
            </div>

            {/* --- Product Grid --- */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                    <div
                        key={product.id}
                        className="glass-card rounded-[2.5rem] border border-white/60 shadow-xl overflow-hidden group hover:-translate-y-2 transition-all duration-500 hover:shadow-2xl flex flex-col"
                    >
                        <div className="p-8 space-y-6 flex-1">
                            <div className="flex justify-between items-start">
                                <span className="bg-amber-100 text-amber-700 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">{product.category}</span>
                                <div className="flex flex-col items-end">
                                    <span className="text-xs font-black text-slate-400 uppercase tracking-tighter">PV</span>
                                    <span className="text-xl font-black text-slate-900 leading-none">{product.pv}</span>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xl md:text-2xl font-black text-slate-900 group-hover:text-amber-600 transition-colors">{product.name}</h3>
                                <p className="text-slate-500 text-sm font-bold mt-2 line-clamp-2">{product.description}</p>
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                <div className="bg-slate-50 p-3 rounded-2xl text-center shadow-inner">
                                    <p className="text-[10px] font-black text-slate-400 uppercase">สมาชิก</p>
                                    <p className="text-sm font-black text-slate-900">฿{product.price_member.toLocaleString()}</p>
                                </div>
                                <div className="bg-slate-50 p-3 rounded-2xl text-center shadow-inner">
                                    <p className="text-[10px] font-black text-slate-400 uppercase">ปลีก</p>
                                    <p className="text-sm font-black text-slate-900">฿{product.price_retail.toLocaleString()}</p>
                                </div>
                                <div className="bg-amber-50 p-3 rounded-2xl text-center shadow-inner">
                                    <p className="text-[10px] font-black text-amber-600 uppercase">กำไร</p>
                                    <p className="text-sm font-black text-emerald-600">฿{(product.price_retail - product.price_member).toLocaleString()}</p>
                                </div>
                            </div>
                        </div>

                        <div className="px-8 pb-8 pt-2">
                            <button
                                onClick={() => setSelectedProduct(product)}
                                className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 group-hover:bg-amber-500 group-hover:text-slate-950 transition-all shadow-lg active:scale-95"
                            >
                                <Zap size={18} /> ดูจุดขายและส่วนประกอบ
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* --- Detailed Product Modal --- */}
            {selectedProduct && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[3rem] shadow-3xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-500 border border-white/20">
                        {/* Modal Header */}
                        <div className="p-8 md:p-10 bg-dark-gradient text-white flex justify-between items-center shrink-0">
                            <div>
                                <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest mb-2 inline-block">Product Details</span>
                                <h2 className="text-2xl md:text-3xl font-black tracking-tight">{selectedProduct.name}</h2>
                            </div>
                            <button
                                onClick={() => setSelectedProduct(null)}
                                className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
                            >
                                <ChevronRight size={28} className="rotate-180 translate-x-[-1px]" />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="flex-1 overflow-y-auto p-8 md:p-12 space-y-12">
                            <div className="grid md:grid-cols-2 gap-10">
                                {/* Left Side: Ingredients & High Product UI */}
                                <div className="space-y-8">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3 text-amber-600">
                                            <FlaskConical size={24} />
                                            <h4 className="text-xl font-black uppercase tracking-tight">ส่วนประกอบสำคัญ</h4>
                                        </div>
                                        <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 shadow-inner">
                                            <p className="text-slate-700 font-bold leading-relaxed">{selectedProduct.ingredients}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3 text-indigo-600">
                                            <Package size={24} />
                                            <h4 className="text-xl font-black uppercase tracking-tight">บรรจุและวิธีใช้</h4>
                                        </div>
                                        <div className="p-6 bg-indigo-50/50 rounded-[2rem] border border-indigo-100 shadow-inner space-y-4">
                                            <div className="flex justify-between items-center border-b border-indigo-100/50 pb-2">
                                                <span className="text-indigo-900/60 font-black text-xs uppercase tracking-widest">ขนาดบรรจุ</span>
                                                <span className="text-indigo-900 font-black">{selectedProduct.packaging}</span>
                                            </div>
                                            <div className="space-y-1">
                                                <span className="text-indigo-900/60 font-black text-xs uppercase tracking-widest">วิธีใช้</span>
                                                <p className="text-indigo-900 font-bold">{selectedProduct.how_to_use}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Side: Highlights & Marketing */}
                                <div className="space-y-8">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3 text-emerald-600">
                                            <Target size={24} />
                                            <h4 className="text-xl font-black uppercase tracking-tight">จุดเด่น / ประสิทธิภาพ</h4>
                                        </div>
                                        <div className="p-6 bg-emerald-50 rounded-[2rem] border border-emerald-100 shadow-inner">
                                            <p className="text-emerald-900 font-bold leading-relaxed">{selectedProduct.benefits}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3 text-blue-600">
                                            <Star size={24} className="fill-blue-600" />
                                            <h4 className="text-xl font-black uppercase tracking-tight">จุดขายทางการตลาด (U-Selling)</h4>
                                        </div>
                                        <div className="p-6 bg-blue-50/50 rounded-[2rem] border border-blue-100 shadow-inner relative overflow-hidden group">
                                            <p className="text-blue-900 font-black text-lg leading-snug italic relative z-10">"{selectedProduct.marketing_points}"</p>
                                            <Zap size={80} className="absolute -bottom-4 -right-4 text-blue-200/30 rotate-12" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* CTAs */}
                            <div className="pt-8 border-t border-slate-100 grid md:grid-cols-2 gap-4">
                                <button
                                    onClick={() => onNavigate(AppView.AI_COACH)}
                                    className="bg-slate-900 text-white p-5 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-slate-800 transition-all hover:scale-[1.02] shadow-xl group"
                                >
                                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-amber-400 group-hover:scale-110 group-hover:rotate-6 transition-all">
                                        <Bot size={24} />
                                    </div>
                                    ปรึกษาแนวทางการตลาดกับ "น้องยูนิ"
                                </button>
                                <button
                                    onClick={() => onNavigate(AppView.SYSTEM_456)}
                                    className="bg-amber-500 text-slate-950 p-5 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-amber-400 transition-all hover:scale-[1.02] shadow-xl group"
                                >
                                    <div className="w-10 h-10 bg-slate-950/10 rounded-xl flex items-center justify-center text-slate-950 group-hover:scale-110 group-hover:rotate-6 transition-all">
                                        <GraduationCap size={24} />
                                    </div>
                                    เรียนรู้ทักษะที่เกี่ยวข้องสไตล์ 456
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductCatalog;
