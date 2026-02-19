
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Send, Bot, User, Sparkles, RefreshCcw, Mic, ShieldCheck, Star, Rocket, Layers, GraduationCap } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { ChatMessage } from '../types';

type FocusArea = 'STARTUP' | 'SYSTEM456' | 'LEADERSHIP';

const AICoach: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'สวัสดีครับผู้นำ Unicorn! ผมคือโค้ชอัจฉริยะ พร้อมช่วยคุณฝึก "พูดให้โดนใจ" และ "สอนให้เป็นระบบ" วันนี้อยากลองซ้อมพูดในระดับไหนดีครับ?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [focusArea, setFocusArea] = useState<FocusArea>('SYSTEM456');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

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

  const currentScenarios = useMemo(() => scenariosByArea[focusArea], [focusArea]);

  const handleSend = async (textToOverride?: string) => {
    const textToSend = textToOverride || input;
    if (!textToSend.trim() || isLoading) return;

    const userText = textToSend;
    setInput('');
    const newMessages: ChatMessage[] = [...messages, { role: 'user', text: userText }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

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
          systemInstruction: `You are 'Unicorn Master Coach'. Your mission is to train independent business partners in the Unicorn Academy.
          Current Focus: ${focusText}.
          
          Guidelines:
          - 'Connect Heart' communication style: empathetic, respectful, professional.
          - Help them move from 'Know' to 'Teach' level.
          - If they want to practice speaking (Can Speak), act as a prospect and give them feedback after their pitch.
          - Use Thai business terms like STP, 4-5-6, Connect-Jai.
          - Use 'ครับ' or 'ค่ะ' appropriately.
          - Since the user focus is ${focusArea}, adjust your complexity and terminology accordingly.
          - Encourage field work and heart-to-heart connections.`
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
                <div className="bg-emerald-500 text-white text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-[0.2em] shadow-lg shadow-emerald-500/20 animate-pulse">
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
              {[
                { id: 'STARTUP', icon: Rocket, label: 'Start-Up' },
                { id: 'SYSTEM456', icon: Layers, label: 'Systems' },
                { id: 'LEADERSHIP', icon: GraduationCap, label: 'Leadership' }
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFocusArea(f.id as FocusArea)}
                  className={`
                    flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all
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
              onClick={() => setMessages([messages[0]])}
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
                  {m.role === 'model' && (
                    <div className="absolute -top-3 -right-3 w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center shadow-lg scale-0 group-hover:scale-100 transition-transform">
                      <Sparkles size={16} className="text-white" />
                    </div>
                  )}
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
            <p className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] pr-4 border-r border-slate-200 shrink-0">
              <Star size={14} className="text-amber-500" /> ฝึกซ้อมด่วน
            </p>
            {currentScenarios.map(s => (
              <button
                key={s}
                onClick={() => handleSend(s)}
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
            <button className="w-16 h-16 rounded-[1.5rem] bg-slate-50 text-slate-400 hover:text-amber-600 hover:bg-amber-50 flex items-center justify-center transition-all duration-300 active:scale-90">
              <Mic size={32} />
            </button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="ลองขอให้โค้ชซ้อมพูด STP หรือแก้ข้อโต้แย้งดูครับ..."
              className="flex-1 bg-transparent border-none focus:ring-0 text-2xl py-2 px-2 text-slate-900 placeholder:text-slate-300 font-bold"
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
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
          <p className="text-center text-[10px] text-slate-300 mt-6 font-black uppercase tracking-[0.3em] opacity-60">
            Coach by GenAI - ฝึกฝนให้ชำนาญก่อนลงสนามจริง
          </p>
        </div>
      </div>
    </div>
  );
};

export default AICoach;
