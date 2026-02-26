import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Star,
  Shield,
  Gem,
  Crown,
  CheckCircle2,
  Circle,
  Target,
  Zap,
  BookOpen,
  ArrowRight,
  Trophy,
  BarChart2,
  Target as TargetIcon,
  DollarSign,
  BrainCircuit,
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
  kpis: { metric: string; target: string }[];
  skillsToLearn: { category: string; skills: string[] }[];
  incomeDetails: { source: string; description: string; highlight?: boolean }[];
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
      { category: '4 รู้ (พื้นฐาน)', items: ['บริษัท ยูนิคอร์น โกลบอล ลิงค์', 'สินค้า U4 นวัตกรรม', 'แผนรายได้ 8 ช่องทาง', '5 WHY'] },
      { category: 'Mindset', items: ['4 ใจ (เปิด-เข้า-ตั้ง-ใส่ใจ)', 'ความเชื่อ 3 ชนิด'] },
      { category: 'เครื่องมือ', items: ['Dashboard', 'Unicorn Smart AI', 'Digital Name Card'] },
      { category: 'การขาย', items: ['เล่าเรื่องผลลัพธ์สินค้า', 'STP พื้นฐาน', 'ปิดการขายครั้งแรก'] },
    ],
    routines: [
      { freq: 'รายวัน', items: ['STP / Live', 'House Meeting', 'Online Meeting'] },
      { freq: 'รายสัปดาห์', items: ['Super Sunday', 'Business Start-Up'] },
      { freq: 'รายเดือน', items: ['Super Star Recognition'] },
    ],
    kpis: [
      { metric: 'แนะนำตรง G1 ซ้าย', target: '3 คน (Platinum ครบจะได้ SSE)' },
      { metric: 'แนะนำตรง G1 ขวา', target: '3 คน (Platinum ครบจะได้ SSE)' },
      { metric: 'รายได้ Balance Team/วัน', target: 'สูงสุด 60,000 บาท/วัน (SSE)' },
      { metric: 'รายได้ Balance Team/เดือน', target: 'สูงสุด 1,800,000 บาท/เดือน (SSE)' },
      { metric: 'New Sponsor Platinum', target: 'อย่างน้อย 1 รหัส/เดือน' },
      { metric: 'PV สินค้าส่วนตัว', target: 'สะสมครบ 2,000 PV' },
    ],
    skillsToLearn: [
      {
        category: '📚 ความรู้พื้นฐาน (4 รู้)',
        skills: ['วิสัยทัศน์บริษัท', 'สินค้า U4 นวัตกรรม', 'คำนวณแผนรายได้ได้', 'ตอบ 5 WHY ได้คล่อง'],
      },
      {
        category: '💬 ทักษะการสื่อสาร',
        skills: ['Product Result Storytelling', 'เล่าเรื่องสินค้าแบบไม่ขาย', 'STP พื้นฐาน', 'Digital Compliance (PDPA/อย.)'],
      },
      {
        category: '🤖 เครื่องมือดิจิทัล',
        skills: ['Unicorn Dashboard Analytics', 'Unicorn Smart AI (น้องยูนิ)', 'Digital Name Card', 'AI Compliance ตรวจโฆษณา'],
      },
    ],
    incomeDetails: [
      { source: '💼 โบนัสขายปลีก (30-50%)', description: 'กำไร 30-50% ต่อกล่อง เช่น สินค้า 2,950 บาท ซื้อ 1,250 บาท กำไร 500 บาท/กล่อง', highlight: true },
      { source: '⚡ Fast Start Bonus (100-120%)', description: 'คำนวณรายวันตามแพ็กเกจ: Silver รับ G1=100%, Gold รับ G1+G2, Platinum รับ G1+G2+G3', highlight: true },
      { source: '⚖️ Balance Team Bonus (50%)', description: 'จ่ายตามคะแนนทีมข้างอ่อน เพดาน Super Star Elite สูงสุด 60,000 บาท/วัน' },
      { source: '📦 Dropship Bonus (10%)', description: 'รับโบนัสตามจำนวนคนและแพ็กเกจ เช่น Platinum รับ 200 บาท/คน ไม่ต้องสต็อกสินค้า' },
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
      { id: 'u2_5', text: 'ช่วยสมาชิกใหม่สมัคร Platinum 1 ราย/เดือน' },
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
    kpis: [
      { metric: 'คอนเทนต์ที่โพสต์', target: '≥ 3 ครั้ง/สัปดาห์' },
      { metric: 'New Sponsor Platinum', target: '1 รหัส/เดือน (ต่อเนื่อง)' },
      { metric: 'รายได้รวม/เดือน', target: '≥ 15,000 บาท' },
      { metric: 'Matching Bonus ลึกสุด', target: '5 ชั้น (G1-G5 สำหรับ SSE)' },
      { metric: 'Uni-Level Bonus ลึกสุด', target: '30 ชั้น (สำหรับ U3)' },
      { metric: 'Mentorship', target: 'เป็นพี่เลี้ยงพาคนใหม่เรียน UBC 1' },
    ],
    skillsToLearn: [
      {
        category: '🎨 Personal Branding',
        skills: ['Unicorn Wealth DNA (วิเคราะห์ดิน-น้ำ-ลม-ไฟ)', '4 Content Pillars', 'Short-Form Video (TikTok/Reels)', 'Professional Identity'],
      },
      {
        category: '📡 Digital Marketing',
        skills: ['Lead Generation ผ่าน Social', 'One Link Ecosystem', 'Tracking & Analytics Dashboard', 'AI Content Creator'],
      },
      {
        category: '🤝 Professional Sponsoring',
        skills: ['กฎการฟัง 70/30 (Consultative Approach)', 'เทคนิคการแชร์ Storytelling ผลลัพธ์สินค้า', 'New Sponsor Mastery', 'Link-Share-Success System'],
      },
    ],
    incomeDetails: [
      { source: '⚖️ Balance Team Bonus (รักษาเพดาน)', description: 'รับต่อเนื่องตามยอดทีมข้างอ่อน รักษาเพดาน SSE ที่ 60,000 บาท/วันให้เสถียร', highlight: true },
      { source: '🔗 Matching Bonus (10-50%)', description: 'ระดับ SSE จัดเต็มรับ Matching G1-G5 สูงสุด 50% พร้อมระบบ Roll Up & Compression ดึงรายได้ชั้นลึกขึ้นมาจ่ายแทนตำแหน่งว่าง', highlight: true },
      { source: '🌐 Uni-Level Bonus (โบนัสผู้บริโภค)', description: 'จ่ายลึกสูงสุด 30 ชั้น (แพ็กเกจ U3 รับ 30 บาท/รหัส) คำนวณจากทั้งสายเลือดและสายร่วม (Placement)' },
      { source: '⭐️ สะสมดาว (Travel Reward)', description: 'แพ็กเกจ U1-U3 จะได้รับดาวสะสมเพื่อแลกรับสิทธิ์ท่องเที่ยวฟรีภายในประเทศ' },
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
      { id: 'u3_1', text: 'รักษาคุณสมบัติ 5 Core Leader สม่ำเสมอ' },
      { id: 'u3_2', text: 'พาทีมงานเข้า UBC 1 และ UBC 2' },
      { id: 'u3_3', text: 'จัดกลุ่ม AAR หลังแพลนเนอร์ทีมได้' },
      { id: 'u3_4', text: 'ใช้ Data Analytics วิเคราะห์ทีมงานได้' },
      { id: 'u3_5', text: 'มีรายได้ ≥ 50,000 บาท/เดือน (เสถียร)' },
      { id: 'u3_6', text: 'อธิบายการใช้ Roll Up & Compression ได้' },
      { id: 'u3_7', text: 'ติดตั้งและใช้ AI Chatbot บน LINE OA' },
    ],
    modules: [
      { category: 'Mindset', items: ['Consultative Selling (70/30)'] },
      { category: 'การขาย', items: ['Objection Handling (Feel-Felt-Found)', 'Lead Enrichment'] },
      { category: 'Team Building', items: ['พาทีมลงพื้นที่', 'Coaching หน้างาน', 'House Meeting'] },
      { category: 'การสอน', items: ['Train the Trainer', 'ถ่ายทอดระบบ 4-5-6'] },
    ],
    routines: [
      { freq: 'รายวัน', items: ['โค้ชทีม', 'ลงพื้นที่กับทีมใหม่'] },
      { freq: 'รายสัปดาห์', items: ['ประชุมทีม AAR', 'ติดตาม KPIs Data Analytics'] },
      { freq: 'รายเดือน', items: ['President Talk'] },
      { freq: 'รายไตรมาส', items: ['Unicorn Camp'] },
    ],
    kpis: [
      { metric: 'ตำแหน่งเป้าหมาย', target: '1Star-3Star Director → Diamond' },
      { metric: 'Balance Team (ข้างอ่อน)', target: '100,000 - 300,000 PV (เงื่อนไข Diamond)' },
      { metric: 'สร้างผู้นำ L/R', target: 'สร้าง 1 Director ในสายงานฝั่ง L และ R' },
      { metric: 'ทีม Super Star Elite', target: '≥ 5 Core Leader (รักษายอดตัวต้นแบบ)' },
      { metric: 'รายได้องค์กร/เดือน', target: '15,000 - 50,000 บาท ขึ้นไป (Director Zone)' },
      { metric: 'AAR Session', target: 'จัดทุกครั้งหลัง League Meeting' },
    ],
    skillsToLearn: [
      {
        category: '🎓 Train the Trainer',
        skills: ['สอนคู่มือ UBC 1-2 เป็นมาตรฐานเดียวกัน', 'AAR Process (After Action Review: ทำอะไร/ผลลัพธ์/เรียนรู้)', 'ABCD Model (Attitude-Belief-Commitment-Discipline)', 'ถ่ายทอดระบบ 4-5-6'],
      },
      {
        category: '💡 Advanced Sales & Leadership',
        skills: ['Psychology of Leadership', 'Feel-Felt-Found Technique พิชิตข้อโต้แย้ง', 'Lead Enrichment & สปอนเซอร์ระดับสูง', 'High Touch Development'],
      },
      {
        category: '🤖 System & AI Integration',
        skills: ['ติดตั้ง Agent AI บน LINE OA', 'Data Analytics ค้นหาดาวรุ่ง (Core Leader)', 'UBC Journey Management', 'Single Customer View CRM เพื่อคุมทีม'],
      },
    ],
    incomeDetails: [
      { source: '💎 Global Bonus 1% (Diamond)', description: 'รับส่วนแบ่งยอดขายทั่วโลก 1% (All Sales) เมื่อสร้าง 1 Director L/R และมีข้างอ่อน 100,000-300,000 PV', highlight: true },
      { source: '⚖️ Balance Team Bonus', description: 'รับเพดานรายได้ที่ขยายตามตำแหน่ง Director Zone ขึ้นไป' },
      { source: '🔗 Matching Bonus (เต็มสูบ 5 ชั้น)', description: 'ดึงรายได้จากฐานกว้างและลึกที่สุดด้วย Roll Up & Compression คุมทีมลึก 5 ชั้น G1-G5', highlight: true },
      { source: '🌐 Uni-Level Bonus (เครือข่ายลึก)', description: 'รายได้มหาศาลจากเครือข่ายผู้บริโภค 10-30 ชั้น (ตัวอย่าง: ชั้นที่ 10 มี 1,024 คน รับ 30,720 บาท หากเต็ม 30 ชั้นทวีคูณ)' },
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
      { id: 'u4_1', text: 'คนใหม่เข้าระบบได้เองผ่าน Workflow Automation' },
      { id: 'u4_2', text: 'สร้างระบบรับขวัญ Onboarding 30-90 วัน ไร้รอยต่อ' },
      { id: 'u4_3', text: 'มีรุ่นใหม่สอน UBC 1-3 แทนได้ (Skill Transfer)' },
      { id: 'u4_4', text: 'องค์กรมีชื่อเสียงเป็น "ทีมการตลาดสีขาว"' },
      { id: 'u4_5', text: 'จัดการ Digital Workshop/Hybrid Training ได้' },
      { id: 'u4_6', text: 'สร้าง AI Corporate Memory ฐานข้อมูลวิทยายุทธ' },
      { id: 'u4_7', text: 'ยึดมั่น Servant Leadership และจรรยาบรรณ' },
    ],
    modules: [
      { category: 'Mindset', items: ['Servant Leadership', 'ABCD Model (Master)'] },
      { category: 'ระบบ', items: ['System vs Skill Training', 'Event & Journey Architect'] },
      { category: 'องค์กร', items: ['Duplication System', 'Performance Analytics ค้นหาดาวรุ่ง'] },
      { category: 'Leadership', items: ['สร้างระบบนิเวศการเรียนรู้', 'Professional Partner Image'] },
    ],
    routines: [
      { freq: 'รายวัน', items: ['บริหารทีม Leader หลัก', 'รักษามาตรฐานระบบ 4-5-6 ให้บริสุทธิ์'] },
      { freq: 'รายสัปดาห์', items: ['Strategic Alignment กับองค์กร', 'วิเคราะห์ Performance หา Super Star'] },
      { freq: 'รายเดือน', items: ['Recognition System (งานเชิดชูเกียรติ)', 'Strategic Planning'] },
      { freq: 'รายไตรมาส', items: ['จัด Digital Workshop Hybrid', 'Unicorn Camp'] },
    ],
    kpis: [
      { metric: 'ตำแหน่งเป้าหมายสูงสุด', target: 'President / Crown (ขยายสู่ระดับสากล)' },
      { metric: 'Balance Team (ข้างอ่อน)', target: '400,000 - 3,000,000 PV (ประเมินตามตำแหน่ง)' },
      { metric: 'สร้างผู้นำ L/R (President)', target: 'สร้าง 2 Directors L/R' },
      { metric: 'สร้างผู้นำ L/R (Crown)', target: 'สร้าง 3 Directors L/R' },
      { metric: 'ระบบ Automation', target: 'ครอบคลุม Onboarding 100%' },
      { metric: 'ทีมโค้ชรุ่นใหม่', target: 'วิทยากรรับเชิญใน Academy (Skill Transfer สมบูรณ์)' },
    ],
    skillsToLearn: [
      {
        category: '🏛️ System Architecture',
        skills: ['ออกแบบเส้นทางความสำเร็จ (Journey Architect)', 'สร้าง Onboarding Roadmap 30-90 วัน', 'สร้างระบบ Recognition ถอดบทเรียนคนเก่ง', 'System vs Skill Training'],
      },
      {
        category: '🔮 Advanced Agentic AI',
        skills: ['Workflow Automation (n8n/Make/Zapier)', 'สร้าง AI Corporate Memory ประหยัดเวลาตอบ 80%', 'Performance Analytics Dashboard ขั้นสูง', 'Smart Operations เพื่อ Scale องค์กร'],
      },
      {
        category: '👑 Transformational Leadership',
        skills: ['Servant Leadership (สนับสนุนให้คนอื่นสำเร็จก่อน)', 'รักษาวินัยระบบ 4-5-6 รุ่นต่อรุ่น', 'การสื่อสาร Strategic Alignment วิสัยทัศน์บริษัท', 'สร้าง Learning Community Ecosystem'],
      },
    ],
    incomeDetails: [
      { source: '👑 Global Bonus 3% (President)', description: 'รับส่วนแบ่ง 1% + 2% (รวม 3%) เมื่อสร้าง 2 Directors L/R และข้างอ่อน 400,000-800,000 PV', highlight: true },
      { source: '👑 Global Bonus 6% (Crown)', description: 'รับส่วนแบ่ง 1% + 2% + 3% (รวม 6%) เมื่อสร้าง 3 Directors L/R และข้างอ่อน 1M-3M PV', highlight: true },
      { source: '⚖️ Balance & Matching (ไร้ขีดจำกัด)', description: 'รับรายได้ Passive เต็มเพดานสูงสุดของบริษัทจากระบบ Roll Up และเครือข่ายสมบูรณ์แบบ' },
      { source: '✈️ Travel Reward (รางวัลชีวิต)', description: 'ได้สิทธิรับรางวัลท่องเที่ยวและสัมผัสประสบการณ์พิเศษทั้งในและต่างประเทศระดับ VVIP', highlight: true },
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
      try { setCheckedItems(JSON.parse(stored)); } catch { }
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
              เส้นทางการเรียนรู้ที่ปรึกษาการตลาดยูนิคอร์น 4 ระดับ — ประเมินผลลัพธ์เพื่อพิชิตเป้าหมายรายได้และตำแหน่งธุรกิจแบบ Step-by-Step
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
              className={`glass-card p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] text-left transition-all duration-500 group hover:-translate-y-1 hover:shadow-xl flex flex-col items-start ${expandedLevel === level.level ? 'border-amber-500/50 shadow-xl shadow-amber-500/10' : ''
                }`}
            >
              <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-gradient-to-br ${level.gradient} flex items-center justify-center mb-3 group-hover:scale-110 group-hover:rotate-3 transition-all shadow-lg ${level.glow}`}>
                <IconComp size={20} className="text-white md:w-[24px] md:h-[24px]" />
              </div>
              <p className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-wider">UBC {level.level}</p>
              <h3 className="text-sm md:text-lg font-black text-slate-900 tracking-tight leading-tight">{level.title}</h3>
              <p className="text-[10px] md:text-xs text-slate-500 font-medium mb-3 line-clamp-2 md:line-clamp-none flex-grow">{level.subtitle}</p>

              {/* Mini Progress Bar */}
              <div className="w-full mt-auto">
                <div className="h-1.5 md:h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${level.gradient} transition-all duration-1000`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="flex justify-between items-center mt-1.5 w-full">
                  <span className="text-[10px] md:text-xs font-bold text-slate-400">{progress}%</span>
                  {isComplete && <CheckCircle2 size={14} className="text-emerald-500" />}
                </div>
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

            <div className="grid lg:grid-cols-12 gap-6">

              {/* ===== LEFT COLUMN: Checklists & KPIs (7 cols) ===== */}
              <div className="lg:col-span-7 space-y-6">

                {/* 1. Checkpoint Checklist */}
                <div className="glass-card rounded-[2rem] md:rounded-[3rem] p-6 md:p-8 shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-100/50 to-transparent rounded-bl-full -z-10 blur-xl"></div>

                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <Target size={22} className="text-amber-500" />
                      <h3 className="text-lg md:text-xl font-black text-slate-900 tracking-tight">Checkpoint ประเมินผล</h3>
                    </div>
                    {progress === 100 && (
                      <span className="bg-emerald-100 text-emerald-700 font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                        <CheckCircle2 size={14} /> Completed
                      </span>
                    )}
                  </div>

                  {/* Checklist Items */}
                  <div className="space-y-2.5">
                    {level.checkItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => toggleCheck(item.id)}
                        className={`w-full flex items-start gap-4 p-4 rounded-2xl transition-all duration-300 text-left group ${checkedItems[item.id]
                            ? 'bg-gradient-to-r from-emerald-50 to-white border border-emerald-200 shadow-sm'
                            : 'bg-white border border-slate-200 hover:border-amber-300 hover:shadow-md hover:bg-amber-50/10 hover:-translate-y-0.5'
                          }`}
                      >
                        <div className={`min-w-[28px] h-7 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 mt-0.5 ${checkedItems[item.id]
                            ? 'bg-emerald-500 text-white shadow-emerald-500/20 shadow-lg'
                            : 'bg-slate-100 text-slate-300 group-hover:bg-amber-100 group-hover:text-amber-500'
                          }`}>
                          {checkedItems[item.id] ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                        </div>
                        <span className={`text-[13px] md:text-sm font-semibold transition-colors mt-0.5 leading-snug ${checkedItems[item.id] ? 'text-emerald-700/80 line-through' : 'text-slate-700 group-hover:text-slate-900'
                          }`}>
                          {item.text}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Progress Bottom Bar */}
                  <div className="mt-8">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ความสำเร็จของระดับนี้</span>
                      <span className={`text-[10px] font-black ${progress === 100 ? 'text-emerald-500' : level.color}`}>
                        {level.checkItems.filter(i => checkedItems[i.id]).length} / {level.checkItems.length}
                      </span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${level.gradient} transition-all duration-1000 relative overflow-hidden`}
                        style={{ width: `${progress}%` }}
                      >
                        <div className="absolute inset-0 bg-white/20 -skew-x-12 translate-x-[-100%] animate-[shimmer_2s_infinite]"></div>
                      </div>
                    </div>
                  </div>

                  {progress === 100 && (
                    <div className="mt-6 bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-emerald-200 rounded-2xl p-5 text-center animate-fade-in shadow-lg shadow-emerald-500/10">
                      <Trophy size={28} className="text-amber-500 mx-auto mb-3" />
                      <p className="text-base font-black text-emerald-700">
                        ยินดีด้วย! คุณผ่านคุณสมบัติ UBC {level.level} แล้ว! 🎉
                      </p>
                      <p className="text-xs text-emerald-600/70 font-medium mt-1 mb-4">
                        คุณพร้อมสำหรับก้าวต่อไปสู่การเป็นนักธุรกิจระดับแนวหน้า
                      </p>
                      {level.level < 4 && (
                        <button
                          onClick={() => setExpandedLevel(level.level + 1)}
                          className="bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 text-xs font-bold px-6 py-2.5 rounded-full inline-flex items-center gap-2 transition-transform hover:scale-105"
                        >
                          ไปสู่ UBC {level.level + 1} <ArrowRight size={14} />
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* 2. KPIs วัดผล */}
                <div className="glass-card rounded-[2rem] md:rounded-[3rem] p-6 md:p-8 shadow-xl">
                  <div className="flex items-center gap-3 mb-6">
                    <BarChart2 size={22} className="text-emerald-500" />
                    <h3 className="text-lg md:text-xl font-black text-slate-900 tracking-tight">การวัดผล และตัวชี้วัด (KPIs)</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {level.kpis.map((kpi, i) => (
                      <div key={i} className="bg-white/50 border border-slate-100 rounded-2xl p-4 flex flex-col justify-between hover:border-emerald-200 hover:bg-emerald-50/50 transition-colors">
                        <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">{kpi.metric}</p>
                        <p className="text-sm font-bold text-slate-800">{kpi.target}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. รายได้ตามตำแหน่ง */}
                <div className="glass-card rounded-[2rem] md:rounded-[3rem] p-6 md:p-8 shadow-xl">
                  <div className="flex items-center gap-3 mb-6">
                    <DollarSign size={22} className="text-amber-500" />
                    <h3 className="text-lg md:text-xl font-black text-slate-900 tracking-tight">รายได้ยูนิคอร์นและโบนัสที่ได้รับ</h3>
                  </div>
                  <div className="space-y-3">
                    {level.incomeDetails.map((inc, i) => (
                      <div key={i} className={`p-4 rounded-2xl border ${inc.highlight ? 'bg-amber-50/50 border-amber-200' : 'bg-slate-50 border-slate-100'}`}>
                        <p className="text-sm font-black text-slate-900 mb-1">{inc.source}</p>
                        <p className="text-xs font-medium text-slate-600 leading-relaxed">{inc.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ===== RIGHT COLUMN: Skills & Routines (5 cols) ===== */}
              <div className="lg:col-span-5 space-y-6">

                {/* 4. ทักษะที่ควรฝึกฝน */}
                <div className="glass-card rounded-[2rem] md:rounded-[3rem] p-6 md:p-8 shadow-xl bg-gradient-to-b from-white to-slate-50/50">
                  <div className="flex items-center gap-3 mb-6">
                    <BrainCircuit size={22} className="text-blue-500" />
                    <h3 className="text-lg font-black text-slate-900 tracking-tight">ทักษะที่ควรฝึกฝน</h3>
                  </div>
                  <div className="space-y-5">
                    {level.skillsToLearn.map((cat, i) => (
                      <div key={i}>
                        <p className="text-[11px] font-black text-slate-500 tracking-widest uppercase mb-2">
                          {cat.category}
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {cat.skills.map((skill, j) => (
                            <span key={j} className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-[11px] font-bold text-slate-700 shadow-sm">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 5. หมวดเรียนรู้ (Modules) */}
                <div className="glass-card rounded-[2rem] md:rounded-[3rem] p-6 md:p-8 shadow-xl">
                  <div className="flex items-center gap-3 mb-6">
                    <BookOpen size={20} className="text-indigo-500" />
                    <h3 className="text-lg font-black text-slate-900 tracking-tight">หมวดเรียนรู้ที่เกี่ยวข้อง</h3>
                  </div>
                  <div className="space-y-4">
                    {level.modules.map((mod, i) => (
                      <div key={i} className="bg-white/50 border border-slate-100 rounded-2xl p-4">
                        <p className="text-[10px] font-black text-indigo-400 uppercase tracking-wider mb-2">{mod.category}</p>
                        <div className="flex flex-wrap gap-1.5">
                          {mod.items.map((item, j) => (
                            <span key={j} className="px-2.5 py-1 bg-indigo-50 text-[11px] font-bold text-indigo-700 rounded-lg">
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 6. งานประจำวัน (Routines) */}
                <div className="glass-card rounded-[2rem] md:rounded-[3rem] p-6 md:p-8 shadow-xl">
                  <div className="flex items-center gap-3 mb-4">
                    <Zap size={20} className="text-pink-500" />
                    <h3 className="text-lg font-black text-slate-900 tracking-tight">รูทีนการทำงาน</h3>
                  </div>
                  <div className="space-y-2">
                    {level.routines.map((routine, i) => (
                      <div key={i} className="flex gap-4 p-3 bg-white/50 border border-slate-100 rounded-xl items-center">
                        <div className="w-16 shrink-0 text-right">
                          <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">{routine.freq}</p>
                        </div>
                        <div className="w-px h-8 bg-slate-200 shrink-0"></div>
                        <div className="flex flex-wrap gap-1.5">
                          {routine.items.map((item, j) => (
                            <span key={j} className="text-xs font-semibold text-slate-700 whitespace-nowrap">
                              {item}{j < routine.items.length - 1 ? ',' : ''}
                            </span>
                          ))}
                        </div>
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
