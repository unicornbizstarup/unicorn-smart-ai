import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Layers,
  Rocket,
  CalendarDays,
  Bot,
  Menu,
  X,
  ChevronRight,
  ChevronDown,
  BookOpen,
  Trophy,
  CheckCircle2,
  FolderOpen,
  LogOut,
  GraduationCap,
  Dna,
  Info,
  PhoneCall,
  HelpCircle,
  Loader2,
  Sparkles
} from 'lucide-react';
import { AppView, User } from './types';
import Dashboard from './pages/Dashboard';
import System456 from './pages/System456';
import StartUp from './pages/StartUp';
import Functions from './pages/Functions';
import AICoach from './pages/AICoach';
import Library from './pages/Library';
import Profile from './pages/Profile';
import UBCProgram from './pages/UBCProgram';
import ProductCatalog from './pages/ProductCatalog.tsx';
import WealthDNA from './pages/WealthDNA.tsx';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ReferralPage from './pages/ReferralPage';
import Contact from './pages/Contact';
import About from './pages/About';
import PrivacyPolicy from './pages/PrivacyPolicy';
import GlobalFooter from './components/GlobalFooter';
import { supabase } from './lib/supabase';
import { LanguageProvider, useLanguage } from './hooks/useLanguage';
import LanguageSelector from './components/LanguageSelector';
import ReportIssueModal from './components/ReportIssueModal';
import { TranslationKey } from './lib/translations';

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
};

