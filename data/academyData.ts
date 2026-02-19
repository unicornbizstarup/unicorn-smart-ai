
import { FunctionEvent, LibraryItem } from '../types';

export const CORE_SKILLS = [
  { id: 's1', title: 'ผ่าแผนรายได้', desc: 'การนำเสนอและวิเคราะห์แผนรายได้แบบเจาะลึก', category: 'Business' },
  { id: 's2', title: 'เจาะลึกสินค้า', desc: 'ความรู้สินค้าทุกหมวดและการสาธิตอย่างมืออาชีพ', category: 'Product' },
  { id: 's3', title: 'สปอนเซอร์คนใหม่', desc: 'เทคนิคการเปิดใจและปิดการสปอนเซอร์อย่างมีประสิทธิภาพ', category: 'Sales' },
  { id: 's4', title: 'การจัดเฮ้าส์มีทติ้ง', desc: 'ขั้นตอนการจัดประชุมขนาดเล็กที่บ้านเพื่อสร้างสายสัมพันธ์', category: 'Team' },
  { id: 's5', title: 'การลงพื้นที่กับทีม', desc: 'การทำงานร่วมกับทีมในพื้นที่จริงและการ Coaching หน้างาน', category: 'Team' },
  { id: 's6', title: 'ระบบและเครื่องมือ', desc: 'การใช้งาน Unicorn App และเครื่องมือช่วยทำธุรกิจ', category: 'System' },
  { id: 's7', title: 'การออกบูธนำเสนอ', desc: 'เทคนิคการจัดบูธและการดึงดูดลูกค้าหน้างาน', category: 'Sales' },
  { id: 's8', title: 'การตลาดออนไลน์', desc: 'สร้างตัวตนและหาลูกค้าผ่าน Social Media (FB, TikTok, Line)', category: 'Marketing' },
  { id: 's9', title: 'การใช้ AI ทำงาน', desc: 'เพิ่มประสิทธิภาพด้วย Unicorn Smart AI และเครื่องมืออัตโนมัติ', category: 'System' },
  { id: 's10', title: 'Train the Trainer', desc: 'ทักษะการเป็นวิทยากรและการถ่ายทอดความรู้ให้ทีมงาน', category: 'Leadership' }
];

export const SYSTEM_4_KNOW = [
  { id: 'k1', title: 'บริษัท', desc: 'ประวัติ ความมั่นคง และวิสัยทัศน์ผู้บริหาร' },
  { id: 'k2', title: 'สินค้า', desc: 'จุดเด่นสินค้า เทคโนโลยี และความคุ้มค่า' },
  { id: 'k3', title: 'แผนรายได้', desc: 'โครงสร้างรายได้ 5 ช่องทางและการรับโบนัส' },
  { id: 'k4', title: '5 WHY', desc: 'ทำไมต้องเครือข่าย/Unicorn/ระบบ/ตัวคุณ/ตอนนี้' }
];

export const SYSTEM_5_DO = [
  { id: 'd1', title: 'เป้าหมาย', desc: 'การกำหนดเป้าหมายที่ชัดเจนและวัดผลได้' },
  { id: 'd2', title: 'รายชื่อ', desc: 'การบริหารจัดการรายชื่อผู้มุ่งหวัง' },
  { id: 'd3', title: 'นัดหมาย', desc: 'เทคนิคการนัดหมายอย่างมืออาชีพ' },
  { id: 'd4', title: 'นำเสนอ', desc: 'การเปิดโอกาสทางธุรกิจ (STP)' },
  { id: 'd5', title: 'ติดตาม', desc: 'การดูแลและพัฒนาทีมงานอย่างต่อเนื่อง' }
];

export const SYSTEM_6_BE = [
  { id: 'b1', title: 'STEP 1: CORE LEADER', range: '4,000 - 10,000 บาท', icon: 'User' },
  { id: 'b2', title: 'STEP 2: SUPER STAR', range: '10,000 - 60,000 บาท', icon: 'Star' },
  { id: 'b3', title: 'STEP 3: DIRECTOR ZONE', range: '60,000 - 100,000 บาท', icon: 'Shield' },
  { id: 'b4', title: 'STEP 4: DIAMOND ZONE', range: '100,000 - 300,000 บาท', icon: 'Gem' },
  { id: 'b5', title: 'STEP 5: PRESIDENT ZONE', range: '400,000 - 800,000 บาท', icon: 'Award' },
  { id: 'b6', title: 'STEP 6: CROWN ZONE', range: '1,000,000 - 3,000,000+ บาท', icon: 'Crown' }
];

