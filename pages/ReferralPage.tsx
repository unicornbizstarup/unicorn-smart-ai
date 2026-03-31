
import React, { useState } from 'react';
import {
    User as UserIcon,
    MessageSquare,
    ArrowRight,
    ExternalLink,
    Star,
    Facebook,
    Instagram,
    Twitter,
    Globe,
    Share2,
    Linkedin,
    Copy,
    Check,
    Play,
    TrendingUp,
    Award,
    Zap,
    ChevronRight,
    Phone,
    Youtube,
    LogIn
} from 'lucide-react';
import { User, AppView, UBCLevel } from '../types';

interface ReferralPageProps {
    referrer: User;
    onNavigate: (view: AppView) => void;
    onJoinTeam: () => void;
}

const PRODUCTS = [
    { name: 'U-Life Boost', img: 'https://mewjhcheciafyuxkngqn.supabase.co/storage/v1/object/public/Product/1.U-Life%20Boost.png', desc: 'สุขภาพ & อาหารเสริม' },
    { name: 'U-Skin', img: 'https://mewjhcheciafyuxkngqn.supabase.co/storage/v1/object/public/Product/2.U-Skin.png', desc: 'ดูแลผิว & ความงาม' },
    { name: 'U-Plant', img: 'https://mewjhcheciafyuxkngqn.supabase.co/storage/v1/object/public/Product/3.U-Plant.png', desc: 'เกษตรอินทรีย์' },
    { name: 'U-Care', img: 'https://mewjhcheciafyuxkngqn.supabase.co/storage/v1/object/public/Product/4.U-Care.png', desc: 'ดูแลส่วนตัว' },
    { name: 'U-Tech', img: 'https://mewjhcheciafyuxkngqn.supabase.co/storage/v1/object/public/Product/5.U-Tech.png', desc: 'เทคโนโลยี & นวัตกรรม' },
];

const UBC_CONFIG: Record<number, { label: string; color: string; bg: string; border: string; glow: string }> = {
    1: { label: 'UBC 1 · FOUNDATION', color: 'text-blue-400',   bg: 'bg-blue-500/15',   border: 'border-blue-500/40',   glow: 'shadow-blue-500/20' },
    2: { label: 'UBC 2 · SPECIALIST', color: 'text-purple-400', bg: 'bg-purple-500/15', border: 'border-purple-500/40', glow: 'shadow-purple-500/20' },
    3: { label: 'UBC 3 · STRATEGIC',  color: 'text-orange-400', bg: 'bg-orange-500/15', border: 'border-orange-500/40', glow: 'shadow-orange-500/20' },
    4: { label: 'UBC 4 · MASTER',     color: 'text-amber-400',  bg: 'bg-amber-500/15',  border: 'border-amber-500/40',  glow: 'shadow-amber-500/30' },
};

const getYouTubeId = (url: string) => {
    const match = url.match(/^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/);
    return match && match[2].length === 11 ? match[2] : null;
};

