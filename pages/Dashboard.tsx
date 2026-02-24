
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
  ShieldCheck
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

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const [userLevel, setUserLevel] = React.useState<UBCLevel>(UBCLevel.UBC1_FOUNDATION);
  const currentLevelInfo = level_data[userLevel] || level_data[UBCLevel.UBC1_FOUNDATION];

  return (
    <div className="space-y-8 animate-fade-in pb-10 px-2 lg:px-0">
      {/* Premium Header Profile Section */}
      <section className="flex flex-col lg:flex-row gap-6 items-start lg:items-stretch">
        <div className="flex-1 bg-white/40 backdrop-blur-xl rounded-[2rem] md:rounded-[2.5rem] p-6 border border-white/60 shadow-xl flex items-center gap-6 group hover:border-amber-500/30 transition-all">
          <div className="relative">
            <div className="w-20 h-20 md:w-24 md:h-24 bg-dark-gradient rounded-3xl p-1 shadow-2xl overflow-hidden group-hover:rotate-3 transition-transform">
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=UnicornPartner"
                alt="Partner Avatar"
                className="w-full h-full object-cover rounded-[1.2rem]"
              />
            </div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-amber-500 rounded-full border-4 border-white flex items-center justify-center text-white shadow-lg">
              <Trophy size={14} />
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-amber-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter shadow-sm animate-pulse">Diamond Executive</span>
              <span className="text-slate-400 text-[10px] font-bold">U-Partner ID: 9988-AIC</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Kru Den Master Fa</h2>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-xs font-bold text-slate-600">Online Coaching</span>
              </div>
              <div className="h-4 w-[1px] bg-slate-200" />
              <div className="flex items-center gap-1.5">
                <Star size={14} className="text-amber-500 fill-amber-500" />
                <span className="text-xs font-black text-slate-900">Level {userLevel} Professional</span>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-72 bg-dark-gradient rounded-[2rem] md:rounded-[2.5rem] p-6 text-white flex flex-col justify-between shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-1">Business Points</p>
            <div className="flex items-end gap-2">
              <p className="text-3xl font-black text-white">45,280</p>
              <p className="text-xs font-bold text-amber-400 mb-1">+12%</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center relative z-10">
            <div className="flex -space-x-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-6 h-6 rounded-full border-2 border-slate-900 bg-slate-800 overflow-hidden shadow-lg">
                  <img src={`https://i.pravatar.cc/100?u=${i + 20}`} alt="team" />
                </div>
              ))}
              <div className="w-6 h-6 rounded-full border-2 border-slate-900 bg-amber-500 flex items-center justify-center text-[8px] font-black">+15</div>
            </div>
            <p className="text-[10px] font-bold text-white/60 uppercase">Team Growth</p>
          </div>
        </div>
      </section>

      {/* 40+ Empathy Banner (Modified for better layout) */}
      <section className="bg-white/40 backdrop-blur-md rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 lg:p-12 relative overflow-hidden border border-white/60 shadow-2xl group transition-all hover:border-amber-500/20">
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-4 mb-8">
            <div className="flex -space-x-3">
              {[UBCLevel.UBC1_FOUNDATION, UBCLevel.UBC2_SPECIALIST, UBCLevel.UBC3_STRATEGIC, UBCLevel.UBC4_MASTER].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setUserLevel(lvl)}
                  className={`
                    w-12 h-12 md:w-16 md:h-16 rounded-2xl md:rounded-[1.5rem] flex items-center justify-center border-4 border-white shadow-xl transition-all relative z-[${10 - lvl}]
                    ${userLevel === lvl ? 'bg-amber-500 scale-110 rotate-3 z-50 text-white' : 'bg-slate-100 text-slate-400 hover:scale-105'}
                  `}
                >
                  <span className="text-lg md:text-2xl font-black">{lvl}</span>
                </button>
              ))}
            </div>
            <div className="h-10 w-[1px] bg-slate-200 mx-2" />
            <div>
              <p className="text-[10px] md:text-xs font-black text-amber-500 uppercase tracking-widest leading-none mb-1">Select Path</p>
              <h3 className="text-xl md:text-2xl font-black text-slate-900">UBC Program Level</h3>
            </div>
          </div>

          <h1 className="text-2xl md:text-4xl lg:text-5xl font-black mb-6 leading-[1.15] text-slate-900 uppercase">
            {currentLevelInfo.title} <br />
            <span className="text-amber-500">{currentLevelInfo.subtitle}</span>
          </h1>

          <div className="flex flex-wrap gap-3 md:gap-4">
            <button
              onClick={() => onNavigate(AppView.SYSTEM_456)}
              className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-4 md:px-10 md:py-5 rounded-2xl md:rounded-[2rem] font-black text-lg md:text-xl flex items-center gap-3 transition-all shadow-xl active:scale-95"
            >
              ประเมินทักษะ
              <TrendingUp size={20} />
            </button>
            <button
              onClick={() => onNavigate(AppView.AI_COACH)}
              className="bg-white hover:bg-slate-50 text-slate-900 px-6 py-4 md:px-10 md:py-5 rounded-2xl md:rounded-[2rem] font-bold border border-slate-200 transition-all shadow-lg text-sm md:text-base"
            >
              ฝึกกับ AI Coach
            </button>
          </div>
        </div>

        {/* Decorative dynamic icon based on level */}
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-[0.03] lg:opacity-[0.05] pointer-events-none flex items-center justify-center transition-all">
          <currentLevelInfo.icon size={400} className="translate-x-1/4" />
        </div>
      </section>

      {/* Mastery Overview & Radar */}
      <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2 glass-card p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] flex flex-col md:flex-row items-center gap-8 lg:gap-12 group hover:shadow-2xl transition-all duration-500">
          <div className="flex-1 text-center md:text-left w-full">
            <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-2 group-hover:text-amber-600 transition-colors">ความเก่งรอบด้าน</h3>
            <p className="text-sm md:text-base text-slate-500 mb-6 md:mb-8">วิเคราะห์สมดุลทักษะ 10 แกนหลักของคุณ</p>

            <div className="space-y-6">
              {mastery_data.map(i => (
                <div key={i.label} className="group/item">
                  <div className="flex justify-between text-sm font-bold mb-2">
                    <span className="text-slate-600">{i.label}</span>
                    <span className="text-slate-900">{i.val}%</span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                    <div
                      className={`h-full ${i.color} transition-all duration-1000 ease-out group-hover/item:brightness-110`}
                      style={{ width: `${i.val}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-400 mt-6 md:mt-8 italic border-t border-slate-100 pt-4">* แนะนำ: ฝึกทักษะ "Train the Trainer" เพิ่มเติมเพื่อขยายทีม</p>
          </div>

          <div className="relative w-64 h-64 md:w-72 md:h-72 bg-slate-50/50 rounded-full flex items-center justify-center p-4 shadow-inner group-hover:scale-105 transition-transform duration-700">
            {/* Enhanced Radar SVG */}
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="2" />
              <circle cx="50" cy="50" r="30" fill="none" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="2" />
              <circle cx="50" cy="50" r="15" fill="none" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="2" />
              <path d="M50 5 L95 50 L50 95 L5 50 Z" fill="none" stroke="#cbd5e1" strokeWidth="0.5" />
              <polygon
                points="50,15 80,40 60,85 15,50 30,20"
                fill="rgba(245, 158, 11, 0.25)"
                stroke="#f59e0b"
                strokeWidth="2.5"
                className="animate-pulse"
              />
              <circle cx="50" cy="15" r="3" fill="#f59e0b" className="animate-bounce" style={{ animationDelay: '0s' }} />
              <circle cx="80" cy="40" r="3" fill="#f59e0b" className="animate-bounce" style={{ animationDelay: '0.2s' }} />
              <circle cx="60" cy="85" r="3" fill="#f59e0b" className="animate-bounce" style={{ animationDelay: '0.4s' }} />
              <circle cx="15" cy="50" r="3" fill="#f59e0b" className="animate-bounce" style={{ animationDelay: '0.6s' }} />
              <circle cx="30" cy="20" r="3" fill="#f59e0b" className="animate-bounce" style={{ animationDelay: '0.8s' }} />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-14 h-14 bg-white rounded-full shadow-xl flex items-center justify-center border border-slate-50">
                <Target size={24} className="text-amber-500 animate-spin-slow" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 text-white flex flex-col justify-between hover-shine shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-amber-500/20 transition-colors" />
          <div className="relative z-10">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-1">
                <div className={`px-3 py-1 rounded-full ${currentLevelInfo.bg} ${currentLevelInfo.color} text-[10px] font-black uppercase tracking-widest`}>
                  Level {userLevel}
                </div>
                <currentLevelInfo.icon size={14} className={currentLevelInfo.color} />
              </div>
              <h4 className="text-xl md:text-2xl font-black">{currentLevelInfo.title}</h4>
              <p className="text-slate-400 text-xs font-bold">{currentLevelInfo.subtitle}</p>
            </div>

            <h5 className="text-sm md:text-base font-black mb-4 flex items-center gap-3 text-amber-400">
              ภารกิจสู่ความสำเร็จ
            </h5>

            <div className="space-y-4">
              {currentLevelInfo.missions.map((job, idx) => (
                <button
                  key={idx}
                  aria-label={`ภารกิจ: ${job.t}`}
                  className="w-full text-left flex items-center gap-3 md:gap-4 p-4 md:p-5 rounded-xl md:rounded-2xl bg-white/5 border border-white/10 group/task cursor-pointer hover:bg-white/10 transition-all hover:translate-x-2"
                >
                  <div className={`p-1.5 md:p-2 rounded-lg md:rounded-xl ${job.c}`}>
                    <job.icon size={16} className="md:w-[18px] md:h-[18px]" />
                  </div>
                  <span className="text-sm font-bold flex-1">{job.t}</span>
                  <ChevronRight size={16} className="text-white/20 group-hover/task:text-amber-400 transition-colors" />
                </button>
              ))}
            </div>
          </div>
          <div className="mt-8 relative z-10">
            <div className="p-6 bg-white/5 rounded-3xl border border-white/10 text-center backdrop-blur-sm group-hover:border-amber-500/30 transition-colors">
              <p className="text-xs text-slate-400 uppercase font-black mb-1 tracking-widest">Your Efficiency</p>
              <p className="text-5xl font-black text-amber-400 drop-shadow-[0_0_15px_rgba(245,158,11,0.3)]">72%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Table */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {stats_data.map((stat) => (
          <button
            key={stat.label}
            aria-label={`สถิติ ${stat.label}: ${stat.value}`}
            className="glass-card p-5 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border border-white/50 shadow-sm hover:shadow-2xl transition-all group hover:-translate-y-2 duration-500 cursor-pointer text-left w-full"
          >
            <div className={`${stat.bg} w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-sm`}>
              <stat.icon size={24} className={`${stat.color} md:w-[32px] md:h-[32px]`} />
            </div>
            <p className="text-slate-400 text-[10px] md:text-xs-plus font-black uppercase tracking-[0.2em] mb-1 md:mb-2">{stat.label}</p>
            <p className="text-2xl md:text-4xl font-black text-slate-900 group-hover:text-amber-600 transition-colors">{stat.value}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;