import { createServerSupabase } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import type { Profile, Product, ProductCategory } from "@/types";
import MemberLayout from "@/components/layout/MemberLayout";
import ProductsClient from "./ProductsClient";

export const runtime = "edge";

export default async function MemberProductsPage() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  // Fetch logged in profile for MemberLayout
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single<Profile>();

  // Fetch product categories
  const { data: categories } = await supabase
    .from("product_categories")
    .select("*")
    .eq("is_active", true)
    .order("sort_order");

  // Fetch products joined with category details
  const { data: products } = await supabase
    .from("products")
    .select("*, category:product_categories(id,name,slug)")
    .eq("is_active", true)
    .order("sort_order");

  return (
    <MemberLayout
      profile={profile}
      title="Product Library"
      subtitle="คลังสินค้าและนวัตกรรมเพื่อสุขภาพความงาม พร้อมตารางวิเคราะห์คำนวณกำไรสมาชิก"
    >
      <ProductsClient
        initialProducts={(products ?? []) as Product[]}
        categories={(categories ?? []) as ProductCategory[]}
      />
    </MemberLayout>
  );
}
