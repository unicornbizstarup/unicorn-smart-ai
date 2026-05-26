// src/app/(admin)/admin/products/ProductForm.tsx
"use client";
import { useState, useTransition } from "react";
import type { Product, ProductCategory } from "@/types/index";
import type { ProductFormData } from "./actions";

interface Props {
  product?: Product;
  categories: ProductCategory[];
  onSave: (data: ProductFormData) => Promise<void>;
  onDelete?: () => Promise<void>;
}

const EMPTY: ProductFormData = {
  category_id: "", name: "", description: "",
  member_price: 0, retail_price: 0, pv: 0,
  image_url: "", ingredients: [], highlights: [],
  selling_points: [], u_selling_msg: "", usage_guide: "",
  package_size: "", is_active: true, is_featured: false, sort_order: 0,
};

export default function ProductForm({ product, categories, onSave, onDelete }: Props) {
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

  const [saving,  startSave]   = useTransition();
  const [deleting, startDelete] = useTransition();
  const [saved,   setSaved]    = useState(false);
  const [imgUploading, setImgUploading] = useState(false);

  // ── Array field helpers ──
  const addItem    = (key: keyof Pick<ProductFormData,"ingredients"|"highlights"|"selling_points">) =>
    setForm(f => ({ ...f, [key]: [...(f[key] as string[]), ""] }));
  const updateItem = (key: keyof Pick<ProductFormData,"ingredients"|"highlights"|"selling_points">, i: number, v: string) =>
    setForm(f => ({ ...f, [key]: (f[key] as string[]).map((x, j) => j === i ? v : x) }));
  const removeItem = (key: keyof Pick<ProductFormData,"ingredients"|"highlights"|"selling_points">, i: number) =>
    setForm(f => ({ ...f, [key]: (f[key] as string[]).filter((_, j) => j !== i) }));

  // ── Image upload to R2 ──
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
    } finally {
      setImgUploading(false);
    }
  }

  function handleSave() {
    startSave(async () => {
      await onSave(form);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    });
  }

  const profit = Number(form.retail_price) - Number(form.member_price);

  return (
    <div className="max-w-3xl mx-auto space-y-4 pb-8">

      {/* ── BASIC INFO ── */}
      <Section title="ข้อมูลพื้นฐาน" icon="📦">
        <div className="grid grid-cols-2 gap-3">
          <Field label="หมวดหมู่" required className="col-span-2">
            <select
              className="field-input"
              value={form.category_id}
              onChange={e => setForm(f => ({ ...f, category_id: e.target.value }))}>
              <option value="">-- เลือกหมวดหมู่ --</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </Field>

          <Field label="ชื่อสินค้า" required className="col-span-2">
            <input className="field-input" value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="เช่น DEEZE SHOT GLUCONA" />
          </Field>

          <Field label="คำอธิบาย" required className="col-span-2">
            <textarea className="field-input" rows={2} value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="เช่น อินซูลินธรรมชาติแบบช็อต ดูแลระดับน้ำตาล" />
          </Field>
        </div>
      </Section>

      {/* ── IMAGE ── */}
      <Section title="รูปภาพสินค้า" icon="🖼️">
        <div className="flex gap-3 items-start">
          <div className="w-28 h-28 rounded-xl bg-[#f4f2ee] border border-border-default
                          flex items-center justify-center flex-shrink-0 overflow-hidden">
            {form.image_url ? (
              <img src={form.image_url} alt={form.name}
                   className="w-full h-full object-cover" />
            ) : (
              <span className="text-3xl text-text-muted">📦</span>
            )}
          </div>
          <div className="flex-1 space-y-2">
            <label className="block w-full border border-dashed border-border-mid
                              rounded-xl p-4 text-center cursor-pointer
                              hover:border-brand-gold hover:bg-brand-gold-light
                              transition-colors">
              <input type="file" className="hidden" accept="image/*"
                     onChange={e => e.target.files?.[0] && handleImageUpload(e.target.files[0])} />
              <span className="text-sm text-text-secondary font-medium">
                {imgUploading ? "⏳ กำลัง upload..." : "คลิกเพื่อเลือกรูปภาพ (JPG/PNG/WEBP)"}
              </span>
            </label>
            <input className="field-input text-xs" value={form.image_url}
              onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))}
              placeholder="หรือวาง URL รูปภาพโดยตรง" />
          </div>
        </div>
      </Section>

      {/* ── PRICING ── */}
      <Section title="ราคาและ PV" icon="💰">
        <div className="grid grid-cols-3 gap-3">
          <Field label="ราคาสมาชิก (฿)" required>
            <input className="field-input" type="number" min="0" step="0.01"
              value={form.member_price}
              onChange={e => setForm(f => ({ ...f, member_price: +e.target.value }))} />
          </Field>
          <Field label="ราคาปลีก (฿)" required>
            <input className="field-input" type="number" min="0" step="0.01"
              value={form.retail_price}
              onChange={e => setForm(f => ({ ...f, retail_price: +e.target.value }))} />
          </Field>
          <Field label="PV" required>
            <input className="field-input" type="number" min="0" step="0.01"
              value={form.pv}
              onChange={e => setForm(f => ({ ...f, pv: +e.target.value }))} />
          </Field>
        </div>
        {profit > 0 && (
          <div className="mt-2 bg-brand-gold-light border border-brand-gold/30
                          rounded-lg px-3 py-2 text-sm text-text-secondary">
            กำไรต่อชิ้น:{" "}
            <strong className="text-brand-gold">
              ฿{profit.toLocaleString("th-TH", { minimumFractionDigits: 2 })}
            </strong>
            {" "}({((profit / Number(form.retail_price)) * 100).toFixed(1)}%)
          </div>
        )}
      </Section>

      {/* ── DETAILS ── */}
      <Section title="รายละเอียดสินค้า" icon="🔬">
        <div className="grid grid-cols-2 gap-3">
          <Field label="ขนาดบรรจุ">
            <input className="field-input" value={form.package_size}
              onChange={e => setForm(f => ({ ...f, package_size: e.target.value }))}
              placeholder="เช่น 30 ซอง / 60 แคปซูล" />
          </Field>
          <Field label="วิธีใช้">
            <input className="field-input" value={form.usage_guide}
              onChange={e => setForm(f => ({ ...f, usage_guide: e.target.value }))}
              placeholder="เช่น วันละ 1-2 ซอง ก่อนอาหาร" />
          </Field>
        </div>

        {/* Ingredients */}
        <ArrayField
          label="ส่วนประกอบสำคัญ"
          items={form.ingredients}
          onAdd={() => addItem("ingredients")}
          onUpdate={(i, v) => updateItem("ingredients", i, v)}
          onRemove={i => removeItem("ingredients", i)}
          placeholder="เช่น FIR Technology, Chromium, Resveratrol"
        />

        {/* Highlights */}
        <ArrayField
          label="จุดเด่น / ประสิทธิภาพ"
          items={form.highlights}
          onAdd={() => addItem("highlights")}
          onUpdate={(i, v) => updateItem("highlights", i, v)}
          onRemove={i => removeItem("highlights", i)}
          placeholder="เช่น ลดภาวะดื้ออินซูลิน ช่วยดูดซึมน้ำตาล"
        />

        {/* Selling Points */}
        <ArrayField
          label="จุดขายทางการตลาด (U-SELLING)"
          items={form.selling_points}
          onAdd={() => addItem("selling_points")}
          onUpdate={(i, v) => updateItem("selling_points", i, v)}
          onRemove={i => removeItem("selling_points", i)}
          placeholder="เช่น นวัตกรรม FIR เพิ่มการดูดซึม"
        />

        <Field label="ข้อความ U-SELLING หลัก (แสดงใน Sale Page)">
          <input className="field-input" value={form.u_selling_msg}
            onChange={e => setForm(f => ({ ...f, u_selling_msg: e.target.value }))}
            placeholder={`"นวัตกรรม FIR เพิ่มการดูดซึม ละลายไวไม่ต้องชง 0% Sugar"`} />
        </Field>
      </Section>

      {/* ── SETTINGS ── */}
      <Section title="การตั้งค่า" icon="⚙️">
        <div className="grid grid-cols-3 gap-3">
          <Field label="ลำดับแสดง">
            <input className="field-input" type="number" min="0"
              value={form.sort_order}
              onChange={e => setForm(f => ({ ...f, sort_order: +e.target.value }))} />
          </Field>
          <div className="flex items-center gap-2 pt-5">
            <input type="checkbox" id="is_active" className="w-4 h-4 accent-brand-gold"
              checked={form.is_active}
              onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))} />
            <label htmlFor="is_active" className="text-sm text-text-secondary font-medium">
              แสดงสินค้า
            </label>
          </div>
          <div className="flex items-center gap-2 pt-5">
            <input type="checkbox" id="is_featured" className="w-4 h-4 accent-brand-gold"
              checked={form.is_featured}
              onChange={e => setForm(f => ({ ...f, is_featured: e.target.checked }))} />
            <label htmlFor="is_featured" className="text-sm text-text-secondary font-medium">
              สินค้าแนะนำ
            </label>
          </div>
        </div>
      </Section>

      {/* ── ACTIONS ── */}
      <div className="flex gap-3">
        <button onClick={handleSave} disabled={saving || !form.name || !form.category_id}
                className="flex-1 btn-gold disabled:opacity-50 text-sm">
          {saving ? "⏳ กำลังบันทึก..." : saved ? "✓ บันทึกแล้ว!" : product ? "💾 อัพเดทสินค้า" : "➕ เพิ่มสินค้า"}
        </button>

        {onDelete && (
          <button onClick={() => startDelete(async () => { if (confirm("ลบสินค้านี้?")) await onDelete(); })}
                  disabled={deleting}
                  className="btn-outline text-red-600 border-red-300 hover:bg-red-50 text-sm px-4">
            {deleting ? "⏳" : "🗑️ ลบ"}
          </button>
        )}
      </div>
    </div>
  );
}

