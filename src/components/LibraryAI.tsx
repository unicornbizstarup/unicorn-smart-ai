'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Bot, X, Send, Sparkles, MessageCircle, HelpCircle } from 'lucide-react';

interface Message {
  role: 'user' | 'model';
  content: string;
}

export default function LibraryAI() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      content: 'สวัสดีค่ะคุณพี่! ยินดีต้อนรับสู่คลังความรู้นะคะ น้องยูนิสแกนเอกสาร PDF ทั้งหมดแล้ว อยากสอบถามข้อมูลสินค้าตัวไหน หรือแผนรายได้ (UBC) ข้อไหน ถามน้องยูนิได้เลยค่ะ! 🦄✨'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Alert/Bounce notification when closed but new message sent
  useEffect(() => {
    if (!isOpen && messages.length > 1) {
      setHasNewMessage(true);
    }
  }, [messages.length, isOpen]);

  const handleOpenToggle = () => {
    setIsOpen(!isOpen);
    setHasNewMessage(false);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessageContent = input.trim();
    setInput('');
    setLoading(true);

    // 1. Add user message
    const updatedMessages = [...messages, { role: 'user', content: userMessageContent } as Message];
    setMessages(updatedMessages);

    try {
      // 2. Call RAG AI Chat Endpoint
      const res = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: updatedMessages,
          category: 'all' // Can filter by active page context if needed
        }),
      });

      const data = await res.json();

      if (data.success && data.response) {
        setMessages(prev => [...prev, { role: 'model', content: data.response }]);
      } else {
        throw new Error(data.error || 'เกิดข้อผิดพลาดในการเชื่อมต่อ');
      }
    } catch (err: any) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        {
          role: 'model',
          content: 'ขออภัยด้วยนะคะคุณพี่ พอดีสัญญาณเชื่อมต่อขัดข้องชั่วคราว ลองส่งคำถามอีกครั้งนะคะ หรือแจ้งน้องยูนิได้เลยค่ะ 🥺'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-[350px] sm:w-[400px] h-[500px] sm:h-[550px] bg-white border border-[#e8e2d9] rounded-[2rem] shadow-[0_20px_50px_rgba(26,18,9,0.15)] flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-[#c0281e] via-[#e8621a] to-[#f5a623] p-4 text-white flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2.5">
              <div className="bg-white/20 p-2 rounded-full backdrop-blur-md">
                <Bot size={20} className="text-white animate-pulse" />
              </div>
              <div>
                <h4 className="font-black text-sm tracking-wide flex items-center gap-1.5">
                  น้องยูนิ AI คอยช่วยเหลือ
                  <Sparkles size={14} className="text-amber-300 animate-spin duration-300" />
                </h4>
                <p className="text-[10px] opacity-90 font-bold">คลังความรู้ระบบอัจฉริยะ (RAG)</p>
              </div>
            </div>
            <button 
              onClick={handleOpenToggle}
              className="hover:bg-white/20 p-1.5 rounded-full transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4.5 bg-[#f7f4ef]/40">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} items-end gap-2`}
              >
                {msg.role === 'model' && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#e8621a] to-[#f5a623] flex items-center justify-center text-white text-[10px] font-black shrink-0 shadow-sm border border-white">
                    🦄
                  </div>
                )}
                
                <div
                  className={`max-w-[75%] rounded-[1.25rem] px-4 py-3 text-xs-plus leading-relaxed shadow-sm font-semibold whitespace-pre-line ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-[#e8621a] to-[#f5a623] text-white rounded-br-none'
                      : 'bg-white text-[#1a1209] border border-[#e8e2d9] rounded-bl-none'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {/* Typing Loader */}
            {loading && (
              <div className="flex justify-start items-end gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#e8621a] to-[#f5a623] flex items-center justify-center text-white text-[10px] font-black shrink-0 border border-white">
                  🦄
                </div>
                <div className="bg-white border border-[#e8e2d9] rounded-[1.25rem] rounded-bl-none px-4 py-3.5 flex items-center gap-1.5 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-[#e8621a] animate-bounce duration-600" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full bg-[#f5a623] animate-bounce duration-600" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 rounded-full bg-[#b8924a] animate-bounce duration-600" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Quick suggestions */}
          <div className="px-4 py-2 border-t border-[#e8e2d9]/40 bg-[#fbfaf8] flex gap-2 overflow-x-auto text-[10px] font-bold text-[#6b5e4a] select-none scrollbar-none">
            <button 
              onClick={() => setInput('ยาสีฟัน U Dental ดีอย่างไร?')}
              className="px-2.5 py-1.5 bg-[#f4f2ee] hover:bg-[#e8e2d9] border border-[#e8e2d9] rounded-full shrink-0 transition-colors"
            >
              🦷 สรรพคุณยาสีฟัน
            </button>
            <button 
              onClick={() => setInput('U CAYLA 4 ขั้นตอนมีอะไรบ้าง?')}
              className="px-2.5 py-1.5 bg-[#f4f2ee] hover:bg-[#e8e2d9] border border-[#e8e2d9] rounded-full shrink-0 transition-colors"
            >
              🧴 U CAYLA
            </button>
            <button 
              onClick={() => setInput('แผนรายได้สะสม PV แลกโบนัสอย่างไร?')}
              className="px-2.5 py-1.5 bg-[#f4f2ee] hover:bg-[#e8e2d9] border border-[#e8e2d9] rounded-full shrink-0 transition-colors"
            >
              📈 แผนโบนัส PV
            </button>
          </div>

          {/* Message Input Form */}
          <form onSubmit={handleSend} className="p-3 border-t border-[#e8e2d9] bg-white flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="ถามข้อมูลผลิตภัณฑ์หรือคลังความรู้..."
              className="flex-1 px-4 py-2.5 bg-[#f4f2ee] border border-[#d6cfc4] focus:border-[#b8924a] rounded-xl outline-none text-xs font-semibold text-[#1a1209]"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="bg-[#b8924a] hover:bg-[#a37e39] disabled:bg-[#d6cfc4] text-white p-2.5 rounded-xl transition-colors shrink-0 shadow-sm flex items-center justify-center"
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={handleOpenToggle}
        className={`w-14 h-14 rounded-full bg-gradient-to-r from-[#c0281e] via-[#e8621a] to-[#f5a623] hover:scale-108 active:scale-95 text-white flex items-center justify-center shadow-[0_8px_30px_rgba(232,98,26,0.4)] transition-all duration-300 relative group cursor-pointer ${
          isOpen ? 'rotate-90' : 'animate-bounce duration-1000'
        }`}
      >
        {isOpen ? (
          <X size={26} />
        ) : (
          <>
            <MessageCircle size={26} />
            {hasNewMessage && (
              <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white animate-ping" />
            )}
          </>
        )}
      </button>
    </div>
  );
}
