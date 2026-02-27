import React, { useState, useEffect } from 'react';
import {
    User as UserIcon,
    Mail,
    Link as LinkIcon,
    BookOpen,
    Award,
    Save,
    Camera,
    Star,
    ShieldCheck,
    Briefcase,
    Quote,
    Video,
    Facebook,
    Instagram,
    Twitter,
    Youtube,
    Globe,
    Share2,
    CheckCircle2,
    Copy,
    Zap,
    Waves,
    Shield,
    Airplay,
    Sparkles,
    ChevronRight,
    Trophy,
    Lightbulb,
    Bot,
    Loader2
} from 'lucide-react';
import { WEALTH_ELEMENTS } from '../data/wealthDnaData';
import { User as UserType, AppView } from '../types';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../hooks/useLanguage';

interface ProfileProps {
    currentUser: UserType | null;
    onUpdateUser: (user: UserType) => void;
    onNavigate: (view: AppView) => void;
}

const Profile: React.FC<ProfileProps> = ({ currentUser, onUpdateUser, onNavigate }) => {
    const { t } = useLanguage();
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [showCopiedToast, setShowCopiedToast] = useState(false);
    const [profile, setProfile] = useState({
        full_name: currentUser?.fullName || '',
        email: currentUser?.email || '',
        bio: currentUser?.bio || '',
        specialization: currentUser?.specialization || '',
        lineOaUrl: currentUser?.lineOaUrl || '',
        lineId: currentUser?.lineId || '',
        quote: currentUser?.quote || '',
        youtubeUrl: currentUser?.youtubeUrl || '',
        social_links: {
            facebook: currentUser?.socialLinks?.facebook || '',
            instagram: currentUser?.socialLinks?.instagram || '',
            tiktok: currentUser?.socialLinks?.tiktok || '',
            youtube: currentUser?.socialLinks?.youtube || '',
            twitter: currentUser?.socialLinks?.twitter || '',
            linkedin: currentUser?.socialLinks?.linkedin || '',
            thread: currentUser?.socialLinks?.thread || '',
            website: currentUser?.socialLinks?.website || '',
        },
        ubc_level: currentUser?.ubcLevel || 1,
        points: (currentUser?.pvPersonal || 0) + (currentUser?.pvTeam || 0),
        wealthElement: currentUser?.wealthElement || null
    });

    // Fetch full profile details from Supabase on mount (Background refresh)
    useEffect(() => {
        const fetchProfileDetails = async () => {
            if (!currentUser?.id) return;

            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', currentUser.id)
                .single();

            if (data && !error) {
                setProfile(prev => ({
                    ...prev,
                    full_name: data.full_name || prev.full_name,
                    email: data.email || prev.email,
                    wealthElement: data.wealth_element || prev.wealthElement,
                    ubc_level: data.ubc_level || prev.ubc_level,
                    bio: data.bio || prev.bio,
                    quote: data.quote || prev.quote,
                    specialization: data.specialization || prev.specialization,
                    youtubeUrl: data.youtube_url || prev.youtubeUrl,
                    lineOaUrl: data.line_oa_url || prev.lineOaUrl,
                    lineId: data.line_id || prev.lineId,
                    social_links: data.social_links || prev.social_links
                }));
            }
        };

        fetchProfileDetails();
    }, [currentUser?.id]);

    const handleSave = async () => {
        if (!currentUser?.id) return;
        setIsSaving(true);

        try {
            // Use the centralized updateUser logic from App.tsx
            // This ensures all fields (including email) are handled correctly
            await onUpdateUser({
                ...currentUser,
                fullName: profile.full_name,
                wealthElement: profile.wealthElement as any,
                bio: profile.bio,
                youtubeUrl: profile.youtubeUrl,
                lineOaUrl: profile.lineOaUrl,
                lineId: profile.lineId,
                quote: profile.quote,
                specialization: profile.specialization,
                socialLinks: profile.social_links
            });

            setIsEditing(false);
            alert('บันทึกข้อมูลสำเร็จแล้ว!');
        } catch (err: any) {
            console.error('Save error:', err);
            const errorMsg = err.message || (err.error?.message) || 'กรุณาลองใหม่อีกครั้ง';
            alert(`ไม่สามารถบันทึกข้อมูลได้: ${errorMsg}`);
        } finally {
            setIsSaving(false);
        }
    };

    const handleCopyLink = () => {
        const referralLink = `https://unicornsmartai.cloud/${currentUser?.username || 'user'}`;
        navigator.clipboard.writeText(referralLink);
        setShowCopiedToast(true);
        setTimeout(() => setShowCopiedToast(false), 3000);
    };

    const handleSocialChange = (platform: keyof typeof profile.social_links, value: string) => {
        setProfile(prev => ({
            ...prev,
            social_links: {
                ...prev.social_links,
                [platform]: value
            }
        }));
    };

    // Helper to render video embed safely
    const renderVideoEmbed = () => {
        if (!profile.youtubeUrl) return null;

        const getYouTubeId = (url: string) => {
            const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/;
            const match = url.match(regExp);
            return (match && match[2].length === 11) ? match[2] : null;
        };

        const videoId = getYouTubeId(profile.youtubeUrl);
        if (!videoId) return null;

        return (
            <div className="relative w-full overflow-hidden rounded-[1.5rem] shadow-lg" style={{ paddingTop: '56.25%' }}>
                <iframe
                    className="absolute top-0 left-0 w-full h-full border-0"
                    src={`https://www.youtube.com/embed/${videoId}`}
                    title="Profile Video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                ></iframe>
            </div>
        );
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-20 px-2 lg:px-0 relative">

            {/* Toast Notification */}
            <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${showCopiedToast ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
                }`}>
                <div className="bg-slate-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 font-semibold text-sm">
                    <CheckCircle2 size={18} className="text-emerald-400" />
                    คัดลอกลิงก์แนะนำเรียบร้อยแล้ว
                </div>
            </div>

            {/* Header Profile Card */}
            <section className="relative h-64 md:h-72 rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-dark-gradient" />
                <div className="absolute inset-0 bg-white/5 backdrop-blur-[2px]" />
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-8 bg-gradient-to-t from-slate-950/90 to-transparent text-center md:text-left">
                    <div className="relative group shrink-0">
                        <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-3xl p-1 shadow-2xl relative overflow-hidden">
                            <img
                                src={currentUser?.avatarUrl || "https://api.dicebear.com/7.x/avataaars/svg?seed=UnicornPartner"}
                                alt="Profile"
                                className="w-full h-full object-cover rounded-2xl"
                            />
                            <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white cursor-pointer">
                                <Camera size={24} />
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file && currentUser) {
                                            const url = URL.createObjectURL(file);
                                            onUpdateUser({ ...currentUser, avatarUrl: url });
                                        }
                                    }}
                                />
                            </label>
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-amber-500 rounded-full border-4 border-slate-900 flex items-center justify-center text-white shadow-lg">
                            <Award size={18} />
                        </div>
                    </div>
                    <div className="flex-1 text-white pb-2 flex flex-col md:flex-row justify-between items-center md:items-end w-full gap-4">
                        <div>
                            <div className="flex items-center gap-2 mb-2 justify-center md:justify-start">
                                <span className="bg-amber-500 text-slate-950 text-[10px] md:text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">UBC {profile.ubc_level} - Master</span>
                            </div>
                            <h1 className="text-2xl md:text-4xl font-black tracking-tight">{profile.full_name}</h1>
                            <p className="text-white/60 font-bold text-xs md:text-sm tracking-wide mt-1 uppercase tracking-[0.2em]">{profile.specialization}</p>
                        </div>
                        <button
                            onClick={handleCopyLink}
                            className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white px-5 py-2.5 rounded-full font-bold text-sm flex items-center gap-2 transition-all hover:scale-105 shrink-0"
                        >
                            <Share2 size={16} /> URL แนะนำเพื่อน
                        </button>
                    </div>
                </div>
            </section>

            {/* Wealth DNA Section */}
            <div className="glass-card p-6 md:p-8 rounded-[2.5rem] border border-white/60 shadow-xl overflow-hidden relative group">
                {profile.wealthElement ? (
                    <div className="flex flex-col md:flex-row items-center gap-8 animate-in fade-in slide-in-from-right-8 duration-500">
                        <div className={`w-32 h-32 rounded-3xl bg-gradient-to-br flex items-center justify-center text-white shadow-lg ${WEALTH_ELEMENTS[profile.wealthElement].color}`}>
                            {profile.wealthElement === 'FIRE' && <Zap size={48} />}
                            {profile.wealthElement === 'WATER' && <Waves size={48} />}
                            {profile.wealthElement === 'EARTH' && <Shield size={48} />}
                            {profile.wealthElement === 'AIR' && <Airplay size={48} />}
                        </div>
                        <div className="flex-1 text-center md:text-left space-y-2">
                            <div className="flex items-center gap-2 justify-center md:justify-start">
                                <Trophy size={16} className="text-amber-500" />
                                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">รหัสความมั่งคั่งประเจำตัว</span>
                            </div>
                            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                                {WEALTH_ELEMENTS[profile.wealthElement].name}
                            </h2>
                            <p className="text-slate-500 font-bold italic">"{WEALTH_ELEMENTS[profile.wealthElement].concept}"</p>
                            <div className="flex flex-wrap gap-2 pt-2 justify-center md:justify-start">
                                {WEALTH_ELEMENTS[profile.wealthElement].strengths.slice(0, 3).map((s, i) => (
                                    <span key={i} className="px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-black text-slate-600 uppercase tracking-tight">
                                        {s}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100 max-w-sm">
                            <h4 className="text-xs font-black text-indigo-600 uppercase tracking-widest mb-2 flex items-center gap-2">
                                <Lightbulb size={14} /> กลยุทธ์การตลาดแนะนำ
                            </h4>
                            <p className="text-sm font-bold text-slate-700 leading-relaxed italic">
                                {WEALTH_ELEMENTS[profile.wealthElement].business_strategy}
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 py-4">
                        <div className="flex items-center gap-6">
                            <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center text-slate-400">
                                <Sparkles size={32} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-slate-900">ยังไม่ได้รับการวิเคราะห์ Wealth DNA</h3>
                                <p className="text-slate-500 font-bold">ค้นหารหัสลับความมั่งคั่งของคุณเพื่อรับแผนธุรกิจที่ถูกโฉลกกับธาตุ</p>
                            </div>
                        </div>
                        <button
                            onClick={() => onNavigate(AppView.WEALTH_DNA)}
                            className="px-8 py-4 bg-gradient-to-r from-amber-400 to-amber-600 text-slate-950 font-black rounded-2xl shadow-lg hover:scale-105 transition-all flex items-center gap-2"
                        >
                            <Sparkles size={20} /> วิเคราะห์ DNA ตอนนี้
                        </button>
                    </div>
                )}
                {/* Background Sparkle Decoration */}
                <div className="absolute -top-4 -right-4 text-slate-100/50 group-hover:text-amber-500/10 transition-colors">
                    <Sparkles size={120} />
                </div>
            </div>

            <div className="grid lg:grid-cols-12 gap-8 items-start">

                {/* ====== LEFT COLUMN: Form & Private Info (7 cols) ====== */}
                <div className="lg:col-span-7 space-y-6">

                    {/* Private Stats (Not shown in referral link) */}
                    <div className="glass-card p-6 md:p-8 rounded-[2rem] border border-white/60 shadow-xl flex flex-wrap gap-6 justify-between items-center">
                        <div className="flex items-center gap-4 group flex-1 min-w-[150px]">
                            <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600 transition-all group-hover:bg-amber-500 group-hover:text-white group-hover:scale-110 shadow-sm">
                                <Star size={24} />
                            </div>
                            <div>
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Business Points</p>
                                <p className="text-xl md:text-2xl font-black text-slate-900">{profile.points.toLocaleString()}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 group flex-1 min-w-[150px]">
                            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 transition-all group-hover:bg-blue-500 group-hover:text-white group-hover:scale-110 shadow-sm">
                                <ShieldCheck size={24} />
                            </div>
                            <div>
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">U-Partner Status</p>
                                <p className="text-xl md:text-2xl font-black text-slate-900">Verified</p>
                            </div>
                        </div>
                    </div>

                    {/* Editor Form */}
                    <div className="glass-card p-6 md:p-8 rounded-[2.5rem] border border-white/60 shadow-xl relative overflow-hidden">
                        <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-md">
                                    <UserIcon size={20} />
                                </div>
                                <h3 className="text-lg md:text-xl font-black text-slate-900">ตั้งค่าโปรไฟล์และข้อมูลติดต่อ</h3>
                            </div>
                            {!isEditing ? (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-full text-xs md:text-sm font-black transition-all"
                                >
                                    แก้ไขข้อมูล
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-full text-xs md:text-sm font-black transition-all flex items-center gap-2 shadow-lg shadow-amber-500/20 disabled:opacity-60"
                                >
                                    <Save size={16} />
                                    {isSaving ? 'กำลังบันทึก...' : 'บันทึก'}
                                </button>
                            )}
                        </div>

                        <div className="grid gap-6">
                            {/* --- Basic Info --- */}
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">ชื่อที่แสดง</label>
                                    <input
                                        type="text"
                                        disabled={!isEditing}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition-all disabled:opacity-70 text-sm font-bold text-slate-900"
                                        value={profile.full_name}
                                        onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">ความเชี่ยวชาญ</label>
                                    <input
                                        type="text"
                                        disabled={!isEditing}
                                        placeholder="เช่น Digital Marketing"
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition-all disabled:opacity-70 text-sm font-bold text-slate-900"
                                        value={profile.specialization}
                                        onChange={(e) => setProfile({ ...profile, specialization: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* --- Highlight & Bio --- */}
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex justify-between">
                                    <span>คำคม / จุดเด่น (Quote)</span>
                                    <span>แสดงผลหน้า Referral</span>
                                </label>
                                <div className="relative">
                                    <Quote className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                                    <input
                                        type="text"
                                        disabled={!isEditing}
                                        placeholder="เช่น เป้าหมายที่ชัดเจน คือจุดเริ่มต้น..."
                                        className="w-full pl-11 pr-4 py-3 bg-amber-50/30 border border-amber-200/50 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition-all disabled:opacity-70 text-sm font-bold text-slate-900"
                                        value={profile.quote}
                                        onChange={(e) => setProfile({ ...profile, quote: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex justify-between">
                                    <span>{t('profile.bio')}</span>
                                    <span>แสดงผลหน้า Referral</span>
                                </label>
                                <textarea
                                    rows={3}
                                    disabled={!isEditing}
                                    placeholder="เล่าเกี่ยวกับตัวคุณสั้นๆ..."
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition-all disabled:opacity-70 text-sm font-semibold text-slate-900 resize-none"
                                    value={profile.bio}
                                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                                />
                            </div>

                            {/* --- Links & Social --- */}
                            <div className="space-y-4 pt-4 border-t border-slate-100">
                                <h4 className="text-sm font-black text-slate-900">{t('profile.contact_social')}</h4>

                                <div className="space-y-3">
                                    {/* Main CTA: LINE OA */}
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 shrink-0 bg-[#06C755]/10 text-[#06C755] rounded-xl flex items-center justify-center">
                                            <LinkIcon size={18} />
                                        </div>
                                        <div className="flex-1 space-y-2">
                                            <input
                                                type="url"
                                                disabled={!isEditing}
                                                placeholder="LINE OA URL (https://line.me/...)"
                                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition-all disabled:opacity-70 text-sm font-bold text-slate-900"
                                                value={profile.lineOaUrl}
                                                onChange={(e) => setProfile({ ...profile, lineOaUrl: e.target.value })}
                                            />
                                            <input
                                                type="text"
                                                disabled={!isEditing}
                                                placeholder={t('referral.line_id')}
                                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition-all disabled:opacity-70 text-sm font-semibold text-slate-900"
                                                value={profile.lineId}
                                                onChange={(e) => setProfile({ ...profile, lineId: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    {/* Video Embed */}
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 shrink-0 bg-red-100 text-red-600 rounded-xl flex items-center justify-center">
                                            <Video size={18} />
                                        </div>
                                        <input
                                            type="url"
                                            disabled={!isEditing}
                                            placeholder="YouTube Link (e.g., https://youtu.be/...)"
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition-all disabled:opacity-70 text-sm font-semibold text-slate-600"
                                            value={profile.youtubeUrl}
                                            onChange={(e) => setProfile({ ...profile, youtubeUrl: e.target.value })}
                                        />
                                    </div>
                                    {/* Facebook */}
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 shrink-0 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                                            <Facebook size={18} />
                                        </div>
                                        <input
                                            type="url"
                                            disabled={!isEditing}
                                            placeholder="Facebook URL"
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition-all disabled:opacity-70 text-sm font-semibold text-slate-600"
                                            value={profile.social_links.facebook}
                                            onChange={(e) => handleSocialChange('facebook', e.target.value)}
                                        />
                                    </div>
                                    {/* Instagram */}
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 shrink-0 bg-pink-100 text-pink-600 rounded-xl flex items-center justify-center">
                                            <Instagram size={18} />
                                        </div>
                                        <input
                                            type="url"
                                            disabled={!isEditing}
                                            placeholder="Instagram URL"
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition-all disabled:opacity-70 text-sm font-semibold text-slate-600"
                                            value={profile.social_links.instagram}
                                            onChange={(e) => handleSocialChange('instagram', e.target.value)}
                                        />
                                    </div>
                                    {/* TikTok */}
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 shrink-0 bg-slate-100 text-slate-900 rounded-xl flex items-center justify-center">
                                            <Share2 size={18} />
                                        </div>
                                        <input
                                            type="url"
                                            disabled={!isEditing}
                                            placeholder="TikTok URL"
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition-all disabled:opacity-70 text-sm font-semibold text-slate-600"
                                            value={profile.social_links.tiktok}
                                            onChange={(e) => handleSocialChange('tiktok', e.target.value)}
                                        />
                                    </div>
                                    {/* Twitter / X */}
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 shrink-0 bg-slate-900 text-white rounded-xl flex items-center justify-center">
                                            <Twitter size={18} />
                                        </div>
                                        <input
                                            type="url"
                                            disabled={!isEditing}
                                            placeholder="Twitter / X URL"
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition-all disabled:opacity-70 text-sm font-semibold text-slate-600"
                                            value={profile.social_links.twitter}
                                            onChange={(e) => handleSocialChange('twitter', e.target.value)}
                                        />
                                    </div>
                                    {/* LinkedIn */}
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 shrink-0 bg-[#0077b5]/10 text-[#0077b5] rounded-xl flex items-center justify-center">
                                            <Briefcase size={18} />
                                        </div>
                                        <input
                                            type="url"
                                            disabled={!isEditing}
                                            placeholder="LinkedIn URL"
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition-all disabled:opacity-70 text-sm font-semibold text-slate-600"
                                            value={profile.social_links.linkedin}
                                            onChange={(e) => handleSocialChange('linkedin', e.target.value)}
                                        />
                                    </div>
                                    {/* Generic Website */}
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 shrink-0 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center">
                                            <Globe size={18} />
                                        </div>
                                        <input
                                            type="url"
                                            disabled={!isEditing}
                                            placeholder="Personal Website URL"
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition-all disabled:opacity-70 text-sm font-semibold text-slate-600"
                                            value={profile.social_links.website}
                                            onChange={(e) => handleSocialChange('website', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ====== RIGHT COLUMN: Public Link Preview (5 cols) ====== */}
                <div className="lg:col-span-5 h-full relative">
                    <div className="sticky top-24">
                        <div className="text-center mb-4">
                            <span className="bg-slate-900 text-white text-[10px] uppercase font-black tracking-[0.2em] px-3 py-1 rounded-full shadow-md inline-flex items-center gap-2">
                                <MonitorSmartphone size={12} /> {t('profile.preview_title')}
                            </span>
                        </div>

                        {/* Mobile Phone Mockup Frame */}
                        <div className="bg-white rounded-[2.5rem] md:rounded-[3rem] shadow-2xl overflow-hidden border-[8px] border-slate-900 max-w-[380px] mx-auto min-h-[650px] flex flex-col relative bg-cover bg-center" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/cubes.png')", backgroundColor: "#f8fafc" }}>

                            {/* Top Notch UI */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-900 rounded-b-3xl z-20"></div>

                            <div className="flex-1 overflow-y-auto w-full no-scrollbar relative z-10">

                                {/* Background Gradient Top */}
                                <div className="h-40 w-full bg-gradient-to-b from-indigo-900 via-indigo-800 to-transparent absolute top-0 left-0 -z-10"></div>

                                {/* Linktree-style Content */}
                                <div className="p-6 pt-12 flex flex-col items-center text-center space-y-6">

                                    {/* Avatar */}
                                    <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-amber-400 to-amber-600 shadow-xl mx-auto overflow-hidden">
                                        <img
                                            src={currentUser?.avatarUrl || "https://api.dicebear.com/7.x/avataaars/svg?seed=UnicornPartner"}
                                            alt="Profile"
                                            className="w-full h-full object-cover rounded-full bg-slate-100 placeholder-slate-200"
                                        />
                                    </div>

                                    {/* Titles */}
                                    <div>
                                        <h2 className="text-xl font-black text-slate-900 tracking-tight leading-tight">{profile.full_name}</h2>
                                        <p className="text-[11px] font-black uppercase text-amber-600 tracking-widest mt-1">{profile.specialization}</p>
                                    </div>

                                    {/* Quote Box */}
                                    {profile.quote && (
                                        <div className="relative italic font-medium text-slate-600 text-[13px] bg-white border border-slate-100 p-4 rounded-2xl shadow-sm w-full mx-auto">
                                            <Quote size={16} className="text-slate-200 absolute -top-2 left-4 bg-white px-1" />
                                            "{profile.quote}"
                                        </div>
                                    )}

                                    {/* Bio */}
                                    {profile.bio && (
                                        <p className="text-[13px] text-slate-500 leading-relaxed font-semibold px-2">
                                            {profile.bio}
                                        </p>
                                    )}

                                    {/* Video Embed */}
                                    {profile.video_url && (
                                        <div className="w-full pt-2">
                                            {renderVideoEmbed()}
                                        </div>
                                    )}

                                    {/* Main Call to Action */}
                                    <div className="w-full pt-4 space-y-3">
                                        <a
                                            href={profile.lineOaUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="w-full block bg-[#06C755] hover:bg-[#05b34c] text-white font-black py-4 rounded-[1.5rem] shadow-lg shadow-emerald-500/20 transition-all hover:-translate-y-1 hover:shadow-xl"
                                        >
                                            {t('referral.contact_line')}
                                        </a>
                                        {profile.lineId && (
                                            <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                                                LINE ID: <span className="text-slate-900">{profile.lineId}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Social Links Row */}
                                    <div className="flex flex-wrap items-center justify-center gap-3 pt-6 pb-8 border-t border-slate-200 w-full">
                                        {profile.social_links.facebook && (
                                            <a href={profile.social_links.facebook} target="_blank" rel="noreferrer" className="w-12 h-12 bg-white text-blue-600 rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform hover:shadow-lg border border-slate-100 hover:border-blue-200 hover:bg-blue-50">
                                                <Facebook size={20} />
                                            </a>
                                        )}
                                        {profile.social_links.instagram && (
                                            <a href={profile.social_links.instagram} target="_blank" rel="noreferrer" className="w-12 h-12 bg-white text-pink-600 rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform hover:shadow-lg border border-slate-100 hover:border-pink-200 hover:bg-pink-50">
                                                <Instagram size={20} />
                                            </a>
                                        )}
                                        {profile.social_links.tiktok && (
                                            <a href={profile.social_links.tiktok} target="_blank" rel="noreferrer" className="w-12 h-12 bg-white text-slate-900 rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform hover:shadow-lg border border-slate-100 hover:border-slate-300 hover:bg-slate-50 font-bold">
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 15.68a6.34 6.34 0 0011.41 1.11h.05V10.8a8.31 8.31 0 004.96 1.73v-3.41a4.93 4.93 0 01-1.83-.43z" />
                                                </svg>
                                            </a>
                                        )}
                                        {profile.social_links.youtube && (
                                            <a href={profile.social_links.youtube} target="_blank" rel="noreferrer" className="w-12 h-12 bg-white text-red-600 rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform hover:shadow-lg border border-slate-100 hover:border-red-200 hover:bg-red-50">
                                                <Youtube size={20} />
                                            </a>
                                        )}
                                        {profile.social_links.website && (
                                            <a href={profile.social_links.website} target="_blank" rel="noreferrer" className="w-12 h-12 bg-white text-indigo-600 rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform hover:shadow-lg border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50">
                                                <Globe size={20} />
                                            </a>
                                        )}
                                    </div>

                                </div>
                            </div>

                        </div>

                        {/* Copy Link Button Underneath */}
                        <div className="text-center mt-6">
                            <button
                                onClick={handleCopyLink}
                                className="group relative bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-600 hover:text-slate-900 rounded-full pl-4 pr-3 py-2 text-xs font-bold font-mono inline-flex items-center gap-2 transition-all focus:ring-4 ring-slate-200"
                            >
                                <span className="opacity-60 group-hover:opacity-100">unicornsmartai.cloud/{currentUser?.username || 'user'}</span>
                                <div className="bg-white border border-slate-200 rounded-full p-1.5 shadow-sm group-hover:scale-110 transition-transform">
                                    <Copy size={12} className="text-slate-900" />
                                </div>
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

// Mock icon out
const MonitorSmartphone = ({ size }: { size: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
)

// Injecting utility styles for mockup experience
const Style = () => (
    <style dangerouslySetInnerHTML={{
        __html: `
        .no-scrollbar::-webkit-scrollbar {
            display: none;
        }
        .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
    `}} />
);

export default (props: ProfileProps) => (
    <>
        <Style />
        <Profile {...props} />
    </>
);
