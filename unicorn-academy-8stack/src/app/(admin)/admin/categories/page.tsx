// src/app/(admin)/admin/categories/page.tsx
import { createServiceSupabase } from "@/lib/supabase-server";
import CategoriesClient from "./CategoriesClient";
import type { ProductCategory } from "@/types/index";

export const metadata = { title: "Categories — Admin Panel" };

export default async function AdminCategoriesPage() {
  const supabase = createServiceSupabase();

  const { data: categories } = await supabase
    .from("product_categories")
    .select("*")
    .order("sort_order", { ascending: true });

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-display font-bold text-2xl text-text-primary">Product Categories</h1>
        <p className="text-sm text-text-muted mt-0.5">
          จัดการกลุ่มและหมวดหมู่สินค้าสำหรับการแสดงผลในหน้าร้านและสิทธิ์ของสมาชิก
        </p>
      </div>

      {/* Main interactive CRUD content */}
      <CategoriesClient initialCategories={(categories ?? []) as ProductCategory[]} />
    </div>
  );
}
