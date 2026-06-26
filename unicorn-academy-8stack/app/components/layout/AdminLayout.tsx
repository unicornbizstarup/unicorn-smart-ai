import React from "react";
import { Link, useLocation } from "react-router";

interface Props {
  children: React.ReactNode;
  userEmail: string;
}

const NAV_ITEMS = [
  { href: "/admin",            label: "Dashboard",     icon: "📊" },
  { href: "/admin/products",   label: "Products",      icon: "📦" },
  { href: "/admin/categories", label: "Categories",    icon: "🏷️" },
  { href: "/admin/knowledge",  label: "AI Knowledge",  icon: "🧠" },
] as const;

export default function AdminLayout({ children, userEmail }: Props) {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="min-h-screen flex bg-bg-page font-body text-text-primary">
      {/* ── Sidebar ── */}
      <aside className="w-[240px] bg-white border-r border-border-default flex flex-col justify-between fixed top-0 bottom-0 left-0 z-30 select-none">
        <div>
          {/* Accent Line */}
          <div className="h-1 bg-brand-gold" />

          {/* Logo Section */}
          <div className="p-5 border-b border-border-default flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-sm select-none"
                 style={{ background: "linear-gradient(135deg, var(--brand-dark), var(--brand-gold))" }}>
              U
            </div>
            <div>
              <div className="font-display font-bold text-sm text-text-primary leading-tight">
                Unicorn Smart AI
              </div>
              <div className="text-[9px] font-bold text-text-muted uppercase tracking-wider mt-0.5">
                Admin Panel
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-5">
            <div>
              <div className="text-[10px] font-black text-text-muted uppercase tracking-wider px-3 mb-2">Management</div>
              <div className="space-y-1">
                {NAV_ITEMS.map(({ href, label, icon }) => {
                  const isActive = currentPath === href || (href !== "/admin" && currentPath.startsWith(href));
                  return (
                    <Link
                      key={href}
                      to={href}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                        isActive
                          ? "bg-brand-gold-light/45 text-brand-gold font-bold"
                          : "text-text-secondary hover:text-text-primary hover:bg-bg-hover"
                      }`}
                    >
                      <span className="text-base">{icon}</span>
                      <span>{label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="text-[10px] font-black text-text-muted uppercase tracking-wider px-3 mb-2">Views</div>
              <div className="space-y-1">
                <Link
                  to="/dashboard"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-text-secondary hover:text-text-primary hover:bg-bg-hover transition-all"
                >
                  <span className="text-base">🏠</span>
                  <span>Member Dashboard</span>
                </Link>
                <Link
                  to="/products"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-text-secondary hover:text-text-primary hover:bg-bg-hover transition-all"
                >
                  <span className="text-base">📋</span>
                  <span>Product Library</span>
                </Link>
              </div>
            </div>
          </nav>
        </div>

        {/* User Footer / Logout */}
        <div className="p-4 border-t border-border-default bg-bg-input">
          <div className="flex items-center gap-2.5 mb-4 px-2">
            <div className="w-8 h-8 rounded-full bg-white border border-border-default flex items-center justify-center text-sm shadow-sm">
              👤
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-bold text-text-primary truncate">
                {userEmail}
              </div>
              <div className="text-[8px] text-text-muted font-bold uppercase tracking-wider mt-0.5">
                Admin Session
              </div>
            </div>
          </div>
          
          <form action="/auth/logout" method="POST">
            <button
              type="submit"
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 transition-all text-left"
            >
              <span className="text-base">🚪</span>
              <span>Sign Out</span>
            </button>
          </form>
          <div className="text-[9px] text-text-muted text-center mt-3 font-semibold">
            Unicorn Smart AI · Admin
          </div>
        </div>
      </aside>

      {/* ── Main Content Area ── */}
      <main className="flex-1 pl-[240px] min-h-screen flex flex-col">
        {/* Top Header Accent */}
        <div className="h-1 bg-brand-gold" />
        
        <div className="flex-1 p-6 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
