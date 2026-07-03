import React, { useState, useRef, useEffect, useMemo } from "react";
import { useLoaderData, Link } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import {
  Send,
  Crown,
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

// Helper to remove XML tags for copying plain text
const cleanXmlTags = (text: string) => {
  return text.replace(/<[^>]+>/g, "").trim();
};

const MessageContentRenderer = ({
  content,
  idx,
  copiedTextId,
  onCopy,
}: {
  content: string;
  idx: number;
  copiedTextId: string | null;
  onCopy: (text: string, id: string) => void;
}) => {
  const hasTags = /<Header>|<Body>|<Script>|<Prompt>|<Mission>/.test(content);

  const renderCleanText = (txt: string) => {
    if (!txt) return null;
    const lines = txt.split("\n");
    return (
      <div className="space-y-1">
        {lines.map((line, lIdx) => {
          let cleanLine = line.trim();
          if (!cleanLine) return <div key={lIdx} className="h-2" />;
          
          const isBullet = cleanLine.startsWith("* ") || cleanLine.startsWith("- ");
          if (isBullet) {
            cleanLine = cleanLine.substring(2);
          }

          const parts: React.ReactNode[] = [];
          const boldRegex = /\*\*([^*]+)\*\*/g;
          let match;
          let lastIndex = 0;
          let partIdx = 0;

          while ((match = boldRegex.exec(cleanLine)) !== null) {
            if (match.index > lastIndex) {
              parts.push(cleanLine.substring(lastIndex, match.index));
            }
            parts.push(
              <strong key={partIdx++} className="font-bold text-brand-gold">
                {match[1]}
              </strong>
            );
            lastIndex = boldRegex.lastIndex;
          }

          if (lastIndex < cleanLine.length) {
            parts.push(cleanLine.substring(lastIndex));
          }

          const lineContent = parts.length > 0 ? parts : cleanLine;

          if (isBullet) {
            return (
              <div key={lIdx} className="flex items-start gap-2 pl-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-gold mt-1.5 shrink-0" />
                <span className="text-text-primary text-xs md:text-sm font-semibold">{lineContent}</span>
              </div>
            );
          }

          return (
            <p key={lIdx} className="text-text-primary text-xs md:text-sm min-h-[1em] font-semibold">
              {lineContent}
            </p>
          );
        })}
      </div>
    );
  };

  if (!hasTags) {
    return renderCleanText(content);
  }

  const headerMatch = content.match(/<Header>([\s\S]*?)<\/Header>/);
  const bodyMatch = content.match(/<Body>([\s\S]*?)<\/Body>/);
  const missionMatch = content.match(/<Mission>([\s\S]*?)<\/Mission>/);

  const scriptRegex = /<Script(?:\s+title="([^"]*)")?>([\s\S]*?)<\/Script>/g;
  const scripts = [];
  let scriptMatch;
  while ((scriptMatch = scriptRegex.exec(content)) !== null) {
    scripts.push({
      title: scriptMatch[1] || "ตัวอย่างสคริปต์บทสนทนา",
      content: scriptMatch[2].trim(),
    });
  }

  const promptRegex = /<Prompt(?:\s+title="([^"]*)")?>([\s\S]*?)<\/Prompt>/g;
  const prompts = [];
  let promptMatch;
  while ((promptMatch = promptRegex.exec(content)) !== null) {
    prompts.push({
      title: promptMatch[1] || "AI Prompt อัจฉริยะ",
      content: promptMatch[2].trim(),
    });
  }

  const header = headerMatch ? headerMatch[1].trim() : "";
  const body = bodyMatch ? bodyMatch[1].trim() : "";
  const mission = missionMatch ? missionMatch[1].trim() : "";

  const firstTagIndex = content.search(/<Header>|<Body>|<Script>|<Prompt>|<Mission>/);
  const introText = firstTagIndex !== -1 ? content.substring(0, firstTagIndex).trim() : "";

  return (
    <div className="flex flex-col gap-3 w-full">
      {introText && (
        <div className="text-text-primary leading-relaxed">
          {renderCleanText(introText)}
        </div>
      )}

      <div className="bg-bg-page border border-brand-gold/25 rounded-2xl overflow-hidden shadow-sm flex flex-col w-full animate-fade-in">
        {header && (
          <div className="px-4 py-2.5 bg-brand-gold/10 border-b border-brand-gold/15 flex items-center justify-between">
            <span className="font-bold text-xs md:text-sm text-brand-dark flex items-center gap-1.5">
              {header}
            </span>
            <span className="text-[8px] font-extrabold text-brand-gold bg-white px-2 py-0.5 rounded-full border border-brand-gold/15 uppercase tracking-widest shrink-0 select-none">
              Flex Message
            </span>
          </div>
        )}

        <div className="p-4 flex flex-col gap-3.5 bg-white">
          {body && (
            <div className="text-xs md:text-sm text-text-secondary leading-relaxed border-l-2 border-brand-gold/30 pl-3">
              {renderCleanText(body)}
            </div>
          )}

          {scripts.map((script, sIdx) => {
            const scriptId = `script-${idx}-${sIdx}`;
            const isCopied = copiedTextId === scriptId;
            return (
              <div
                key={sIdx}
                className="bg-brand-gold-light/20 border border-brand-gold-muted/15 rounded-xl p-3.5 flex flex-col gap-2 relative group hover:border-brand-gold-muted/30 transition-all duration-200"
              >
                <div className="flex items-center justify-between border-b border-brand-gold-muted/10 pb-1.5">
                  <span className="font-bold text-[10px] md:text-[11px] text-brand-gold flex items-center gap-1 select-none">
                    💬 {script.title}
                  </span>
                  <button
                    onClick={() => onCopy(script.content, scriptId)}
                    className="text-[9px] md:text-[10px] font-bold flex items-center gap-1 px-2 py-0.5 rounded-md transition-all cursor-pointer bg-white hover:bg-brand-gold-light/40 text-text-secondary hover:text-brand-gold border border-border-default hover:border-brand-gold-muted/30"
                  >
                    {isCopied ? "คัดลอกแล้ว ✓" : "คัดลอกบทพูด 📋"}
                  </button>
                </div>
                <p className="text-xs md:text-sm text-brand-dark italic whitespace-pre-wrap font-semibold leading-relaxed">
                  "{script.content}"
                </p>
              </div>
            );
          })}

          {prompts.map((prompt, pIdx) => {
            const promptId = `prompt-${idx}-${pIdx}`;
            const isCopied = copiedTextId === promptId;
            return (
              <div
                key={pIdx}
                className="bg-brand-dark text-white rounded-xl p-3.5 flex flex-col gap-2 relative group"
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
                  <span className="font-bold text-[10px] md:text-[11px] text-brand-gold-muted flex items-center gap-1 select-none">
                    ⚡ {prompt.title}
                  </span>
                  <button
                    onClick={() => onCopy(prompt.content, promptId)}
                    className="text-[9px] md:text-[10px] font-bold flex items-center gap-1 px-2 py-0.5 rounded-md transition-all cursor-pointer bg-white/10 hover:bg-white/20 text-white/95 border border-white/10"
                  >
                    {isCopied ? "คัดลอกแล้ว ✓" : "คัดลอก Prompt 📋"}
                  </button>
                </div>
                <pre className="text-[11px] md:text-xs font-mono whitespace-pre-wrap text-brand-gold-light/95 leading-relaxed overflow-x-auto">
                  {prompt.content}
                </pre>
              </div>
            );
          })}

          {mission && (
            <div className="bg-emerald-50/40 border border-emerald-200/40 rounded-xl p-3.5 flex flex-col gap-2">
              <span className="font-bold text-[10px] md:text-[11px] text-emerald-800 flex items-center gap-1 select-none">
                🏆 ภารกิจปฏิบัติการ (Action Plan)
              </span>
              <div className="text-emerald-950">
                {renderCleanText(mission)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function AICoachPage() {
  const { profile } = useLoaderData<typeof loader>();
  const scrollRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Array<{ role: "user" | "model"; content: string }>>([
    {
      role: "model",
      content: "สวัสดีค่ะพาร์ทเนอร์ ยินดีต้อนรับสู่ห้องฝึกฝนอัจฉริยะของ Unicorn Academy นะคะ วันนี้น้องยูนิพร้อมเป็นคู่หูร่วมคิดและคู่ซ้อมตอบข้อโต้แย้ง ฝึก STP หรือร่างข้อมูลแบรนดิ้งส่วนตัวให้คุณพี่แล้วค่ะ ลองเลือกหัวข้อตัวอย่างด้านบน หรือพิมพ์คุยกับน้องยูนิได้เลยนะคะ",
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [focusArea, setFocusArea] = useState<FocusArea>("SYSTEM456");
  const [copiedTextId, setCopiedTextId] = useState<string | null>(null);

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedTextId(id);
      setTimeout(() => setCopiedTextId(null), 2000);
    });
  };

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
        <header className="px-4 py-3 flex flex-col gap-3 shrink-0 border-b border-border-default bg-white relative z-10 w-full">
          <div className="flex items-center justify-between w-full">
            <Link to="/dashboard" className="flex items-center gap-1 text-text-secondary hover:text-brand-gold transition-colors font-semibold text-xs py-1">
              <ChevronLeft size={16} />
              <span>แดชบอร์ด</span>
            </Link>

            <span className="text-emerald-700 font-bold text-[11px] bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full flex items-center gap-1.5 shrink-0 select-none">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              น้องยูนิ ออนไลน์ 24 ชม.
            </span>
          </div>

          {/* Focus Selector */}
          <div className="flex bg-bg-input p-1 rounded-xl border border-border-default overflow-x-auto no-scrollbar w-full justify-between gap-1">
            {focusOptions.map((f) => (
              <button
                key={f.id}
                onClick={() => setFocusArea(f.id as FocusArea)}
                className={`flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg text-[11px] font-bold transition-all whitespace-nowrap ${
                  focusArea === f.id
                    ? "bg-brand-gold text-white shadow-sm"
                    : "text-text-secondary hover:text-text-primary hover:bg-white/50"
                }`}
              >
                <f.icon size={12} />
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
                <div className={`flex gap-3 w-full ${m.role === "user" ? "justify-end max-w-[85%] flex-row-reverse" : "justify-start max-w-full md:max-w-[85%] flex-row flex-1"}`}>
                  
                  {/* Icon Avatar */}
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm border ${
                    m.role === "user"
                      ? "bg-brand-gold border-brand-gold text-white"
                      : "bg-brand-gold-light/35 border-brand-gold-muted/30 text-brand-gold"
                  }`}>
                    {m.role === "user" ? <User size={16} /> : <Crown size={16} />}
                  </div>

                  {/* Bubble */}
                  <div className={`rounded-2xl p-4 text-xs md:text-sm leading-relaxed font-medium shadow-sm border w-full ${
                    m.role === "user"
                      ? "bg-brand-gold text-white border-brand-gold rounded-tr-none"
                      : "bg-white text-text-primary border-border-default rounded-tl-none flex-1"
                  }`}>
                    {m.role === "user" ? (
                      <p className="whitespace-pre-wrap">{m.content}</p>
                    ) : (
                      <MessageContentRenderer
                        content={m.content}
                        idx={idx}
                        copiedTextId={copiedTextId}
                        onCopy={handleCopyText}
                      />
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Loading / Typing indicator */}
            {isLoading && (
              <div className="flex justify-start items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-brand-gold-light/35 border border-brand-gold-muted/30 flex items-center justify-center text-brand-gold shadow-sm">
                  <Crown size={16} className="animate-pulse" />
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
