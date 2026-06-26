import { createServerSupabase } from "@/lib/supabase-server";
import { useLoaderData, Link, data } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import type { Profile } from "@/types";

export function meta({ data }: { data: any }) {
  const profile = data?.profile as Profile | null;
  const name = profile?.display_name || profile?.full_name || "Unicorn Partner";
  return [
    { title: `${name} | Unicorn Academy` },
    { name: "description", content: profile?.quote || profile?.bio || "นักธุรกิจยูนิคอร์น — เปิดโอกาสร่วมธุรกิจกับเรา" },
  ];
}

export async function loader({ params, request }: LoaderFunctionArgs) {
  const { slug } = params;
  if (!slug) {
    throw new Response("Slug not provided", { status: 400 });
  }

  // Create standard server Supabase client
  const headers = new Headers();
  const supabase = createServerSupabase(request, headers);

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("referral_slug", slug)
    .single<Profile>();

  if (!profile) {
    throw new Response("Partner not found", { status: 404 });
  }

  // Track referral click (server-side RPC for efficiency)
  const { error: rpcError } = await supabase.rpc("increment_referral_clicks", { profile_id: profile.id });
  if (rpcError) {
    console.error("Increment clicks failed:", rpcError);
  }

  // Set the referral cookie on loader response headers
  headers.set("Set-Cookie", `unicorn_referrer=${profile.id}; Path=/; HttpOnly; Max-Age=${30 * 24 * 60 * 60}; SameSite=Lax; Secure`);

  return data({ profile, slug }, {
    headers: headers
  });
}

