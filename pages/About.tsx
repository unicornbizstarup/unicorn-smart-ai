
import React from 'react';
import {
    Award,
    Globe,
    ShieldCheck,
    Target,
    Users,
    Zap,
    ArrowLeft,
    Scale,
    Building,
    CheckCircle2,
    Sparkles,
    Plane,
    Heart
} from 'lucide-react';
import { AppView } from '../types';
import { useLanguage } from '../hooks/useLanguage';

interface AboutProps {
    onNavigate: (view: AppView) => void;
}

const About: React.FC<AboutProps> = ({ onNavigate }) => {
    const { t } = useLanguage();

    const strategies = [
        {
            title: t('strategy.eco.title'),
            icon: Zap,
            desc: t('strategy.eco.desc'),
            color: 'text-amber-500',
            bg: 'bg-amber-500/10'
        },
        {
            title: t('strategy.product.title'),
            icon: Award,
            desc: t('strategy.product.desc'),
            color: 'text-blue-500',
            bg: 'bg-blue-500/10'
        },
        {
            title: t('strategy.ai.title'),
            icon: Sparkles,
            desc: t('strategy.ai.desc'),
            color: 'text-purple-500',
            bg: 'bg-purple-500/10'
        },
        {
            title: t('strategy.reward.title'),
            icon: Heart,
            desc: t('strategy.reward.desc'),
            color: 'text-pink-500',
            bg: 'bg-pink-500/10'
        }
    ];

    const certifications = ['GMP', 'HACCP', 'ISO', 'Halal'];

    return (
        <div className="min-h-screen bg-slate-50 animate-fade-in relative overflow-hidden pb-20 font-inter">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

            {/* Header & Back Button */}
            <div className="relative z-10 max-w-7xl mx-auto px-6 pt-12">
                <button
                    onClick={() => onNavigate(AppView.LANDING)}
                    className="group mb-12 flex items-center gap-2 text-slate-500 hover:text-amber-500 transition-all font-bold text-sm uppercase tracking-widest"
                >
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    {t('common.back')}
                </button>

                {/* Hero Section */}
                <div className="grid lg:grid-cols-12 gap-12 items-center mb-24 text-center lg:text-left">
                    <div className="lg:col-span-12">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/5 border border-slate-900/10 mb-6">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">ABOUT UNICORN GLOBAL LINK</span>
                        </div>
                        <h1 className="text-4xl md:text-7xl font-black text-slate-900 tracking-tighter leading-tight mb-8">
                            {t('about.hero.title')}
                        </h1>
                        <p className="text-xl md:text-2xl text-slate-500 font-medium max-w-4xl leading-relaxed mx-auto lg:mx-0">
                            {t('about.hero.subtitle')}
                        </p>
                    </div>
                </div>

                {/* Founder & Vision */}
                <section className="grid lg:grid-cols-2 gap-12 items-center mb-32">
                    <div className="relative">
                        <div className="aspect-[4/5] bg-slate-900 rounded-[3rem] overflow-hidden shadow-2xl relative group">
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/20 to-transparent z-10" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Users size={120} className="text-slate-800 opacity-20 group-hover:scale-110 transition-transform duration-700" />
                            </div>
                            <div className="absolute bottom-10 left-10 z-20">
                                <p className="text-amber-500 font-black text-sm uppercase tracking-widest mb-2">{t('about.founder.role')}</p>
                                <h3 className="text-3xl font-black text-white tracking-tighter">{t('about.founder.name')}</h3>
                                <p className="text-white/60 font-bold">(Dr. Joy)</p>
                            </div>
                        </div>
                        <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-amber-500 rounded-[2rem] flex items-center justify-center text-white shadow-2xl z-30 transform rotate-12">
                            <Award size={48} />
                        </div>
                    </div>
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-6 flex items-center gap-4">
                                <div className="w-2 h-10 bg-amber-500 rounded-full" />
                                {t('about.vision.title')}
                            </h2>
                            <p className="text-lg text-slate-600 leading-relaxed font-medium">
                                {t('about.vision.desc')}
                            </p>
                        </div>
                        <div className="p-8 bg-amber-500 rounded-[2.5rem] text-slate-950 shadow-2xl transform -rotate-2 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-2">Our Slogan</p>
                            <h4 className="text-3xl font-black tracking-tight italic">
                                "{t('about.slogan')}"
                            </h4>
                        </div>
                        <p className="text-sm font-bold text-slate-400 italic">
                            "{t('about.motto')}"
                        </p>
                    </div>
                </section>

                {/* Security & Legal */}
                <section className="bg-slate-950 text-white rounded-[3rem] p-10 md:p-16 mb-32 relative overflow-hidden shadow-2xl border border-white/5">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                    <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-3xl md:text-5xl font-black tracking-tighter mb-8 leading-tight">
                                {t('about.legal.title')}
                            </h2>
                            <div className="flex items-center gap-6 mb-10">
                                <div className="w-16 h-16 rounded-2xl bg-amber-500 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/20">
                                    <Scale size={32} />
                                </div>
                                <div>
                                    <p className="text-xs font-black text-white/40 uppercase tracking-[0.2em] mb-1">Unicorn Finance</p>
                                    <p className="text-3xl font-black text-white">{t('about.legal.capital')}</p>
                                </div>
                            </div>
                            <p className="text-white/60 font-medium text-lg leading-relaxed">
                                {t('about.legal.desc')}
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            {[
                                { t: t('about.stats.cert'), s: 'OCPB', i: ShieldCheck, c: 'text-amber-500' },
                                { t: t('about.stats.growth'), s: 'AEC+', i: Globe, c: 'text-blue-500' },
                                { t: t('about.stats.office'), s: '20+ Yrs', i: Building, c: 'text-purple-500' },
                                { t: t('about.stats.standard'), s: 'Global', i: Award, c: 'text-pink-500' },
                            ].map((stat, idx) => (
                                <div key={idx} className="bg-white/5 border border-white/10 p-8 rounded-[2rem] text-center hover:bg-white/10 transition-colors">
                                    <stat.i size={40} className={`${stat.c} mx-auto mb-4`} />
                                    <p className="text-xs font-bold opacity-60 uppercase tracking-tighter mb-1">{stat.t}</p>
                                    <p className={`text-xl font-black ${stat.c}`}>{stat.s}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 4 Pillars of Strategy */}
                <section className="mb-32">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter mb-4">
                            {t('sections.strategy')}
                        </h2>
                        <p className="text-slate-500 text-lg font-medium max-w-2xl mx-auto">
                            Biz Start Up Platform Foundations
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {strategies.map((s) => (
                            <div key={s.title} className="bg-white border inset-0 border-slate-100 p-8 rounded-[2.5rem] shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group">
                                <div className={`w-14 h-14 rounded-2xl ${s.bg} flex items-center justify-center ${s.color} mb-6 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-sm`}>
                                    <s.icon size={28} />
                                </div>
                                <h3 className="text-xl font-black text-slate-900 mb-2 uppercase tracking-tighter">{s.title}</h3>
                                <p className="text-slate-500 text-sm font-bold leading-relaxed">{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Product Groups */}
                <section className="bg-white/60 backdrop-blur-md rounded-[3rem] p-10 md:p-16 border border-white shadow-2xl text-center">
                    <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-12">{t('sections.products')}</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-16">
                        {[
                            { n: 'Skincare', i: '✨' },
                            { n: 'Personal Care', i: '🧼' },
                            { n: 'Health & Food', i: '💊' },
                            { n: 'Agriculture', i: '🌱' },
                            { n: 'Technology', i: '💻' },
                            { n: 'Correction Wear', i: '👗' }
                        ].map((p) => (
                            <div key={p.n} className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all">
                                <div className="text-3xl mb-3">{p.i}</div>
                                <p className="text-xs font-black text-slate-900 leading-tight uppercase tracking-tighter">{p.n}</p>
                            </div>
                        ))}
                    </div>
                    <div className="flex flex-wrap justify-center gap-8 md:gap-16">
                        {certifications.map((c) => (
                            <div key={c} className="flex flex-col items-center gap-2">
                                <div className="w-20 h-20 rounded-full border-4 border-emerald-500/10 flex items-center justify-center bg-white shadow-xl relative">
                                    <div className="w-14 h-14 rounded-full border border-emerald-500/20 flex items-center justify-center font-black text-emerald-600 text-sm">
                                        {c}
                                    </div>
                                </div>
                                <span className="text-[10px] font-black text-slate-400 tracking-widest uppercase">Verified</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Bottom CTA */}
                <div className="mt-24 text-center">
                    <p className="text-slate-400 font-bold mb-6 italic">{t('about.motto')}</p>
                    <button
                        onClick={() => onNavigate(AppView.CONTACT)}
                        className="px-12 py-5 bg-blue-600 text-white rounded-2xl font-black text-xl shadow-2xl hover:scale-105 active:scale-95 transition-all uppercase tracking-tighter"
                    >
                        {t('common.contact_now')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default About;
