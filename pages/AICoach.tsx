
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Send, Bot, User, Sparkles, RefreshCcw, Mic, ShieldCheck, Star, Rocket, Layers, GraduationCap, Key, Settings, AlertCircle } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
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
  { id: 'SYSTEM456', icon: Layers, label: 'Systems' },
  { id: 'LEADERSHIP', icon: GraduationCap, label: 'Leadership' }
];

const AICoach: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'สวัสดีครับผู้นำ Unicorn! ผมคือโค้ชอัจฉริยะ พร้อมช่วยคุณฝึก "พูดให้โดนใจ" และ "สอนให้เป็นระบบ" วันนี้อยากลองซ้อมพูดในระดับไหนดีครับ?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [focusArea, setFocusArea] = useState<FocusArea>('SYSTEM456');
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('gemini_api_key') || '');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!apiKey) {
      setShowKeyModal(true);
    }
  }, [apiKey]);

  const currentScenarios = useMemo(() => scenariosByArea[focusArea], [focusArea]);

  const handleSend = async (textToOverride?: string) => {
    const textToSend = textToOverride || input;
    if (!textToSend.trim() || isLoading) return;

    const userText = textToSend;

    if (!apiKey) {
      setShowKeyModal(true);
      return;
    }

    setInput('');
    const newMessages: ChatMessage[] = [...messages, { role: 'user', text: userText }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: apiKey });

      const focusText = {
        STARTUP: "เน้นพื้นฐานการเริ่มต้น (5 Start-Up) และการใช้สินค้า",
        SYSTEM456: "เน้นการสร้างธุรกิจผ่านระบบ 4-5-6 และการลงมือทำ 5 ทำ",
        LEADERSHIP: "เน้นการเป็นผู้นำ (6 เป็น) และทักษะการสอนงาน (Train the Trainer)"
      }[focusArea];

      const response = await ai.models.generateContent({
        model: 'gemini-1.5-flash',
        contents: [
          ...newMessages.map(m => ({
            role: m.role === 'user' ? 'user' : 'model',
            parts: [{ text: m.text }]
          }))
        ],
        config: {
          systemInstruction: `คุณคือ 'Uni Smart AI' (ชื่อเล่น: น้องยูนิ) โค้ชสายพลังบวก (Positive Energy Coach) ที่ปรึกษาอัจฉริยะและเพื่อนคู่คิดคนสำคัญของนักธุรกิจ Unicorn Global Link! 🦄✨
          
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
          - โฟกัสขณะนี้: ${focusText}
          - เทคนิคการโค้ช: ขยับผู้ใช้จาก 'Know' ไป 'Teach' แบบสนุกๆ
          - การแก้ปัญหา: ถ้าเจอคำปฏิเสธ ให้ใช้ Storytelling และ Mindset ABCD ปลุกพลังกลับมาทันที! ✨
          - สวมบทบาท: หากฝึกพูด (Can Speak) ให้สวมบทเป็นผู้มุ่งหวังที่สนใจมากเป็นพิเศษ และให้ Feedback ที่สร้างสรรค์และมีพลัง

          จำไว้ว่า: น้องยูนิเชื่อมั่นในตัวพาร์ทเนอร์ทุกคนเสมอ! ลุยไปด้วยกันนะคร้าบ/นะความ! 🚀💎`
        }
      });

      const aiText = response.text || 'ขออภัยครับ ผมกำลังประมวลผลข้อมูลเชิงลึกอยู่ โปรดรอสักครู่';
      setMessages(prev => [...prev, { role: 'model', text: aiText }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', text: 'ขออภัยครับ ระบบเชื่อมต่อโค้ชขัดข้องชั่วคราว' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] max-w-5xl mx-auto pb-6 relative animate-fade-in px-2 lg:px-0">
      {/* Decorative background elements */}
      <div className="absolute -top-20 -left-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-amber-500/10 rounded-full blur-[100px] animate-pulse [animation-delay:1s]" />

      <div className="glass-card rounded-[3rem] border border-white/50 shadow-3xl flex flex-col h-full overflow-hidden relative z-10">
        {/* Chat Header */}
        <div className="p-8 lg:p-10 border-b border-white/40 bg-white/30 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-dark-gradient rounded-[2rem] flex items-center justify-center text-white shadow-2xl hover:scale-110 transition-transform duration-500 group relative">
              <Bot size={40} className="relative z-10 group-hover:rotate-12 transition-transform" />
              <div className="absolute inset-0 bg-amber-400 rounded-[2rem] opacity-0 group-hover:opacity-20 blur-xl transition-opacity" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h3 className="text-3xl font-black text-slate-900 tracking-tighter italic">
                  Unicorn <span className="text-amber-500">Master Coach</span>
                </h3>
                <div className="bg-emerald-500 text-white text-xs-plus px-3 py-1 rounded-full font-black uppercase tracking-[0.2em] shadow-lg shadow-emerald-500/20 animate-pulse">
                  Online
                </div>
              </div>
              <p className="text-slate-500 font-bold flex items-center gap-2 mt-2">
                <Sparkles size={16} className="text-amber-400" />
                เทคโนโลยี AI ล่าสุดเพื่อผู้นำยุคใหม่
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Focus Selector */}
            <div className="flex bg-slate-200/50 p-1.5 rounded-[1.5rem] backdrop-blur-md border border-white/50">
              {focus_options.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFocusArea(f.id as FocusArea)}
                  aria-label={`เน้นหัวข้อ ${f.label}`}
                  className={`
                     flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs-plus font-black uppercase tracking-widest transition-all
                     ${focusArea === f.id
                      ? 'bg-slate-950 text-white shadow-xl scale-105'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-white/50'}
                   `}
                >
                  <f.icon size={14} />
                  <span className="hidden sm:inline">{f.label}</span>
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowKeyModal(true)}
              aria-label="ตั้งค่า API Key"
              className={`p-4 rounded-2xl transition-all active:scale-90 ${apiKey ? 'bg-slate-100 text-slate-400 hover:text-amber-500 hover:bg-amber-50' : 'bg-amber-500 text-white animate-pulse shadow-lg'}`}
              title="API Key Settings"
            >
              <Key size={20} />
            </button>

            <button
              onClick={() => setMessages([messages[0]])}
              aria-label="ล้างประวัติการสนทนา"
              className="p-4 bg-slate-100 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all active:scale-90"
              title="ล้างแชท"
            >
              <RefreshCcw size={20} />
            </button>
          </div>
        </div>

        {/* Chat Messages */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-10 space-y-10 bg-slate-50/10 custom-scrollbar"
        >
          {messages.map((m, idx) => (
            <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-4 duration-500`}>
              <div className={`flex gap-5 max-w-[80%] ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-12 h-12 rounded-2xl flex-shrink-0 flex items-center justify-center shadow-lg transform transition-transform hover:scale-110 ${m.role === 'user' ? 'bg-amber-500 text-white rotate-6' : 'bg-slate-900 text-white -rotate-6'}`}>
                  {m.role === 'user' ? <User size={24} /> : <ShieldCheck size={24} />}
                </div>
                <div className={`
                  rounded-[2.5rem] p-8 shadow-xl text-lg leading-relaxed font-medium relative group
                  ${m.role === 'user'
                    ? 'bg-slate-950 text-white rounded-tr-none'
                    : 'bg-white/80 backdrop-blur-md border border-white text-slate-800 rounded-tl-none'}
                `}>
                  {m.text}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start items-center gap-5">
              <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center shadow-lg animate-pulse">
                <Bot size={24} className="text-white" />
              </div>
              <div className="bg-white/80 backdrop-blur-md border border-white p-8 rounded-[2.5rem] rounded-tl-none shadow-xl">
                <div className="flex gap-3">
                  <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce"></div>
                  <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Dynamic Training Suggestions */}
        <div className="bg-white/40 backdrop-blur-md border-t border-white/50 py-6 overflow-x-auto whitespace-nowrap scrollbar-hide px-8">
          <div className="flex gap-4">
            <p className="flex items-center gap-2 text-xs-plus font-black text-slate-400 uppercase tracking-[0.2em] pr-4 border-r border-slate-200 shrink-0">
              <Star size={14} className="text-amber-500" /> ฝึกซ้อมด่วน
            </p>
            {currentScenarios.map(s => (
              <button
                key={s}
                onClick={() => handleSend(s)}
                aria-label={`เลือกซ้อมหัวข้อ: ${s}`}
                className="px-8 py-4 bg-white/60 border border-white rounded-[1.5rem] text-sm font-black text-slate-700 hover:border-amber-500 hover:text-amber-600 hover:bg-white transition-all flex items-center gap-3 shrink-0 shadow-sm hover:shadow-xl hover:-translate-y-1 duration-300"
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Modern, Accessible Input Area */}
        <div className="p-10 bg-white/60 backdrop-blur-xl border-t border-white group">
          <div className="flex items-center gap-6 bg-white rounded-[2.5rem] p-4 lg:p-5 shadow-2xl border border-white focus-within:ring-8 ring-amber-500/10 transition-all duration-500">
            <button
              aria-label="ใช้คำสั่งด้วยเสียง"
              className="w-16 h-16 rounded-[1.5rem] bg-slate-50 text-slate-400 hover:text-amber-600 hover:bg-amber-50 flex items-center justify-center transition-all duration-300 active:scale-90"
            >
              <Mic size={32} />
            </button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="ลองขอให้โค้ชซ้อมพูด STP หรือแก้ข้อโต้แย้งดูครับ..."
              aria-label="พิมพ์คำถามหรือหัวข้อที่ต้องการซ้อม"
              className="flex-1 bg-transparent border-none focus:ring-0 text-2xl py-2 px-2 text-slate-900 placeholder:text-slate-300 font-bold"
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
              aria-label="ส่งข้อความ"
              className={`
                 w-16 h-16 rounded-[1.5rem] transition-all duration-500 flex items-center justify-center shadow-2xl relative overflow-hidden group/btn
                 ${!input.trim() || isLoading
                  ? 'bg-slate-100 text-slate-300'
                  : 'bg-dark-gradient text-white hover:scale-105 active:scale-90'}
               `}
            >
              <Send size={28} className={`relative z-10 transition-transform duration-500 ${input.trim() ? 'group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1' : ''}`} />
              <div className="absolute inset-0 bg-gradient-to-tr from-amber-400 to-amber-600 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
            </button>
          </div>
          <p className="text-center text-xs-plus text-slate-300 mt-6 font-black uppercase tracking-[0.3em] opacity-60">
            Coach by GenAI - ฝึกฝนให้ชำนาญก่อนลงสนามจริง
          </p>
        </div>
      </div>

      {/* API Key Modal Overlay */}
      {showKeyModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] p-10 max-w-md w-full shadow-3xl border border-white relative animate-in zoom-in-95 duration-300">
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 bg-amber-500 rounded-[1.5rem] flex items-center justify-center text-white shadow-2xl rotate-6">
              <Key size={40} />
            </div>

            <div className="mt-6 text-center space-y-4">
              <h3 className="text-3xl font-black text-slate-900 tracking-tighter italic">Gemini <span className="text-amber-500">API Key</span></h3>
              <p className="text-slate-500 font-bold leading-relaxed px-2">
                เพื่อเริ่มการโค้ชด้วย AI โปรดระบุ Gemini API Key ของคุณ ระบบจะจดจำไว้ใน Browser นี้เท่านั้น
              </p>

              <div className="relative group">
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => {
                    const val = e.target.value;
                    setApiKey(val);
                    localStorage.setItem('gemini_api_key', val);
                  }}
                  placeholder="ป้อน API Key ที่นี่..."
                  className="w-full bg-slate-50 border-2 border-slate-100 focus:border-amber-500 focus:ring-8 focus:ring-amber-500/10 rounded-2xl py-4 px-6 text-lg font-bold transition-all text-center"
                />
                {apiKey ? (
                  <div className="mt-4 flex items-center justify-center gap-2 text-emerald-500 text-xs-plus font-black uppercase tracking-widest">
                    <AlertCircle size={14} /> บันทึกสำเร็จ
                  </div>
                ) : (
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-2 text-amber-500 hover:text-amber-600 text-xs-plus font-black uppercase tracking-widest transition-colors"
                  >
                    รับ Key ฟรีที่นี่ <Sparkles size={14} />
                  </a>
                )}
              </div>

              <button
                onClick={() => setShowKeyModal(false)}
                disabled={!apiKey}
                className={`
                  w-full py-4 rounded-2xl text-lg font-black tracking-widest uppercase transition-all shadow-xl active:scale-95
                  ${apiKey
                    ? 'bg-slate-950 text-white hover:bg-slate-800'
                    : 'bg-slate-100 text-slate-300 cursor-not-allowed'}
                `}
              >
                {apiKey ? 'เข้าสู่ระบบการโค้ช' : 'โปรดระบุ Key ก่อน'}
              </button>

              <p className="text-[10px] text-slate-300 font-black uppercase tracking-[0.2em] pt-2">
                Your keys are stored locally on your device
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AICoach;
