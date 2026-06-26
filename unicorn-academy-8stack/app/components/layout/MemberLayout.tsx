import { type ReactNode } from "react";
import type { Profile } from "@/types";
import { Link, useLocation } from "react-router";
import { LayoutDashboard, Layers, Sparkles, Trophy, ChevronLeft } from "lucide-react";

interface Props {
  children: ReactNode;
  profile: Profile | null;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

export default function MemberLayout({ children, profile, title, subtitle, actions }: Props) {
  const location = useLocation();
  const currentPath = location.pathname;

  const isAdmin = profile?.id === "mewjhcheciafyuxkngqn" || profile?.is_admin === true;

  // Determine active view based on paths
  const isDashboardActive = currentPath === "/dashboard";
  const isCoursesActive = ["/startup", "/products", "/knowledge", "/functions", "/missions", "/ubc-program"].some(path => currentPath.startsWith(path));
  const isAiCoachActive = currentPath.startsWith("/ai-coach");
  const isProfileActive = currentPath.startsWith("/profile") || currentPath.startsWith("/dna");

  return (
    <div className="min-h-screen bg-[#f1eeeb] flex items-center justify-center p-0 sm:p-4 font-body">
      {/* Centered Mobile Frame Wrapper */}
      <div className="w-full max-w-[430px] min-h-screen sm:min-h-[850px] sm:max-h-[900px] bg-bg-page shadow-2xl relative flex flex-col pb-20 overflow-x-hidden sm:rounded-[2.5rem] sm:border-[8px] sm:border-slate-800">
        
        {/* Header Bar - Height 56px */}
        <header className="h-14 bg-white/85 backdrop-blur-md border-b border-border-default flex items-center justify-between px-4 shrink-0 sticky top-0 z-30">
          <div className="flex items-center gap-2 min-w-0">
            {!isDashboardActive && (
              <Link
                to="/dashboard"
                aria-label="ย้อนกลับ"
                className="p-1 text-text-secondary hover:text-brand-gold rounded-lg transition-colors flex-shrink-0"
              >
                <ChevronLeft className="w-5 h-5 text-text-secondary" />
              </Link>
            )}
            <h1 className="font-display font-bold text-text-primary text-sm leading-tight truncate">
              {title}
            </h1>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {isAdmin && (
              <Link
                to="/admin"
                className="btn-outline !text-[9px] !px-2.5 !py-1 !rounded-full !font-black !uppercase !tracking-tighter transition-all"
              >
                ⚙️ Admin
              </Link>
            )}
            <Link
              to="/profile"
              className="w-8 h-8 rounded-full bg-bg-hover border border-border-default overflow-hidden active:scale-95 transition-transform"
            >
              <img src={profile?.avatar_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=UnicornPartner"} alt="Avatar" className="w-full h-full object-cover" />
            </Link>
          </div>
        </header>

        {/* Content Area - Scrollable */}
        <main className="flex-1 overflow-y-auto p-4 w-full">
          {/* Custom top sub-nav bar for Courses pages in Mobile layout to navigate between Startup, Products, Knowledge, Functions, Missions */}
          {isCoursesActive && (
            <div className="flex bg-white p-1 rounded-xl border border-border-default gap-1 text-center text-[10px] font-bold mb-4 shadow-sm overflow-x-auto scrollbar-hide">
              <Link
                to="/startup"
                className={`flex-1 py-1.5 px-2 rounded-lg whitespace-nowrap transition-colors ${
                  currentPath.startsWith("/startup") ? "bg-brand-gold-light text-brand-gold" : "text-text-secondary hover:bg-bg-hover"
                }`}
              >
                5 เริ่มต้น
              </Link>
              <Link
                to="/products"
                className={`flex-1 py-1.5 px-2 rounded-lg whitespace-nowrap transition-colors ${
                  currentPath.startsWith("/products") ? "bg-brand-gold-light text-brand-gold" : "text-text-secondary hover:bg-bg-hover"
                }`}
              >
                สินค้า
              </Link>
              <Link
                to="/knowledge"
                className={`flex-1 py-1.5 px-2 rounded-lg whitespace-nowrap transition-colors ${
                  currentPath.startsWith("/knowledge") ? "bg-brand-gold-light text-brand-gold" : "text-text-secondary hover:bg-bg-hover"
                }`}
              >
                ความรู้
              </Link>
              <Link
                to="/functions"
                className={`flex-1 py-1.5 px-2 rounded-lg whitespace-nowrap transition-colors ${
                  currentPath.startsWith("/functions") ? "bg-brand-gold-light text-brand-gold" : "text-text-secondary hover:bg-bg-hover"
                }`}
              >
                ฟังก์ชัน
              </Link>
              <Link
                to="/missions"
                className={`flex-1 py-1.5 px-2 rounded-lg whitespace-nowrap transition-colors ${
                  currentPath.startsWith("/missions") ? "bg-brand-gold-light text-brand-gold" : "text-text-secondary hover:bg-bg-hover"
                }`}
              >
                ภารกิจ
              </Link>
            </div>
          )}

          {children}
        </main>

        {/* Sticky Floating Bottom Navigation Bar */}
        <nav className="bottom-nav">
          {/* 1. Home tab */}
          <Link
            to="/dashboard"
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
              isDashboardActive 
                ? 'text-brand-gold font-bold scale-105' 
                : 'text-text-muted hover:text-text-secondary'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="text-[10px] tracking-wide">หน้าหลัก</span>
          </Link>

          {/* 2. Courses tab */}
          <Link
            to="/startup"
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
              isCoursesActive
                ? 'text-brand-gold font-bold scale-105' 
                : 'text-text-muted hover:text-text-secondary'
            }`}
          >
            <Layers className="w-5 h-5" />
            <span className="text-[10px] tracking-wide">หลักสูตร</span>
          </Link>

          {/* 3. AI Coach tab - Nong Uni (Using Sparkles icon to avoid GPT bot look) */}
          <Link
            to="/ai-coach"
            className={`flex flex-col items-center justify-center -translate-y-4 w-14 h-14 bg-gradient-to-tr from-brand-gold to-brand-gold-muted rounded-full shadow-lg text-white active:scale-95 transition-all ${
              isAiCoachActive 
                ? 'ring-4 ring-brand-gold-light scale-110 shadow-xl' 
                : ''
            }`}
            aria-label="แชทกับน้องยูนิ"
          >
            <Sparkles className="w-6 h-6 animate-pulse" />
          </Link>

          {/* 4. Profile tab */}
          <Link
            to="/profile"
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
              isProfileActive
                ? 'text-brand-gold font-bold scale-105' 
                : 'text-text-muted hover:text-text-secondary'
            }`}
          >
            <Trophy className="w-5 h-5" />
            <span className="text-[10px] tracking-wide">โปรไฟล์</span>
          </Link>
        </nav>
      </div>
    </div>
  );
}
