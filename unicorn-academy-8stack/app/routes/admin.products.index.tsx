import { createServiceSupabase, requireUser } from "@/lib/supabase-server";
import { useLoaderData, Link, useFetcher } from "react-router";
import type { LoaderFunctionArgs, ActionFunctionArgs } from "react-router";
import type { Product } from "@/types";
import AdminLayout from "@/components/layout/AdminLayout";

export function meta() {
  return [
    { title: "จัดการสินค้า — Admin" },
  ];
}

export async function loader({ request }: LoaderFunctionArgs) {
  const responseHeaders = new Headers();
  const { user } = await requireUser(request, responseHeaders);

  const supabase = createServiceSupabase();
  const { data: products } = await supabase
    .from("products")
    .select("*, category:product_categories(name)")
    .order("sort_order", { ascending: true });

  return {
    userEmail: user.email || "admin@unicorn.com",
    products: (products || []) as (Product & { category: { name: string } | null })[],
  };
}

export async function action({ request }: ActionFunctionArgs) {
  await requireUser(request);
  const formData = await request.formData();
  const id = formData.get("id") as string;
  const isActive = formData.get("isActive") === "true";

  const supabase = createServiceSupabase();
  const { error } = await supabase
    .from("products")
    .update({ is_active: isActive })
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }
  return { success: true };
}

export default function AdminProductsPage() {
  const { userEmail, products } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();

  return (
    <AdminLayout userEmail={userEmail}>
      <div className="space-y-6 max-w-5xl font-body text-text-primary">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display font-bold text-2xl text-text-primary">Products Catalog</h1>
            <p className="text-xs text-text-muted mt-0.5">
              มีสินค้าทั้งหมด {products.length} รายการในระบบ
            </p>
          </div>
          <Link to="/admin/products/new" className="btn-gold text-xs shadow-sm">
            + เพิ่มสินค้าใหม่
          </Link>
        </div>

        {/* Table Container */}
        <div className="bg-white border border-border-default rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border-default bg-bg-input text-[10px] font-bold text-text-muted uppercase tracking-wider select-none">
                  <th className="text-left px-5 py-4">ข้อมูลสินค้า</th>
                  <th className="text-left px-5 py-4">หมวดหมู่</th>
                  <th className="text-right px-5 py-4">ราคาสมาชิก</th>
                  <th className="text-right px-5 py-4">ราคาขายปลีก</th>
                  <th className="text-right px-5 py-4">กำไรสะสม</th>
                  <th className="text-right px-5 py-4">PV คะแนน</th>
                  <th className="text-center px-5 py-4">สถานะการแสดง</th>
                  <th className="text-center px-5 py-4">เครื่องมือ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-muted">
                {products.map((product) => {
                  const profit = product.retail_price - product.member_price;
                  const isToggling = fetcher.formData?.get("id") === product.id;
                  const isActive = isToggling
                    ? fetcher.formData?.get("isActive") === "true"
                    : product.is_active;

                  return (
                    <tr key={product.id} className="hover:bg-bg-hover/30 transition-colors">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          {product.image_url ? (
                            <img src={product.image_url} alt={product.name}
                                 className="w-10 h-10 rounded-xl object-cover shrink-0 border border-border-default shadow-sm" />
                          ) : (
                            <div className="w-10 h-10 rounded-xl bg-bg-input border border-border-default flex items-center justify-center text-xl shrink-0">
                              📦
                            </div>
                          )}
                          <div className="min-w-0 max-w-[200px]">
                            <p className="font-bold text-text-primary truncate">{product.name}</p>
                            <p className="text-[10px] text-text-muted truncate mt-0.5">{product.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-text-secondary font-semibold">
                        {product.category?.name ?? "—"}
                      </td>
                      <td className="px-5 py-3 text-right text-text-secondary font-bold font-mono">
                        ฿{product.member_price.toLocaleString()}
                      </td>
                      <td className="px-5 py-3 text-right text-text-secondary font-bold font-mono">
                        ฿{product.retail_price.toLocaleString()}
                      </td>
                      <td className="px-5 py-3 text-right font-black text-brand-gold font-mono">
                        ฿{profit.toLocaleString()}
                      </td>
                      <td className="px-5 py-3 text-right text-text-secondary font-bold font-mono">
                        {product.pv}
                      </td>
                      <td className="px-5 py-3 text-center">
                        <fetcher.Form method="post">
                          <input type="hidden" name="id" value={product.id} />
                          <input type="hidden" name="isActive" value={isActive ? "false" : "true"} />
                          <button
                            type="submit"
                            disabled={isToggling}
                            className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg border transition-all ${
                              isActive
                                ? "bg-emerald-50 border-emerald-100 text-emerald-700 hover:bg-emerald-100"
                                : "bg-bg-input border-border-strong text-text-muted hover:bg-white"
                            }`}
                          >
                            {isActive ? "Active" : "Hidden"}
                          </button>
                        </fetcher.Form>
                      </td>
                      <td className="px-5 py-3 text-center">
                        <Link
                          to={`/admin/products/${product.id}`}
                          className="text-[11px] font-black text-brand-gold hover:text-brand-gold-hover transition-colors"
                        >
                          แก้ไข
                        </Link>
                      </td>
                    </tr>
                  );
                })}
                {products.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-5 py-12 text-center text-text-muted italic select-none">
                      ยังไม่มีสินค้าในระบบ — กรุณากด "+ เพิ่มสินค้าใหม่" เพื่อเริ่มต้น
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
