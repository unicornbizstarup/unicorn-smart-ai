import React, { useState } from "react";
import type { Product, ProductCategory } from "@/types";

export interface ProductFormData {
  category_id: string;
  name: string;
  description: string;
  member_price: number;
  retail_price: number;
  pv: number;
  image_url: string;
  ingredients: string[];
  highlights: string[];
  selling_points: string[];
  u_selling_msg: string;
  usage_guide: string;
  package_size: string;
  is_active: boolean;
  is_featured: boolean;
  sort_order: number;
}

interface Props {
  product?: Product;
  categories: ProductCategory[];
  onSave: (data: ProductFormData) => void;
  onDelete?: () => void;
  isSubmitting?: boolean;
}

const EMPTY: ProductFormData = {
  category_id: "", name: "", description: "",
  member_price: 0, retail_price: 0, pv: 0,
  image_url: "", ingredients: [], highlights: [],
  selling_points: [], u_selling_msg: "", usage_guide: "",
  package_size: "", is_active: true, is_featured: false, sort_order: 0,
};

export default function ProductForm({ product, categories, onSave, onDelete, isSubmitting = false }: Props) {
  const [form, setForm] = useState<ProductFormData>(product ? {
    category_id:    product.category_id ?? "",
    name:           product.name,
    description:    product.description,
    member_price:   product.member_price,
    retail_price:   product.retail_price,
    pv:             product.pv,
    image_url:      product.image_url ?? "",
    ingredients:    product.ingredients ?? [],
    highlights:     product.highlights ?? [],
    selling_points: product.selling_points ?? [],
    u_selling_msg:  product.u_selling_msg ?? "",
    usage_guide:    product.usage_guide ?? "",
    package_size:   product.package_size ?? "",
    is_active:      product.is_active,
    is_featured:    product.is_featured,
    sort_order:     product.sort_order,
  } : EMPTY);

  const [imgUploading, setImgUploading] = useState(false);

  // Array field helpers
  const addItem = (key: "ingredients" | "highlights" | "selling_points") =>
    setForm(f => ({ ...f, [key]: [...(f[key] as string[]), ""] }));
    
  const updateItem = (key: "ingredients" | "highlights" | "selling_points", i: number, v: string) =>
    setForm(f => ({ ...f, [key]: (f[key] as string[]).map((x, j) => j === i ? v : x) }));
    
  const removeItem = (key: "ingredients" | "highlights" | "selling_points", i: number) =>
    setForm(f => ({ ...f, [key]: (f[key] as string[]).filter((_, j) => j !== i) }));

  // Image upload helper (R2 presigned upload via client API)
  async function handleImageUpload(file: File) {
    setImgUploading(true);
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: file.name, contentType: file.type, folder: "products" }),
      });
      const { uploadUrl, publicUrl } = await res.json() as { uploadUrl: string; publicUrl: string };
      await fetch(uploadUrl, { method: "PUT", body: file, headers: { "Content-Type": file.type } });
      setForm(f => ({ ...f, image_url: publicUrl }));
    } catch (err) {
      console.error("Image upload failed:", err);
      alert("ไม่สามารถอัปโหลดรูปภาพได้ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setImgUploading(false);
    }
  }

  const profit = Number(form.retail_price) - Number(form.member_price);

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12 font-body text-text-primary">
      {/* 1. BASIC INFO */}
      <Section title="ข้อมูลพื้นฐานผลิตภัณฑ์" icon="📦">
        <div className="grid grid-cols-2 gap-4">
          <Field label="หมวดหมู่สินค้า" required className="col-span-2">
            <select
              className="w-full px-4 py-2.5 bg-bg-input border border-border-strong rounded-xl focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none font-bold text-xs sm:text-sm text-text-primary"
              value={form.category_id}
              onChange={e => setForm(f => ({ ...f, category_id: e.target.value }))}>
              <option value="">-- เลือกหมวดหมู่สินค้า --</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </Field>

          <Field label="ชื่อสินค้า" required className="col-span-2">
            <input 
              className="w-full px-4 py-2.5 bg-bg-input border border-border-strong rounded-xl focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none font-bold text-xs sm:text-sm text-text-primary" 
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="เช่น DEEZE SHOT GLUCONA" 
            />
          </Field>

          <Field label="คำอธิบายสรุป" required className="col-span-2">
            <textarea 
              className="w-full px-4 py-2.5 bg-bg-input border border-border-strong rounded-xl focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none font-bold text-xs sm:text-sm text-text-primary" 
              rows={2} 
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="เช่น อินซูลินธรรมชาติแบบช็อต ดูแลระดับน้ำตาล" 
            />
          </Field>
        </div>
      </Section>

      {/* 2. IMAGE */}
      <Section title="รูปภาพสินค้า" icon="🖼️">
        <div className="flex gap-4 items-start flex-col sm:flex-row">
          <div className="w-28 h-28 rounded-2xl bg-bg-input border border-border-default flex items-center justify-center shrink-0 overflow-hidden shadow-inner">
            {form.image_url ? (
              <img src={form.image_url} alt={form.name} className="w-full h-full object-cover animate-fade-in" />
            ) : (
              <span className="text-3xl select-none">📦</span>
            )}
          </div>
          <div className="flex-1 w-full space-y-2.5">
            <label className="block w-full border border-dashed border-border-strong rounded-2xl p-6 text-center cursor-pointer hover:border-brand-gold hover:bg-brand-gold-light/20 transition-all select-none">
              <input type="file" className="hidden" accept="image/*"
                     onChange={e => e.target.files?.[0] && handleImageUpload(e.target.files[0])} />
              <span className="text-xs text-text-secondary font-bold">
                {imgUploading ? "⏳ กำลังอัปโหลดภาพ..." : "คลิกที่นี่เพื่อเลือกอัปโหลดรูปภาพผลิตภัณฑ์"}
              </span>
            </label>
            <input 
              className="w-full px-4 py-2 bg-bg-input border border-border-strong rounded-xl focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none font-semibold text-xs text-text-secondary" 
              value={form.image_url}
              onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))}
              placeholder="หรือ วาง URL ลิงก์รูปภาพจากภายนอกโดยตรงที่นี่" 
            />
          </div>
        </div>
      </Section>

      {/* 3. PRICING */}
      <Section title="ตารางราคาและคะแนน PV" icon="💰">
        <div className="grid grid-cols-3 gap-4">
          <Field label="ราคาสมาชิก (฿)" required>
            <input 
              className="w-full px-4 py-2.5 bg-bg-input border border-border-strong rounded-xl focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none font-bold text-xs sm:text-sm text-text-primary" 
              type="number" min="0" step="0.01"
              value={form.member_price}
              onChange={e => setForm(f => ({ ...f, member_price: +e.target.value }))} 
            />
          </Field>
          <Field label="ราคาขายปลีก (฿)" required>
            <input 
              className="w-full px-4 py-2.5 bg-bg-input border border-border-strong rounded-xl focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none font-bold text-xs sm:text-sm text-text-primary" 
              type="number" min="0" step="0.01"
              value={form.retail_price}
              onChange={e => setForm(f => ({ ...f, retail_price: +e.target.value }))} 
            />
          </Field>
          <Field label="PV คะแนน" required>
            <input 
              className="w-full px-4 py-2.5 bg-bg-input border border-border-strong rounded-xl focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none font-bold text-xs sm:text-sm text-text-primary" 
              type="number" min="0" step="0.01"
              value={form.pv}
              onChange={e => setForm(f => ({ ...f, pv: +e.target.value }))} 
            />
          </Field>
        </div>
        {profit > 0 && (
          <div className="mt-4 bg-brand-gold-light/40 border border-brand-gold-muted/20 rounded-xl px-4 py-3 text-xs text-text-secondary">
            วิเคราะห์กำไรสะสมต่อชิ้น:{" "}
            <strong className="text-brand-gold font-black">
              ฿{profit.toLocaleString("th-TH", { minimumFractionDigits: 2 })}
            </strong>
            {" "}({((profit / Number(form.retail_price)) * 100).toFixed(1)}%)
          </div>
        )}
      </Section>

      {/* 4. DETAILS */}
      <Section title="ข้อมูลคุณลักษณะสินค้าเชิงลึก" icon="🔬">
        <div className="grid grid-cols-2 gap-4">
          <Field label="ขนาดบรรจุภัณฑ์">
            <input 
              className="w-full px-4 py-2.5 bg-bg-input border border-border-strong rounded-xl focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none font-bold text-xs sm:text-sm text-text-primary" 
              value={form.package_size}
              onChange={e => setForm(f => ({ ...f, package_size: e.target.value }))}
              placeholder="เช่น 15 ซอง / กล่อง" 
            />
          </Field>
          <Field label="วิธีรับประทาน / วิธีใช้งาน">
            <input 
              className="w-full px-4 py-2.5 bg-bg-input border border-border-strong rounded-xl focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none font-bold text-xs sm:text-sm text-text-primary" 
              value={form.usage_guide}
              onChange={e => setForm(f => ({ ...f, usage_guide: e.target.value }))}
              placeholder="เช่น วันละ 1 ช็อต ก่อนนอน" 
            />
          </Field>
        </div>

        {/* Ingredients */}
        <ArrayField
          label="ส่วนประกอบสำคัญ"
          items={form.ingredients}
          onAdd={() => addItem("ingredients")}
          onUpdate={(i, v) => updateItem("ingredients", i, v)}
          onRemove={i => removeItem("ingredients", i)}
          placeholder="เช่น Red Yeast Rice, Coenzyme Q10"
        />

        {/* Highlights */}
        <ArrayField
          label="จุดเด่นผลิตภัณฑ์ / สรรพคุณหลัก"
          items={form.highlights}
          onAdd={() => addItem("highlights")}
          onUpdate={(i, v) => updateItem("highlights", i, v)}
          onRemove={i => removeItem("highlights", i)}
          placeholder="เช่น ช่วยบล็อกการสร้างคอเลสเตอรอล"
        />

        {/* Selling Points */}
        <ArrayField
          label="จุดขายทางการตลาด (U-SELLING)"
          items={form.selling_points}
          onAdd={() => addItem("selling_points")}
          onUpdate={(i, v) => updateItem("selling_points", i, v)}
          onRemove={i => removeItem("selling_points", i)}
          placeholder="เช่น นวัตกรรมช็อตเพื่อหัวใจแข็งแรง"
        />

        <Field label="ข้อความโฆษณา U-SELLING หลัก (แสดงใน Sale Page)">
          <input 
            className="w-full px-4 py-2.5 bg-bg-input border border-border-strong rounded-xl focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none font-bold text-xs sm:text-sm text-text-primary" 
            value={form.u_selling_msg}
            onChange={e => setForm(f => ({ ...f, u_selling_msg: e.target.value }))}
            placeholder={`"ล้างท่อเลือดเคลียร์ไขมันเลว ดูแลหัวใจระดับเซลล์"`} 
          />
        </Field>
      </Section>

      {/* 5. SETTINGS */}
      <Section title="การจัดลำดับการแสดงผล" icon="⚙️">
        <div className="grid grid-cols-3 gap-4">
          <Field label="ลำดับแสดง">
            <input 
              className="w-full px-4 py-2.5 bg-bg-input border border-border-strong rounded-xl focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none font-bold text-xs sm:text-sm text-text-primary" 
              type="number" min="0"
              value={form.sort_order}
              onChange={e => setForm(f => ({ ...f, sort_order: +e.target.value }))} 
            />
          </Field>
          
          <div className="flex items-center gap-2 pt-6">
            <input type="checkbox" id="is_active" className="w-4.5 h-4.5 accent-brand-gold cursor-pointer"
              checked={form.is_active}
              onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))} />
            <label htmlFor="is_active" className="text-xs text-text-secondary font-bold cursor-pointer select-none">
              อนุญาตให้แสดงสินค้า
            </label>
          </div>

          <div className="flex items-center gap-2 pt-6">
            <input type="checkbox" id="is_featured" className="w-4.5 h-4.5 accent-brand-gold cursor-pointer"
              checked={form.is_featured}
              onChange={e => setForm(f => ({ ...f, is_featured: e.target.checked }))} />
            <label htmlFor="is_featured" className="text-xs text-text-secondary font-bold cursor-pointer select-none">
              สินค้าแนะนำ (Featured)
            </label>
          </div>
        </div>
      </Section>

      {/* 6. ACTIONS */}
      <div className="flex gap-4">
        <button 
          type="button"
          onClick={() => onSave(form)} 
          disabled={isSubmitting || imgUploading || !form.name || !form.category_id}
          className="flex-1 btn-gold disabled:opacity-50 text-sm font-bold shadow-sm"
        >
          {isSubmitting ? "⏳ กำลังบันทึก..." : product ? "💾 บันทึกการแก้ไข" : "➕ สร้างสินค้าใหม่"}
        </button>

        {onDelete && (
          <button 
            type="button"
            onClick={() => { if (confirm("คุณแน่ใจว่าต้องการลบสินค้านี้ใช่หรือไม่?")) onDelete(); }}
            disabled={isSubmitting}
            className="btn-outline border-red-200 text-red-600 hover:bg-red-50 text-sm font-bold shadow-sm px-6"
          >
            🗑️ ลบสินค้า
          </button>
        )}
      </div>
    </div>
  );
}

