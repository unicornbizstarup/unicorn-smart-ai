// src/app/(admin)/admin/layout.tsx
import { createServerSupabase } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import Link from "next/link";
import type { ReactNode } from "react";

const NAV_ITEMS = [
  { href: "/admin",            label: "Dashboard",     icon: "⬛" },
  { href: "/admin/products",   label: "Products",      icon: "📦" },
  { href: "/admin/categories", label: "Categories",    icon: "🏷️" },
  { href: "/admin/knowledge",  label: "AI Knowledge",  icon: "🧠" },
] as const;

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  // Simple admin check — replace with role-based check in production
  if (!user) redirect("/auth/login");

  return (
    <div className="sidebar-layout">
      {/* ── Sidebar ── */}
      <aside className="sidebar">
        {/* Brand accent bar */}
        <div className="brand-accent-bar" />

        {/* Logo */}
        <div className="p-4 border-b border-border-muted flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white
                          font-black text-sm flex-shrink-0"
               style={{ background: "linear-gradient(135deg,#c0281e,#e8621a)" }}>
            U
          </div>
          <div>
            <div className="font-display font-bold text-sm text-text-primary leading-tight">
              Unicorn Smart AI
            </div>
            <div className="text-[9px] font-bold text-text-muted uppercase tracking-widest">
              Admin Panel
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="sidebar-body">
          <div className="nav-section-label">Management</div>
          {NAV_ITEMS.map(({ href, label, icon }) => (
            <Link key={href} href={href} className="nav-item">
              <span className="text-base w-5 text-center">{icon}</span>
              {label}
            </Link>
          ))}

          <div className="nav-section-label mt-3">Member View</div>
          <Link href="/dashboard"  className="nav-item">
            <span className="text-base w-5 text-center">🏠</span> Dashboard
          </Link>
          <Link href="/products"   className="nav-item">
            <span className="text-base w-5 text-center">📋</span> Product Library
          </Link>
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-border-muted">
          <div className="text-[10px] text-text-muted text-center">
            Unicorn Smart AI · Admin
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="main-content min-h-screen">
        <div className="brand-accent-bar" />
        {children}
      </div>
    </div>
  );
}
