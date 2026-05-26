// src/app/(admin)/admin/products/actions.ts
"use server";
import { createServiceSupabase } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";
import type { Product } from "@/types/index";

export type ProductFormData = {
  category_id:    string;
  name:           string;
  description:    string;
  member_price:   number;
  retail_price:   number;
  pv:             number;
  image_url:      string;
  ingredients:    string[];
  highlights:     string[];
  selling_points: string[];
  u_selling_msg:  string;
  usage_guide:    string;
  package_size:   string;
  is_active:      boolean;
  is_featured:    boolean;
  sort_order:     number;
};

export async function getProducts(): Promise<Product[]> {
  const supabase = createServiceSupabase();
  const { data, error } = await supabase
    .from("products")
    .select("*, category:product_categories(id,name,slug)")
    .order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as Product[];
}

export async function getProduct(id: string): Promise<Product | null> {
  const supabase = createServiceSupabase();
  const { data } = await supabase
    .from("products")
    .select("*, category:product_categories(id,name,slug)")
    .eq("id", id)
    .single<Product>();
  return data;
}

export async function createProduct(data: ProductFormData): Promise<{ id: string }> {
  const supabase = createServiceSupabase();
  const { data: product, error } = await supabase
    .from("products")
    .insert({ ...data, updated_at: new Date().toISOString() })
    .select("id")
    .single();
  if (error) throw new Error(error.message);
  revalidatePath("/admin/products");
  revalidatePath("/products");
  return product;
}

export async function updateProduct(id: string, data: Partial<ProductFormData>): Promise<void> {
  const supabase = createServiceSupabase();
  const { error } = await supabase
    .from("products")
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${id}`);
  revalidatePath("/products");
}

export async function deleteProduct(id: string): Promise<void> {
  const supabase = createServiceSupabase();
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/products");
  revalidatePath("/products");
}

export async function toggleProductActive(id: string, is_active: boolean): Promise<void> {
  const supabase = createServiceSupabase();
  await supabase.from("products").update({ is_active }).eq("id", id);
  revalidatePath("/admin/products");
}
