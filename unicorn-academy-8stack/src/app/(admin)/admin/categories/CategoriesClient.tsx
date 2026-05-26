// src/app/(admin)/admin/categories/CategoriesClient.tsx
"use client";

import { useState } from "react";
import type { ProductCategory } from "@/types/index";
import { 
  createCategory, 
  updateCategory, 
  deleteCategory, 
  toggleCategoryActive 
} from "./actions";

interface CategoriesClientProps {
  initialCategories: ProductCategory[];
}

export default function CategoriesClient({ initialCategories }: CategoriesClientProps) {
  const [categories, setCategories] = useState<ProductCategory[]>(initialCategories);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [sortOrder, setSortOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [bannerUrl, setBannerUrl] = useState("");
  const [iconUrl, setIconUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingId) {
      // Auto slug generation
      const autoSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setSlug(autoSlug);
    }
  };

  const startEdit = (cat: ProductCategory) => {
    setEditingId(cat.id);
    setName(cat.name);
    setSlug(cat.slug);
    setSortOrder(cat.sort_order);
    setIsActive(cat.is_active);
    setBannerUrl(cat.banner_url || "");
    setIconUrl(cat.icon_url || "");
    setError("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setName("");
    setSlug("");
    setSortOrder(0);
    setIsActive(true);
    setBannerUrl("");
    setIconUrl("");
    setError("");
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      await toggleCategoryActive(id, !currentStatus);
      setCategories(prev =>
        prev.map(c => c.id === id ? { ...c, is_active: !currentStatus } : c)
      );
    } catch (err) {
      alert("ไม่สามารถเปลี่ยนสถานะได้: " + (err instanceof Error ? err.message : ""));
    }
  };

  const handleDelete = async (id: string, catName: string) => {
    if (!confirm(`คุณแน่ใจหรือไม่ที่จะลบหมวดหมู่ "${catName}"?`)) return;
    try {
      await deleteCategory(id);
      setCategories(prev => prev.filter(c => c.id !== id));
      if (editingId === id) cancelEdit();
    } catch (err) {
      alert("ลบไม่สำเร็จ: " + (err instanceof Error ? err.message : ""));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !slug) {
      setError("กรุณากรอกชื่อและ Slug ให้ครบถ้วน");
      return;
    }
    setLoading(true);
    setError("");

    const payload = {
      name,
      slug,
      sort_order: Number(sortOrder),
      is_active: isActive,
      banner_url: bannerUrl,
      icon_url: iconUrl,
    };

    try {
      if (editingId) {
        await updateCategory(editingId, payload);
        // Refresh categories local state
        setCategories(prev =>
          prev.map(c => c.id === editingId ? { ...c, ...payload } : c)
        );
        cancelEdit();
      } else {
        await createCategory(payload);
        // Hard refresh or re-fetch in real-world, here we just refresh window or reload to get clean state
        window.location.reload();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "เกิดข้อผิดพลาด");
    } finally {
      setLoading(false);
    }
  };

  const filtered = categories.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* ── List of Categories ── */}
      <div className="lg:col-span-2 space-y-4">
        {/* Search */}
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="ค้นหาหมวดหมู่..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="field-input max-w-sm"
          />
          <span className="text-xs text-text-muted">
            พบ {filtered.length} หมวดหมู่
          </span>
        </div>

        {/* Table */}
        <div className="bg-bg-card border border-border-default rounded-2xl overflow-hidden shadow-card">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-border-default bg-[#faf8f4] text-[11px] font-bold text-text-muted uppercase tracking-wider">
                <th className="px-5 py-3.5 text-center w-16">ลำดับ</th>
                <th className="px-5 py-3.5">ชื่อหมวดหมู่</th>
                <th className="px-5 py-3.5">Slug</th>
                <th className="px-5 py-3.5 text-center">สถานะ</th>
                <th className="px-5 py-3.5 text-right">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-text-muted">
                    ไม่พบหมวดหมู่สินค้า
                  </td>
                </tr>
              ) : (
                filtered
                  .sort((a, b) => a.sort_order - b.sort_order)
                  .map((cat) => (
                    <tr 
                      key={cat.id} 
                      className={`border-b border-border-muted hover:bg-[#faf8f4] transition-colors ${
                        editingId === cat.id ? "bg-[#fefaf0]" : ""
                      }`}
                    >
                      <td className="px-5 py-3 text-center font-bold text-text-secondary">
                        {cat.sort_order}
                      </td>
                      <td className="px-5 py-3">
                        <div className="font-bold text-text-primary flex items-center gap-2">
                          {cat.icon_url ? (
                            <span className="text-base">{cat.icon_url}</span>
                          ) : (
                            <span className="text-base text-text-muted">🏷️</span>
                          )}
                          {cat.name}
                        </div>
                      </td>
                      <td className="px-5 py-3 font-mono text-xs text-text-secondary">
                        {cat.slug}
                      </td>
                      <td className="px-5 py-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleActive(cat.id, cat.is_active)}
                          className={`badge font-bold px-2.5 py-0.5 rounded transition-all text-xs ${
                            cat.is_active 
                              ? "bg-green-100 text-green-700 hover:bg-green-200" 
                              : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                          }`}
                        >
                          {cat.is_active ? "Active" : "Hidden"}
                        </button>
                      </td>
                      <td className="px-5 py-3 text-right space-x-3">
                        <button
                          type="button"
                          onClick={() => startEdit(cat)}
                          className="text-xs font-bold text-brand-gold hover:underline"
                        >
                          แก้ไข
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(cat.id, cat.name)}
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

      {/* ── Form Card ── */}
      <div className="bg-bg-card border border-border-default rounded-2xl p-6 shadow-card h-fit sticky top-24">
        <h3 className="font-display font-bold text-lg text-text-primary mb-4 flex items-center gap-2">
          <span>{editingId ? "✏️ แก้ไขหมวดหมู่" : "➕ เพิ่มหมวดหมู่ใหม่"}</span>
        </h3>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-xl text-xs font-medium">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-text-secondary mb-1">
              ชื่อหมวดหมู่
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="เช่น U-LIFE BOOST"
              className="field-input"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-text-secondary mb-1">
              Slug (URL Key)
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="เช่น u-life-boost"
              className="field-input font-mono text-xs"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-text-secondary mb-1">
                ลำดับจัดเรียง
              </label>
              <input
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(Number(e.target.value))}
                className="field-input"
                min={0}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-text-secondary mb-1">
                ไอคอน (Emoji/อักษรย่อ)
              </label>
              <input
                type="text"
                value={iconUrl}
                onChange={(e) => setIconUrl(e.target.value)}
                placeholder="เช่น 🏷️ หรือ 🌟"
                className="field-input text-center"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-text-secondary mb-1">
              ลิงก์แบนเนอร์ (ถ้ามี)
            </label>
            <input
              type="url"
              value={bannerUrl}
              onChange={(e) => setBannerUrl(e.target.value)}
              placeholder="https://..."
              className="field-input text-xs"
            />
          </div>

          <div className="flex items-center gap-2 py-1">
            <input
              type="checkbox"
              id="isActiveCheck"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4 rounded text-brand-gold focus:ring-brand-gold"
            />
            <label htmlFor="isActiveCheck" className="text-xs font-medium text-text-secondary select-none">
              เปิดใช้งานทันที (Active)
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="btn-gold flex-1 justify-center text-center py-2.5 shadow-md"
            >
              {loading ? "กำลังบันทึก..." : editingId ? "บันทึกการแก้ไข" : "เพิ่มหมวดหมู่"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={cancelEdit}
                className="btn-outline justify-center px-4"
              >
                ยกเลิก
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