// ── Sub-components ──
function Section({ title, icon, children }: {
  title: string; icon: string; children: React.ReactNode
}) {
  return (
    <div className="bg-bg-card border border-border-default rounded-xl overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border-muted
                      bg-[#faf8f4]">
        <span className="text-base">{icon}</span>
        <h3 className="font-bold text-sm text-text-primary">{title}</h3>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

function Field({ label, required, className, children }: {
  label: string; required?: boolean; className?: string; children: React.ReactNode
}) {
  return (
    <div className={className}>
      <label className="block text-[10px] font-semibold text-text-muted uppercase
                        tracking-wider mb-1.5">
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
    <div className="mt-3">
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">
          {label}
        </label>
        <button onClick={onAdd} type="button"
                className="text-[10px] font-bold text-brand-gold hover:text-brand-gold-hover">
          + เพิ่ม
        </button>
      </div>
      <div className="space-y-1.5">
        {items.map((item, i) => (
          <div key={i} className="flex gap-2">
            <input className="field-input flex-1 text-xs" value={item}
              onChange={e => onUpdate(i, e.target.value)}
              placeholder={placeholder} />
            <button onClick={() => onRemove(i)} type="button"
                    className="w-7 h-7 flex-shrink-0 bg-[#f4f2ee] border border-border-default
                               rounded-lg flex items-center justify-center text-text-muted
                               hover:text-red-500 hover:border-red-300 text-xs">
              ✕
            </button>
          </div>
        ))}
        {items.length === 0 && (
          <div className="text-xs text-text-muted italic py-1">
            กด + เพิ่ม เพื่อเพิ่มรายการ
          </div>
        )}
      </div>
    </div>
  );
}
