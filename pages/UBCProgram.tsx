
import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Star,
  Shield,
  Gem,
  Award,
  Crown,
  CheckCircle2,
  Circle,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Zap,
  BookOpen,
  ArrowRight,
  Trophy
} from 'lucide-react';

// ===== UBC PROGRAM DATA =====

interface UBCCheckItem {
  id: string;
  text: string;
}

interface UBCLevelData {
  level: number;
  title: string;
  subtitle: string;
  targetPosition: string;
  incomeRange: string;
  phase: string;
  color: string;
  gradient: string;
  glow: string;
  icon: React.FC<any>;
  checkItems: UBCCheckItem[];
  modules: { category: string; items: string[] }[];
  routines: { freq: string; items: string[] }[];
}

const UBC_LEVELS: UBCLevelData[] = [
  {
    level: 1,
    title: 'Foundation',
    subtitle: 'รากฐาน',
    targetPosition: 'UBC → Super Star Elite',
    incomeRange: '500 - 15,000',
    phase: 'เรียนรู้เครื่องมือ → ขายได้ → มีรายได้',
    color: 'text-emerald-500',
    gradient: 'from-emerald-500 to-green-600',
    glow: 'shadow-emerald-500/20',
    icon: Star,
    checkItems: [
      { id: 'u1_1', text: 'ใช้ Unicorn Smart AI & Dashboard ทุกวัน' },
      { id: 'u1_2', text: 'เป็น Super Star Elite อย่างต่อเนื่อง' },
      { id: 'u1_3', text: 'ใช้สินค้าครบชุด U4 ทุกเดือน' },
      { id: 'u1_4', text: 'New Sponsor อย่างน้อย 1 Platinum/เดือน' },
      { id: 'u1_5', text: 'เรียนรู้ทุกฟังก์ชั่น UNICORN ACADEMY' },
      { id: 'u1_6', text: 'เข้าใจ 4 รู้ (บริษัท/สินค้า/แผนรายได้/5 WHY)' },
      { id: 'u1_7', text: 'ทำ STP/นำเสนอธุรกิจได้อย่างน้อย 1 ครั้ง' },
    ],
    modules: [
      { category: '4 รู้ (พื้นฐาน)', items: ['บริษัท ยูนิคอร์น โกลบอล ลิงค์', 'สินค้า U4 นวัตกรรม', 'แผนรายได้ 5 ช่องทาง', '5 WHY'] },
      { category: 'Mindset', items: ['4 ใจ (เปิด-เข้า-ตั้ง-ใส่ใจ)', 'ความเชื่อ 3 ชนิด'] },
      { category: 'เครื่องมือ', items: ['Dashboard', 'Unicorn Smart AI', 'Digital Name Card'] },
      { category: 'การขาย', items: ['เล่าเรื่องผลลัพธ์สินค้า', 'STP พื้นฐาน', 'ปิดการขายครั้งแรก'] },
    ],
    routines: [
      { freq: 'รายวัน', items: ['STP / Live', 'House Meeting', 'Online Meeting'] },
      { freq: 'รายสัปดาห์', items: ['Super Sunday', 'Business Start-Up'] },
      { freq: 'รายเดือน', items: ['Super Star Recognition'] },
    ],
  },
  {
    level: 2,
    title: 'Specialist',
    subtitle: 'ผู้เชี่ยวชาญ',
    targetPosition: 'Super Star Elite → Director',
    incomeRange: '15,000 - 50,000',
    phase: 'ใช้ระบบ → พัฒนาทักษะ → ทำงานต่อเนื่อง',
    color: 'text-blue-500',
    gradient: 'from-blue-500 to-indigo-600',
    glow: 'shadow-blue-500/20',
    icon: Shield,
    checkItems: [
      { id: 'u2_1', text: 'มี Personal Brand ชัดเจน (โปรไฟล์สมบูรณ์)' },
      { id: 'u2_2', text: 'โพสต์คอนเทนต์ 4 Pillars ≥ 3 ครั้ง/สัปดาห์' },
      { id: 'u2_3', text: 'ใช้ One Link & Digital Name Card' },
      { id: 'u2_4', text: 'มีรายได้ ≥ 15,000 บาท/เดือน ต่อเนื่อง' },
      { id: 'u2_5', text: 'มี Downline อย่างน้อย 3 คน' },
      { id: 'u2_6', text: 'วิเคราะห์ Wealth DNA ตนเองได้' },
      { id: 'u2_7', text: 'ใช้ AI Content Creator ร่างคอนเทนต์ได้' },
    ],
    modules: [
      { category: 'Mindset', items: ['Authentic Giver — ผู้ให้คุณค่า'] },
      { category: 'Wealth DNA', items: ['วิเคราะห์ธาตุ (ดิน น้ำ ลม ไฟ)', 'ออกแบบคอนเทนต์ตรงจริต'] },
      { category: 'Content', items: ['Educational', 'Promotional', 'Authenticity', 'Community'] },
      { category: 'การตลาด', items: ['Lead Generation', 'Short-Form Video', 'One Link Ecosystem'] },
    ],
    routines: [
      { freq: 'รายวัน', items: ['สร้างคอนเทนต์', 'ตอบแชท Lead'] },
      { freq: 'รายสัปดาห์', items: ['Product Training', 'Online Training'] },
      { freq: 'รายเดือน', items: ['Unicorn Take Off'] },
    ],
  },
  {
    level: 3,
    title: 'Strategic',
    subtitle: 'นักกลยุทธ์',
    targetPosition: 'Director → Diamond',
    incomeRange: '50,000 - 300,000',
    phase: 'มีทีม → สอนทีม → ลงพื้นที่ → โค้ชเป็น',
    color: 'text-violet-500',
    gradient: 'from-violet-500 to-purple-600',
    glow: 'shadow-violet-500/20',
    icon: Gem,
    checkItems: [
      { id: 'u3_1', text: 'มีทีม Super Star Elite อย่างน้อย 3 คน' },
      { id: 'u3_2', text: 'จัด STP/House Meeting ได้ด้วยตัวเอง' },
      { id: 'u3_3', text: 'สอนระบบ 4-5-6 ให้ทีมได้' },
      { id: 'u3_4', text: 'ใช้ CRM ติดตาม Lead อย่างเป็นระบบ' },
      { id: 'u3_5', text: 'มีรายได้ ≥ 50,000 บาท/เดือน' },
      { id: 'u3_6', text: 'ใช้เทคนิค Feel-Felt-Found ได้' },
      { id: 'u3_7', text: 'มี AI Chatbot บน LINE OA' },
    ],
    modules: [
      { category: 'Mindset', items: ['Consultative Selling (70/30)'] },
      { category: 'การขาย', items: ['Objection Handling (Feel-Felt-Found)', 'Lead Enrichment'] },
      { category: 'Team Building', items: ['พาทีมลงพื้นที่', 'Coaching หน้างาน', 'House Meeting'] },
      { category: 'การสอน', items: ['Train the Trainer', 'ถ่ายทอดระบบ 4-5-6'] },
    ],
    routines: [
      { freq: 'รายวัน', items: ['โค้ชทีม', 'ลงพื้นที่กับทีมใหม่'] },
      { freq: 'รายสัปดาห์', items: ['ประชุมทีม', 'ติดตาม KPIs'] },
      { freq: 'รายเดือน', items: ['President Talk'] },
      { freq: 'รายไตรมาส', items: ['Unicorn Camp'] },
    ],
  },
  {
    level: 4,
    title: 'Master',
    subtitle: 'ปรมาจารย์',
    targetPosition: 'Diamond → President/Crown',
    incomeRange: '300,000 - 3,000,000+',
    phase: 'องค์กรโต → ระบบทำซ้ำ → ผู้นำสร้างผู้นำ',
    color: 'text-amber-500',
    gradient: 'from-amber-400 to-amber-600',
    glow: 'shadow-amber-500/20',
    icon: Crown,
    checkItems: [
      { id: 'u4_1', text: 'มีทีม Director ขึ้นไป อย่างน้อย 3 คน' },
      { id: 'u4_2', text: 'สร้างระบบ Onboarding อัตโนมัติ' },
      { id: 'u4_3', text: 'เป็น Trainer ใน Unicorn Academy ได้' },
      { id: 'u4_4', text: 'องค์กรมีรายได้รวม ≥ 300,000 บาท/เดือน' },
      { id: 'u4_5', text: 'มี Crown/President candidate ในทีม' },
      { id: 'u4_6', text: 'ใช้ Workflow Automation (n8n/Make)' },
      { id: 'u4_7', text: 'มี ABCD Model ครบ 4 ด้าน' },
    ],
    modules: [
      { category: 'Mindset', items: ['Servant Leadership', 'ABCD Model'] },
      { category: 'ระบบ', items: ['System vs Skill Training', 'Onboarding Journey 30-90 วัน'] },
      { category: 'องค์กร', items: ['Duplication System', 'Performance Analytics'] },
      { category: 'Leadership', items: ['สร้างผู้นำรุ่นถัดไป', 'บริหารองค์กรใหญ่'] },
    ],
    routines: [
      { freq: 'รายวัน', items: ['บริหารทีม Leader', 'ทบทวนเป้าหมายองค์กร'] },
      { freq: 'รายสัปดาห์', items: ['ประชุม Leaders', 'วิเคราะห์ Performance'] },
      { freq: 'รายเดือน', items: ['President Talk', 'Strategic Planning'] },
      { freq: 'รายไตรมาส', items: ['Unicorn Camp', 'Way On Win'] },
    ],
  },
];

