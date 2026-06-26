import React, { useState, useMemo } from "react";
import { useLoaderData, Link, useNavigate } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import {
  Calendar,
  Clock,
  Sparkles,
  Zap,
  Waves,
  Shield,
  Airplay,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Share2,
  CheckCircle2,
  Lightbulb,
  ShoppingBag,
  Bot,
} from "lucide-react";
import { createServerSupabase, requireUser } from "@/lib/supabase-server";
import { createClient } from "@/lib/supabase";
import type { Profile } from "@/types";
import MemberLayout from "@/components/layout/MemberLayout";

const WEALTH_ELEMENTS = {
  FIRE: {
    name: "ธาตุไฟ (FIRE)",
    archetype: "The Charismatic Leader",
    concept: "รวดเร็ว ร้อนแรง ทรงพลัง",
    description: "คุณคือผู้นำที่กล้าหาญ มีความกระตือรือร้นสูง และมีพลังในการสร้างแรงบันดาลใจให้ผู้อื่น",
    strengths: ["มีความเป็นผู้นำสูง", "กล้าตัดสินใจ", "มีพลังงานเหลือเฟือ", "สื่อสารได้น่าตื่นเต้น"],
    contentIdeas: [
      "วิดีโอสร้างแรงบันดาลใจแบบ Impact",
      "คอนเทนต์โชว์ผลลัพธ์ความสำเร็จทันใจ",
      "Live สดที่เน้นพลังงานและการตัดสินใจ",
    ],
    recommended_products: ["DEEZE SHOT (Energy)", "Unicorn Sky Air", "Unicorn Smart Shapewear"],
    color: "from-red-50 to-orange-50 border-red-100 text-red-950",
    icon: Zap,
    themeColor: "text-red-500",
    badgeColor: "bg-red-100 text-red-700 border-red-200",
  },
  WATER: {
    name: "ธาตุน้ำ (WATER)",
    archetype: "The Empathetic Connector",
    concept: "ลื่นไหล เย็นสบาย ผูกพัน",
    description: "คุณคือยอดนักสร้างสายสัมพันธ์ มีความเห็นอกเห็นใจสูง และสามารถปรับตัวเข้ากับทุกคนได้อย่างยอดเยี่ยม",
    strengths: ["ผู้ฟังที่ดีเยี่ยม", "สร้างความเชื่อมั่นได้สูง", "มีความอดทนสูง", "ปรับตัวเก่ง"],
    contentIdeas: [
      "Storytelling เล่าเรื่องจากความประทับใจจริง",
      "คอนเทนต์ดูแลสุขภาพและการดูแลคนรอบตัว",
      "วิดีโอรีวิวสินค้าที่เน้นความนุ่มนวลและผลลัพธ์เชิงอารมณ์",
    ],
    recommended_products: ["UNI COLLA", "U TENA (Eyes)", "Personal Care Products"],
    color: "from-blue-50 to-sky-50 border-blue-100 text-blue-950",
    icon: Waves,
    themeColor: "text-blue-500",
    badgeColor: "bg-blue-100 text-blue-700 border-blue-200",
  },
  EARTH: {
    name: "ธาตุดิน (EARTH)",
    archetype: "The Reliable Foundation",
    concept: "มั่นคง หนักแน่น จริงใจ",
    description: "คุณคือผู้สร้างรากฐานที่แข็งแกร่ง มีระบบระเบียบสูง และเป็นที่พึ่งพาที่ได้รับความไว้วางใจที่สุด",
    strengths: ["มีความรับผิดชอบสูง", "ทำงานเป็นระบบ", "ละเอียดรอบคอบ", "มีความสม่ำเสมอ"],
    contentIdeas: [
      "คอนเทนต์เจาะลึกส่วนประกอบสินค้า (Facts)",
      "การเปรียบเทียบแผนรายได้แบบเป็นตัวเลขชัดเจน",
      "คู่มือการทำธุรกิจแบบ Step-by-Step",
    ],
    recommended_products: ["BEETLE 7 OIL", "MINA S (Weight)", "Agriculture Products (U PLANT)"],
    color: "from-amber-50 to-yellow-50 border-amber-100 text-amber-950",
    icon: Shield,
    themeColor: "text-amber-600",
    badgeColor: "bg-amber-100 text-amber-700 border-amber-200",
  },
  AIR: {
    name: "ธาตุลม (AIR)",
    archetype: "The Creative Oracle",
    concept: "อิสระ รวดเร็ว ทันสมัย",
    description: "คุณคือนักคิดสร้างสรรค์ มีไอเดียบรรเจิด และก้าวทันเทคโนโลยีเสมอ",
    strengths: ["มีความคิดสร้างสรรค์สูง", "เรียนรู้ไว", "ชอบการติดต่อสื่อสาร", "เก่งเรื่องออนไลน์"],
    contentIdeas: [
      "วิดีโอสั้น TikTok ที่ทันสมัยและสนุกสนาน",
      "การใช้ AI ช่วยทำงานให้ดู Smart",
      "คอนเทนต์แนวไลฟ์สไตล์ (Digital Nomad)",
    ],
    recommended_products: ["24 FIN COFFEE", "Gadgets", "Innovation Products"],
    color: "from-purple-50 to-indigo-50 border-purple-100 text-purple-950",
    icon: Airplay,
    themeColor: "text-purple-600",
    badgeColor: "bg-purple-100 text-purple-700 border-purple-200",
  },
};

