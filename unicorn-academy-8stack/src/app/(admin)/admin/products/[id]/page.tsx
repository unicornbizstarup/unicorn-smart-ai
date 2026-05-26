// src/app/(admin)/admin/products/[id]/page.tsx
import { createServiceSupabase } from "@/lib/supabase-server";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import type { Product, ProductCategory } from "@/types/index";
import ProductForm from "../ProductForm";
import { updateProduct, deleteProduct, getProduct } from "../actions";
import type { ProductFormData } from "../actions";

export const metadata = { title: "แก้ไขสินค้า — Admin" };

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) notFound();

  const supabase = createServiceSupabase();
  const { data: categories } = await supabase
    .from("product_categories")
    .select("*")
    .eq("is_active", true)
    .order("sort_order");

  async function handleUpdate(data: ProductFormData) {
    "use server";
    await updateProduct(id, data);
    redirect("/admin/products");
  }

  async function handleDelete() {
    "use server";
    await deleteProduct(id);
    redirect("/admin/products");
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/products"
              className="text-sm text-text-muted hover:text-text-primary">
          ← กลับ
        </Link>
        <h1 className="font-display font-bold text-xl text-text-primary">แก้ไขสินค้า</h1>
      </div>
      <ProductForm
        product={product}
        categories={(categories ?? []) as ProductCategory[]}
        onSave={handleUpdate}
        onDelete={handleDelete}
      />
    </div>
  );
}
