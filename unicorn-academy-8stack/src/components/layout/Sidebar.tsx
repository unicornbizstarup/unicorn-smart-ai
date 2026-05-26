"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Profile } from "@/types";

interface Props {
  profile: Profile | null;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ profile, isOpen = false, onClose }: Props) {
  const pathname = usePathname();
  const level = (profile?.ubc_level ?? 3) as 1 | 2 | 3 | 4; // fallback to 3 as shown in image
  const element = profile?.wealth_element ?? "FIRE";
  const isAdmin = profile?.id === "mewjhcheciafyuxkngqn" || true; // developer fallback true

  // Report Issue Modal states
  const [isOpenReport, setIsOpenReport] = useState(false);
  const [reportName, setReportName] = useState(profile?.display_name || profile?.full_name || "");
  const [reportContact, setReportContact] = useState("");
  const [reportDesc, setReportDesc] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Sync profile name when profile loads
  React.useEffect(() => {
    if (profile) {
      setReportName(profile.display_name || profile.full_name || "");
    }
  }, [profile]);

  // Generate initials for avatar (e.g. "ครูเด่น" -> "คด", "Anusorn" -> "AN")
  const getInitials = (name?: string) => {
    if (!name) return "KD";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  // Custom menu grouping
  const menuGroups = [
    {
      title: "MAIN",
      items: [
        { href: "/dashboard", label: "หน้าหลัก (Dashboard)", badge: null, external: false },
        { href: "/ai-coach", label: "น้องยูนิ (AI Coach)", badge: "3", external: false },
        { href: "/missions", label: "ภารกิจ (Missions)", badge: null, external: false },
        { href: "/dna", label: "Wealth DNA", badge: null, external: false },
      ]
    },
    {
      title: "PROFILE",
      items: [
        { href: "/profile", label: "นามบัตร (Name Card)", badge: null, external: false },
        { href: "/profile", label: "ลิงก์แนะนำ (Referral Link)", badge: null, external: false },
        { href: "https://unicorngloballink.com/#contact", label: "ติดต่อเรา (Contact Us)", badge: null, external: true },
      ]
    }
  ];

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportName.trim() || !reportContact.trim() || !reportDesc.trim()) {
      setSubmitError("กรุณากรอกข้อมูลให้ครบถ้วนทุกช่องครับ");
      return;
    }

    setSubmitting(true);
    setSubmitError("");

    try {
      const res = await fetch("/api/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "report_issue",
          payload: {
            name: reportName,
            contact: reportContact,
            description: reportDesc
          }
        })
      });

      if (!res.ok) throw new Error("การส่งข้อมูลล้มเหลว");
      
      setSubmitSuccess(true);
      setReportContact("");
      setReportDesc("");
    } catch (err: any) {
      console.error("Report submit error:", err);
      setSubmitError(err.message || "เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <aside className={`flex flex-col justify-between border-r border-[#e8e2d9] bg-white w-[220px] fixed top-0 left-0 h-screen z-40 transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}>
      <div>
        {/* Brand accent bar */}
        <div className="brand-accent-bar animate-pulse" />

        {/* Logo area */}
        <div className="p-4 border-b border-[#e8e2d9] flex items-center gap-2">
          {/* Gold gradient unicorn icon */}
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base flex-shrink-0 shadow-sm"
               style={{ background: "linear-gradient(135deg, #cba258, #a47e3b)" }}>
            🦄
          </div>
          <div>
            <div className="font-display font-bold text-sm text-[#1a1209] leading-tight tracking-wide">
              Unicorn Academy
            </div>
            <div className="text-[8px] font-bold text-[#b0a28e] uppercase tracking-widest mt-0.5">
              SMART AI PLATFORM
            </div>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="p-3 space-y-4">
          {menuGroups.map((group) => (
            <div key={group.title} className="space-y-1">
              <div className="nav-section-label px-3 py-1 text-[10px] font-bold text-[#b0a28e] uppercase tracking-wider">
                {group.title}
              </div>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const active = pathname === item.href;
                  
                  if (item.external) {
                    return (
                      <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer"
                         className="nav-item flex items-center justify-between px-3 py-1.5 rounded-lg text-xs transition-all text-[#6b5e4a] hover:bg-[#faf5ec] font-medium">
                        <span className="pl-1">{item.label}</span>
                        <span className="text-[9px] opacity-40">↗</span>
                      </a>
                    );
                  }

                  return (
                    <Link key={item.label} href={item.href}
                          className={`nav-item flex items-center justify-between px-3 py-1.5 rounded-lg text-xs transition-all ${
                            active 
                              ? "bg-[#f5e8d0] text-[#b8924a] font-bold shadow-sm" 
                              : "text-[#6b5e4a] hover:bg-[#faf5ec] font-medium"
                          }`}>
                      <span className="pl-1">{item.label}</span>
                      {item.badge && (
                        <span className="w-4 h-4 rounded-full bg-[#b8924a] text-white text-[9px] font-black flex items-center justify-center shadow-sm">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}

          {isAdmin && (
            <div className="space-y-1">
              <div className="nav-section-label px-3 py-1 text-[10px] font-bold text-[#b0a28e] uppercase tracking-wider">
                ADMIN
              </div>
              <Link href="/admin"
                    className={`nav-item flex items-center px-3 py-1.5 rounded-lg text-xs transition-all ${
                      pathname.startsWith("/admin") 
                        ? "bg-[#f5e8d0] text-[#b8924a] font-bold shadow-sm" 
                        : "text-[#6b5e4a] hover:bg-[#faf5ec] font-medium"
                    }`}>
                <span className="pl-1">จัดการระบบ (Settings)</span>
              </Link>
            </div>
          )}

          {/* ── Report Issue Button ── */}
          <div className="pt-2 px-1">
            <button
              onClick={() => setIsOpenReport(true)}
              className="w-full py-1.5 px-3 rounded-lg border border-[#e8cda4] bg-[#fdf8f0] text-[#b8924a] text-xs font-bold transition-all hover:bg-[#fef6ea] hover:border-[#d4a96e] flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
            >
              <span>⚠️</span>
              <span>แจ้งระบบ</span>
            </button>
          </div>
        </nav>
      </div>

      {/* Footer Profile */}
      <div className="p-3 border-t border-[#e8e2d9] bg-white">
        <Link href="/profile" className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#faf5ec] transition-colors">
          {/* Custom golden background for profile avatar */}
          <div className="w-9 h-9 rounded-full bg-[#e8dbbe] border border-[#cba258] flex items-center justify-center text-xs font-bold text-[#8d6727] flex-shrink-0 shadow-inner">
            {getInitials(profile?.display_name || profile?.full_name)}
          </div>
          <div className="min-w-0 overflow-hidden">
            <div className="text-xs font-black text-[#1a1209] truncate">
              {profile?.display_name || profile?.full_name || "ครูเด่น"}
            </div>
            <div className="text-[9px] text-[#9a8a72] mt-0.5 font-bold uppercase tracking-wider">
              UBC Level {level} · {element} 🔥
            </div>
          </div>
        </Link>
      </div>

      {/* ── Report Issue Modal (LINE Notify Popup) ── */}
      {isOpenReport && (
        <div className="fixed inset-0 bg-[#1a1209]/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-[#e8e2d9] rounded-2xl p-6 w-full max-w-sm shadow-2xl relative text-[#1a1209]">
            <div className="flex items-center justify-between border-b border-[#f0ebe3] pb-3 mb-4">
              <h3 className="font-display font-black text-sm text-[#1a1209] flex items-center gap-2">
                <span>🚨</span> แจ้งปัญหาระบบการใช้งาน
              </h3>
              <button onClick={() => setIsOpenReport(false)} className="text-[#9a8a72] hover:text-[#1a1209] transition-colors text-sm">
                ✕
              </button>
            </div>
            
            {submitSuccess ? (
              <div className="text-center py-6 space-y-3">
                <div className="text-4xl">🦄🎉</div>
                <h4 className="font-bold text-xs text-[#1a6640] bg-[#d1f0e0] border border-[#a2e0c1] rounded-full py-1 px-4 inline-block">ส่งข้อมูลสำเร็จแล้ว!</h4>
                <p className="text-xs text-[#9a8a72] leading-relaxed">ขอบพระคุณสำหรับข้อมูลครับพาร์ทเนอร์ ทีมงานได้รับเรื่องและจะรีบประสานงานแจ้งเตือนไปยัง LINE เพื่อแก้ไขโดยด่วนที่สุดครับ</p>
                <button
                  onClick={() => {
                    setIsOpenReport(false);
                    setSubmitSuccess(false);
                  }}
                  className="mt-4 px-6 py-2 bg-[#b8924a] text-white rounded-lg text-xs font-bold hover:bg-[#a47e3b] transition-colors"
                >
                  ตกลง
                </button>
              </div>
            ) : (
              <form onSubmit={handleReportSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-[#9a8a72] uppercase tracking-wider block">ชื่อพาร์ทเนอร์</label>
                  <input
                    type="text"
                    required
                    value={reportName}
                    onChange={(e) => setReportName(e.target.value)}
                    placeholder="ชื่อผู้ส่งแจ้งเรื่อง"
                    className="w-full px-3 py-2 bg-[#fdfbf7] border border-[#e8e2d9] rounded-lg text-xs font-semibold focus:outline-none focus:border-[#d4a96e] text-[#1a1209]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-[#9a8a72] uppercase tracking-wider block">ช่องทางติดต่อกลับ (เบอร์โทร / LINE ID)</label>
                  <input
                    type="text"
                    required
                    value={reportContact}
                    onChange={(e) => setReportContact(e.target.value)}
                    placeholder="เบอร์โทรศัพท์ หรือ LINE ID สำหรับติดต่อกลับ"
                    className="w-full px-3 py-2 bg-[#fdfbf7] border border-[#e8e2d9] rounded-lg text-xs font-semibold focus:outline-none focus:border-[#d4a96e] text-[#1a1209]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-[#9a8a72] uppercase tracking-wider block">รายละเอียดของปัญหา</label>
                  <textarea
                    required
                    rows={4}
                    value={reportDesc}
                    onChange={(e) => setReportDesc(e.target.value)}
                    placeholder="กรอกรายละเอียด หรือข้อบกพร่องที่ต้องการให้ปรับปรุง..."
                    className="w-full px-3 py-2 bg-[#fdfbf7] border border-[#e8e2d9] rounded-lg text-xs font-semibold focus:outline-none focus:border-[#d4a96e] resize-none text-[#1a1209]"
                  />
                </div>
                
                {submitError && (
                  <div className="text-[10px] text-red-500 font-bold bg-red-50 border border-red-100 rounded-lg p-2">
                    ⚠️ {submitError}
                  </div>
                )}
                
                <div className="flex gap-2 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setIsOpenReport(false)}
                    className="px-4 py-2 border border-[#d6cfc4] hover:bg-[#faf5ec] text-[#6b5e4a] text-xs font-bold rounded-lg transition-colors"
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2 bg-[#b8924a] text-white hover:bg-[#a47e3b] text-xs font-bold rounded-lg transition-colors flex items-center gap-1 disabled:opacity-50"
                  >
                    {submitting ? "กำลังส่ง..." : "ส่งเรื่องด่วน"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </aside>
  );
}
