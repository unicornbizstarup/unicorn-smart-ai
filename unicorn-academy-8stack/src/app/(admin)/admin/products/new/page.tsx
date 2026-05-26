// src/app/(admin)/admin/products/new/page.tsx
export const runtime = "edge";
import { createServiceSupabase } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import Link from "next/link";
import type { ProductCategory } from "@/types/index";
import ProductForm from "../ProductForm";
import { createProduct } from "../actions";
import type { ProductFormData } from "../actions";

export const metadata = { title: "เพิ่มสินค้า — Admin" };

export default async function NewProductPage() {
  const supabase = createServiceSupabase();
  const { data: categories } = await supabase
    .from("product_categories")
    .select("*")
    .eq("is_active", true)
    .order("sort_order");

  async function handleCreate(data: ProductFormData) {
    "use server";
    await createProduct(data);
    redirect("/admin/products");
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/products"
              className="text-sm text-text-muted hover:text-text-primary">
          ← กลับ
        </Link>
        <h1 className="font-display font-bold text-xl text-text-primary">เพิ่มสินค้าใหม่</h1>
      </div>
      <ProductForm
        categories={(categories ?? []) as ProductCategory[]}
        onSave={handleCreate}
      />
    </div>
  );
}
