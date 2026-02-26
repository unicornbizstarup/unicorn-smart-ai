
import React, { useState } from 'react';
import {
    Sparkles,
    Bot,
    Layers,
    Rocket,
    BookOpen,
    ArrowRight,
    ChevronRight,
    Star,
    Zap,
    Users,
    TrendingUp,
    Shield,
    Play
} from 'lucide-react';
import { AppView } from '../types';

interface LandingPageProps {
    onNavigate: (view: AppView) => void;
}

const features = [
    {
        icon: Bot,
        title: 'โค้ชอัจฉริยะ AI',
        subtitle: 'น้องยูนิ 24 ชม.',
        description: 'ที่ปรึกษาส่วนตัวพร้อมช่วยเหลือทุกเรื่องธุรกิจด้วย AI ล่าสุด',
        gradient: 'from-violet-500 to-purple-600',
        glow: 'shadow-violet-500/20',
    },
    {
        icon: Layers,
        title: 'ระบบ 4-5-6',
        subtitle: 'Blueprint สู่ความสำเร็จ',
        description: 'ระบบเรียนรู้เฉพาะทางที่ออกแบบมาเพื่อนักธุรกิจ Unicorn โดยเฉพาะ',
        gradient: 'from-amber-500 to-orange-600',
        glow: 'shadow-amber-500/20',
    },
    {
        icon: Rocket,
        title: '5 Start-Up',
        subtitle: 'เริ่มต้นอย่างมืออาชีพ',
        description: 'แผนการเริ่มต้นธุรกิจ 5 ขั้นตอนที่พิสูจน์แล้วว่าได้ผลจริง',
        gradient: 'from-cyan-500 to-blue-600',
        glow: 'shadow-cyan-500/20',
    },
    {
        icon: BookOpen,
        title: 'คลังความรู้ดิจิทัล',
        subtitle: 'เรียนรู้ไม่มีขีดจำกัด',
        description: 'สื่อการเรียนรู้ เอกสาร คลิปวิดีโอ พร้อมให้เข้าถึงได้ตลอดเวลา',
        gradient: 'from-emerald-500 to-green-600',
        glow: 'shadow-emerald-500/20',
    },
];

const stats = [
    { value: '1,000+', label: 'นักธุรกิจที่ใช้งาน', icon: Users },
    { value: '24/7', label: 'โค้ช AI พร้อมช่วย', icon: Zap },
    { value: '4 ระดับ', label: 'แผนการเรียนรู้ UBC', icon: TrendingUp },
    { value: '100%', label: 'ปลอดภัยและเชื่อถือได้', icon: Shield },
];

