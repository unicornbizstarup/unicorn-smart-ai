// src/app/(admin)/admin/categories/actions.ts
"use server";
import { createServiceSupabase } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";

export type CategoryFormData = {
  name:       string;
  slug:       string;
  banner_url: string;
  icon_url:   string;
  sort_order: number;
  is_active:  boolean;
};

export async function createCategory(data: CategoryFormData): Promise<void> {
  const supabase = createServiceSupabase();
  const { error } = await supabase
    .from("product_categories")
    .insert(data);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/categories");
  revalidatePath("/admin/products");
  revalidatePath("/products");
}

export async function updateCategory(id: string, data: Partial<CategoryFormData>): Promise<void> {
  const supabase = createServiceSupabase();
  const { error } = await supabase
    .from("product_categories")
    .update(data)
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/categories");
  revalidatePath("/admin/products");
  revalidatePath("/products");
}

export async function deleteCategory(id: string): Promise<void> {
  const supabase = createServiceSupabase();
  const { error } = await supabase
    .from("product_categories")
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/categories");
  revalidatePath("/admin/products");
  revalidatePath("/products");
}

export async function toggleCategoryActive(id: string, is_active: boolean): Promise<void> {
  const supabase = createServiceSupabase();
  const { error } = await supabase
    .from("product_categories")
    .update({ is_active })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/categories");
}
