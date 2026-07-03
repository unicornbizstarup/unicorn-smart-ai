import React, { useState, useEffect } from "react";
import { useLoaderData, Link, useNavigate } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import {
  Trophy,
  Award,
  Sparkles,
  Play,
  CheckCircle2,
  Loader2,
  Send,
  ChevronLeft,
} from "lucide-react";
import { createServerSupabase, requireUser } from "@/lib/supabase-server";
import { createClient } from "@/lib/supabase";
import type { Profile } from "@/types";
import MemberLayout from "@/components/layout/MemberLayout";

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
  profile_id: string;
  mission_id: string;
  status: "IN_PROGRESS" | "COMPLETED" | "VERIFIED";
  completed_at: string | null;
  mission?: Mission;
}

const DEFAULT_MISSIONS: Omit<Mission, "id">[] = [
  {
    ubc_level: 1,
    title: "ถอดรหัสธุรกิจ: วิสัยทัศน์ แผนรายได้ 8 ช่องทาง และ 5 WHY ส่วนตัว",
    description: "ทำความเข้าใจวิสัยทัศน์บริษัท สินค้า U5 และการทำงานของแผนรายได้ 8 ช่องทาง พร้อมวิเคราะห์เหตุผล 5 WHY ของตนเอง เพื่อสร้างแรงบันดาลใจที่มั่นคงสำหรับการเริ่มต้นธุรกิจ [ปลดล็อค: Retail Bonus ช่องทางที่ 1]",
    category: "MINDSET",
    reward_points: 100,
  },
  {
    ubc_level: 1,
    title: "Product Storytelling & STP สร้างรายได้จากการสนทนาคนแรกได้เลย",
    description: "ฝึกเล่าเรื่องสินค้า U5 ใน 60 วินาที + สร้างสคริปต์บทพูดแนะนำธุรกิจเป็นรายแรกของตนเองด้วยเทคนิค STP (70/30) เพื่อเริ่มทำรายได้จากการขายได้ทันที [ปลดล็อค: Retail Bonus + Fast Start Bonus]",
    category: "SKILLSET",
    reward_points: 150,
  },
  {
    ubc_level: 1,
    title: "เปิดใช้งาน Unicorn Smart AI ครบชุด: นามบัตร แดชบอร์ด และ AI Coach น้องยูนิ",
    description: "ตั้งค่าโปรไฟล์ธุรกิจ สร้างนามบัตรดิจิทัลส่วนตัว ดูสถิติ Dashboard เป็นครั้งแรก และซ้อม 3 Scenario กับ AI Coach น้องยูนิ: ขายสินค้า / แนะนำธุรกิจ / ตอบข้อโต้แย้ง [ปลดล็อค: ทุกช่องทางรายได้]",
    category: "TOOLSET",
    reward_points: 200,
  },
  {
    ubc_level: 2,
    title: "Personal Brand Audit & Wealth DNA สร้างตัวตนที่ AI ลอกไม่ได้",
    description: "วิเคราะห์ Wealth DNA + กำหนด Brand Archetype ที่เป็นเอกลักษณ์ของตัวเอง เขียน Brand Story Before-After-Mission เพื่อเป็นหัวใจ Content ทุกชิ้น (เสียง+หน้า = สิ่งที่ AI ลอกไม่ได้) [ปลดล็อค: Lead Quality สูงขึ้น + Fast Start Bonus]",
    category: "MINDSET",
    reward_points: 200,
  },
  {
    ubc_level: 2,
    title: "TikTok/Reels Content + Lead Funnel + AI เป็นผู้ช่วย ไม่ใช่ตัวแทน",
    description: "สร้าง Video 3 แบบ (ไลฟ์สไตล์ / รีวิวสินค้า / ทำไมถึงยูนิคอร์น) โดยใช้ AI ช่วยวางแผน Caption แต่หน้าตาและเสียงยังเป็นตัวเอง พร้อมตั้ง Lead Funnel: Content → Link → นามบัตร → Close [ปลดล็อค: Retail + Fast Start Bonus ช่องทาง 1-2]",
    category: "SKILLSET",
    reward_points: 250,
  },
  {
    ubc_level: 2,
    title: "Balance Team Builder & One Link System เริ่มสร้างทีมสองสาย",
    description: "วางแผนสร้างทีม 2 สาย (ซ้าย-ขวา) และใช้ One Link ส่วนตัวเชื่อมต่อ Lead แบบที่ปรึกษา 70/30 เพื่อแนะนำคนเข้าธุรกิจอย่างมีคุณภาพ วัดผลการแนะนำ และคำนวณ PV เพื่อปลดล็อค Balance Team Bonus [ปลดล็อค: Balance Team Bonus ช่องทาง 3]",
    category: "TOOLSET",
    reward_points: 300,
  },
  {
    ubc_level: 3,
    title: "Multiplying System: 4-5-6 & Train the Trainer สอน 1 คน = ขยาย 10 เท่า",
    description: "เข้าใจระบบผลประโยชน์แบบ Matching Bonus 5 ชั้น และออกแบบระบบ Train the Trainer เพื่อสอนงานคนให้สอนได้ต่อ พร้อมทำ AAR เชิงกลยุทธ์ทุก 2 สัปดาห์ [ปลดล็อค: Matching Bonus ช่องทาง 4]",
    category: "MINDSET",
    reward_points: 400,
  },
  {
    ubc_level: 3,
    title: "Leadership Coaching และ Data-Driven Analytics วิเคราะห์ทีม",
    description: "ฝึกฝนจิตวิทยาการโค้ชชิ่งผู้นำเพื่อบริหารครองใจองค์กร พร้อมประเมินผลลัพธ์ผ่านระบบ Dashboard Data Analytics ในการวิเคราะห์และคัดกรองพาร์ทเนอร์สร้าง 5 Core Leaders เพื่อขับเคลื่อนธุรกิจร่วมกัน",
    category: "SKILLSET",
    reward_points: 450,
  },
  {
    ubc_level: 3,
    title: "การติดตั้ง Agent AI ส่วนตัวลงบน LINE OA และการซัพพอร์ตระบบแบบ 24 ชั่วโมง",
    description: "เชื่อมต่อผู้ช่วยปัญญาประดิษฐ์ (Uni Agent AI) เข้ากับ Line Official Account ของตนเองเพื่อช่วยเหลือตอบคำถามและสนับสนุนลูกทีมอย่างเป็นระบบตลอดเวลา",
    category: "TOOLSET",
    reward_points: 500,
  },
  {
    ubc_level: 4,
    title: "ระบบ Onboarding 90 วันและการแก้ปัญหาความขัดแย้งในองค์กรใหญ่",
    description: "ออกแบบระบบ Journey Architect ต้อนรับพาร์ทเนอร์ใหม่ 90 วัน พร้อมเรียนรู้จิตวิทยาบริหารและแก้ความขัดแย้งในองค์กรธุรกิจที่เติบโตขึ้น",
    category: "MINDSET",
    reward_points: 800,
  },
  {
    ubc_level: 4,
    title: "การจัด High-Impact Workshops และการสอนระบบบริษัท",
    description: "จัดเวิร์คช็อปและสัมมนาแคมป์เพื่อขับเคลื่อนทีม พร้อมศึกษาการใช้และถ่ายทอดวิธีใช้งานระบบหลังบ้านบริษัท (Platform Admin & Tools) รวมถึงระบบเชื่อมต่ออัตโนมัติ",
    category: "SKILLSET",
    reward_points: 1000,
  },
  {
    ubc_level: 4,
    title: "Servant Leadership และการวางกลยุทธ์ขยายแบรนด์ระดับสากล",
    description: "ทำหน้าที่ผู้นำรับใช้ (Servant Leadership) ในการสร้างวิสัยทัศน์และการวางแผนกลยุทธ์ระดับสากล (Global Scaling) ร่วมกับบอร์ดบริหาร",
    category: "TOOLSET",
    reward_points: 1200,
  },
];

