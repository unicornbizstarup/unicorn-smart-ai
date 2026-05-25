"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Trophy,
  Award,
  BookOpen,
  Sparkles,
  Play,
  CheckCircle2,
  AlertCircle,
  Loader2,
  TrendingUp,
  Clock,
  Send,
  Zap,
  ChevronLeft,
} from "lucide-react";
import { createClient } from "@/lib/supabase";
import Link from "next/link";

interface Mission {
  id: string;
  ubc_level: 1 | 2 | 3 | 4;
  title: string;
  description: string;
  category: "MINDSET" | "SKILLSET" | "TOOLSET";
  reward_points: number;
}

interface UserMission {
  id: string;
  user_id: string;
  mission_id: string;
  status: "IN_PROGRESS" | "COMPLETED" | "VERIFIED";
  completed_at: string | null;
  mission?: Mission;
}

const DEFAULT_MISSIONS: Omit<Mission, "id">[] = [
  // Level 1: Foundation
  {
    ubc_level: 1,
    title: "วิสัยทัศน์และ 5 WHY ของที่ปรึกษายูนิคอร์น",
    description: "ศึกษาประวัติ วิสัยทัศน์บริษัท แผนรายได้ และวิเคราะห์เหตุผล 5 WHY ของการตัดสินใจทำธุรกิจเพื่อสร้างรากฐานผู้นำ",
    category: "MINDSET",
    reward_points: 100,
  },
  {
    ubc_level: 1,
    title: "Product Storytelling และพื้นฐาน STP",
    description: "ฝึกฝนการเล่าเรื่องสินค้า (U4 Innovation) และสร้างบทพูดแนะนำธุรกิจเชิงรับ (STP) เพื่อเริ่มการขยายความสัมพันธ์",
    category: "SKILLSET",
    reward_points: 150,
  },
  {
    ubc_level: 1,
    title: "เปิดใช้งาน Digital Name Card และ AI Coach",
    description: "กรอกข้อมูลประวัติธุรกิจของคุณเพื่อทำนามบัตรดิจิทัล พร้อมทดลองแชทโต้ตอบข้อโต้แย้งกับโค้ชน้องยูนิ AI",
    category: "TOOLSET",
    reward_points: 200,
  },
  // Level 2: Specialist
  {
    ubc_level: 2,
    title: "วิเคราะห์สไตล์ความรวยด้วย Wealth DNA",
    description: "ประเมินวันและเวลาเกิดเพื่อถอดรหัสความรวยตามธาตุเจ้าเรือน และสร้างภาพลักษณ์ (Personal Branding) ให้เหมาะกับตนเอง",
    category: "MINDSET",
    reward_points: 200,
  },
  {
    ubc_level: 2,
    title: "TikTok & Reels Content Creator",
    description: "สร้างคอนเทนต์วิดีโอสั้น นำเสนอสินค้าหรือไลฟ์สไตล์ เพื่อสร้างผู้สนใจรายใหม่ (Lead Generation) ด้วยเทคนิคที่ได้เรียนรู้",
    category: "SKILLSET",
    reward_points: 250,
  },
  {
    ubc_level: 2,
    title: "ระบบแชร์แนะนำธุรกิจ Link-Share-Success",
    description: "ใช้เครื่องมือ One Link ของระบบในการแนะนำบอกต่อรูปแบบ 70/30 (เน้นการฟังและให้คำปรึกษามากกว่าการโน้มน้าว)",
    category: "TOOLSET",
    reward_points: 300,
  },
  // Level 3: Strategic
  {
    ubc_level: 3,
    title: "ระบบ 4-5-6 และการสร้างพี่เลี้ยงระดับ UBC 1-2",
    description: "เรียนรู้กระบวนการ Train the Trainer และการทำ AAR (After Action Review) เพื่อวางโครงสร้างส่งต่อระบบพี่เลี้ยงให้กับองค์กร",
    category: "MINDSET",
    reward_points: 400,
  },
  {
    ubc_level: 3,
    title: "จิตวิทยาผู้นำและ Data Analytics ทีม",
    description: "ศึกษาจิตวิทยาการบริหารทีม และใช้บอร์ดวิเคราะห์สถิติทีมเชิงลึกเพื่อคัดกรองสร้าง 5 Core Leader ประจำตัว",
    category: "SKILLSET",
    reward_points: 450,
  },
  {
    ubc_level: 3,
    title: "ติดตั้งระบบ Agent AI ส่วนตัวลงบน LINE OA",
    description: "เชื่อมโยงผู้ช่วยปัญญาประดิษฐ์ (Uni Agent AI) เข้ากับ Line Official Account ของคุณเพื่อสนับสนุนลูกทีมแบบ 24 ชั่วโมง",
    category: "TOOLSET",
    reward_points: 500,
  },
  // Level 4: Master
  {
    ubc_level: 4,
    title: "ระบบขยายทีมข้ามแดน Onboarding 30-90 วัน",
    description: "ออกแบบระบบต้อนรับพาร์ทเนอร์ใหม่ (Journey Architect) และวางแผนระยะยาว 90 วันเพื่อเตรียมสเกลองค์กรไปสู่สากล",
    category: "MINDSET",
    reward_points: 800,
  },
  {
    ubc_level: 4,
    title: "Workflow Automation (n8n/Make)",
    description: "เชื่อมโยง API ระบบหลังบ้าน เครื่องมือเก็บรายชื่อ และโปรแกรมอัตโนมัติ เพื่อการขยายงานแบบ Smart Work (ทำงานน้อยได้มาก)",
    category: "SKILLSET",
    reward_points: 1000,
  },
  {
    ubc_level: 4,
    title: "Servant Leadership และทักษะวิทยากรระดับสากล",
    description: "จัดสัมมนาฝึกอบรม ถ่ายทอดวิสัยทัศน์ในฐานะ System Creator และร่วมวางแผนกลยุทธ์ขยายบริษัทร่วมกับบอร์ดผู้บริหาร",
    category: "TOOLSET",
    reward_points: 1200,
  },
];

