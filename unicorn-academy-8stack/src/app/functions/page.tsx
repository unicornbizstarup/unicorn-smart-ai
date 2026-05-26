import { createServerSupabase } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import Link from "next/link";
import type { Profile } from "@/types";
import MemberLayout from "@/components/layout/MemberLayout";

interface FunctionEvent {
  frequency: "DAILY" | "WEEKLY" | "MONTHLY" | "QUARTERLY";
  frequencyLabel: string;
  badgeBg: string;
  dotColor: string;
  title: string;
  location: string;
  audience: string;
}

const FUNCTION_EVENTS: FunctionEvent[] = [
  {
    frequency: "DAILY",
    frequencyLabel: "กิจกรรมรายวัน",
    badgeBg: "bg-[#4169e1] text-white",
    dotColor: "bg-[#4169e1]",
    title: "Morning Call ประเมินแผนรายวัน",
    location: "ZOOM / LINE LIVE",
    audience: "กลุ่มผู้ฝึกสอนและสมาชิกทีมงาน"
  },
  {
    frequency: "WEEKLY",
    frequencyLabel: "กิจกรรมรายสัปดาห์",
    badgeBg: "bg-[#f5a623] text-white",
    dotColor: "bg-[#f5a623]",
    title: "Weekly Product & Skill Workshop",
    location: "ZOOM MEETING / ออฟฟิศ",
    audience: "สมาชิกร่วมธุรกิจ 100+ ท่าน"
  },
  {
    frequency: "MONTHLY",
    frequencyLabel: "กิจกรรมรายเดือน",
    badgeBg: "bg-[#9b59b6] text-white",
    dotColor: "bg-[#9b59b6]",
    title: "Monthly Recognition & Success Goal",
    location: "ZOOM / โรงแรมจัดประชุม",
    audience: "ผู้มุ่งหวังและสมาชิก 500+ ท่าน"
  },
  {
    frequency: "QUARTERLY",
    frequencyLabel: "กิจกรรมรายไตรมาส",
    badgeBg: "bg-[#1e3a6a] text-white",
    dotColor: "bg-[#1e3a6a]",
    title: "Grand Convention & VIP Seminars",
    location: "หอประชุมใหญ่ภาคกลาง / ต่างประเทศ",
    audience: "ผู้นำและนักธุรกิจระดับสูง 1,000+ ท่าน"
  }
];

export default async function FunctionsPage() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single<Profile>();

  return (
    <MemberLayout
      profile={profile}
      title="Function to Function"
      subtitle="ระบบการเคลื่อนและยกระดับผู้คนผ่านงานกิจกรรมรายวัน รายสัปดาห์ รายเดือน และรายไตรมาส"
    >
      <div className="space-y-6 max-w-5xl">
        {/* ── Subtitle Tag ── */}
        <div className="text-center pb-2">
          <div className="p4-badge-pill inline-flex items-center gap-1.5 bg-[#f5e2c0] border border-[#b8924a] rounded-full px-4 py-1 text-[10px] font-black tracking-wider text-[#a07c38] mb-3 uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#b8924a]" /> SYSTEM STRATEGY
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#1a1209] italic leading-tight">
            Function <span className="text-[#b8924a] font-normal not-italic">to Function</span>
          </h2>
          <p className="text-[#9a8a72] text-xs max-w-sm mx-auto mt-2 leading-relaxed">
            ขับเคลื่อนระบบธุรกิจอย่างเป็นขั้นเป็นตอน 
            ใช้แรงเหวี่ยงจากห้องกิจกรรมเพื่อสร้างนักธุรกิจมืออาชีพที่เติบโตรวดเร็ว
          </p>
        </div>

        {/* ── Grid 4 Columns ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FUNCTION_EVENTS.map((event) => (
            <div key={event.frequency} className="flex flex-col space-y-3">
              {/* Header Title Card */}
              <div className={`fn-header-card ${event.badgeBg} rounded-xl p-4 text-center shadow-sm`}>
                <span className="fn-freq text-base font-black italic tracking-wide block">{event.frequency}</span>
                <span className="fn-sub text-[9.5px] opacity-90 font-bold block mt-0.5">{event.frequencyLabel}</span>
              </div>

              {/* Event Content Card */}
              <div className="fn-card bg-white border border-[#e8e2d9] rounded-xl p-4 flex-1 flex flex-col justify-between space-y-4 shadow-sm hover:border-[#d6cfc4] transition-colors">
                <div className="space-y-3">
                  <div className="flex gap-2 items-start">
                    <span className={`fn-dot ${event.dotColor} w-2 h-2 rounded-full mt-1.5 flex-shrink-0`} />
                    <h3 className="fn-event-title font-bold text-xs sm:text-sm text-[#1a1209] leading-snug">{event.title}</h3>
                  </div>
                  
                  <div className="fn-event-meta flex flex-col gap-1 text-[10px] text-[#9a8a72] font-semibold">
                    <div className="flex items-center gap-1.5">
                      <span>🕐</span> {event.location}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span>👥</span> {event.audience}
                    </div>
                  </div>
                </div>

                <Link
                  href="#"
                  className="fn-link text-xs font-bold text-[#6b5e4a] hover:text-[#1a1209] flex items-center gap-1 transition-colors bg-transparent border-none cursor-pointer self-start"
                >
                  ดูตารางเวลาและเข้าร่วม <span className="text-[9px] text-[#9a8a72]">↗</span>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* ── Monthly Calendar Banner ── */}
        <div className="p-4 bg-gradient-to-r from-[#0f1f3d] to-[#1e3a6a] rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 text-white shadow-md">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <span className="text-3xl">📅</span>
            <div>
              <h3 className="text-sm font-bold text-white mb-0.5">ปฏิทินกิจกรรมและการฝึกอบรมประจำเดือน</h3>
              <p className="text-[11px] text-white/70">ดูกำหนดการล่วงหน้าเพื่อเตรียมระบบและทำการส่งทีมงานเข้าร่วมห้องเรียน</p>
            </div>
          </div>
          
          <Link
            href="#"
            className="bg-[#c9a96e] hover:bg-[#a07c38] text-white font-bold text-xs rounded-lg px-4 py-2 border-none cursor-pointer transition-colors shadow-sm self-stretch sm:self-center text-center flex items-center justify-center"
          >
            ดูปฏิทินภาพรวม →
          </Link>
        </div>
      </div>
    </MemberLayout>
  );
}