const AppContent: React.FC = () => {
  const { t } = useLanguage();

  const coreNavigation = [
    { name: 'nav.ai_coach', icon: Bot, view: AppView.AI_COACH, featured: true },
    { name: 'nav.calendar', icon: Rocket, view: AppView.START_UP },
    { name: 'nav.wealth_dna', icon: Dna, view: AppView.WEALTH_DNA },
  ] as const;

  const secondaryNavigation = [
    { name: 'nav.home', icon: LayoutDashboard, view: AppView.DASHBOARD },
    { name: 'nav.ubc_program', icon: Trophy, view: AppView.UBC_PROGRAM },
    { name: 'nav.system456', icon: Layers, view: AppView.SYSTEM_456 },
    { name: 'nav.functions', icon: GraduationCap, view: AppView.FUNCTIONS },
    { name: 'nav.library', icon: FolderOpen, view: AppView.LIBRARY },
    { name: 'nav.products', icon: BookOpen, view: AppView.PRODUCT_CATALOG },
    { name: 'nav.about', icon: Info, view: AppView.ABOUT },
    { name: 'nav.contact', icon: PhoneCall, view: AppView.CONTACT },
  ] as const;

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('unicorn_current_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isInitializing, setIsInitializing] = useState(() => {
    // Only show loader if no cached user OR if it's the very first visit
    return !localStorage.getItem('unicorn_current_user');
  });
  const [referralId, setReferralId] = useState<string | null>(null);
  const [referrer, setReferrer] = useState<User | null>(null);
  const [loadingProgress, setLoadingProgress] = useState(() => localStorage.getItem('unicorn_current_user') ? 100 : 5);
  const [currentView, setCurrentView] = useState<AppView>(() => {
    const savedUser = localStorage.getItem('unicorn_current_user');
    return savedUser ? AppView.DASHBOARD : AppView.LANDING;
  });

  // Check for existing session and referral parameters on mount
  useEffect(() => {
    const initialize = async () => {
      const hasCachedUser = !!localStorage.getItem('unicorn_current_user');
      // Start both in parallel
      const referralPromise = (async () => {
        const params = new URLSearchParams(window.location.search);
        const ref = params.get('ref');
        const pathRef = window.location.pathname.split('/')[1];

        if (ref) {
          localStorage.setItem('unicorn_referral_id', ref);
          setReferralId(ref);
        } else if (pathRef && pathRef.length > 2 && !['login', 'register', 'privacy', 'about', 'contact', 'dashboard', 'products', 'academy', 'system456', 'functions', 'startup', 'library', 'wealth_dna'].includes(pathRef.toLowerCase())) {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('username', pathRef.toLowerCase())
            .single();

          if (data && !error) {
            setReferrer(mapProfileToUser(data));
            setReferralId(data.username);
            localStorage.setItem('unicorn_referral_id', data.username);
            // Always show referral page when accessing via referral URL
            setCurrentView(AppView.REFERRAL_PAGE);
          }
        }
        setLoadingProgress(prev => Math.max(prev, 40));
      })();

      const sessionPromise = (async () => {
        try {
          const { data: { session }, error: sessionError } = await supabase.auth.getSession();
          if (sessionError) throw sessionError;

          if (session?.user) {
            await fetchAndSetUser(session.user);
            // If we are on landing, move to dashboard
            if (currentView === AppView.LANDING) {
              setCurrentView(AppView.DASHBOARD);
            }
          } else if (hasCachedUser) {
            // Cache was invalid or expired
            setCurrentUser(null);
            setCurrentView(AppView.LANDING);
            localStorage.removeItem('unicorn_current_user');
          }
        } catch (err) {
          console.error('Session check error:', err);
          if (hasCachedUser) {
            await supabase.auth.signOut();
            setCurrentUser(null);
            localStorage.removeItem('unicorn_current_user');
          }
        }
        setLoadingProgress(prev => Math.max(prev, 80));
      })();

      await Promise.all([referralPromise, sessionPromise]);
      setLoadingProgress(100);

      // Small delay for smooth transition
      setTimeout(() => setIsInitializing(false), 300);
    };

    initialize();

    // Auto-expand menu if a secondary item is active
    const savedUser = localStorage.getItem('unicorn_current_user');
    if (savedUser) {
      // Small delay to ensure state is set
      setTimeout(() => {
        const path = window.location.pathname;
        // Or check currentView if it was set from elsewhere
      }, 0);
    }

    // 4. Listen for Auth Errors in URL (e.g., bad_oauth_state)
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get('error');
    if (error) {
      console.error('Auth Error Detected:', {
        error,
        code: urlParams.get('error_code'),
        description: urlParams.get('error_description')
      });
      // Cleanup URL to prevent persistent error message state
      const cleanUrl = window.location.origin + window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
    }

    // 5. Listen for Auth Changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      try {
        if (event === 'SIGNED_IN' && session?.user) {
          await fetchAndSetUser(session.user);
          setCurrentView(AppView.DASHBOARD);
        } else if (event === 'SIGNED_OUT') {
          setCurrentUser(null);
          setCurrentView(AppView.LANDING);
          localStorage.removeItem('unicorn_current_user');
        } else if (event === 'TOKEN_REFRESHED') {
          console.log('Token refreshed successfully');
        }
      } catch (err) {
        console.error('Error handling auth state change:', err);
        // Critical failure during auth transition - reset to safe state
        setCurrentUser(null);
        setCurrentView(AppView.LANDING);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const mapProfileToUser = (profileData: any, authUser?: any): User => {
    return {
      id: profileData?.id || authUser?.id,
      fullName: profileData?.full_name || authUser?.user_metadata?.full_name || 'User',
      username: profileData?.username || authUser?.user_metadata?.username || authUser?.email?.split('@')[0],
      email: profileData?.email || authUser?.email || '',
      avatarUrl: profileData?.avatar_url,
      createdAt: profileData?.created_at || authUser?.created_at,
      ubcLevel: profileData?.ubc_level || 1,
      pvPersonal: profileData?.pv_personal || 0,
      pvTeam: profileData?.pv_team || 0,
      isAdmin: profileData?.is_admin || false,
      wealthElement: profileData?.wealth_element,
      referredBy: profileData?.referred_by,
      bio: profileData?.bio,
      youtubeUrl: profileData?.youtube_url,
      lineId: profileData?.line_id,
      lineOaUrl: profileData?.line_oa_url,
      quote: profileData?.quote,
      specialization: profileData?.specialization,
      socialLinks: profileData?.social_links
    };
  };

  const fetchAndSetUser = async (user: any) => {
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') { // PGRST116 is 'not found'
        console.warn('Error fetching profile:', profileError);
      }

      const userData = mapProfileToUser(profileData, user);

      setCurrentUser(userData);
      localStorage.setItem('unicorn_current_user', JSON.stringify(userData));
    } catch (err) {
      console.error('Critical error in fetchAndSetUser:', err);
      // Fallback to basic user info if profile fetch fails completely
      const fallbackUser: User = {
        id: user.id,
        fullName: user.user_metadata?.full_name || 'User',
        username: user.user_metadata?.username || user.email?.split('@')[0],
        email: user.email!,
        ubcLevel: 1,
        pvPersonal: 0,
        pvTeam: 0,
        isAdmin: false,
        createdAt: user.created_at
      };
      setCurrentUser(fallbackUser);
    }
  };

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setCurrentView(AppView.DASHBOARD);
  };

  const handleRegister = (user: User) => {
    setCurrentUser(user);
    setCurrentView(AppView.DASHBOARD);
  };

  const handleLogout = async () => {
    try {
      // Clear local state first for immediate UI response
      setCurrentUser(null);
      setCurrentView(AppView.LANDING);
      setSidebarOpen(false);
      localStorage.removeItem('unicorn_current_user');

      // Attempt to sign out from Supabase
      await supabase.auth.signOut();
    } catch (err) {
      console.error('Logout error:', err);
      // Even if signOut fails, we already cleared local state
    }
  };

  const updateUser = async (updatedUser: User) => {
    setCurrentUser(updatedUser);
    localStorage.setItem('unicorn_current_user', JSON.stringify(updatedUser));

    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: updatedUser.id,
        full_name: updatedUser.fullName,
        username: updatedUser.username,
        email: updatedUser.email,
        avatar_url: updatedUser.avatarUrl,
        wealth_element: updatedUser.wealthElement,
        ubc_level: updatedUser.ubcLevel || 1,
        pv_personal: updatedUser.pvPersonal || 0,
        pv_team: updatedUser.pvTeam || 0,
        bio: updatedUser.bio,
        youtube_url: updatedUser.youtubeUrl,
        line_id: updatedUser.lineId,
        line_oa_url: updatedUser.lineOaUrl,
        quote: updatedUser.quote,
        specialization: updatedUser.specialization,
        social_links: updatedUser.socialLinks,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'id'
      });

    if (error) {
      console.error('Error syncing profile to Supabase:', error);
      // Log more details for debugging
      console.error('Error details:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      });
      throw error;
    }
    return { success: true };
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">
          <div className="relative">
            <div className="absolute inset-0 bg-amber-500/20 blur-3xl rounded-full animate-pulse"></div>
            <div className="relative flex justify-center">
              <div className="p-4 bg-slate-900 ring-1 ring-slate-800 rounded-3xl shadow-2xl">
                <Sparkles className="w-16 h-16 text-amber-500 animate-bounce" />
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Unicorn <span className="text-amber-500">Academy</span>
            </h1>
            <div className="flex flex-col items-center gap-4">
              <div className="h-1 w-48 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 transition-all duration-500 ease-out origin-left"
                  style={{ width: `${loadingProgress}%` }}
                ></div>
              </div>
              <p className="text-slate-400 text-sm font-medium flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
                กำลังเตรียมระบบอัจฉริยะสำหรับคุณ...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ===== AUTH PAGES (not logged in) =====
  if (!currentUser) {
    if (currentView === AppView.LOGIN) {
      return <LoginPage onNavigate={setCurrentView} onLogin={handleLogin} />;
    }
    if (currentView === AppView.REGISTER) {
      return <RegisterPage onNavigate={setCurrentView} onRegister={handleRegister} referralId={referralId} />;
    }
    if (currentView === AppView.REFERRAL_PAGE) {
      return referrer ? (
        <div className="relative">
          <ReferralPage
            referrer={referrer}
            onNavigate={setCurrentView}
            onJoinTeam={() => setCurrentView(AppView.REGISTER)}
          />
          <div className="fixed bottom-6 right-6 z-50">
            <LanguageSelector />
          </div>
        </div>
      ) : (
        <div className="flex flex-col min-h-screen bg-slate-950">
          <div className="flex-1">
            <LandingPage onNavigate={setCurrentView} />
          </div>
          <GlobalFooter onNavigate={setCurrentView} />
          <div className="fixed bottom-6 right-6 z-50">
            <LanguageSelector />
          </div>
        </div>
      );
    }

    const renderPage = () => {
      switch (currentView) {
        case AppView.ABOUT: return <About onNavigate={setCurrentView} />;
        case AppView.CONTACT: return <Contact onNavigate={setCurrentView} />;
        case AppView.PRIVACY_POLICY: return <PrivacyPolicy onNavigate={setCurrentView} />;
        default: return <LandingPage onNavigate={setCurrentView} />;
      }
    };

    return (
      <div className="flex flex-col min-h-screen bg-slate-950">
        <div className="flex-1">
          {renderPage()}
        </div>
        <GlobalFooter onNavigate={setCurrentView} />
        <div className="fixed bottom-6 right-6 z-50">
          <LanguageSelector />
        </div>
      </div>
    );
  }

  // ===== REFERRAL PAGE (logged in - visited via referral URL) =====
  if (currentView === AppView.REFERRAL_PAGE && referrer) {
    return (
      <div className="relative">
        <ReferralPage
          referrer={referrer}
          onNavigate={setCurrentView}
          onJoinTeam={() => setCurrentView(AppView.DASHBOARD)}
        />
        <div className="fixed bottom-6 right-6 z-50">
          <LanguageSelector />
        </div>
      </div>
    );
  }

  // ===== MAIN APP (logged in) =====
  return (
    <div className="min-h-screen bg-[#f1eeeb] flex items-center justify-center p-0 sm:p-4">
      {/* Centered Mobile Frame Wrapper */}
      <div className="w-full max-w-[430px] min-h-screen sm:min-h-[850px] sm:max-h-[900px] bg-bg-page shadow-2xl relative flex flex-col pb-20 overflow-x-hidden sm:rounded-[2.5rem] sm:border-[8px] sm:border-slate-800">
        
        {/* Header Bar - Height 56px */}
        <header className="h-14 bg-white/80 backdrop-blur-md border-b border-border-default flex items-center justify-between px-4 shrink-0 sticky top-0 z-30">
          <div className="flex items-center gap-2">
            {currentView !== AppView.DASHBOARD && (
              <button
                onClick={() => setCurrentView(AppView.DASHBOARD)}
                aria-label="ย้อนกลับ"
                className="p-1 text-text-secondary hover:text-brand-gold rounded-lg transition-colors"
              >
                <ChevronRight className="w-6 h-6 rotate-180 text-text-secondary" />
              </button>
            )}
            <h2 className="text-sm font-display font-bold text-text-primary tracking-tight">
              {currentView === AppView.PROFILE ? 'ข้อมูลส่วนตัว' : (
                [...coreNavigation, ...secondaryNavigation].find(n => n.view === currentView) 
                ? t([...coreNavigation, ...secondaryNavigation].find(n => n.view === currentView)!.name) 
                : 'Unicorn Smart'
              )}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <LanguageSelector direction="down" />
            <button
              onClick={() => setCurrentView(AppView.PROFILE)}
              className="w-8 h-8 rounded-full bg-bg-hover border border-border-default overflow-hidden active:scale-95 transition-transform"
            >
              <img src={currentUser?.avatarUrl || "https://api.dicebear.com/7.x/avataaars/svg?seed=UnicornPartner"} alt="Avatar" className="w-full h-full object-cover" />
            </button>
          </div>
        </header>

        {/* Content Area - Scrollable */}
        <div className="flex-1 overflow-y-auto p-3">
          <div className="w-full h-full">
            {currentView === AppView.DASHBOARD && <Dashboard onNavigate={setCurrentView} currentUser={currentUser} />}
            {currentView === AppView.SYSTEM_456 && (
              <div className="space-y-4">
                {/* Custom top sub-nav bar for Courses in Mobile layout to navigate between System 456, Start Up, Functions */}
                <div className="flex bg-white p-1 rounded-xl border border-border-default gap-1 text-center text-xs font-bold mb-4 shadow-sm">
                  <button 
                    onClick={() => setCurrentView(AppView.SYSTEM_456)} 
                    className="flex-1 py-2 rounded-lg bg-brand-gold-light text-brand-gold"
                  >
                    ระบบ 4-5-6
                  </button>
                  <button 
                    onClick={() => setCurrentView(AppView.START_UP)} 
                    className="flex-1 py-2 rounded-lg text-text-secondary hover:bg-bg-hover"
                  >
                    5 เริ่มต้น
                  </button>
                  <button 
                    onClick={() => setCurrentView(AppView.FUNCTIONS)} 
                    className="flex-1 py-2 rounded-lg text-text-secondary hover:bg-bg-hover"
                  >
                    ฟังก์ชัน
                  </button>
                </div>
                <System456 onNavigate={setCurrentView} />
              </div>
            )}
            {currentView === AppView.START_UP && (
              <div className="space-y-4">
                <div className="flex bg-white p-1 rounded-xl border border-border-default gap-1 text-center text-xs font-bold mb-4 shadow-sm">
                  <button 
                    onClick={() => setCurrentView(AppView.SYSTEM_456)} 
                    className="flex-1 py-2 rounded-lg text-text-secondary hover:bg-bg-hover"
                  >
                    ระบบ 4-5-6
                  </button>
                  <button 
                    onClick={() => setCurrentView(AppView.START_UP)} 
                    className="flex-1 py-2 rounded-lg bg-brand-gold-light text-brand-gold"
                  >
                    5 เริ่มต้น
                  </button>
                  <button 
                    onClick={() => setCurrentView(AppView.FUNCTIONS)} 
                    className="flex-1 py-2 rounded-lg text-text-secondary hover:bg-bg-hover"
                  >
                    ฟังก์ชัน
                  </button>
                </div>
                <StartUp onNavigate={setCurrentView} />
              </div>
            )}
            {currentView === AppView.FUNCTIONS && (
              <div className="space-y-4">
                <div className="flex bg-white p-1 rounded-xl border border-border-default gap-1 text-center text-xs font-bold mb-4 shadow-sm">
                  <button 
                    onClick={() => setCurrentView(AppView.SYSTEM_456)} 
                    className="flex-1 py-2 rounded-lg text-text-secondary hover:bg-bg-hover"
                  >
                    ระบบ 4-5-6
                  </button>
                  <button 
                    onClick={() => setCurrentView(AppView.START_UP)} 
                    className="flex-1 py-2 rounded-lg text-text-secondary hover:bg-bg-hover"
                  >
                    5 เริ่มต้น
                  </button>
                  <button 
                    onClick={() => setCurrentView(AppView.FUNCTIONS)} 
                    className="flex-1 py-2 rounded-lg bg-brand-gold-light text-brand-gold"
                  >
                    ฟังก์ชัน
                  </button>
                </div>
                <Functions onNavigate={setCurrentView} currentUser={currentUser} />
              </div>
            )}
            {currentView === AppView.AI_COACH && <AICoach onNavigate={setCurrentView} />}
            {currentView === AppView.LIBRARY && <Library onNavigate={setCurrentView} />}
            {currentView === AppView.PROFILE && <Profile currentUser={currentUser} onUpdateUser={updateUser} onNavigate={setCurrentView} />}
            {currentView === AppView.UBC_PROGRAM && <UBCProgram onNavigate={setCurrentView} />}
            {currentView === AppView.PRODUCT_CATALOG && <ProductCatalog onNavigate={setCurrentView} />}
            {currentView === AppView.WEALTH_DNA && <WealthDNA onNavigate={setCurrentView} onUpdateUser={updateUser} currentUser={currentUser} />}
            {currentView === AppView.CONTACT && <Contact onNavigate={setCurrentView} />}
            {currentView === AppView.ABOUT && <About onNavigate={setCurrentView} />}
            {currentView === AppView.PRIVACY_POLICY && <PrivacyPolicy onNavigate={setCurrentView} />}
          </div>
        </div>

        {/* Sticky Floating Bottom Navigation Bar */}
        <nav className="bottom-nav">
          {/* 1. Home tab */}
          <button
            onClick={() => setCurrentView(AppView.DASHBOARD)}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
              currentView === AppView.DASHBOARD 
                ? 'text-brand-gold font-bold scale-105' 
                : 'text-text-muted hover:text-text-secondary'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="text-[10px] tracking-wide">หน้าหลัก</span>
          </button>

          {/* 2. Courses tab */}
          <button
            onClick={() => setCurrentView(AppView.SYSTEM_456)}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
              [AppView.SYSTEM_456, AppView.START_UP, AppView.FUNCTIONS, AppView.LIBRARY, AppView.PRODUCT_CATALOG, AppView.UBC_PROGRAM].includes(currentView)
                ? 'text-brand-gold font-bold scale-105' 
                : 'text-text-muted hover:text-text-secondary'
            }`}
          >
            <Layers className="w-5 h-5" />
            <span className="text-[10px] tracking-wide">หลักสูตร</span>
          </button>

          {/* 3. AI Coach tab - Nong Uni (Using Sparkles icon to avoid GPT bot look) */}
          <button
            onClick={() => setCurrentView(AppView.AI_COACH)}
            className={`flex flex-col items-center justify-center -translate-y-4 w-14 h-14 bg-gradient-to-tr from-brand-gold to-brand-gold-muted rounded-full shadow-lg text-white active:scale-95 transition-all ${
              currentView === AppView.AI_COACH 
                ? 'ring-4 ring-brand-gold-light scale-110 shadow-xl' 
                : ''
            }`}
            aria-label="แชทกับน้องยูนิ"
          >
            <Sparkles className="w-6 h-6 animate-pulse" />
          </button>

          {/* 4. Profile tab */}
          <button
            onClick={() => setCurrentView(AppView.PROFILE)}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
              [AppView.PROFILE, AppView.WEALTH_DNA].includes(currentView)
                ? 'text-brand-gold font-bold scale-105' 
                : 'text-text-muted hover:text-text-secondary'
            }`}
          >
            <Trophy className="w-5 h-5" />
            <span className="text-[10px] tracking-wide">โปรไฟล์</span>
          </button>
        </nav>

        {/* Report Issue Modal - Available on all pages inside the frame */}
        {currentUser && currentView !== AppView.LANDING && currentView !== AppView.LOGIN && currentView !== AppView.REGISTER && (
          <ReportIssueModal />
        )}
      </div>
    </div>
  );
};

export default App;
