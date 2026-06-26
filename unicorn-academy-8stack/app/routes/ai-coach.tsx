import React, { useState, useRef, useEffect, useMemo } from "react";
import { useLoaderData, Link } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import {
  Send,
  Bot,
  User,
  RefreshCw,
  Rocket,
  Shield,
  Loader2,
  GraduationCap,
  ChevronLeft,
} from "lucide-react";
import { createServerSupabase, requireUser } from "@/lib/supabase-server";
import type { Profile } from "@/types";
import MemberLayout from "@/components/layout/MemberLayout";

type FocusArea = "STARTUP" | "SYSTEM456" | "LEADERSHIP" | "PERSONAL_BRAND";
type Scenario = { label: string; message: string };

const scenariosByArea: Record<FocusArea, Scenario[]> = {
  STARTUP: [
    { label: "วิธีแชร์ความประทับใจสินค้า", message: "วิธีแชร์ความประทับใจสินค้า U4 Innovation ให้น่าสนใจและดึงดูดผู้มุ่งหวัง" },
    { label: "แนะนำ Unicorn Link ให้คนใหม่", message: "วิธีแนะนำระบบ Unicorn Link และ One Link ให้กับคนใหม่อย่างมืออาชีพ" },
    { label: "ฝึกการนัดหมายผู้มุ่งหวัง", message: "ฝึกพูดเพื่อโทรนัดหมายผู้มุ่งหวังเข้าร่วมการนำเสนอโอกาสทางธุรกิจ" },
    { label: "การสะสม PV ให้ถึงเป้า", message: "วิธีการและกลยุทธ์การสะสม PV ให้ถึงเป้าหมายระดับผู้เชี่ยวชาญ" },
  ],
  SYSTEM456: [
    { label: "ฝึกพูด 5 Why เพื่อเปิดใจ", message: "ช่วยสอนและฝึกพูด '5 Why' เพื่อเปิดใจเปิดทางแก้ไขข้อสงสัยผู้มุ่งหวัง" },
    { label: "ตอบข้อโต้แย้งเรื่องราคา", message: "วิธีตอบข้อโต้แย้งอย่างชาญฉลาดและนุ่มนวล เมื่อลูกค้าบอกว่าสินค้าแพงเกินไป" },
    { label: "การทำ STP (เปิดโอกาสธุรกิจ)", message: "อธิบายวิธีกระบวนการทำ STP เพื่อเปิดใจคนใหม่ โดยเน้นการเล่าคุณค่ามากกว่าการขายตรง" },
    { label: "เทคนิคการติดตาม (Follow-up)", message: "เทคนิคการติดตามผู้มุ่งหวังหลังจากส่งข้อมูลให้ศึกษา โดยไม่ทำให้พวกเขารู้สึกรำคาญ" },
  ],
  LEADERSHIP: [
    { label: "วิธีการทำ AAR (After Action)", message: "วิธีการทำ AAR (After Action Review) กับทีมงานเพื่อสะท้อนผลลัพธ์และเติบโต" },
    { label: "การทำ 1 on 1 กับทีมงาน", message: "วิธีการทำ 1 on 1 เพื่อเคลียร์เป้าหมายและสร้างพลังใจให้กับพาร์ทเนอร์ในทีม" },
    { label: "การโค้ชทีมงานให้มีแรงใจ", message: "เทคนิคการโค้ชพาร์ทเนอร์ในระบบเพื่อดึงศักยภาพสูงสุดของพวกเขาออกมา" },
    { label: "จัด House Meeting ให้มีพลัง", message: "วิธีการรันกิจกรรมกลุ่ม House Meeting ให้ตื่นเต้นและทรงพลังเพื่อปิดการขายระดับองค์กร" },
  ],
  PERSONAL_BRAND: [
    { label: "ร่าง Bio ให้น่าเชื่อถือ", message: "ช่วยคิดไอเดียและร่างประวัติ Bio สั้นๆ ให้น่าดึงดูดสำหรับใส่ in นามบัตรดิจิทัล" },
    { label: "คิดคำคม (Quote) ประจำตัว", message: "ช่วยแต่งสโลแกนหรือคำคม (Quote) ทางธุรกิจส่วนตัวสไตล์ผู้นำที่หรูหรา" },
    { label: "แนะนำจุดเด่น (Expertise)", message: "ช่วยคิดคำโปรยบอกเล่าจุดเด่นและความเชี่ยวชาญพิเศษ (Expertise) ของฉัน" },
    { label: "ร่างโปรไฟล์แบบ 3 ภาษา", message: "ช่วยร่างแนะนำตัวฉบับย่อ 3 ภาษา (ไทย/อังกฤษ/พม่า) สำหรับโปรโมทความเป็นมืออาชีพระดับสากล" },
  ]
};

