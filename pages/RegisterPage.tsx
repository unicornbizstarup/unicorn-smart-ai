import React, { useState, useEffect } from 'react';
import {
    Mail,
    Lock,
    Eye,
    EyeOff,
    ArrowLeft,
    UserPlus,
    User as UserIcon,
    Phone,
    CheckCircle2,
    Sparkles,
    MessageSquare,
    ShieldCheck,
    RefreshCw
} from 'lucide-react';
import { AppView, User } from '../types';
import { supabase } from '../lib/supabase';

interface RegisterPageProps {
    onNavigate: (view: AppView) => void;
    onRegister: (user: User) => void;
    referralId?: string | null;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ onNavigate, onRegister, referralId }) => {
    const [fullName, setFullName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // If there's a referral, maybe show a welcome message or pre-fill recruiter
    useEffect(() => {
        if (referralId) {
            console.log('Registering with recruiter:', referralId);
        }
    }, [referralId]);

    const passwordChecks = [
        { label: 'อย่างน้อย 6 ตัวอักษร', valid: password.length >= 6 },
        { label: 'รหัสผ่านตรงกัน', valid: password === confirmPassword && confirmPassword.length > 0 },
    ];

    const handleSubmitDetails = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!fullName || !username || !email || !password || !confirmPassword) {
            setError('กรุณากรอกข้อมูลให้ครบทุกช่อง');
            return;
        }

        if (username.length < 3) {
            setError('Username ต้องมีอย่างน้อย 3 ตัวอักษร');
            return;
        }

        if (password.length < 6) {
            setError('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร');
            return;
        }

        if (password !== confirmPassword) {
            setError('รหัสผ่านไม่ตรงกัน กรุณาตรวจสอบอีกครั้ง');
            return;
        }

        setIsLoading(true);

        try {
            // 1. Sign up user via Supabase Auth
            const { data, error: signUpError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: window.location.origin,
                    data: {
                        full_name: fullName,
                        username: username.toLowerCase().replace(/\s+/g, ''),
                    }
                }
            });

            if (signUpError) throw signUpError;

            // Auto-login and create profile immediately
            if (data.session) {
                await createProfile(data.user!);
                return;
            }

            // Try auto-login since the user just registered
            if (data.user && !data.session) {
                const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });

                if (!loginError && loginData.session) {
                    await createProfile(loginData.user!);
                    return;
                } else {
                    setError('สมัครสมาชิกสำเร็จ แต่ระบบระงับการเข้าสู่ระบบอัตโนมัติ กรุณาลองเข้าสู่ระบบอีกครั้ง หรือติดต่อแอดมิน');
                }
            }
        } catch (err: any) {
            // Handle "user already registered" gracefully
            if (err.message?.includes('already registered') || err.message?.includes('already been registered')) {
                setError('อีเมลนี้ลงทะเบียนแล้ว กรุณาเข้าสู่ระบบแทน');
            } else {
                setError(err.message || 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const createProfile = async (user: any) => {
        const { error: profileError } = await supabase
            .from('profiles')
            .upsert({
                id: user.id,
                full_name: fullName,
                username: username.toLowerCase().replace(/\s+/g, ''),
                email,
                phone: phone || null,
                referred_by: referralId || null,
                ubc_level: 1,
                pv_personal: 0,
                pv_team: 0,
                is_admin: false
            });

        if (profileError) throw profileError;

        const userData: User = {
            id: user.id,
            fullName,
            username: username.toLowerCase().replace(/\s+/g, ''),
            email,
            phone: phone || undefined,
            createdAt: user.created_at,
            referredBy: referralId || undefined,
            ubcLevel: 1,
            pvPersonal: 0,
            pvTeam: 0,
            isAdmin: false
        };

        localStorage.setItem('unicorn_current_user', JSON.stringify(userData));
        onRegister(userData);
    };



    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0">
                <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-amber-500/8 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 left-1/4 w-60 h-60 bg-emerald-500/8 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 w-full max-w-md my-8">
                {/* Back button */}
                <button
                    onClick={() => onNavigate(AppView.LANDING)}
                    className="group flex items-center gap-2 text-sm text-slate-500 hover:text-white mb-8 transition-colors"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    กลับหน้าแรก
                </button>

                {/* Register Card */}
                <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-8 lg:p-10 shadow-2xl backdrop-blur-xl">
                    {/* Header */}
                            <div className="text-center mb-8">
                                <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-amber-500/25">
                                    <Sparkles size={24} className="text-white" />
                                </div>
                                <h1 className="text-2xl font-black text-white tracking-tight">เข้าร่วม Unicorn Academy</h1>
                                <p className="text-sm text-slate-400 mt-1">ลงทะเบียนเพื่อเริ่มต้นเส้นทางนักธุรกิจ AI 🦄</p>
                            </div>

                            {error && (
                                <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 mb-6 animate-fade-in">
                                    <p className="text-sm text-red-400 font-medium text-center">{error}</p>
                                </div>
                            )}

                            {/* Form */}
                            <form onSubmit={handleSubmitDetails} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 text-[10px]">ชื่อ-นามสกุล</label>
                                    <div className="relative">
                                        <UserIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                                        <input
                                            type="text"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            placeholder="สมชาย ใจดี"
                                            className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all text-sm font-medium"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 text-[10px]">Username (สำหรับลิงก์แนะนำ)</label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-sm">@</div>
                                        <input
                                            type="text"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, ''))}
                                            placeholder="yourname"
                                            className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all text-sm font-medium"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 text-[10px]">อีเมล</label>
                                    <div className="relative">
                                        <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="name@example.com"
                                            className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all text-sm font-medium"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-2">
                                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 text-[10px]">รหัสผ่าน</label>
                                        <div className="relative">
                                            <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                placeholder="••••••••"
                                                className="w-full pl-12 pr-12 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all text-sm font-medium"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                                            >
                                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 text-[10px]">ยืนยันรหัสผ่าน</label>
                                        <div className="relative">
                                            <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                placeholder="••••••••"
                                                className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all text-sm font-medium"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full py-4 bg-amber-500 text-slate-950 font-black rounded-2xl hover:bg-amber-400 transition-all shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2 text-base"
                                >
                                    {isLoading ? <RefreshCw className="animate-spin" size={20} /> : <><UserPlus size={18} /> ถัดไป</>}
                                </button>
                            </form>



                            <p className="text-center text-sm text-slate-500 mt-8 font-medium">
                                เป็นสมาชิกแล้ว?{' '}
                                <button onClick={() => onNavigate(AppView.LOGIN)} className="text-amber-500 font-bold hover:text-amber-400">เข้าสู่ระบบ</button>
                            </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;