const LEVEL_SPECIFICATIONS = {
  1: {
    id: 1,
    badge: "UBC 1: FOUNDATION (รากฐาน)",
    role: "UBC — Super Star Elite",
    income: "500 – 15,000 บาท/เดือน",
    desc: "รากฐานการขายและการใช้เครื่องมือดิจิทัลเบื้องต้น มุ่งเน้นการเริ่มต้นและเรียนรู้วิธีการทำงาน",
    highlights: {
      mindset: [
        "ถอดรหัสธุรกิจ: วิสัยทัศน์ & โมเดล U-LINK U-SHARE U-SUCCESS",
        "สินค้า U5: เข้าใจคุณค่าจริง ทดลองใช้เอง เปิดความเชื่อเพื่อขายได้จริง",
        "แผนรายได้ 8 ช่องทาง: คำนวณ Retail Bonus จากการขาย 5-10 กล่อง/สัปดาห์",
        "5 WHY: วิเคราะห์เหตุผลส่วนตัวเพื่อสร้างแรงบันดาลใจไม่หยุด"
      ],
      skillset: [
        "Product Storytelling 60 วินาที: เล่าเรื่องสินค้าไม่อ่านสคริปต์ พูดได้เอง",
        "STP สคริปต์คนแรก: บทพูดเปิดการสนทนาและติดตาม Close Sale (70/30)",
        "ซ้อม AI Coach น้องยูนิ 5 Scenario: ขาย / แนะนำ / ตอบข้อโต้แย้ง"
      ],
      toolset: [
        "Unicorn Dashboard: อ่านสถิติ PV / ทีมซ้าย-ขวา / ความก้าวหน้า",
        "AI Coach น้องยูนิ: ฝึกพูด-ตอบได้ทุกที่ ไม่ต้องเขินใจคนอื่น",
        "นามบัตรดิจิทัล + ลิงค์ส่วนตัว: สร้าง + แชร์ได้ทันที"
      ]
    }
  },
  2: {
    id: 2,
    badge: "UBC 2: SPECIALIST (ผู้เชี่ยวชาญ)",
    role: "UBC — Marketing Specialist",
    income: "15,000 – 50,000 บาท/เดือน",
    desc: "สร้างตัวตนที่ AI ลอกไม่ได้ + ดึง Lead อัตโนมัติ + เริ่มสร้างทีม ปลดล็อค Balance Team Bonus",
    highlights: {
      mindset: [
        "Personal Brand Audit & Wealth DNA (เอกลักษณ์ที่ AI ลอกไม่ได้)",
        "Brand Story Before-After-Mission (เล่าเรื่องจริงของตัวเอง)",
        "Digital Asset Mindset: Network = สินทรัพย์ดิจิทัลที่แท้จริง"
      ],
      skillset: [
        "TikTok/Reels (หน้าตัวเอง + AI ช่วยวางแผน ไม่ใช่ตัวแทน)",
        "Lead Funnel: Content → Link → นามบัตร → Close",
        "Sponsoring 70/30: แนะนำ 2 คน/เดือน คุณภาพเหนือปริมาณ"
      ],
      toolset: [
        "One Link Mastery: วัด Click → คำนวณ Fast Start Bonus",
        "Balance Team Architecture: วางคนซ้าย-ขวา PV สมดุล 60,000/วัน",
        "Digital Name Card Pro: Video + Link สินค้า + Portfolio ผลลัพธ์"
      ]
    }
  },
  3: {
    id: 3,
    badge: "UBC 3: STRATEGIC (นักกลยุทธ์)",
    role: "UBC — Team Strategist",
    income: "50,000 – 300,000 บาท/เดือน",
    desc: "ทีมงานทำเป็นระบบ + Matching Bonus ลึก 5 ชั้น + Uni-Level Passive Income จากเครือข่ายผู้บริโภค 10-30 ชั้น",
    highlights: {
      mindset: [
        "Multiplying Mindset: สอน 1 คน = รายได้ Matching 5 ชั้น",
        "AAR เชิงกลยุทธ์: ประเมินผลทีมทุก 2 สัปดาห์ ปรับแก้เป็นระบบ",
        "Growth Multiplication: คำนวณ Matching Bonus 5 ชั้น = รายได้ทวีคูณ"
      ],
      skillset: [
        "Leadership Coaching 1:1 (4 ครั้ง/เดือน วัด: ลูกทีมขึ้น Level)",
        "Data Analytics: คัดกรอง Active/โค้ช/ปล่อย สร้าง 5 Core Leaders",
        "Consumer Network: Follow-up สมาชิก U1-U3 สร้าง Uni-Level Bonus"
      ],
      toolset: [
        "Agent AI LINE OA: ตอบ FAQ อัตโนมัติ 24 ชม. (AI ช่วย ไม่ใช่แทน)",
        "Dropship System: ลูกทีมสั่งซื้อและรับ Dropship Bonus 10%"
      ]
    }
  },
  4: {
    id: 4,
    badge: "UBC 4: MASTER (ปรมาจารย์)",
    role: "UBC — Master Leader",
    income: "300,000 – 3,000,000+ บาท/เดือน",
    desc: "ระบบทำงานเอง + Global Bonus 6% จากยอดขายทั่วโลก + Travel Reward ระดับ 5 ดาว",
    highlights: {
      mindset: [
        "Servant Leadership: สร้างวัฒนธรรมองค์กรย่อย (Culture/Values/Mission)",
        "Conflict Resolution: แก้ความขัดแย้งองค์กรใหญ่ด้วย Structured Dialog",
        "Journey Architect: Onboarding 30-60-90 วันสำหรับองค์กรตนเอง"
      ],
      skillset: [
        "High-Impact Workshop (20+ คน 3-4 ชม. วัดผลได้ภายใน 2 สัปดาห์)",
        "Global Strategy: ขยายทีมข้ามประเทศ AEC + Global Bonus 6%",
        "AI Workflow Automation: n8n/Make Lead→Onboard→Follow-up"
      ],
      toolset: [
        "Corporate AI Knowledge Base: องค์กรเรียนรู้เองผ่าน AI",
        "Unicorn Platform Admin: ดูแล Global Network ระดับสากล",
        "Travel Reward Target: วางแผนพิชิตรางวัล 5 ดาวไต้มือด้วยทีม"
      ]
    }
  },
};

