import React, { Suspense } from "react";
import { Link, useSearchParams } from "react-router";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";

export function meta() {
  return [
    { title: "ขั้นตอนเข้าร่วมธุรกิจ — Unicorn Smart AI" },
    { name: "description", content: "ขั้นตอนการร่วมธุรกิจและเข้าใช้งานระบบสมาชิก Unicorn Global Link" },
  ];
}

function RegisterForm() {
  const [searchParams] = useSearchParams();
  const refSlug = searchParams.get("ref");

  return (
    <div className="min-h-screen bg-bg-page flex items-center justify-center p-4 relative overflow-hidden font-body">
      {/* Background Decorative Lights */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-brand-gold-light/40 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 left-1/4 w-60 h-60 bg-brand-gold/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-lg my-8">
        {/* Back to Home Button */}
        <Link
          to="/"
          className="group flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary mb-6 transition-colors font-semibold"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span>กลับหน้าแรก</span>
        </Link>

        {/* Register Card */}
        <div className="glass p-8 md:p-10 shadow-card border-border-default relative overflow-hidden bg-white/95 rounded-3xl">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-brand-gold/40 to-transparent" />

          {/* Recruiter Welcome Banner */}
          {refSlug && (
            <div className="bg-brand-gold-light/50 border border-brand-gold-muted text-brand-gold px-4 py-2.5 rounded-xl text-xs font-semibold text-center mb-6 select-none">
              🤝 ผู้แนะนำของคุณคือ: <strong>@{refSlug}</strong>
            </div>
          )}

          {/* Header */}
          <div className="text-center mb-10">
            <div className="w-14 h-14 bg-brand-gold rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md text-white select-none">
              🦄
            </div>
            <h1 className="text-2xl font-bold font-display text-text-primary tracking-tight">ขั้นตอนการเข้าร่วมธุรกิจ</h1>
            <p className="text-xs text-text-muted mt-1.5 font-medium">เริ่มต้นเส้นทางนักธุรกิจยุคดิจิทัลกับพวกเรา</p>
          </div>

          {/* Steps List */}
          <div className="space-y-5 text-left">
            {/* Step 1 */}
            <div className="flex gap-4 p-4.5 rounded-2xl bg-white border border-border-default shadow-sm hover:border-brand-gold/30 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-brand-gold-light/30 flex items-center justify-center shrink-0 text-brand-gold font-bold select-none text-sm">
                1
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-text-primary">สมัครสมาชิกร่วมธุรกิจ</h4>
                <p className="text-xs text-text-secondary leading-relaxed font-semibold">
                  สมัครสมาชิกร่วมธุรกิจกับ ทาง บริษัท ยูนิคอร์น โกลบอล ลิ้งค์ จำกัด
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-4 p-4.5 rounded-2xl bg-[#fffcf6] border border-brand-gold/15 shadow-sm hover:border-brand-gold/30 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-brand-gold text-white flex items-center justify-center shrink-0 font-bold select-none text-sm">
                2
              </div>
              <div className="space-y-2.5 flex-1">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-text-primary">เข้าใช้งานระบบสนับสนุนสมาชิก</h4>
                  <p className="text-xs text-text-secondary leading-relaxed font-semibold">
                    เข้าใช้งานผ่าน ระบบสนับสนุนสมาชิก <a href="https://www.uglplatform.com/Account/Login" target="_blank" rel="noopener noreferrer" className="text-brand-gold hover:underline font-bold break-all">https://www.uglplatform.com/Account/Login</a>
                  </p>
                </div>
                <div>
                  <a
                    href="https://www.uglplatform.com/Account/Login"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-brand-gold font-bold hover:text-brand-gold-hover hover:underline transition-colors bg-white border border-brand-gold-muted/20 px-3.5 py-2 rounded-xl shadow-2xs"
                  >
                    <span>ไปยังระบบสนับสนุนสมาชิก UGL</span>
                    <ArrowRight size={12} />
                  </a>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-4 p-4.5 rounded-2xl bg-white border border-border-default shadow-sm hover:border-brand-gold/30 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-brand-gold-light/30 flex items-center justify-center shrink-0 text-brand-gold font-bold select-none text-sm">
                3
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-text-primary">ติดต่อผู้แนะนำธุรกิจ</h4>
                <p className="text-xs text-text-secondary leading-relaxed font-semibold">
                  หรือ ติดต่อผู้แนะนำธุรกิจยูนิคอร์นนี้ให้กับท่าน
                </p>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 my-8">
            <div className="flex-1 h-px bg-border-default" />
            <span className="text-[10px] text-text-muted font-black uppercase tracking-widest select-none">หรือ</span>
            <div className="flex-1 h-px bg-border-default" />
          </div>

          {/* Login Link */}
          <div className="text-center">
            <p className="text-xs text-text-secondary font-medium">
              มีบัญชีผู้ใช้งานแล้ว?{" "}
              <Link to="/auth/login" className="text-brand-gold font-bold hover:text-brand-gold-hover hover:underline transition-colors">
                เข้าสู่ระบบที่นี่
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-bg-page flex items-center justify-center p-4 relative overflow-hidden font-body">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-brand-gold-light/40 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 left-1/4 w-60 h-60 bg-brand-gold/10 rounded-full blur-[100px]" />
        </div>
        <div className="relative z-10 text-center">
          <Loader2 className="w-10 h-10 animate-spin text-brand-gold mx-auto mb-4" />
          <p className="text-text-secondary text-sm font-semibold">กำลังโหลด...</p>
        </div>
      </div>
    }>
      <RegisterForm />
    </Suspense>
  );
}
