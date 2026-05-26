import { createServerSupabase } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import type { Profile, UserMission } from "@/types";
import MemberLayout from "@/components/layout/MemberLayout";
import Link from "next/link";

export const runtime = "edge";

export default async function DashboardPage() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single<Profile>();

  // Fetch member missions, query profile_id instead of user_id to avoid Postgres error
  const { data: missions } = await supabase
    .from("user_missions")
    .select("*, mission:missions(*)")
    .eq("profile_id", user.id)
    .order("started_at", { ascending: false })
    .limit(5)
    .returns<UserMission[]>();

  const levelLabels = { 1: "Foundation", 2: "Specialist", 3: "Strategic", 4: "Elite Master" };
  const level = (profile?.ubc_level ?? 1) as 1 | 2 | 3 | 4;
  const element = profile?.wealth_element ?? "FIRE";

  // Calculate completed/verified count from DB
  const completedMissionsCount = missions ? missions.filter(m => m.status === "COMPLETED" || m.status === "VERIFIED").length : 0;
  const displayMissionsDone = completedMissionsCount > 0 ? completedMissionsCount : 28; // Fallback to mockup data if new user

  return (
    <MemberLayout
      profile={profile}
      title="Dashboard"
      subtitle={`— สวัสดีตอนเช้า ${profile?.display_name || profile?.full_name || "Partner"} 👋`}
      actions={
        <>
          <button className="btn-outline text-xs px-3 py-1.5 rounded-lg border border-[#d6cfc4] hover:bg-[#faf5ec] text-[#6b5e4a] font-semibold transition-colors">
            รายงาน
          </button>
          <Link href="/missions" className="btn-gold text-xs px-3 py-1.5 rounded-lg text-white font-semibold transition-transform">
            + เพิ่ม Mission
          </Link>
        </>
      }
    >
      <div className="space-y-6 max-w-5xl">
        {/* ── Stats Grid ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="stat-card bg-white border border-[#e8e2d9] rounded-xl p-4 shadow-sm">
            <div className="stat-label text-[10px] text-[#9a8a72] uppercase font-bold tracking-wider mb-2 flex items-center justify-between">
              <span>UBC Score</span>
              <span className="opacity-45 text-sm">⚡</span>
            </div>
            <div className="stat-value text-2xl font-black text-[#1a1209]">
              {(profile?.business_points ?? 0) > 0 ? profile?.business_points.toLocaleString() : "4,820"}
            </div>
            <div className="stat-up text-xs font-bold text-green-600 mt-1.5 flex items-center gap-1">
              <span>↑ +240 คะแนนสัปดาห์นี้</span>
            </div>
          </div>

          <div className="stat-card bg-white border border-[#e8e2d9] rounded-xl p-4 shadow-sm">
            <div className="stat-label text-[10px] text-[#9a8a72] uppercase font-bold tracking-wider mb-2 flex items-center justify-between">
              <span>Missions Done</span>
              <span className="opacity-45 text-sm">✅</span>
            </div>
            <div className="stat-value text-2xl font-black text-[#1a1209]">
              {displayMissionsDone}
            </div>
            <div className="stat-up text-xs font-bold text-green-600 mt-1.5">
              <span>↑ 3 ภารกิจใหม่</span>
            </div>
          </div>

          <div className="stat-card bg-white border border-[#e8e2d9] rounded-xl p-4 shadow-sm">
            <div className="stat-label text-[10px] text-[#9a8a72] uppercase font-bold tracking-wider mb-2 flex items-center justify-between">
              <span>Referrals Click</span>
              <span className="opacity-45 text-sm">👥</span>
            </div>
            <div className="stat-value text-2xl font-black text-[#1a1209]">
              {profile?.referral_clicks ?? 12}
            </div>
            <div className="stat-up text-xs font-bold text-green-600 mt-1.5">
              <span>↑ +2 คนใหม่</span>
            </div>
          </div>

          <div className="stat-card bg-white border border-[#e8e2d9] rounded-xl p-4 shadow-sm">
            <div className="stat-label text-[10px] text-[#9a8a72] uppercase font-bold tracking-wider mb-2 flex items-center justify-between">
              <span>AI Sessions</span>
              <span className="opacity-45 text-sm">🤖</span>
            </div>
            <div className="stat-value text-2xl font-black text-[#1a1209]">
              64
            </div>
            <div className="text-[10px] text-[#9a8a72] font-semibold mt-1.5">
              ในเดือนนี้
            </div>
          </div>
        </div>

        {/* ── Two Column Layout ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Active Missions */}
          <div className="card-base bg-white border border-[#e8e2d9] rounded-xl p-4 shadow-sm flex flex-col justify-between">
            <div>
              <div className="card-header flex items-center justify-between mb-4">
                <span className="card-title font-display font-bold text-sm text-[#1a1209]">Active Missions</span>
                <Link href="/missions" className="card-action text-xs font-bold text-[#b8924a] hover:underline">
                  ดูทั้งหมด →
                </Link>
              </div>
              <div className="space-y-3">
                {missions && missions.length > 0 ? (
                  missions.map((um) => (
                    <div key={um.id} className="mission-item flex items-center justify-between pb-3 border-b border-[#f0ebe3] last:border-b-0 last:pb-0">
                      <div className="flex items-center gap-3">
                        <div className={`mission-icon w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0 ${
                          um.mission?.category === "MINDSET" ? "bg-[#ffe8f0]" :
                          um.mission?.category === "SKILLSET" ? "bg-[#e8f0ff]" :
                          "bg-[#e8fff0]"
                        }`}>
                          {um.mission?.category === "MINDSET" ? "🧠" :
                           um.mission?.category === "SKILLSET" ? "🎯" : "🛠️"}
                        </div>
                        <div>
                          <div className="mission-title text-xs font-bold text-[#1a1209] line-clamp-1">{um.mission?.title}</div>
                          <div className="mission-cat text-[9px] text-[#9a8a72] uppercase font-bold tracking-wider mt-0.5">{um.mission?.category}</div>
                        </div>
                      </div>
                      <div className="mission-right">
                        <span className={`badge text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          um.status === "COMPLETED" ? "badge-success bg-[#d1f0e0] text-[#1a6640]" :
                          um.status === "VERIFIED" ? "badge-info bg-[#dbeafe] text-[#1e3a8a]" :
                          "badge-warning bg-[#fde8c0] text-[#7a4e10]"
                        }`}>{um.status}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  // Mockup Fallback
                  <>
                    <div className="mission-item flex items-center justify-between pb-3 border-b border-[#f0ebe3]">
                      <div className="flex items-center gap-3">
                        <div className="mission-icon w-8 h-8 rounded-lg bg-[#ffe8f0] flex items-center justify-center text-sm flex-shrink-0">🧠</div>
                        <div>
                          <div className="mission-title text-xs font-bold text-[#1a1209]">Growth Mindset 30 วัน</div>
                          <div className="mission-cat text-[9px] text-[#9a8a72] uppercase font-bold tracking-wider mt-0.5">Mindset</div>
                        </div>
                      </div>
                      <span className="badge text-[10px] font-bold px-2 py-0.5 rounded-md badge-warning bg-[#fde8c0] text-[#7a4e10]">In Progress</span>
                    </div>
                    <div className="mission-item flex items-center justify-between pb-3 border-b border-[#f0ebe3]">
                      <div className="flex items-center gap-3">
                        <div className="mission-icon w-8 h-8 rounded-lg bg-[#e8f0ff] flex items-center justify-center text-sm flex-shrink-0">🎯</div>
                        <div>
                          <div className="mission-title text-xs font-bold text-[#1a1209]">Pitch Like a Pro</div>
                          <div className="mission-cat text-[9px] text-[#9a8a72] uppercase font-bold tracking-wider mt-0.5">Skillset</div>
                        </div>
                      </div>
                      <span className="badge text-[10px] font-bold px-2 py-0.5 rounded-md badge-success bg-[#d1f0e0] text-[#1a6640]">Completed</span>
                    </div>
                    <div className="mission-item flex items-center justify-between pb-3 border-b border-[#f0ebe3] last:border-b-0 last:pb-0">
                      <div className="flex items-center gap-3">
                        <div className="mission-icon w-8 h-8 rounded-lg bg-[#e8fff0] flex items-center justify-center text-sm flex-shrink-0">🛠️</div>
                        <div>
                          <div className="mission-title text-xs font-bold text-[#1a1209]">AI Tools Mastery</div>
                          <div className="mission-cat text-[9px] text-[#9a8a72] uppercase font-bold tracking-wider mt-0.5">Toolset</div>
                        </div>
                      </div>
                      <span className="badge text-[10px] font-bold px-2 py-0.5 rounded-md badge-info bg-[#dbeafe] text-[#1e3a8a]">Verified</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* UBC Level Progress */}
          <div className="card-base bg-white border border-[#e8e2d9] rounded-xl p-4 shadow-sm">
            <div className="card-header flex items-center justify-between mb-4">
              <span className="card-title font-display font-bold text-sm text-[#1a1209]">UBC Level Progress</span>
              <span className="text-xs font-bold text-[#b8924a] bg-[#fef6ea] px-2 py-0.5 rounded-full border border-[#f5e2c0]">
                Level {level} · {levelLabels[level]}
              </span>
            </div>
            <div className="ubc-bar-wrap space-y-4">
              <div>
                <div className="ubc-row flex items-center justify-between text-xs mb-1.5">
                  <span className="ubc-label text-[#6b5e4a] font-medium">Mindset Development</span>
                  <span className="ubc-val text-[#b8924a] font-bold">82%</span>
                </div>
                <div className="progress-track bg-[#fef6ea] h-1.5 rounded-full overflow-hidden">
                  <div className="progress-fill bg-[#b8924a] h-full rounded-full" style={{ width: "82%" }} />
                </div>
              </div>
              <div>
                <div className="ubc-row flex items-center justify-between text-xs mb-1.5">
                  <span className="ubc-label text-[#6b5e4a] font-medium">Skillset Development</span>
                  <span className="ubc-val text-[#b8924a] font-bold">67%</span>
                </div>
                <div className="progress-track bg-[#fef6ea] h-1.5 rounded-full overflow-hidden">
                  <div className="progress-fill bg-[#b8924a] h-full rounded-full" style={{ width: "67%" }} />
                </div>
              </div>
              <div>
                <div className="ubc-row flex items-center justify-between text-xs mb-1.5">
                  <span className="ubc-label text-[#6b5e4a] font-medium">Toolset Development</span>
                  <span className="ubc-val text-[#b8924a] font-bold">55%</span>
                </div>
                <div className="progress-track bg-[#fef6ea] h-1.5 rounded-full overflow-hidden">
                  <div className="progress-fill bg-[#b8924a] h-full rounded-full" style={{ width: "55%" }} />
                </div>
              </div>
            </div>
          </div>

          {/* เครื่องมือและระบบงาน (Business Tools Hub) */}
          <div className="card-base bg-white border border-[#e8e2d9] rounded-xl p-4 shadow-sm">
            <div className="card-header flex items-center justify-between mb-4">
              <span className="card-title font-display font-bold text-sm text-[#1a1209]">เครื่องมือและระบบงาน</span>
            </div>
            <div className="tools-grid grid grid-cols-2 gap-3">
              <Link href="/startup" className="tool-card border border-[#e8e2d9] rounded-lg p-3 flex items-center gap-3 transition-all hover:bg-[#fef6ea] hover:border-[#d4a96e] bg-[#fdfbf7]/50">
                <span className="tool-icon text-2xl">🚀</span>
                <div>
                  <div className="tool-name text-xs font-bold text-[#1a1209]">5 เริ่มต้น</div>
                  <div className="tool-desc text-[9px] text-[#9a8a72] mt-0.5">ภารกิจสำหรับนักธุรกิจใหม่</div>
                </div>
              </Link>
              <Link href="/products" className="tool-card border border-[#e8e2d9] rounded-lg p-3 flex items-center gap-3 transition-all hover:bg-[#fef6ea] hover:border-[#d4a96e] bg-[#fdfbf7]/50">
                <span className="tool-icon text-2xl">📦</span>
                <div>
                  <div className="tool-name text-xs font-bold text-[#1a1209]">คลังสินค้า</div>
                  <div className="tool-desc text-[9px] text-[#9a8a72] mt-0.5">นวัตกรรมและการคำนวณ</div>
                </div>
              </Link>
              <Link href="/knowledge" className="tool-card border border-[#e8e2d9] rounded-lg p-3 flex items-center gap-3 transition-all hover:bg-[#fef6ea] hover:border-[#d4a96e] bg-[#fdfbf7]/50">
                <span className="tool-icon text-2xl">📚</span>
                <div>
                  <div className="tool-name text-xs font-bold text-[#1a1209]">คลังความรู้</div>
                  <div className="tool-desc text-[9px] text-[#9a8a72] mt-0.5">สไลด์ วิดีโอ และสื่อการตลาด</div>
                </div>
              </Link>
              <Link href="/functions" className="tool-card border border-[#e8e2d9] rounded-lg p-3 flex items-center gap-3 transition-all hover:bg-[#fef6ea] hover:border-[#d4a96e] bg-[#fdfbf7]/50">
                <span className="tool-icon text-2xl">📅</span>
                <div>
                  <div className="tool-name text-xs font-bold text-[#1a1209]">ฟังก์ชั่นระบบ</div>
                  <div className="tool-desc text-[9px] text-[#9a8a72] mt-0.5">ปฏิทินงานและการเคลื่อนคน</div>
                </div>
              </Link>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card-base bg-white border border-[#e8e2d9] rounded-xl p-4 shadow-sm">
            <div className="card-header flex items-center justify-between mb-4">
              <span className="card-title font-display font-bold text-sm text-[#1a1209]">Quick Actions</span>
            </div>
            <div className="quick-grid grid grid-cols-3 gap-2">
              <Link href="/ai-coach" className="quick-btn bg-[#f7f4ef] border border-[#ece6dc] rounded-lg p-3 text-center hover:border-[#d4a96e] hover:bg-[#fef6ea] transition-all flex flex-col items-center">
                <span className="quick-btn-icon text-lg mb-1">🤖</span>
                <span className="quick-btn-label text-[10px] font-bold text-[#6b5e4a]">ถามน้องยูนิ</span>
              </Link>
              <Link href="/profile" className="quick-btn bg-[#f7f4ef] border border-[#ece6dc] rounded-lg p-3 text-center hover:border-[#d4a96e] hover:bg-[#fef6ea] transition-all flex flex-col items-center">
                <span className="quick-btn-icon text-lg mb-1">🔗</span>
                <span className="quick-btn-label text-[10px] font-bold text-[#6b5e4a]">Referral Link</span>
              </Link>
              <Link href="/profile" className="quick-btn bg-[#f7f4ef] border border-[#ece6dc] rounded-lg p-3 text-center hover:border-[#d4a96e] hover:bg-[#fef6ea] transition-all flex flex-col items-center">
                <span className="quick-btn-icon text-lg mb-1">🪪</span>
                <span className="quick-btn-label text-[10px] font-bold text-[#6b5e4a]">Name Card</span>
              </Link>
              <button className="quick-btn bg-[#f7f4ef] border border-[#ece6dc] rounded-lg p-3 text-center hover:border-[#d4a96e] hover:bg-[#fef6ea] transition-all flex flex-col items-center">
                <span className="quick-btn-icon text-lg mb-1">📊</span>
                <span className="quick-btn-label text-[10px] font-bold text-[#6b5e4a]">รายงาน</span>
              </button>
              <Link href="/missions" className="quick-btn bg-[#f7f4ef] border border-[#ece6dc] rounded-lg p-3 text-center hover:border-[#d4a96e] hover:bg-[#fef6ea] transition-all flex flex-col items-center">
                <span className="quick-btn-icon text-lg mb-1">🎯</span>
                <span className="quick-btn-label text-[10px] font-bold text-[#6b5e4a]">New Mission</span>
              </Link>
              <Link href="/dna" className="quick-btn bg-[#f7f4ef] border border-[#ece6dc] rounded-lg p-3 text-center hover:border-[#d4a96e] hover:bg-[#fef6ea] transition-all flex flex-col items-center">
                <span className="quick-btn-icon text-lg mb-1">🧬</span>
                <span className="quick-btn-label text-[10px] font-bold text-[#6b5e4a]">DNA Quiz</span>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </MemberLayout>
  );
}