// ===== COMPONENT =====

const UBCProgram: React.FC = () => {
  const [expandedLevel, setExpandedLevel] = useState<number>(1);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('ubc_checkpoint');
    if (stored) {
      try { setCheckedItems(JSON.parse(stored)); } catch {}
    }
  }, []);

  // Save to localStorage
  const toggleCheck = (id: string) => {
    setCheckedItems(prev => {
      const updated = { ...prev, [id]: !prev[id] };
      localStorage.setItem('ubc_checkpoint', JSON.stringify(updated));
      return updated;
    });
  };

  const getProgress = (level: UBCLevelData): number => {
    const total = level.checkItems.length;
    const checked = level.checkItems.filter(item => checkedItems[item.id]).length;
    return total > 0 ? Math.round((checked / total) * 100) : 0;
  };

  const getOverallLevel = (): number => {
    for (let i = UBC_LEVELS.length - 1; i >= 0; i--) {
      if (getProgress(UBC_LEVELS[i]) === 100) return UBC_LEVELS[i].level + 1;
    }
    return 1;
  };

  const totalChecked = Object.values(checkedItems).filter(Boolean).length;
  const totalItems = UBC_LEVELS.reduce((acc, l) => acc + l.checkItems.length, 0);
  const overallProgress = Math.round((totalChecked / totalItems) * 100);

  return (
    <div className="space-y-6 pb-20 animate-fade-in px-2 lg:px-0">

      {/* ===== HEADER BANNER ===== */}
      <div className="bg-dark-gradient rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 lg:p-12 text-white relative overflow-hidden border border-white/10 shadow-2xl hover-shine">
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center lg:text-left">
            <div className="flex items-center gap-3 justify-center lg:justify-start">
              <GraduationCap size={28} className="text-amber-400" />
              <p className="text-xs font-black uppercase tracking-[0.3em] text-amber-500">Unicorn Academy</p>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tighter">
              โปรแกรมพัฒนา <span className="text-amber-400">UBC</span>
            </h1>
            <p className="text-indigo-100/60 text-sm md:text-base max-w-lg">
              เส้นทางการเรียนรู้ที่ปรึกษาการตลาดยูนิคอร์น 4 ระดับ — ติดตามความก้าวหน้าและประเมินตนเองได้ตลอดเวลา
            </p>
          </div>

          {/* Overall Progress Card */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 md:p-8 min-w-[240px] text-center shadow-2xl">
            <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">ความก้าวหน้ารวม</p>
            <div className="relative w-24 h-24 mx-auto mb-4">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                <circle cx="50" cy="50" r="42" fill="none" stroke="url(#progressGrad)" strokeWidth="8"
                  strokeLinecap="round" strokeDasharray={`${overallProgress * 2.64} 264`}
                  className="transition-all duration-1000" />
                <defs>
                  <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#ef4444" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-black text-white">{overallProgress}%</span>
              </div>
            </div>
            <p className="text-sm font-bold text-slate-400">
              ระดับปัจจุบัน: <span className="text-amber-500 font-black">UBC {Math.min(getOverallLevel(), 4)}</span>
            </p>
            <p className="text-xs text-slate-500 mt-1">{totalChecked}/{totalItems} checkpoint</p>
          </div>
        </div>
        <div className="absolute -bottom-20 -right-20 opacity-5">
          <GraduationCap size={400} />
        </div>
      </div>

      {/* ===== ROADMAP OVERVIEW ===== */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {UBC_LEVELS.map((level) => {
          const progress = getProgress(level);
          const isComplete = progress === 100;
          const IconComp = level.icon;
          return (
            <button
              key={level.level}
              onClick={() => setExpandedLevel(level.level)}
              className={`glass-card p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] text-left transition-all duration-500 group hover:-translate-y-1 hover:shadow-xl ${
                expandedLevel === level.level ? 'border-amber-500/50 shadow-xl shadow-amber-500/10' : ''
              }`}
            >
              <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-gradient-to-br ${level.gradient} flex items-center justify-center mb-3 group-hover:scale-110 group-hover:rotate-3 transition-all shadow-lg ${level.glow}`}>
                <IconComp size={20} className="text-white md:w-[24px] md:h-[24px]" />
              </div>
              <p className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-wider">UBC {level.level}</p>
              <h3 className="text-sm md:text-lg font-black text-slate-900 tracking-tight leading-tight">{level.title}</h3>
              <p className="text-[10px] md:text-xs text-slate-500 font-medium mb-3">{level.subtitle}</p>

              {/* Mini Progress Bar */}
              <div className="h-1.5 md:h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${level.gradient} transition-all duration-1000`}
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex justify-between items-center mt-1.5">
                <span className="text-[10px] md:text-xs font-bold text-slate-400">{progress}%</span>
                {isComplete && <CheckCircle2 size={14} className="text-emerald-500" />}
              </div>
            </button>
          );
        })}
      </div>

      {/* ===== EXPANDED LEVEL DETAIL ===== */}
      {UBC_LEVELS.map((level) => {
        if (level.level !== expandedLevel) return null;
        const progress = getProgress(level);
        const IconComp = level.icon;

        return (
          <div key={level.level} className="animate-fade-in space-y-6">

            {/* Level Header */}
            <div className={`glass-card rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 border-l-4`} style={{ borderLeftColor: level.color.replace('text-', '').includes('emerald') ? '#10b981' : level.color.replace('text-', '').includes('blue') ? '#3b82f6' : level.color.replace('text-', '').includes('violet') ? '#8b5cf6' : '#f59e0b' }}>
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex items-center gap-4 md:gap-6">
                  <div className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-[2rem] bg-gradient-to-br ${level.gradient} flex items-center justify-center shadow-xl ${level.glow}`}>
                    <IconComp size={32} className="text-white md:w-[40px] md:h-[40px]" />
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">ระดับที่ {level.level}</p>
                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                      UBC {level.level} — {level.title}
                    </h2>
                    <p className="text-sm text-slate-500 font-medium mt-1">{level.phase}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-wider">ตำแหน่ง</p>
                    <p className={`text-sm font-black ${level.color}`}>{level.targetPosition}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-wider">รายได้/เดือน</p>
                    <p className="text-sm font-black text-amber-600">{level.incomeRange} ฿</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">

              {/* LEFT: Checkpoint Checklist */}
              <div className="glass-card rounded-[2rem] md:rounded-[3rem] p-6 md:p-8 shadow-xl">
                <div className="flex items-center gap-3 mb-6">
                  <Target size={20} className="text-amber-500" />
                  <h3 className="text-lg md:text-xl font-black text-slate-900 tracking-tight">Checkpoint ประเมินตนเอง</h3>
                </div>

                {/* Progress */}
                <div className="bg-slate-50 rounded-2xl p-4 mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-black text-slate-500 uppercase tracking-wider">ความก้าวหน้า</span>
                    <span className={`text-sm font-black ${progress === 100 ? 'text-emerald-500' : level.color}`}>
                      {progress}%
                    </span>
                  </div>
                  <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${level.gradient} transition-all duration-700`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-400 font-medium mt-2">
                    {level.checkItems.filter(i => checkedItems[i.id]).length} / {level.checkItems.length} สำเร็จ
                    {progress === 100 && ' 🎉'}
                  </p>
                </div>

                {/* Checklist Items */}
                <div className="space-y-2">
                  {level.checkItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => toggleCheck(item.id)}
                      className={`w-full flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-xl md:rounded-2xl transition-all duration-300 text-left group ${
                        checkedItems[item.id]
                          ? 'bg-emerald-50 border border-emerald-200'
                          : 'bg-white border border-slate-100 hover:border-amber-300 hover:bg-amber-50/50'
                      }`}
                    >
                      <div className={`w-6 h-6 md:w-7 md:h-7 rounded-lg flex items-center justify-center shrink-0 transition-all duration-300 ${
                        checkedItems[item.id]
                          ? 'bg-emerald-500 text-white scale-110'
                          : 'bg-slate-100 text-slate-300 group-hover:bg-amber-100 group-hover:text-amber-500'
                      }`}>
                        {checkedItems[item.id] ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                      </div>
                      <span className={`text-sm font-semibold transition-colors ${
                        checkedItems[item.id] ? 'text-emerald-700 line-through opacity-70' : 'text-slate-700'
                      }`}>
                        {item.text}
                      </span>
                    </button>
                  ))}
                </div>

                {progress === 100 && (
                  <div className="mt-6 bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-2xl p-4 text-center animate-fade-in">
                    <Trophy size={24} className="text-amber-500 mx-auto mb-2" />
                    <p className="text-sm font-black text-emerald-700">
                      ยินดีด้วย! คุณผ่าน UBC {level.level} แล้ว! 🎉
                    </p>
                    {level.level < 4 && (
                      <button
                        onClick={() => setExpandedLevel(level.level + 1)}
                        className="mt-2 text-xs font-bold text-amber-600 hover:text-amber-500 inline-flex items-center gap-1"
                      >
                        ไปยัง UBC {level.level + 1} <ArrowRight size={12} />
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* RIGHT: Modules + Routines */}
              <div className="space-y-6">
                {/* Learning Modules */}
                <div className="glass-card rounded-[2rem] md:rounded-[3rem] p-6 md:p-8 shadow-xl">
                  <div className="flex items-center gap-3 mb-6">
                    <BookOpen size={20} className="text-amber-500" />
                    <h3 className="text-lg md:text-xl font-black text-slate-900 tracking-tight">หมวดเรียนรู้</h3>
                  </div>
                  <div className="space-y-4">
                    {level.modules.map((mod, i) => (
                      <div key={i} className="bg-slate-50 rounded-2xl p-4">
                        <p className="text-xs font-black text-slate-400 uppercase tracking-wider mb-2">{mod.category}</p>
                        <div className="flex flex-wrap gap-2">
                          {mod.items.map((item, j) => (
                            <span key={j} className="px-3 py-1.5 bg-white border border-slate-200 rounded-full text-xs font-semibold text-slate-600 hover:border-amber-300 hover:text-amber-600 transition-colors cursor-default">
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Routines */}
                <div className="glass-card rounded-[2rem] md:rounded-[3rem] p-6 md:p-8 shadow-xl">
                  <div className="flex items-center gap-3 mb-6">
                    <Zap size={20} className="text-amber-500" />
                    <h3 className="text-lg md:text-xl font-black text-slate-900 tracking-tight">งานประจำ</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {level.routines.map((routine, i) => (
                      <div key={i} className={`bg-slate-50 rounded-2xl p-4 border-l-3 ${
                        i === 0 ? 'border-l-emerald-400' : i === 1 ? 'border-l-blue-400' : i === 2 ? 'border-l-violet-400' : 'border-l-amber-400'
                      }`}>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">{routine.freq}</p>
                        <ul className="space-y-1">
                          {routine.items.map((item, j) => (
                            <li key={j} className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                              <div className="w-1 h-1 rounded-full bg-slate-300"></div>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default UBCProgram;
