
import React, { useState } from 'react';
import {
    User,
    Mail,
    Link as LinkIcon,
    BookOpen,
    Award,
    Save,
    Camera,
    Star,
    ShieldCheck,
    Briefcase,
} from 'lucide-react';

const Profile: React.FC = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [profile, setProfile] = useState({
        full_name: 'Kru Den Master Fa',
        email: 'kru.den@unicorn.com',
        bio: 'ผู้เชี่ยวชาญการสร้างระบบ Business Startup และการสอนด้วย AI เพื่อเปลี่ยนนักขายให้เป็นที่ปรึกษามืออาชีพ',
        specialization: 'AI Marketing & Leadership',
        contact_link: 'https://line.me/ti/p/@unicorn',
        ubc_level: 4,
        points: 45280
    });

    const handleSave = async () => {
        setIsSaving(true);
        // Simulated save - Supabase will be connected in next phase
        await new Promise(resolve => setTimeout(resolve, 800));
        setIsSaving(false);
        setIsEditing(false);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-20">
            {/* Header Profile Card */}
            <section className="relative h-64 rounded-[3rem] overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-dark-gradient" />
                <div className="absolute inset-0 bg-white/5 backdrop-blur-[2px]" />
                <div className="absolute bottom-0 left-0 right-0 p-8 flex items-end gap-8 bg-gradient-to-t from-slate-950/80 to-transparent">
                    <div className="relative group">
                        <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-3xl p-1 shadow-2xl relative overflow-hidden">
                            <img
                                src="https://api.dicebear.com/7.x/avataaars/svg?seed=UnicornPartner"
                                alt="Profile"
                                className="w-full h-full object-cover rounded-2xl"
                            />
                            <button className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                                <Camera size={24} />
                            </button>
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-amber-500 rounded-full border-4 border-slate-900 flex items-center justify-center text-white shadow-lg">
                            <Award size={18} />
                        </div>
                    </div>
                    <div className="flex-1 text-white pb-2">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="bg-amber-500 text-slate-950 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">UBC Level {profile.ubc_level} - Master</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black tracking-tight">{profile.full_name}</h1>
                        <p className="text-white/60 font-bold text-sm tracking-wide mt-1 uppercase tracking-[0.2em]">{profile.specialization}</p>
                    </div>
                </div>
            </section>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Sidebar Info */}
                <div className="space-y-6">
                    <div className="glass-card p-6 rounded-[2rem] border border-white/60 shadow-xl">
                        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6 border-b border-slate-100 pb-2">สถิติความสำเร็จ</h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 group">
                                <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600 transition-colors group-hover:bg-amber-500 group-hover:text-white">
                                    <Star size={20} />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 font-bold">Business Points</p>
                                    <p className="text-lg font-black text-slate-900">{profile.points.toLocaleString()}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 group">
                                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 transition-colors group-hover:bg-blue-500 group-hover:text-white">
                                    <ShieldCheck size={20} />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 font-bold">U-Partner Status</p>
                                    <p className="text-lg font-black text-slate-900">Verified</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Form */}
                <div className="md:col-span-2 space-y-6">
                    <div className="glass-card p-8 rounded-[2.5rem] border border-white/60 shadow-xl relative overflow-hidden">
                        <div className="flex justify-between items-center mb-8">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-slate-950 rounded-xl flex items-center justify-center text-white">
                                    <User size={20} />
                                </div>
                                <h3 className="text-xl font-black text-slate-900">ข้อมูลส่วนตัวบุคคล</h3>
                            </div>
                            {!isEditing ? (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="px-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-full text-sm font-black transition-all"
                                >
                                    แก้ไขข้อมูล
                                </button>
                            ) : (
                                <button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-full text-sm font-black transition-all flex items-center gap-2 shadow-lg shadow-amber-500/20 disabled:opacity-60"
                                >
                                    <Save size={16} />
                                    {isSaving ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}
                                </button>
                            )}
                        </div>

                        <div className="grid gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">ชื่อ-นามสกุล</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                    <input
                                        type="text"
                                        disabled={!isEditing}
                                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-amber-500 outline-none transition-all disabled:opacity-70 font-bold text-slate-900"
                                        value={profile.full_name}
                                        onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">อีเมลติดต่อ</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                        <input
                                            type="email"
                                            disabled={!isEditing}
                                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-amber-500 outline-none transition-all disabled:opacity-70 font-bold text-slate-900"
                                            value={profile.email}
                                            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">ความเชี่ยวชาญ</label>
                                    <div className="relative">
                                        <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                        <input
                                            type="text"
                                            disabled={!isEditing}
                                            placeholder="เช่น Digital Marketing, Sales"
                                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-amber-500 outline-none transition-all disabled:opacity-70 font-bold text-slate-900"
                                            value={profile.specialization}
                                            onChange={(e) => setProfile({ ...profile, specialization: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">คำแนะนำตัว (Bio)</label>
                                <div className="relative">
                                    <BookOpen className="absolute left-4 top-4 text-slate-300" size={18} />
                                    <textarea
                                        rows={4}
                                        disabled={!isEditing}
                                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-amber-500 outline-none transition-all disabled:opacity-70 font-bold text-slate-900 resize-none"
                                        value={profile.bio}
                                        onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">ช่องทางติดต่อ (Line/FB Link)</label>
                                <div className="relative">
                                    <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                    <input
                                        type="url"
                                        disabled={!isEditing}
                                        placeholder="https://line.me/ti/p/..."
                                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-amber-500 outline-none transition-all disabled:opacity-70 font-bold text-slate-900"
                                        value={profile.contact_link}
                                        onChange={(e) => setProfile({ ...profile, contact_link: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
