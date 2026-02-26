import React, { useState } from 'react';
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
    Bot
} from 'lucide-react';
import { AppView, User } from '../types';
import { WEALTH_ELEMENTS } from '../data/wealthDnaData';

const WealthDNA: React.FC<{
    onNavigate: (view: AppView) => void,
    onUpdateUser: (user: User) => void,
    currentUser: User | null
}> = ({ onNavigate, onUpdateUser, currentUser }) => {
    const [step, setStep] = useState<'intro' | 'form' | 'loading' | 'result'>('intro');
    const [birthDate, setBirthDate] = useState('');
    const [birthTime, setBirthTime] = useState('');
    const [analyzedElement, setAnalyzedElement] = useState<keyof typeof WEALTH_ELEMENTS | null>(null);

    const handleStart = () => setStep('form');

    const runAnalysis = () => {
        if (!birthDate) return;
        setStep('loading');

        // Simulating AI analysis time
        setTimeout(() => {
            const date = new Date(birthDate);
            const dayOfWeek = date.getDay(); // 0 is Sunday

            // Deterministic mapping based on day of week
            const elementKeys: (keyof typeof WEALTH_ELEMENTS)[] = ['FIRE', 'WATER', 'EARTH', 'AIR', 'FIRE', 'WATER', 'EARTH'];
            const element = elementKeys[dayOfWeek % elementKeys.length];

            setAnalyzedElement(element);
            setStep('result');

            // Save result to user session & sync to DB via App.tsx
            if (currentUser?.id) {
                const updatedUser: User = {
                    ...currentUser,
                    wealthElement: element
                };
                onUpdateUser(updatedUser);
            }
        }, 2500);
    };

    const elementData = analyzedElement ? WEALTH_ELEMENTS[analyzedElement] : null;

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
            {/* --- Intro Step --- */}
            {step === 'intro' && (
                <div className="max-w-2xl w-full text-center space-y-12 animate-in fade-in zoom-in duration-700">
                    <div className="relative inline-block">
                        <div className="text-8xl md:text-9xl animate-float">🦄</div>
                        <div className="absolute -top-4 -right-4 animate-pulse">
                            <Sparkles className="text-amber-400 w-12 h-12" />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-500 text-sm font-black tracking-widest uppercase">
                            ✨ ค้นพบรหัสลับความมั่งคั่งของคุณ
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900 leading-tight">
                            Unicorn <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-indigo-500 to-purple-600">Wealth DNA</span>
                        </h1>
                        <p className="text-xl md:text-2xl font-bold text-slate-500 max-w-lg mx-auto leading-relaxed">
                            ถอดรหัสพื้นดวง เปิดประตูสู่ความมั่งคั่ง วิเคราะห์ธาตุเจ้าเรือนเพื่อค้นพบ "สไตล์การรวย" ที่ใช่คุณ
                        </p>
                    </div>

                    <div className="flex flex-col items-center gap-4">
                        <button
                            onClick={handleStart}
                            className="w-full md:w-auto px-12 py-6 bg-gradient-to-r from-amber-400 to-amber-600 text-slate-950 font-black text-xl rounded-3xl shadow-2xl shadow-amber-500/30 flex items-center justify-center gap-3 group hover:scale-105 transition-all active:scale-95"
                        >
                            <Sparkles size={24} /> เริ่มต้นวิเคราะห์ DNA <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                        </button>
                        <p className="text-sm font-bold text-slate-400">ฟรี! ไม่มีค่าใช้จ่าย • ใช้เวลาไม่ถึง 1 นาที</p>
                    </div>
                </div>
            )}

            {/* --- Form Step --- */}
            {step === 'form' && (
                <div className="max-w-xl w-full space-y-8 animate-in slide-in-from-bottom-12 duration-500">
                    <button onClick={() => setStep('intro')} className="flex items-center gap-2 text-slate-500 font-bold hover:text-slate-900 transition-colors">
                        <ChevronLeft size={20} /> ย้อนกลับ
                    </button>

                    <div className="glass-card rounded-[3rem] p-10 md:p-14 border border-white/60 shadow-3xl bg-white/40 backdrop-blur-xl">
                        <div className="space-y-8">
                            <div className="text-center space-y-2">
                                <h2 className="text-3xl font-black text-slate-900 tracking-tight">ข้อมูลพื้นดวง</h2>
                                <p className="text-slate-500 font-bold">กรุณากรอกข้อมูลเพื่อใช้ในการคำนวณธาตุเจ้าเรือน</p>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-black text-slate-400 uppercase tracking-widest px-1">วัน/เดือน/ปี เกิด</label>
                                    <div className="relative group">
                                        <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-amber-500 transition-colors" size={20} />
                                        <input
                                            type="date"
                                            className="w-full pl-14 pr-6 py-5 bg-white border border-slate-200 rounded-3xl focus:ring-4 focus:ring-amber-500/20 transition-all outline-none font-bold text-lg text-slate-900"
                                            value={birthDate}
                                            onChange={(e) => setBirthDate(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-black text-slate-400 uppercase tracking-widest px-1">เวลาเกิด (ถ้าทราบ)</label>
                                    <div className="relative group">
                                        <Clock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
                                        <input
                                            type="time"
                                            className="w-full pl-14 pr-6 py-5 bg-white border border-slate-200 rounded-3xl focus:ring-4 focus:ring-indigo-500/20 transition-all outline-none font-bold text-lg text-slate-900"
                                            value={birthTime}
                                            onChange={(e) => setBirthTime(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={runAnalysis}
                                disabled={!birthDate}
                                className={`
                                    w-full py-6 rounded-3xl font-black text-xl shadow-xl transition-all 
                                    ${birthDate ? 'bg-slate-900 text-white hover:bg-slate-800' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}
                                `}
                            >
                                วิเคราะห์รหัสความมั่งคั่ง
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- Loading Step --- */}
            {step === 'loading' && (
                <div className="text-center space-y-8 animate-in fade-in duration-300">
                    <div className="relative inline-block">
                        <div className="w-32 h-32 border-8 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
                        <Bot className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-900" size={40} />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-2xl font-black text-slate-900 animate-pulse">กำลังวิเคราะห์ดวงดาวและความมั่งคั่ง...</h2>
                        <p className="text-slate-500 font-bold italic">Nong Uni AI Coach is calculating your Wealth DNA</p>
                    </div>
                </div>
            )}

            {/* --- Result Step --- */}
            {step === 'result' && elementData && (
                <div className="max-w-5xl w-full space-y-8 animate-in fade-in slide-in-from-top-8 duration-700 pb-20">
                    {/* Hero Result */}
                    <div className={`rounded-[3.5rem] p-10 md:p-16 text-white bg-gradient-to-br shadow-3xl relative overflow-hidden ${elementData.color}`}>
                        <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                            <div className="w-40 h-40 md:w-56 md:h-56 bg-white/20 backdrop-blur-3xl rounded-[3rem] border border-white/30 flex items-center justify-center shadow-inner group">
                                {analyzedElement === 'FIRE' && <Zap size={80} className="text-white group-hover:scale-110 transition-transform" />}
                                {analyzedElement === 'WATER' && <Waves size={80} className="text-white group-hover:scale-110 transition-transform" />}
                                {analyzedElement === 'EARTH' && <Shield size={80} className="text-white group-hover:scale-110 transition-transform" />}
                                {analyzedElement === 'AIR' && <Airplay size={80} className="text-white group-hover:scale-110 transition-transform" />}
                            </div>

                            <div className="flex-1 text-center md:text-left space-y-4">
                                <div className="inline-block px-5 py-2 bg-white/20 border border-white/30 rounded-full font-black text-sm tracking-widest uppercase mb-2">
                                    Archetype: {elementData.archetype}
                                </div>
                                <h1 className="text-5xl md:text-7xl font-black tracking-tighter">{elementData.name}</h1>
                                <p className="text-2xl md:text-3xl font-black text-white/90 italic">"{elementData.concept}"</p>
                                <p className="text-xl font-bold text-white/80 max-w-2xl leading-relaxed">{elementData.description}</p>
                            </div>
                        </div>

                        {/* Background Decoration */}
                        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
                        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-64 h-64 bg-slate-900/10 rounded-full blur-3xl" />
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {/* Strengths */}
                        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-xl space-y-6">
                            <div className="flex items-center gap-3 text-emerald-600 font-black tracking-tight uppercase">
                                <CheckCircle2 size={24} /> จุดแข็งของคุณ
                            </div>
                            <ul className="space-y-3">
                                {elementData.strengths.map((s, idx) => (
                                    <li key={idx} className="flex gap-2 font-bold text-slate-700">
                                        <div className="mt-1.5 w-1.5 h-1.5 bg-emerald-500 rounded-full shrink-0" /> {s}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Strategy */}
                        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-xl space-y-6">
                            <div className="flex items-center gap-3 text-indigo-600 font-black tracking-tight uppercase">
                                <Lightbulb size={24} /> กลยุทธ์ธุรกิจที่แนะนำ
                            </div>
                            <p className="text-slate-700 font-bold leading-relaxed bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100 italic">
                                "{elementData.business_strategy}"
                            </p>
                            <div className="space-y-3">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ไอเดียทำคอนเทนต์</p>
                                {elementData.content_ideas.map((c, idx) => (
                                    <div key={idx} className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-sm font-bold text-slate-600">
                                        {c}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Products */}
                        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-xl space-y-6">
                            <div className="flex items-center gap-3 text-amber-600 font-black tracking-tight uppercase">
                                <ShoppingBag size={24} /> สินค้าแนะนำรวยตามธาตุ
                            </div>
                            <div className="space-y-3">
                                {elementData.recommended_products.map((p, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-4 bg-amber-50 rounded-2xl border border-amber-100 group hover:shadow-md transition-all cursor-pointer">
                                        <span className="font-black text-slate-700">{p}</span>
                                        <ChevronRight size={18} className="text-amber-500 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                ))}
                            </div>
                            <button
                                onClick={() => onNavigate(AppView.PRODUCT_CATALOG)}
                                className="w-full py-4 text-amber-600 font-black text-sm uppercase tracking-tighter hover:underline"
                            >
                                ดูรายละเอียดสินค้าทั้งหมด
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4">
                        <button
                            onClick={() => onNavigate(AppView.PROFILE)}
                            className="flex-1 bg-slate-900 text-white py-6 rounded-[2rem] font-black text-xl shadow-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 group"
                        >
                            <CheckCircle2 size={24} /> บันทึกผลไปที่โปรไฟล์ <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button
                            className="px-10 py-6 bg-white text-slate-900 border border-slate-200 rounded-[2rem] font-black text-xl hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                        >
                            <Share2 size={24} /> แชร์ผลลัพธ์
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WealthDNA;