export function meta() {
  return [
    { title: "โปรแกรมพัฒนา UBC (กระดานภารกิจ) — Unicorn Smart AI" },
    { name: "description", content: "เส้นทางการเรียนรู้และภารกิจเพื่อก้าวสู่ที่ปรึกษาการตลาดมืออาชีพ" },
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

  const { data: dbMissions } = await supabase
    .from("missions")
    .select("*")
    .order("ubc_level", { ascending: true });

  const { data: userMissions } = await supabase
    .from("user_missions")
    .select("*")
    .eq("profile_id", user.id);

  return {
    profile,
    userId: user.id,
    initialMissions: dbMissions || [],
    initialUserMissions: userMissions || [],
  };
}

export default function MissionsPage() {
  const { profile: serverProfile, userId, initialMissions, initialUserMissions } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const supabase = createClient();

  const [profile, setProfile] = useState<Profile | null>(serverProfile);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [userMissions, setUserMissions] = useState<UserMission[]>([]);
  const [activeTab, setActiveTab] = useState<1 | 2 | 3 | 4>(1);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  // Initialize data on mount
  useEffect(() => {
    // If DB missions are empty, seed client fallback
    const resolvedMissions = initialMissions.length > 0
      ? initialMissions
      : DEFAULT_MISSIONS.map((m, i) => ({ ...m, id: `default-${i}` } as Mission));
    setMissions(resolvedMissions);
    setUserMissions(initialUserMissions as UserMission[]);

    // Set initial tab from profile level
    if (serverProfile) {
      setActiveTab((serverProfile.ubc_level ?? 1) as 1 | 2 | 3 | 4);
    }

    // Load LocalStorage Checklist
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("ubc_checked_items");
      if (saved) {
        try {
          setCheckedItems(JSON.parse(saved));
        } catch (e) {
          console.error("Error parsing checklist:", e);
        }
      }
    }
  }, [initialMissions, initialUserMissions, serverProfile]);

  const handleStartMission = async (missionId: string) => {
    if (!userId) return;
    setProcessingId(missionId);
    try {
      const { data, error } = await supabase
        .from("user_missions")
        .insert({
          profile_id: userId,
          mission_id: missionId,
          status: "IN_PROGRESS",
        })
        .select()
        .single();

      if (error) throw error;

      setUserMissions((prev) => [...prev, data as UserMission]);
    } catch (err: any) {
      alert(`ไม่สามารถเริ่มภารกิจได้: ${err.message}`);
    } finally {
      setProcessingId(null);
    }
  };

  const handleCompleteMission = async (missionId: string, rewardPoints: number, missionTitle: string) => {
    if (!userId || !profile) return;
    setProcessingId(missionId);
    try {
      const { data, error } = await supabase
        .from("user_missions")
        .update({
          status: "COMPLETED",
          completed_at: new Date().toISOString(),
        })
        .eq("profile_id", userId)
        .eq("mission_id", missionId)
        .select()
        .single();

      if (error) throw error;

      const newPoints = (profile.business_points ?? 0) + rewardPoints;
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ business_points: newPoints })
        .eq("id", userId);

      if (profileError) throw profileError;

      // Update local state
      setProfile((prev) => prev ? { ...prev, business_points: newPoints } : null);
      setUserMissions((prev) =>
        prev.map((um) => (um.mission_id === missionId ? { ...um, status: "COMPLETED" } : um))
      );

      // Trigger Line Notify via edge route
      await fetch("/api/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "mission_complete",
          payload: {
            name: profile.display_name || profile.full_name || "นักธุรกิจยูนิคอร์น",
            missionTitle: missionTitle,
            points: rewardPoints,
          }
        }),
      }).catch(err => console.error("Line notify error:", err));

      alert(`🎉 ยินดีด้วยครับ! คุณส่งภารกิจสำเร็จและรับ +${rewardPoints} คะแนนเรียบร้อยแล้ว!`);
    } catch (err: any) {
      alert(`ไม่สามารถส่งภารกิจได้: ${err.message}`);
    } finally {
      setProcessingId(null);
    }
  };

  const handleCheckChange = (lvl: number, pillar: string, index: number, isChecked: boolean) => {
    const key = `ubc_${lvl}_${pillar}_${index}`;
    const newChecked = { ...checkedItems, [key]: isChecked };
    setCheckedItems(newChecked);
    localStorage.setItem("ubc_checked_items", JSON.stringify(newChecked));
  };

  const currentLevelInfo = LEVEL_SPECIFICATIONS[activeTab];

  // Overall database-backed missions completion progress
  const totalMissionsCount = missions.length || 12;
  const totalCompletedMissionsCount = userMissions.filter(um => um.status === "COMPLETED" || um.status === "VERIFIED").length;
  const overallProgressPercent = Math.round((totalCompletedMissionsCount / totalMissionsCount) * 100);

  // Compute checklist checkbox percentages
  const getProgressByLevel = (lvl: number) => {
    const info = LEVEL_SPECIFICATIONS[lvl as 1 | 2 | 3 | 4];
    const totalItems = 
      info.highlights.mindset.length + 
      info.highlights.skillset.length + 
      info.highlights.toolset.length;
    
    let checkedCount = 0;
    info.highlights.mindset.forEach((_, idx) => {
      if (checkedItems[`ubc_${lvl}_mindset_${idx}`]) checkedCount++;
    });
    info.highlights.skillset.forEach((_, idx) => {
      if (checkedItems[`ubc_${lvl}_skillset_${idx}`]) checkedCount++;
    });
    info.highlights.toolset.forEach((_, idx) => {
      if (checkedItems[`ubc_${lvl}_toolset_${idx}`]) checkedCount++;
    });

    return totalItems > 0 ? Math.round((checkedCount / totalItems) * 100) : 0;
  };

  const currentLvlCheckProgressPercent = getProgressByLevel(activeTab);
  const totalLvlCheckItemsCount = 
    currentLevelInfo.highlights.mindset.length + 
    currentLevelInfo.highlights.skillset.length + 
    currentLevelInfo.highlights.toolset.length;

  const getCheckedCountForActiveTab = () => {
    let count = 0;
    currentLevelInfo.highlights.mindset.forEach((_, idx) => {
      if (checkedItems[`ubc_${activeTab}_mindset_${idx}`]) count++;
    });
    currentLevelInfo.highlights.skillset.forEach((_, idx) => {
      if (checkedItems[`ubc_${activeTab}_skillset_${idx}`]) count++;
    });
    currentLevelInfo.highlights.toolset.forEach((_, idx) => {
      if (checkedItems[`ubc_${activeTab}_toolset_${idx}`]) count++;
    });
    return count;
  };

  const checkedLvlCount = getCheckedCountForActiveTab();

  return (
    <MemberLayout
      profile={profile}
      title="โปรแกรม UBC"
      subtitle="— เส้นทางการเรียนรู้และโรดแมปการทำภารกิจเพื่อก้าวสู่ที่ปรึกษาการตลาดมืออาชีพ"
    >
      <div className="max-w-5xl mx-auto space-y-6 font-body text-text-primary">
        
        {/* Title Navigation & Point Display */}
        <div className="flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-1.5 text-text-secondary hover:text-brand-gold font-semibold text-xs transition-colors">
            <ChevronLeft size={16} />
            <span>กลับหน้าแดชบอร์ด</span>
          </Link>
          <div>
            <span className="text-brand-gold font-bold text-xs bg-brand-gold-light/40 border border-brand-gold-muted/20 px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
              🏆 UBC Point: <span className="font-black">{(profile?.business_points ?? 0).toLocaleString()}</span> PT
            </span>
          </div>
        </div>

        {/* 1. Premium dark/gold banner matching Light Theme v2 */}
        <div className="relative rounded-3xl overflow-hidden shadow-md bg-gradient-to-br from-brand-dark to-[#2c1d0c] text-white">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
            <div className="space-y-2 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-gold/20 border border-brand-gold/30 text-brand-gold-light rounded-full text-[10px] font-black uppercase tracking-wider">
                🎓 Unicorn Academy
              </div>
              <h1 className="text-2xl md:text-3xl font-display !text-white leading-tight">
                โปรแกรมพัฒนา UBC
              </h1>
              <p className="text-xs md:text-sm text-gray-300 max-w-xl leading-relaxed">
                เส้นทางการเรียนรู้ที่ปรึกษาการตลาดออนไลน์ครบวงจร 4 ระดับ ประเมินผลลัพธ์การกระทำจริงเพื่อพิชิตเป้าหมายรายได้และตำแหน่งทางธุรกิจ Step-by-Step
              </p>
            </div>

            {/* Circular Progress SVG */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-4 shrink-0 w-full md:w-auto shadow-inner">
              <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="32" cy="32" r="28" className="stroke-white/10 fill-none" strokeWidth="5" />
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    className="stroke-brand-gold fill-none transition-all duration-1000 ease-out"
                    strokeWidth="5"
                    strokeDasharray="175.9"
                    strokeDashoffset={175.9 - (175.9 * overallProgressPercent) / 100}
                  />
                </svg>
                <span className="absolute text-xs font-black text-white">{overallProgressPercent}%</span>
              </div>
              <div>
                <div className="text-[9px] text-brand-gold-light font-bold uppercase tracking-wider">ความก้าวหน้ารวม</div>
                <div className="text-xs font-black !text-white mt-0.5">
                  ระดับปัจจุบัน: <span className="text-brand-gold">UBC {profile?.ubc_level ?? 1}</span>
                </div>
                <div className="text-[10px] text-gray-400 mt-0.5">
                  สำเร็จ {totalCompletedMissionsCount} จาก {totalMissionsCount} ภารกิจหลัก
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Grid Cards for Level Filtering */}
        <div className="grid grid-cols-2 gap-2.5">
          {([1, 2, 3, 4] as const).map((lvl) => {
            const lvlProgress = getProgressByLevel(lvl);
            const isActive = activeTab === lvl;
            return (
              <button
                key={lvl}
                onClick={() => setActiveTab(lvl)}
                className={`card-base bg-white border rounded-2xl p-4 text-left transition-all relative ${
                  isActive 
                    ? "border-brand-gold ring-2 ring-brand-gold-light/40 shadow-sm translate-y-[-1px]" 
                    : "border-border-default hover:border-brand-gold-muted hover:bg-bg-input"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[9px] font-black text-text-muted uppercase tracking-wider">
                    UBC LEVEL {lvl}
                  </span>
                  <span className={`w-2 h-2 rounded-full ${lvlProgress === 100 ? "bg-emerald-500" : lvlProgress > 0 ? "bg-amber-500" : "bg-slate-300"}`} />
                </div>
                <div className="text-xs font-black text-text-primary truncate">
                  {lvl === 1 ? "1. Foundation" : lvl === 2 ? "2. Specialist" : lvl === 3 ? "3. Strategic" : "4. Master"}
                </div>
                
                {/* Micro Progress Bar inside each level card */}
                <div className="mt-3 space-y-1">
                  <div className="flex items-center justify-between text-[9px] text-text-muted font-bold">
                    <span>ความสำเร็จ</span>
                    <span>{lvlProgress}%</span>
                  </div>
                  <div className="progress-track bg-brand-gold-light/30 h-1 rounded-full overflow-hidden">
                    <div className="progress-fill bg-brand-gold h-full rounded-full transition-all duration-500" style={{ width: `${lvlProgress}%` }} />
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* 3. Level Detail Specifications */}
        <div className="card-premium bg-white border border-border-default rounded-3xl p-5 md:p-6 shadow-sm">
          <div className="flex flex-col gap-6">
            {/* Left Block */}
            <div className="space-y-4 max-w-sm">
              <div className="inline-flex gap-2 items-center bg-brand-gold-light/40 border border-brand-gold-muted/20 text-brand-gold px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
                <Award size={14} /> {currentLevelInfo.badge}
              </div>
              <div>
                <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider">ตำแหน่งทางธุรกิจ</span>
                <h3 className="text-sm font-bold text-text-primary mt-0.5">{currentLevelInfo.role}</h3>
              </div>
              <div>
                <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider">เป้าหมายรายได้เฉลี่ย</span>
                <h2 className="text-xl md:text-2xl font-display font-black text-brand-gold mt-0.5">{currentLevelInfo.income}</h2>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed italic">{currentLevelInfo.desc}</p>
            </div>

            {/* Right Block: Core Pillars Grid with Checklist Checkboxes */}
            <div className="flex-1 bg-bg-input border border-border-default rounded-2xl p-4 md:p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4 border-b border-border-default pb-2">
                  <span className="text-[10px] font-black text-text-muted uppercase tracking-wider">เช็คลิสต์หัวข้อเรียนรู้และปฏิบัติ</span>
                  <span className="text-[10px] font-bold text-brand-gold bg-brand-gold-light/40 border border-brand-gold-muted/10 px-2 py-0.5 rounded-full">
                    ผ่านแล้ว {currentLvlCheckProgressPercent}% ({checkedLvlCount}/{totalLvlCheckItemsCount} ข้อ)
                  </span>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  {/* Mindset Checklist */}
                  <div className="space-y-2.5">
                    <div className="text-[10px] font-black text-amber-600 uppercase tracking-widest flex items-center gap-1">
                      🧠 MINDSET
                    </div>
                    <div className="space-y-2">
                      {currentLevelInfo.highlights.mindset.map((item, idx) => {
                        const key = `ubc_${activeTab}_mindset_${idx}`;
                        const isChecked = !!checkedItems[key];
                        return (
                          <label key={idx} className="flex items-start gap-2 cursor-pointer select-none group">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => handleCheckChange(activeTab, "mindset", idx, e.target.checked)}
                              className="mt-0.5 w-3.5 h-3.5 text-brand-gold bg-white border-border-strong rounded focus:ring-brand-gold transition-colors cursor-pointer"
                            />
                            <span className={`text-xs font-medium leading-snug transition-all ${
                              isChecked 
                                ? "text-text-muted line-through italic" 
                                : "text-text-secondary group-hover:text-brand-gold"
                            }`}>
                              {item}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Skillset Checklist */}
                  <div className="space-y-2.5">
                    <div className="text-[10px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-1">
                      🎯 SKILLSET
                    </div>
                    <div className="space-y-2">
                      {currentLevelInfo.highlights.skillset.map((item, idx) => {
                        const key = `ubc_${activeTab}_skillset_${idx}`;
                        const isChecked = !!checkedItems[key];
                        return (
                          <label key={idx} className="flex items-start gap-2 cursor-pointer select-none group">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => handleCheckChange(activeTab, "skillset", idx, e.target.checked)}
                              className="mt-0.5 w-3.5 h-3.5 text-brand-gold bg-white border-border-strong rounded focus:ring-brand-gold transition-colors cursor-pointer"
                            />
                            <span className={`text-xs font-medium leading-snug transition-all ${
                              isChecked 
                                ? "text-text-muted line-through italic" 
                                : "text-text-secondary group-hover:text-brand-gold"
                            }`}>
                              {item}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Toolset Checklist */}
                  <div className="space-y-2.5">
                    <div className="text-[10px] font-black text-purple-600 uppercase tracking-widest flex items-center gap-1">
                      🛠️ TOOLSET
                    </div>
                    <div className="space-y-2">
                      {currentLevelInfo.highlights.toolset.map((item, idx) => {
                        const key = `ubc_${activeTab}_toolset_${idx}`;
                        const isChecked = !!checkedItems[key];
                        return (
                          <label key={idx} className="flex items-start gap-2 cursor-pointer select-none group">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => handleCheckChange(activeTab, "toolset", idx, e.target.checked)}
                              className="mt-0.5 w-3.5 h-3.5 text-brand-gold bg-white border-border-strong rounded focus:ring-brand-gold transition-colors cursor-pointer"
                            />
                            <span className={`text-xs font-medium leading-snug transition-all ${
                              isChecked 
                                ? "text-text-muted line-through italic" 
                                : "text-text-secondary group-hover:text-brand-gold"
                            }`}>
                              {item}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress bar of interactive checked items */}
              <div className="mt-4 pt-3 border-t border-border-default">
                <div className="flex items-center justify-between text-[9px] text-text-muted font-black uppercase tracking-wider mb-1">
                  <span>ความสำเร็จเช็คลิสต์สะสมความรู้ระดับ {activeTab}</span>
                  <span className="text-brand-gold font-bold">{currentLvlCheckProgressPercent}%</span>
                </div>
                <div className="progress-track bg-brand-gold-light/30 h-1.5 rounded-full overflow-hidden">
                  <div className="progress-fill bg-brand-gold h-full rounded-full transition-all duration-500" style={{ width: `${currentLvlCheckProgressPercent}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Target Specific Missions */}
        <div className="space-y-4">
          <h3 className="font-display font-bold text-sm text-text-primary flex items-center gap-2">
            <span>📋</span> รายการภารกิจพัฒนาความสำเร็จ (UBC Level {activeTab})
          </h3>
          
          <div className="grid md:grid-cols-3 gap-5">
            {missions.filter(m => m.ubc_level === activeTab).map((m) => {
              const userMission = userMissions.find((um) => um.mission_id === m.id);
              const isCompleted = userMission?.status === "COMPLETED";
              const isInProgress = userMission?.status === "IN_PROGRESS";

              const categoryInfo = {
                MINDSET: { label: "MINDSET (วิธีคิด)", style: "bg-amber-100 text-amber-700 border-amber-200" },
                SKILLSET: { label: "SKILLSET (ทักษะ)", style: "bg-indigo-100 text-indigo-700 border-indigo-200" },
                TOOLSET: { label: "TOOLSET (เครื่องมือ)", style: "bg-purple-100 text-purple-700 border-purple-200" },
              };

              return (
                <div
                  key={m.id}
                  className={`card-base bg-white border rounded-2xl p-5 md:p-6 flex flex-col justify-between gap-6 hover:border-brand-gold-muted hover:bg-bg-input/30 transition-all duration-300 relative shadow-sm ${
                    isCompleted ? "border-emerald-200 bg-emerald-50/10" : "border-border-default"
                  }`}
                >
                  {/* Top Block */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-wider border ${categoryInfo[m.category].style}`}>
                        {categoryInfo[m.category].label}
                      </span>
                      <span className="text-brand-gold text-[10px] font-black tracking-tight bg-brand-gold-light/40 px-2 py-0.5 rounded-md border border-brand-gold-muted/10">
                        ⭐ +{m.reward_points} PT
                      </span>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-xs md:text-sm font-bold text-text-primary leading-snug">{m.title}</h3>
                      <p className="text-xs text-text-secondary leading-relaxed">{m.description}</p>
                    </div>
                  </div>

                  {/* Bottom Actions */}
                  <div className="pt-2 border-t border-border-default">
                    {isCompleted ? (
                      <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold bg-emerald-100 border border-emerald-200 py-2.5 px-4 rounded-xl w-full justify-center">
                        <CheckCircle2 size={16} /> สำเร็จภารกิจแล้ว
                      </div>
                    ) : isInProgress ? (
                      <button
                        onClick={() => handleCompleteMission(m.id, m.reward_points, m.title)}
                        disabled={processingId === m.id}
                        className="w-full bg-brand-gold text-white hover:bg-brand-gold-hover py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-sm disabled:opacity-50"
                      >
                        {processingId === m.id ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <Send size={14} />
                        )}
                        ส่งภารกิจเพื่อประเมิน
                      </button>
                    ) : (
                      <button
                        onClick={() => handleStartMission(m.id)}
                        disabled={processingId === m.id}
                        className="w-full bg-white border border-border-strong hover:border-brand-gold hover:bg-brand-gold-light/20 py-2.5 rounded-xl text-xs font-bold text-text-secondary hover:text-brand-gold flex items-center justify-center gap-1.5 active:scale-95 transition-all"
                      >
                        {processingId === m.id ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <Play size={14} className="fill-current w-3 h-3 text-text-secondary hover:text-brand-gold" />
                        )}
                        เริ่มทำภารกิจ
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </MemberLayout>
  );
}
