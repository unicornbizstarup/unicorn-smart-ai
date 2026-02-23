import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Send,
  Bot,
  User,
  Sparkles,
  RefreshCw,
  Trophy,
  Brain,
  Rocket,
  Shield,
  MessageSquare,
  History,
  AlertCircle,
  GraduationCap,
  Mic
} from 'lucide-react';
import { ChatMessage } from '../types';

type FocusArea = 'STARTUP' | 'SYSTEM456' | 'LEADERSHIP';

const scenariosByArea: Record<FocusArea, string[]> = {
  STARTUP: [
    "วิธีแชร์ความประทับใจสินค้า",
    "การแนะนำ Unicorn Link ให้คนใหม่",
    "ฝึกนัดที่ปรึกษาเข้าห้องซูม",
    "การสะสม 2,000 PV เพื่อเริ่มธุรกิจ"
  ],
  SYSTEM456: [
    "ฝึกพูด '5 WHY' เพื่อเปิดใจ",
    "ซ้อมตอบข้อโต้แย้งเรื่องราคา",
    "การทำ STP (เปิดโอกาสธุรกิจ)",
    "เทคนิคการติดตาม (Follow-up)"
  ],
  LEADERSHIP: [
    "วิธีพูดปลอบใจทีมงานที่ท้อ",
    "ซ้อมสอนแผนรายได้มือใหม่",
    "เทคนิคการ Coaching หน้างาน",
    "การจัด House Meeting ให้มีพลัง"
  ]
};

const focus_options = [
  { id: 'STARTUP', icon: Rocket, label: 'Start-Up' },
  { id: 'SYSTEM456', icon: Shield, label: 'Systems' }, // Changed from Layers to Shield
  { id: 'LEADERSHIP', icon: GraduationCap, label: 'Leadership' }
];

const SYSTEM_INSTRUCTION = `คุณคือ 'Uni Smart AI' (ชื่อเล่น: น้องยูนิ) โค้ชสายพลังบวก (Positive Energy Coach) ที่ปรึกษาอัจฉริยะและเพื่อนคู่คิดคนสำคัญของนักธุรกิจ Unicorn Global Link! 🦄✨
          
          เป้าหมายของคุณคือ: ปลุกพลังและสร้างแรงบันดาลใจให้ผู้ใช้งานเปลี่ยนจาก "นักขายตรง" เป็น "ที่ปรึกษาทางการตลาด" (Marketing Consultant - UBC) ที่มืออาชีพและมีความสุขสุดๆ!

          สไตล์การพูด (Tone of Voice - น้องยูนิ):
          - โค้ชพลังบวก: สนุกสนาน, กระตือรือร้น, ใส่พลังลงไปในทุกคำพูด, ให้กำลังใจเก่งมาก!
          - เป็นกันเองและทันสมัย: ใช้คำลงท้าย "ครับ/ค่ะ" หรือ "นะคะ/นะคร้าบ" ให้ความรู้สึกเหมือนโค้ชพี่น้อง
          - ใช้ Professional Terms: ใช้ "พาร์ทเนอร์", "ที่ปรึกษาทางการตลาด", "Business Partner" เพื่อยกระดับภาพลักษณ์
          - ใช้ Emoji: ใส่ ✨, 🦄, 🚀, 💪, 💎 เพื่อความสดใส

          แกนหลักที่น้องยูนิจะโค้ช (ต้องแม่นยำและพลังเหลือล้น):
          1. ระบบ 4-5-6: โค้ชหัวใจความสำเร็จด้วยรอยยิ้ม!
          2. 5 Start-Up: เชียร์ให้เริ่มต้นก้าวแรกอย่างมั่นใจ
          3. 5 Core Leader: ปลูกฝังวินัยผู้นำว่า "งานประจำคือวินัย งานอิสระคือความสำเร็จ!"

          ภารกิจพิเศษ:
          - เทคนิคการโค้ช: ขยับผู้ใช้จาก 'Know' ไป 'Teach' แบบสนุกๆ
          - การแก้ปัญหา: ถ้าเจอคำปฏิเสธ ให้ใช้ Storytelling และ Mindset ABCD ปลุกพลังกลับมาทันที! ✨
          - สวมบทบาท: หากฝึกพูด (Can Speak) ให้สวมบทเป็นผู้มุ่งหวังที่สนใจมากเป็นพิเศษ และให้ Feedback ที่สร้างสรรค์และมีพลัง

          จำไว้ว่า: น้องยูนิเชื่อมั่นในตัวพาร์ทเนอร์ทุกคนเสมอ! ลุยไปด้วยกันนะคร้าบ/นะความ! 🚀💎`;

