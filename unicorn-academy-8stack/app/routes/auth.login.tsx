import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Lock, Eye, EyeOff, ArrowLeft, LogIn, Gem, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase";

export function meta() {
  return [
    { title: "เข้าสู่ระบบ — Unicorn Smart AI" },
    { name: "description", content: "เข้าสู่ระบบ Unicorn Smart AI Platform" },
  ];
}

export default function LoginPage() {
  const navigate = useNavigate();
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
      const safeUsername = username.toLowerCase().replace(/\s+/g, "");
      const fakeEmail = `${safeUsername}@unicorn.systems`;

      // 1. Verify credentials with UGL Platform and auto-provision in Supabase
      const checkRes = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: safeUsername, password }),
      });

      const checkData = await checkRes.json();

      if (!checkRes.ok || !checkData.success) {
        throw new Error(checkData.error || "ไม่สามารถเข้าสู่ระบบ UGL ได้");
      }

      // 2. Establish local session with Supabase using synced credentials
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: fakeEmail,
        password,
      });

      if (authError) throw authError;

      navigate("/dashboard");
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
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: fakeEmail,
        password: testerPassword,
      });

      if (authError) throw authError;

      navigate("/dashboard");
    } catch (err: any) {
      console.error("Bypass error:", err);
      setError(err.message || "ไม่สามารถข้ามการเข้าระบบได้");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-page flex items-center justify-center p-4 relative overflow-hidden font-body">
      {/* Background Decorative Lights */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-brand-gold-light/40 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/3 right-1/4 w-60 h-60 bg-brand-gold/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Back to Home Button */}
        <Link
          to="/"
          className="group flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary mb-6 transition-colors font-semibold"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span>กลับหน้าแรก</span>
        </Link>

        {/* Login Card */}
        <div className="glass p-8 md:p-10 shadow-card border-border-default relative overflow-hidden bg-white/95">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-brand-gold/40 to-transparent" />

          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-brand-gold rounded-2xl flex items-center justify-center font-display font-black text-2xl mx-auto mb-4 shadow-md text-white select-none">
              🦄
            </div>
            <h1 className="text-2xl font-bold font-display text-text-primary tracking-tight">ยินดีต้อนรับกลับ! 👋</h1>
            <p className="text-xs text-text-muted mt-1.5 font-medium">เข้าสู่ระบบเพื่อเริ่มต้นเส้นทางความสำเร็จอัจฉริยะ</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <p className="text-xs text-red-700 font-semibold text-center">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-text-secondary uppercase tracking-widest">Username</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted font-bold text-sm">@</div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="yourname"
                  className="w-full pl-10 pr-4 py-3.5 bg-bg-input border border-border-default rounded-xl text-text-primary placeholder-text-muted focus:outline-none focus:border-brand-gold-muted focus:ring-1 focus:ring-brand-gold-muted/20 transition-all text-sm font-semibold"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-text-secondary uppercase tracking-widest">รหัสผ่าน</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-3.5 bg-bg-input border border-border-default rounded-xl text-text-primary placeholder-text-muted focus:outline-none focus:border-brand-gold-muted focus:ring-1 focus:ring-brand-gold-muted/20 transition-all text-sm font-semibold"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
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
              className="w-full py-4 btn-gold rounded-xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm uppercase tracking-wider font-semibold"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin text-white" />
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
              className="w-full py-3 bg-brand-gold-light hover:bg-brand-gold-light/80 text-brand-gold border border-brand-gold-muted font-bold rounded-xl transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-2xs tracking-wide mt-3"
            >
              <Gem size={14} className="text-brand-gold animate-pulse" />
              <span>🚀 ปลดล็อกเข้าทดสอบภายใน (Internal Dev Bypass)</span>
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-border-default" />
            <span className="text-[10px] text-text-muted font-black uppercase tracking-widest">หรือ</span>
            <div className="flex-1 h-px bg-border-default" />
          </div>

          {/* Register Link */}
          <div className="text-center">
            <p className="text-xs text-text-secondary font-medium">
              ยังไม่ได้เป็นสมาชิก?{" "}
              <Link
                to="/auth/register"
                className="text-brand-gold font-bold hover:text-brand-gold-hover transition-colors inline-flex items-center gap-1 hover:underline"
              >
                <Gem size={12} className="animate-pulse" />
                ลงทะเบียนฟรี
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
