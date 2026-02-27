
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
    Play,
    Award
} from 'lucide-react';
import { AppView } from '../types';
import { useLanguage } from '../hooks/useLanguage';

interface LandingPageProps {
    onNavigate: (view: AppView) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
    const { t } = useLanguage();
    const [isHeroVisible] = useState(true);

    const features = [
        {
            icon: Bot,
            title: t('strategy.ai.title'),
            subtitle: 'AI Coach Uni',
            description: t('strategy.ai.desc'),
            gradient: 'from-violet-500 to-purple-600',
            glow: 'shadow-violet-500/20',
        },
        {
            icon: Layers,
            title: 'System 4-5-6',
            subtitle: 'Blueprint',
            description: 'Learning system designed specifically for Unicorn business.',
            gradient: 'from-amber-500 to-orange-600',
            glow: 'shadow-amber-500/20',
        },
        {
            icon: Rocket,
            title: '5 Start-Up',
            subtitle: 'Professional Start',
            description: 'Proven 5-step business plan for success.',
            gradient: 'from-cyan-500 to-blue-600',
            glow: 'shadow-cyan-500/20',
        },
        {
            icon: BookOpen,
            title: 'Digital Library',
            subtitle: 'Unlimited Learning',
            description: 'Media, documents, and videos accessible anytime.',
            gradient: 'from-emerald-500 to-green-600',
            glow: 'shadow-emerald-500/20',
        },
    ];

    const stats = [
        { value: '1,000+', label: 'Active Entrepreneurs', icon: Users },
        { value: '24/7', label: 'AI Coach Available', icon: Zap },
        { value: '4 Levels', label: 'UBC Learning Plan', icon: TrendingUp },
        { value: '100%', label: 'Secure & Reliable', icon: Shield },
    ];

    const strategies = [
        { title: t('strategy.eco.title'), desc: t('strategy.eco.desc'), icon: Zap, color: 'text-amber-500' },
        { title: t('strategy.product.title'), desc: t('strategy.product.desc'), icon: Award, color: 'text-blue-500' },
        { title: t('strategy.ai.title'), desc: t('strategy.ai.desc'), icon: Bot, color: 'text-purple-500' },
        { title: t('strategy.reward.title'), desc: t('strategy.reward.desc'), icon: Star, color: 'text-pink-500' },
    ];

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
                                {t('hero.login')}
                            </button>
                            <button
                                onClick={() => onNavigate(AppView.REGISTER)}
                                className="px-6 py-2.5 text-sm font-black bg-amber-500 text-slate-950 rounded-2xl hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-105 active:scale-95"
                            >
                                {t('hero.cta')}
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* ===== HERO SECTION ===== */}
            <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-float-slow" />
                    <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl" style={{ animationDelay: '2s' }} />
                </div>

                <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 ${isHeroVisible ? 'animate-fade-in' : ''}`}>
                        <Sparkles size={14} className="text-amber-500" />
                        <span className="text-xs font-bold text-slate-300 tracking-wide">Next-Gen AI Business Platform</span>
                    </div>

                    <h1 className={`text-5xl sm:text-6xl lg:text-8xl font-black tracking-tighter leading-[0.9] mb-8 ${isHeroVisible ? 'animate-fade-in' : ''}`} style={{ animationDelay: '0.2s' }}>
                        {t('hero.title')}<br />
                        <span className="bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 bg-clip-text text-transparent italic">
                            Academy
                        </span>
                    </h1>

                    <p className={`text-xl md:text-2xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed font-medium ${isHeroVisible ? 'animate-fade-in' : ''}`} style={{ animationDelay: '0.4s' }}>
                        {t('hero.subtitle')}
                    </p>

                    <div className={`flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 ${isHeroVisible ? 'animate-fade-in' : ''}`} style={{ animationDelay: '0.6s' }}>
                        <button
                            onClick={() => onNavigate(AppView.REGISTER)}
                            className="group w-full sm:w-auto px-10 py-5 text-lg font-black bg-amber-500 text-slate-950 rounded-2xl hover:bg-amber-400 transition-all shadow-2xl shadow-amber-500/30 hover:shadow-amber-500/50 hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                        >
                            {t('hero.cta')}
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button
                            onClick={() => onNavigate(AppView.LOGIN)}
                            className="group w-full sm:w-auto px-10 py-5 text-lg font-bold text-white bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all flex items-center justify-center gap-2"
                        >
                            <Play size={18} className="text-amber-500" />
                            {t('hero.login')}
                        </button>
                    </div>

                    <div className={`grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-3xl mx-auto ${isHeroVisible ? 'animate-fade-in' : ''}`} style={{ animationDelay: '0.8s' }}>
                        {stats.map((stat, index) => (
                            <div key={index} className="bg-white/5 border border-white/5 rounded-2xl p-4 hover:bg-white/10 hover:border-amber-500/20 transition-all group">
                                <stat.icon size={18} className="text-amber-500 mb-2 group-hover:scale-110 transition-transform" />
                                <p className="text-xl font-black text-white">{stat.value}</p>
                                <p className="text-xs text-slate-500 font-bold uppercase tracking-tighter">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== FEATURES / STRATEGY SECTION ===== */}
            <section className="relative py-24 lg:py-32">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 mb-4">
                            <Star size={12} className="text-amber-500" />
                            <span className="text-xs font-bold text-amber-500 tracking-wide uppercase">Biz Start Up Platform</span>
                        </div>
                        <h2 className="text-3xl lg:text-5xl font-black tracking-tighter mb-4">
                            {t('sections.strategy')}
                        </h2>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {strategies.map((s, index) => (
                            <div key={index} className="group relative bg-white/[0.03] border border-white/5 rounded-3xl p-8 hover:bg-white/[0.06] hover:border-white/10 transition-all duration-500 hover:-translate-y-2">
                                <s.icon size={32} className={`${s.color} mb-6 group-hover:scale-110 transition-transform`} />
                                <h3 className="text-xl font-black mb-2 uppercase tracking-tight">{s.title}</h3>
                                <p className="text-sm text-slate-500 font-bold leading-relaxed">{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
