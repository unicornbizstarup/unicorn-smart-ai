"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Sparkles,
  ChevronLeft,
  Upload,
  Camera,
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Tv,
  MessageCircle,
  Link as LinkIcon,
  HelpCircle,
} from "lucide-react";
import { createClient } from "@/lib/supabase";
import Link from "next/link";
import Image from "next/image";

export default function ProfilePage() {
  const router = useRouter();
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>({
    full_name: "",
    specialization: "",
    bio: "",
    line_id: "",
    line_oa: "",
    youtube_url: "",
    referral_slug: "",
    avatar_url: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProfile() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push("/auth/login");
          return;
        }
        setUser(user);

        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (profileError) throw profileError;

        if (profileData) {
          setProfile({
            full_name: profileData.full_name || "",
            specialization: profileData.specialization || "",
            bio: profileData.bio || "",
            line_id: profileData.line_id || "",
            line_oa: profileData.line_oa || "",
            youtube_url: profileData.youtube_url || "",
            referral_slug: profileData.referral_slug || "",
            avatar_url: profileData.avatar_url || "",
          });
        }
      } catch (err: any) {
        console.error("Error loading profile:", err);
        setError(err.message || "ไม่สามารถโหลดข้อมูลโปรไฟล์ได้");
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

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

    // Validate size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert("รูปภาพต้องมีขนาดไม่เกิน 2MB ครับ");
      return;
    }

    setUploading(true);
    setError("");

    try {
      // 1. Get S3/R2 presigned upload URL from route handler
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

      // 2. Put file to S3/R2 directly
      const uploadRes = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": file.type,
        },
        body: file,
      });

      if (!uploadRes.ok) throw new Error("การอัปโหลดรูปภาพล้มเหลว");

      // 3. Update local state and profiles table in Supabase
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

    // Validate referral slug
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

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-dark flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 text-brand-gold animate-spin" />
          <p className="text-sm text-white/60 font-semibold">กำลังโหลดหน้านามบัตรดิจิทัล...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-dark text-white flex flex-col justify-between">
      {/* Header */}
      <header className="px-6 py-5 max-w-5xl w-full mx-auto flex items-center justify-between shrink-0 border-b border-white/5">
        <Link href="/dashboard" className="flex items-center gap-2 group text-white/80 hover:text-white transition-colors">
          <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-semibold text-sm">กลับหน้าแดชบอร์ด</span>
        </Link>
        <span className="text-brand-gold font-bold tracking-widest text-xs uppercase">Digital Name Card</span>
      </header>

      {/* Main Form */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 md:p-8">
        <form onSubmit={handleSubmit} className="grid md:grid-cols-3 gap-8 items-start">
          {/* Avatar and branding preview card */}
          <div className="md:col-span-1 glass p-6 border-white/10 flex flex-col items-center text-center space-y-6 bg-white/[0.01]">
            <h3 className="text-xs font-black text-white/30 uppercase tracking-widest block w-full text-left">
              รูปภาพนามบัตร
            </h3>

            {/* Upload Area */}
            <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
              <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-brand-gold/30 group-hover:border-brand-gold relative transition-all duration-300">
                {profile.avatar_url ? (
                  <Image
                    src={profile.avatar_url}
                    alt={profile.full_name || "Profile Avatar"}
                    fill
                    sizes="128px"
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-white/5 flex items-center justify-center text-white/20">
                    <User size={48} />
                  </div>
                )}

                {/* Upload Hover Overlay */}
                <div className="absolute inset-0 bg-brand-dark/70 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Camera size={24} className="text-brand-gold animate-bounce" />
                  <span className="text-[10px] font-bold text-white/80 mt-1">คลิกเพื่อเปลี่ยน</span>
                </div>
              </div>

              {/* Uploading Spinner */}
              {uploading && (
                <div className="absolute inset-0 bg-brand-dark/80 rounded-full flex items-center justify-center border-2 border-brand-gold">
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
              <h2 className="text-xl font-display text-brand-gold truncate">
                {profile.full_name || "ชื่อผู้ใช้"}
              </h2>
              <p className="text-xs text-white/50 italic leading-relaxed">
                {profile.bio || `"สโลแกนหรือแนวคิดทางธุรกิจของคุณ"`}
              </p>
              {profile.specialization && (
                <span className="inline-block px-3 py-1 bg-brand-gold/15 border border-brand-gold/25 rounded-full text-brand-gold text-[10px] font-black uppercase tracking-wider">
                  ✨ {profile.specialization}
                </span>
              )}
            </div>

            <div className="pt-4 border-t border-white/5 w-full space-y-3">
              <div className="text-left">
                <span className="text-[9px] font-black text-white/30 uppercase tracking-widest block mb-1">
                  ลิงก์แนะนำตัวบอกต่อธุรกิจของคุณ
                </span>
                <div className="bg-white/5 p-3 rounded-xl border border-white/5 text-xs text-brand-gold/90 font-semibold break-all flex items-center justify-between">
                  <span className="truncate select-all">
                    /{profile.referral_slug || "your-link"}
                  </span>
                  <Link
                    href={`/referral/${profile.referral_slug}`}
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
          <div className="md:col-span-2 space-y-6">
            {/* Status alerts */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-3">
                <AlertCircle size={20} className="text-red-400 shrink-0" />
                <p className="text-xs text-red-400 font-semibold">{error}</p>
              </div>
            )}

            {saveSuccess && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex items-center gap-3">
                <CheckCircle2 size={20} className="text-emerald-400 shrink-0" />
                <p className="text-xs text-emerald-400 font-semibold">อัปเดตข้อมูลนามบัตรเรียบร้อยแล้วครับ! 🦄✨</p>
              </div>
            )}

            <div className="glass p-6 md:p-8 border-white/10 bg-white/[0.01] space-y-6">
              <div className="space-y-1">
                <h3 className="text-lg font-display text-brand-gold">แก้ไขรายละเอียดนามบัตรดิจิทัล</h3>
                <p className="text-xs text-white/50">กรอกข้อมูลส่วนบุคคลและช่องทางการติดต่อของพาร์ทเนอร์</p>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                {/* Full name */}
                <div className="space-y-2 col-span-2">
                  <label className="text-[10px] font-black text-white/40 uppercase tracking-widest block">
                    ชื่อ - นามสกุลจริง
                  </label>
                  <input
                    type="text"
                    name="full_name"
                    value={profile.full_name}
                    onChange={handleInputChange}
                    placeholder="ระบุชื่อและนามสกุลที่ต้องการให้แสดงผล"
                    className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-brand-gold/50 focus:ring-1 focus:ring-brand-gold/20 transition-all text-sm font-semibold"
                  />
                </div>

                {/* Referral slug */}
                <div className="space-y-2 col-span-2">
                  <label className="text-[10px] font-black text-white/40 uppercase tracking-widest block flex items-center gap-1.5">
                    <span>ลิงก์แนะนำตัวบอกต่อ (Referral Slug)</span>
                    <span title="จะถูกใช้เป็น URL สำหรับแนะนำทีม เช่น domain/referral/yourname" className="cursor-help">
                      <HelpCircle size={12} className="text-white/30" />
                    </span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 font-bold text-sm">
                      /referral/
                    </span>
                    <input
                      type="text"
                      name="referral_slug"
                      value={profile.referral_slug}
                      onChange={handleInputChange}
                      placeholder="your-unique-slug"
                      className="w-full pl-24 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-brand-gold/50 focus:ring-1 focus:ring-brand-gold/20 transition-all text-sm font-semibold"
                    />
                  </div>
                </div>

                {/* Specialization */}
                <div className="space-y-2 col-span-1">
                  <label className="text-[10px] font-black text-white/40 uppercase tracking-widest block">
                    ความชื่นชอบ / ความถนัดพิเศษ
                  </label>
                  <input
                    type="text"
                    name="specialization"
                    value={profile.specialization}
                    onChange={handleInputChange}
                    placeholder="เช่น นักการตลาดออนไลน์, อาหารเสริมสุขภาพ"
                    className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-brand-gold/50 focus:ring-1 focus:ring-brand-gold/20 transition-all text-sm font-semibold"
                  />
                </div>

                {/* Bio / Quote */}
                <div className="space-y-2 col-span-1">
                  <label className="text-[10px] font-black text-white/40 uppercase tracking-widest block">
                    สโลแกนดึงดูด (Bio / Quote)
                  </label>
                  <input
                    type="text"
                    name="bio"
                    value={profile.bio}
                    onChange={handleInputChange}
                    placeholder="คำคม หรือเป้าหมายธุรกิจสั้นๆ ที่สร้างแรงบันดาลใจ"
                    className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-brand-gold/50 focus:ring-1 focus:ring-brand-gold/20 transition-all text-sm font-semibold"
                  />
                </div>

                {/* LINE ID */}
                <div className="space-y-2 col-span-1">
                  <label className="text-[10px] font-black text-white/40 uppercase tracking-widest block flex items-center gap-1">
                    <MessageCircle size={12} className="text-emerald-400" /> LINE ID ส่วนตัว
                  </label>
                  <input
                    type="text"
                    name="line_id"
                    value={profile.line_id}
                    onChange={handleInputChange}
                    placeholder="line-id"
                    className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-brand-gold/50 focus:ring-1 focus:ring-brand-gold/20 transition-all text-sm font-semibold"
                  />
                </div>

                {/* LINE OA */}
                <div className="space-y-2 col-span-1">
                  <label className="text-[10px] font-black text-white/40 uppercase tracking-widest block flex items-center gap-1">
                    <MessageCircle size={12} className="text-emerald-500 animate-pulse" /> LINE OA ระบบทีม (ถ้ามี)
                  </label>
                  <input
                    type="text"
                    name="line_oa"
                    value={profile.line_oa}
                    onChange={handleInputChange}
                    placeholder="@lineoa"
                    className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-brand-gold/50 focus:ring-1 focus:ring-brand-gold/20 transition-all text-sm font-semibold"
                  />
                </div>

                {/* YouTube Link */}
                <div className="space-y-2 col-span-2">
                  <label className="text-[10px] font-black text-white/40 uppercase tracking-widest block flex items-center gap-1">
                    <Tv size={12} className="text-red-500" /> ลิงก์ช่อง YouTube / คอนเทนต์วีดีโอของคุณ
                  </label>
                  <input
                    type="url"
                    name="youtube_url"
                    value={profile.youtube_url}
                    onChange={handleInputChange}
                    placeholder="https://youtube.com/c/yourchannel"
                    className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-brand-gold/50 focus:ring-1 focus:ring-brand-gold/20 transition-all text-sm font-semibold"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={saving}
                className="w-full md:w-auto px-8 py-4 bg-brand-gold text-brand-dark font-black rounded-xl hover:bg-brand-gold/90 transition-all shadow-xl shadow-brand-gold/10 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm uppercase tracking-wider ml-auto"
              >
                {saving ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
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
      </main>

      {/* Footer */}
      <footer className="py-5 text-center text-white/40 text-xs shrink-0 border-t border-white/5">
        &copy; {new Date().getFullYear()} Unicorn Global Link Co., Ltd. - All Rights Reserved.
      </footer>
    </div>
  );
}
