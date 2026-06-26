import { createServerSupabase, requireUser } from "@/lib/supabase-server";
import { useLoaderData, Link } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import type { Profile, UserMission } from "@/types";
import MemberLayout from "@/components/layout/MemberLayout";

export function meta() {
  return [
    { title: "แดชบอร์ด — Unicorn Academy" },
    { name: "description", content: "แผงควบคุมระบบสมาชิกและการเรียนรู้ Unicorn Academy" },
  ];
}

export async function loader({ request }: LoaderFunctionArgs) {
  const responseHeaders = new Headers();
  const { user, supabase } = await requireUser(request, responseHeaders);

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single<Profile>();

  const { data: missions } = await supabase
    .from("user_missions")
    .select("*, mission:missions(*)")
    .eq("profile_id", user.id)
    .order("started_at", { ascending: false })
    .limit(5)
    .returns<UserMission[]>();

  return { profile, missions };
}

export default function DashboardPage() {
  const { profile, missions } = useLoaderData<typeof loader>();

  const completedMissionsCount = missions ? missions.filter(m => m.status === "COMPLETED" || m.status === "VERIFIED").length : 0;
  
  // Metrics Defaults
  const displayUbcScore    = (profile?.business_points ?? 0) > 0 ? profile?.business_points.toLocaleString() : "0000";
  const displayReferrals   = profile?.referral_clicks ?? 0;
  const displayAiSessions  = 0;
  const displayMissionsDone = completedMissionsCount > 0 ? completedMissionsCount : 0;

  return (
    <MemberLayout
      profile={profile}
      title="Dashboard"
      subtitle={`— ยินดีต้อนรับคุณ ${profile?.display_name || profile?.full_name || "Partner"} 👋`}
      actions={
        <>
          <button className="btn-outline !text-[10px] !px-4 !py-2 !rounded-full !font-bold !uppercase transition-all">
            Report
          </button>
          <Link to="/missions" className="btn-gold !text-[10px] !px-4 !py-2 !rounded-full !font-bold !uppercase transition-transform">
            + New Mission
          </Link>
        </>
      }
    >
      <div className="space-y-8 font-body">
        {/* ── Stats Grid ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card-premium p-6 flex flex-col justify-between group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-brand-gold-light/40 flex items-center justify-center text-xl shadow-sm group-hover:scale-110 transition-transform">⚡</div>
              <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">UBC Score</span>
            </div>
            <div>
              <div className="text-3xl font-display font-black text-text-primary leading-none mb-1">{displayUbcScore}</div>
              <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-tighter">↑ +0 Points</div>
            </div>
          </div>

          <div className="card-premium p-6 flex flex-col justify-between group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-brand-gold-light/40 flex items-center justify-center text-xl shadow-sm group-hover:scale-110 transition-transform">👥</div>
              <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">Referrals Click</span>
            </div>
            <div>
              <div className="text-3xl font-display font-black text-text-primary leading-none mb-1">{displayReferrals.toString().padStart(2, '0')}</div>
              <div className="text-[10px] font-bold text-text-muted uppercase tracking-tighter">Lifetime Activity</div>
            </div>
          </div>

          <div className="card-premium p-6 flex flex-col justify-between group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-brand-gold-light/40 flex items-center justify-center text-xl shadow-sm group-hover:scale-110 transition-transform">🤖</div>
              <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">AI Sessions</span>
            </div>
            <div>
              <div className="text-3xl font-display font-black text-text-primary leading-none mb-1">{displayAiSessions.toString().padStart(2, '0')}</div>
              <div className="text-[10px] font-bold text-text-muted uppercase tracking-tighter">Current Month</div>
            </div>
          </div>

          <div className="card-premium p-6 flex flex-col justify-between group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-brand-gold-light/40 flex items-center justify-center text-xl shadow-sm group-hover:scale-110 transition-transform">✅</div>
              <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">Missions Done</span>
            </div>
            <div>
              <div className="text-3xl font-display font-black text-text-primary leading-none mb-1">{displayMissionsDone.toString().padStart(2, '0')}</div>
              <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-tighter">Success Pathway</div>
            </div>
          </div>
        </div>

        {/* ── Two Column Layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Active Missions */}
          <div className="card-premium p-8">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-border-default">
              <div>
                <h2 className="text-lg font-bold font-display text-text-primary uppercase tracking-tight">Active Missions</h2>
                <p className="text-xs text-text-muted font-medium">ความคืบหน้าภารกิจของคุณ</p>
              </div>
              <Link to="/missions" className="text-[11px] font-black text-brand-gold hover:underline uppercase tracking-widest">
                View All →
              </Link>
            </div>
            <div className="space-y-4">
              {missions && missions.length > 0 ? (
                missions.map((um) => (
                  <div key={um.id} className="flex items-center justify-between p-4 rounded-2xl bg-bg-input border border-border-default hover:border-brand-gold-muted/30 transition-all group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shadow-sm bg-white border border-border-default">
                        {um.mission?.category === "MINDSET" ? "🧠" :
                         um.mission?.category === "SKILLSET" ? "🎯" : "🛠️"}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-text-primary line-clamp-1">{um.mission?.title}</div>
                        <div className="text-[10px] text-text-muted font-bold uppercase tracking-wider mt-1">{um.mission?.category}</div>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      um.status === "COMPLETED" ? "bg-emerald-100 text-emerald-800" :
                      um.status === "VERIFIED" ? "bg-blue-100 text-blue-800" :
                      "bg-amber-100 text-amber-800"
                    }`}>{um.status}</span>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center text-text-muted">
                  <div className="text-4xl mb-4 opacity-20">🎯</div>
                  <p className="text-xs font-bold uppercase tracking-widest">ไม่มีภารกิจที่กำลังดำเนินอยู่</p>
                  <Link to="/missions" className="text-brand-gold text-[11px] font-black uppercase tracking-widest mt-4 inline-block hover:underline">+ Start First Mission</Link>
                </div>
              )}
            </div>
          </div>

          {/* Business Tools Hub */}
          <div className="card-premium p-8">
            <div className="mb-8 pb-4 border-b border-border-default">
              <h2 className="text-lg font-bold font-display text-text-primary uppercase tracking-tight">เครื่องมือและระบบงาน Hub</h2>
              <p className="text-xs text-text-muted font-medium">Business Operations Hub</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Link to="/startup" className="p-6 rounded-3xl bg-bg-input border border-border-default hover:border-brand-gold-muted/50 hover:bg-white hover:shadow-md transition-all group">
                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-2xl shadow-sm mb-4 group-hover:scale-110 transition-transform">🚀</div>
                <div className="text-sm font-semibold text-text-primary uppercase tracking-tighter">5 เริ่มต้น</div>
                <div className="text-[10px] text-text-muted font-bold uppercase tracking-widest mt-1">Start Up</div>
              </Link>
              <Link to="/products" className="p-6 rounded-3xl bg-bg-input border border-border-default hover:border-brand-gold-muted/50 hover:bg-white hover:shadow-md transition-all group">
                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-2xl shadow-sm mb-4 group-hover:scale-110 transition-transform">📦</div>
                <div className="text-sm font-semibold text-text-primary uppercase tracking-tighter">คลังสินค้า</div>
                <div className="text-[10px] text-text-muted font-bold uppercase tracking-widest mt-1">Products</div>
              </Link>
              <Link to="/knowledge" className="p-6 rounded-3xl bg-bg-input border border-border-default hover:border-brand-gold-muted/50 hover:bg-white hover:shadow-md transition-all group">
                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-2xl shadow-sm mb-4 group-hover:scale-110 transition-transform">📚</div>
                <div className="text-sm font-semibold text-text-primary uppercase tracking-tighter">คลังความรู้</div>
                <div className="text-[10px] text-text-muted font-bold uppercase tracking-widest mt-1">Knowledge</div>
              </Link>
              <Link to="/functions" className="p-6 rounded-3xl bg-bg-input border border-border-default hover:border-brand-gold-muted/50 hover:bg-white hover:shadow-md transition-all group">
                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-2xl shadow-sm mb-4 group-hover:scale-110 transition-transform">📅</div>
                <div className="text-sm font-semibold text-text-primary tracking-tighter">ฟังก์ชั่นระบบ</div>
                <div className="text-[10px] text-text-muted font-bold uppercase tracking-widest mt-1">Events</div>
              </Link>
            </div>
          </div>

          {/* Quick Actions Panel */}
          <div className="card-premium p-8 lg:col-span-2">
            <div className="mb-8 pb-4 border-b border-border-default">
              <h2 className="text-lg font-bold font-display text-text-primary uppercase tracking-tight">Quick Actions</h2>
              <p className="text-xs text-text-muted font-medium">ทางลัดอัจฉริยะ</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[
                { label: "ถามน้องยูนิ", icon: "🤖", href: "/ai-coach" },
                { label: "Referral", icon: "🔗", href: "/profile" },
                { label: "Name Card", icon: "🪪", href: "/profile" },
                { label: "Report", icon: "📊", href: "#" },
                { label: "Mission", icon: "🎯", href: "/missions" },
                { label: "DNA Quiz", icon: "🧬", href: "/dna" },
              ].map((action) => (
                <Link key={action.label} to={action.href} className="flex flex-col items-center justify-center p-4 rounded-2xl bg-bg-input border border-border-default hover:border-brand-gold-muted/40 hover:bg-white hover:shadow-md transition-all group text-center">
                  <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">{action.icon}</div>
                  <span className="text-[11px] font-bold text-text-secondary uppercase tracking-tighter group-hover:text-brand-gold transition-colors">{action.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MemberLayout>
  );
}
