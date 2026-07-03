import { useLoaderData, Link } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { ChevronLeft } from "lucide-react";
import { createServerSupabase, requireUser } from "@/lib/supabase-server";
import type { Profile } from "@/types";
import MemberLayout from "@/components/layout/MemberLayout";

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

export function meta() {
  return [
    { title: "5 Start-up (เริ่มต้นทำธุรกิจ) — Unicorn Smart AI" },
    { name: "description", content: "ขั้นตอนเริ่มต้นสำหรับนักธุรกิจพาร์ทเนอร์มือใหม่สู่อัจฉริยะระบบงาน" },
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

  return { profile };
}

export default function StartupPage() {
  const { profile } = useLoaderData<typeof loader>();

  return (
    <MemberLayout
      profile={profile}
      title="5 Start-up"
      subtitle="ขั้นตอนก้าวแรกสู่ความสำเร็จอย่างเป็นระบบสำหรับนักธุรกิจมือใหม่"
    >
      <div className="space-y-6 max-w-4xl font-body text-text-primary">
        {/* Navigation Header */}
        <div className="flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-1.5 text-text-secondary hover:text-brand-gold font-semibold text-xs transition-colors">
            <ChevronLeft size={16} />
            <span>กลับหน้าแดชบอร์ด</span>
          </Link>
          <span className="text-brand-gold font-bold tracking-wider text-[10px] uppercase bg-brand-gold-light/40 px-3 py-1 rounded-full border border-brand-gold-muted/20">
            Startup Guides
          </span>
        </div>

        {/* Hero Banner (Light Theme v2 variant with Premium Dark Accent) */}
        <div className="relative bg-gradient-to-br from-brand-dark to-[#2c1d0c] p-6 md:p-8 rounded-3xl text-white overflow-hidden shadow-md">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 space-y-2.5 max-w-xl">
            <div className="inline-flex items-center gap-1.5 bg-brand-gold/20 border border-brand-gold/30 rounded-full px-3 py-0.5 text-[9px] font-bold tracking-wider text-brand-gold-light uppercase">
              <span>●</span> BIZ START UP PLATFORM
            </div>
            
            <h2 className="text-2xl md:text-3xl font-display text-white">
              5 <span className="text-brand-gold">START-UP</span>
            </h2>
            <p className="text-gray-300 text-xs md:text-sm leading-relaxed">
              จุดเริ่มต้นที่เป็นระบบและปลอดภัยสำหรับที่ปรึกษาธุรกิจรุ่นใหม่ 
              เคลียร์ภารกิจทีละสเต็ปเพื่อรับรางวัลเกียรติยศและปูรากฐานในการขยายองค์กรอย่างยั่งยืน
            </p>
          </div>

          <div className="absolute top-6 right-6 w-12 h-12 rounded-2xl bg-brand-gold/20 border border-brand-gold/40 flex items-center justify-center text-xl shadow-inner select-none pointer-events-none">
            🚀
          </div>
        </div>

        {/* Steps List */}
        <div className="space-y-4">
          {STARTUP_STEPS.map((step) => {
            const isDone = step.defaultStatus === "COMPLETED";
            return (
              <div key={step.num} className="bg-white border border-border-default rounded-2xl p-5 flex gap-4 items-start shadow-sm hover:border-brand-gold-muted transition-all">
                {/* Step Circle */}
                <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0 transition-colors ${
                  isDone ? "bg-emerald-600 text-white" : "bg-brand-dark text-white"
                }`}>
                  {isDone ? "✓" : step.num}
                </div>

                {/* Step Body */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div>
                      <h3 className="font-bold text-sm text-text-primary">{step.title}</h3>
                      <p className="text-xs text-text-muted mt-0.5">{step.sub}</p>
                    </div>
                    
                    {/* Status Badge */}
                    <div className="shrink-0 self-start sm:self-center">
                      {isDone ? (
                        <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-bold rounded-md px-2.5 py-0.5 flex items-center gap-1">
                          ✓ COMPLETED
                        </span>
                      ) : (
                        <span className="bg-bg-input text-text-muted border border-border-default text-[10px] font-bold rounded-md px-2.5 py-0.5">
                          TO DO
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions Row */}
                  <div className="flex gap-3 items-center flex-wrap mt-3">
                    <button className="bg-brand-dark text-white border-none rounded-lg px-3.5 py-1.5 text-xs font-semibold hover:bg-black transition-colors flex items-center gap-1.5 shadow-sm">
                      <span>▶</span> ดูวิดีโอสอนงาน
                    </button>
                    <button className="text-xs text-text-secondary hover:text-brand-gold font-bold transition-colors flex items-center gap-1">
                      อ่านรายละเอียดภารกิจ →
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Reward Box */}
        <div className="bg-white border border-border-default rounded-2xl p-5 flex gap-4 items-center shadow-sm">
          <div className="w-12 h-12 bg-brand-gold-light/40 rounded-2xl flex items-center justify-center text-2xl border border-brand-gold-muted/20 shrink-0 shadow-sm">
            🏆
          </div>
          <div className="text-xs text-text-secondary leading-relaxed">
            <strong className="text-text-primary text-sm font-bold block mb-0.5">รางวัลความพยายามยอดเยี่ยม</strong>
            ทำภารกิจสะสมครบทั้ง 5 ขั้นตอนสำเร็จเพื่อปลดล็อกเข็มกลัดเกียรติยศ{" "}
            <strong className="text-brand-gold font-black">Virtual Super Star</strong> ประดับบนหน้านามบัตรดิจิทัลของคุณและรับคะแนนโบนัสสะสมทันที!
          </div>
        </div>
      </div>
    </MemberLayout>
  );
}
