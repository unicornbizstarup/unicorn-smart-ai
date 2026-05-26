import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";
import type { Profile } from "@/types";
import Image from "next/image";
import Link from "next/link";

export const runtime = "edge";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { data } = await supabase
    .from("profiles")
    .select("full_name, display_name, bio, quote")
    .eq("referral_slug", slug)
    .single<Pick<Profile, "full_name" | "display_name" | "bio" | "quote">>();

  const name = data?.display_name || data?.full_name || "Unicorn Partner";
  return {
    title: `${name} | Unicorn Academy`,
    description: data?.quote || data?.bio || "นักธุรกิจยูนิคอร์น — เปิดโอกาสร่วมธุรกิจกับเรา",
  };
}

export default async function ReferralPage({ params }: Props) {
  const { slug } = await params;
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("referral_slug", slug)
    .single<Profile>();

  if (!profile) notFound();

  // Track referral click (fire and forget)
  supabase.rpc("increment_referral_clicks", { profile_id: profile.id }).then(() => {});

  const levelLabels: Record<number, string> = { 1: "Foundation", 2: "Specialist", 3: "Strategic", 4: "Elite Master" };
  const level = profile.ubc_level as 1 | 2 | 3 | 4;
  const displayName = profile.display_name || profile.full_name;
  const initials = displayName.slice(0, 2).toUpperCase();
  const bioText = profile.bio || profile.ai_bio;
  const tags = profile.ai_tags?.filter(Boolean) ?? [];

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white font-body text-sm leading-relaxed">

      {/* ── Accent Line ── */}
      <div className="h-[3px]" style={{ background: "linear-gradient(90deg,#c0281e 0%,#e8621a 50%,#f5a623 100%)" }} />

      {/* ── Brand Bar ── */}
      <div className="bg-[#141414] border-b border-white/8 px-5 py-2.5 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-black text-sm flex-shrink-0"
             style={{ background: "linear-gradient(135deg,#c0281e,#e8621a)" }}>
          U
        </div>
        <div>
          <div className="text-[13px] font-extrabold text-white tracking-wide">UNICORN GLOBAL LINK</div>
          <div className="text-[9px] font-semibold text-white/45 uppercase tracking-widest">Smart AI Platform</div>
        </div>
        <div className="ml-auto flex items-center gap-1.5 text-[10px] text-white/45">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
          {profile.is_verified ? "Verified Partner" : "Unicorn Partner"}
        </div>
      </div>

      {/* ── Hero ── */}
      <div className="px-5 pt-8 pb-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
             style={{ background: "radial-gradient(ellipse 60% 40% at 50% 0%,rgba(192,40,30,.18) 0%,transparent 70%)" }} />

        {/* Avatar */}
        <div className="relative inline-block mb-3 z-10">
          <div className="w-[72px] h-[72px] rounded-[18px] overflow-hidden border-2 border-[#f5a623]/35 mx-auto shadow-lg">
            {profile.avatar_url ? (
              <Image src={profile.avatar_url} alt={displayName} width={72} height={72} className="object-cover w-full h-full" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-2xl font-black text-white"
                   style={{ background: "linear-gradient(135deg,#c0281e,#e8621a)" }}>
                {initials}
              </div>
            )}
          </div>
          {profile.is_verified && (
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#f5a623] border-2 border-[#0d0d0d] flex items-center justify-center text-[9px] font-black text-[#0d0d0d]">✓</div>
          )}
        </div>

        {/* UBC Badge */}
        <div className="inline-flex items-center gap-1.5 bg-[#f5a623]/15 border border-[#f5a623]/30 rounded-full px-3 py-1 text-[10px] font-black text-[#f5a623] uppercase tracking-wider mb-2.5 z-10 relative">
          ⭐ UBC {level} · {levelLabels[level]}
        </div>

        {/* Name */}
        <h1 className="text-xl font-black text-white leading-tight mb-1 relative z-10">{displayName}</h1>

        {/* Expertise / Role */}
        {profile.expertise && (
          <p className="text-[12.5px] text-white/45 font-semibold tracking-wide mb-3.5 relative z-10">{profile.expertise}</p>
        )}

        {/* Quote */}
        {profile.quote && (
          <div className="text-[13px] text-white/75 italic leading-relaxed max-w-[300px] mx-auto px-2 relative z-10">
            <span className="text-[#f5a623] text-xl leading-none align-[-0.3em] mr-0.5">"</span>
            {profile.quote}
            <span className="text-[#f5a623] text-xl leading-none align-[-0.3em] ml-0.5">"</span>
          </div>
        )}
      </div>

      {/* ── Photos Grid ── */}
      {profile.photo_urls && profile.photo_urls.length > 0 && (
        <div className="px-4 pb-6">
          <div className="grid grid-cols-3 gap-2">
            {profile.photo_urls.slice(0, 3).map((url, idx) => (
              <div key={idx} className="rounded-[10px] overflow-hidden aspect-[3/4] relative bg-[#1a1a1a] border border-white/8">
                <Image src={url} alt={profile.photo_captions?.[idx] || ""} fill className="object-cover" sizes="(max-width:768px) 30vw, 120px" />
                <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(180deg,transparent 50%,rgba(13,13,13,.85) 100%)" }} />
                {profile.photo_captions?.[idx] && (
                  <div className="absolute bottom-2 left-2 right-2 text-[10px] font-bold text-white">{profile.photo_captions[idx]}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Bio Section ── */}
      {(bioText || tags.length > 0) && (
        <div className="mx-4 mb-5 bg-[#1a1a1a] border border-white/8 rounded-xl overflow-hidden">
          <div className="px-3.5 py-3 border-b border-white/8 flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-[#c0281e]/15 border border-[#c0281e]/30 flex items-center justify-center text-[13px] text-[#e8621a]">👤</div>
            <span className="text-[11.5px] font-extrabold text-white">เกี่ยวกับผู้แนะนำ</span>
          </div>
          <div className="p-3.5 space-y-3">
            <div className="text-base font-black text-white">{displayName}</div>
            {profile.expertise && (
              <div className="flex items-center gap-1.5 text-[11.5px] font-bold text-[#f5a623]">
                <span className="inline-block w-4 h-0.5 rounded bg-gradient-to-r from-[#c0281e] to-[#e8621a] flex-shrink-0" />
                {profile.expertise}
              </div>
            )}
            {bioText && (
              <p className="text-[12.5px] text-white/75 leading-[1.7]">{bioText}</p>
            )}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {tags.map((tag, idx) => (
                  <span key={idx} className="bg-white/6 border border-white/8 rounded-full px-2.5 py-0.5 text-[10.5px] font-semibold text-white/75">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Features Strip ── */}
      <div className="pb-2.5">
        <div className="text-center px-5 pt-5 pb-2.5 space-y-2">
          <div className="inline-flex items-center gap-1.5 bg-[#f5a623]/15 border border-[#f5a623]/30 rounded-full px-3 py-1 text-[9.5px] font-black text-[#f5a623] uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-[#f5a623]" /> Smart AI Platform
          </div>
          <div className="text-[22px] font-black text-white leading-tight">ระบบที่คุณจะได้ใช้</div>
        </div>
        <div className="flex gap-2 px-4 pb-5 overflow-x-auto" style={{ WebkitOverflowScrolling: "touch", scrollbarWidth: "none" }}>
          {[
            { dot: "#c0281e", label: "AI Coach", desc: "น้องยูนิช่วยวางแผนธุรกิจส่วนตัว 24 ชม." },
            { dot: "#e8621a", label: "Wealth DNA", desc: "วิเคราะห์ธาตุและศักยภาพของคุณ" },
            { dot: "#f5a623", label: "Mission System", desc: "เติบโตอย่างเป็นระบบทีละขั้น" },
            { dot: "#22c55e", label: "5 รายได้", desc: "ระบบสร้างรายได้หลายทางยั่งยืน" },
            { dot: "#7c3aed", label: "Name Card", desc: "Sale page ส่วนตัวสร้าง Personal Brand" },
          ].map((f) => (
            <div key={f.label} className="bg-[#1a1a1a] border border-white/8 rounded-lg px-3 py-2.5 min-w-[130px] flex-shrink-0">
              <div className="flex items-center gap-1.5 mb-1.5">
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: f.dot }} />
                <span className="text-[10.5px] font-extrabold text-white tracking-wide">{f.label}</span>
              </div>
              <p className="text-[10px] text-white/45 leading-[1.4]">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Products ── */}
      <div className="pb-2">
        <div className="text-center px-5 pt-4 pb-3.5 space-y-1.5">
          <div className="inline-flex items-center gap-1.5 bg-[#f5a623]/15 border border-[#f5a623]/30 rounded-full px-3 py-1 text-[9.5px] font-black text-[#f5a623] uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-[#f5a623]" /> Product Lines
          </div>
          <div className="text-[22px] font-black text-white leading-tight">หมวดหมู่ <span className="text-[#f5a623]">สินค้า</span></div>
          <p className="text-[12.5px] text-white/45">สินค้านวัตกรรม 5 หมวด ตอบโจทย์ทุกไลฟ์สไตล์</p>
        </div>
        <div className="px-4 pb-6">
          <div className="grid grid-cols-2 gap-2">
            {[
              { icon: "🫀", label: "Health Care", desc: "สุขภาพ ดูแลร่างกาย ภูมิคุ้มกัน", iconBg: "bg-emerald-500/15 border-emerald-500/25 text-emerald-400" },
              { icon: "✨", label: "Skin Care", desc: "ดูแลผิวพรรณ ความงาม", iconBg: "bg-pink-500/15 border-pink-500/25 text-pink-400" },
              { icon: "🧴", label: "Personal Care", desc: "ของใช้ส่วนตัว ดูแลชีวิตประจำวัน", iconBg: "bg-indigo-500/15 border-indigo-500/25 text-indigo-400" },
              { icon: "🌱", label: "Agriculture", desc: "เกษตร ออร์แกนิก สิ่งแวดล้อม", iconBg: "bg-lime-500/15 border-lime-500/25 text-lime-400" },
            ].map((p) => (
              <div key={p.label} className="bg-[#1a1a1a] border border-white/8 rounded-[10px] px-3.5 py-3 flex items-start gap-2.5">
                <div className={`w-9 h-9 rounded-[9px] flex items-center justify-center text-base flex-shrink-0 border ${p.iconBg}`}>{p.icon}</div>
                <div>
                  <div className="text-[12.5px] font-extrabold text-white mb-0.5">{p.label}</div>
                  <div className="text-[11px] text-white/45 leading-[1.4]">{p.desc}</div>
                </div>
              </div>
            ))}
            <div className="col-span-2 bg-[#1a1a1a] border border-white/8 rounded-[10px] px-3.5 py-3 flex items-start gap-2.5">
              <div className="w-9 h-9 rounded-[9px] flex items-center justify-center text-base flex-shrink-0 border bg-[#f5a623]/15 border-[#f5a623]/25 text-[#f5a623]">💻</div>
              <div>
                <div className="text-[12.5px] font-extrabold text-white mb-0.5">Technology</div>
                <div className="text-[11px] text-white/45 leading-[1.4]">นวัตกรรมเทคโนโลยี AI Tools &amp; Digital Products เพื่อธุรกิจยุคใหม่</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Biz Advantages ── */}
      <div>
        <div className="text-center px-5 pt-4 pb-3.5 space-y-1.5">
          <div className="inline-flex items-center gap-1.5 bg-[#f5a623]/15 border border-[#f5a623]/30 rounded-full px-3 py-1 text-[9.5px] font-black text-[#f5a623] uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-[#f5a623]" /> Biz Start Up Platform
          </div>
          <div className="text-[22px] font-black text-white leading-tight">กลยุทธ์ <span className="text-[#f5a623]">ธุรกิจ</span></div>
          <p className="text-[12.5px] text-white/45">ทำไมระบบ Unicorn จึงแตกต่าง</p>
        </div>
        <div className="px-4 pb-6">
          <div className="grid grid-cols-2 gap-2">
            {[
              { icon: "⚡", label: "Eco-System", desc: "ระบบนิเวศทางธุรกิจที่ครบวงจรที่สุด รองรับการเติบโตทุกระดับ", bg: "bg-[#f5a623]/15 border-[#f5a623]/25 text-[#f5a623]" },
              { icon: "🏆", label: "Product Strength", desc: "นวัตกรรมสินค้าคุณภาพสูง ตอบโจทย์ไลฟ์สไตล์ทุกกลุ่ม", bg: "bg-violet-500/15 border-violet-500/25 text-violet-400" },
              { icon: "🤖", label: "AI & Digital Tools", desc: "เครื่องมืออัจฉริยะช่วยขยายธุรกิจ ทำงานแทนคุณตลอด 24 ชม.", bg: "bg-[#c0281e]/15 border-[#c0281e]/30 text-red-400" },
              { icon: "⭐", label: "High Reward", desc: "ผลตอบแทนที่คุ้มค่าและยั่งยืน ระบบ 5 รายได้ที่พิสูจน์แล้ว", bg: "bg-yellow-500/15 border-yellow-500/25 text-yellow-400" },
            ].map((a) => (
              <div key={a.label} className="bg-[#1a1a1a] border border-white/8 rounded-[10px] p-3.5">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0 border ${a.bg}`}>{a.icon}</div>
                  <span className="text-[11px] font-extrabold text-white uppercase tracking-wide">{a.label}</span>
                </div>
                <p className="text-[11.5px] text-white/45 leading-[1.5]">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CTA ── */}
      <div className="px-4 pb-6">
        <div className="rounded-[14px] p-5 text-center" style={{ background: "linear-gradient(135deg,rgba(192,40,30,.2),rgba(232,98,26,.15))", border: ".5px solid rgba(192,40,30,.35)" }}>
          <h2 className="text-[17px] font-black text-white mb-1">พร้อมเริ่มต้นแล้วใช่ไหม?</h2>
          <p className="text-[12px] text-white/45 mb-4 leading-[1.5]">
            สมัครฟรี เริ่มได้เลยวันนี้<br />ผู้แนะนำพร้อมดูแลคุณตลอดการเติบโต
          </p>

          <Link
            href={`/auth/register?ref=${slug}`}
            className="flex items-center justify-center gap-2 w-full py-3.5 px-5 text-white text-[14px] font-extrabold rounded-xl mb-2 tracking-wide"
            style={{ background: "linear-gradient(135deg,#c0281e,#e8621a)" }}
          >
            <span>→</span> สมัครเป็นพาร์ทเนอร์
          </Link>

          <p className="text-[11px] text-white/25 flex items-center justify-center gap-1.5 mb-2.5">
            <span className="text-emerald-500">✓</span> สมัครฟรี — ไม่มีค่าใช้จ่ายแรกเข้า
          </p>

          {/* LINE contact */}
          {(profile.line_oa_url || profile.line_id) && (
            <a
              href={profile.line_oa_url || `https://line.me/ti/p/~${profile.line_id}`}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 bg-white/5 border border-white/8 rounded-lg px-3 py-2 text-[11.5px] text-white/75 w-full"
            >
              <span className="text-[#06c755] text-base flex-shrink-0">💬</span>
              <span>ติดต่อผ่าน LINE ของ <strong className="text-white">{displayName}</strong> โดยตรง — รหัสผู้แนะนำผูกอัตโนมัติ</span>
            </a>
          )}

          {/* Other contact links */}
          {(profile.facebook_url || profile.youtube_url || profile.instagram_url) && (
            <div className="flex gap-2 mt-2 justify-center">
              {profile.facebook_url && (
                <a href={profile.facebook_url} target="_blank" rel="noopener noreferrer"
                   className="flex items-center gap-1 px-3 py-1.5 bg-blue-500/10 border border-blue-500/25 text-blue-400 rounded-lg text-[11px] font-bold">
                  👤 Facebook
                </a>
              )}
              {profile.youtube_url && (
                <a href={profile.youtube_url} target="_blank" rel="noopener noreferrer"
                   className="flex items-center gap-1 px-3 py-1.5 bg-red-500/10 border border-red-500/25 text-red-400 rounded-lg text-[11px] font-bold">
                  ▶️ YouTube
                </a>
              )}
              {profile.instagram_url && (
                <a href={profile.instagram_url} target="_blank" rel="noopener noreferrer"
                   className="flex items-center gap-1 px-3 py-1.5 bg-pink-500/10 border border-pink-500/25 text-pink-400 rounded-lg text-[11px] font-bold">
                  📸 IG
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Footer ── */}
      <div className="bg-[#141414] border-t border-white/8 px-5 py-3.5 text-center">
        <p className="text-[11px] text-white/25">Powered by <span className="text-[#f5a623]">Unicorn Academy</span></p>
        <p className="text-[11px] text-white/20 font-mono mt-0.5">
          unicornsmartai.cloud/<strong className="text-[#f5a623]/70">{slug}</strong>
        </p>
      </div>

    </div>
  );
}
