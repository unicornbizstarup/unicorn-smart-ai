import { createServiceSupabase, requireUser } from "@/lib/supabase-server";
import { useLoaderData, Link } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import AdminLayout from "@/components/layout/AdminLayout";

export function meta() {
  return [
    { title: "Admin Dashboard — Unicorn Smart AI" },
  ];
}

export async function loader({ request }: LoaderFunctionArgs) {
  const responseHeaders = new Headers();
  const { user } = await requireUser(request, responseHeaders);

  const supabase = createServiceSupabase();
  
  const [
    { count: productCount },
    { count: categoryCount },
    { count: docCount }
  ] = await Promise.all([
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase.from("product_categories").select("*", { count: "exact", head: true }),
    supabase.from("knowledge_docs").select("*", { count: "exact", head: true }),
  ]);

  return {
    userEmail: user.email || "admin@unicorn.com",
    productCount: productCount ?? 0,
    categoryCount: categoryCount ?? 0,
    docCount: docCount ?? 0,
  };
}

export default function AdminDashboardPage() {
  const { userEmail, productCount, categoryCount, docCount } = useLoaderData<typeof loader>();

  const stats = [
    { label: "Products (สินค้า)", value: productCount, href: "/admin/products", icon: "📦" },
    { label: "Categories (กลุ่มสินค้า)", value: categoryCount, href: "/admin/categories", icon: "🏷️" },
    { label: "Knowledge Base ( RAG คลังความรู้)", value: docCount, href: "/admin/knowledge", icon: "🧠" },
  ];

  return (
    <AdminLayout userEmail={userEmail}>
      <div className="space-y-6 max-w-5xl font-body text-text-primary">
        <div className="mb-8">
          <h1 className="font-display font-bold text-3xl text-text-primary">Admin Dashboard</h1>
          <p className="text-text-muted mt-1.5 text-xs sm:text-sm">ยินดีต้อนรับสู่ระบบจัดการหลังบ้านระดับแอดมินของ Unicorn Smart AI</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {stats.map((stat) => (
            <Link 
              key={stat.label} 
              to={stat.href}
              className="card-premium bg-white border border-border-default rounded-3xl p-6 hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-6">
                <span className="text-3xl select-none">{stat.icon}</span>
                <span className="text-text-muted group-hover:text-brand-gold group-hover:translate-x-0.5 transition-all">→</span>
              </div>
              <div>
                <div className="text-3xl font-display font-black text-text-primary leading-none mb-1">{stat.value.toLocaleString()}</div>
                <div className="text-xs text-text-muted font-bold tracking-tight">{stat.label}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
