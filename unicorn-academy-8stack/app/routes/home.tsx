import { Link, useLoaderData } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { createServerSupabase } from "@/lib/supabase-server";

export function meta() {
  return [
    { title: "Unicorn Smart AI — แพลตฟอร์มอัจฉริยะสำหรับ Unicorn Biz Coach" },
    { name: "description", content: "สมาร์ทแพลตฟอร์มที่ออกแบบมาเพื่อคุณ ผสานเทคโนโลยี AI และระบบการเรียนรู้สมัยใหม่ เพื่อสร้างผลลัพธ์ที่จับต้องได้จริง" },
  ];
}

export async function loader({ request }: LoaderFunctionArgs) {
  const responseHeaders = new Headers();
  const supabase = createServerSupabase(request, responseHeaders);
  const { data: { user } } = await supabase.auth.getUser();
  return { user };
}

export default function HomePage() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <main className="min-h-screen relative overflow-hidden bg-bg-page font-body text-text-primary">
      {/* ── Background Aura Effects ── */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] 
                        bg-brand-gold-light/20 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] 
                        bg-brand-gold/5 blur-[120px] rounded-full" />
      </div>

      {/* ── Navbar ── */}
      <nav className="relative z-20 px-6 py-4 border-b border-border-default/50 bg-white/70 backdrop-blur-md sticky top-0">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white
                            font-black text-xl flex-shrink-0 shadow-md shadow-brand-gold/10"
                 style={{ background: "linear-gradient(135deg, var(--brand-gold), var(--brand-gold-hover))" }}>
              U
            </div>
            <div>
              <div className="font-display font-bold text-lg text-text-primary leading-tight tracking-tight">
                UNICORN <span className="text-brand-gold font-extrabold">SMART AI</span>
              </div>
              <div className="text-[9px] font-bold text-text-muted uppercase tracking-[0.25em] -mt-0.5">
                Premium Innovation
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <a href="https://unicorngloballink.com/" target="_blank" rel="noopener noreferrer" 
               className="text-text-secondary hover:text-brand-gold transition-colors text-xs font-bold flex items-center gap-1">
              🌐 เว็บไซต์บริษัท UGL
            </a>
            <div className="h-4 w-px bg-border-default/80" />
            <div className="flex items-center gap-4">
              {user ? (
                <Link to="/dashboard" className="btn-gold px-6 text-sm">
                  เข้าสู่หน้าควบคุม
                </Link>
              ) : (
                <>
                  <Link to="/auth/login" className="text-text-secondary hover:text-text-primary transition-colors text-sm font-semibold">
                    เข้าสู่ระบบ
                  </Link>
                  <Link to="/auth/register" className="btn-gold px-6 text-sm">
                    สมัครสมาชิก
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section className="relative z-10 flex flex-col items-center justify-center pt-24 pb-32 px-6">
        <div className="max-w-5xl w-full text-center space-y-10">
          
          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full 
                          bg-white/80 border border-border-default/60 shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-brand-gold animate-pulse" />
            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-[0.2em]">
              Smart Business Platform 2026
            </span>
          </div>

          {/* Main Headline */}
          <div className="space-y-6">
            <h1 className="font-display font-bold text-5xl md:text-8xl text-text-primary leading-[1.1] tracking-tight">
              ยกระดับธุรกิจ <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold via-brand-gold-muted to-brand-gold-hover">
                สู่อนาคตที่เหนือกว่า
              </span>
            </h1>
            <p className="text-text-secondary text-base md:text-lg max-w-3xl mx-auto leading-relaxed font-light">
              สมาร์ทแพลตฟอร์มเพื่อ <span className="font-semibold text-brand-gold">Unicorn Biz Coach</span> ที่ออกแบบมาเพื่อคุณโดยเฉพาะ 
              ผสานเทคโนโลยีปัญญาประดิษฐ์ AI และระบบการเรียนรู้แบบสมัยใหม่ เพื่อเร่งความสำเร็จให้ธุรกิจของคุณ
            </p>
          </div>

          {/* Hero Action Button */}
          <div className="flex justify-center pt-4">
            <Link to={user ? "/dashboard" : "/auth/login"}
                  className="btn-gold px-14 py-4 text-base rounded-xl shadow-lg shadow-brand-gold/10 hover:scale-[1.03] transition-transform duration-200">
              {user ? "เข้าสู่แดชบอร์ด" : "เริ่มต้นใช้งานระบบ"}
            </Link>
          </div>

          {/* Features Bento Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 pt-24 text-left">
            {[
              { 
                title: "Eco-system", 
                desc: "ระบบนิเวศทางธุรกิจที่ครบวงจรที่สุด เพื่อความมั่นคงและยั่งยืนในระยะยาว", 
                icon: "⚡", 
                bg: "bg-[#fffcf6] border-brand-gold/10" 
              },
              { 
                title: "Product Strength", 
                desc: "นวัตกรรมสินค้าชั้นเลิศที่ตอบโจทย์ความต้องการของผู้บริโภคยุคใหม่", 
                icon: "🏆", 
                bg: "bg-white" 
              },
              { 
                title: "AI & Digital Tools", 
                desc: "เครื่องมืออัจฉริยะและน้องยูนิ AI Coach ที่ช่วยย่อเวลาการเรียนรู้และขยายธุรกิจ", 
                icon: "✨", 
                bg: "bg-white" 
              },
              { 
                title: "High Reward", 
                desc: "แผนรายได้และผลตอบแทนที่คุ้มค่า ออกแบบมาเพื่อความสำเร็จของทุกคน", 
                icon: "⭐", 
                bg: "bg-white" 
              },
            ].map((f, i) => (
              <div key={i} className={`card-premium p-8 group relative ${f.bg}`}>
                <div className="w-12 h-12 rounded-xl bg-bg-hover flex items-center justify-center text-2xl mb-6 group-hover:scale-110 group-hover:bg-brand-gold-light/45 transition-all duration-300">
                  {f.icon}
                </div>
                <h3 className="text-base font-bold text-text-primary mb-3 font-display tracking-tight">{f.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed font-light">{f.desc}</p>
                <div className="absolute bottom-4 right-4 w-1.5 h-1.5 rounded-full bg-brand-gold/0 group-hover:bg-brand-gold/50 transition-all duration-300" />
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="relative z-10 py-16 border-t border-border-default/40 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md flex items-center justify-center text-white font-black text-xs"
                   style={{ background: "linear-gradient(135deg, var(--brand-gold), var(--brand-gold-hover))" }}>
                U
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-text-secondary">
                Unicorn Academy
              </span>
            </div>
            <a href="https://unicorngloballink.com/" target="_blank" rel="noopener noreferrer" 
               className="text-xs text-brand-gold font-bold hover:underline transition-all">
              🌐 เว็บไซต์บริษัท (Unicorn Global Link)
            </a>
          </div>
          <div className="text-text-muted text-xs font-medium">
            © 2026 Unicorn Academy. All Rights Reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}
