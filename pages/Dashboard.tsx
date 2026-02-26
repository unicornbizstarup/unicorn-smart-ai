
import React from 'react';
import {
  Trophy,
  Users,
  TrendingUp,
  ChevronRight,
  Target,
  Rocket,
  Heart,
  MapPin,
  CalendarCheck,
  Activity,
  Award,
  Star,
  Zap,
  Layout,
  Bot,
  MessageSquare,
  ShieldCheck,
  ArrowUpRight
} from 'lucide-react';
import { AppView, UBCLevel } from '../types';

interface DashboardProps {
  onNavigate: (view: AppView) => void;
}

const stats_data = [
  { label: 'คอนเนคใจทีม', value: '18', icon: Heart, color: 'text-rose-500', bg: 'bg-rose-50' },
  { label: 'เคสลงพื้นที่', value: '12', icon: MapPin, color: 'text-blue-500', bg: 'bg-blue-50' },
  { label: 'นำคนเข้าฟังชั่น', value: '5', icon: CalendarCheck, color: 'text-amber-500', bg: 'bg-amber-50' },
  { label: 'ระดับการสอน', value: 'Expert', icon: Trophy, color: 'text-purple-500', bg: 'bg-purple-50' },
];

const mastery_data = [
  { label: 'UBC 1: Digital Foundation', val: 95, color: 'bg-amber-500' },
  { label: 'UBC 2: Video Marketing', val: 82, color: 'bg-blue-500' },
  { label: 'UBC 3: Content Funnel', val: 45, color: 'bg-emerald-500' },
  { label: 'UBC 4: Leadership System', val: 30, color: 'bg-rose-500' },
];

const level_data = {
  [UBCLevel.UBC1_FOUNDATION]: {
    title: 'UBC 1 - Foundation',
    subtitle: 'รากฐานที่ปรึกษาและวินัยดิจิทัล',
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
    icon: Star,
    missions: [
      { t: 'ตั้งค่า Digital Name Card', c: 'bg-amber-500/20 text-amber-300', icon: Layout },
      { t: 'ซ้อมพูดแผน 4 รู้ กับ AI Coach', c: 'bg-blue-500/20 text-blue-300', icon: Bot },
      { t: 'บันทึกการใช้สินค้า 100%', c: 'bg-emerald-500/20 text-emerald-300', icon: Activity }
    ]
  },
  [UBCLevel.UBC2_SPECIALIST]: {
    title: 'UBC 2 - Specialist',
    subtitle: 'ผู้เชี่ยวชาญการตลาดดิจิทัล',
    color: 'text-indigo-500',
    bg: 'bg-indigo-500/10',
    icon: Zap,
    missions: [
      { t: 'สร้างคลิป TikTok พร้อม One Link', c: 'bg-indigo-500/20 text-indigo-300', icon: Rocket },
      { t: 'ฝึกแก้ข้อโต้แย้ง (Storytelling)', c: 'bg-purple-500/20 text-purple-300', icon: MessageSquare },
      { t: 'สร้าง Super Star ใหม่ในทีม', c: 'bg-amber-500/20 text-amber-300', icon: Trophy }
    ]
  },
  [UBCLevel.UBC3_STRATEGIC]: {
    title: 'UBC 3 - Strategic',
    subtitle: 'นักกลยุทธ์หัวใจที่ปรึกษา',
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
    icon: Target,
    missions: [
      { t: 'วิเคราะห์ Wealth DNA ของทีม', c: 'bg-emerald-500/20 text-emerald-300', icon: Activity },
      { t: 'วางแผน Content Funnel 30 วัน', c: 'bg-blue-500/20 text-blue-300', icon: TrendingUp },
      { t: 'บริหารฟังก์ชันอบรมรายสัปดาห์', c: 'bg-purple-500/20 text-purple-300', icon: CalendarCheck }
    ]
  },
  [UBCLevel.UBC4_MASTER]: {
    title: 'UBC 4 - Master',
    subtitle: 'ปรมาจารย์สร้างผู้นำอัจฉริยะ',
    color: 'text-rose-500',
    bg: 'bg-rose-500/10',
    icon: Award,
    missions: [
      { t: 'Mentoring ผู้นำระดับ Exclusive', c: 'bg-rose-500/20 text-rose-300', icon: Users },
      { t: 'สร้างระบบ Training อัตโนมัติ', c: 'bg-amber-500/20 text-amber-300', icon: Zap },
      { t: 'ขยายธุรกิจสู่ตลาดสากล', c: 'bg-indigo-500/20 text-indigo-300', icon: ShieldCheck }
    ]
  }
};

