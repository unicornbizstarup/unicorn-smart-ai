
import React from 'react';
import {
    MapPin,
    Phone,
    Mail,
    MessageCircle,
    Facebook,
    Instagram,
    Youtube,
    ExternalLink,
    ArrowLeft,
    ShieldCheck,
    Building2,
    Clock
} from 'lucide-react';
import { AppView } from '../types';

interface ContactProps {
    onNavigate: (view: AppView) => void;
}

const Contact: React.FC<ContactProps> = ({ onNavigate }) => {
    const socialLinks = [
        {
            name: 'Line OA: UNICORN Official',
            icon: MessageCircle,
            url: 'https://line.me/R/ti/p/@178gxlfl',
            color: 'bg-emerald-500',
            description: 'สอบถามข้อมูลทั่วไปและบริการ'
        },
        {
            name: 'Line OA: UNICORN CONNECT',
            icon: MessageCircle,
            url: 'https://line.me/R/ti/p/@296juuiw',
            color: 'bg-emerald-600',
            description: 'ระบบสมาชิกและบริการพาร์ทเนอร์'
        },
        {
            name: 'Facebook',
            icon: Facebook,
            url: 'https://www.facebook.com/share/1Gp8uSoTmn',
            color: 'bg-blue-600',
            description: 'ติดตามข่าวสารและกิจกรรมล่าสุด'
        },
        {
            name: 'Instagram',
            icon: Instagram,
            url: 'https://www.instagram.com/unicorn.globallink',
            color: 'bg-pink-600',
            description: 'ภาพลักษณ์และไลฟ์สไตล์ยูนิคอร์น'
        },
        {
            name: 'YouTube',
            icon: Youtube,
            url: 'https://www.youtube.com/@unicorngloballink',
            color: 'bg-red-600',
            description: 'วิดีโอความรู้และแรงบันดัดใจ'
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50 animate-fade-in relative overflow-hidden pb-12">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

            {/* Header Section */}
            <div className="relative z-10 p-6 lg:p-12 max-w-7xl mx-auto">
                <button
                    onClick={() => onNavigate(AppView.LANDING)}
                    className="group mb-8 flex items-center gap-2 text-slate-500 hover:text-amber-500 transition-colors font-bold text-sm uppercase tracking-widest"
                >
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    กลับหน้าหลัก
                </button>

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div>
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 mb-4">
                            <ShieldCheck size={16} className="text-amber-500" />
                            <span className="text-xs font-black text-amber-600 uppercase tracking-widest">Official Support</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-none mb-4">
                            ติดต่อ<span className="text-amber-500">สอบถาม</span>
                        </h1>
                        <p className="text-slate-500 text-lg md:text-xl font-medium max-w-2xl leading-relaxed">
                            เราพร้อมให้คำปรึกษาและสนับสนุนทุกย่างก้าวในเส้นทางธุรกิจของคุณ <br className="hidden md:block" />
                            กับทีมงานมืออาชีพจาก Unicorn Global Link
                        </p>
                    </div>
                    <div className="hidden lg:block text-right">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">Company Status</p>
                        <div className="flex items-center gap-2 justify-end">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                            <span className="text-sm font-bold text-emerald-600 uppercase tracking-tight">Active & Ready to help</span>
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-12 gap-8 items-start">
                    {/* Main Info Card */}
                    <div className="lg:col-span-7 space-y-6">
                        <div className="bg-white/70 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-12 border border-white shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-colors pointer-events-none" />

                            <div className="flex items-start gap-6 mb-10">
                                <div className="w-16 h-16 rounded-2xl bg-slate-950 flex items-center justify-center shadow-xl group-hover:rotate-6 transition-transform duration-500">
                                    <Building2 className="text-amber-500" size={32} />
                                </div>
                                <div>
                                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-tight mb-2">
                                        บริษัท ยูนิคอร์น โกลบอล ลิ้งค์ จํากัด
                                    </h2>
                                    <p className="text-amber-500 font-bold text-sm tracking-wider uppercase">
                                        UNICORN GLOBAL LINK COMPANY LIMITED
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-8">
                                {/* Address */}
                                <div className="flex gap-1.5 md:gap-4 md:items-start group/loc p-4 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                                    <div className="w-12 h-12 shrink-0 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                                        <MapPin size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-1">ที่ตั้งสำนักงานเลขา</h3>
                                        <p className="text-lg font-bold text-slate-700 leading-relaxed md:leading-normal">
                                            241 ถ.รัชดาภิเษก แขวงรัชดาภิเษก เขตดินแดง, <br className="hidden md:block" />
                                            Bangkok, Thailand, 10400
                                        </p>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-8">
                                    {/* Phone */}
                                    <a href="tel:0909707755" className="flex items-center gap-4 group/item p-4 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:border-amber-500/20 transition-all hover:-translate-y-1">
                                        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover/item:bg-blue-600 group-hover/item:text-white transition-colors">
                                            <Phone size={24} />
                                        </div>
                                        <div>
                                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Call Center</h3>
                                            <p className="text-xl font-black text-slate-900 leading-tight">090 970 7755</p>
                                        </div>
                                    </a>

                                    {/* Email */}
                                    <a href="mailto:b.unicorn.official@gmail.com" className="flex items-center gap-4 group/item p-4 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:border-amber-500/20 transition-all hover:-translate-y-1">
                                        <div className="w-12 h-12 rounded-xl bg-pink-50 flex items-center justify-center text-pink-600 group-hover/item:bg-pink-600 group-hover/item:text-white transition-colors">
                                            <Mail size={24} />
                                        </div>
                                        <div className="overflow-hidden">
                                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Official Email</h3>
                                            <p className="text-sm font-black text-slate-900 leading-tight truncate">b.unicorn.official@gmail.com</p>
                                        </div>
                                    </a>
                                </div>
                            </div>

                            <div className="mt-12 p-6 rounded-[2rem] bg-slate-950 text-white flex flex-col md:flex-row items-center gap-6 shadow-2xl border border-white/5 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
                                <div className="w-14 h-14 bg-amber-500 rounded-2xl flex items-center justify-center text-slate-950 shrink-0 shadow-lg shadow-amber-500/20">
                                    <Clock size={28} />
                                </div>
                                <div>
                                    <h4 className="text-lg font-black tracking-tight mb-1">เวลาทำการ (Business Hours)</h4>
                                    <p className="text-white/60 text-sm font-medium">
                                        จันทร์ - อาทิตย์ : <span className="text-amber-400 font-bold">10:00 - 20:00 น.</span> <br />
                                        (ทีมงาน Support ออนไลน์สแตนด์บายตลอด 24 ชม. ผ่านช่องทางโซเชียล)
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Social Links Cards */}
                    <div className="lg:col-span-5 space-y-4">
                        <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-4 pl-2 flex items-center gap-2">
                            <div className="w-1 h-3 bg-amber-500 rounded-full" />
                            Social Communities
                        </h3>

                        <div className="grid gap-3">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.name}
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group flex items-center gap-4 p-5 rounded-3xl bg-white/60 backdrop-blur-md border border-white shadow-sm hover:shadow-2xl hover:bg-white hover:border-amber-500/20 transition-all duration-300 hover:-translate-x-1"
                                >
                                    <div className={`w-12 h-12 rounded-2xl ${social.color} text-white flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500`}>
                                        <social.icon size={22} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-black text-slate-900 tracking-tight leading-none mb-1 group-hover:text-amber-600">{social.name}</p>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{social.description}</p>
                                    </div>
                                    <ExternalLink size={16} className="text-slate-300 group-hover:text-amber-500 group-hover:translate-x-1 transition-all" />
                                </a>
                            ))}
                        </div>

                        {/* Special Call to Action */}
                        <div className="mt-8 bg-gradient-to-br from-amber-400 to-orange-500 p-8 rounded-[2.5rem] text-slate-950 shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                            <div className="relative z-10">
                                <h4 className="text-2xl font-black tracking-tighter mb-2">สอบถามด่วน?</h4>
                                <p className="text-slate-900/70 text-sm font-bold mb-6 leading-relaxed">
                                    สแกน Line QR Code <br /> หรือกดปุ่มด้านบนเพื่อคุยกับโค้ช AI และทีมงานได้ทันทีครับ
                                </p>
                                <div className="flex items-center gap-2">
                                    <div className="h-1 flex-1 bg-slate-950/20 rounded-full overflow-hidden">
                                        <div className="h-full bg-slate-950 w-2/3 rounded-full animate-pulse-slow" />
                                    </div>
                                    <span className="text-[10px] font-black uppercase opacity-60">Priority Response</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
