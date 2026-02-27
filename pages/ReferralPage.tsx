import React from 'react';
import {
    User as UserIcon,
    MessageSquare,
    Play,
    ArrowRight,
    ExternalLink,
    ShieldCheck,
    Star
} from 'lucide-react';
import { User, AppView } from '../types';
import { useLanguage } from '../hooks/useLanguage';

interface ReferralPageProps {
    referrer: User;
    onNavigate: (view: AppView) => void;
    onJoinTeam: () => void;
}

const ReferralPage: React.FC<ReferralPageProps> = ({ referrer, onNavigate, onJoinTeam }) => {
    const { t } = useLanguage();

    // Helper to extract YouTube ID
    const getYouTubeId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const videoId = referrer.youtubeUrl ? getYouTubeId(referrer.youtubeUrl) : null;

    return (
        <div className="min-h-screen bg-slate-950 text-white selection:bg-amber-500/30">
            {/* Dynamic Background */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-amber-500/10 rounded-full blur-[120px] opacity-50" />
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[100px]" />
            </div>

            <div className="relative z-10 max-w-2xl mx-auto px-4 py-12 lg:py-20">
                {/* Header / Brand Section */}
                <div className="text-center mb-12">
                    <div className="relative inline-block mb-6">
                        <div className="absolute inset-0 bg-gradient-to-tr from-amber-400 to-amber-600 rounded-full blur-xl opacity-40 animate-pulse" />
                        <div className="relative w-32 h-32 rounded-full p-1 bg-gradient-to-tr from-amber-400 via-amber-200 to-amber-600">
                            <div className="w-full h-full rounded-full overflow-hidden bg-slate-900 border-2 border-slate-900">
                                {referrer.avatarUrl ? (
                                    <img src={referrer.avatarUrl} alt={referrer.fullName} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-slate-800">
                                        <UserIcon size={48} className="text-slate-600" />
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="absolute -bottom-2 -right-2 bg-amber-500 text-slate-950 p-2 rounded-xl shadow-lg shadow-amber-500/20 ring-4 ring-slate-950">
                            <Star size={18} fill="currentColor" />
                        </div>
                    </div>

                    <h1 className="text-3xl lg:text-4xl font-black tracking-tight mb-2">
                        {referrer.fullName}
                    </h1>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-bold text-slate-400 uppercase tracking-widest">
                        <ShieldCheck size={14} className="text-emerald-500" />
                        {t('referral.verified_partner')}
                    </div>
                </div>

                {/* Bio Section */}
                {referrer.bio && (
                    <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 lg:p-8 mb-8 backdrop-blur-xl relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-1 h-full bg-amber-500" />
                        <p className="text-lg leading-relaxed text-slate-300 font-medium italic">
                            "{referrer.bio}"
                        </p>
                    </div>
                )}

                {/* Video / Content Section */}
                {videoId ? (
                    <div className="mb-8 group">
                        <div className="relative aspect-video rounded-3xl overflow-hidden border border-white/10 bg-slate-900 shadow-2xl">
                            <iframe
                                className="w-full h-full"
                                src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
                                title="Personal Branding Video"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </div>
                        <p className="mt-3 text-center text-xs text-slate-500 font-bold uppercase tracking-wider">
                            {t('referral.welcome_video')}
                        </p>
                    </div>
                ) : (
                    <div className="aspect-video rounded-3xl border-2 border-dashed border-white/5 flex flex-col items-center justify-center text-slate-600 mb-8 bg-white/[0.01]">
                        <Play size={40} className="mb-3 opacity-20" />
                        <span className="text-sm font-bold uppercase tracking-widest opacity-30">{t('referral.welcome')}</span>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="grid gap-4">
                    {referrer.lineOaUrl && (
                        <a
                            href={referrer.lineOaUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center justify-between p-5 bg-emerald-500 text-slate-950 rounded-2xl font-black text-lg hover:bg-emerald-400 transition-all shadow-xl shadow-emerald-500/20"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                                    <MessageSquare size={20} />
                                </div>
                                <span>{t('referral.contact_line')}</span>
                            </div>
                            <ExternalLink size={20} className="opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                        </a>
                    )}

                    <button
                        onClick={onJoinTeam}
                        className="group flex items-center justify-between p-5 bg-white text-slate-950 rounded-2xl font-black text-lg hover:bg-slate-100 transition-all shadow-xl shadow-white/5 border border-white/20"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-slate-950/10 rounded-xl flex items-center justify-center">
                                <ArrowRight size={20} />
                            </div>
                            <span>{t('referral.join_team')}</span>
                        </div>
                        <div className="flex -space-x-2">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                                    <img src={`https://i.pravatar.cc/150?u=${referrer.id + i}`} alt="Teammate" />
                                </div>
                            ))}
                        </div>
                    </button>
                </div>

                {/* Trust Indicators */}
                <div className="mt-12 pt-8 border-t border-white/5 grid grid-cols-2 gap-6">
                    <div className="text-center">
                        <div className="text-2xl font-black text-amber-500">100%</div>
                        <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">AI Driven Support</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-black text-amber-500">24/7</div>
                        <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">Passive Income System</div>
                    </div>
                </div>

                {/* Footer Link */}
                <p className="mt-12 text-center">
                    <button
                        onClick={() => onNavigate(AppView.LANDING)}
                        className="text-slate-500 hover:text-white text-sm font-bold transition-colors"
                    >
                        {t('common.back')}
                    </button>
                </p>

            </div>
        </div>
    );
};

export default ReferralPage;