// Sub-components
function Section({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-border-default rounded-3xl overflow-hidden shadow-sm">
      <div className="flex items-center gap-2 px-5 py-4 border-b border-border-default bg-bg-input">
        <span className="text-base select-none">{icon}</span>
        <h3 className="font-display font-bold text-sm text-text-primary">{title}</h3>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function Field({ label, required, className, children }: { label: string; required?: boolean; className?: string; children: React.ReactNode }) {
  return (
    <div className={className}>
      <label className="block text-[10px] font-black text-text-muted uppercase tracking-wider mb-2 select-none">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

function ArrayField({ label, items, onAdd, onUpdate, onRemove, placeholder }: {
  label: string; items: string[];
  onAdd: () => void;
  onUpdate: (i: number, v: string) => void;
  onRemove: (i: number) => void;
  placeholder: string;
}) {
  return (
    <div className="mt-4 pt-4 border-t border-border-muted">
      <div className="flex items-center justify-between mb-2">
        <label className="text-[10px] font-black text-text-muted uppercase tracking-wider select-none">
          {label}
        </label>
        <button 
          onClick={onAdd} 
          type="button"
          className="text-[10px] font-black text-brand-gold hover:text-brand-gold-hover transition-colors"
        >
          + เพิ่มรายการ
        </button>
      </div>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex gap-2 animate-fade-in">
            <input 
              className="w-full px-4 py-2 bg-bg-input border border-border-strong rounded-xl focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none font-semibold text-xs text-text-primary" 
              value={item}
              onChange={e => onUpdate(i, e.target.value)}
              placeholder={placeholder} 
            />
            <button 
              onClick={() => onRemove(i)} 
              type="button"
              className="w-8 h-8 shrink-0 bg-bg-input border border-border-strong rounded-xl flex items-center justify-center text-text-muted hover:text-red-600 hover:border-red-200 transition-all text-xs"
            >
              ✕
            </button>
          </div>
        ))}
        {items.length === 0 && (
          <div className="text-xs text-text-muted italic py-1 select-none">
            กด "+ เพิ่มรายการ" เพื่อเพิ่มคุณลักษณะผลิตภัณฑ์
          </div>
        )}
      </div>
    </div>
  );
}
