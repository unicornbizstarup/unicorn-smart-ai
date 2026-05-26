"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import type { Profile } from "@/types";
import {
  LayoutDashboard,
  Bot,
  Trophy,
  Dna,
  CreditCard,
  Link as LinkIcon,
  Settings,
  Sparkles,
  Rocket,
  Layers,
  GraduationCap,
  FolderOpen,
  BookOpen,
  Info,
  PhoneCall,
  LogOut,
  CalendarDays,
  Menu
} from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push("/auth/login");
          return;
        }

        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
        
        if (data) setProfile(data as Profile);
      } catch (err) {
        console.error("Error fetching profile inside layout:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProfile();
  }, [router, supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth/login");
    router.refresh();
  };

  const nameInitial = profile?.full_name ? profile.full_name.slice(0, 2).toUpperCase() : "KD";
  const level = profile?.ubc_level ?? 1;
  const wealth = profile?.wealth_element ?? "FIRE";

  // 1. Core Intelligence Navigation
  const coreNav = [
    { name: "น้องยูนิ (AI Coach)", icon: Bot, path: "/ai-coach", badge: "3" },
    { name: "5 เริ่มต้น (Startup)", icon: Rocket, path: "/startup" },
    { name: "Wealth DNA", icon: Dna, path: "/dna" },
  ];

  // 2. Platform Features Navigation
  const platformNav = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { name: "UBC Program (Academy)", icon: Trophy, path: "/ubc-program" },
    { name: "ระบบ 456", icon: Layers, path: "/system456" },
    { name: "Function to Function", icon: GraduationCap, path: "/functions" },
    { name: "คลังความรู้", icon: FolderOpen, path: "/knowledge" },
    { name: "สินค้าทั้งหมด (Products)", icon: BookOpen, path: "/products" },
    { name: "เกี่ยวกับเรา (About)", icon: Info, path: "/about" },
    { name: "ติดต่อเรา (Contact)", icon: PhoneCall, path: "/contact" },
  ];

  const getPageTitle = () => {
    const allItems = [...coreNav, ...platformNav, 
      { name: "ข้อมูลส่วนตัว", path: "/profile" },
      { name: "Referral Link", path: "/referral" },
      { name: "Settings", path: "/admin" }
    ];
    const matched = allItems.find(item => pathname.startsWith(item.path));
    return matched ? matched.name : "Dashboard";
  };

  return (
    <div className="sidebar-layout">
      {/* 🦄 Sidebar - แถบเมนูด้านซ้ายดีไซน์พรีเมียม */}
      <aside className={`sidebar ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 transition-transform duration-300 z-40`}>
        {/* Logo Area */}
        <div className="logo-area">
          <div className="logo-row">
            <div className="logo-icon text-white select-none">🦄</div>
            <div>
              <div className="logo-text">Unicorn Academy</div>
              <div className="logo-sub">Smart AI Platform</div>
            </div>
          </div>
        </div>

        {/* Navigation Area */}
        <div className="flex-1 py-4 overflow-y-auto">
          {/* Core Section */}
          <div className="nav-section-label">Core Intelligence</div>
          {coreNav.map((item) => {
            const isActive = pathname.startsWith(item.path);
            return (
              <a
                key={item.name}
                href={item.path}
                className={`nav-item ${isActive ? "active" : ""}`}
              >
                <item.icon size={15} />
                <span>{item.name}</span>
                {item.badge && <span className="nav-badge">{item.badge}</span>}
              </a>
            );
          })}

          {/* Platform Section */}
          <div className="nav-section-label mt-4">Platform Features</div>
          {platformNav.map((item) => {
            const isActive = pathname.startsWith(item.path);
            return (
              <a
                key={item.name}
                href={item.path}
                className={`nav-item ${isActive ? "active" : ""}`}
              >
                <item.icon size={15} />
                <span>{item.name}</span>
              </a>
            );
          })}

          {/* Profile Section */}
          <div className="nav-section-label mt-4">Profile & Admin</div>
          <a
            href="/profile"
            className={`nav-item ${pathname.startsWith("/profile") ? "active" : ""}`}
          >
            <CreditCard size={15} />
            <span>Name Card (โปรไฟล์)</span>
          </a>
          <a
            href="/referral"
            className={`nav-item ${pathname.startsWith("/referral") ? "active" : ""}`}
          >
            <LinkIcon size={15} />
            <span>Referral Link</span>
          </a>
          <a
            href="/admin"
            className={`nav-item ${pathname.startsWith("/admin") ? "active" : ""}`}
          >
            <Settings size={15} />
            <span>Settings</span>
          </a>
        </div>

        {/* Sidebar Footer User Section */}
        <div className="sidebar-footer">
          <div className="user-row" onClick={() => router.push("/profile")}>
            <div className="avatar select-none">{nameInitial}</div>
            <div className="min-w-0 flex-1">
              <div className="user-name truncate">{profile?.full_name ?? "ครูเด่น"}</div>
              <div className="user-level text-xs text-text-secondary truncate">UBC {level} · {wealth} 🔥</div>
            </div>
          </div>
          
          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-text-secondary hover:text-red-600 rounded-lg transition-colors mt-2 text-xs font-bold"
          >
            <LogOut size={14} />
            <span>ออกจากระบบ</span>
          </button>
        </div>
      </aside>

      {/* 🚀 Main Content Area - ด้านขวาของจอ */}
      <div className="main-content flex-1">
        {/* Topbar */}
        <header className="topbar">
          <button
            className="lg:hidden p-2 text-text-secondary hover:bg-nav-active rounded-lg"
            onClick={() => setSidebarOpen(!isSidebarOpen)}
          >
            <Menu size={20} />
          </button>
          
          <div>
            <span className="topbar-title">{getPageTitle()}</span>
            <span className="hidden sm:inline text-xs text-text-secondary ml-2">
              — สวัสดีตอนเช้า {profile?.full_name ?? "ครูเด่น"} 👋
            </span>
          </div>
          
          <div className="ml-auto flex items-center gap-2">
            <button className="btn-outline text-xs">รายงาน</button>
            <button className="btn-gold text-xs">
              <Sparkles size={13} />
              <span>+ เพิ่ม Mission</span>
            </button>
          </div>
        </header>

        {/* Content Box */}
        <div className="p-6 md:p-8 flex-1 overflow-y-auto bg-body-bg">
          {children}
        </div>
      </div>
      
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
