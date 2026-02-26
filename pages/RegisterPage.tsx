
import React, { useState } from 'react';
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
    Sparkles
} from 'lucide-react';
import { AppView, User } from '../types';

interface RegisterPageProps {
    onNavigate: (view: AppView) => void;
    onRegister: (user: User) => void;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ onNavigate, onRegister }) => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const passwordChecks = [
        { label: 'อย่างน้อย 6 ตัวอักษร', valid: password.length >= 6 },
        { label: 'รหัสผ่านตรงกัน', valid: password === confirmPassword && confirmPassword.length > 0 },
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!fullName || !email || !password || !confirmPassword) {
            setError('กรุณากรอกข้อมูลให้ครบทุกช่อง');
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

        // Phase 1: localStorage auth
        try {
            await new Promise(resolve => setTimeout(resolve, 800));

            const storedUsers = JSON.parse(localStorage.getItem('unicorn_users') || '[]');

            // Check if email already exists
            if (storedUsers.some((u: User) => u.email === email)) {
                setError('อีเมลนี้ถูกใช้แล้ว กรุณาใช้อีเมลอื่น');
                setIsLoading(false);
                return;
            }

            const newUser: User & { password: string } = {
                id: `user_${Date.now()}`,
                fullName,
                email,
                phone: phone || undefined,
                password,
                createdAt: new Date().toISOString(),
            };

            storedUsers.push(newUser);
            localStorage.setItem('unicorn_users', JSON.stringify(storedUsers));

            const { password: _, ...userWithoutPassword } = newUser;
            localStorage.setItem('unicorn_current_user', JSON.stringify(userWithoutPassword));
            onRegister(userWithoutPassword);
        } catch {
            setError('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
        } finally {
            setIsLoading(false);
        }
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

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 mb-6 animate-fade-in">
                            <p className="text-sm text-red-400 font-medium text-center">{error}</p>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Full Name */}
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">ชื่อ-นามสกุล</label>
                            <div className="relative">
                                <UserIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    placeholder="สมชาย ใจดี"
                                    className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all text-sm font-medium"
                                    id="register-fullname"
                                />
                            </div>
                        </div>

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
                                    id="register-email"
                                />
                            </div>
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                                เบอร์โทร <span className="text-slate-600 normal-case tracking-normal">(ไม่บังคับ)</span>
                            </label>
                            <div className="relative">
                                <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="081-234-5678"
                                    className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all text-sm font-medium"
                                    id="register-phone"
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
                                    placeholder="อย่างน้อย 6 ตัวอักษร"
                                    className="w-full pl-12 pr-12 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all text-sm font-medium"
                                    id="register-password"
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

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">ยืนยันรหัสผ่าน</label>
                            <div className="relative">
                                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="ยืนยันรหัสผ่านอีกครั้ง"
                                    className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all text-sm font-medium"
                                    id="register-confirm-password"
                                />
                            </div>
                        </div>

                        {/* Password Strength Indicators */}
                        {password && (
                            <div className="flex flex-wrap gap-3 animate-fade-in">
                                {passwordChecks.map((check, i) => (
                                    <div key={i} className="flex items-center gap-1.5">
                                        <CheckCircle2 size={14} className={check.valid ? 'text-emerald-400' : 'text-slate-600'} />
                                        <span className={`text-xs font-medium ${check.valid ? 'text-emerald-400' : 'text-slate-600'}`}>
                                            {check.label}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 bg-amber-500 text-slate-950 font-black rounded-2xl hover:bg-amber-400 transition-all shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base mt-2"
                            id="register-submit"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
                            ) : (
                                <>
                                    <UserPlus size={18} />
                                    ลงทะเบียน
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

                    {/* Login Link */}
                    <div className="text-center">
                        <p className="text-sm text-slate-500">
                            เป็นสมาชิกแล้ว?{' '}
                            <button
                                onClick={() => onNavigate(AppView.LOGIN)}
                                className="text-amber-500 font-bold hover:text-amber-400 transition-colors"
                            >
                                เข้าสู่ระบบ
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
