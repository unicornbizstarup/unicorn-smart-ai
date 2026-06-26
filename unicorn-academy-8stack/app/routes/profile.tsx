import React, { useState, useRef } from "react";
import { Link, useNavigate, useLoaderData } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { User, Sparkles, ChevronLeft, Camera, Save, CheckCircle2, AlertCircle, Loader2, Tv, MessageCircle, Link as LinkIcon, HelpCircle } from "lucide-react";
import { createClient } from "@/lib/supabase";
import { requireUser } from "@/lib/supabase-server";
import MemberLayout from "@/components/layout/MemberLayout";

export function meta() {
  return [
    { title: "จัดการโปรไฟล์และนามบัตรดิจิทัล — Unicorn Academy" },
    { name: "description", content: "จัดการข้อมูลส่วนตัว นามบัตรดิจิทัล และลิงก์แนะนำบอกต่อสำหรับพาร์ทเนอร์" },
  ];
}

export async function loader({ request }: LoaderFunctionArgs) {
  const responseHeaders = new Headers();
  const { user, supabase } = await requireUser(request, responseHeaders);

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return { profile, user };
}

export default function ProfilePage() {
  const { profile: loadedProfile, user } = useLoaderData<typeof loader>();
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState<any>({
    full_name: loadedProfile?.full_name || "",
    specialization: loadedProfile?.specialization || "",
    bio: loadedProfile?.bio || "",
    line_id: loadedProfile?.line_id || "",
    line_oa: loadedProfile?.line_oa || "",
    youtube_url: loadedProfile?.youtube_url || "",
    referral_slug: loadedProfile?.referral_slug || "",
    avatar_url: loadedProfile?.avatar_url || "",
  });

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("รูปภาพต้องมีขนาดไม่เกิน 2MB ครับ");
      return;
    }

    setUploading(true);
    setError("");

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type,
        }),
      });

      if (!res.ok) throw new Error("ไม่สามารถขอ URL อัปโหลดได้");

      const { url, publicUrl } = await res.json();

      const uploadRes = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": file.type,
        },
        body: file,
      });

      if (!uploadRes.ok) throw new Error("การอัปโหลดรูปภาพล้มเหลว");

      setProfile((prev: any) => ({ ...prev, avatar_url: publicUrl }));

      const { error: dbError } = await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl })
        .eq("id", user.id);

      if (dbError) throw dbError;

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (err: any) {
      console.error("Avatar upload error:", err);
      setError(err.message || "อัปโหลดรูปภาพล้มเหลว กรุณาลองใหม่อีกครั้ง");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);
    setError("");

    const cleanSlug = profile.referral_slug.toLowerCase().replace(/\s+/g, "");
    if (!cleanSlug) {
      setError("ลิงก์แนะนำตัว (Referral Slug) ห้ามว่าง");
      setSaving(false);
      return;
    }

    try {
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          full_name: profile.full_name,
          specialization: profile.specialization,
          bio: profile.bio,
          line_id: profile.line_id,
          line_oa: profile.line_oa,
          youtube_url: profile.youtube_url,
          referral_slug: cleanSlug,
        })
        .eq("id", user.id);

      if (updateError) {
        if (updateError.message?.includes("unique")) {
          throw new Error("ลิงก์แนะนำตัว (Referral Slug) นี้มีผู้อื่นใช้งานแล้ว กรุณาเปลี่ยนชื่อใหม่ครับ");
        }
        throw updateError;
      }

      setProfile((prev: any) => ({ ...prev, referral_slug: cleanSlug }));
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      console.error("Profile save error:", err);
      setError(err.message || "เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    } finally {
      setSaving(false);
    }
  };

  return (
    <MemberLayout
      profile={loadedProfile}
      title="โปรไฟล์และนามบัตรดิจิทัล"
      subtitle="— จัดการข้อมูลส่วนตัว นามบัตรดิจิทัล และลิงก์สปอนเซอร์แนะนำสำหรับพาร์ทเนอร์"
    >
      <div className="max-w-4xl mx-auto text-text-primary font-body">
        <div className="flex items-center justify-between mb-6">
          <Link to="/dashboard" className="flex items-center gap-2 group text-text-secondary hover:text-brand-gold font-semibold text-xs transition-colors">
            <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
            <span>กลับหน้าแดชบอร์ด</span>
          </Link>
          <span className="text-brand-gold font-bold tracking-widest text-[10px] uppercase bg-brand-gold-light px-3 py-1 rounded-full border border-border-default">
            Digital Name Card
          </span>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6 items-stretch">
          {/* Avatar and branding preview card */}
          <div className="w-full bg-gradient-to-b from-[#1a1209] to-[#2d2112] border border-border-strong rounded-2xl p-6 flex flex-col items-center text-center space-y-6 shadow-md">
            <h3 className="text-xs font-black !text-white/45 uppercase tracking-widest block w-full text-left">
              รูปภาพนามบัตร
            </h3>

            {/* Upload Area */}
            <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
              <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-brand-gold-muted group-hover:border-brand-gold relative transition-all duration-300">
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.full_name || "Profile Avatar"}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full bg-white/5 flex items-center justify-center text-white/20">
                    <User size={48} />
                  </div>
                )}

                {/* Upload Hover Overlay */}
                <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Camera size={24} className="text-brand-gold animate-pulse" />
                  <span className="text-[10px] font-bold text-white/80 mt-1">คลิกเพื่อเปลี่ยน</span>
                </div>
              </div>

              {/* Uploading Spinner */}
              {uploading && (
                <div className="absolute inset-0 bg-black/80 rounded-full flex items-center justify-center border-2 border-brand-gold">
                  <Loader2 size={24} className="text-brand-gold animate-spin" />
                </div>
              )}
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />

            <div className="space-y-2 w-full">
              <h2 className="text-xl font-display !text-brand-gold truncate font-bold">
                {profile.full_name || "ชื่อผู้ใช้"}
              </h2>
              <p className="text-xs text-white/70 italic leading-relaxed">
                {profile.bio || `"สโลแกนหรือแนวคิดทางธุรกิจของคุณ"`}
              </p>
              {profile.specialization && (
                <span className="inline-block px-3 py-1 bg-brand-gold/20 border border-brand-gold-muted rounded-full text-brand-gold text-[10px] font-black uppercase tracking-wider">
                  ✨ {profile.specialization}
                </span>
              )}
            </div>

            <div className="pt-4 border-t border-white/10 w-full space-y-3">
              <div className="text-left">
                <span className="text-[9px] font-black !text-white/40 uppercase tracking-widest block mb-1">
                  ลิงก์แนะนำตัวบอกต่อธุรกิจของคุณ
                </span>
                <div className="bg-white/5 p-3 rounded-xl border border-white/10 text-xs text-brand-gold font-semibold break-all flex items-center justify-between">
                  <span className="truncate select-all">
                    /r/{profile.referral_slug || "your-link"}
                  </span>
                  <Link
                    to={`/r/${profile.referral_slug}`}
                    target="_blank"
                    className="text-white/40 hover:text-white transition-colors ml-2 shrink-0"
                    title="เปิดหน้านามบัตรสาธารณะ"
                  >
                    <LinkIcon size={14} />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Form details input */}
          <div className="w-full space-y-6">
            {/* Status alerts */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
                <AlertCircle size={20} className="text-red-700 shrink-0" />
                <p className="text-xs text-red-700 font-semibold">{error}</p>
              </div>
            )}

            {saveSuccess && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3">
                <CheckCircle2 size={20} className="text-emerald-700 shrink-0" />
                <p className="text-xs text-emerald-700 font-semibold">อัปเดตข้อมูลนามบัตรเรียบร้อยแล้วครับ! 🦄✨</p>
              </div>
            )}

            <div className="bg-white border border-border-default rounded-2xl shadow-sm p-6 md:p-8 space-y-6">
              <div className="space-y-1">
                <h3 className="text-lg font-display text-brand-gold font-bold">แก้ไขรายละเอียดนามบัตรดิจิทัล</h3>
                <p className="text-xs text-text-secondary">กรอกข้อมูลส่วนบุคคลและช่องทางการติดต่อของพาร์ทเนอร์</p>
              </div>

              <div className="grid grid-cols-1 gap-5">
                {/* Full name */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest block">
                    ชื่อ - นามสกุลจริง
                  </label>
                  <input
                    type="text"
                    name="full_name"
                    value={profile.full_name}
                    onChange={handleInputChange}
                    placeholder="ระบุชื่อและนามสกุลที่ต้องการให้แสดงผล"
                    className="w-full px-4 py-3 bg-bg-input border border-border-default rounded-xl text-text-primary placeholder-text-muted focus:outline-none focus:border-brand-gold-muted focus:ring-1 focus:ring-brand-gold-muted/20 transition-all text-sm font-semibold"
                  />
                </div>

                {/* Referral slug */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest block flex items-center gap-1.5">
                    <span>ลิงก์แนะนำตัวบอกต่อ (Referral Slug)</span>
                    <span title="จะถูกใช้เป็น URL สำหรับแนะนำทีม เช่น domain/r/yourname" className="cursor-help">
                      <HelpCircle size={12} className="text-text-muted" />
                    </span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted font-bold text-sm">
                      /r/
                    </span>
                    <input
                      type="text"
                      name="referral_slug"
                      value={profile.referral_slug}
                      onChange={handleInputChange}
                      placeholder="your-unique-slug"
                      className="w-full pl-10 pr-4 py-3 bg-bg-input border border-border-default rounded-xl text-text-primary placeholder-text-muted focus:outline-none focus:border-brand-gold-muted focus:ring-1 focus:ring-brand-gold-muted/20 transition-all text-sm font-semibold"
                    />
                  </div>
                </div>

                {/* Specialization */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest block">
                    ความชื่นชอบ / ความถนัดพิเศษ
                  </label>
                  <input
                    type="text"
                    name="specialization"
                    value={profile.specialization}
                    onChange={handleInputChange}
                    placeholder="เช่น นักการตลาดออนไลน์, อาหารเสริมสุขภาพ"
                    className="w-full px-4 py-3 bg-bg-input border border-border-default rounded-xl text-text-primary placeholder-text-muted focus:outline-none focus:border-brand-gold-muted focus:ring-1 focus:ring-brand-gold-muted/20 transition-all text-sm font-semibold"
                  />
                </div>

                {/* Bio / Quote */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest block">
                    สโลแกนดึงดูด (Bio / Quote)
                  </label>
                  <input
                    type="text"
                    name="bio"
                    value={profile.bio}
                    onChange={handleInputChange}
                    placeholder="คำคม หรือเป้าหมายธุรกิจสั้นๆ ที่สร้างแรงบันดาลใจ"
                    className="w-full px-4 py-3 bg-bg-input border border-border-default rounded-xl text-text-primary placeholder-text-muted focus:outline-none focus:border-brand-gold-muted focus:ring-1 focus:ring-brand-gold-muted/20 transition-all text-sm font-semibold"
                  />
                </div>

                {/* LINE ID */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest block flex items-center gap-1">
                    <MessageCircle size={12} className="text-emerald-600" /> LINE ID ส่วนตัว
                  </label>
                  <input
                    type="text"
                    name="line_id"
                    value={profile.line_id}
                    onChange={handleInputChange}
                    placeholder="line-id"
                    className="w-full px-4 py-3 bg-bg-input border border-border-default rounded-xl text-text-primary placeholder-text-muted focus:outline-none focus:border-brand-gold-muted focus:ring-1 focus:ring-brand-gold-muted/20 transition-all text-sm font-semibold"
                  />
                </div>

                {/* LINE OA */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest block flex items-center gap-1">
                    <MessageCircle size={12} className="text-emerald-600" /> LINE OA ระบบทีม (ถ้ามี)
                  </label>
                  <input
                    type="text"
                    name="line_oa"
                    value={profile.line_oa}
                    onChange={handleInputChange}
                    placeholder="@lineoa"
                    className="w-full px-4 py-3 bg-bg-input border border-border-default rounded-xl text-text-primary placeholder-text-muted focus:outline-none focus:border-brand-gold-muted focus:ring-1 focus:ring-brand-gold-muted/20 transition-all text-sm font-semibold"
                  />
                </div>

                {/* YouTube Link */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest block flex items-center gap-1">
                    <Tv size={12} className="text-red-500" /> ลิงก์ช่อง YouTube / คอนเทนต์วีดีโอของคุณ
                  </label>
                  <input
                    type="url"
                    name="youtube_url"
                    value={profile.youtube_url}
                    onChange={handleInputChange}
                    placeholder="https://youtube.com/c/yourchannel"
                    className="w-full px-4 py-3 bg-bg-input border border-border-default rounded-xl text-text-primary placeholder-text-muted focus:outline-none focus:border-brand-gold-muted focus:ring-1 focus:ring-brand-gold-muted/20 transition-all text-sm font-semibold"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={saving}
                className="w-full md:w-auto px-8 py-4 btn-gold rounded-xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm uppercase tracking-wider ml-auto font-semibold"
              >
                {saving ? (
                  <Loader2 className="w-5 h-5 animate-spin text-white" />
                ) : (
                  <>
                    <Save size={16} />
                    <span>บันทึกข้อมูล</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </MemberLayout>
  );
}
