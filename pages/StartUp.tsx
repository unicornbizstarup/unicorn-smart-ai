
import React from 'react';
import { START_UP_5 } from '../data/academyData';
import { CheckCircle2, Circle, ArrowRight, Lightbulb, Play } from 'lucide-react';

const StartUp: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-fade-in pb-20 px-2 lg:px-0">
      {/* Header Banner */}
      <section className="bg-dark-gradient rounded-[3rem] p-12 lg:p-16 text-white relative overflow-hidden border border-white/10 shadow-3xl group hover-shine">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 group-hover:bg-amber-500/20 transition-all duration-1000" />

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="text-center md:text-left space-y-6">
            <div className="inline-flex items-center gap-2 px-5 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/10 mb-2">
              <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
              <span className="text-xs-plus font-black uppercase tracking-[0.2em] text-amber-200">Biz Start Up Platform</span>
            </div>
            <h2 className="text-5xl lg:text-7xl font-black mb-4 tracking-tighter italic">5 <span className="text-amber-400">START-UP</span></h2>
            <p className="text-indigo-100/70 text-xl font-medium max-w-lg leading-relaxed">
              จุดเริ่มต้นที่เป็นระบบ สำหรับนักธุรกิจใหม่อย่างมืออาชีพ
              ก้าวแรกสู่ความสำเร็จด้วยมาตรฐานระดับสากล
            </p>
          </div>

          <div className="w-48 h-48 bg-white/5 backdrop-blur-3xl rounded-[3rem] flex items-center justify-center border border-white/10 shadow-2xl transform hover:rotate-12 transition-all duration-500 group-hover:scale-110">
            <Lightbulb size={96} className="text-amber-400 filter drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]" />
          </div>
        </div>
      </section>

      {/* Steps List */}
      <div className="space-y-8 relative before:absolute before:left-8 before:top-10 before:bottom-10 before:w-0.5 before:bg-slate-200/50 before:hidden md:before:block">
        {START_UP_5.map((step, idx) => (
          <div key={step.id} className="group relative flex flex-col md:flex-row gap-8 items-start">
            {/* Index Circle */}
            <div className="hidden md:flex flex-col items-center shrink-0 relative z-10">
              <div className="w-16 h-16 rounded-[2rem] bg-slate-950 text-white flex items-center justify-center font-black text-2xl shadow-2xl group-hover:bg-amber-500 group-hover:scale-110 transition-all duration-500 border-4 border-white">
                {idx + 1}
              </div>
            </div>

            <div className="flex-1 glass-card rounded-[3rem] p-8 lg:p-10 border border-white/40 shadow-sm hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-2 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
                <div className="flex items-center gap-4 md:hidden">
                  <div className="w-10 h-10 rounded-xl bg-slate-950 text-white flex items-center justify-center font-black">
                    {idx + 1}
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">{step.title}</h3>
                </div>
                <h3 className="hidden md:block text-3xl font-black text-slate-900 tracking-tight group-hover:text-amber-600 transition-colors">{step.title}</h3>

                {idx < 2 ? (
                  <div className="flex items-center gap-2 px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100 shadow-sm">
                    <CheckCircle2 size={16} />
                    <span className="text-xs-plus font-black uppercase tracking-widest">Completed</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 px-4 py-1.5 bg-slate-50 text-slate-400 rounded-full border border-slate-100 opacity-50">
                    <Circle size={16} />
                    <span className="text-xs-plus font-black uppercase tracking-widest">To Do</span>
                  </div>
                )}
              </div>

              <p className="text-slate-500 text-lg font-medium leading-relaxed mb-8 opacity-80">
                {step.desc}
              </p>

              <div className="flex flex-wrap gap-4 pt-8 border-t border-slate-50/50">
                <button
                  aria-label="รับชมวิดีโอแนะนำขั้นตอนการเริ่มธุรกิจ"
                  className="flex items-center gap-3 bg-slate-950 text-white px-8 py-4 rounded-[1.5rem] text-sm font-black hover:bg-slate-800 transition-all active:scale-95 shadow-xl shadow-slate-900/10 hover-shine overflow-hidden relative"
                >
                  <Play size={18} fill="currentColor" className="text-amber-400" />
                  <span className="relative z-10 font-black">รับชมวิดีโอแนะนำ</span>
                </button>
                <button
                  aria-label={`อ่านรายละเอียดฉบับเต็มของ ${step.title}`}
                  className="flex items-center gap-3 px-8 py-4 rounded-[1.5rem] text-sm font-black text-slate-600 hover:bg-slate-50 transition-all hover:text-slate-900"
                >
                  อ่านรายละเอียดฉบับเต็ม <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Rewards Info */}
      <div className="bg-indigo-900/5 backdrop-blur-xl border border-indigo-100/50 rounded-[4rem] p-10 lg:p-14 flex flex-col md:flex-row items-center gap-10 group hover:shadow-2xl hover:shadow-indigo-500/5 transition-all duration-700">
        <div className="w-24 h-24 bg-indigo-600 text-white rounded-[2rem] flex items-center justify-center shrink-0 shadow-2xl group-hover:rotate-12 transition-all duration-500">
          <Trophy size={48} className="filter drop-shadow-xl" />
        </div>
        <div className="space-y-3 text-center md:text-left">
          <h4 className="text-2xl font-black text-indigo-950">รางวัลความพยายามยอดเยี่ยม</h4>
          <p className="text-slate-600 text-lg font-medium opacity-80 leading-relaxed">
            ทำครบ 5 ขั้นตอน รับเข็มเชิดชูเกียรติ <span className="text-indigo-600 font-black">Virtual Super Star</span> ประดับโปรไฟล์ของคุณ
            เพื่อแสดงความมุ่งมั่นและความเป็นมืออาชีพในระดับสูงสุด!
          </p>
        </div>
        <div className="md:ml-auto">
          <div className="w-24 h-24 border-4 border-dashed border-indigo-200 rounded-full flex items-center justify-center p-4 opacity-50">
            <CheckCircle2 size={40} className="text-indigo-200" />
          </div>
        </div>
      </div>
    </div>
  );
};

const Trophy = ({ size, className }: { size: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" /><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" /><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" /></svg>
);

export default StartUp;