const ReferralPage: React.FC<ReferralPageProps> = ({ referrer, onNavigate, onJoinTeam }) => {
    const [copied, setCopied] = useState(false);
    const [lineIdCopied, setLineIdCopied] = useState(false);

    const ubcLevel = referrer.ubcLevel ?? 1;
    const ubc = UBC_CONFIG[ubcLevel] ?? UBC_CONFIG[1];
    const videoId = referrer.youtubeUrl ? getYouTubeId(referrer.youtubeUrl) : null;
    const referralUrl = `${window.location.origin}/${referrer.username}`;
    const businessPoints = (referrer.pvPersonal ?? 0) + (referrer.pvTeam ?? 0);

    const copyReferralLink = async () => {
        await navigator.clipboard.writeText(referralUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const copyLineId = async () => {
        if (!referrer.lineId) return;
        await navigator.clipboard.writeText(referrer.lineId);
        setLineIdCopied(true);
        setTimeout(() => setLineIdCopied(false), 2000);
    };

    const handleShare = async () => {
        if (navigator.share) {
            await navigator.share({ title: `${referrer.fullName} - Unicorn Global Link`, url: referralUrl });
        } else {
            copyReferralLink();
        }
    };

    return (
        <div className="min-h-screen bg-[#050d1a] text-white font-['Prompt',sans-serif] selection:bg-amber-500/30">
            {/* Background */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-blue-600/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-[100px]" />
                <div className="absolute top-1/2 left-0 w-[300px] h-[300px] bg-indigo-600/5 rounded-full blur-[80px]" />
            </div>

            <div className="relative z-10 max-w-md mx-auto px-4 py-8 pb-16">

                {/* Brand Bar */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-amber-500 rounded-xl flex items-center justify-center font-black text-slate-950 text-sm shadow-lg shadow-amber-500/30">U</div>
                        <span className="text-xs font-black tracking-[0.2em] text-slate-400 uppercase">Unicorn Global Link</span>
                    </div>
                    <button
                        onClick={() => onNavigate(AppView.LOGIN)}
                        className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-amber-400 transition-colors"
                    >
                        <LogIn size={14} />
                        เข้าสู่ระบบ
                    </button>
                </div>

                {/* ===== HERO CARD ===== */}
                <div className="relative rounded-[2rem] overflow-hidden mb-6 bg-gradient-to-br from-[#0d1f3c] via-[#0f2347] to-[#091830] border border-white/10 shadow-2xl">
                    {/* Top accent line */}
                    <div className="h-1 w-full bg-gradient-to-r from-blue-600 via-amber-500 to-blue-600" />

                    <div className="p-6">
                        {/* Profile Row */}
                        <div className="flex items-start gap-4 mb-5">
                            {/* Avatar */}
                            <div className="relative shrink-0">
                                <div className="w-20 h-20 rounded-full p-[2px] bg-gradient-to-tr from-amber-400 via-amber-200 to-amber-600 shadow-xl shadow-amber-500/20">
                                    <div className="w-full h-full rounded-full overflow-hidden bg-slate-900">
                                        {referrer.avatarUrl ? (
                                            <img src={referrer.avatarUrl} alt={referrer.fullName} className="w-full h-full object-cover object-top" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-slate-800">
                                                <UserIcon size={32} className="text-slate-500" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="absolute -bottom-1 -right-1 bg-amber-500 text-slate-950 p-1.5 rounded-lg shadow-lg ring-2 ring-[#0d1f3c]">
                                    <Star size={12} fill="currentColor" />
                                </div>
                            </div>

                            {/* Name & Info */}
                            <div className="flex-1 min-w-0">
                                <h1 className="text-xl font-black text-white tracking-tight leading-tight mb-1">
                                    {referrer.fullName}
                                </h1>
                                {referrer.specialization && (
                                    <p className="text-amber-400 font-bold text-xs uppercase tracking-widest mb-2">
                                        {referrer.specialization}
                                    </p>
                                )}
                                {/* UBC Badge */}
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-widest border ${ubc.bg} ${ubc.border} ${ubc.color}`}>
                                    <Award size={11} />
                                    {ubc.label}
                                </span>
                            </div>
                        </div>

                        {/* Stats Row */}
                        <div className="grid grid-cols-2 gap-3 mb-5">
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                                <div className="flex items-center justify-center gap-1.5 mb-1">
                                    <TrendingUp size={14} className="text-amber-400" />
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Business Points</span>
                                </div>
                                <p className="text-2xl font-black text-amber-400">{businessPoints.toLocaleString()}</p>
                            </div>
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                                <div className="flex items-center justify-center gap-1.5 mb-1">
                                    <Zap size={14} className="text-blue-400" />
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">U-Partner</span>
                                </div>
                                <p className={`text-lg font-black ${ubc.color}`}>
                                    {ubcLevel === 4 ? 'MASTER' : ubcLevel === 3 ? 'STRATEGIC' : ubcLevel === 2 ? 'SPECIALIST' : 'FOUNDATION'}
                                </p>
                            </div>
                        </div>

                        {/* Quote */}
                        {referrer.quote && (
                            <div className="relative bg-blue-950/50 border border-blue-800/30 rounded-xl px-4 py-3 mb-5">
                                <div className="absolute top-2 left-3 text-blue-400/40 text-2xl font-black leading-none">"</div>
                                <p className="text-sm text-slate-300 font-medium leading-relaxed pl-3 pr-2">
                                    {referrer.quote}
                                </p>
                            </div>
                        )}

                        {/* Bio */}
                        {referrer.bio && (
                            <p className="text-sm text-slate-400 leading-relaxed mb-5 border-l-2 border-amber-500/50 pl-3">
                                {referrer.bio}
                            </p>
                        )}
                    </div>
                </div>

                {/* ===== CONTACT SECTION ===== */}
                <div className="space-y-3 mb-6">
                    {referrer.lineOaUrl && (
                        <a
                            href={referrer.lineOaUrl.trim()}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center justify-between p-4 bg-[#06C755] text-white rounded-2xl font-black text-base hover:bg-[#05b34d] transition-all shadow-xl shadow-[#06C755]/25 active:scale-[0.98]"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                                    <MessageSquare size={20} />
                                </div>
                                <div>
                                    <p className="font-black">ติดต่อผ่าน LINE OA</p>
                                    <p className="text-xs text-white/70 font-medium">แชทกับทีม Unicorn</p>
                                </div>
                            </div>
                            <ExternalLink size={18} className="opacity-70 group-hover:opacity-100 transition" />
                        </a>
                    )}

                    {referrer.lineId && (
                        <button
                            onClick={copyLineId}
                            className="w-full group flex items-center justify-between p-4 bg-[#0d1f3c] border border-[#06C755]/30 text-white rounded-2xl font-bold text-sm hover:border-[#06C755]/60 transition-all active:scale-[0.98]"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-[#06C755]/15 rounded-xl flex items-center justify-center">
                                    <Phone size={18} className="text-[#06C755]" />
                                </div>
                                <div className="text-left">
                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">LINE ID</p>
                                    <p className="font-black text-white">{referrer.lineId.trim()}</p>
                                </div>
                            </div>
                            {lineIdCopied
                                ? <Check size={18} className="text-[#06C755]" />
                                : <Copy size={16} className="text-slate-400 group-hover:text-white transition" />
                            }
                        </button>
                    )}
                </div>

                {/* ===== PRODUCTS ===== */}
                <div className="mb-6">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.25em] mb-3">กลุ่มผลิตภัณฑ์</p>
                    <div className="grid grid-cols-5 gap-2">
                        {PRODUCTS.map((p) => (
                            <div key={p.name} className="group flex flex-col items-center gap-1.5">
                                <div className="w-full aspect-square rounded-xl overflow-hidden bg-slate-800 border border-white/10 group-hover:border-amber-500/40 transition-all shadow-md">
                                    <img src={p.img} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                </div>
                                <p className="text-[9px] font-black text-slate-400 text-center uppercase tracking-tight leading-tight">{p.name}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ===== VIDEO ===== */}
                {videoId ? (
                    <div className="mb-6">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.25em] mb-3">วิดีโอแนะนำ</p>
                        <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                            <iframe
                                className="w-full h-full"
                                src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
                                title="Personal Branding Video"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </div>
                    </div>
                ) : (
                    <div className="mb-6 aspect-video rounded-2xl border border-dashed border-white/10 flex flex-col items-center justify-center text-slate-700">
                        <Play size={32} className="mb-2 opacity-30" />
                        <span className="text-xs font-bold uppercase tracking-widest opacity-30">แนบวิดีโอ YouTube ในโปรไฟล์</span>
                    </div>
                )}

                {/* ===== SOCIAL LINKS ===== */}
                {referrer.socialLinks && Object.values(referrer.socialLinks).some(Boolean) && (
                    <div className="mb-6">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.25em] mb-3">โซเชียลมีเดีย</p>
                        <div className="flex gap-2 flex-wrap">
                            {referrer.socialLinks.tiktok && (
                                <a href={referrer.socialLinks.tiktok} target="_blank" rel="noopener noreferrer"
                                    className="flex-1 min-w-[3rem] aspect-square bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all">
                                    <Share2 size={18} />
                                </a>
                            )}
                            {referrer.socialLinks.facebook && (
                                <a href={referrer.socialLinks.facebook} target="_blank" rel="noopener noreferrer"
                                    className="flex-1 min-w-[3rem] aspect-square bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-slate-400 hover:text-[#1877F2] hover:bg-[#1877F2]/10 hover:border-[#1877F2]/30 transition-all">
                                    <Facebook size={18} />
                                </a>
                            )}
                            {referrer.socialLinks.instagram && (
                                <a href={referrer.socialLinks.instagram} target="_blank" rel="noopener noreferrer"
                                    className="flex-1 min-w-[3rem] aspect-square bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-slate-400 hover:text-pink-400 hover:bg-pink-500/10 hover:border-pink-500/30 transition-all">
                                    <Instagram size={18} />
                                </a>
                            )}
                            {referrer.socialLinks.youtube && (
                                <a href={referrer.socialLinks.youtube} target="_blank" rel="noopener noreferrer"
                                    className="flex-1 min-w-[3rem] aspect-square bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-500/10 hover:border-red-500/30 transition-all">
                                    <Youtube size={18} />
                                </a>
                            )}
                            {referrer.socialLinks.twitter && (
                                <a href={referrer.socialLinks.twitter} target="_blank" rel="noopener noreferrer"
                                    className="flex-1 min-w-[3rem] aspect-square bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-slate-400 hover:text-sky-400 hover:bg-sky-500/10 hover:border-sky-500/30 transition-all">
                                    <Twitter size={18} />
                                </a>
                            )}
                            {referrer.socialLinks.linkedin && (
                                <a href={referrer.socialLinks.linkedin} target="_blank" rel="noopener noreferrer"
                                    className="flex-1 min-w-[3rem] aspect-square bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 hover:border-blue-500/30 transition-all">
                                    <Linkedin size={18} />
                                </a>
                            )}
                            {referrer.socialLinks.website && (
                                <a href={referrer.socialLinks.website} target="_blank" rel="noopener noreferrer"
                                    className="flex-1 min-w-[3rem] aspect-square bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 hover:border-amber-500/30 transition-all">
                                    <Globe size={18} />
                                </a>
                            )}
                        </div>
                    </div>
                )}

                {/* ===== REFERRAL LINK ===== */}
                <div className="mb-6">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.25em] mb-3">ลิงค์แนะนำส่วนตัว</p>
                    <div className="bg-[#0d1f3c] border border-blue-800/40 rounded-2xl p-4">
                        <p className="text-xs text-slate-400 font-mono truncate mb-3">{referralUrl}</p>
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                onClick={copyReferralLink}
                                className={`flex items-center justify-center gap-2 py-2.5 rounded-xl font-black text-sm transition-all ${copied ? 'bg-emerald-500 text-white' : 'bg-white/10 text-white hover:bg-white/15'}`}
                            >
                                {copied ? <Check size={15} /> : <Copy size={15} />}
                                {copied ? 'คัดลอกแล้ว!' : 'คัดลอก'}
                            </button>
                            <button
                                onClick={handleShare}
                                className="flex items-center justify-center gap-2 py-2.5 rounded-xl font-black text-sm bg-blue-600 text-white hover:bg-blue-500 transition-all"
                            >
                                <Share2 size={15} />
                                แชร์
                            </button>
                        </div>
                    </div>
                </div>

                {/* ===== CTA ===== */}
                <button
                    onClick={onJoinTeam}
                    className="w-full group flex items-center justify-between p-5 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 rounded-2xl font-black text-lg hover:from-amber-400 hover:to-amber-500 transition-all shadow-2xl shadow-amber-500/30 active:scale-[0.98] mb-4"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-950/15 rounded-xl flex items-center justify-center">
                            <ArrowRight size={22} />
                        </div>
                        <div className="text-left">
                            <p className="font-black leading-tight">สมัครเป็นพาร์ทเนอร์</p>
                            <p className="text-xs font-bold opacity-60">ร่วมทีม Unicorn Global Link</p>
                        </div>
                    </div>
                    <ChevronRight size={20} className="opacity-60 group-hover:translate-x-1 transition-transform" />
                </button>

                {/* Footer */}
                <div className="text-center pt-4 border-t border-white/5">
                    <p className="text-slate-600 text-xs font-bold">
                        Powered by <span className="text-amber-500">Unicorn Academy</span>
                    </p>
                </div>

            </div>
        </div>
    );
};

export default ReferralPage;