const focusOptions = [
  { id: "STARTUP", icon: Rocket, label: "Start-Up", emoji: "🚀" },
  { id: "SYSTEM456", icon: Shield, label: "System 4-5-6", emoji: "🔧" },
  { id: "LEADERSHIP", icon: GraduationCap, label: "Leadership", emoji: "🏆" },
  { id: "PERSONAL_BRAND", icon: User, label: "Branding", emoji: "🌟" }
];

export function meta() {
  return [
    { title: "น้องยูนิ (AI Coach) — Unicorn Academy" },
    { name: "description", content: "คู่ซ้อมตอบข้อโต้แย้ง ฝึกพูด STP และร่างแบรนดิ้งของพาร์ทเนอร์อัจฉริยะ" },
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

export default function AICoachPage() {
  const { profile } = useLoaderData<typeof loader>();
  const scrollRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Array<{ role: "user" | "model"; content: string }>>([
    {
      role: "model",
      content: "สวัสดีค่ะพาร์ทเนอร์! 🦄 น้องยูนิ ยินดีต้อนรับสู่ห้องฝึกฝนอัจฉริยะนะคะ\n\nวันนี้น้องยูนิพร้อมเป็นคู่หูและคู่ซ้อมตอบข้อโต้แย้ง ฝึก STP หรือร่างแบรนดิ้งให้คุณพี่แล้วค่ะ ลองเลือกหัวข้อด้านบน หรือพิมพ์คุยกับน้องยูนิได้เลยนะคะ 😊✨",
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [focusArea, setFocusArea] = useState<FocusArea>("SYSTEM456");

  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const currentScenarios = useMemo(() => scenariosByArea[focusArea], [focusArea]);

  const handleSendMessage = async (textToOverride?: string) => {
    const textToSend = textToOverride || inputText;
    if (!textToSend.trim() || isLoading) return;

    const userMessage = {
      role: "user" as const,
      content: textToSend,
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    try {
      // Format history to match Gemini API structure
      const formattedHistory = [...messages, userMessage].map(m => ({
        role: m.role,
        parts: [{ text: m.content }]
      }));

      const res = await fetch("/api/ai-coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: formattedHistory,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Server status: ${res.status}`);
      }

      const data = await res.json();
      const assistantText = data.candidates?.[0]?.content?.parts?.[0]?.text || "ขออภัยค่ะน้องยูนิมึนงงเล็กน้อย ไม่สามารถประมวลผลคำตอบได้ กรุณาลองส่งคำถามใหม่อีกครั้งนะคะ";

      const assistantMessage = {
        role: "model" as const,
        content: assistantText,
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err: any) {
      console.error("AI Coach error:", err);
      const errorMessage = err.message || "เกิดข้อผิดพลาดในการเชื่อมต่อระบบปัญญาประดิษฐ์";
      setMessages(prev => [...prev, {
        role: "model" as const,
        content: `🆘 ขออภัยค่ะพาร์ทเนอร์ เกิดข้อผิดพลาดดังนี้: ${errorMessage}\n\nกรุณาลองเชื่อมต่อใหม่อีกครั้ง หรือสอบถามทีมสนับสนุนนะคะ`,
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    if (confirm("คุณแน่ใจหรือไม่ที่จะล้างการสนทนาทั้งหมด?")) {
      setMessages([
        {
          role: "model",
          content: "ล้างห้องแชทเรียบร้อยแล้วค่ะ! 🦄 วันนี้น้องยูนิพร้อมช่วยให้พาร์ทเนอร์เก่งขึ้นแล้วค่ะ ลองพิมพ์คำถามหรือเลือกสถานการณ์ซ้อมได้เลยนะคะ ✨",
        }
      ]);
    }
  };

  return (
    <MemberLayout
      profile={profile}
      title="น้องยูนิ (AI Coach)"
      subtitle="— คู่ซ้อมตอบข้อโต้แย้ง ฝึกพูด STP และร่างแบรนดิ้งของพาร์ทเนอร์อัจฉริยะ"
    >
      <div className="flex flex-col h-[calc(100vh-180px)] bg-bg-card border border-border-default rounded-3xl overflow-hidden shadow-md relative font-body">
        {/* Header */}
        <header className="px-6 py-4 flex flex-col sm:flex-row items-center justify-between shrink-0 gap-4 border-b border-border-default bg-white relative z-10">
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
            <Link to="/dashboard" className="flex items-center gap-1.5 text-text-secondary hover:text-brand-gold transition-colors font-semibold text-xs">
              <ChevronLeft size={16} />
              <span>แดชบอร์ด</span>
            </Link>

            <span className="text-emerald-700 font-bold text-xs bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full flex items-center gap-1.5 shrink-0 select-none">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              น้องยูนิ ออนไลน์ 24 ชม.
            </span>
          </div>

          {/* Focus Selector */}
          <div className="flex bg-bg-input p-1 rounded-xl border border-border-default overflow-x-auto no-scrollbar max-w-full">
            {focusOptions.map((f) => (
              <button
                key={f.id}
                onClick={() => setFocusArea(f.id as FocusArea)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                  focusArea === f.id
                    ? "bg-brand-gold text-white shadow-sm"
                    : "text-text-secondary hover:text-text-primary hover:bg-white/50"
                }`}
              >
                <f.icon size={13} />
                <span>{f.label}</span>
              </button>
            ))}
          </div>
        </header>

        {/* Chat Space */}
        <div className="flex-1 flex flex-col overflow-hidden bg-bg-page/30 relative">
          
          {/* Scrollable messages container */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 md:p-6 space-y-5 custom-scrollbar"
          >
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`flex gap-3 max-w-[85%] ${m.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                  
                  {/* Icon Avatar */}
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm border ${
                    m.role === "user"
                      ? "bg-brand-gold border-brand-gold text-white"
                      : "bg-white border-border-default text-brand-gold"
                  }`}>
                    {m.role === "user" ? <User size={16} /> : <Bot size={16} />}
                  </div>

                  {/* Bubble */}
                  <div className={`rounded-2xl p-4 text-xs md:text-sm leading-relaxed font-medium shadow-sm border ${
                    m.role === "user"
                      ? "bg-brand-gold text-white border-brand-gold rounded-tr-none"
                      : "bg-white text-text-primary border-border-default rounded-tl-none"
                  }`}>
                    <p className="whitespace-pre-wrap">{m.content}</p>
                  </div>
                </div>
              </div>
            ))}

            {/* Loading / Typing indicator */}
            {isLoading && (
              <div className="flex justify-start items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white border border-border-default flex items-center justify-center text-brand-gold shadow-sm">
                  <Bot size={16} />
                </div>
                <div className="bg-white border border-border-default px-4 py-3 rounded-2xl rounded-tl-none flex items-center gap-1.5 shadow-sm">
                  <div className="w-1.5 h-1.5 bg-brand-gold rounded-full animate-bounce" />
                  <div className="w-1.5 h-1.5 bg-brand-gold rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="w-1.5 h-1.5 bg-brand-gold rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
          </div>

          {/* Quick Scenario Buttons */}
          <div className="bg-white border-t border-border-default p-3 overflow-x-auto whitespace-nowrap no-scrollbar flex items-center gap-2 shrink-0">
            <span className="text-[10px] font-bold text-brand-gold bg-brand-gold-light/40 px-2.5 py-1 rounded-md border border-brand-gold-muted/20 uppercase tracking-wider shrink-0 select-none">
              สถานการณ์ซ้อม {focusOptions.find(f => f.id === focusArea)?.emoji}
            </span>
            {currentScenarios.map((s, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(s.message)}
                className="px-3.5 py-1.5 bg-white border border-border-default rounded-full text-xs font-semibold text-text-secondary hover:border-brand-gold hover:bg-brand-gold-light/20 hover:text-brand-gold transition-all duration-200 shadow-sm shrink-0"
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Input control box */}
          <div className="p-3 md:p-4 bg-white border-t border-border-default shrink-0 flex items-center gap-3">
            <button
              onClick={handleClearChat}
              className="p-3 bg-white border border-border-strong rounded-xl text-text-muted hover:text-red-600 hover:bg-red-50 hover:border-red-200 transition-all shrink-0"
              title="ล้างประวัติการสนทนา"
            >
              <RefreshCw size={16} />
            </button>

            <div className="flex-1 bg-bg-input border border-border-strong rounded-xl px-4 py-2 flex items-center gap-3 focus-within:border-brand-gold focus-within:ring-1 focus-within:ring-brand-gold-light/50 transition-all">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="พิมพ์สิ่งที่ต้องการซ้อมพูด หรือซ้อมตอบข้อโต้แย้ง..."
                className="flex-1 bg-transparent border-none text-xs md:text-sm font-semibold text-text-primary placeholder-text-muted focus:ring-0 outline-none"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputText.trim() || isLoading}
                className={`p-2 rounded-lg flex items-center justify-center transition-all ${
                  !inputText.trim() || isLoading
                    ? "text-text-muted cursor-not-allowed bg-transparent"
                    : "bg-brand-gold text-white hover:bg-brand-gold-hover shadow-sm"
                }`}
              >
                <Send size={14} className="fill-current" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </MemberLayout>
  );
}
