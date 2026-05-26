// src/app/(admin)/admin/products/[id]/page.tsx
import { createServiceSupabase } from "@/lib/supabase-server";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import type { Product, ProductCategory } from "@/types/index";
import ProductForm from "../ProductForm";
import { updateProduct, deleteProduct } from "../actions";
import type { ProductFormData } from "../actions";

interface Props { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const supabase = createServiceSupabase();
  const { data } = await supabase.from("products").select("name").eq("id", id).single();
  return { title: `แก้ไข ${data?.name ?? "สินค้า"} — Admin` };
}

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  const supabase = createServiceSupabase();

  const [{ data: product }, { data: categories }] = await Promise.all([
    supabase.from("products")
      .select("*, category:product_categories(id,name,slug)")
      .eq("id", id).single<Product>(),
    supabase.from("product_categories")
      .select("*").eq("is_active", true).order("sort_order"),
  ]);

  if (!product) notFound();

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
        <div>
          <h1 className="font-display font-bold text-xl text-text-primary">
            แก้ไขสินค้า
          </h1>
          <p className="text-xs text-text-muted">{product.name}</p>
        </div>
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
