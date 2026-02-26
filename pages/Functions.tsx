import React from 'react';
import { AppView, User } from '../types';
import {
  Plus,
  X,
  Save,
  Clock,
  Users,
  MapPin,
  ExternalLink,
  Calendar as CalendarIcon
} from 'lucide-react';

interface Activity {
  id: string;
  title: string;
  type: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'SPECIAL';
  location: string;
  attendees: string;
  link: string;
  date?: string;
  time?: string;
}

interface FunctionsProps {
  onNavigate: (view: AppView) => void;
  currentUser: User | null;
}

const Functions: React.FC<FunctionsProps> = ({ currentUser }) => {
  const [activities, setActivities] = React.useState<Activity[]>([]);
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [newActivity, setNewActivity] = React.useState<Partial<Activity>>({
    type: 'DAILY',
    location: 'Zoom/Live',
    attendees: '10-100+'
  });

  // Mock initial data - will be replaced by Supabase
  React.useEffect(() => {
    const defaultActivities: Activity[] = [
      { id: '1', title: 'Morning Call', type: 'DAILY', location: 'Zoom', attendees: 'Team', link: '#' },
      { id: '2', title: 'Weekly Workshop', type: 'WEEKLY', location: 'Office', attendees: '100+', link: '#' },
      { id: '3', title: 'Monthly Recognition', type: 'MONTHLY', location: 'Hotel', attendees: '500+', link: '#' },
      { id: '4', title: 'Grand Convention', type: 'QUARTERLY', location: 'Convention Center', attendees: '1000+', link: '#' },
    ];
    setActivities(defaultActivities);
  }, []);

  const handleAddActivity = () => {
    if (newActivity.title) {
      const activity: Activity = {
        id: Math.random().toString(36).substr(2, 9),
        title: newActivity.title,
        type: newActivity.type as any,
        location: newActivity.location || '',
        attendees: newActivity.attendees || '',
        link: newActivity.link || '#',
        time: newActivity.time
      };
      setActivities([...activities, activity]);
      setShowAddModal(false);
      setNewActivity({ type: 'DAILY', location: 'Zoom/Live', attendees: '10-100+' });
    }
  };

  const activityGroups = [
    { period: 'DAILY', label: 'กิจกรรมรายวัน', color: 'bg-blue-600' },
    { period: 'WEEKLY', label: 'กิจกรรมรายสัปดาห์', color: 'bg-amber-500' },
    { period: 'MONTHLY', label: 'กิจกรรมรายเดือน', color: 'bg-purple-600' },
    { period: 'QUARTERLY', label: 'กิจกรรมรายไตรมาส', color: 'bg-indigo-900' },
  ];

  return (
    <div className="space-y-12 animate-fade-in pb-20 px-2 lg:px-0 relative">
      <section className="text-center space-y-3 md:space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 md:px-5 md:py-2 bg-amber-100 rounded-full border border-amber-200 mb-2">
          <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-amber-500 rounded-full animate-pulse" />
          <span className="text-[10px] md:text-xs-plus font-black uppercase tracking-[0.2em] text-amber-900">System Strategy</span>
        </div>
        <div className="flex flex-col items-center gap-4">
          <h2 className="text-3xl md:text-5xl lg:text-7xl font-black text-slate-900 tracking-tighter italic">Function <span className="text-amber-500">to Function</span></h2>
          {currentUser?.isAdmin && (
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-slate-950 text-white rounded-2xl font-black text-sm hover:bg-amber-500 transition-all shadow-xl active:scale-95 group"
            >
              <Plus size={20} className="group-hover:rotate-90 transition-transform" />
              เพิ่มกิจกรรมใหม่ (ADMIN)
            </button>
          )}
        </div>
        <p className="text-slate-500 text-base md:text-xl font-bold max-w-2xl mx-auto leading-relaxed">การขับเคลื่อนคนผ่านงานกิจกรรม เพื่อสร้างการเติบโตอย่างเป็นระบบ</p>
      </section>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {activityGroups.map((group) => (
          <div key={group.period} className="glass-card rounded-[3rem] border border-white/40 shadow-sm hover:shadow-2xl transition-all duration-500 group overflow-hidden flex flex-col hover:-translate-y-2">
            <div className={`p-6 md:p-8 text-center relative overflow-hidden ${group.color} text-white`}>
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
              <h3 className="font-black text-2xl md:text-3xl tracking-tighter italic relative z-10">{group.period}</h3>
              <p className="text-[10px] md:text-xs-plus font-black uppercase tracking-[0.1em] md:tracking-[0.2em] opacity-80 mt-1 relative z-10">
                {group.label}
              </p>
            </div>

            <div className="p-6 md:p-8 flex-1 space-y-5 md:space-y-6">
              {activities.filter(a => a.type === group.period).map((item) => (
                <div key={item.id} className="flex items-start gap-3 md:gap-4 group/item cursor-pointer">
                  <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-slate-200 mt-2 md:mt-2.5 group-hover/item:bg-amber-500 group-hover/item:scale-150 transition-all duration-300"></div>
                  <div className="flex-1">
                    <p className="text-sm md:text-base font-black text-slate-800 group-hover/item:text-amber-600 transition-colors leading-snug">{item.title}</p>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-[10px] text-slate-400 font-black uppercase tracking-widest opacity-60">
                      <span className="flex items-center gap-1.5"><Clock size={12} /> {item.time || 'Zoom/Live'}</span>
                      <span className="flex items-center gap-1.5"><Users size={12} /> {item.attendees}</span>
                    </div>
                  </div>
                </div>
              ))}
              {activities.filter(a => a.type === group.period).length === 0 && (
                <p className="text-center text-slate-300 text-xs font-bold italic py-4">ยังไม่มีกิจกรรม</p>
              )}
            </div>

            <div className="p-5 md:p-6 border-t border-slate-50">
              <button
                aria-label={`ดูปฏิทินงานสำหรับกิจกรรม ${group.label}`}
                className="w-full py-3 md:py-4 bg-slate-50 hover:bg-slate-900 hover:text-white rounded-xl md:rounded-2xl text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] text-slate-600 flex items-center justify-center gap-2 md:gap-3 transition-all active:scale-95"
              >
                ดูปฏิทินงาน <ExternalLink size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Admin Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
          <div className="relative bg-white rounded-[2.5rem] w-full max-w-lg p-8 shadow-2xl animate-scale-in border border-white">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                <CalendarIcon className="text-amber-500" /> เพิ่มกิจกรรมใหม่
              </h3>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 mb-1.5 ml-2 tracking-widest">หัวข้อกิจกรรม</label>
                <input
                  type="text"
                  placeholder="เช่น Morning Call มหาเศรษฐี"
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all font-bold"
                  value={newActivity.title || ''}
                  onChange={(e) => setNewActivity({ ...newActivity, title: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-1.5 ml-2 tracking-widest">ประเภท</label>
                  <select
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all font-bold"
                    value={newActivity.type}
                    onChange={(e) => setNewActivity({ ...newActivity, type: e.target.value as any })}
                  >
                    <option value="DAILY">Daily (รายวัน)</option>
                    <option value="WEEKLY">Weekly (รายสัปดาห์)</option>
                    <option value="MONTHLY">Monthly (รายเดือน)</option>
                    <option value="QUARTERLY">Quarterly (รายไตรมาส)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-1.5 ml-2 tracking-widest">เวลา/ลิ้งค์</label>
                  <input
                    type="text"
                    placeholder="08:00 Zoom"
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all font-bold"
                    value={newActivity.time || ''}
                    onChange={(e) => setNewActivity({ ...newActivity, time: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 mb-1.5 ml-2 tracking-widest">สถานที่ / จำนวนคน</label>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Zoom / Office"
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold"
                    value={newActivity.location || ''}
                    onChange={(e) => setNewActivity({ ...newActivity, location: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="100+ คน"
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold"
                    value={newActivity.attendees || ''}
                    onChange={(e) => setNewActivity({ ...newActivity, attendees: e.target.value })}
                  />
                </div>
              </div>

              <button
                onClick={handleAddActivity}
                className="w-full py-5 bg-slate-950 text-white rounded-[1.8rem] font-black text-lg flex items-center justify-center gap-3 mt-4 hover:bg-amber-500 transition-all shadow-xl shadow-slate-900/20 active:scale-95 group"
              >
                <Save size={22} className="group-hover:scale-110 transition-transform" />
                บันทึกลงปฏิทินระบบ
              </button>
            </div>
          </div>
        </div>
      )}

      <section className="bg-dark-gradient rounded-[2.5rem] md:rounded-[4rem] p-8 md:p-12 lg:p-20 text-white relative overflow-hidden border border-white/10 shadow-3xl group hover-shine">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

        <div className="flex flex-col md:flex-row gap-10 md:gap-16 items-center relative z-10">
          <div className="md:w-1/2 space-y-6 md:space-y-8">
            <div className="inline-flex items-center gap-2 md:gap-3 px-4 py-1.5 md:px-5 md:py-2 bg-white/5 backdrop-blur-md rounded-full border border-white/10">
              <Users className="text-amber-400 w-4 h-4 md:w-[16px] md:h-[16px]" />
              <span className="text-[10px] md:text-xs-plus font-black uppercase tracking-[0.2em] text-amber-200">The Power of Crowd</span>
            </div>
            <h3 className="text-3xl md:text-4xl lg:text-5xl font-black italic tracking-tight leading-tight">ทำไมต้อง <span className="text-amber-400 underline decoration-amber-400/30 underline-offset-8">Function?</span></h3>
            <p className="text-indigo-100/70 text-base md:text-lg font-medium leading-relaxed">
              งานกิจกรรมไม่ได้มีไว้เพื่อให้ความรู้อย่างเดียว แต่เป็นเครื่องมือในการ <span className="text-white font-black">"เคลื่อนคน"</span> จากผู้ที่สนใจ
              กลายเป็นผู้ที่เข้าใจ และพัฒนาไปสู่การเป็นผู้นำ
            </p>
            <div className="flex flex-wrap gap-8 pt-4">
              <div className="flex items-center gap-3 group/stat">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center group-hover/stat:bg-amber-500 transition-colors duration-500 shadow-xl">
                  <Users size={24} className="text-amber-400 group-hover/stat:text-white transition-colors" />
                </div>
                <div>
                  <p className="text-xs-plus font-black text-amber-200 opacity-60 uppercase tracking-widest">Community</p>
                  <p className="text-lg font-black italic tracking-tight">รวมตัวคนมีฝัน</p>
                </div>
              </div>
              <div className="flex items-center gap-3 group/stat">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center group-hover/stat:bg-blue-500 transition-colors duration-500 shadow-xl">
                  <MapPin size={24} className="text-blue-400 group-hover/stat:text-white transition-colors" />
                </div>
                <div>
                  <p className="text-xs-plus font-black text-blue-200 opacity-60 uppercase tracking-widest">Environment</p>
                  <p className="text-lg font-black italic tracking-tight">พลังของบรรยากาศ</p>
                </div>
              </div>
            </div>
          </div>

          <div className="md:w-1/2 w-full grid grid-cols-2 gap-4 md:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="group/img relative overflow-hidden rounded-2xl md:rounded-[2.5rem] h-32 md:h-44 shadow-2xl border border-white/5">
                <img
                  src={`https://picsum.photos/seed/unicorn${i}/600/400`}
                  className="w-full h-full object-cover transition-all duration-1000 grayscale group-hover/img:grayscale-0 group-hover/img:scale-110"
                  alt="Unicorn Event"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity duration-500" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Functions;