export function meta() {
  return [
    { title: "Wealth DNA (ถอดรหัสความมั่งคั่ง) — Unicorn Academy" },
    { name: "description", content: "ถอดรหัสพื้นดวงธาตุเจ้าเรือนเพื่อค้นหา สไตล์การสร้างความมั่งคั่ง ที่ใช่คุณ" },
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

  return { profile, userId: user?.id };
}

export default function WealthDNAPage() {
  const { profile, userId } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const supabase = createClient();

  const [step, setStep] = useState<"intro" | "form" | "loading" | "result">("intro");
  const [birthDate, setBirthDate] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const [analyzedElement, setAnalyzedElement] = useState<"FIRE" | "WATER" | "EARTH" | "AIR" | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleStart = () => setStep("form");

  const runAnalysis = () => {
    if (!birthDate) return;
    setStep("loading");

    setTimeout(() => {
      const date = new Date(birthDate);
      const dayOfWeek = date.getDay(); // 0 is Sunday

      const elements: ("FIRE" | "WATER" | "EARTH" | "AIR")[] = [
        "FIRE",  // 0: Sunday (Fire)
        "WATER", // 1: Monday (Water)
        "EARTH", // 2: Tuesday (Earth)
        "AIR",   // 3: Wednesday (Air)
        "FIRE",  // 4: Thursday (Fire)
        "WATER", // 5: Friday (Water)
        "EARTH", // 6: Saturday (Earth)
      ];

      const element = elements[dayOfWeek % elements.length];
      setAnalyzedElement(element);
      setStep("result");
    }, 2000);
  };

  const handleSaveToProfile = async () => {
    if (!userId || !analyzedElement) {
      alert("กรุณาเข้าสู่ระบบก่อนเพื่อทำการบันทึกผลลงโปรไฟล์!");
      navigate("/auth/login");
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ wealth_element: analyzedElement })
        .eq("id", userId);

      if (error) throw error;

      setSaveSuccess(true);
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (err: any) {
      console.error("Save result error:", err);
      alert(`ไม่สามารถบันทึกได้: ${err.message || "เกิดข้อผิดพลาด"}`);
    } finally {
      setIsSaving(false);
    }
  };

  const elementData = analyzedElement ? WEALTH_ELEMENTS[analyzedElement] : null;

  return (
    <MemberLayout
      profile={profile}
      title="Wealth DNA"
      subtitle="— ถอดรหัสพื้นดวงธาตุเจ้าเรือนเพื่อค้นหา สไตล์การสร้างความมั่งคั่ง ที่ใช่คุณ"
    >
      <div className="max-w-4xl mx-auto font-body text-text-primary">
        <div className="flex items-center justify-between mb-6">
          <Link to="/dashboard" className="flex items-center gap-1.5 text-text-secondary hover:text-brand-gold font-semibold text-xs transition-colors">
            <ChevronLeft size={16} />
            <span>กลับหน้าแดชบอร์ด</span>
          </Link>
          <span className="text-brand-gold font-bold tracking-wider text-[10px] uppercase bg-brand-gold-light/40 px-3 py-1 rounded-full border border-brand-gold-muted/20">
            Unicorn Wealth DNA
          </span>
        </div>

        {/* ── Main container for DNA steps (Light Theme v2) ── */}
        <div className="card-premium p-6 md:p-10 min-h-[480px] flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-br from-white to-bg-page border border-border-default">
          <div className="absolute top-0 right-0 w-72 h-72 bg-brand-gold/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-gold/3 rounded-full blur-3xl pointer-events-none" />

          {/* --- Intro Step --- */}
          {step === "intro" && (
            <div className="max-w-2xl w-full text-center space-y-8 relative z-10">
              <div className="relative inline-block">
                <div className="text-8xl md:text-9xl select-none animate-bounce duration-1000">🦄</div>
                <div className="absolute -top-4 -right-4 animate-pulse">
                  <Sparkles className="text-brand-gold w-10 h-10" />
                </div>
              </div>

              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-gold-light/50 border border-brand-gold-muted/20 rounded-full text-brand-gold text-xs font-bold tracking-widest uppercase">
                  ✨ ค้นพบรหัสลับความมั่งคั่งของคุณ
                </div>
                <h1 className="text-3xl md:text-5xl font-display text-text-primary leading-tight">
                  Unicorn Wealth DNA
                </h1>
                <p className="text-sm md:text-base text-text-secondary max-w-lg mx-auto leading-relaxed">
                  ถอดรหัสพื้นดวง เปิดประตูสู่ความมั่งคั่ง วิเคราะห์ธาตุเจ้าเรือนเพื่อค้นพบ "สไตล์การสร้างรายได้" ที่ทรงพลังที่สุดในแบบคุณ
                </p>
              </div>

              <div className="flex flex-col items-center gap-3">
                <button
                  onClick={handleStart}
                  className="w-full sm:w-auto px-10 py-4 bg-brand-gold text-white font-bold text-base rounded-2xl shadow-md hover:bg-brand-gold-hover hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles size={18} /> เริ่มต้นวิเคราะห์ DNA <ArrowRight size={18} />
                </button>
                <p className="text-xs text-text-muted">ฟรีสำหรับสมาชิกพาร์ทเนอร์ • ใช้เวลาคำนวณ 1 นาที</p>
              </div>
            </div>
          )}

          {/* --- Form Step --- */}
          {step === "form" && (
            <div className="max-w-md w-full space-y-6 relative z-10">
              <button
                onClick={() => setStep("intro")}
                className="flex items-center gap-1 text-text-secondary hover:text-brand-gold transition-colors text-sm font-semibold"
              >
                <ChevronLeft size={16} /> กลับหน้าแรก
              </button>

              <div className="bg-white border border-border-default rounded-3xl p-8 shadow-sm">
                <div className="space-y-6">
                  <div className="text-center space-y-1.5">
                    <h2 className="text-2xl font-display text-text-primary">กรอกข้อมูลพื้นดวง</h2>
                    <p className="text-text-muted text-xs font-semibold">กรุณากรอกข้อมูลวันเกิดจริงของท่านเพื่อความแม่นยำ</p>
                  </div>

                  <div className="space-y-5">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-text-secondary uppercase tracking-wider block">วัน/เดือน/ปี เกิด</label>
                      <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                        <input
                          type="date"
                          required
                          className="w-full pl-12 pr-4 py-3.5 bg-bg-input border border-border-strong rounded-xl focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none font-bold text-sm text-text-primary"
                          value={birthDate}
                          onChange={(e) => setBirthDate(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-text-secondary uppercase tracking-wider block">เวลาเกิด (ถ้าทราบ)</label>
                      <div className="relative">
                        <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                        <input
                          type="time"
                          className="w-full pl-12 pr-4 py-3.5 bg-bg-input border border-border-strong rounded-xl focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none font-bold text-sm text-text-primary"
                          value={birthTime}
                          onChange={(e) => setBirthTime(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={runAnalysis}
                    disabled={!birthDate}
                    className={`w-full py-4.5 rounded-xl font-bold text-base transition-all ${
                      birthDate
                        ? "bg-brand-gold text-white hover:bg-brand-gold-hover shadow-sm"
                        : "bg-bg-input text-text-muted cursor-not-allowed border border-border-default"
                    }`}
                  >
                    วิเคราะห์รหัสความมั่งคั่ง
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* --- Loading Step --- */}
          {step === "loading" && (
            <div className="text-center space-y-6 relative z-10">
              <div className="relative inline-block">
                <div className="w-24 h-24 border-4 border-brand-gold-light border-t-brand-gold rounded-full animate-spin" />
                <Bot className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-brand-gold animate-bounce" size={28} />
              </div>
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-brand-gold">กำลังประมวลผลระบบดวงชะตานักธุรกิจ...</h2>
                <p className="text-text-muted text-xs italic">Nong Uni AI Coach is calculating your Wealth DNA</p>
              </div>
            </div>
          )}

          {/* --- Result Step --- */}
          {step === "result" && elementData && (
            <div className="max-w-3xl w-full space-y-6 relative z-10 py-4">
              {/* Card Result Header */}
              <div className={`rounded-3xl p-6 md:p-10 bg-gradient-to-br border shadow-sm relative overflow-hidden ${elementData.color}`}>
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
                  <div className="w-24 h-24 md:w-28 md:h-28 bg-white border border-border-default rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
                    <elementData.icon className={`w-12 h-12 md:w-16 md:h-16 ${elementData.themeColor}`} />
                  </div>

                  <div className="flex-1 text-center md:text-left space-y-2">
                    <div className={`inline-block px-3 py-1 rounded-full font-black text-[10px] tracking-wider uppercase border ${elementData.badgeColor}`}>
                      Archetype: {elementData.archetype}
                    </div>
                    <h1 className="text-3xl md:text-4xl font-display text-text-primary">{elementData.name}</h1>
                    <p className="text-base font-bold text-brand-gold italic">"{elementData.concept}"</p>
                    <p className="text-xs md:text-sm text-text-secondary leading-relaxed">{elementData.description}</p>
                  </div>
                </div>
              </div>

              {/* Analysis Details */}
              <div className="grid md:grid-cols-3 gap-6">
                {/* Strengths */}
                <div className="bg-white border border-border-default p-6 rounded-2xl space-y-4 shadow-sm">
                  <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-xs uppercase tracking-wider">
                    <CheckCircle2 size={16} /> จุดแข็งของคุณ
                  </div>
                  <ul className="space-y-2.5">
                    {elementData.strengths.map((s, idx) => (
                      <li key={idx} className="flex gap-2 text-xs text-text-secondary leading-relaxed">
                        <div className="mt-1.5 w-1.5 h-1.5 bg-emerald-500 rounded-full shrink-0" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Business Strategy */}
                <div className="bg-white border border-border-default p-6 rounded-2xl space-y-4 shadow-sm">
                  <div className="flex items-center gap-1.5 text-indigo-700 font-bold text-xs uppercase tracking-wider">
                    <Lightbulb size={16} /> กลยุทธ์การตลาด
                  </div>
                  <p className="text-text-secondary text-xs leading-relaxed bg-bg-input p-3 rounded-xl border border-border-default italic">
                    "{elementData.strengths[0]} โฟกัสแนวคิด {elementData.concept}"
                  </p>
                  <div className="space-y-1.5">
                    <p className="text-[9px] font-black text-text-muted uppercase tracking-wider">คอนเทนต์ที่เหมาะสม</p>
                    {elementData.contentIdeas.map((c, idx) => (
                      <div key={idx} className="bg-bg-input p-2 rounded-lg border border-border-muted text-[10px] text-text-secondary font-semibold">
                        💡 {c}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommended Products */}
                <div className="bg-white border border-border-default p-6 rounded-2xl space-y-4 shadow-sm">
                  <div className="flex items-center gap-1.5 text-brand-gold font-bold text-xs uppercase tracking-wider">
                    <ShoppingBag size={16} /> สินค้าตามธาตุ
                  </div>
                  <div className="space-y-2">
                    {elementData.recommended_products.map((p, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2.5 bg-bg-input rounded-xl border border-border-muted hover:border-brand-gold-muted hover:bg-white transition-all cursor-default"
                      >
                        <span className="font-semibold text-[11px] text-text-primary">{p}</span>
                        <ChevronRight size={12} className="text-brand-gold" />
                      </div>
                    ))}
                  </div>
                  <Link
                    to="/products"
                    className="w-full text-center block text-[10px] font-bold text-brand-gold hover:underline pt-2 uppercase"
                  >
                    ดูรายละเอียดสินค้า →
                  </Link>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <button
                  onClick={handleSaveToProfile}
                  disabled={isSaving || saveSuccess}
                  className={`flex-1 py-4 rounded-xl font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2 group ${
                    saveSuccess
                      ? "bg-emerald-600 text-white cursor-default"
                      : "bg-brand-gold text-white hover:bg-brand-gold-hover hover:scale-[1.01]"
                  }`}
                >
                  <CheckCircle2 size={18} />
                  <span>
                    {isSaving ? "กำลังบันทึก..." : saveSuccess ? "บันทึกผลดวงสำเร็จแล้ว! 🦄" : "บันทึกข้อมูลธาตุลงในโปรไฟล์"}
                  </span>
                  {!saveSuccess && <ChevronRight size={18} className="group-hover:translate-x-0.5 transition-transform" />}
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `ผลดวงนักธุรกิจระดับผู้นำ! ฉันวิเคราะห์ดวงได้ธาตุ "${elementData.name}" แห่งระบบพาร์ทเนอร์อัจฉริยะแล้วนะ ค้นหา Wealth DNA ของคุณฟรีได้ที่นี่!`
                    );
                    alert("คัดลอกข้อความแชร์ไปยังคลิปบอร์ดแล้วครับ!");
                  }}
                  className="px-6 py-4 bg-white border border-border-strong text-text-secondary rounded-xl font-bold text-sm hover:bg-bg-input transition-all flex items-center justify-center gap-2"
                >
                  <Share2 size={18} /> แชร์ผลลัพธ์
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </MemberLayout>
  );
}
