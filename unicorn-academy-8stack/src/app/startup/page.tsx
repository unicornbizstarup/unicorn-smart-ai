import { createServerSupabase } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import type { Profile } from "@/types";
import MemberLayout from "@/components/layout/MemberLayout";
import Link from "next/link";

export const runtime = "edge";

interface StartupStep {
  num: number;
  title: string;
  sub: string;
  videoUrl?: string;
  defaultStatus: "COMPLETED" | "TO_DO";
}

const STARTUP_STEPS: StartupStep[] = [
  {
    num: 1,
    title: "ศึกษาลิงค์ธุรกิจ",
    sub: "Unicorn Link / Dashboard ส่วนตัวของคุณ",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    defaultStatus: "COMPLETED",
  },
  {
    num: 2,
    title: "เริ่มใช้สินค้าและสะสมยอดขาย",
    sub: "สะสมครบ 2,000 PV เพื่อสิทธิ์ตำแหน่งสูงสุดและสถิตินักธุรกิจพรีเมียม",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    defaultStatus: "COMPLETED",
  },
  {
    num: 3,
    title: "เรียนรู้ระบบ 4-5-6",
    sub: "เข้าร่วมฝึกอบรม Unicorn Academy ทั้งแบบออนไลน์และงานกิจกรรมจริง",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    defaultStatus: "TO_DO",
  },
  {
    num: 4,
    title: "เริ่มใช้งาน Unicorn Smart AI",
    sub: "เปิดใช้งานน้องยูนิ (AI Coach) เพื่อช่วยวางแผนและขยายเครือข่ายธุรกิจ 24 ชั่วโมง",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    defaultStatus: "TO_DO",
  },
  {
    num: 5,
    title: "ก้าวสู่ตำแหน่ง Super Star",
    sub: "สร้างเป้าหมายรายได้ 60,000 บาท/วัน และแผนงานเกษียณที่ใฝ่ฝัน",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    defaultStatus: "TO_DO",
  },
];

export default async function StartupPage() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single<Profile>();

  // Count done steps
  const completedCount = STARTUP_STEPS.filter(s => s.defaultStatus === "COMPLETED").length;
  const progressPercent = (completedCount / STARTUP_STEPS.length) * 100;

  return (
    <MemberLayout
      profile={profile}
      title="5 Start-up"
      subtitle="ขั้นตอนก้าวแรกสู่ความสำเร็จอย่างเป็นระบบสำหรับนักธุรกิจมือใหม่"
    >
      <div className="space-y-6 max-w-4xl">
        {/* ── Hero Banner ── */}
        <div className="p1-hero relative bg-gradient-to-br from-[#0f1f3d] to-[#1e3a6a] p-6 rounded-2xl text-white overflow-hidden shadow-md">
          {/* Subtle decoration elements */}
          <div className="absolute top-[-30px] right-[-30px] w-28 h-28 rounded-full bg-[#c9a96e]/10 pointer-events-none" />
          <div className="absolute bottom-[-20px] left-[-20px] w-24 h-24 rounded-full bg-[#c9a96e]/5 pointer-events-none" />

          <div className="p1-badge inline-flex items-center gap-1.5 bg-[#c9a96e]/20 border border-[#c9a96e]/40 rounded-full px-3 py-0.5 text-[10px] font-bold tracking-wider text-[#c9a96e] mb-3 uppercase">
            <span>●</span> BIZ START UP PLATFORM
          </div>
          
          <h2 className="text-3xl font-black text-white leading-tight mb-2">
            5 <span className="text-[#c9a96e]">START-UP</span>
          </h2>
          <p className="text-white/70 text-xs leading-relaxed max-w-lg">
            จุดเริ่มต้นที่เป็นระบบและปลอดภัยสำหรับที่ปรึกษาธุรกิจรุ่นใหม่ 
            เคลียร์ภารกิจทีละสเต็ปเพื่อรับรางวัลเกียรติยศและปูฐานรากในการขยายองค์กรอย่างยั่งยืน
          </p>

          <div className="absolute top-6 right-6 w-12 h-12 rounded-xl bg-[#c9a96e]/20 border border-[#c9a96e]/40 flex items-center justify-center text-xl shadow-inner pointer-events-none">
            💡
          </div>
        </div>

        {/* ── Steps List ── */}
        <div className="step-list space-y-4">
          {STARTUP_STEPS.map((step) => {
            const isDone = step.defaultStatus === "COMPLETED";
            return (
              <div key={step.num} className="step-item bg-white border border-[#e8e2d9] rounded-xl p-4 flex gap-4 items-start shadow-sm hover:border-[#d6cfc4] transition-all">
                {/* Step Circle */}
                <div className={`step-num w-9 h-9 rounded-full flex items-center justify-center font-black text-sm flex-shrink-0 transition-colors ${
                  isDone ? "bg-green-600 text-white" : "bg-[#1a1209] text-white"
                }`}>
                  {isDone ? "✓" : step.num}
                </div>

                {/* Step Body */}
                <div className="step-body flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div>
                      <h3 className="step-title font-bold text-sm text-[#1a1209]">{step.title}</h3>
                      <p className="step-sub text-xs text-[#9a8a72] mt-0.5">{step.sub}</p>
                    </div>
                    
                    {/* Status Badge */}
                    <div className="step-status flex-shrink-0 self-start sm:self-center">
                      {isDone ? (
                        <span className="badge-done bg-[#dcfce7] text-[#166534] text-[10px] font-black rounded-md px-2.5 py-0.5 flex items-center gap-1">
                          ✓ COMPLETED
                        </span>
                      ) : (
                        <span className="badge-todo bg-[#f3f4f6] text-[#6b7280] text-[10px] font-bold rounded-md px-2.5 py-0.5">
                          TO DO
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions Row */}
                  <div className="step-actions flex gap-3 items-center flex-wrap mt-3">
                    <button className="btn-dark bg-[#1a1209] text-white border-none rounded-lg px-3 py-1.5 text-xs font-semibold hover:bg-black transition-colors flex items-center gap-1.5">
                      <span>▶</span> ดูวิดีโอสอนงาน
                    </button>
                    <button className="btn-link text-xs text-[#6b5e4a] hover:text-[#1a1209] font-bold transition-colors flex items-center gap-1">
                      อ่านรายละเอียดภารกิจ →
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Reward Box ── */}
        <div className="p1-reward bg-white border border-[#e8e2d9] rounded-xl p-4 flex gap-4 items-center shadow-sm">
          <div className="reward-icon w-12 h-12 bg-[#fef6ea] rounded-xl flex items-center justify-center text-2xl border border-[#f5e2c0] flex-shrink-0 shadow-inner">
            🏆
          </div>
          <div className="reward-text text-xs text-[#6b5e4a] leading-relaxed">
            <strong className="text-[#1a1209] text-sm font-bold block mb-0.5">รางวัลความพยายามยอดเยี่ยม</strong>
            ทำภารกิจสะสมครบทั้ง 5 ขั้นตอนสำเร็จเพื่อปลดล็อกเข็มกลัดเกียรติยศ{" "}
            <strong className="text-[#b8924a] font-black">Virtual Super Star</strong> ประดับบนหน้านามบัตรดิจิทัลของคุณและรับคะแนนโบนัสสะสมทันที!
          </div>
        </div>
      </div>
    </MemberLayout>
  );
}
