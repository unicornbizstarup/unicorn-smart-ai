
import React, { useState } from 'react';
import {
   CORE_SKILLS,
   SYSTEM_4_KNOW,
   SYSTEM_5_DO,
   SYSTEM_6_BE
} from '../data/academyData';
import {
   Trophy,
   ChevronRight,
   Shield,
   Star,
   Gem,
   Award,
   Crown,
   User,
   Check,
   Users,
   Award as AwardIcon,
   Sparkles,
   ArrowRight,
   Target,
   FileText,
   Briefcase,
   Search,
   MessageCircle,
   Zap
} from 'lucide-react';

const iconMap: Record<string, any> = {
   User, Star, Shield, Gem, Award, Crown
};

const masterySteps = [
   { label: 'รู้', desc: 'มีข้อมูลพื้นฐาน' },
   { label: 'เข้าใจ', desc: 'อธิบายเหตุผลได้' },
   { label: 'พูดได้', desc: 'นำเสนอได้คล่องแคล่ว' },
   { label: 'สอนเป็น', desc: 'ถ่ายทอดให้ทีมงานได้' },
];

const tabs_options = ['4-KNOW', '5-DO', '6-BE'] as const;

const System456: React.FC = () => {
   const [activeTab, setActiveTab] = useState<'4-KNOW' | '5-DO' | '6-BE'>('4-KNOW');
   const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

   return (
      <div className="space-y-8 pb-20 animate-fade-in px-2 lg:px-0">
         {/* 456 Main Banner (Slide Style) */}
         <div className="bg-dark-gradient rounded-[2.5rem] md:rounded-[3rem] p-6 md:p-10 lg:p-14 text-white relative overflow-hidden border border-white/10 shadow-2xl mb-8 md:mb-12 hover-shine group">
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-10">
               <div className="space-y-3 md:space-y-4 text-center md:text-left">
                  <h2 className="text-5xl md:text-6xl lg:text-8xl font-black italic tracking-tighter text-white opacity-10 absolute -top-6 md:-top-10 -left-4 md:-left-6 select-none group-hover:scale-110 transition-transform duration-1000">456</h2>
                  <div className="relative">
                     <h1 className="text-3xl md:text-4xl lg:text-6xl font-black tracking-tight flex items-center gap-3 md:gap-4 justify-center md:justify-start">
                        456 <span className="text-amber-400 text-glitch">SYSTEM</span>
                     </h1>
                     <div className="h-1 w-16 md:w-20 bg-amber-500 rounded-full mt-2 hidden md:block" />
                  </div>
                  <p className="text-indigo-100/80 text-base md:text-xl font-medium max-w-lg leading-relaxed">
                     ระบบการทำงานที่เป็นหัวใจสู่ความสำเร็จของนักธุรกิจ Unicorn
                  </p>
               </div>

               <div className="flex bg-white/5 backdrop-blur-xl p-1.5 md:p-2 rounded-[2rem] md:rounded-[2.5rem] border border-white/10 w-full md:w-auto shadow-2xl">
                  {tabs_options.map((tab) => (
                     <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        aria-label={`สถาบัน ระบบ ${tab.split('-')[0]}`}
                        className={`
                flex-1 md:flex-none md:w-32 lg:w-36 py-3 md:py-5 rounded-[1.5rem] md:rounded-[2rem] text-sm md:text-lg font-black transition-all duration-500 flex flex-col items-center justify-center gap-0.5 md:gap-1
                ${activeTab === tab
                              ? 'bg-amber-500 text-slate-950 shadow-2xl scale-105 shadow-amber-500/30'
                              : 'text-white/40 hover:text-white hover:bg-white/5'}
              `}
                     >
                        <span className="text-xl md:text-3xl font-black tracking-tighter">{tab.split('-')[0]}</span>
                        <span className="text-[9px] md:text-xs-plus uppercase tracking-[0.1em] md:tracking-[0.2em] font-black opacity-80">
                           {tab === '4-KNOW' ? 'รู้' : tab === '5-DO' ? 'ทำ' : 'เป็น'}
                        </span>
                     </button>
                  ))}
               </div>
            </div>
            <div className="absolute -bottom-20 -right-20 opacity-5 group-hover:opacity-10 transition-opacity duration-1000">
               <Zap size={400} className="animate-float-slow text-amber-400" />
            </div>
         </div>

         {/* Content Sections */}
         {activeTab === '4-KNOW' && (
            <section className="space-y-12 animate-fade-in">
               <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
                  <div className="space-y-6 md:space-y-8">
                     <div className="flex items-center gap-4 md:gap-6">
                        <div className="w-16 h-16 md:w-24 md:h-24 bg-unicorn-gradient rounded-2xl md:rounded-[2.5rem] flex items-center justify-center text-slate-950 font-black text-4xl md:text-6xl shadow-2xl shadow-amber-500/20 animate-bounce-slow">
                           4
                        </div>
                        <div>
                           <h3 className="text-2xl md:text-4xl font-black text-slate-900 italic">รู้</h3>
                           <p className="text-slate-500 text-base md:text-lg font-bold">พื้นฐานความรู้ที่ต้อง "รู้จริง"</p>
                        </div>
                     </div>

                     <div className="grid gap-3 md:gap-4">
                        {SYSTEM_4_KNOW.map((item, idx) => (
                           <button
                              key={item.id}
                              onClick={() => setSelectedTopic(item.id)}
                              aria-label={`ดูรายละเอียด: ${item.title}`}
                              className="glass-card p-5 md:p-7 rounded-[1.8rem] md:rounded-[2.5rem] flex items-center justify-between hover:border-amber-400 cursor-pointer transition-all duration-500 group hover:-translate-y-1 hover:shadow-2xl text-left w-full"
                           >
                              <div className="flex items-center gap-4 md:gap-6">
                                 <div className="w-12 h-12 md:w-16 md:h-16 bg-slate-50 rounded-xl md:rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-amber-100 group-hover:text-amber-600 group-hover:rotate-6 transition-all duration-500 shadow-inner">
                                    {idx === 0 && <Briefcase size={22} className="md:w-[28px] md:h-[28px]" />}
                                    {idx === 1 && <Sparkles size={22} className="md:w-[28px] md:h-[28px]" />}
                                    {idx === 2 && <Target size={22} className="md:w-[28px] md:h-[28px]" />}
                                    {idx === 3 && <MessageCircle size={22} className="md:w-[28px] md:h-[28px]" />}
                                 </div>
                                 <div>
                                    <h4 className="text-lg md:text-2xl font-black text-slate-800 group-hover:text-amber-600 transition-colors leading-tight">{item.title}</h4>
                                    <p className="text-slate-500 text-xs md:text-sm font-medium opacity-80">{item.desc}</p>
                                 </div>
                              </div>
                              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-all duration-500">
                                 <ChevronRight size={18} className="translate-x-0 group-hover:translate-x-0.5" />
                              </div>
                           </button>
                        ))}
                     </div>
                  </div>

                  <div className="bg-slate-950 rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-14 text-white relative overflow-hidden shadow-2xl border border-white/5 hover-shine duration-700">
                     <div className="relative z-10">
                        <h4 className="text-2xl md:text-3xl font-black text-amber-400 mb-4 md:mb-6 drop-shadow-lg">ระดับความเชี่ยวชาญ</h4>
                        <p className="text-indigo-100/60 mb-8 md:mb-10 text-base md:text-lg font-medium">ในระบบ 456 คุณต้องพัฒนาทักษะ "4 รู้" ให้ถึงระดับการสอนทีมงานได้</p>

                        <div className="space-y-3 md:space-y-4">
                           {masterySteps.map((s, i) => (
                              <div key={i} className="flex items-center gap-4 md:gap-6 p-4 md:p-5 rounded-[1.5rem] md:rounded-[2rem] bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all duration-300 group/step">
                                 <div className="w-11 h-11 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-xl md:text-2xl group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 shrink-0">
                                    {i + 1}
                                 </div>
                                 <div>
                                    <p className="font-black text-white text-lg md:text-xl leading-none">{s.label}</p>
                                    <p className="text-slate-500 text-xs md:text-sm mt-1.5 md:mt-2 font-medium leading-tight">{s.desc}</p>
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>
                     <div className="absolute -bottom-20 -right-20 opacity-10 animate-pulse-slow">
                        <Zap size={400} />
                     </div>
                  </div>
               </div>
            </section>
         )}

         {activeTab === '5-DO' && (
            <section className="space-y-12 animate-fade-in">
               <div className="flex flex-col md:flex-row gap-12 items-start">
                  <div className="w-full md:w-1/3 md:sticky md:top-8 space-y-6 md:space-y-8">
                     <div className="flex items-center gap-4 md:gap-6">
                        <div className="w-16 h-16 md:w-24 md:h-24 bg-indigo-600 rounded-2xl md:rounded-[2.5rem] flex items-center justify-center text-white font-black text-4xl md:text-6xl shadow-2xl shadow-indigo-600/20 animate-bounce-slow">
                           5
                        </div>
                        <div>
                           <h3 className="text-2xl md:text-4xl font-black text-slate-900 italic">ทำ</h3>
                           <p className="text-slate-500 text-base md:text-lg font-bold">เนื้องานรายวันที่ขับเคลื่อนผลลัพธ์</p>
                        </div>
                     </div>
                     <div className="bg-indigo-50/50 backdrop-blur-sm p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] border border-indigo-100 relative overflow-hidden group text-center md:text-left">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-200/20 rounded-full blur-3xl" />
                        <p className="text-indigo-900 font-black text-xl md:text-2xl mb-3 md:mb-4 italic relative z-10 leading-tight">"ความสำเร็จเกิดจากการทำเรื่องง่ายๆ อย่างสม่ำเสมอ"</p>
                        <p className="text-indigo-600 text-sm md:text-base font-medium relative z-10 opacity-80 leading-relaxed">การปฏิบัติ 5 ข้อนี้ทุกวัน จะสร้างโมเมนตัมที่ยิ่งใหญ่ให้กับธุรกิจของคุณและทีมงาน</p>
                     </div>
                  </div>

                  <div className="flex-1 space-y-4 md:space-y-6 w-full">
                     {SYSTEM_5_DO.map((item, idx) => (
                        <div key={item.id} className="glass-card p-6 md:p-10 rounded-[2rem] md:rounded-[3.5rem] flex items-center gap-5 md:gap-8 group hover:border-indigo-400 transition-all hover:shadow-2xl hover:-translate-y-1 duration-500">
                           <div className="w-14 h-14 md:w-20 md:h-20 rounded-2xl md:rounded-[2.2rem] bg-indigo-600 text-white flex items-center justify-center font-black text-2xl md:text-4xl shadow-xl shadow-indigo-600/20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shrink-0">
                              {idx + 1}
                           </div>
                           <div className="flex-1">
                              <h4 className="text-xl md:text-3xl font-black text-slate-900 mb-1 md:mb-2 group-hover:text-indigo-600 transition-colors leading-tight">{item.title}</h4>
                              <p className="text-slate-500 text-sm md:text-lg font-medium opacity-80 leading-tight md:leading-normal">{item.desc}</p>
                           </div>
                           <div className="w-10 h-10 md:w-14 md:h-14 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 scale-50 group-hover:scale-100 transition-all duration-500 border border-emerald-100 shrink-0">
                              <Check size={20} className="md:w-[28px] md:h-[28px]" strokeWidth={4} />
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            </section>
         )}

         {activeTab === '6-BE' && (
            <section className="space-y-16 animate-fade-in">
               <div className="text-center space-y-4">
                  <div className="flex flex-col items-center justify-center gap-4 md:gap-6 mb-4">
                     <div className="w-16 h-16 md:w-24 md:h-24 bg-blue-600 rounded-2xl md:rounded-[2.5rem] flex items-center justify-center text-white font-black text-4xl md:text-6xl shadow-2xl shadow-blue-600/30 animate-bounce-slow">
                        6
                     </div>
                     <div className="text-center">
                        <h3 className="text-2xl md:text-4xl font-black text-slate-900 italic tracking-tight">เป็น</h3>
                        <p className="text-slate-500 text-base md:text-lg font-bold">บันไดแห่งความสำเร็จใน Unicorn Academy</p>
                     </div>
                  </div>
               </div>

               {/* Rank Ladder Visualization */}
               <div className="relative py-8 md:py-12 px-4 bg-slate-50/50 rounded-[2.5rem] md:rounded-[4rem] border border-slate-100">
                  <div className="absolute left-1/2 top-0 bottom-0 w-2 bg-slate-200/50 -translate-x-1/2 hidden lg:block rounded-full shadow-inner"></div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6 relative z-10">
                     {SYSTEM_6_BE.map((step, idx) => {
                        const IconComp = iconMap[step.icon] || Trophy;
                        const isGold = idx >= 4; // President & Crown
                        const isBlue = idx < 2; // Steps 1-2
                        return (
                           <div key={step.title} className="flex flex-col items-center group relative cursor-pointer pt-2 md:pt-4">
                              <div className={`
                        w-16 h-16 md:w-24 md:h-24 rounded-2xl md:rounded-[2.5rem] flex items-center justify-center mb-4 md:mb-6 transition-all duration-700 shadow-lg md:shadow-xl group-hover:scale-110 group-hover:-translate-y-2 md:group-hover:-translate-y-4
                        ${isGold ? 'bg-gradient-to-tr from-amber-400 via-amber-500 to-amber-600 text-white shadow-amber-500/30' :
                                    isBlue ? 'bg-gradient-to-tr from-blue-500 via-indigo-600 to-indigo-700 text-white shadow-indigo-500/30' :
                                       'bg-gradient-to-tr from-slate-700 via-slate-800 to-slate-950 text-white shadow-black/20'}
                       `}>
                                 <IconComp size={32} className="md:w-[44px] md:h-[44px] group-hover:rotate-12 transition-transform duration-500" />
                                 {isGold && <div className="absolute -top-1.5 -right-1.5 md:-top-3 md:-right-3 w-5 h-5 md:w-8 md:h-8 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center animate-ping opacity-50" />}
                              </div>
                              <div className="text-center glass-card p-3 md:p-5 rounded-2xl md:rounded-3xl w-full group-hover:border-amber-400 group-hover:shadow-2xl transition-all duration-500 scale-95 group-hover:scale-100 min-h-[110px] md:min-h-0 flex flex-col justify-center">
                                 <h4 className="text-[9px] md:text-xs-plus font-black text-slate-400 uppercase tracking-[0.1em] md:tracking-[0.2em] mb-1 md:mb-2 leading-none">{step.title.split(':')[0]}</h4>
                                 <p className="text-[11px] md:text-sm font-black text-slate-900 mb-1 leading-tight tracking-tight">{step.title.split(':')[1]}</p>
                                 <p className="text-[10px] md:text-xs-plus font-black text-amber-600 uppercase tracking-tighter mt-1 leading-none">{step.range}</p>
                              </div>
                           </div>
                        );
                     })}
                  </div>
               </div>

               {/* 5 ที่ปรึกษาการตลาดยูนิคอร์น (UBC) Requirements Section */}
               <div className="bg-slate-950 rounded-[2.5rem] md:rounded-[4rem] p-8 md:p-12 lg:p-20 text-white shadow-3xl relative overflow-hidden border border-white/5 hover-shine duration-1000">
                  <div className="relative z-10 grid lg:grid-cols-2 gap-12 md:gap-20 items-center">
                     <div className="space-y-6 md:space-y-10 text-center lg:text-left">
                        <div className="w-16 h-16 md:w-24 md:h-24 bg-amber-500 rounded-2xl md:rounded-[2.5rem] flex items-center justify-center shadow-3xl shadow-amber-500/40 group hover:rotate-12 transition-transform duration-500 mx-auto lg:mx-0">
                           <AwardIcon size={32} className="md:w-[48px] md:h-[48px] text-slate-950 fill-current" />
                        </div>
                        <h3 className="text-4xl md:text-5xl lg:text-7xl font-black leading-none tracking-tighter">
                           ความมั่นคง <br />
                           <span className="text-amber-400 mt-2 block">เริ่มต้นที่ตัวเรา</span>
                        </h3>
                        <p className="text-indigo-100/60 text-lg md:text-xl font-medium leading-relaxed max-w-md mx-auto lg:mx-0">
                           การเป็นต้นแบบที่ดีคือหัวใจของการสร้างผู้นำ!
                           หากคุณปฏิบัติครบ 5 ข้อนี้ คุณคือผู้นำระดับ
                           <span className="text-white font-black italic ml-1">"Super Star Elite"</span>
                        </p>
                     </div>

                     <div className="bg-white/5 backdrop-blur-2xl rounded-[2.5rem] md:rounded-[3.5rem] border border-white/10 p-6 md:p-10 lg:p-14 space-y-8 md:space-y-10 shadow-2xl relative overflow-hidden group/list w-full">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover/list:bg-amber-500/20 transition-colors" />
                        <div className="flex items-center gap-3 md:gap-4 mb-4 relative z-10">
                           <div className="w-12 md:w-16 h-1 md:h-1.5 bg-amber-500 rounded-full"></div>
                           <h4 className="text-lg md:text-2xl font-black text-white uppercase tracking-widest text-glitch">5 CORE UBC</h4>
                        </div>
                        <ul className="space-y-4 md:space-y-6 relative z-10">
                           {[
                              "ใช้ Unicorn Smart AI & Dashboard ทุกวัน",
                              "เป็น Super Star Elite อย่างต่อเนื่อง",
                              "ใช้สินค้าครบชุด U4 ทุกเดือน",
                              "New Sponsor อย่างน้อย 1 Platinum/เดือน",
                              "เรียนรู้ทุกฟังก์ชั่น UNICORN ACADEMY"
                           ].map((l, i) => (
                              <li key={i} className="flex items-start gap-4 md:gap-6 text-base md:text-xl font-bold group/item cursor-default">
                                 <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl md:rounded-2xl border-2 border-amber-500/30 flex items-center justify-center shrink-0 group-hover/item:bg-amber-500 group-hover/item:border-amber-500 group-hover/item:rotate-12 transition-all duration-500 shadow-lg">
                                    <Check size={16} className="md:w-[20px] md:h-[20px] text-amber-500 group-hover/item:text-slate-950" strokeWidth={4} />
                                 </div>
                                 <span className="text-slate-300 group-hover/item:text-white transition-colors py-0.5 md:py-1 leading-tight">{l}</span>
                              </li>
                           ))}
                        </ul>
                        <div className="pt-10 border-t border-white/10 flex justify-center relative z-10">
                           <button className="px-8 py-3 bg-white/10 hover:bg-amber-500 hover:text-slate-950 rounded-full text-xs-plus font-black uppercase tracking-[0.3em] transition-all duration-500 border border-white/5 cursor-pointer shadow-lg active:scale-95">
                              Biz Start Up Platform
                           </button>
                        </div>
                     </div>
                  </div>
                  <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-indigo-500/10 to-transparent pointer-events-none"></div>
               </div>
            </section>
         )}

         {/* Mastery Modal */}
         {selectedTopic && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-500">
               <div className="bg-white w-full max-w-2xl rounded-[2.5rem] md:rounded-[4rem] p-8 md:p-12 shadow-3xl animate-in zoom-in-95 duration-500 border border-white/20 overflow-y-auto max-h-[90vh]">
                  <div className="flex justify-between items-start mb-8 md:mb-12">
                     <div className="space-y-1 md:space-y-2">
                        <div className="flex items-center gap-2 md:gap-3">
                           <div className="h-1 md:h-1.5 w-6 md:w-8 bg-amber-500 rounded-full" />
                           <h3 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight">บันทึกความก้าวหน้า</h3>
                        </div>
                        <p className="text-lg md:text-2xl font-black italic mt-1 ml-8 md:ml-11 text-slate-500">
                           {SYSTEM_4_KNOW.find(t => t.id === selectedTopic)?.title}
                        </p>
                     </div>
                     <button
                        onClick={() => setSelectedTopic(null)}
                        aria-label="ปิดหน้าต่าง"
                        className="p-3 md:p-5 bg-slate-50 text-slate-400 rounded-2xl md:rounded-3xl hover:bg-slate-100 hover:text-slate-900 transition-all active:scale-95 group"
                     >
                        <ChevronRight size={24} className="md:w-[32px] md:h-[32px] rotate-180 group-hover:-translate-x-1 transition-transform" />
                     </button>
                  </div>

                  <div className="space-y-8 md:space-y-12">
                     <div className="bg-slate-50/50 p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] border border-slate-100 shadow-inner">
                        <p className="text-lg md:text-2xl font-black text-slate-800 mb-6 md:mb-10 text-center tracking-tight leading-tight">ระดับความเชี่ยวชาญปัจจุบันของคุณ</p>
                        <div className="space-y-3 md:space-y-4">
                           {masterySteps.map((step, i) => (
                              <button key={i} className="w-full p-4 md:p-7 bg-white border-2 border-transparent rounded-[1.5rem] md:rounded-[2.5rem] flex items-center justify-between hover:border-amber-500 hover:bg-amber-50 transition-all duration-500 group shadow-sm hover:shadow-xl">
                                 <div className="flex items-center gap-4 md:gap-6">
                                    <div className="w-10 h-10 md:w-16 md:h-16 rounded-xl md:rounded-[1.5rem] bg-slate-100 flex items-center justify-center font-black group-hover:bg-amber-500 group-hover:text-slate-950 transition-all duration-500 text-lg md:text-2xl group-hover:rotate-6 shrink-0">
                                       {i + 1}
                                    </div>
                                    <div className="text-left">
                                       <p className="font-black text-slate-900 text-base md:text-xl leading-none md:mb-2">{step.label}</p>
                                       <p className="text-[11px] md:text-sm text-slate-500 font-bold opacity-80 leading-tight mt-1 md:mt-0">{step.desc}</p>
                                    </div>
                                 </div>
                                 <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-all duration-500 opacity-0 group-hover:opacity-100 shrink-0">
                                    <Check size={14} className="md:w-[18px] md:h-[18px]" strokeWidth={4} />
                                 </div>
                              </button>
                           ))}
                        </div>
                     </div>

                     <button onClick={() => setSelectedTopic(null)} className="w-full py-5 md:py-8 bg-slate-950 text-white rounded-[1.5rem] md:rounded-[2.5rem] font-black text-lg md:text-2xl shadow-3xl active:scale-95 transition-all hover:bg-slate-900 hover-shine overflow-hidden relative">
                        <span className="relative z-10 uppercase tracking-widest">บันทึกข้อมูล</span>
                     </button>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
};

export default System456;