const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
    const [isHeroVisible] = useState(true);

    return (
        <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">

            {/* ===== NAVBAR ===== */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-white/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 lg:h-20">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-amber-500 rounded-2xl flex items-center justify-center font-black text-lg shadow-lg shadow-amber-500/30">U</div>
                            <div>
                                <h1 className="text-lg font-black tracking-tighter">UNICORN</h1>
                                <p className="text-xs text-amber-500 font-bold tracking-[0.25em] uppercase -mt-1">Academy</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => onNavigate(AppView.LOGIN)}
                                className="px-5 py-2.5 text-sm font-bold text-slate-300 hover:text-white transition-colors"
                            >
                                เข้าสู่ระบบ
                            </button>
                            <button
                                onClick={() => onNavigate(AppView.REGISTER)}
                                className="px-6 py-2.5 text-sm font-black bg-amber-500 text-slate-950 rounded-2xl hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-105 active:scale-95"
                            >
                                ลงทะเบียน
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* ===== HERO SECTION ===== */}
            <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
                {/* Background Effects */}
                <div className="absolute inset-0">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-float-slow" />
                    <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl" style={{ animationDelay: '2s' }} />
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-amber-500/5 to-violet-500/5 rounded-full blur-3xl" />
                </div>

                <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
                    {/* Badge */}
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 ${isHeroVisible ? 'animate-fade-in' : ''}`}>
                        <Sparkles size={14} className="text-amber-500" />
                        <span className="text-xs font-bold text-slate-300 tracking-wide">เทคโนโลยี AI ล่าสุดเพื่อผู้นำยุคใหม่</span>
                    </div>

                    {/* Main Heading */}
                    <h1 className={`text-4xl sm:text-5xl lg:text-7xl font-black tracking-tighter leading-[1.1] mb-6 ${isHeroVisible ? 'animate-fade-in' : ''}`}
                        style={{ animationDelay: '0.2s' }}>
                        <span className="text-white">สร้างธุรกิจ</span>
                        <br />
                        <span className="bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 bg-clip-text text-transparent">
                            Unicorn
                        </span>
                        <span className="text-white"> ของคุณ</span>
                    </h1>

                    {/* Subtitle */}
                    <p className={`text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed font-light ${isHeroVisible ? 'animate-fade-in' : ''}`}
                        style={{ animationDelay: '0.4s' }}>
                        แพลตฟอร์มพัฒนาศักยภาพด้านธุรกิจและเทคโนโลยี AI
                        <br className="hidden sm:block" />
                        พร้อม <span className="text-amber-500 font-semibold">โค้ช AI น้องยูนิ</span> ที่ปรึกษาส่วนตัว 24 ชม.
                    </p>

                    {/* CTA Buttons */}
                    <div className={`flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 ${isHeroVisible ? 'animate-fade-in' : ''}`}
                        style={{ animationDelay: '0.6s' }}>
                        <button
                            onClick={() => onNavigate(AppView.REGISTER)}
                            className="group w-full sm:w-auto px-8 py-4 text-base font-black bg-amber-500 text-slate-950 rounded-2xl hover:bg-amber-400 transition-all shadow-2xl shadow-amber-500/30 hover:shadow-amber-500/50 hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                        >
                            เริ่มต้นฟรี
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button
                            onClick={() => onNavigate(AppView.LOGIN)}
                            className="group w-full sm:w-auto px-8 py-4 text-base font-bold text-white bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all flex items-center justify-center gap-2"
                        >
                            <Play size={16} className="text-amber-500" />
                            เข้าสู่ระบบ
                        </button>
                    </div>

                    {/* Stats */}
                    <div className={`grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-3xl mx-auto ${isHeroVisible ? 'animate-fade-in' : ''}`}
                        style={{ animationDelay: '0.8s' }}>
                        {stats.map((stat, index) => (
                            <div
                                key={index}
                                className="bg-white/5 border border-white/5 rounded-2xl p-4 hover:bg-white/10 hover:border-amber-500/20 transition-all group"
                            >
                                <stat.icon size={18} className="text-amber-500 mb-2 group-hover:scale-110 transition-transform" />
                                <p className="text-xl font-black text-white">{stat.value}</p>
                                <p className="text-xs text-slate-500 font-medium">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== FEATURES SECTION ===== */}
            <section className="relative py-24 lg:py-32">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Section Header */}
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 mb-4">
                            <Star size={12} className="text-amber-500" />
                            <span className="text-xs font-bold text-amber-500 tracking-wide uppercase">ฟีเจอร์เด่น</span>
                        </div>
                        <h2 className="text-3xl lg:text-5xl font-black tracking-tighter mb-4">
                            ทุกเครื่องมือที่คุณต้องการ
                        </h2>
                        <p className="text-slate-400 text-lg max-w-xl mx-auto">
                            ระบบครบวงจรเพื่อพัฒนาศักยภาพนักธุรกิจยุคใหม่
                        </p>
                    </div>

                    {/* Feature Cards */}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className={`group relative bg-white/[0.03] border border-white/5 rounded-3xl p-6 hover:bg-white/[0.06] hover:border-white/10 transition-all duration-500 hover:-translate-y-1 shadow-2xl ${feature.glow}`}
                            >
                                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                                    <feature.icon size={22} className="text-white" />
                                </div>
                                <h3 className="text-lg font-black tracking-tight mb-1">{feature.title}</h3>
                                <p className="text-xs font-bold text-amber-500 mb-3">{feature.subtitle}</p>
                                <p className="text-sm text-slate-400 leading-relaxed">{feature.description}</p>
                                <ChevronRight size={16} className="absolute top-6 right-6 text-slate-600 group-hover:text-amber-500 group-hover:translate-x-1 transition-all" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== CTA SECTION ===== */}
            <section className="relative py-24">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
                    <div className="relative bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/10 rounded-[2rem] p-10 lg:p-16 overflow-hidden">
                        <div className="absolute -top-20 -right-20 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl" />
                        <div className="relative z-10">
                            <div className="w-16 h-16 bg-amber-500 rounded-3xl flex items-center justify-center font-black text-3xl mx-auto mb-6 shadow-2xl shadow-amber-500/30">🦄</div>
                            <h2 className="text-3xl lg:text-4xl font-black tracking-tighter mb-4">
                                พร้อมเริ่มต้นเส้นทาง<span className="text-amber-500">ความสำเร็จ</span>?
                            </h2>
                            <p className="text-slate-400 mb-8 max-w-lg mx-auto">
                                เข้าร่วม Unicorn Academy วันนี้ แล้วพบกับโค้ช AI น้องยูนิ ที่ปรึกษาส่วนตัวที่จะช่วยคุณทำธุรกิจอย่างมืออาชีพ
                            </p>
                            <button
                                onClick={() => onNavigate(AppView.REGISTER)}
                                className="group px-10 py-4 text-base font-black bg-amber-500 text-slate-950 rounded-2xl hover:bg-amber-400 transition-all shadow-2xl shadow-amber-500/30 hover:shadow-amber-500/50 hover:scale-105 active:scale-95 inline-flex items-center gap-2"
                            >
                                ลงทะเบียนฟรีตอนนี้
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== FOOTER ===== */}
            <footer className="border-t border-white/5 py-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-amber-500 rounded-xl flex items-center justify-center font-black text-sm">U</div>
                            <p className="text-sm text-slate-500">
                                © 2026 <span className="font-bold text-slate-400">Unicorn Academy</span>. All rights reserved.
                            </p>
                        </div>
                        <div className="flex items-center gap-6">
                            <button className="text-xs text-slate-500 hover:text-amber-500 transition-colors font-medium">เกี่ยวกับเรา</button>
                            <button className="text-xs text-slate-500 hover:text-amber-500 transition-colors font-medium">ติดต่อ</button>
                            <button className="text-xs text-slate-500 hover:text-amber-500 transition-colors font-medium">นโยบายความเป็นส่วนตัว</button>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