export default function MissionsPage() {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [userMissions, setUserMissions] = useState<UserMission[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<1 | 2 | 3 | 4>(1);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push("/auth/login");
          return;
        }
        setUser(user);

        // 1. ดึงข้อมูลโปรไฟล์
        let { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        // 2. ดึงภารกิจจากฐานข้อมูล
        let { data: dbMissions } = await supabase
          .from("missions")
          .select("*")
          .order("ubc_level", { ascending: true });

        // หากฐานข้อมูลไม่มีภารกิจ (เพิ่งสร้างระบบใหม่) ให้ทำการ Seed ข้อมูลเริ่มต้นให้ทันที!
        if (!dbMissions || dbMissions.length === 0) {
          const { data: inserted, error: insertError } = await supabase
            .from("missions")
            .insert(DEFAULT_MISSIONS)
            .select();

          if (insertError) throw insertError;
          dbMissions = inserted;
        }

        setMissions(dbMissions || []);

        // ตั้งค่าแท็บเริ่มต้นตามระดับของผู้ใช้ปัจจุบัน
        if (profileData) {
          setProfile(profileData);
          setActiveTab(profileData.ubc_level as 1 | 2 | 3 | 4);
        }

        // 3. ดึงความก้าวหน้าภารกิจของผู้ใช้
        const { data: userMissionsData } = await supabase
          .from("user_missions")
          .select("*")
          .eq("user_id", user.id);

        setUserMissions(userMissionsData || []);
      } catch (err) {
        console.error("Error loading mission dashboard:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const handleStartMission = async (missionId: string) => {
    if (!user) return;
    setProcessingId(missionId);
    try {
      const { data, error } = await supabase
        .from("user_missions")
        .insert({
          user_id: user.id,
          mission_id: missionId,
          status: "IN_PROGRESS",
        })
        .select()
        .single();

      if (error) throw error;

      setUserMissions((prev) => [...prev, data]);
    } catch (err: any) {
      alert(`ไม่สามารถเริ่มภารกิจได้: ${err.message}`);
    } finally {
      setProcessingId(null);
    }
  };

  const handleCompleteMission = async (missionId: string, rewardPoints: number, missionTitle: string) => {
    if (!user || !profile) return;
    setProcessingId(missionId);
    try {
      // 1. อัปเดตสถานะในตาราง user_missions
      const { data, error } = await supabase
        .from("user_missions")
        .update({
          status: "COMPLETED",
          completed_at: new Date().toISOString(),
        })
        .eq("user_id", user.id)
        .eq("mission_id", missionId)
        .select()
        .single();

      if (error) throw error;

      // 2. บวกคะแนนเพิ่มในโปรไฟล์ผู้ใช้
      const newPoints = (profile.points || 0) + rewardPoints;
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ points: newPoints })
        .eq("id", user.id);

      if (profileError) throw profileError;

      // อัปเดต UI ทันที
      setProfile((prev: any) => ({ ...prev, points: newPoints }));
      setUserMissions((prev) =>
        prev.map((um) => (um.mission_id === missionId ? { ...um, status: "COMPLETED" as const } : um))
      );

      // 3. เรียกใช้งานระบบ LINE Messaging API ในการส่งการแจ้งเตือน
      await fetch("/api/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "mission_complete",
          name: profile.full_name || "นักธุรกิจยูนิคอร์น",
          missionTitle: missionTitle,
          points: rewardPoints,
        }),
      });

      alert(`🎉 ยินดีด้วยครับ! คุณส่งภารกิจสำเร็จและรับ +${rewardPoints} คะแนนเรียบร้อยแล้ว!`);
    } catch (err: any) {
      alert(`ไม่สามารถส่งภารกิจได้: ${err.message}`);
    } finally {
      setProcessingId(null);
    }
  };

  // กรองภารกิจตามแท็บระดับ UBC ปัจจุบัน
  const filteredMissions = missions.filter((m) => m.ubc_level === activeTab);

  // คำนวณความสำเร็จระดับปัจจุบัน
  const levelMissions = missions.filter((m) => m.ubc_level === activeTab);
  const completedLevelMissions = userMissions.filter(
    (um) => um.status === "COMPLETED" && levelMissions.some((lm) => lm.id === um.mission_id)
  );
  const progressPercent =
    levelMissions.length > 0 ? Math.round((completedLevelMissions.length / levelMissions.length) * 100) : 0;

  const levelInfo = {
    1: { name: "UBC 1: Foundation (รากฐาน)", income: "500 - 15,000 บาท/เดือน", desc: "รากฐานการขายและการใช้เครื่องมือดิจิทัลเบื้องต้น" },
    2: { name: "UBC 2: Specialist (ผู้เชี่ยวชาญ)", income: "15,000 - 50,000 บาท/เดือน", desc: "การสร้างตัวตน (Personal Branding) และกลยุทธ์การตลาดดิจิทัล" },
    3: { name: "UBC 3: Strategic (นักกลยุทธ์)", income: "50,000 - 300,000 บาท/เดือน", desc: "ทักษะการบริหารทีม การเป็นโค้ช และการวิเคราะห์ข้อมูลธุรกิจ" },
    4: { name: "UBC 4: Master (ปรมาจารย์)", income: "300,000 - 3,000,000+ บาท/เดือน", desc: "การวางโครงสร้างระบบองค์กรและการเป็นผู้นำระดับสากล" },
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-dark flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 text-brand-gold animate-spin" />
          <p className="text-sm text-white/60">กำลังโหลดกระดานภารกิจระดับพรีเมียม...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-dark text-white flex flex-col justify-between">
      {/* Header */}
      <header className="px-6 py-5 max-w-7xl w-full mx-auto flex items-center justify-between shrink-0 border-b border-white/5">
        <Link href="/dashboard" className="flex items-center gap-2 group text-white/80 hover:text-white transition-colors">
          <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-semibold text-sm">กลับหน้าแดชบอร์ด</span>
        </Link>
        <div className="flex items-center gap-2">
          <Trophy size={18} className="text-brand-gold animate-bounce" />
          <span className="text-white font-bold text-sm bg-white/5 border border-white/10 px-3 py-1 rounded-full">
            คะแนนสะสม: <span className="text-brand-gold">{profile?.points ?? 0}</span> ⭐
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 md:p-8 space-y-8">
        {/* Title */}
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-display text-brand-gold">UBC Learning Plan</h1>
          <p className="text-xs md:text-sm text-white/60 leading-relaxed">
            โรดแมปการพัฒนาที่ปรึกษาการตลาดแบบ Step-by-Step เพื่อเป้าหมายรายได้และความสำเร็จที่ยั่งยืน
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex bg-white/5 border border-white/10 rounded-2xl p-1 gap-1 flex-wrap md:flex-nowrap">
          {([1, 2, 3, 4] as const).map((lvl) => (
            <button
              key={lvl}
              onClick={() => setActiveTab(lvl)}
              className={`flex-1 py-3 px-4 rounded-xl text-xs md:text-sm font-bold tracking-tight transition-all duration-300 ${
                activeTab === lvl
                  ? "bg-brand-gold text-brand-dark shadow-lg shadow-brand-gold/10"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              UBC {lvl} · {lvl === 1 ? "Foundation" : lvl === 2 ? "Specialist" : lvl === 3 ? "Strategic" : "Master"}
            </button>
          ))}
        </div>

        {/* Current Level Info */}
        <div className="glass p-6 md:p-8 border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2 max-w-lg">
            <div className="inline-flex gap-2 items-center bg-brand-gold/15 border border-brand-gold/25 text-brand-gold px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider">
              <Award size={14} /> {levelInfo[activeTab].name}
            </div>
            <h2 className="text-2xl md:text-3xl font-display text-brand-gold">{levelInfo[activeTab].income}</h2>
            <p className="text-white/60 text-xs md:text-sm leading-relaxed">{levelInfo[activeTab].desc}</p>
          </div>

          {/* Progress Circle / Box */}
          <div className="w-full md:w-auto bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center gap-4 shrink-0">
            <div className="relative w-14 h-14 flex items-center justify-center shrink-0">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="28" cy="28" r="24" className="stroke-white/10 fill-none" strokeWidth="5" />
                <circle
                  cx="28"
                  cy="28"
                  r="24"
                  className="stroke-brand-gold fill-none transition-all duration-1000 ease-out"
                  strokeWidth="5"
                  strokeDasharray="150.7"
                  strokeDashoffset={150.7 - (150.7 * progressPercent) / 100}
                />
              </svg>
              <span className="absolute text-xs font-black">{progressPercent}%</span>
            </div>
            <div>
              <div className="text-xs text-white/40 font-bold uppercase tracking-wider">ภารกิจของคุณ</div>
              <div className="text-sm font-semibold text-white/80">
                สำเร็จ {completedLevelMissions.length} จาก {levelMissions.length} ข้อ
              </div>
            </div>
          </div>
        </div>

        {/* Mission Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {filteredMissions.map((m) => {
            const userMission = userMissions.find((um) => um.mission_id === m.id);
            const isCompleted = userMission?.status === "COMPLETED";
            const isInProgress = userMission?.status === "IN_PROGRESS";

            const categoryInfo = {
              MINDSET: { label: "MINDSET", style: "bg-amber-500/10 border-amber-500/30 text-amber-500" },
              SKILLSET: { label: "SKILLSET", style: "bg-indigo-500/10 border-indigo-500/30 text-indigo-400" },
              TOOLSET: { label: "TOOLSET", style: "bg-purple-500/10 border-purple-500/30 text-purple-400" },
            };

            return (
              <div
                key={m.id}
                className={`glass p-6 md:p-8 flex flex-col justify-between gap-6 border-white/10 hover:border-brand-gold/20 hover:bg-white/7 transition-all duration-300 relative ${
                  isCompleted ? "bg-brand-gold/5" : ""
                }`}
              >
                {/* Top Block */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span
                      className={`px-3 py-0.5 rounded-full text-[10px] font-black tracking-widest ${
                        categoryInfo[m.category].style
                      }`}
                    >
                      {categoryInfo[m.category].label}
                    </span>
                    <span className="text-brand-gold text-xs font-bold tracking-tight">⭐ {m.reward_points} PT</span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-base md:text-lg font-bold text-white/90 leading-snug">{m.title}</h3>
                    <p className="text-white/50 text-xs leading-relaxed">{m.description}</p>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="pt-2">
                  {isCompleted ? (
                    <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold bg-emerald-500/10 border border-emerald-500/20 py-2.5 px-4 rounded-xl w-full justify-center">
                      <CheckCircle2 size={16} /> สำเร็จภารกิจแล้ว
                    </div>
                  ) : isInProgress ? (
                    <button
                      onClick={() => handleCompleteMission(m.id, m.reward_points, m.title)}
                      disabled={processingId === m.id}
                      className="w-full bg-brand-gold text-brand-dark hover:bg-brand-gold/90 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 active:scale-97 transition-all"
                    >
                      {processingId === m.id ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <Send size={14} />
                      )}
                      ส่งภารกิจตรวจ
                    </button>
                  ) : (
                    <button
                      onClick={() => handleStartMission(m.id)}
                      disabled={processingId === m.id}
                      className="w-full bg-white/5 border border-white/10 hover:border-brand-gold/30 hover:bg-brand-gold/5 py-2.5 rounded-xl text-xs font-bold text-white/80 hover:text-brand-gold flex items-center justify-center gap-1.5 active:scale-97 transition-all"
                    >
                      {processingId === m.id ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <Play size={14} className="fill-current" />
                      )}
                      เริ่มทำภารกิจ
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-5 text-center text-white/40 text-xs shrink-0 border-t border-white/5">
        &copy; {new Date().getFullYear()} Unicorn Global Link Co., Ltd. - All Rights Reserved.
      </footer>
    </div>
  );
}
