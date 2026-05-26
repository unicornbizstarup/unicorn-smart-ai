"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  UserPlus,
  User as UserIcon,
  Sparkles,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { createClient } from "@/lib/supabase";
import Link from "next/link";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const refSlug = searchParams.get("ref");

  const passwordChecks = [
    { label: "อย่างน้อย 6 ตัวอักษร", valid: password.length >= 6 },
    { label: "รหัสผ่านสองช่องตรงกัน", valid: password === confirmPassword && confirmPassword.length > 0 },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!fullName || !username || !password || !confirmPassword) {
      setError("กรุณากรอกข้อมูลให้ครบทุกช่อง");
      return;
    }

    if (username.length < 3) {
      setError("Username ต้องมีอย่างน้อย 3 ตัวอักษร");
      return;
    }

    if (password.length < 6) {
      setError("รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร");
      return;
    }

    if (password !== confirmPassword) {
      setError("รหัสผ่านไม่ตรงกัน กรุณาตรวจสอบอีกครั้ง");
      return;
    }

    setIsLoading(true);

    try {
      const cleanUsername = username.toLowerCase().replace(/\s+/g, "");
      const fakeEmail = `${cleanUsername}@unicorn.systems`;

      // 1. Sign up via Supabase Auth
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: fakeEmail,
        password,
        options: {
          data: {
            full_name: fullName,
            username: cleanUsername,
            phone: "",
          },
        },
      });

      if (signUpError) throw signUpError;

      if (data.user) {
        // 2. Update profiles table's referral_slug to the chosen username
        // The profiles table is automatically created via trigger. We update it to the desired username slug.
        const { error: profileError } = await supabase
          .from("profiles")
          .update({ referral_slug: cleanUsername })
          .eq("id", data.user.id);

        if (profileError) {
          console.error("Error setting referral slug:", profileError);
        }

        // Redirect to dashboard on success
        router.push("/dashboard");
        router.refresh();
      } else {
        setError("สมัครสมาชิกเสร็จสิ้น กรุณาเช็คกล่องข้อความเพื่อยืนยันตัวตนหรือลองเข้าสู่ระบบ");
      }
    } catch (err: any) {
      console.error("Register error:", err);
      if (err.message?.includes("already registered") || err.message?.includes("already been registered")) {
        setError("ชื่อผู้ใช้นี้ถูกลงทะเบียนไปแล้ว กรุณาเข้าสู่ระบบแทน");
      } else {
        setError(err.message || "เกิดข้อผิดพลาดในการลงทะเบียน กรุณาลองใหม่อีกครั้ง");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-dark flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorative Lights */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-brand-gold/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 left-1/4 w-60 h-60 bg-emerald-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-md my-8">
        {/* Back to Home Button */}
        <Link
          href="/"
          className="group flex items-center gap-2 text-sm text-white/50 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span>กลับหน้าแรก</span>
        </Link>

        {/* Register Card */}
        <div className="glass p-8 md:p-10 shadow-2xl border-white/10 relative overflow-hidden bg-white/[0.02]">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-brand-gold/30 to-transparent" />

          {/* Recruiter Welcome Banner */}
          {refSlug && (
            <div className="bg-brand-gold/10 border border-brand-gold/25 text-brand-gold px-4 py-2.5 rounded-xl text-xs font-semibold text-center mb-6 animate-pulse">
              🤝 ยินดีต้อนรับ! คุณกำลังเข้าร่วมทีมของ <strong>@{refSlug}</strong>
            </div>
          )}

          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-14 h-14 bg-gradient-to-br from-brand-gold/80 to-brand-gold rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-brand-gold/15">
              <Sparkles size={24} className="text-brand-dark" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">เข้าร่วม Unicorn Academy 🦄</h1>
            <p className="text-xs text-white/50 mt-1.5 font-medium">ลงทะเบียนสมาชิกใหม่เพื่อเริ่มต้นเส้นทางนักธุรกิจ AI</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6">
              <p className="text-xs text-red-400 font-semibold text-center">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-black text-white/40 uppercase tracking-widest">ชื่อ - นามสกุล</label>
              <div className="relative">
                <UserIcon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="สมชาย ใจดี"
                  className="w-full pl-10 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-brand-gold/50 focus:ring-1 focus:ring-brand-gold/20 transition-all text-sm font-semibold"
                />
              </div>
            </div>

            {/* Username */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-black text-white/40 uppercase tracking-widest">Username (สำหรับทำลิงก์บอกต่อ)</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 font-bold text-sm">@</div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, ""))}
                  placeholder="yourname"
                  className="w-full pl-10 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-brand-gold/50 focus:ring-1 focus:ring-brand-gold/20 transition-all text-sm font-semibold"
                />
              </div>
            </div>

            {/* Passwords grid */}
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-black text-white/40 uppercase tracking-widest">รหัสผ่าน</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-12 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-brand-gold/50 focus:ring-1 focus:ring-brand-gold/20 transition-all text-sm font-semibold"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-black text-white/40 uppercase tracking-widest">ยืนยันรหัสผ่าน</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-brand-gold/50 focus:ring-1 focus:ring-brand-gold/20 transition-all text-sm font-semibold"
                  />
                </div>
              </div>
            </div>

            {/* Password checklist */}
            <div className="flex gap-4 pt-1 bg-white/[0.01] p-3.5 rounded-xl border border-white/5">
              {passwordChecks.map((check, idx) => (
                <div key={idx} className="flex items-center gap-1.5 text-[10px] font-semibold text-white/50">
                  <CheckCircle2 size={12} className={check.valid ? "text-emerald-400" : "text-white/20"} />
                  <span className={check.valid ? "text-emerald-400/80" : "text-white/30"}>{check.label}</span>
                </div>
              ))}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-brand-gold text-brand-dark font-black rounded-xl hover:bg-brand-gold/90 transition-all shadow-xl shadow-brand-gold/10 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm uppercase tracking-wider mt-2"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <UserPlus size={16} />
                  <span>สมัครสมาชิก</span>
                </>
              )}
            </button>
          </form>

          {/* Login Link */}
          <p className="text-center text-xs text-white/40 mt-6 font-medium">
            มีบัญชีสมาชิกแล้ว?{" "}
            <Link href="/auth/login" className="text-brand-gold font-bold hover:text-brand-gold/80 hover:underline">
              เข้าสู่ระบบที่นี่
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-brand-dark flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-brand-gold/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 left-1/4 w-60 h-60 bg-emerald-500/5 rounded-full blur-[100px]" />
        </div>
        <div className="relative z-10 text-center">
          <Loader2 className="w-10 h-10 animate-spin text-brand-gold mx-auto mb-4" />
          <p className="text-white/60 text-sm font-semibold">กำลังโหลด...</p>
        </div>
      </div>
    }>
      <RegisterForm />
    </Suspense>
  );
}
