
import React from 'react';
import {
    ShieldAlert,
    Lock,
    EyeOff,
    UserCheck,
    Files,
    ArrowLeft,
    Scale,
    ShieldCheck
} from 'lucide-react';
import { AppView } from '../types';

interface PrivacyPolicyProps {
    onNavigate: (view: AppView) => void;
}

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onNavigate }) => {
    return (
        <div className="min-h-screen bg-slate-50 animate-fade-in relative overflow-hidden pb-20">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

            <div className="relative z-10 max-w-4xl mx-auto px-6 pt-12">
                {/* Back Button */}
                <button
                    onClick={() => onNavigate(AppView.LANDING)}
                    className="group mb-12 flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-all font-bold text-sm uppercase tracking-widest"
                >
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    กลับหน้าหลัก
                </button>

                {/* Hero Section */}
                <div className="mb-16 text-center md:text-left">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6">
                        <ShieldCheck size={16} className="text-blue-600" />
                        <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Privacy & Data Protection</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-tight mb-6">
                        นโยบายความเป็นส่วนตัว <br /><span className="text-blue-600">(Privacy Policy)</span>
                    </h1>
                    <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-2xl">
                        เราให้ความสำคัญสูงสุดกับความปลอดภัยของข้อมูลส่วนบุคคลของคุณ และปฏิบัติตามกฎหมายคุ้มครองข้อมูลส่วนบุคคล (PDPA) อย่างเคร่งครัด
                    </p>
                </div>

                {/* Main Content Card */}
                <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 md:p-12 shadow-2xl space-y-12">

                    {/* Commitment Message */}
                    <div className="p-8 bg-blue-600 rounded-3xl text-white shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                        <div className="relative z-10 flex items-start gap-6">
                            <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
                                <Lock size={32} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black mb-2">คำมั่นสัญญาของเรา</h3>
                                <p className="text-blue-50 font-medium leading-relaxed">
                                    เรารักษาข้อมูลของคุณเป็นความลับสูงสุด ไม่มีการนำไปใช้ในกรณีอื่นใดที่ไม่ได้รับอนุญาต และไม่มีการเปิดเผยต่อบุคคลภายนอกโดยเด็ดขาด
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Section: Data Collection */}
                    <section>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-6 flex items-center gap-3">
                            <Files className="text-blue-500" size={24} />
                            ข้อมูลที่เราจัดเก็บ
                        </h2>
                        <div className="space-y-4 text-slate-600 font-medium">
                            <p>เราจัดเก็บข้อมูลที่จำเป็นต่อการให้บริการและการใช้แพลตฟอร์มอย่างราบรื่น ได้แก่:</p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li>ข้อมูลระบุตัวตน (เช่น ชื่อ-นามสกุล, อีเมล, หมายเลขโทรศัพท์)</li>
                                <li>ข้อมูลการใช้งานระบบ (Log data, อุปกรณ์ที่เข้าใช้งาน)</li>
                                <li>ข้อมูลที่จำเป็นสำหรับการประเมินผลในกิจกรรมต่างๆ ภายในแพลตฟอร์ม</li>
                            </ul>
                        </div>
                    </section>

                    {/* Section: Purpose */}
                    <section>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-6 flex items-center gap-3">
                            <UserCheck className="text-slate-900" size={24} />
                            วัตถุประสงค์การใช้ข้อมูล
                        </h2>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                                <h4 className="font-black text-slate-900 mb-2">เพื่อการบริการ</h4>
                                <p className="text-sm text-slate-500">ใช้เพื่อยืนยันตัวตน สนับสนุนการเรียนรู้ และกิจกรรมทางธุรกิจของผู้ใช้</p>
                            </div>
                            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                                <h4 className="font-black text-slate-900 mb-2">เพื่อการพัฒนา</h4>
                                <p className="text-sm text-slate-500">ใช้เพื่อปรับปรุงคุณภาพแพลตฟอร์มและ AI ให้ตอบโจทย์ความต้องการของผู้ใช้อยู่เสมอ</p>
                            </div>
                        </div>
                    </section>

                    {/* Section: Security */}
                    <section>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-6 flex items-center gap-3">
                            <ShieldAlert className="text-rose-500" size={24} />
                            มาตรการรักษาความปลอดภัย
                        </h2>
                        <p className="text-slate-600 font-medium leading-relaxed mb-6">
                            เราใช้เทคโนโลยีการเข้ารหัสข้อมูลที่ทันสมัยและระบบบริหารจัดการความปลอดภัยที่ได้รับมาตรฐาน เพื่อป้องกันการเข้าชมข้อมูลโดยไม่ได้รับอนุญาต การสูญหาย หรือการใช้ข้อมูลในทางที่ผิด
                        </p>
                        <div className="p-6 bg-amber-50 border border-amber-100 rounded-3xl">
                            <div className="flex items-center gap-2 mb-2">
                                <Scale size={18} className="text-amber-600" />
                                <span className="text-xs font-black text-amber-700 uppercase tracking-widest">Compliance</span>
                            </div>
                            <p className="text-sm text-amber-900 font-bold">ดำเนินการตามพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (PDPA) ทุกประการ</p>
                        </div>
                    </section>

                    {/* Section: Rights */}
                    <section className="pt-8 border-t border-slate-100">
                        <h2 className="text-xl font-black text-slate-900 mb-4 tracking-tight">สิทธิของคุณ</h2>
                        <p className="text-slate-500 text-sm leading-relaxed mb-6">
                            ภายใต้กฎหมาย PDPA คุณมีสิทธิในการขอเข้าถึง ขอรับข้อมูลต้นฉบับ ขอให้แก้ไข คัดค้านการประมวลผล หรือขอให้ลบข้อมูลส่วนบุคคลของคุณได้ โดยสามารถแจ้งผ่านช่องทางการติดต่อที่เป็นทางการของเรา
                        </p>
                        <div className="flex items-center gap-2 text-blue-600 font-black text-xs uppercase tracking-widest">
                            <EyeOff size={16} />
                            No data will be shared with third parties
                        </div>
                    </section>

                </div>

                {/* Footer info */}
                <div className="mt-12 text-center text-slate-400 text-xs font-bold leading-loose">
                    <p>ปรับปรุงล่าสุดเมื่อ: 27 กุมภาพันธ์ 2569</p>
                    <p>จัดทำโดย ฝ่ายกฎหมายและฝ่ายเทคโนโลยี UNICORN GLOBAL LINK</p>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