const GrowthLineChart: React.FC = () => (
  <svg viewBox="0 0 400 150" className="w-full h-full drop-shadow-lg overflow-visible">
    <defs>
      <linearGradient id="growthGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.01" />
      </linearGradient>
      <filter id="lineGlow">
        <feGaussianBlur stdDeviation="3" result="glow" />
        <feComposite in="SourceGraphic" in2="glow" operator="over" />
      </filter>
    </defs>
    {/* Grid Lines */}
    <line x1="0" y1="120" x2="400" y2="120" stroke="#e2e8f0" strokeWidth="0.5" strokeDasharray="4,4" />
    <line x1="0" y1="80" x2="400" y2="80" stroke="#e2e8f0" strokeWidth="0.5" strokeDasharray="4,4" />
    <line x1="0" y1="40" x2="400" y2="40" stroke="#e2e8f0" strokeWidth="0.5" strokeDasharray="4,4" />

    {/* Area */}
    <path
      d="M 0,130 L 50,110 L 100,125 L 150,80 L 200,60 L 250,45 L 300,55 L 350,20 L 400,10 L 400,150 L 0,150 Z"
      fill="url(#growthGrad)"
    />

    {/* Main Line */}
    <path
      d="M 0,130 L 50,110 L 100,125 L 150,80 L 200,60 L 250,45 L 300,55 L 350,20 L 400,10"
      fill="none"
      stroke="#f59e0b"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
      filter="url(#lineGlow)"
      className="animate-draw"
    />

    {/* Data Points */}
    {[
      { x: 50, y: 110 }, { x: 150, y: 80 }, { x: 250, y: 45 }, { x: 400, y: 10 }
    ].map((p, i) => (
      <circle
        key={i}
        cx={p.x} cy={p.y} r="5"
        fill="#f59e0b"
        stroke="white"
        strokeWidth="2"
        className="animate-pulse"
      />
    ))}
  </svg>
);

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const [userLevel, setUserLevel] = React.useState<UBCLevel>(UBCLevel.UBC4_MASTER);
  const currentLevelInfo = level_data[userLevel] || level_data[UBCLevel.UBC1_FOUNDATION];

  return (
    <div className="space-y-8 animate-fade-in pb-10 px-2 lg:px-0">
      {/* Premium Header Profile Section */}
      <section className="flex flex-col lg:flex-row gap-6 items-start lg:items-stretch">
        <div className="flex-1 bg-white/40 backdrop-blur-xl rounded-[2.5rem] p-6 md:p-8 border border-white shadow-2xl flex items-center gap-6 group hover:border-amber-500/20 transition-all duration-500 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="relative">
            <div className="w-20 h-20 md:w-28 md:h-28 bg-dark-gradient rounded-[2rem] p-1 shadow-2xl overflow-hidden group-hover:rotate-3 transition-transform duration-500">
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=UnicornPartner"
                alt="Partner Avatar"
                className="w-full h-full object-cover rounded-[1.8rem]"
              />
            </div>
            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-amber-500 rounded-full border-4 border-slate-50 flex items-center justify-center text-white shadow-xl">
              <Trophy size={16} />
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-amber-500/10 text-amber-600 border border-amber-500/20 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-sm">DIAMOND ZONE</span>
              <span className="text-slate-400 text-[10px] font-bold">U-Partner ID: 9988-AIC</span>
            </div>
            <h2 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight mb-1">Kru Den Master Fa</h2>
            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 rounded-full border border-emerald-100">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-tighter">Online Coaching</span>
              </div>
              <div className="flex items-center gap-1.5 transition-transform hover:scale-105">
                <Star size={16} className="text-amber-500 fill-amber-500" />
                <span className="text-xs font-black text-slate-900 tracking-tight">UBC {userLevel} Professional</span>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-80 bg-slate-950 rounded-[2.5rem] p-8 text-white flex flex-col justify-between shadow-2xl relative overflow-hidden group border border-white/5">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-amber-500/20 transition-all duration-700" />
          <div className="relative z-10">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-2">My Business Valuation</p>
            <div className="flex items-end gap-3 mb-4">
              <p className="text-4xl font-black text-white tracking-tighter">45,280</p>
              <div className="flex items-center gap-1 bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-lg text-xs font-black border border-emerald-500/20 mb-1.5">
                <ArrowUpRight size={12} />
                12%
              </div>
            </div>
            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-amber-500 w-[72%] rounded-full shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-white/5 flex justify-between items-center relative z-10">
            <div className="flex -space-x-2.5">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-950 bg-slate-800 overflow-hidden shadow-xl transition-transform hover:scale-110 cursor-pointer">
                  <img src={`https://i.pravatar.cc/100?u=${i + 40}`} alt="team" />
                </div>
              ))}
              <div className="w-8 h-8 rounded-full border-2 border-slate-950 bg-amber-500 flex items-center justify-center text-[10px] font-black text-slate-950">+15</div>
            </div>
            <p className="text-[10px] font-black text-white/50 uppercase tracking-widest">Team Growth</p>
          </div>
        </div>
      </section>

      {/* Main Path & Performance Section */}
      <div className="grid lg:grid-cols-12 gap-6 lg:gap-8">
        {/* Banner Section 改良 */}
        <section className="lg:col-span-8 bg-white/40 backdrop-blur-md rounded-[3rem] p-8 md:p-12 relative overflow-hidden border border-white shadow-2xl group transition-all duration-500 hover:border-amber-500/10 flex flex-col justify-between min-h-[400px]">
          <div className="relative z-10">
            <div className="flex items-center gap-5 mb-10">
              <div className="flex bg-slate-950/5 p-1.5 rounded-[2rem] gap-1 border border-slate-200 shadow-inner">
                {[1, 2, 3, 4].map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setUserLevel(lvl)}
                    className={`
                      w-10 h-10 md:w-14 md:h-14 rounded-[1.2rem] flex items-center justify-center transition-all duration-500 relative
                      ${userLevel === lvl
                        ? 'bg-slate-950 text-amber-500 shadow-2xl scale-110 z-10'
                        : 'text-slate-400 hover:bg-white hover:text-slate-600'}
                    `}
                  >
                    <span className="text-lg md:text-xl font-black">{lvl}</span>
                  </button>
                ))}
              </div>
              <div className="h-10 w-px bg-slate-200" />
              <div>
                <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest leading-none mb-1">Your Journey</p>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">Level Selection</h3>
              </div>
            </div>

            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black mb-8 leading-[1.1] text-slate-900">
              {currentLevelInfo.title} <br />
              <span className="text-amber-500 drop-shadow-sm">{currentLevelInfo.subtitle}</span>
            </h1>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => onNavigate(AppView.SYSTEM_456)}
                className="bg-slate-950 hover:bg-slate-900 text-white px-8 py-5 rounded-[2rem] font-black text-xl flex items-center gap-3 transition-all shadow-2xl shadow-slate-900/20 active:scale-95 group"
              >
                ประเมินทักษะ
                <TrendingUp size={22} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
              <button
                onClick={() => onNavigate(AppView.AI_COACH)}
                className="bg-white/80 hover:bg-white text-slate-950 px-8 py-5 rounded-[2rem] font-black text-lg border border-slate-200 transition-all shadow-xl hover:shadow-2xl active:scale-95 flex items-center gap-2"
              >
                <Bot size={22} className="text-amber-500" />
                ฝึกกับ AI Coach
              </button>
            </div>
          </div>

          <div className="mt-12 group/chart relative bg-white/30 rounded-[2.5rem] p-6 border border-white shadow-inner">
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                <Activity size={16} className="text-amber-500" />
                อัตราการเติบโตธุรกิจ
              </h4>
              <div className="flex items-center gap-4 text-[10px] font-black uppercase text-slate-400">
                <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_5px_rgba(245,158,11,0.5)]" /> Real-time</span>
                <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-slate-300" /> Last Month</span>
              </div>
            </div>
            <div className="h-32 md:h-40">
              <GrowthLineChart />
            </div>
          </div>

          {/* Decorative dynamic icon based on level */}
          <div className="absolute top-1/2 right-0 w-1/2 h-1/2 opacity-[0.05] pointer-events-none flex items-center justify-center transition-all duration-700">
            <currentLevelInfo.icon size={400} className="translate-x-1/4 -translate-y-1/4" />
          </div>
        </section>

        {/* Missions Section 改良 */}
        <div className="lg:col-span-4 bg-slate-950 rounded-[3rem] p-8 text-white flex flex-col justify-between hover-shine shadow-2xl relative overflow-hidden group border border-white/5">
          <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-amber-500/20 transition-all duration-700" />
          <div className="relative z-10">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <div className={`px-4 py-1.5 rounded-full ${currentLevelInfo.bg} ${currentLevelInfo.color} text-[10px] font-black uppercase tracking-[0.2em] border border-white/10`}>
                  Level {userLevel} Path
                </div>
                <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-amber-500 shadow-xl border border-white/10">
                  <currentLevelInfo.icon size={16} />
                </div>
              </div>
              <h4 className="text-2xl md:text-3xl font-black tracking-tight">{currentLevelInfo.title}</h4>
              <p className="text-white/40 text-xs font-bold leading-relaxed">{currentLevelInfo.subtitle}</p>
            </div>

            <h5 className="text-sm font-black mb-6 flex items-center gap-3 text-amber-400 uppercase tracking-widest">
              Daily Missions
              <div className="flex-1 h-px bg-amber-500/20" />
            </h5>

            <div className="space-y-4">
              {currentLevelInfo.missions.map((job, idx) => (
                <button
                  key={idx}
                  aria-label={`ภารกิจ: ${job.t}`}
                  className="w-full text-left flex items-center gap-4 p-5 rounded-[2rem] bg-white/5 border border-white/5 group/task cursor-pointer hover:bg-white/10 transition-all duration-300 hover:translate-x-1 active:scale-95 shadow-lg"
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover/task:rotate-12 ${job.c} shadow-xl`}>
                    <job.icon size={20} />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <span className="text-sm font-bold block truncate">{job.t}</span>
                    <span className="text-[10px] text-white/30 font-black uppercase tracking-tighter">+1,200 EXP</span>
                  </div>
                  <ChevronRight size={18} className="text-white/20 group-hover/task:text-amber-400 group-hover/task:translate-x-1 transition-all" />
                </button>
              ))}
            </div>
          </div>
          <div className="mt-10 relative z-10">
            <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/10 text-center backdrop-blur-md group-hover:border-amber-500/20 transition-all duration-700 shadow-2xl">
              <p className="text-[10px] text-white/40 uppercase font-black mb-1 tracking-[0.3em]">Skill Mastery</p>
              <p className="text-6xl font-black text-amber-400 drop-shadow-[0_0_20px_rgba(245,158,11,0.4)] tracking-tighter">72<span className="text-2xl opacity-50">%</span></p>
              <button
                onClick={() => onNavigate(AppView.SYSTEM_456)}
                className="mt-4 text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-amber-400 transition-colors flex items-center justify-center gap-2 mx-auto"
              >
                View Full DNA Analysis <ArrowUpRight size={12} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mastery Radar Section */}
      <section className="glass-card p-8 md:p-12 rounded-[3.5rem] flex flex-col md:flex-row items-center gap-12 group hover:shadow-2xl transition-all duration-700 border border-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />

        <div className="flex-1 text-center md:text-left w-full relative z-10">
          <div className="flex items-center gap-3 mb-4 justify-center md:justify-start">
            <div className="w-10 h-10 bg-amber-500 rounded-2xl flex items-center justify-center shadow-lg transform -rotate-6 transition-transform group-hover:rotate-0">
              <Zap size={24} className="text-white" />
            </div>
            <h3 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight group-hover:text-amber-600 transition-colors">วิเคราะห์ความเก่งรอบด้าน</h3>
          </div>
          <p className="text-slate-500 text-lg md:text-xl font-medium mb-10 leading-relaxed max-w-xl">วิเคราะห์สมดุลทักษะ 10 แกนหลักของคุณด้วยระบบ AI Radar Analysis เพื่อหาจุดแข็งและจุดที่ต้องพัฒนาครับ</p>

          <div className="grid sm:grid-cols-2 gap-6 mb-10">
            {mastery_data.map(i => (
              <div key={i.label} className="group/item bg-white/50 p-6 rounded-[2rem] border border-white/60 shadow-sm transition-all hover:bg-white hover:shadow-xl hover:-translate-y-1 duration-500">
                <div className="flex justify-between items-end mb-3">
                  <span className="text-sm font-black text-slate-600 tracking-tight">{i.label}</span>
                  <span className="text-lg font-black text-slate-950">{i.val}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                  <div
                    className={`h-full ${i.color} transition-all duration-1000 ease-out group-hover/item:brightness-110 shadow-[0_0_10px_rgba(0,0,0,0.1)]`}
                    style={{ width: `${i.val}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-slate-50 rounded-2xl border border-slate-100">
            <MessageSquare size={18} className="text-amber-500" />
            <p className="text-sm font-bold text-slate-600 italic">"คุณพี่อัปเลนเนอร์ด้าน Content ได้ดีมากครับ! แนะนำให้ฝึกสอนทีมเพิ่มเพื่อเป็น UBC 4 ครับ ✨"</p>
          </div>
        </div>

        <div className="relative w-72 h-72 md:w-[450px] md:h-[450px] flex items-center justify-center p-8 group-hover:scale-105 transition-transform duration-1000 relative z-10">
          {/* Background Rings */}
          <div className="absolute inset-0 border-2 border-slate-100 rounded-full animate-spin-slow opacity-50" />
          <div className="absolute inset-10 border border-slate-100 rounded-full animate-reverse-spin opacity-30" />

          {/* Enhanced Radar SVG */}
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xl">
            <defs>
              <radialGradient id="radarGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.5" />
                <stop offset="60%" stopColor="#f59e0b" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#d97706" stopOpacity="0.05" />
              </radialGradient>
              <filter id="radarGlow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            {/* Web Lines */}
            {[10, 20, 30, 40, 50].map((r) => (
              <circle key={r} cx="50" cy="50" r={r * 0.9} fill="none" stroke="#e2e8f0" strokeWidth="0.5" strokeDasharray="2,2" />
            ))}

            {/* 5 Axis */}
            {[0, 72, 144, 216, 288].map((angle) => {
              const x = 50 + 45 * Math.cos((angle - 90) * (Math.PI / 180));
              const y = 50 + 45 * Math.sin((angle - 90) * (Math.PI / 180));
              return <line key={angle} x1="50" y1="50" x2={x} y2={y} stroke="#e2e8f0" strokeWidth="1" />;
            })}

            <polygon
              points="50,15 88,42 75,85 25,80 15,35"
              fill="url(#radarGrad)"
              stroke="#f59e0b"
              strokeWidth="2.5"
              filter="url(#radarGlow)"
              className="animate-float"
              style={{ strokeLinejoin: 'round' }}
            />

            {/* Point Markers */}
            {[
              { x: 50, y: 15 }, { x: 88, y: 42 }, { x: 75, y: 85 }, { x: 25, y: 80 }, { x: 15, y: 35 }
            ].map((p, i) => (
              <g key={i} className="animate-pulse" style={{ animationDelay: `${i * 0.2}s` }}>
                <circle cx={p.x} cy={p.y} r="3.5" fill="white" stroke="#f59e0b" strokeWidth="2" />
                <circle cx={p.x} cy={p.y} r="8" fill="#f59e0b" fillOpacity="0.1" />
              </g>
            ))}
          </svg>

          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-20 h-20 bg-white rounded-[2rem] shadow-2xl flex items-center justify-center border border-slate-50 rotate-12 group-hover:rotate-0 transition-transform duration-700">
              <Target size={32} className="text-amber-500" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Table Section */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {stats_data.map((stat) => (
          <button
            key={stat.label}
            aria-label={`สถิติ ${stat.label}: ${stat.value}`}
            className="glass-card p-6 md:p-10 rounded-[2.5rem] border border-white shadow-xl hover:shadow-2xl transition-all group hover:-translate-y-2 duration-700 cursor-pointer text-left w-full overflow-hidden relative"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-slate-900/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-amber-500/10 transition-colors" />
            <div className={`${stat.bg} w-16 h-16 rounded-[2rem] flex items-center justify-center mb-6 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-700 shadow-lg relative z-10`}>
              <stat.icon size={32} className={`${stat.color}`} />
            </div>
            <p className="text-slate-400 text-[10px] md:text-xs font-black uppercase tracking-[0.3em] mb-2 relative z-10">{stat.label}</p>
            <div className="flex items-end gap-2 relative z-10">
              <p className="text-3xl md:text-5xl font-black text-slate-900 group-hover:text-amber-600 transition-colors tracking-tighter">{stat.value}</p>
              <div className="text-[10px] font-black bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded-md mb-2 shadow-sm">+2</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
