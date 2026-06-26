import { useState, useMemo } from "react";
import { useLoaderData, useNavigate } from "react-router";
import type { LoaderFunctionArgs, ActionFunctionArgs } from "react-router";
import { createServiceSupabase, requireUser } from "@/lib/supabase-server";
import type { ProductCategory } from "@/types";
import AdminLayout from "@/components/layout/AdminLayout";

export function meta() {
  return [
    { title: "จัดการหมวดหมู่สินค้า — Admin Panel" },
  ];
}

export async function loader({ request }: LoaderFunctionArgs) {
  const responseHeaders = new Headers();
  const { user } = await requireUser(request, responseHeaders);

  const supabase = createServiceSupabase();
  const { data: categories } = await supabase
    .from("product_categories")
    .select("*")
    .order("sort_order", { ascending: true });

  return {
    userEmail: user.email || "admin@unicorn.com",
    categories: (categories || []) as ProductCategory[],
  };
}

export async function action({ request }: ActionFunctionArgs) {
  await requireUser(request);
  const method = request.method;
  const supabase = createServiceSupabase();

  if (method === "DELETE") {
    const data = await request.json();
    const { error } = await supabase
      .from("product_categories")
      .delete()
      .eq("id", data.id);

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 400 });
    }
    return { success: true };
  }

  // Handle Create (POST) & Update (PUT)
  const data = await request.json();

  if (method === "POST") {
    const { error } = await supabase
      .from("product_categories")
      .insert({
        name: data.name,
        slug: data.slug,
        sort_order: data.sort_order,
        is_active: data.is_active,
        banner_url: data.banner_url || null,
        icon_url: data.icon_url || null,
      });

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 400 });
    }
    return { success: true };
  }

  if (method === "PUT") {
    const { error } = await supabase
      .from("product_categories")
      .update({
        name: data.name,
        slug: data.slug,
        sort_order: data.sort_order,
        is_active: data.is_active,
        banner_url: data.banner_url || null,
        icon_url: data.icon_url || null,
      })
      .eq("id", data.id);

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 400 });
    }
    return { success: true };
  }

  return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
}

