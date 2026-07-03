import React, { useState } from "react";
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

  // Fetch active product categories dynamically
  const { data: categories } = await supabase
    .from("product_categories")
    .select("*")
    .eq("is_active", true)
    .order("sort_order");

  // Track referral click (server-side RPC for efficiency)
  const { error: rpcError } = await supabase.rpc("increment_referral_clicks", { profile_id: profile.id });
  if (rpcError) {
    console.error("Increment clicks failed:", rpcError);
  }

  // Set the referral cookie on loader response headers
  headers.set("Set-Cookie", `unicorn_referrer=${profile.id}; Path=/; HttpOnly; Max-Age=${30 * 24 * 60 * 60}; SameSite=Lax; Secure`);

  return data({ profile, slug, categories: categories || [] }, {
    headers: headers
  });
}

export default function ReferralPage() {
  const { profile, slug, categories } = useLoaderData<typeof loader>();
  const [activePhoto, setActivePhoto] = useState<string | null>(null);

  const levelLabels: Record<number, string> = { 1: "Foundation", 2: "Specialist", 3: "Strategic", 4: "Elite Master" };
  const level = (profile.ubc_level ?? 1) as 1 | 2 | 3 | 4;
  const displayName = profile.display_name || profile.full_name || "Partner";
  const initials = displayName.slice(0, 2).toUpperCase();
  const bioText = profile.bio || profile.ai_bio;
  const tags = profile.ai_tags?.filter(Boolean) ?? [];

  return (
    <div className="min-h-screen bg-[#f7f4ef] text-text-primary font-body text-sm leading-relaxed pb-16 selection:bg-brand-gold/30">
      {/* Accent Top Line */}
      <div className="h-1.5 bg-gradient-to-r from-[#c0281e] via-[#e8621a] to-[#f5a623]" />

      {/* Brand Navigation Bar */}
      <nav className="bg-white border-b border-border-default px-6 py-4 flex items-center justify-between shadow-sm relative z-20">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-sm select-none"
               style={{ background: "linear-gradient(135deg, #c0281e, #f5a623)" }}>
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
      <div className="max-w-4xl mx-auto px-4 pt-12 pb-8 text-center relative overflow-hidden">
        {/* Dynamic visual design background */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-brand-gold-light/15 via-[#f7f4ef]/50 to-transparent" />
        <div className="absolute top-10 left-10 w-24 h-24 bg-[#c0281e]/5 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute top-20 right-10 w-32 h-32 bg-[#f5a623]/5 rounded-full blur-3xl pointer-events-none" />

        {/* Profile Avatar */}
        <div className="relative inline-block mb-5 z-10 select-none">
          <div className="w-24 h-24 rounded-3xl overflow-hidden border-2 border-brand-gold mx-auto shadow-lg hover:rotate-1 transition-transform">
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt={displayName} className="object-cover w-full h-full" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-3xl font-black text-white bg-brand-gold">
                {initials}
              </div>
            )}
          </div>
          {profile.is_verified && (
            <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full bg-brand-gold border-2 border-white flex items-center justify-center text-[10px] font-black text-white shadow-md">
              ✓
            </div>
          )}
        </div>

        {/* UBC Level Badge */}
        <div>
          <div className="inline-flex items-center gap-1.5 bg-brand-gold-light/50 border border-brand-gold-muted/20 rounded-full px-4 py-1 text-[10px] font-black text-brand-gold uppercase tracking-wider mb-4 z-10 relative">
            ⭐ UBC {level} · {levelLabels[level]}
          </div>
        </div>

        {/* Name & Quote */}
        <h1 className="text-3xl font-display font-bold text-text-primary leading-tight mb-2.5 relative z-10 tracking-tight">{displayName}</h1>
        {profile.specialization && (
          <p className="text-xs text-brand-gold font-black tracking-widest mb-5 relative z-10 uppercase">
            ✨ {profile.specialization}
          </p>
        )}

        {profile.quote && (
          <div className="text-sm md:text-base text-text-secondary italic leading-relaxed max-w-lg mx-auto px-6 py-4 bg-white/40 border border-border-default/50 rounded-2xl shadow-sm relative z-10">
            <span className="text-brand-gold text-3xl leading-none align-[-0.2em] mr-1 font-display">“</span>
            {profile.quote}
            <span className="text-brand-gold text-3xl leading-none align-[-0.2em] ml-1 font-display">”</span>
          </div>
        )}
      </div>

      {/* 3-5 Slot Photo Gallery */}
      {profile.photo_urls && profile.photo_urls.filter(Boolean).length > 0 && (
        <div className="max-w-4xl mx-auto px-4 pb-12">
          <div className="text-center pb-6 space-y-1">
            <div className="inline-flex items-center gap-1.5 bg-brand-gold-light/40 border border-brand-gold-muted/20 rounded-full px-3.5 py-1 text-[9px] font-black text-brand-gold uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-gold" /> Activity & Branding
            </div>
            <h2 className="text-xl font-display font-bold text-text-primary">ภาพกิจกรรมและการทำงานของที่ปรึกษา</h2>
            <p className="text-xs text-text-muted">ความมุ่งมั่นและความเชี่ยวชาญผ่านกิจกรรมจริง (คลิกเพื่อขยายภาพ)</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {profile.photo_urls.filter(Boolean).map((url, idx) => (
              <div 
                key={idx} 
                onClick={() => setActivePhoto(url)}
                className="rounded-2xl overflow-hidden aspect-[4/5] relative bg-bg-input border border-border-default shadow-sm hover:border-brand-gold hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-zoom-in group"
              >
                <img src={url} alt={profile.photo_captions?.[idx] || ""} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-90" />
                <div className="absolute bottom-4 left-4 right-4 text-left">
                  <div className="text-[9px] font-black text-brand-gold uppercase tracking-widest mb-1">IMAGE {idx + 1}</div>
                  <p className="text-xs font-bold text-white line-clamp-2 leading-relaxed">
                    {profile.photo_captions?.[idx] || "ภาพกิจกรรมและการแบ่งปันโอกาสทางธุรกิจ"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* About Sponsor / Bio Section */}
      <div className="max-w-4xl mx-auto px-4 mb-10">
        {(bioText || tags.length > 0) && (
          <div className="bg-white border border-border-default rounded-3xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-border-default bg-bg-input flex items-center gap-2">
              <span className="text-base select-none">👤</span>
              <span className="text-xs font-black text-text-primary uppercase tracking-wider">ผู้แนะนำที่ปรึกษาธุรกิจ</span>
            </div>
            <div className="p-6 space-y-4">
              <div className="text-lg font-black text-text-primary">{displayName}</div>
              {profile.specialization && (
                <div className="flex items-center gap-2 text-xs font-black text-brand-gold uppercase tracking-wide">
                  <span className="inline-block w-4 h-0.5 rounded bg-brand-gold shrink-0" />
                  {profile.specialization}
                </div>
              )}
              {bioText && (
                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed whitespace-pre-wrap font-medium">{bioText}</p>
              )}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-4 border-t border-border-muted">
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
      <div className="max-w-4xl mx-auto px-4 mb-12">
        <div className="text-center pb-6 space-y-1">
          <div className="inline-flex items-center gap-1.5 bg-brand-gold-light/40 border border-brand-gold-muted/20 rounded-full px-3.5 py-1 text-[9px] font-black text-brand-gold uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-gold" /> Smart AI Platform
          </div>
          <h2 className="text-xl font-display font-bold text-text-primary">ระบบการทำงานอัจฉริยะที่คุณจะได้ใช้</h2>
          <p className="text-xs text-text-muted">ขับเคลื่อนธุรกิจด้วยระบบอัตโนมัติระดับโลก</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { dot: "#b8924a", label: "AI Coach", desc: "น้องยูนิช่วยวางแผนและโค้ชชิ่งธุรกิจส่วนตัว 24 ชม.", bg: "from-amber-500/10 to-transparent border-amber-500/20" },
            { dot: "#e8621a", label: "Wealth DNA", desc: "ถอดรหัสศักยภาพและธาตุความมั่งคั่งตามโฉลก", bg: "from-orange-500/10 to-transparent border-orange-500/20" },
            { dot: "#f5a623", label: "Missions Board", desc: "ระบบพัฒนาทักษะธุรกิจเป็นขั้นเป็นตอนและเข้าใจง่าย", bg: "from-yellow-500/10 to-transparent border-yellow-500/20" },
            { dot: "#10b981", label: "5 เริ่มต้น 8 รายได้", desc: "แผนการรับรายได้ที่รวดเร็วและคุ้มค่าที่สุดในอุตสาหกรรม", bg: "from-emerald-500/10 to-transparent border-emerald-500/20" },
            { dot: "#8b5cf6", label: "Digital Name Card", desc: "นามบัตรดิจิทัลสร้าง Personal Brand ดูเป็นที่ปรึกษามืออาชีพ", bg: "from-violet-500/10 to-transparent border-violet-500/20" },
          ].map((f) => (
            <div key={f.label} className={`bg-gradient-to-br ${f.bg} bg-white border rounded-2xl p-5 shadow-sm hover:shadow-md transition-all hover:scale-[1.02] duration-300`}>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: f.dot }} />
                <span className="text-xs font-black text-text-primary tracking-wide">{f.label}</span>
              </div>
              <p className="text-[11px] text-text-secondary leading-relaxed font-semibold">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Product Categories Section */}
      <div className="max-w-4xl mx-auto px-4 mb-12">
        <div className="text-center pb-6 space-y-1">
          <div className="inline-flex items-center gap-1.5 bg-brand-gold-light/40 border border-brand-gold-muted/20 rounded-full px-3.5 py-1 text-[9px] font-black text-brand-gold uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-gold" /> Product Lines
          </div>
          <h2 className="text-xl font-display font-bold text-text-primary">หมวดหมู่ <span className="text-brand-gold">ผลิตภัณฑ์นวัตกรรม</span></h2>
          <p className="text-xs text-text-muted">ครอบคลุมทุกความต้องการ มั่นใจด้วยมาตรฐานระดับสากล</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {(categories && categories.length > 0 ? categories : [
            { name: "U-LIFE BOOST", display_name_th: "ผลิตภัณฑ์เสริมอาหาร (Health Care)", banner_url: null, slug: "u-life-boost", description: "นวัตกรรมเพื่อสุขภาพ ฟื้นฟูร่างกายและเสริมสร้างภูมิคุ้มกันระดับเซลล์" },
            { name: "U-SKIN", display_name_th: "ผลิตภัณฑ์สกินแคร์ (Skin Care)", banner_url: null, slug: "u-skin", description: "นวัตกรรมบำรุงผิวพรรณอย่างล้ำลึก ย้อนวัยและคืนความอ่อนเยาว์อย่างธรรมชาติ" },
            { name: "U-CARE", display_name_th: "ผลิตภัณฑ์ของใช้ส่วนตัว (Personal Care)", banner_url: null, slug: "u-care", description: "ผลิตภัณฑ์ทำความสะอาดและดูแลสุขอนามัยในชีวิตประจำวันเพื่อครอบครัว" },
            { name: "U-PLANT", display_name_th: "ผลิตภัณฑ์การเกษตร (Agriculture)", banner_url: null, slug: "u-plant", description: "นวัตกรรมเพื่อเกษตรกรรมออร์แกนิก ปลอดภัยและเพิ่มผลผลิตยั่งยืน" }
          ]).map((cat: any) => {
            const config: Record<string, { icon: string; bg: string }> = {
              "u-life-boost": { icon: "🫀", bg: "bg-emerald-50 text-emerald-700 border-emerald-100" },
              "u-skin": { icon: "✨", bg: "bg-pink-50 text-pink-700 border-pink-100" },
              "u-care": { icon: "🧴", bg: "bg-indigo-50 text-indigo-700 border-indigo-100" },
              "u-plant": { icon: "🌱", bg: "bg-lime-50 text-lime-700 border-lime-100" },
              "u-tech": { icon: "💻", bg: "bg-amber-50 text-amber-700 border-amber-100" },
            };
            const key = cat.slug || cat.name?.toLowerCase().replace(/\s+/g, "-") || "";
            const theme = config[key] || { icon: cat.icon_url || "📦", bg: "bg-slate-50 text-slate-700 border-slate-100" };
            
            return (
              <div key={cat.id || cat.name} className="bg-white border border-border-default rounded-2xl p-5 flex items-start gap-4 shadow-sm hover:shadow-md transition-all hover:border-brand-gold-muted group">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 border ${theme.bg} group-hover:scale-105 transition-transform duration-300`}>
                  {theme.icon}
                </div>
                <div>
                  <div className="text-sm font-black text-text-primary mb-1 group-hover:text-brand-gold transition-colors">
                    {cat.display_name_th || cat.name}
                  </div>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    {cat.description || `กลุ่มผลิตภัณฑ์คุณภาพสูงและมีมาตรฐานระดับสากลภายใต้แบรนด์ ${cat.name}`}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Business Strategy Advantages */}
      <div className="max-w-4xl mx-auto px-4 mb-12">
        <div className="text-center pb-6 space-y-1">
          <div className="inline-flex items-center gap-1.5 bg-brand-gold-light/40 border border-brand-gold-muted/20 rounded-full px-3.5 py-1 text-[9px] font-black text-brand-gold uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-gold" /> System Strategy
          </div>
          <h2 className="text-xl font-display font-bold text-text-primary">จุดเด่นที่แตกต่างของระบบ <span className="text-brand-gold">Unicorn</span></h2>
          <p className="text-xs text-text-muted">เหตุผลที่ทุกคนเลือกเริ่มต้นและเติบโตกับแพลตฟอร์มของเรา</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { icon: "⚡", label: "Eco-System", desc: "ระบบนิเวศทางธุรกิจสมบูรณ์แบบที่สนับสนุนและเติบโตไปด้วยกันทุกสายงาน", bg: "bg-brand-gold-light/40 border-brand-gold-muted/20 text-brand-gold" },
            { icon: "🏆", label: "Product Strength", desc: "วิจัยและคัดสรรสินค้าคุณภาพสูง มีผลลัพธ์ชัดเจนและมีอัตราซื้อซ้ำสูง", bg: "bg-purple-50 border-purple-100 text-purple-700" },
            { icon: "✨", label: "AI & Digital Tools", desc: "เครื่องมือวิเคราะห์ ดึงพาร์ทเนอร์ และวางสตรีมระบบช่วยคุณตลอด 24 ชั่วโมง", bg: "bg-brand-gold-light/40 border-brand-gold-muted/20 text-brand-gold" },
            { icon: "⭐", label: "High Reward", desc: "ผลตอบแทนคุ้มค่าตั้งแต่วันแรกที่สมัคร แผนปันผล 8 ช่องทางที่มั่นคงและโปร่งใส", bg: "bg-amber-50 border-amber-100 text-amber-700" },
          ].map((a) => (
            <div key={a.label} className="bg-white border border-border-default rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-brand-gold-muted transition-all">
              <div className="flex items-center gap-2.5 mb-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0 border ${a.bg}`}>{a.icon}</div>
                <span className="text-xs font-black text-text-primary uppercase tracking-wider">{a.label}</span>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed font-semibold">{a.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Call To Action Box (Premium Dark Gradient Accent) */}
      <div className="max-w-4xl mx-auto px-4 mb-8">
        <div className="rounded-3xl p-8 md:p-12 text-center bg-gradient-to-br from-[#1a1209] to-[#2d2112] text-white border border-brand-gold/30 shadow-2xl relative overflow-hidden">
          {/* Background subtle light flare */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-brand-gold/10 rounded-full blur-3xl pointer-events-none" />

          <h2 className="text-xl md:text-2xl font-display text-white mb-2 font-bold tracking-tight">พร้อมร่วมสร้างความสำเร็จแล้วหรือยัง?</h2>
          <p className="text-xs text-white/60 mb-8 leading-relaxed max-w-md mx-auto font-medium">
            สมัครฟรีวันนี้เพื่อสิทธิ์การใช้เครื่องมือ Smart AI ครบชุด พร้อมรับสิทธิ์ตำแหน่งและการดูแลใกล้ชิดจากผู้แนะนำ
          </p>

          <Link
            to={`/auth/register?ref=${slug}`}
            className="inline-flex items-center justify-center gap-2 w-full sm:w-auto sm:px-12 py-4 bg-gradient-to-r from-brand-gold to-brand-gold-muted hover:from-brand-gold-hover hover:to-brand-gold text-white text-sm font-black rounded-xl mb-4 shadow-lg active:scale-95 transition-all text-center uppercase tracking-wider"
          >
            🚀 สมัครเป็นที่ปรึกษาร่วมธุรกิจ
          </Link>

          <p className="text-[10px] text-white/40 flex items-center justify-center gap-1.5 mb-6 font-semibold">
            <span className="text-emerald-500">✓</span> สมัครพาร์ทเนอร์ฟรี — ไม่มีค่าใช้จ่ายรายเดือนหรือแรกเข้า
          </p>

          {/* LINE official link */}
          {(profile.line_oa_url || profile.line_id) && (
            <div className="max-w-md mx-auto border-t border-white/10 pt-6">
              <a
                href={profile.line_oa_url ? profile.line_oa_url.trim() : `https://line.me/ti/p/~${profile.line_id.trim()}`}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3.5 bg-[#06C755] hover:bg-[#05b34d] text-white rounded-2xl px-5 py-4 text-xs font-black transition-all hover:-translate-y-0.5 shadow-lg shadow-emerald-950/20"
              >
                <span className="text-2xl shrink-0">💬</span>
                <div className="text-left">
                  <p className="font-black text-sm">ทัก LINE ส่วนตัวกับ {displayName}</p>
                  <p className="text-[10px] text-white/80 font-medium">ปรึกษาโอกาสธุรกิจและเครื่องมือ AI เพิ่มเติมได้ทันที</p>
                </div>
              </a>
            </div>
          )}

          {/* Other contact links */}
          {(profile.facebook_url || profile.youtube_url || profile.instagram_url) && (
            <div className="flex gap-2.5 mt-6 justify-center flex-wrap">
              {profile.facebook_url && (
                <a href={profile.facebook_url} target="_blank" rel="noopener noreferrer"
                   className="flex items-center gap-1.5 px-4 py-2 bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl text-[11px] font-bold transition-all">
                  Facebook
                </a>
              )}
              {profile.youtube_url && (
                <a href={profile.youtube_url} target="_blank" rel="noopener noreferrer"
                   className="flex items-center gap-1.5 px-4 py-2 bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl text-[11px] font-bold transition-all">
                  YouTube
                </a>
              )}
              {profile.instagram_url && (
                <a href={profile.instagram_url} target="_blank" rel="noopener noreferrer"
                   className="flex items-center gap-1.5 px-4 py-2 bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl text-[11px] font-bold transition-all">
                  Instagram
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Lightbox Modal */}
      {activePhoto && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-4 cursor-zoom-out animate-fade-in" 
          onClick={() => setActivePhoto(null)}
        >
          <div className="relative max-w-3xl w-full max-h-[80vh] flex items-center justify-center">
            <img src={activePhoto} alt="Branding enlarged" className="max-w-full max-h-[75vh] object-contain rounded-xl shadow-2xl" />
            <button className="absolute -top-10 right-0 text-white font-bold text-xs bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full transition-all">
              ปิด [X]
            </button>
          </div>
        </div>
      )}

      {/* Footer Powered Info */}
      <footer className="max-w-4xl mx-auto px-4 mt-12 text-center select-none">
        <p className="text-[10px] text-text-muted font-semibold">Powered by <span className="text-brand-gold font-bold">Unicorn Academy</span></p>
        <p className="text-[10px] text-text-muted font-mono mt-0.5">
          unicornsmartai.cloud/r/<strong className="text-brand-gold/80">{slug}</strong>
        </p>
      </footer>
    </div>
  );
}
