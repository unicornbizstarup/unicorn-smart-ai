// src/app/(admin)/admin/products/page.tsx
export const runtime = "edge";
import { createServiceSupabase } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import Link from "next/link";
import type { Product } from "@/types/index";
import { toggleProductActive } from "./actions";

export const metadata = { title: "Products — Admin" };

export default async function AdminProductsPage() {
  const supabase = createServiceSupabase();
  const { data: products } = await supabase
    .from("products")
    .select("*, category:product_categories(name)")
    .order("sort_order", { ascending: true });

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-bold text-2xl text-text-primary">Products</h1>
          <p className="text-sm text-text-muted mt-0.5">
            {products?.length ?? 0} รายการ
          </p>
        </div>
        <Link href="/admin/products/new" className="btn-gold text-sm">
          + เพิ่มสินค้า
        </Link>
      </div>

      {/* Table */}
      <div className="bg-bg-card border border-border-default rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border-default bg-[#faf8f4] text-[11px]
                           font-bold text-text-muted uppercase tracking-wider">
              <th className="text-left px-4 py-3">สินค้า</th>
              <th className="text-left px-4 py-3">หมวดหมู่</th>
              <th className="text-right px-4 py-3">สมาชิก</th>
              <th className="text-right px-4 py-3">ปลีก</th>
              <th className="text-right px-4 py-3">กำไร</th>
              <th className="text-right px-4 py-3">PV</th>
              <th className="text-center px-4 py-3">สถานะ</th>
              <th className="text-center px-4 py-3">จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {(products ?? []).map((p) => {
              const product = p as Product & { category: { name: string } };
              const profit  = product.retail_price - product.member_price;
              return (
                <tr key={product.id}
                    className="border-b border-border-muted hover:bg-[#faf8f4] transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {product.image_url ? (
                        <img src={product.image_url} alt={product.name}
                             className="w-9 h-9 rounded-lg object-cover flex-shrink-0" />
                      ) : (
                        <div className="w-9 h-9 rounded-lg bg-[#f4f2ee] flex items-center
                                        justify-center text-lg flex-shrink-0">📦</div>
                      )}
                      <div>
                        <p className="font-bold text-text-primary">{product.name}</p>
                        <p className="text-xs text-text-muted line-clamp-1">{product.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-text-secondary">
                    {product.category?.name ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-right text-text-secondary">
                    ฿{product.member_price.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right text-text-secondary">
                    ฿{product.retail_price.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-brand-gold">
                    ฿{profit.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right text-text-secondary">
                    {product.pv}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <form action={async () => {
                      "use server";
                      await toggleProductActive(product.id, !product.is_active);
                    }}>
                      <button type="submit"
                              className={`text-xs font-bold px-2.5 py-1 rounded-md ${
                                product.is_active
                                  ? "bg-green-100 text-green-700"
                                  : "bg-gray-100 text-gray-500"
                              }`}>
                        {product.is_active ? "Active" : "Hidden"}
                      </button>
                    </form>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Link href={`/admin/products/${product.id}`}
                          className="text-xs font-bold text-brand-gold hover:underline">
                      แก้ไข
                    </Link>
                  </td>
                </tr>
              );
            })}
            {(!products || products.length === 0) && (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-text-muted">
                  ยังไม่มีสินค้า — กด "+ เพิ่มสินค้า" เพื่อเริ่มต้น
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
