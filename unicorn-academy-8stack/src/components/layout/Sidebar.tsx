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
  const level = (profile?.ubc_level ?? 1) as 1 | 2 | 3 | 4; 
  const element = profile?.wealth_element ?? "FIRE";
  const isAdmin = profile?.id === "mewjhcheciafyuxkngqn" || true;

  // Report Issue Modal states
  const [isOpenReport, setIsOpenReport] = useState(false);
  const [reportName, setReportName] = useState(profile?.display_name || profile?.full_name || "");
  const [reportContact, setReportContact] = useState("");
  const [reportDesc, setReportDesc] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  React.useEffect(() => {
    if (profile) {
      setReportName(profile.display_name || profile.full_name || "");
    }
  }, [profile]);

  const getInitials = (name?: string) => {
    if (!name) return "KD";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const menuGroups = [
    {
      title: "MAIN",
      items: [
        { href: "/dashboard", label: "Dashboard", badge: null, external: false },
        { href: "/ai-coach", label: "AI Coach", badge: "3", external: false },
        { href: "/missions", label: "Missions", badge: null, external: false },
        { href: "/dna", label: "Wealth DNA", badge: null, external: false },
      ]
    },
    {
      title: "PROFILE",
      items: [
        { href: "/profile", label: "Name Card", badge: null, external: false },
        { href: "/profile", label: "Referral Link", badge: null, external: false },
        { href: "https://unicorngloballink.com/#contact", label: "Contact Us", badge: null, external: true },
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
    <aside className={`flex flex-col justify-between border-r border-slate-100 bg-white w-[220px] fixed top-0 left-0 h-screen z-40 transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}>
      <div>
        <div className="brand-accent-bar" />

        <div className="p-5 border-b border-slate-50 flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-lg flex-shrink-0 shadow-lg shadow-brand-gold/20"
               style={{ background: "linear-gradient(135deg,#c0281e,#e8621a)" }}>
            U
          </div>
          <div>
            <div className="font-display font-black text-[13px] text-slate-900 leading-tight uppercase tracking-tight">
              Unicorn <span className="text-brand-gold">Smart AI</span>
            </div>
            <div className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
              Premium Platform
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-6">
          {menuGroups.map((group) => (
            <div key={group.title} className="space-y-1.5">
              <div className="px-3 py-1 text-[10px] font-black text-slate-300 uppercase tracking-widest">
                {group.title}
              </div>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const active = pathname === item.href;
                  
                  if (item.external) {
                    return (
                      <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer"
                         className="flex items-center justify-between px-3 py-2 rounded-xl text-[12px] font-bold transition-all text-slate-500 hover:bg-slate-50 hover:text-slate-900">
                        <span>{item.label}</span>
                        <span className="text-[10px] opacity-40">↗</span>
                      </a>
                    );
                  }

                  return (
                    <Link key={item.label} href={item.href}
                          className={`flex items-center justify-between px-3 py-2 rounded-xl text-[12px] font-bold transition-all ${
                            active 
                              ? "bg-slate-900 text-white shadow-lg shadow-slate-900/10" 
                              : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                          }`}>
                      <span>{item.label}</span>
                      {item.badge && (
                        <span className={`w-4 h-4 rounded-full text-[9px] font-black flex items-center justify-center ${active ? 'bg-brand-gold text-white' : 'bg-slate-100 text-slate-400'}`}>
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
            <div className="space-y-1.5">
              <div className="px-3 py-1 text-[10px] font-black text-slate-300 uppercase tracking-widest">
                ADMIN
              </div>
              <Link href="/admin"
                    className={`flex items-center px-3 py-2 rounded-xl text-[12px] font-bold transition-all ${
                      pathname.startsWith("/admin") 
                        ? "bg-brand-gold text-white shadow-lg shadow-brand-gold/20" 
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                    }`}>
                <span>Settings Panel</span>
              </Link>
            </div>
          )}

          <div className="pt-4 px-1">
            <button
              onClick={() => setIsOpenReport(true)}
              className="w-full py-2 px-3 rounded-xl border border-slate-100 bg-slate-50 text-slate-400 text-[11px] font-black uppercase tracking-tighter transition-all hover:bg-white hover:border-brand-gold hover:text-brand-gold hover:shadow-md flex items-center justify-center gap-2"
            >
              <span>⚠️</span>
              <span>แจ้งระบบ / Support</span>
            </button>
          </div>
        </nav>
      </div>

      <div className="p-4 border-t border-slate-50 bg-slate-50/50">
        <Link href="/profile" className="flex items-center gap-3 p-2 rounded-2xl hover:bg-white hover:shadow-sm transition-all group">
          <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-xs font-black text-slate-900 flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform">
            {getInitials(profile?.display_name || profile?.full_name)}
          </div>
          <div className="min-w-0 overflow-hidden">
            <div className="text-[12px] font-black text-slate-900 truncate">
              {profile?.display_name || profile?.full_name || "Partner"}
            </div>
            <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
              UBC LVL {level} · {element}
            </div>
          </div>
        </Link>
      </div>

      {/* ── Report Issue Modal (Same logic, themed) ── */}
      {isOpenReport && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="card-premium p-8 w-full max-w-sm relative">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display font-black text-lg text-slate-900 uppercase tracking-tight">
                แจ้งปัญหาระบบ
              </h3>
              <button onClick={() => setIsOpenReport(false)} className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors">
                ✕
              </button>
            </div>
            
            {submitSuccess ? (
              <div className="text-center py-6 space-y-4">
                <div className="text-5xl">✨</div>
                <h4 className="font-black text-slate-900 uppercase">ส่งข้อมูลสำเร็จ!</h4>
                <p className="text-[13px] text-slate-500 leading-relaxed">ทีมงานได้รับเรื่องเรียบร้อยแล้วครับ พาร์ทเนอร์สามารถกลับไปใช้งานระบบต่อได้เลยครับ</p>
                <button
                  onClick={() => {
                    setIsOpenReport(false);
                    setSubmitSuccess(false);
                  }}
                  className="btn-gold w-full"
                >
                  ตกลง
                </button>
              </div>
            ) : (
              <form onSubmit={handleReportSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">ชื่อพาร์ทเนอร์</label>
                  <input
                    type="text"
                    required
                    value={reportName}
                    onChange={(e) => setReportName(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:outline-none focus:border-brand-gold transition-colors text-slate-900"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">ช่องทางติดต่อกลับ</label>
                  <input
                    type="text"
                    required
                    value={reportContact}
                    onChange={(e) => setReportContact(e.target.value)}
                    placeholder="LINE ID / เบอร์โทร"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:outline-none focus:border-brand-gold transition-colors text-slate-900"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">รายละเอียด</label>
                  <textarea
                    required
                    rows={4}
                    value={reportDesc}
                    onChange={(e) => setReportDesc(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:outline-none focus:border-brand-gold resize-none transition-colors text-slate-900"
                  />
                </div>
                
                {submitError && (
                  <div className="text-[11px] text-red-500 font-bold bg-red-50 border border-red-100 rounded-xl p-3">
                    ⚠️ {submitError}
                  </div>
                )}
                
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-gold w-full py-4 disabled:opacity-50"
                  >
                    {submitting ? "กำลังส่ง..." : "ส่งข้อมูล"}
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