export default function AdminCategoriesPage() {
  const { userEmail, categories: initialCategories } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  const [categories, setCategories] = useState<ProductCategory[]>(initialCategories);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
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
      const res = await fetch("/admin/categories", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          name: categories.find(c => c.id === id)?.name || "",
          slug: categories.find(c => c.id === id)?.slug || "",
          sort_order: categories.find(c => c.id === id)?.sort_order || 0,
          is_active: !currentStatus,
        }),
      });

      if (!res.ok) throw new Error("บันทึกการเปลี่ยนสถานะล้มเหลว");

      setCategories(prev =>
        prev.map(c => c.id === id ? { ...c, is_active: !currentStatus } : c)
      );
    } catch (err: any) {
      alert(err.message || "ไม่สามารถเปลี่ยนสถานะได้");
    }
  };

  const handleDelete = async (id: string, catName: string) => {
    if (!confirm(`คุณแน่ใจหรือไม่ที่จะลบหมวดหมู่ "${catName}"?`)) return;
    try {
      const res = await fetch("/admin/categories", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) throw new Error("การลบล้มเหลว");

      setCategories(prev => prev.filter(c => c.id !== id));
      if (editingId === id) cancelEdit();
    } catch (err: any) {
      alert(err.message || "เกิดข้อผิดพลาดในการลบ");
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
      id: editingId || undefined,
      name,
      slug,
      sort_order: Number(sortOrder),
      is_active: isActive,
      banner_url: bannerUrl,
      icon_url: iconUrl,
    };

    try {
      const res = await fetch("/admin/categories", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "เกิดข้อผิดพลาดในการบันทึก");
      }

      if (editingId) {
        setCategories(prev =>
          prev.map(c => c.id === editingId ? { ...c, ...payload, id: c.id } : c)
        );
        cancelEdit();
      } else {
        // Reload page to refresh data in server loader state
        navigate("/admin/categories", { replace: true });
        window.location.reload();
      }
    } catch (err: any) {
      setError(err.message || "เกิดข้อผิดพลาด");
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    return categories.filter(c => 
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.slug.toLowerCase().includes(search.toLowerCase())
    );
  }, [categories, search]);

  return (
    <AdminLayout userEmail={userEmail}>
      <div className="space-y-6 max-w-5xl font-body text-text-primary">
        {/* Header */}
        <div className="mb-6">
          <h1 className="font-display font-bold text-2xl text-text-primary">Product Categories</h1>
          <p className="text-xs text-text-muted mt-1.5">
            จัดการกลุ่มและหมวดหมู่สินค้าสำหรับการแสดงผลในหน้าร้าน สิทธิ์สมาชิก และ RAG AI System
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* List of Categories */}
          <div className="lg:col-span-2 space-y-4">
            {/* Search */}
            <div className="flex items-center justify-between gap-3">
              <input
                type="text"
                placeholder="ค้นหาหมวดหมู่สินค้า..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full max-w-sm px-4 py-2.5 bg-white border border-border-strong rounded-xl focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none font-medium text-xs text-text-primary"
              />
              <span className="text-xs text-text-muted font-bold shrink-0">
                พบ {filtered.length} รายการ
              </span>
            </div>

            {/* Table */}
            <div className="bg-white border border-border-default rounded-3xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-border-default bg-bg-input text-[10px] font-bold text-text-muted uppercase tracking-wider select-none">
                      <th className="px-5 py-4 text-center w-16">ลำดับ</th>
                      <th className="px-5 py-4">ชื่อหมวดหมู่</th>
                      <th className="px-5 py-4">Slug Key</th>
                      <th className="px-5 py-4 text-center">สถานะการแสดง</th>
                      <th className="px-5 py-4 text-right">เครื่องมือจัดการ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-muted">
                    {filtered.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-5 py-8 text-center text-text-muted italic select-none">
                          ไม่พบหมวดหมู่สินค้าในระบบ
                        </td>
                      </tr>
                    ) : (
                      filtered
                        .sort((a, b) => a.sort_order - b.sort_order)
                        .map((cat) => (
                          <tr 
                            key={cat.id} 
                            className={`hover:bg-bg-hover/30 transition-colors ${
                              editingId === cat.id ? "bg-brand-gold-light/20" : ""
                            }`}
                          >
                            <td className="px-5 py-3 text-center font-bold text-text-secondary font-mono">
                              {cat.sort_order}
                            </td>
                            <td className="px-5 py-3">
                              <div className="font-bold text-text-primary flex items-center gap-2">
                                {cat.icon_url ? (
                                  <span className="text-base select-none">{cat.icon_url}</span>
                                ) : (
                                  <span className="text-base select-none">🏷️</span>
                                )}
                                <span>{cat.name}</span>
                              </div>
                            </td>
                            <td className="px-5 py-3 font-mono text-[11px] text-text-secondary">
                              {cat.slug}
                            </td>
                            <td className="px-5 py-3 text-center">
                              <button
                                type="button"
                                onClick={() => handleToggleActive(cat.id, cat.is_active)}
                                className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg border transition-all ${
                                  cat.is_active 
                                    ? "bg-emerald-50 border-emerald-100 text-emerald-700 hover:bg-emerald-100" 
                                    : "bg-bg-input border-border-strong text-text-muted hover:bg-white"
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
          </div>

          {/* Form Card */}
          <div className="bg-white border border-border-default rounded-3xl p-5 shadow-sm space-y-4">
            <h3 className="font-display font-bold text-base text-text-primary flex items-center gap-2 select-none">
              <span>{editingId ? "✏️ แก้ไขหมวดหมู่" : "➕ เพิ่มหมวดหมู่ใหม่"}</span>
            </h3>

            {error && (
              <div className="p-3 bg-red-50 text-red-700 border border-red-100 rounded-xl text-xs font-bold animate-pulse">
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-text-muted uppercase tracking-wider mb-1.5 select-none">
                  ชื่อหมวดหมู่
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="เช่น HEALTH CARE"
                  className="w-full px-4 py-2.5 bg-bg-input border border-border-strong rounded-xl focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none font-bold text-xs sm:text-sm text-text-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-text-muted uppercase tracking-wider mb-1.5 select-none">
                  Slug (URL Key)
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="เช่น health-care"
                  className="w-full px-4 py-2.5 bg-bg-input border border-border-strong rounded-xl focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none font-mono text-xs text-text-primary"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-text-muted uppercase tracking-wider mb-1.5 select-none">
                    ลำดับจัดเรียง
                  </label>
                  <input
                    type="number"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(Number(e.target.value))}
                    className="w-full px-4 py-2.5 bg-bg-input border border-border-strong rounded-xl focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none font-bold text-xs sm:text-sm text-text-primary"
                    min={0}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-text-muted uppercase tracking-wider mb-1.5 select-none">
                    ไอคอนแสดงผล
                  </label>
                  <input
                    type="text"
                    value={iconUrl}
                    onChange={(e) => setIconUrl(e.target.value)}
                    placeholder="เช่น 🫀 หรือ 🧬"
                    className="w-full px-4 py-2.5 bg-bg-input border border-border-strong rounded-xl focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none font-bold text-xs sm:text-sm text-text-primary text-center"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-text-muted uppercase tracking-wider mb-1.5 select-none">
                  ลิงก์ภาพแบนเนอร์ (ถ้ามี)
                </label>
                <input
                  type="url"
                  value={bannerUrl}
                  onChange={(e) => setBannerUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-4 py-2.5 bg-bg-input border border-border-strong rounded-xl focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none font-semibold text-xs text-text-secondary"
                />
              </div>

              <div className="flex items-center gap-2 py-1.5 select-none">
                <input
                  type="checkbox"
                  id="isActiveCheck"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4.5 h-4.5 rounded text-brand-gold focus:ring-brand-gold cursor-pointer"
                />
                <label htmlFor="isActiveCheck" className="text-xs font-bold text-text-secondary cursor-pointer">
                  เปิดใช้งานหมวดหมู่ทันที (Active)
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 btn-gold py-2.5 shadow-sm text-xs font-bold"
                >
                  {loading ? "กำลังบันทึก..." : editingId ? "บันทึกการแก้ไข" : "เพิ่มหมวดหมู่ใหม่"}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="btn-outline px-4 text-xs font-bold border-border-strong text-text-secondary hover:bg-bg-hover"
                  >
                    ยกเลิก
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
