import { useState } from "react";
import { useLoaderData, Link, useNavigate } from "react-router";
import type { LoaderFunctionArgs, ActionFunctionArgs } from "react-router";
import { ChevronLeft } from "lucide-react";
import { createServiceSupabase, requireUser } from "@/lib/supabase-server";
import type { Product, ProductCategory } from "@/types";
import AdminLayout from "@/components/layout/AdminLayout";
import ProductForm, { type ProductFormData } from "@/components/admin/ProductForm";

export function meta() {
  return [
    { title: "แก้ไขสินค้า — Admin" },
  ];
}

export async function loader({ params, request }: LoaderFunctionArgs) {
  const { id } = params;
  if (!id) {
    throw new Response("ID not provided", { status: 400 });
  }

  const responseHeaders = new Headers();
  const { user } = await requireUser(request, responseHeaders);

  const supabase = createServiceSupabase();
  
  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single<Product>();

  if (!product) {
    throw new Response("Product not found", { status: 404 });
  }

  const { data: categories } = await supabase
    .from("product_categories")
    .select("*")
    .eq("is_active", true)
    .order("sort_order");

  return {
    userEmail: user.email || "admin@unicorn.com",
    product,
    categories: (categories || []) as ProductCategory[],
    productId: id,
  };
}

export default function AdminEditProductPage() {
  const { userEmail, product, categories, productId } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleUpdate(data: ProductFormData) {
    setIsSubmitting(true);
    try {
      const res = await fetch(`/admin/products/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "เกิดข้อผิดพลาดในการอัปเดตสินค้า");
      }

      navigate("/admin/products");
    } catch (err: any) {
      alert(err.message || "เกิดข้อผิดพลาด");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete() {
    setIsSubmitting(true);
    try {
      const res = await fetch(`/admin/products/${productId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "เกิดข้อผิดพลาดในการลบสินค้า");
      }

      navigate("/admin/products");
    } catch (err: any) {
      alert(err.message || "เกิดข้อผิดพลาด");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AdminLayout userEmail={userEmail}>
      <div className="space-y-6 max-w-4xl font-body text-text-primary">
        {/* Header Navigation */}
        <div className="flex items-center gap-3 mb-6">
          <Link to="/admin/products" className="flex items-center gap-1.5 text-text-secondary hover:text-brand-gold font-semibold text-xs transition-colors">
            <ChevronLeft size={16} />
            <span>กลับหน้ารายการสินค้า</span>
          </Link>
          <span className="w-1 h-4 bg-brand-gold rounded-full" />
          <h1 className="font-display font-bold text-xl text-text-primary">แก้ไขสินค้า</h1>
        </div>

        <ProductForm
          product={product}
          categories={categories}
          onSave={handleUpdate}
          onDelete={handleDelete}
          isSubmitting={isSubmitting}
        />
      </div>
    </AdminLayout>
  );
}

// React Router Action to handle PUT/DELETE edits
export async function action({ request, params }: ActionFunctionArgs) {
  await requireUser(request);
  const { id } = params;
  if (!id) {
    return new Response(JSON.stringify({ error: "ID missing" }), { status: 400 });
  }

  const supabase = createServiceSupabase();

  if (request.method === "DELETE") {
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id);

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 400 });
    }
    return { success: true };
  }

  if (request.method === "PUT") {
    const data = await request.json() as ProductFormData;
    const { error } = await supabase
      .from("products")
      .update({
        category_id: data.category_id,
        name: data.name,
        description: data.description,
        member_price: data.member_price,
        retail_price: data.retail_price,
        pv: data.pv,
        image_url: data.image_url || null,
        ingredients: data.ingredients,
        highlights: data.highlights,
        selling_points: data.selling_points,
        u_selling_msg: data.u_selling_msg || null,
        usage_guide: data.usage_guide || null,
        package_size: data.package_size || null,
        is_active: data.is_active,
        is_featured: data.is_featured,
        sort_order: data.sort_order,
      })
      .eq("id", id);

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 400 });
    }
    return { success: true };
  }

  return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
}
