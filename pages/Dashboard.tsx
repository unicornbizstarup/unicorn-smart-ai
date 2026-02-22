
import React from 'react';
import {
  Trophy,
  Users,
  TrendingUp,
  ChevronRight,
  Target,
  Rocket,
  ShieldCheck,
  Heart,
  MapPin,
  CalendarCheck,
  Activity
} from 'lucide-react';
import { AppView } from '../types';

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
  { label: 'ธุรกิจ & แผนรายได้', val: 85, color: 'bg-blue-500' },
  { label: 'สินค้า & บริการ', val: 92, color: 'bg-emerald-500' },
  { label: 'ทีม & การสอนงาน', val: 45, color: 'bg-amber-500' },
  { label: 'ออนไลน์ & AI', val: 68, color: 'bg-indigo-600' },
];

const urgent_tasks = [
  { t: 'ซ้อมสอนแผนรายได้ (Stage 4)', c: 'bg-blue-500/20 text-blue-300', icon: ShieldCheck },
  { t: 'จัด House Meeting เย็นนี้', c: 'bg-amber-500/20 text-amber-300', icon: MapPin },
  { t: 'ส่งทีมเข้า President Talk', c: 'bg-purple-500/20 text-purple-300', icon: Users },
];

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {

  return (
    <div className="space-y-8 animate-fade-in pb-10 px-2 lg:px-0">
      {/* 40+ Empathy Banner */}
      <section className="bg-dark-gradient rounded-[3rem] p-10 lg:p-14 text-white relative overflow-hidden border border-white/10 shadow-2xl hover-shine transition-transform hover:scale-[1.01] duration-500">
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-amber-500 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/20 animate-pulse">
              <Heart className="text-white fill-current" size={28} />
            </div>
            <div>
              <p className="text-amber-400 font-black tracking-[0.2em] text-xs uppercase opacity-80">Unicorn Heart Culture</p>
              <h2 className="text-2xl font-bold">ผู้นำที่ใช้ "หัวใจ" นำทาง</h2>
            </div>
          </div>

          <h1 className="text-5xl lg:text-7xl font-black mb-8 leading-[1.15]">
            รู้จริง <span className="text-amber-400 text-glitch">เข้าใจ</span> <br />
            <span className="text-3xl lg:text-5xl opacity-80">สอนเป็นระบบ</span>
          </h1>

          <p className="text-indigo-100/80 mb-10 text-xl font-light leading-relaxed max-w-lg">
            ความสำเร็จที่ยั่งยืนเริ่มต้นจากการ "เข้าใจ" ทีมงาน
            และใช้ทักษะพื้นฐาน 10 ด้านในการขับเคลื่อนธุรกิจให้เติบโต
          </p>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => onNavigate(AppView.SYSTEM_456)}
              aria-label="เริ่มประเมินทักษะ ระบบ 4-5-6"
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-10 py-5 rounded-[2rem] font-black text-xl flex items-center gap-3 transition-all shadow-xl shadow-amber-500/30 active:scale-95"
            >
              เริ่มประเมินทักษะ
              <ChevronRight size={24} />
            </button>
            <button
              onClick={() => onNavigate(AppView.AI_COACH)}
              aria-label="พูดคุยกับโค้ชอัจฉริยะ AI"
              className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-10 py-5 rounded-[2rem] font-bold border border-white/20 transition-all hover:border-white/40"
            >
              คุยกับโค้ช AI
            </button>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-2/5 h-full opacity-10 flex items-center justify-center animate-float-slow">
          <Activity size={500} className="text-amber-400 translate-x-24" />
        </div>
      </section>

      {/* Mastery Overview & Radar */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-card p-10 rounded-[3rem] flex flex-col md:flex-row items-center gap-12 group hover:shadow-2xl transition-all duration-500">
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-3xl font-black text-slate-900 mb-2 group-hover:text-amber-600 transition-colors">ความเก่งรอบด้าน</h3>
            <p className="text-slate-500 mb-8">วิเคราะห์สมดุลทักษะ 10 แกนหลักของคุณ</p>

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
            <p className="text-sm text-slate-400 mt-8 italic border-t border-slate-100 pt-4">* แนะนำ: ฝึกทักษะ "Train the Trainer" เพิ่มเติมเพื่อขยายทีม</p>
          </div>

          <div className="relative w-72 h-72 bg-slate-50/50 rounded-full flex items-center justify-center p-4 shadow-inner group-hover:scale-110 transition-transform duration-700">
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

        <div className="bg-slate-900 rounded-[3rem] p-10 text-white flex flex-col justify-between hover-shine shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-amber-500/20 transition-colors" />
          <div className="relative z-10">
            <h4 className="text-2xl font-black mb-6 flex items-center gap-3">
              <Rocket size={24} className="text-amber-400 animate-bounce" />
              ภารกิจเร่งด่วน
            </h4>
            <div className="space-y-4">
              {urgent_tasks.map((job, idx) => (
                <button
                  key={idx}
                  aria-label={`ภารกิจ: ${job.t}`}
                  className="w-full text-left flex items-center gap-4 p-5 rounded-2xl bg-white/5 border border-white/10 group/task cursor-pointer hover:bg-white/10 transition-all hover:translate-x-2"
                >
                  <div className={`p-2 rounded-xl ${job.c}`}>
                    <job.icon size={18} />
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
            className="glass-card p-8 rounded-[2.5rem] border border-white/50 shadow-sm hover:shadow-2xl transition-all group hover:-translate-y-2 duration-500 cursor-pointer text-left w-full"
          >
            <div className={`${stat.bg} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-sm`}>
              <stat.icon size={32} className={stat.color} />
            </div>
            <p className="text-slate-400 text-xs-plus font-black uppercase tracking-[0.2em] mb-2">{stat.label}</p>
            <p className="text-4xl font-black text-slate-900 group-hover:text-amber-600 transition-colors">{stat.value}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;