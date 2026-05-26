// src/app/page.tsx
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen relative overflow-hidden bg-white">
      {/* ── Background Elements ── */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] 
                        bg-brand-gold/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] 
                        bg-brand-violet/5 blur-[100px] rounded-full" />
      </div>

      {/* ── Navbar ── */}
      <nav className="relative z-20 px-6 py-6 flex items-center justify-between max-w-7xl mx-auto border-b border-slate-100 bg-white/70 backdrop-blur-md sticky top-0">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white
                          font-black text-xl flex-shrink-0"
               style={{ background: "linear-gradient(135deg,#c0281e,#e8621a)" }}>
            U
          </div>
          <div className="hidden sm:block">
            <div className="font-display font-black text-lg text-slate-900 leading-tight uppercase tracking-tight">
              Unicorn <span className="text-brand-gold">Smart AI</span>
            </div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] -mt-0.5">
              Premium Innovation
            </div>
          </div>
        </div>
        <div className="flex gap-4">
          <Link href="/auth/login" className="text-slate-600 hover:text-slate-900 transition-colors text-sm font-bold pt-2">
            เข้าสู่ระบบ
          </Link>
          <Link href="/auth/register" className="btn-gold px-8 text-sm">
            สมัครสมาชิก
          </Link>
        </div>
      </nav>

      {/* ── Hero Content ── */}
      <section className="relative z-10 flex flex-col items-center justify-center pt-20 pb-32 px-4">
        <div className="max-w-5xl w-full text-center space-y-12">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full 
                          bg-slate-50 border border-slate-200">
            <span className="flex h-2 w-2 rounded-full bg-brand-gold" />
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
              Smart Business Platform 2026
            </span>
          </div>

          {/* Headlines */}
          <div className="space-y-6">
            <h1 className="font-display font-black text-5xl md:text-8xl text-slate-900 leading-[1.1] tracking-tight">
              ยกระดับธุรกิจ <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold via-brand-amber to-brand-orange">
                สู่อนาคตที่เหนือกว่า
              </span>
            </h1>
            <p className="font-body text-slate-500 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
              สมาร์ทแพลตฟอร์มเพื่อ Unicorn Biz Coach ที่ออกแบบมาเพื่อคุณ <br className="hidden md:block" />
              ผสานเทคโนโลยี AI และระบบการเรียนรู้แบบสมัยใหม่ เพื่อสร้างผลลัพธ์ที่จับต้องได้จริง
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-center pt-4">
            <a href="https://www.uglplatform.com/"
               target="_blank" rel="noopener noreferrer"
               className="btn-gold px-14 py-4 text-base">
              เข้าระบบ
            </a>
          </div>

          {/* Biz Advantages Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 pt-24 text-left">
            {[
              { title: "Eco-system",        desc: "ระบบนิเวศทางธุรกิจที่ครบวงจรที่สุด",          icon: "⚡", bg: "bg-amber-50" },
              { title: "Product Strength",  desc: "นวัตกรรมสินค้าที่ตอบโจทย์ไลฟ์สไตล์",         icon: "🏆", bg: "bg-indigo-50" },
              { title: "AI & Digital Tools",desc: "เครื่องมืออัจฉริยะช่วยขยายธุรกิจ",           icon: "🤖", bg: "bg-violet-50" },
              { title: "High Reward",       desc: "ผลตอบแทนที่คุ้มค่าและยั่งยืน",               icon: "⭐", bg: "bg-emerald-50" },
            ].map((f, i) => (
              <div key={i} className="card-premium p-7 group">
                <div className={`w-12 h-12 rounded-xl ${f.bg} flex items-center justify-center text-2xl mb-5 group-hover:scale-110 transition-transform`}>
                  {f.icon}
                </div>
                <h3 className="text-base font-black text-slate-900 mb-2">{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="relative z-10 py-20 border-t border-slate-100 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 text-center">
            <div className="text-slate-400 text-xs font-medium">
              © 2026 Unicorn Academy. All Rights Reserved.
            </div>
        </div>
      </footer>
    </main>
  );
}
