import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase-server";
import type { Profile } from "@/types/index";

export default async function DashboardPage() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single<Profile>();

  return (
    <div className="flex min-h-screen bg-bg-page">
      {/* ── Sidebar ── */}
      <aside className="w-[220px] bg-bg-sidebar border-r border-border-default
                        flex flex-col fixed top-0 left-0 h-screen z-40">
        {/* Logo */}
        <div className="p-4 border-b border-border-muted">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-gold rounded-lg flex items-center
                           justify-center text-white text-sm font-bold">
              🦄
            </div>
            <div>
              <div className="font-display font-bold text-sm text-text-primary">
                Unicorn Academy
              </div>
              <div className="text-2xs text-text-muted uppercase tracking-wider">
                Smart AI Platform
              </div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto p-2 space-y-0.5">
          <SidebarSection label="Main">
            <NavItem href="/dashboard" icon="🏠" label="Dashboard" active />
            <NavItem href="/ai-coach"  icon="🤖" label="น้องยูนิ" badge={3} />
            <NavItem href="/missions"  icon="🎯" label="Missions" />
            <NavItem href="/dna"       icon="🧬" label="Wealth DNA" />
          </SidebarSection>
          <SidebarSection label="Profile">
            <NavItem href="/profile"   icon="🪪" label="Name Card" />
            <NavItem href={`/referral/${profile?.referral_slug}`}
                                       icon="🔗" label="Referral Link" />
          </SidebarSection>
        </nav>

        {/* User footer */}
        <div className="p-3 border-t border-border-muted">
          <div className="flex items-center gap-2 p-2 rounded-lg
                          hover:bg-bg-hover cursor-pointer transition-colors">
            <div className="w-7 h-7 rounded-full bg-brand-gold-light
                           flex items-center justify-center text-xs
                           font-bold text-brand-gold border border-brand-gold-muted">
              {profile?.full_name?.[0] ?? "U"}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold text-text-primary truncate">
                {profile?.full_name ?? "สมาชิก"}
              </div>
              <div className="text-2xs text-text-muted">
                UBC Level {profile?.ubc_level} · {profile?.wealth_element}
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="ml-[220px] flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="bg-bg-card border-b border-border-default
                           px-6 py-3 flex items-center gap-3 sticky top-0 z-30">
          <div>
            <span className="font-display font-bold text-md text-text-primary">
              Dashboard
            </span>
            <span className="text-sm text-text-muted ml-2">
              สวัสดีตอนเช้า {profile?.full_name?.split(" ")[0]} 👋
            </span>
          </div>
          <div className="ml-auto flex gap-2">
            <button className="btn-outline text-xs">รายงาน</button>
            <button className="btn-gold text-xs">+ เพิ่ม Mission</button>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6 flex-1">
          {/* Stats */}
          <div className="grid grid-cols-4 gap-3 mb-6">
            <StatCard label="UBC Score"    value="4,820" change="+240 สัปดาห์นี้" up />
            <StatCard label="Missions"     value="28"    change="3 ใหม่" up />
            <StatCard label="Referrals"    value="12"    change="+2 คนใหม่" up />
            <StatCard label="AI Sessions"  value="64"    change="เดือนนี้" />
          </div>

          {/* Two-column grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Missions card */}
            <div className="card-base p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-display font-bold text-md">Active Missions</h3>
                <a href="/missions" className="text-xs text-brand-gold font-semibold">
                  ดูทั้งหมด →
                </a>
              </div>
              {/* mission rows... */}
            </div>

            {/* UBC Progress */}
            <div className="card-base p-4">
              <h3 className="font-display font-bold text-md mb-3">UBC Progress</h3>
              <ProgressRow label="Mindset" pct={82} />
              <ProgressRow label="Skillset" pct={67} />
              <ProgressRow label="Toolset"  pct={55} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

/* ─ Sub-components ─ */
function SidebarSection({ label, children }: {
  label: string; children: React.ReactNode
}) {
  return (
    <div className="mb-2">
      <p className="text-2xs text-text-muted uppercase tracking-widest
                    font-semibold px-3 py-2">
        {label}
      </p>
      {children}
    </div>
  );
}

function NavItem({ href, icon, label, active, badge }: {
  href: string; icon: string; label: string;
  active?: boolean; badge?: number;
}) {
  return (
    <a href={href}
       className={`nav-item ${active ? "active" : ""}`}>
      <span className="text-base">{icon}</span>
      <span className="flex-1">{label}</span>
      {badge && (
        <span className="bg-brand-gold text-white text-2xs font-bold
                         rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
          {badge}
        </span>
      )}
    </a>
  );
}

function StatCard({ label, value, change, up }: {
  label: string; value: string; change?: string; up?: boolean
}) {
  return (
    <div className="stat-card">
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
      {change && (
        <div className={up ? "stat-change-up" : "text-sm text-text-muted mt-1"}>
          {up ? "↑ " : ""}{change}
        </div>
      )}
    </div>
  );
}

function ProgressRow({ label, pct }: { label: string; pct: number }) {
  return (
    <div className="mb-3">
      <div className="flex justify-between text-sm mb-1">
        <span className="text-text-secondary">{label}</span>
        <span className="font-semibold text-brand-gold">{pct}%</span>
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}