"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import { createClient } from "@/lib/supabase";
import Link from "next/link";

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
    color: "from-red-500/20 to-orange-500/20 border-orange-500/30",
    icon: Zap,
    themeColor: "text-orange-500",
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
    color: "from-blue-500/20 to-cyan-500/20 border-cyan-500/30",
    icon: Waves,
    themeColor: "text-cyan-500",
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
    color: "from-amber-600/20 to-yellow-800/20 border-amber-500/30",
    icon: Shield,
    themeColor: "text-amber-500",
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
    color: "from-indigo-500/20 to-purple-500/20 border-purple-500/30",
    icon: Airplay,
    themeColor: "text-purple-400",
  },
};

import MemberLayout from "@/components/layout/MemberLayout";

export default function WealthDNAPage() {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const [profileRaw, setProfileRaw] = useState<any>(null);
  const [step, setStep] = useState<"intro" | "form" | "loading" | "result">("intro");
  const [birthDate, setBirthDate] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const [analyzedElement, setAnalyzedElement] = useState<"FIRE" | "WATER" | "EARTH" | "AIR" | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
        setProfileRaw(profileData);
      }
    }
    loadData();
  }, []);

  const handleStart = () => setStep("form");

  const runAnalysis = () => {
    if (!birthDate) return;
    setStep("loading");

    setTimeout(() => {
      const date = new Date(birthDate);
      const dayOfWeek = date.getDay(); // 0 คือวันอาทิตย์

      // แผนผังการคำนวณตามดวงดาวประจำวันเกิดแบบคงที่
      const elements: ("FIRE" | "WATER" | "EARTH" | "AIR")[] = [
        "FIRE",  // 0: วันอาทิตย์ (ธาตุไฟ)
        "WATER", // 1: วันจันทร์ (ธาตุน้ำ)
        "EARTH", // 2: วันอังคาร (ธาตุดิน)
        "AIR",   // 3: วันพุธ (ธาตุลม)
        "FIRE",  // 4: วันพฤหัสบดี (ธาตุไฟ)
        "WATER", // 5: วันศุกร์ (ธาตุน้ำ)
        "EARTH", // 6: วันเสาร์ (ธาตุดิน)
      ];

      const element = elements[dayOfWeek % elements.length];
      setAnalyzedElement(element);
      setStep("result");
    }, 2500);
  };

  const handleSaveToProfile = async () => {
    if (!user || !analyzedElement) {
      alert("กรุณาเข้าสู่ระบบก่อนเพื่อทำการบันทึกผลลงโปรไฟล์!");
      router.push("/auth/login");
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ wealth_element: analyzedElement })
        .eq("id", user.id);

      if (error) throw error;

      setSaveSuccess(true);
      setTimeout(() => {
        router.push("/dashboard");
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
      profile={profileRaw}
      title="Wealth DNA"
      subtitle="— ถอดรหัสพื้นดวงธาตุเจ้าเรือนเพื่อค้นหา สไตล์การสร้างความมั่งคั่ง ที่ใช่คุณ"
    >
      <div className="max-w-4xl mx-auto text-[#1a1209]">
        <div className="flex items-center justify-between mb-6">
          <Link href="/dashboard" className="flex items-center gap-2 group text-[#6b5e4a] hover:text-[#b8924a] font-semibold text-xs transition-colors">
            <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
            <span>กลับหน้าแดชบอร์ด</span>
          </Link>
          <span className="text-[#b8924a] font-bold tracking-widest text-[10px] uppercase bg-[#f5e8d0] px-3 py-1 rounded-full border border-[#e8dcc4]">
            Unicorn Wealth DNA
          </span>
        </div>

        {/* ── Dark container for all DNA steps ── */}
        <div className="bg-[#0f172a] rounded-2xl p-6 md:p-10 min-h-[480px] flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-72 h-72 bg-[#b8924a]/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#b8924a]/3 rounded-full blur-3xl pointer-events-none" />

        {/* --- Intro Step --- */}
        {step === "intro" && (
          <div className="max-w-2xl w-full text-center space-y-10 relative z-10">
            <div className="relative inline-block">
              <div className="text-8xl md:text-9xl select-none">🦄</div>
              <div className="absolute -top-4 -right-4 animate-pulse">
                <Sparkles className="text-brand-gold w-10 h-10" />
              </div>
            </div>

            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-gold/10 border border-brand-gold/20 rounded-full text-brand-gold text-xs font-black tracking-widest uppercase">
                ✨ ค้นพบรหัสลับความมั่งคั่งของคุณ
              </div>
              <h1 className="text-4xl md:text-6xl font-display text-brand-gold leading-tight">
                Unicorn Wealth DNA
              </h1>
              <p className="text-base md:text-lg text-white/60 max-w-lg mx-auto leading-relaxed">
                ถอดรหัสพื้นดวง เปิดประตูสู่ความมั่งคั่ง วิเคราะห์ธาตุเจ้าเรือนเพื่อค้นพบ "สไตล์การรวย" ที่ใช่คุณ
              </p>
            </div>

            <div className="flex flex-col items-center gap-3">
              <button
                onClick={handleStart}
                className="w-full md:w-auto px-10 py-5 bg-brand-gold text-brand-dark font-black text-lg rounded-2xl shadow-xl shadow-brand-gold/20 flex items-center justify-center gap-2 group hover:scale-105 active:scale-95 transition-all duration-300"
              >
                <Sparkles size={20} /> เริ่มต้นวิเคราะห์ DNA <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
              <p className="text-xs text-white/40">ฟรี! ไม่มีค่าใช้จ่าย • ใช้เวลาไม่ถึง 1 นาที</p>
            </div>
          </div>
        )}

        {/* --- Form Step --- */}
        {step === "form" && (
          <div className="max-w-md w-full space-y-6 relative z-10">
            <button
              onClick={() => setStep("intro")}
              className="flex items-center gap-1.5 text-white/60 hover:text-white transition-colors text-sm font-semibold"
            >
              <ChevronLeft size={16} /> กลับหน้าแรก
            </button>

            <div className="glass p-8 md:p-10 border-white/10 shadow-2xl">
              <div className="space-y-6">
                <div className="text-center space-y-1.5">
                  <h2 className="text-2xl font-display text-brand-gold">ข้อมูลพื้นดวง</h2>
                  <p className="text-white/60 text-xs font-medium">กรุณากรอกข้อมูลเพื่อใช้ในการคำนวณธาตุเจ้าเรือน</p>
                </div>

                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-white/40 uppercase tracking-widest block">วัน/เดือน/ปี เกิด</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                      <input
                        type="date"
                        className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl focus:border-brand-gold/60 focus:ring-1 focus:ring-brand-gold/30 transition-all outline-none font-bold text-sm text-white"
                        value={birthDate}
                        onChange={(e) => setBirthDate(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-white/40 uppercase tracking-widest block">เวลาเกิด (ถ้าทราบ)</label>
                    <div className="relative">
                      <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                      <input
                        type="time"
                        className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl focus:border-brand-gold/60 focus:ring-1 focus:ring-brand-gold/30 transition-all outline-none font-bold text-sm text-white"
                        value={birthTime}
                        onChange={(e) => setBirthTime(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <button
                  onClick={runAnalysis}
                  disabled={!birthDate}
                  className={`w-full py-4 rounded-xl font-bold text-base transition-all duration-300 ${
                    birthDate
                      ? "bg-brand-gold text-brand-dark hover:bg-brand-gold/90 shadow-lg shadow-brand-gold/10"
                      : "bg-white/5 text-white/20 cursor-not-allowed border border-white/5"
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
              <div className="w-24 h-24 border-4 border-brand-gold/10 border-t-brand-gold rounded-full animate-spin" />
              <Bot className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-brand-gold animate-bounce" size={28} />
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-display text-brand-gold animate-pulse">กำลังวิเคราะห์ดวงดาวและความมั่งคั่ง...</h2>
              <p className="text-white/40 text-xs italic">Nong Uni AI Coach is calculating your Wealth DNA</p>
            </div>
          </div>
        )}

        {/* --- Result Step --- */}
        {step === "result" && elementData && (
          <div className="max-w-4xl w-full space-y-6 relative z-10 pb-12">
            {/* Card Result Header */}
            <div className={`rounded-3xl p-8 md:p-12 text-white bg-gradient-to-br border shadow-2xl relative overflow-hidden ${elementData.color}`}>
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                <div className="w-28 h-28 md:w-36 md:h-36 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 flex items-center justify-center shrink-0">
                  <elementData.icon className={`w-14 h-14 md:w-20 md:h-20 ${elementData.themeColor}`} />
                </div>

                <div className="flex-1 text-center md:text-left space-y-3">
                  <div className="inline-block px-4 py-1 bg-white/10 border border-white/15 rounded-full font-bold text-xs tracking-widest uppercase">
                    Archetype: {elementData.archetype}
                  </div>
                  <h1 className="text-3xl md:text-5xl font-display text-brand-gold">{elementData.name}</h1>
                  <p className="text-lg md:text-xl font-bold text-white/95 italic">"{elementData.concept}"</p>
                  <p className="text-sm md:text-base text-white/70 max-w-2xl leading-relaxed">{elementData.description}</p>
                </div>
              </div>
            </div>

            {/* Analysis Details */}
            <div className="grid md:grid-cols-3 gap-6">
              {/* Strengths */}
              <div className="glass p-6 md:p-8 space-y-4">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm uppercase tracking-wider">
                  <CheckCircle2 size={18} /> จุดแข็งของคุณ
                </div>
                <ul className="space-y-2.5">
                  {elementData.strengths.map((s, idx) => (
                    <li key={idx} className="flex gap-2 text-sm text-white/80">
                      <div className="mt-2 w-1.5 h-1.5 bg-emerald-500 rounded-full shrink-0" />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Business Strategy */}
              <div className="glass p-6 md:p-8 space-y-4">
                <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm uppercase tracking-wider">
                  <Lightbulb size={18} /> กลยุทธ์ธุรกิจที่แนะนำ
                </div>
                <p className="text-white/80 text-sm leading-relaxed bg-white/5 p-4 rounded-xl border border-white/5 italic">
                  "{elementData.strengths[0]} คือผู้นำแนวคิด {elementData.concept}"
                </p>
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">ไอเดียทำคอนเทนต์</p>
                  {elementData.contentIdeas.map((c, idx) => (
                    <div key={idx} className="bg-white/5 p-2.5 rounded-lg border border-white/5 text-xs text-white/70 font-semibold">
                      💡 {c}
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Products */}
              <div className="glass p-6 md:p-8 space-y-4">
                <div className="flex items-center gap-2 text-brand-gold font-bold text-sm uppercase tracking-wider">
                  <ShoppingBag size={18} /> สินค้าแนะนำรวยตามธาตุ
                </div>
                <div className="space-y-2">
                  {elementData.recommended_products.map((p, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 hover:border-brand-gold/30 hover:bg-brand-gold/5 transition-all duration-300"
                    >
                      <span className="font-semibold text-xs text-white/85">{p}</span>
                      <ChevronRight size={14} className="text-brand-gold" />
                    </div>
                  ))}
                </div>
                <Link
                  href="/dashboard"
                  className="w-full text-center block text-xs font-bold text-brand-gold hover:underline pt-2"
                >
                  กลับหน้าแคตตาล็อกสินค้า
                </Link>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-col md:flex-row gap-4 pt-2">
              <button
                onClick={handleSaveToProfile}
                disabled={isSaving || saveSuccess}
                className={`flex-1 py-4.5 rounded-xl font-bold text-base shadow-xl transition-all duration-300 flex items-center justify-center gap-2 group ${
                  saveSuccess
                    ? "bg-emerald-500 text-white cursor-default"
                    : "bg-brand-gold text-brand-dark hover:bg-brand-gold/90"
                }`}
              >
                <CheckCircle2 size={20} />
                <span>
                  {isSaving ? "กำลังบันทึก..." : saveSuccess ? "บันทึกผลดวงสำเร็จแล้ว! 🦄" : "บันทึกผลไปที่โปรไฟล์"}
                </span>
                {!saveSuccess && <ChevronRight size={20} className="group-hover:translate-x-0.5 transition-transform" />}
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(
                    `ดวงชะตานักธุรกิจร้อยล้าน! ฉันวิเคราะห์ดวงได้เป็น "${elementData.name}" แห่งระบบ Unicorn Academy แล้วนะ ค้นหา Wealth DNA ของคุณฟรีได้ที่นี่!`
                  );
                  alert("คัดลอกข้อความแชร์ความรวยไปยังคลิปบอร์ดแล้วครับ!");
                }}
                className="px-8 py-4.5 bg-white/5 border border-white/10 rounded-xl font-bold text-base hover:bg-white/10 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <Share2 size={20} /> แชร์ผลลัพธ์
              </button>
            </div>
          </div>
        )}
        </div>{/* end dark DNA container */}
      </div>
    </MemberLayout>
  );
}
