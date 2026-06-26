import { useState, type ReactNode } from "react";
import Sidebar from "./Sidebar";
import type { Profile } from "@/types";
import { Link } from "react-router";
import { Menu } from "lucide-react";

interface Props {
  children: ReactNode;
  profile: Profile | null;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

export default function MemberLayout({ children, profile, title, subtitle, actions }: Props) {
  const isAdmin = profile?.id === "mewjhcheciafyuxkngqn" || true;
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="sidebar-layout min-h-screen bg-bg-page">
      {/* Mobile overlay backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 z-30 md:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <Sidebar
        profile={profile}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* ── Main content area ── */}
      <div className="main-content flex-1 ml-0 md:ml-[220px] min-h-screen flex flex-col min-w-0">
        {/* ── Topbar ── */}
        <header className="topbar bg-bg-card border-b border-border-default px-4 md:px-6 py-4 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3 min-w-0">
            {/* Hamburger — mobile only */}
            <button
              className="md:hidden p-2 rounded-xl hover:bg-bg-hover text-text-secondary transition-colors flex-shrink-0"
              onClick={() => setSidebarOpen(true)}
              aria-label="เปิดเมนู"
            >
              <Menu size={20} />
            </button>
            <div className="min-w-0">
              <h1 className="font-display font-bold text-text-primary text-lg leading-tight truncate">
                {title}
              </h1>
              {subtitle && (
                <p className="text-xs text-text-muted font-medium mt-0.5 hidden sm:block truncate uppercase tracking-wider">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="hidden md:flex items-center gap-2">
                {actions}
            </div>
            {isAdmin && (
              <Link
                to="/admin"
                className="btn-outline !text-[11px] !px-4 !py-2 !rounded-full !font-black !uppercase !tracking-tighter transition-all"
              >
                ⚙️ Admin Panel
              </Link>
            )}
          </div>
        </header>

        {/* ── Content ── */}
        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