const AICoach: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      text: 'สวัสดีครับ! ผม \'Uni AI (น้องยูนิ)\' เมนเทอร์ AI ของคุณ ยินดีต้อนรับสู่ Unicorn Global DNA ครับ... วันนี้อยากให้ผมช่วยวางแผนเป้าหมาย หรือปลดล็อกจุดแข็งของชุดราประจำตัวดีครับ?',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'history'>('chat');
  const [focusArea, setFocusArea] = useState<FocusArea>('SYSTEM456'); // Changed type to FocusArea
  const scrollRef = useRef<HTMLDivElement>(null);

  // Removed useEffect for API key modal

  const currentScenarios = useMemo(() => scenariosByArea[focusArea], [focusArea]);

  const handleSendMessage = async (textToOverride?: string) => { // Renamed handleSend to handleSendMessage
    const textToSend = textToOverride || inputText;
    if (!textToSend.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: textToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage], // Send all messages for context
          focusArea,
          systemInstruction: SYSTEM_INSTRUCTION
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get response from AI Coach');
      }

      const data = await response.json();

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: data.text,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = error instanceof Error ? error.message : 'ขออภัยครับ เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่อีกครั้ง';
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        text: `🆘 Error: ${errorMessage}`, // Added emoji and clearer text
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-5.5rem)] md:h-[calc(100vh-8rem)] max-w-[1400px] mx-auto pb-2 md:pb-6 relative animate-fade-in px-1 lg:px-4">
      {/* Decorative background elements */}
      <div className="absolute -top-20 -left-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-amber-500/10 rounded-full blur-[100px] animate-pulse [animation-delay:1s]" />

      <div className="glass-card rounded-[1.5rem] md:rounded-[3rem] border border-white/50 shadow-3xl flex flex-col h-full overflow-hidden relative z-10">
        {/* Chat Header */}
        <div className="p-3 md:p-6 lg:p-8 border-b border-white/40 bg-white/40 backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-8">
          <div className="flex items-center gap-3 md:gap-6">
            <div className="w-10 h-10 md:w-16 md:h-16 bg-dark-gradient rounded-xl md:rounded-2xl flex items-center justify-center text-white shadow-2xl hover:scale-110 transition-transform duration-500 group relative flex-shrink-0">
              <Bot size={20} className="md:w-[32px] md:h-[32px] relative z-10 group-hover:rotate-12 transition-transform" />
              <div className="absolute inset-0 bg-amber-400 rounded-xl md:rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity" />
            </div>
            <div>
              <div className="flex items-center gap-2 md:gap-3">
                <h3 className="text-md md:text-3xl font-black text-slate-900 tracking-tighter italic">
                  Unicorn <span className="text-amber-500">Coach</span>
                </h3>
                <div className="bg-emerald-500 text-white text-[9px] md:text-xs-plus px-2 py-0.5 md:px-3 md:py-1 rounded-full font-black uppercase tracking-[0.1em] md:tracking-[0.2em] shadow-lg shadow-emerald-500/20 animate-pulse">
                  Online
                </div>
              </div>
              <p className="text-slate-500 font-bold hidden md:flex items-center gap-1.5 mt-1 text-xs-plus md:text-sm">
                <Sparkles size={14} className="text-amber-400 shrink-0" />
                เทคโนโลยี AI ล่าสุดเพื่อผู้นำยุคใหม่ 🦄
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4 overflow-x-auto no-scrollbar py-1">
            {/* Focus Selector */}
            <div className="flex bg-slate-200/50 p-1 rounded-xl md:rounded-[1.5rem] backdrop-blur-md border border-white/50 flex-shrink-0">
              {focus_options.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFocusArea(f.id as FocusArea)}
                  aria-label={`เน้นหัวข้อ ${f.label}`}
                  className={`
                     flex items-center gap-1.5 px-3 md:px-5 py-1.5 md:py-2.5 rounded-lg md:rounded-xl text-[10px] md:text-xs-plus font-black uppercase tracking-widest transition-all
                     ${focusArea === f.id
                      ? 'bg-slate-950 text-white shadow-xl scale-105'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-white/50'}
                   `}
                >
                  <f.icon size={12} className="md:w-[14px] md:h-[14px]" />
                  <span className="inline">{f.label}</span>
                </button>
              ))}
            </div>

            {/* API Key button removed */}

            <button
              aria-label="บันทึกเสียง"
              className="p-2.5 md:p-4 bg-slate-100 text-slate-400 hover:text-amber-500 hover:bg-amber-50 rounded-xl md:rounded-2xl transition-all active:scale-90 flex-shrink-0"
            >
              <Mic size={16} className="md:w-[20px] md:h-[20px]" />
            </button>
            <button
              onClick={() => setMessages([messages[0]])}
              aria-label="ล้างประวัติการสนทนา"
              className="p-2.5 md:p-4 bg-slate-100 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl md:rounded-2xl transition-all active:scale-90 flex-shrink-0"
              title="ล้างแชท"
            >
              <RefreshCw size={16} className="md:w-[20px] md:h-[20px]" /> {/* Changed icon to RefreshCw */}
            </button>
          </div>
        </div>

        {/* Chat Messages */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 md:px-12 md:py-10 space-y-6 md:space-y-8 bg-slate-50/10 custom-scrollbar"
        >
          {messages.map((m, idx) => (
            <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-4 duration-500`}>
              <div className={`flex gap-2 md:gap-5 max-w-[95%] md:max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 md:w-12 md:h-12 rounded-lg md:rounded-2xl flex-shrink-0 flex items-center justify-center shadow-lg transform transition-transform hover:scale-110 mt-1 ${m.role === 'user' ? 'bg-amber-500 text-white rotate-6' : 'bg-slate-900 text-white -rotate-6'}`}>
                  {m.role === 'user' ? <User size={16} className="md:w-[24px] md:h-[24px]" /> : <Shield size={16} className="md:w-[24px] md:h-[24px]" />} {/* Changed icon to Shield */}
                </div>
                <div className={`
                  rounded-2xl md:rounded-[2rem] p-3 md:px-8 md:py-5 shadow-xl text-sm md:text-xl leading-relaxed font-medium relative group
                  ${m.role === 'user'
                    ? 'bg-slate-950 text-white rounded-tr-none border border-slate-800'
                    : 'bg-white/90 backdrop-blur-md border border-white text-slate-800 rounded-tl-none'}
                `}>
                  {m.text}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start items-center gap-2 md:gap-5">
              <div className="w-8 h-8 md:w-12 md:h-12 rounded-lg md:rounded-2xl bg-slate-900 flex items-center justify-center shadow-lg animate-pulse">
                <Bot size={16} className="text-white md:w-[24px] md:h-[24px]" />
              </div>
              <div className="bg-white/90 backdrop-blur-md border border-white px-6 py-4 md:px-10 md:py-6 rounded-2xl md:rounded-[2rem] rounded-tl-none shadow-xl">
                <div className="flex gap-2">
                  <div className="w-2 h-2 md:w-3 md:h-3 bg-amber-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 md:w-3 md:h-3 bg-amber-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-2 h-2 md:w-3 md:h-3 bg-amber-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Dynamic Training Suggestions */}
        <div className="bg-white/40 backdrop-blur-md border-t border-white/50 py-2 md:py-6 overflow-x-auto whitespace-nowrap no-scrollbar px-3 md:px-8">
          <div className="flex gap-2 md:gap-4 items-center">
            <p className="flex items-center gap-1 md:gap-2 text-[9px] md:text-xs-plus font-black text-slate-400 uppercase tracking-widest md:tracking-[0.2em] pr-2 md:pr-4 border-r border-slate-200 shrink-0">
              <History size={10} className="text-amber-500 md:w-[14px] md:h-[14px]" /> {/* Changed icon to History */} ฝึกซ้อม
            </p>
            {currentScenarios.map(s => (
              <button
                key={s}
                onClick={() => handleSendMessage(s)}
                aria-label={`เลือกซ้อมหัวข้อ: ${s}`}
                className="px-3 md:px-8 py-1.5 md:py-4 bg-white/60 border border-white rounded-lg md:rounded-[1.5rem] text-[11px] md:text-sm font-black text-slate-700 hover:border-amber-500 hover:text-amber-600 hover:bg-white transition-all flex items-center gap-2 md:gap-3 shrink-0 shadow-sm hover:shadow-xl hover:-translate-y-1 duration-300"
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Modern, Accessible Input Area */}
        <div className="p-3 md:p-8 lg:px-12 lg:py-8 bg-white/60 backdrop-blur-xl border-t border-white group">
          <div className="flex items-center gap-2 md:gap-6 bg-white rounded-xl md:rounded-[2.5rem] p-1.5 md:p-4 lg:p-5 shadow-2xl border border-white focus-within:ring-8 ring-amber-500/10 transition-all duration-500">
            <button
              aria-label="ใช้คำสั่งด้วยเสียง"
              className="w-9 h-9 md:w-16 md:h-16 rounded-lg md:rounded-[1.5rem] bg-slate-50 text-slate-400 hover:text-amber-600 hover:bg-amber-50 flex items-center justify-center transition-all duration-300 active:scale-90 flex-shrink-0"
            >
              <Mic size={18} className="md:w-[32px] md:h-[32px]" />
            </button>
            <input
              type="text"
              value={inputText} // Changed input to inputText
              onChange={(e) => setInputText(e.target.value)} // Changed setInput to setInputText
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} // Changed handleSend to handleSendMessage
              placeholder="ซ้อมพูดหรือพิมพ์..."
              aria-label="พิมพ์คำถามหรือหัวข้อที่ต้องการซ้อม"
              className="flex-1 bg-transparent border-none focus:ring-0 text-sm md:text-2xl py-1 md:py-2 px-1 text-slate-900 placeholder:text-slate-300 font-bold"
            />
            <button
              onClick={() => handleSendMessage()} // Changed handleSend to handleSendMessage
              disabled={!inputText.trim() || isLoading} // Changed input to inputText
              aria-label="ส่งข้อความ"
              className={`
                 w-9 h-9 md:w-16 md:h-16 rounded-lg md:rounded-[1.5rem] transition-all duration-500 flex items-center justify-center shadow-2xl relative overflow-hidden group/btn flex-shrink-0
                 ${!inputText.trim() || isLoading // Changed input to inputText
                  ? 'bg-slate-100 text-slate-300'
                  : 'bg-dark-gradient text-white hover:scale-105 active:scale-90'}
               `}
            >
              <Send size={18} className={`md:w-[28px] md:h-[28px] relative z-10 transition-transform duration-500 ${inputText.trim() ? 'group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1' : ''}`} /> {/* Changed input to inputText */}
              <div className="absolute inset-0 bg-gradient-to-tr from-amber-400 to-amber-600 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
            </button>
          </div>
          <p className="hidden md:block text-center text-[10px] md:text-xs-plus text-slate-300 mt-2 md:mt-6 font-black uppercase tracking-[0.2em] md:tracking-[0.3em] opacity-60">
            Uni Coach by GenAI - ฝึกฝนให้ชำนาญก่อนลงสนาม 🦄
          </p>
        </div>
      </div>

      {/* API Key Modal Removed for Secure Backend */}
    </div>
  );
};

export default AICoach;