export const LIBRARY_DATA: LibraryItem[] = [
  { id: 'l1', title: 'สไลด์เปิดโอกาสทางธุรกิจ (STP)', description: 'ชุดสไลด์มาตรฐานสำหรับการนำเสนอธุรกิจ Unicorn', category: 'TEACHING', type: 'PDF' },
  { id: 'l2', title: 'วิดีโอสอนผ่าแผน 5 รายได้', description: 'เจาะลึกการคำวณรายได้ทุกขั้นตอนโดย Diamond Master', category: 'TEACHING', type: 'VIDEO' },
  { id: 'l3', title: 'คู่มือระบบ 4-5-6 ฉบับสมบูรณ์', description: 'คัมภีร์การสร้างธุรกิจอย่างเป็นระบบจากศูนย์สู่ล้าน', category: 'DOCUMENTS', type: 'PDF' },
  { id: 'l4', title: 'แคตตาล็อกสินค้าประจำปี', description: 'ข้อมูลรายละเอียดและส่วนประกอบของสินค้าทุกชิ้น', category: 'DOCUMENTS', type: 'PDF' },
  { id: 'l5', title: 'ชุดภาพโปรโมท Facebook/Line', description: 'ภาพกราฟิกสวยงามสำหรับโพสต์โซเชียลมีเดียรายวัน', category: 'MARKETING', type: 'IMAGE' },
  { id: 'l6', title: 'วิดีโอรีวิวสินค้า 4K', description: 'คลิปสั้นรีวิวสินค้าเพื่อการโฆษณาออนไลน์', category: 'MARKETING', type: 'VIDEO' },
  { id: 'l7', title: '1 นาที: วิธีคอนเนคใจทีมงาน', description: 'เทคนิคการสร้างสายสัมพันธ์เบื้องต้นใน 60 วินาที', category: 'CLIPS', type: 'VIDEO' },
  { id: 'l8', title: 'การใช้ Unicorn App ใน 2 นาที', description: 'สอนเช็คยอดและสั่งซื้อผ่านแอพอย่างรวดเร็ว', category: 'CLIPS', type: 'VIDEO' },
  { id: 'l9', title: 'คู่มือการใช้ AI ช่วยงานธุรกิจ', description: 'แนวทางการสั่งงาน AI (Prompt) เพื่อเขียนคอนเทนต์', category: 'GUIDELINES', type: 'PDF' },
  { id: 'l10', title: 'มาตรฐานการใช้แบรนด์ Unicorn', description: 'ข้อควรระวังและวิธีการสื่อสารภาพลักษณ์องค์กร', category: 'GUIDELINES', type: 'LINK' }
];

export const START_UP_5 = [
  { id: 's1', title: 'ศึกษาลิงค์ธุรกิจ', desc: 'Unicorn Link / Dashboard' },
  { id: 's2', title: 'เริ่มใช้สินค้า', desc: 'สะสม 2,000 PV เพื่อผลลัพธ์สินค้า' },
  { id: 's3', title: 'เรียนรู้ระบบ 4-5-6', desc: 'Unicorn Academy ออนไลน์/ออฟไลน์' },
  { id: 's4', title: 'ใช้ Unicorn Smart AI', desc: 'เครื่องมือช่วยขยายธุรกิจ' },
  { id: 's5', title: 'เป็น Super Star', desc: 'วางแผนกับที่ปรึกษา' }
];

export const FUNCTIONS: FunctionEvent[] = [
  {
    period: 'DAY',
    items: ['STP / Live', 'House Meeting', 'Online Meeting']
  },
  {
    period: 'WEEK',
    items: ['Super Sunday', 'Business Start-Up', 'Product Training', 'Online Training']
  },
  {
    period: 'MONTH',
    items: ['President Talk', 'Unicorn Take Off', 'Super Star Recognition']
  },
  {
    period: 'QUARTER',
    items: ['Unicorn Camp', 'Way On Win']
  }
];
