import { createServerSupabase, requireUser } from "@/lib/supabase-server";
import { useLoaderData, Link } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import type { Profile, UserMission } from "@/types";
import MemberLayout from "@/components/layout/MemberLayout";
import {
  Zap,
  Users,
  Crown,
  CheckCircle2,
  Link as LinkIcon,
  Contact,
  BarChart3,
  Trophy,
  Gem,
  Rocket,
  Package,
  BookOpen,
  Calendar,
  Lightbulb,
  Target,
  Wrench
} from "lucide-react";

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
        <div className="grid grid-cols-2 gap-4">
          <div className="card-premium p-4 flex flex-col justify-between group h-28">
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 rounded-lg bg-brand-gold-light/40 flex items-center justify-center text-brand-gold shadow-sm group-hover:scale-110 transition-transform">
                <Zap size={16} />
              </div>
              <span className="text-[9px] font-black text-text-muted uppercase tracking-wider">UBC Score</span>
            </div>
            <div>
              <div className="text-2xl font-display font-black text-text-primary leading-none mb-0.5">{displayUbcScore}</div>
              <div className="text-[9px] font-bold text-emerald-600 uppercase tracking-tighter">↑ +0 Points</div>
            </div>
          </div>

          <div className="card-premium p-4 flex flex-col justify-between group h-28">
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 rounded-lg bg-brand-gold-light/40 flex items-center justify-center text-brand-gold shadow-sm group-hover:scale-110 transition-transform">
                <Users size={16} />
              </div>
              <span className="text-[9px] font-black text-text-muted uppercase tracking-wider">Referrals</span>
            </div>
            <div>
              <div className="text-2xl font-display font-black text-text-primary leading-none mb-0.5">{displayReferrals.toString().padStart(2, '0')}</div>
              <div className="text-[9px] font-bold text-text-muted uppercase tracking-tighter">Lifetime Activity</div>
            </div>
          </div>

          <div className="card-premium p-4 flex flex-col justify-between group h-28">
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 rounded-lg bg-brand-gold-light/40 flex items-center justify-center text-brand-gold shadow-sm group-hover:scale-110 transition-transform">
                <Crown size={16} />
              </div>
              <span className="text-[9px] font-black text-text-muted uppercase tracking-wider">AI Sessions</span>
            </div>
            <div>
              <div className="text-2xl font-display font-black text-text-primary leading-none mb-0.5">{displayAiSessions.toString().padStart(2, '0')}</div>
              <div className="text-[9px] font-bold text-text-muted uppercase tracking-tighter">Current Month</div>
            </div>
          </div>

          <div className="card-premium p-4 flex flex-col justify-between group h-28">
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 rounded-lg bg-brand-gold-light/40 flex items-center justify-center text-brand-gold shadow-sm group-hover:scale-110 transition-transform">
                <CheckCircle2 size={16} />
              </div>
              <span className="text-[9px] font-black text-text-muted uppercase tracking-wider">Missions</span>
            </div>
            <div>
              <div className="text-2xl font-display font-black text-text-primary leading-none mb-0.5">{displayMissionsDone.toString().padStart(2, '0')}</div>
              <div className="text-[9px] font-bold text-emerald-600 uppercase tracking-tighter">Success Pathway</div>
            </div>
          </div>
        </div>

        {/* ── Two Column Layout (Stacked vertically on mobile) ── */}
        <div className="grid grid-cols-1 gap-6">
          {/* Active Missions */}
          <div className="card-premium p-5">
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-border-default">
              <div>
                <h2 className="text-md font-bold font-display text-text-primary uppercase tracking-tight">Active Missions</h2>
                <p className="text-[10px] text-text-muted font-medium">ความคืบหน้าภารกิจของคุณ</p>
              </div>
              <Link to="/missions" className="text-[10px] font-black text-brand-gold hover:underline uppercase tracking-widest">
                View All →
              </Link>
            </div>
            <div className="space-y-3">
              {missions && missions.length > 0 ? (
                missions.map((um) => (
                  <div key={um.id} className="flex items-center justify-between p-3.5 rounded-2xl bg-bg-input border border-border-default hover:border-brand-gold-muted/30 transition-all group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm bg-white border border-border-default shrink-0">
                        {um.mission?.category === "MINDSET" ? (
                          <Lightbulb size={20} className="text-brand-gold" />
                        ) : um.mission?.category === "SKILLSET" ? (
                          <Target size={20} className="text-brand-gold" />
                        ) : (
                          <Wrench size={20} className="text-brand-gold" />
                        )}
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-text-primary line-clamp-1">{um.mission?.title}</div>
                        <div className="text-[9px] text-text-muted font-bold uppercase tracking-wider mt-0.5">{um.mission?.category}</div>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                      um.status === "COMPLETED" ? "bg-emerald-100 text-emerald-800" :
                      um.status === "VERIFIED" ? "bg-blue-100 text-blue-800" :
                      "bg-amber-100 text-amber-800"
                    }`}>{um.status}</span>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-text-muted">
                  <div className="text-3xl mb-3 opacity-20">🎯</div>
                  <p className="text-[10px] font-bold uppercase tracking-widest">ไม่มีภารกิจที่กำลังดำเนินอยู่</p>
                  <Link to="/missions" className="text-brand-gold text-[10px] font-black uppercase tracking-widest mt-3 inline-block hover:underline">+ Start First Mission</Link>
                </div>
              )}
            </div>
          </div>

          {/* Business Tools Hub */}
          <div className="card-premium p-5">
            <div className="mb-6 pb-3 border-b border-border-default">
              <h2 className="text-md font-bold font-display text-text-primary uppercase tracking-tight">เครื่องมือและระบบงาน Hub</h2>
              <p className="text-[10px] text-text-muted font-medium">Business Operations Hub</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Link to="/startup" className="p-4 rounded-2xl bg-bg-input border border-border-default hover:border-brand-gold-muted/50 hover:bg-white hover:shadow-sm transition-all group">
                <div className="w-10 h-10 rounded-xl bg-white border border-border-default flex items-center justify-center text-brand-gold shadow-sm mb-3 group-hover:scale-110 transition-transform">
                  <Rocket size={20} />
                </div>
                <div className="text-xs font-semibold text-text-primary uppercase tracking-tighter">5 เริ่มต้น</div>
                <div className="text-[9px] text-text-muted font-bold uppercase tracking-widest mt-0.5">Start Up</div>
              </Link>
              <Link to="/products" className="p-4 rounded-2xl bg-bg-input border border-border-default hover:border-brand-gold-muted/50 hover:bg-white hover:shadow-sm transition-all group">
                <div className="w-10 h-10 rounded-xl bg-white border border-border-default flex items-center justify-center text-brand-gold shadow-sm mb-3 group-hover:scale-110 transition-transform">
                  <Package size={20} />
                </div>
                <div className="text-xs font-semibold text-text-primary uppercase tracking-tighter">คลังสินค้า</div>
                <div className="text-[9px] text-text-muted font-bold uppercase tracking-widest mt-0.5">Products</div>
              </Link>
              <Link to="/knowledge" className="p-4 rounded-2xl bg-bg-input border border-border-default hover:border-brand-gold-muted/50 hover:bg-white hover:shadow-sm transition-all group">
                <div className="w-10 h-10 rounded-xl bg-white border border-border-default flex items-center justify-center text-brand-gold shadow-sm mb-3 group-hover:scale-110 transition-transform">
                  <BookOpen size={20} />
                </div>
                <div className="text-xs font-semibold text-text-primary uppercase tracking-tighter">คลังความรู้</div>
                <div className="text-[9px] text-text-muted font-bold uppercase tracking-widest mt-0.5">Knowledge</div>
              </Link>
              <Link to="/functions" className="p-4 rounded-2xl bg-bg-input border border-border-default hover:border-brand-gold-muted/50 hover:bg-white hover:shadow-sm transition-all group">
                <div className="w-10 h-10 rounded-xl bg-white border border-border-default flex items-center justify-center text-brand-gold shadow-sm mb-3 group-hover:scale-110 transition-transform">
                  <Calendar size={20} />
                </div>
                <div className="text-xs font-semibold text-text-primary tracking-tighter">ฟังก์ชั่นระบบ</div>
                <div className="text-[9px] text-text-muted font-bold uppercase tracking-widest mt-0.5">Events</div>
              </Link>
            </div>
          </div>

          {/* Quick Actions Panel */}
          <div className="card-premium p-5">
            <div className="mb-6 pb-3 border-b border-border-default">
              <h2 className="text-md font-bold font-display text-text-primary uppercase tracking-tight">Quick Actions</h2>
              <p className="text-[10px] text-text-muted font-medium">ทางลัดอัจฉริยะ</p>
            </div>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { label: "ถามน้องยูนิ", icon: <Crown size={20} className="text-brand-gold" />, href: "/ai-coach" },
                { label: "Referral", icon: <LinkIcon size={20} className="text-brand-gold" />, href: "/profile" },
                { label: "Name Card", icon: <Contact size={20} className="text-brand-gold" />, href: "/profile" },
                { label: "Report", icon: <BarChart3 size={20} className="text-brand-gold" />, href: "#" },
                { label: "Mission", icon: <Trophy size={20} className="text-brand-gold" />, href: "/missions" },
                { label: "DNA Quiz", icon: <Gem size={20} className="text-brand-gold" />, href: "/dna" },
              ].map((action) => (
                <Link key={action.label} to={action.href} className="flex flex-col items-center justify-center p-3 rounded-xl bg-bg-input border border-border-default hover:border-brand-gold-muted/40 hover:bg-white hover:shadow-sm transition-all group text-center">
                  <div className="w-10 h-10 rounded-xl bg-white border border-border-default flex items-center justify-center text-brand-gold shadow-sm mb-1.5 group-hover:scale-110 transition-transform">
                    {action.icon}
                  </div>
                  <span className="text-[10px] font-bold text-text-secondary uppercase tracking-tighter group-hover:text-brand-gold transition-colors">{action.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MemberLayout>
  );
}
