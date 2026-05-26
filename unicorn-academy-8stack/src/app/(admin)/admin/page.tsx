// src/app/(admin)/admin/page.tsx
export const runtime = "edge";
import { createServiceSupabase } from "@/lib/supabase-server";
import Link from "next/link";

export const metadata = { title: "Admin Dashboard — Unicorn Smart AI" };

export default async function AdminDashboardPage() {
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

  const stats = [
    { label: "Products", value: productCount ?? 0, href: "/admin/products", icon: "📦" },
    { label: "Categories", value: categoryCount ?? 0, href: "/admin/categories", icon: "🏷️" },
    { label: "Knowledge Base", value: docCount ?? 0, href: "/admin/knowledge", icon: "🧠" },
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="font-display font-bold text-3xl text-text-primary">Admin Dashboard</h1>
        <p className="text-text-muted mt-1">ยินดีต้อนรับสู่ระบบจัดการ Unicorn Smart AI</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat) => (
          <Link 
            key={stat.label} 
            href={stat.href}
            className="bg-bg-card border border-border-default rounded-2xl p-6 hover:shadow-lg transition-all group"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-3xl">{stat.icon}</span>
              <span className="text-text-muted group-hover:text-brand-gold transition-colors">→</span>
            </div>
            <div className="text-2xl font-bold text-text-primary">{stat.value}</div>
            <div className="text-sm text-text-muted font-medium">{stat.label}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
