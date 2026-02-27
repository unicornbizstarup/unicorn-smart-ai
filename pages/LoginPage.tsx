import React, { useState } from 'react';
import {
    Mail,
    Lock,
    Eye,
    EyeOff,
    ArrowLeft,
    LogIn,
    Sparkles
} from 'lucide-react';
import { AppView, User } from '../types';
import { supabase } from '../lib/supabase';

interface LoginPageProps {
    onNavigate: (view: AppView) => void;
    onLogin: (user: User) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onNavigate, onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('กรุณากรอกอีเมลและรหัสผ่านให้ครบ');
            return;
        }

        setIsLoading(true);

        try {
            // 1. Sign in via Supabase Auth
            const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (authError) throw authError;

            if (authData.user) {
                // 2. Fetch profile data from public.profiles
                const { data: profileData, error: profileError } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', authData.user.id)
                    .single();

                if (profileError) {
                    console.error('Error fetching profile:', profileError);
                }

                const userData: User = {
                    id: authData.user.id,
                    fullName: profileData?.full_name || authData.user.user_metadata?.full_name || 'User',
                    username: profileData?.username || authData.user.user_metadata?.username || email.split('@')[0],
                    email: authData.user.email!,
                    avatarUrl: profileData?.avatar_url,
                    createdAt: authData.user.created_at,
                    ubcLevel: profileData?.ubc_level || 1,
                    pvPersonal: profileData?.pv_personal || 0,
                    pvTeam: profileData?.pv_team || 0,
                    isAdmin: profileData?.is_admin || false,
                    wealthElement: profileData?.wealth_element,
                    referredBy: profileData?.referred_by
                };

                localStorage.setItem('unicorn_current_user', JSON.stringify(userData));
                onLogin(userData);
            }
        } catch (err: any) {
            setError(err.message || 'อีเมลหรือรหัสผ่านไม่ถูกต้อง');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSocialLogin = async (provider: 'google' | 'line') => {
        try {
            setIsLoading(true);
            const { error } = await supabase.auth.signInWithOAuth({
                provider,
                options: {
                    redirectTo: window.location.origin
                }
            });
            if (error) throw error;
        } catch (err: any) {
            setError(`ไม่สามารถเข้าสู่ระบบด้วย ${provider} ได้: ${err.message}`);
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0">
                <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-amber-500/8 rounded-full blur-3xl" />
                <div className="absolute bottom-1/3 right-1/4 w-60 h-60 bg-violet-500/8 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 w-full max-w-md">
                {/* Back button */}
                <button
                    onClick={() => onNavigate(AppView.LANDING)}
                    className="group flex items-center gap-2 text-sm text-slate-500 hover:text-white mb-8 transition-colors"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    กลับหน้าแรก
                </button>

                {/* Login Card */}
                <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-8 lg:p-10 shadow-2xl backdrop-blur-xl">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-14 h-14 bg-amber-500 rounded-2xl flex items-center justify-center font-black text-2xl mx-auto mb-4 shadow-xl shadow-amber-500/25">U</div>
                        <h1 className="text-2xl font-black text-white tracking-tight">ยินดีต้อนรับกลับ!</h1>
                        <p className="text-sm text-slate-400 mt-1">เข้าสู่ระบบเพื่อเริ่มต้นเส้นทางความสำเร็จ 🦄</p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 mb-6 animate-fade-in">
                            <p className="text-sm text-red-400 font-medium text-center">{error}</p>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email */}
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">อีเมล</label>
                            <div className="relative">
                                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="name@example.com"
                                    className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all text-sm font-medium"
                                    id="login-email"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">รหัสผ่าน</label>
                            <div className="relative">
                                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-12 pr-12 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all text-sm font-medium"
                                    id="login-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                                    aria-label={showPassword ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 bg-amber-500 text-slate-950 font-black rounded-2xl hover:bg-amber-400 transition-all shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base"
                            id="login-submit"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
                            ) : (
                                <>
                                    <LogIn size={18} />
                                    เข้าสู่ระบบ
                                </>
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center gap-3 my-6">
                        <div className="flex-1 h-px bg-white/10" />
                        <span className="text-xs text-slate-600 font-medium">หรือ</span>
                        <div className="flex-1 h-px bg-white/10" />
                    </div>

                    {/* Register Link */}
                    <div className="text-center">
                        <p className="text-sm text-slate-500">
                            ยังไม่ได้เป็นสมาชิก?{' '}
                            <button
                                onClick={() => onNavigate(AppView.REGISTER)}
                                className="text-amber-500 font-bold hover:text-amber-400 transition-colors inline-flex items-center gap-1"
                            >
                                <Sparkles size={14} />
                                ลงทะเบียนฟรี
                            </button>
                        </p>
                    </div>

                    <div className="flex items-center gap-3 my-6">
                        <div className="flex-1 h-px bg-white/10" />
                        <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">หรือเข้าสู่ระบบด้วย</span>
                        <div className="flex-1 h-px bg-white/10" />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={() => handleSocialLogin('google')}
                            disabled={isLoading}
                            className="flex items-center justify-center gap-2 py-3 bg-white/5 border border-white/10 rounded-2xl text-white font-bold text-sm hover:bg-white/10 transition-all group disabled:opacity-50"
                        >
                            <img src="https://www.google.com/favicon.ico" className="w-4 h-4 grayscale group-hover:grayscale-0 transition-all" alt="Google" />
                            Google
                        </button>
                        <button
                            onClick={() => handleSocialLogin('line')}
                            disabled={isLoading}
                            className="flex items-center justify-center gap-2 py-3 bg-white/5 border border-white/10 rounded-2xl text-white font-bold text-sm hover:bg-white/10 transition-all group disabled:opacity-50"
                        >
                            <div className="w-4 h-4 bg-emerald-500 rounded-sm flex items-center justify-center text-[10px] font-black text-white">L</div>
                            LINE
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;