export default function ReferralPage() {
  const { profile, slug } = useLoaderData<typeof loader>();

  const levelLabels: Record<number, string> = { 1: "Foundation", 2: "Specialist", 3: "Strategic", 4: "Elite Master" };
  const level = (profile.ubc_level ?? 1) as 1 | 2 | 3 | 4;
  const displayName = profile.display_name || profile.full_name || "Partner";
  const initials = displayName.slice(0, 2).toUpperCase();
  const bioText = profile.bio || profile.ai_bio;
  const tags = profile.ai_tags?.filter(Boolean) ?? [];

  return (
    <div className="min-h-screen bg-bg-page text-text-primary font-body text-sm leading-relaxed pb-12">
      {/* Accent Top Line */}
      <div className="h-1 bg-brand-gold" />

      {/* Brand Navigation Bar */}
      <nav className="bg-white border-b border-border-default px-6 py-4 flex items-center justify-between shadow-sm relative z-20">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-sm select-none"
               style={{ background: "linear-gradient(135deg, var(--brand-dark), var(--brand-gold))" }}>
            U
          </div>
          <div>
            <div className="text-xs font-black text-text-primary tracking-wide">UNICORN GLOBAL LINK</div>
            <div className="text-[9px] font-bold text-text-muted uppercase tracking-wider">Smart AI Platform</div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-brand-gold font-bold bg-brand-gold-light/40 border border-brand-gold-muted/15 px-3 py-1 rounded-full shadow-inner">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          {profile.is_verified ? "Verified Partner" : "Unicorn Partner"}
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-4xl mx-auto px-4 pt-10 pb-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-brand-gold-light/10 to-transparent" />

        {/* Profile Avatar */}
        <div className="relative inline-block mb-4 z-10 select-none">
          <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-brand-gold mx-auto shadow-md">
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt={displayName} className="object-cover w-full h-full" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-2xl font-black text-white bg-brand-gold">
                {initials}
              </div>
            )}
          </div>
          {profile.is_verified && (
            <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full bg-brand-gold border-2 border-white flex items-center justify-center text-[10px] font-black text-white shadow-sm">
              ✓
            </div>
          )}
        </div>

        {/* UBC Level Badge */}
        <div className="inline-flex items-center gap-1.5 bg-brand-gold-light/50 border border-brand-gold-muted/20 rounded-full px-3.5 py-1 text-[10px] font-black text-brand-gold uppercase tracking-wider mb-3.5 z-10 relative">
          ⭐ UBC {level} · {levelLabels[level]}
        </div>

        {/* Name & Quote */}
        <h1 className="text-2xl font-display font-bold text-text-primary leading-tight mb-2 relative z-10">{displayName}</h1>
        {profile.expertise && (
          <p className="text-xs text-text-muted font-bold tracking-wider mb-4 relative z-10 uppercase">{profile.expertise}</p>
        )}

        {profile.quote && (
          <div className="text-sm text-text-secondary italic leading-relaxed max-w-md mx-auto px-4 relative z-10">
            <span className="text-brand-gold text-2xl leading-none align-[-0.2em] mr-1 font-display">“</span>
            {profile.quote}
            <span className="text-brand-gold text-2xl leading-none align-[-0.2em] ml-1 font-display">”</span>
          </div>
        )}
      </div>

      {/* 3-Slot Photo Gallery */}
      {profile.photo_urls && profile.photo_urls.length > 0 && (
        <div className="max-w-4xl mx-auto px-4 pb-8">
          <div className="grid grid-cols-3 gap-3">
            {profile.photo_urls.slice(0, 3).map((url, idx) => (
              <div key={idx} className="rounded-2xl overflow-hidden aspect-[3/4] relative bg-bg-input border border-border-default shadow-sm hover:border-brand-gold-muted transition-all">
                <img src={url} alt={profile.photo_captions?.[idx] || ""} className="object-cover w-full h-full" />
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                {profile.photo_captions?.[idx] && (
                  <div className="absolute bottom-3 left-3 right-3 text-[10px] font-bold text-white line-clamp-1">
                    {profile.photo_captions[idx]}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* About Sponsor / Bio Section */}
      <div className="max-w-4xl mx-auto px-4 mb-8">
        {(bioText || tags.length > 0) && (
          <div className="bg-white border border-border-default rounded-3xl shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-border-default bg-bg-input flex items-center gap-2">
              <span className="text-base select-none">👤</span>
              <span className="text-xs font-black text-text-primary uppercase tracking-wider">ผู้แนะนำที่ปรึกษาธุรกิจ</span>
            </div>
            <div className="p-5 space-y-4">
              <div className="text-base font-bold text-text-primary">{displayName}</div>
              {profile.expertise && (
                <div className="flex items-center gap-2 text-xs font-bold text-brand-gold">
                  <span className="inline-block w-4 h-0.5 rounded bg-brand-gold shrink-0" />
                  {profile.expertise}
                </div>
              )}
              {bioText && (
                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">{bioText}</p>
              )}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1.5 border-t border-border-muted">
                  {tags.map((tag, idx) => (
                    <span key={idx} className="bg-bg-input border border-border-default rounded-lg px-2.5 py-1 text-[10px] font-bold text-text-secondary">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* System Features Strip */}
      <div className="max-w-4xl mx-auto px-4 mb-8">
        <div className="text-center pb-4 space-y-1">
          <div className="inline-flex items-center gap-1.5 bg-brand-gold-light/40 border border-brand-gold-muted/20 rounded-full px-3.5 py-1 text-[9px] font-black text-brand-gold uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-gold" /> Smart AI Platform
          </div>
          <h2 className="text-xl font-display font-bold text-text-primary">ระบบการทำงานอัจฉริยะที่คุณจะได้ใช้</h2>
        </div>
        <div className="flex gap-3 pb-3 overflow-x-auto no-scrollbar scroll-smooth">
          {[
            { dot: "#b8924a", label: "AI Coach", desc: "น้องยูนิช่วยวางแผนและโค้ชชิ่งธุรกิจ 24 ชม." },
            { dot: "#e8621a", label: "Wealth DNA", desc: "ถอดรหัสศักยภาพและธาตุความมั่งคั่ง" },
            { dot: "#f5a623", label: "Missions", desc: "ระบบพัฒนาทักษะธุรกิจเป็นขั้นตอนชัดเจน" },
            { dot: "#10b981", label: "5 รายได้", desc: "สิทธิ์การรับรายได้ 8 ช่องทางที่รวดเร็วและคุ้มค่า" },
            { dot: "#8b5cf6", label: "Name Card", desc: "นามบัตรดิจิทัลสร้าง Personal Brand ส่วนตัว" },
          ].map((f) => (
            <div key={f.label} className="bg-white border border-border-default rounded-2xl p-4.5 min-w-[150px] shrink-0 shadow-sm">
              <div className="flex items-center gap-1.5 mb-1.5">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ background: f.dot }} />
                <span className="text-xs font-black text-text-primary tracking-wide">{f.label}</span>
              </div>
              <p className="text-[10px] text-text-muted leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Product Categories Section */}
      <div className="max-w-4xl mx-auto px-4 mb-8">
        <div className="text-center pb-4 space-y-1">
          <div className="inline-flex items-center gap-1.5 bg-brand-gold-light/40 border border-brand-gold-muted/20 rounded-full px-3.5 py-1 text-[9px] font-black text-brand-gold uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-gold" /> Product Lines
          </div>
          <h2 className="text-xl font-display font-bold text-text-primary">หมวดหมู่ <span className="text-brand-gold">ผลิตภัณฑ์นวัตกรรม</span></h2>
          <p className="text-xs text-text-muted">ครอบคลุมทุกไลฟ์สไตล์ มั่นใจด้วยมาตรฐานระดับสากล</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { icon: "🫀", label: "Health Care", desc: "นวัตกรรมเพื่อสุขภาพ ฟื้นฟูร่างกายและเสริมสร้างภูมิคุ้มกันระดับเซลล์", iconBg: "bg-emerald-50 text-emerald-700 border-emerald-100" },
            { icon: "✨", label: "Skin Care", desc: "นวัตกรรมบำรุงผิวพรรณอย่างล้ำลึก ย้อนวัยและคืนความอ่อนเยาว์อย่างธรรมชาติ", iconBg: "bg-pink-50 text-pink-700 border-pink-100" },
            { icon: "🧴", label: "Personal Care", desc: "ผลิตภัณฑ์ทำความสะอาดและดูแลสุขอนามัยในชีวิตประจำวันเพื่อครอบครัว", iconBg: "bg-indigo-50 text-indigo-700 border-indigo-100" },
            { icon: "🌱", label: "Agriculture", desc: "นวัตกรรมเพื่อเกษตรกรรมออร์แกนิก ปลอดภัยและเพิ่มผลผลิตยั่งยืน (U PLANT)", iconBg: "bg-lime-50 text-lime-700 border-lime-100" },
          ].map((p) => (
            <div key={p.label} className="bg-white border border-border-default rounded-2xl p-4 flex items-start gap-3.5 shadow-sm">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 border ${p.iconBg}`}>{p.icon}</div>
              <div>
                <div className="text-xs font-black text-text-primary mb-0.5">{p.label}</div>
                <div className="text-[11px] text-text-secondary leading-relaxed">{p.desc}</div>
              </div>
            </div>
          ))}
          <div className="sm:col-span-2 bg-white border border-border-default rounded-2xl p-4 flex items-start gap-3.5 shadow-sm">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 border bg-brand-gold-light/40 border-brand-gold-muted/20 text-brand-gold">💻</div>
            <div>
              <div className="text-xs font-black text-text-primary mb-0.5">Technology & Digital Tools</div>
              <div className="text-[11px] text-text-secondary leading-relaxed">นวัตกรรมเครื่องมืออัจฉริยะ AI Assistant และโปรแกรมพัฒนาธุรกิจส่วนบุคคลระดับสากลเพื่อการเติบโตรวดเร็ว</div>
            </div>
          </div>
        </div>
      </div>

      {/* Business Strategy Advantages */}
      <div className="max-w-4xl mx-auto px-4 mb-8">
        <div className="text-center pb-4 space-y-1">
          <div className="inline-flex items-center gap-1.5 bg-brand-gold-light/40 border border-brand-gold-muted/20 rounded-full px-3.5 py-1 text-[9px] font-black text-brand-gold uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-gold" /> System Strategy
          </div>
          <h2 className="text-xl font-display font-bold text-text-primary">จุดเด่นที่แตกต่างของระบบ <span className="text-brand-gold">Unicorn</span></h2>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[
            { icon: "⚡", label: "Eco-System", desc: "ระบบนิเวศทางธุรกิจสมบูรณ์แบบที่สนับสนุนและเติบโตไปด้วยกันทุกสายงาน", bg: "bg-brand-gold-light/40 border-brand-gold-muted/20 text-brand-gold" },
            { icon: "🏆", label: "Product Strength", desc: "วิจัยและคัดสรรสินค้าคุณภาพสูง มีผลลัพธ์ชัดเจนและมีอัตราซื้อซ้ำสูง", bg: "bg-purple-50 border-purple-100 text-purple-700" },
            { icon: "🤖", label: "AI & Digital Tools", desc: "เครื่องมือวิเคราะห์ ดึงพาร์ทเนอร์ และวางสตรีมระบบช่วยคุณตลอด 24 ชั่วโมง", bg: "bg-red-50 border-red-100 text-red-700" },
            { icon: "⭐", label: "High Reward", desc: "ผลตอบแทนคุ้มค่าตั้งแต่วันแรกที่สมัคร แผนปันผล 8 ช่องทางที่มั่นคงและโปร่งใส", bg: "bg-amber-50 border-amber-100 text-amber-700" },
          ].map((a) => (
            <div key={a.label} className="bg-white border border-border-default rounded-2xl p-4.5 shadow-sm">
              <div className="flex items-center gap-2.5 mb-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0 border ${a.bg}`}>{a.icon}</div>
                <span className="text-[10px] font-black text-text-primary uppercase tracking-wider">{a.label}</span>
              </div>
              <p className="text-[11px] text-text-secondary leading-relaxed">{a.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Call To Action Box (Premium Dark Gradient Accent) */}
      <div className="max-w-4xl mx-auto px-4">
        <div className="rounded-3xl p-6 md:p-10 text-center bg-gradient-to-br from-brand-dark to-[#2c1d0c] text-white border border-brand-gold/30 shadow-md">
          <h2 className="text-lg md:text-xl font-display text-white mb-1.5">พร้อมร่วมสร้างความสำเร็จแล้วหรือยัง?</h2>
          <p className="text-xs text-gray-300 mb-6 leading-relaxed max-w-md mx-auto">
            สมัครฟรีวันนี้เพื่อสิทธิ์การใช้เครื่องมือ Smart AI ครบชุด พร้อมรับสิทธิ์ตำแหน่งและการดูแลใกล้ชิดจากผู้แนะนำ
          </p>

          <Link
            to={`/auth/register?ref=${slug}`}
            className="inline-flex items-center justify-center gap-2 w-full sm:w-auto sm:px-12 py-4 bg-brand-gold hover:bg-brand-gold-hover text-white text-sm font-bold rounded-xl mb-3 shadow-md active:scale-95 transition-all"
          >
            <span>→</span> สมัครเป็นที่ปรึกษาร่วมธุรกิจ
          </Link>

          <p className="text-[10px] text-gray-400 flex items-center justify-center gap-1.5 mb-4">
            <span className="text-emerald-500">✓</span> สมัครพาร์ทเนอร์ฟรี — ไม่มีค่าใช้จ่ายรายเดือนหรือแรกเข้า
          </p>

          {/* LINE official link */}
          {(profile.line_oa_url || profile.line_id) && (
            <a
              href={profile.line_oa_url || `https://line.me/ti/p/~${profile.line_id}`}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2.5 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl px-4 py-3 text-xs text-gray-200 text-left transition-colors max-w-md mx-auto"
            >
              <span className="text-[#06c755] text-lg shrink-0">💬</span>
              <span>ติดต่อผ่าน LINE ของ <strong className="text-white font-bold">{displayName}</strong> โดยตรง — ผูกลิงก์รหัสแนะนำพาร์ทเนอร์อัตโนมัติ</span>
            </a>
          )}

          {/* Other contact links */}
          {(profile.facebook_url || profile.youtube_url || profile.instagram_url) && (
            <div className="flex gap-2.5 mt-4.5 justify-center flex-wrap">
              {profile.facebook_url && (
                <a href={profile.facebook_url} target="_blank" rel="noopener noreferrer"
                   className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-500/10 border border-blue-500/20 text-blue-300 hover:bg-blue-500/20 rounded-xl text-[10.5px] font-bold transition-all">
                  Facebook
                </a>
              )}
              {profile.youtube_url && (
                <a href={profile.youtube_url} target="_blank" rel="noopener noreferrer"
                   className="flex items-center gap-1.5 px-3.5 py-2 bg-red-500/10 border border-red-500/20 text-red-300 hover:bg-red-500/20 rounded-xl text-[10.5px] font-bold transition-all">
                  YouTube
                </a>
              )}
              {profile.instagram_url && (
                <a href={profile.instagram_url} target="_blank" rel="noopener noreferrer"
                   className="flex items-center gap-1.5 px-3.5 py-2 bg-pink-500/10 border border-pink-500/20 text-pink-300 hover:bg-pink-500/20 rounded-xl text-[10.5px] font-bold transition-all">
                  Instagram
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer Powered Info */}
      <footer className="max-w-4xl mx-auto px-4 mt-10 text-center select-none">
        <p className="text-[10px] text-text-muted">Powered by <span className="text-brand-gold font-bold">Unicorn Academy</span></p>
        <p className="text-[10px] text-text-muted font-mono mt-0.5">
          unicornsmartai.cloud/r/<strong className="text-brand-gold/80">{slug}</strong>
        </p>
      </footer>
    </div>
  );
}
