"use client";
export const dynamic = "force-dynamic";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  LogIn,
  Sparkles,
  Loader2,
} from "lucide-react";
import { createClient } from "@/lib/supabase";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("กรุณากรอก Username และรหัสผ่านให้ครบถ้วน");
      return;
    }

    setIsLoading(true);

    try {
      // Transform username to safe email
      const safeUsername = username.toLowerCase().replace(/\s+/g, "");
      const fakeEmail = `${safeUsername}@unicorn.systems`;

      // Sign in via Supabase Auth
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: fakeEmail,
        password,
      });

      if (authError) throw authError;

      // Redirect to dashboard on success
      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "Username หรือรหัสผ่านไม่ถูกต้อง");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBypass = async () => {
    setError("");
    setIsLoading(true);

    const fakeEmail = "densmartai@gmail.com";
    const testerPassword = "Tester123456!";

    try {
      // 1. Sign in directly with the working test user that exists in the database
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: fakeEmail,
        password: testerPassword,
      });

      if (authError) throw authError;

      // 2. Redirect to dashboard on success
      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      console.error("Bypass error:", err);
      setError(err.message || "ไม่สามารถข้ามการเข้าระบบได้");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-dark flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorative Lights */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-brand-gold/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/3 right-1/4 w-60 h-60 bg-yellow-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Back to Home Button */}
        <Link
          href="/"
          className="group flex items-center gap-2 text-sm text-white/50 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span>กลับหน้าแรก</span>
        </Link>

        {/* Login Card */}
        <div className="glass p-8 md:p-10 shadow-2xl border-white/10 relative overflow-hidden bg-white/[0.02]">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-brand-gold/30 to-transparent" />

          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-brand-gold rounded-2xl flex items-center justify-center font-display font-black text-2xl mx-auto mb-4 shadow-xl shadow-brand-gold/15 text-brand-dark select-none">
              U
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">ยินดีต้อนรับกลับ! 🦄</h1>
            <p className="text-xs text-white/50 mt-1.5 font-medium">เข้าสู่ระบบเพื่อเริ่มต้นเส้นทางความสำเร็จอัจฉริยะ</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6">
              <p className="text-xs text-red-400 font-semibold text-center">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-white/40 uppercase tracking-widest">Username</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 font-bold text-sm">@</div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="yourname"
                  className="w-full pl-10 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-brand-gold/50 focus:ring-1 focus:ring-brand-gold/20 transition-all text-sm font-semibold"
                  id="login-username"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-white/40 uppercase tracking-widest">รหัสผ่าน</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-brand-gold/50 focus:ring-1 focus:ring-brand-gold/20 transition-all text-sm font-semibold"
                  id="login-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors"
                  aria-label={showPassword ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-brand-gold text-brand-dark font-black rounded-xl hover:bg-brand-gold/90 transition-all shadow-xl shadow-brand-gold/10 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm uppercase tracking-wider"
              id="login-submit"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <LogIn size={16} />
                  <span>เข้าสู่ระบบ</span>
                </>
              )}
            </button>

            {/* Bypass Button for Internal Testing */}
            <button
              type="button"
              onClick={handleBypass}
              disabled={isLoading}
              className="w-full py-3.5 bg-yellow-500/10 hover:bg-yellow-500/20 text-brand-gold border border-brand-gold/30 font-bold rounded-xl transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-xs tracking-wider mt-3"
              id="login-bypass"
            >
              <Sparkles size={14} className="text-brand-gold animate-pulse" />
              <span>🚀 ปลดล็อกเข้าทดสอบภายใน (Internal Dev Bypass)</span>
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-white/5" />
            <span className="text-[10px] text-white/20 font-black uppercase tracking-widest">หรือ</span>
            <div className="flex-1 h-px bg-white/5" />
          </div>

          {/* Register Link */}
          <div className="text-center">
            <p className="text-xs text-white/40 font-medium">
              ยังไม่ได้เป็นสมาชิก?{" "}
              <Link
                href="/auth/register"
                className="text-brand-gold font-bold hover:text-brand-gold/80 transition-colors inline-flex items-center gap-1 hover:underline"
              >
                <Sparkles size={12} className="animate-pulse" />
                ลงทะเบียนฟรี
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
