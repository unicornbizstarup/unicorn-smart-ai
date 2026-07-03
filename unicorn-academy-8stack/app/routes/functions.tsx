import { useLoaderData, Link } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { ChevronLeft, Calendar as CalendarIcon, Users, MapPin } from "lucide-react";
import { createServerSupabase, requireUser } from "@/lib/supabase-server";
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
    badgeBg: "bg-blue-600 text-white",
    dotColor: "bg-blue-500",
    title: "Morning Call ประเมินแผนรายวัน",
    location: "ZOOM / LINE LIVE",
    audience: "กลุ่มผู้ฝึกสอนและสมาชิกทีมงาน"
  },
  {
    frequency: "WEEKLY",
    frequencyLabel: "กิจกรรมรายสัปดาห์",
    badgeBg: "bg-amber-500 text-white",
    dotColor: "bg-amber-500",
    title: "Weekly Product & Skill Workshop",
    location: "ZOOM MEETING / ออฟฟิศ",
    audience: "สมาชิกร่วมธุรกิจ 100+ ท่าน"
  },
  {
    frequency: "MONTHLY",
    frequencyLabel: "กิจกรรมรายเดือน",
    badgeBg: "bg-purple-600 text-white",
    dotColor: "bg-purple-500",
    title: "Monthly Recognition & Success Goal",
    location: "ZOOM / โรงแรมจัดประชุม",
    audience: "ผู้มุ่งหวังและสมาชิก 500+ ท่าน"
  },
  {
    frequency: "QUARTERLY",
    frequencyLabel: "กิจกรรมรายไตรมาส",
    badgeBg: "bg-brand-dark text-white",
    dotColor: "bg-brand-gold",
    title: "Grand Convention & VIP Seminars",
    location: "หอประชุมใหญ่ภาคกลาง / ต่างประเทศ",
    audience: "ผู้นำและนักธุรกิจระดับสูง 1,000+ ท่าน"
  }
];

export function meta() {
  return [
    { title: "Function to Function (ระบบการเคลื่อนคน) — Unicorn Smart AI" },
    { name: "description", content: "ระบบการเคลื่อนและยกระดับผู้คนผ่านงานกิจกรรมของทางบริษัท" },
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

export default function FunctionsPage() {
  const { profile } = useLoaderData<typeof loader>();

  return (
    <MemberLayout
      profile={profile}
      title="Function to Function"
      subtitle="ระบบการเคลื่อนและยกระดับผู้คนผ่านงานกิจกรรมรายวัน รายสัปดาห์ รายเดือน และรายไตรมาส"
    >
      <div className="space-y-6 max-w-5xl font-body text-text-primary">
        {/* Navigation & Header */}
        <div className="flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-1.5 text-text-secondary hover:text-brand-gold font-semibold text-xs transition-colors">
            <ChevronLeft size={16} />
            <span>กลับหน้าแดชบอร์ด</span>
          </Link>
          <span className="text-brand-gold font-bold tracking-wider text-[10px] uppercase bg-brand-gold-light/40 px-3 py-1 rounded-full border border-brand-gold-muted/20">
            System Strategy
          </span>
        </div>

        {/* Title Tag */}
        <div className="text-center pb-4 max-w-md mx-auto">
          <div className="inline-flex items-center gap-1.5 bg-brand-gold-light/40 border border-brand-gold-muted/20 rounded-full px-4 py-1.5 text-[10px] font-black tracking-wider text-brand-gold mb-3 uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-gold" /> SYSTEM STRATEGY
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-bold leading-tight text-text-primary">
            Function <span className="text-brand-gold font-normal">to Function</span>
          </h2>
          <p className="text-text-muted text-xs mt-2 leading-relaxed">
            ขับเคลื่อนระบบธุรกิจอย่างเป็นขั้นเป็นตอน ใช้แรงเหวี่ยงจากห้องกิจกรรมเพื่อสร้างนักธุรกิจมืออาชีพที่เติบโตรวดเร็วและยั่งยืน
          </p>
        </div>

        {/* Grid 4 Columns */}
        <div className="grid grid-cols-1 gap-4">
          {FUNCTION_EVENTS.map((event) => (
            <div key={event.frequency} className="flex flex-col space-y-3">
              {/* Header Title Card */}
              <div className={`${event.badgeBg} rounded-2xl p-4.5 text-center shadow-sm select-none`}>
                <span className="text-lg font-display font-bold italic tracking-wide block">{event.frequency}</span>
                <span className="text-[10px] opacity-90 font-bold block mt-0.5">{event.frequencyLabel}</span>
              </div>

              {/* Event Content Card */}
              <div className="bg-white border border-border-default rounded-2xl p-5 flex-1 flex flex-col justify-between space-y-5 shadow-sm hover:border-brand-gold-muted hover:shadow-md transition-all">
                <div className="space-y-4">
                  <div className="flex gap-2 items-start">
                    <span className={`${event.dotColor} w-2.5 h-2.5 rounded-full mt-1.5 shrink-0`} />
                    <h3 className="font-bold text-xs sm:text-sm text-text-primary leading-snug">{event.title}</h3>
                  </div>
                  
                  <div className="flex flex-col gap-2 text-[10px] text-text-muted font-bold">
                    <div className="flex items-center gap-1.5">
                      <MapPin size={12} className="text-brand-gold" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users size={12} className="text-brand-gold" />
                      <span>{event.audience}</span>
                    </div>
                  </div>
                </div>

                <Link
                  to="#"
                  className="text-xs font-bold text-text-secondary hover:text-brand-gold flex items-center gap-1 transition-colors bg-transparent border-none cursor-pointer self-start"
                >
                  ดูตารางเวลาและเข้าร่วม <span className="text-[9px] text-text-muted">↗</span>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Monthly Calendar Banner */}
        <div className="p-5 bg-gradient-to-br from-brand-dark to-[#2c1d0c] rounded-2xl flex flex-col items-center gap-4 text-white shadow-md text-center">
          <div className="flex flex-col items-center gap-2">
            <span className="text-3xl select-none">📅</span>
            <div>
              <h3 className="text-sm font-bold !text-white mb-1">ปฏิทินกิจกรรมและการฝึกอบรมประจำเดือน</h3>
              <p className="text-[11px] text-gray-300 leading-relaxed">ดูกำหนดการล่วงหน้าเพื่อเตรียมระบบและทำการส่งทีมงานเข้าร่วมห้องเรียน</p>
            </div>
          </div>
          
          <Link
            to="#"
            className="w-full bg-brand-gold hover:bg-brand-gold-hover text-white font-bold text-xs rounded-xl py-2.5 transition-all text-center flex items-center justify-center shadow-sm"
          >
            ดูปฏิทินภาพรวม →
          </Link>
        </div>
      </div>
    </MemberLayout>
  );
}
