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
  BookOpen,
  Trophy,
  CheckCircle2,
  FolderOpen,
  LogOut,
  GraduationCap,
  Dna,
  Info,
  PhoneCall,
  HelpCircle
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

  const navigation: { name: TranslationKey; icon: any; view: AppView }[] = [
    { name: 'nav.home', icon: LayoutDashboard, view: AppView.DASHBOARD },
    { name: 'nav.ubc_program', icon: Trophy, view: AppView.UBC_PROGRAM },
    { name: 'nav.system456', icon: Layers, view: AppView.SYSTEM_456 },
    { name: 'nav.functions', icon: GraduationCap, view: AppView.FUNCTIONS },
    { name: 'nav.calendar', icon: Rocket, view: AppView.START_UP },
    { name: 'nav.ai_coach', icon: Bot, view: AppView.AI_COACH },
    { name: 'nav.library', icon: FolderOpen, view: AppView.LIBRARY },
    { name: 'nav.wealth_dna', icon: Dna, view: AppView.WEALTH_DNA },
    { name: 'nav.products', icon: BookOpen, view: AppView.PRODUCT_CATALOG },
    { name: 'nav.about', icon: Info, view: AppView.ABOUT },
    { name: 'nav.contact', icon: PhoneCall, view: AppView.CONTACT },
  ];

  const [currentView, setCurrentView] = useState<AppView>(AppView.LANDING);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [referralId, setReferralId] = useState<string | null>(null);
  const [referrer, setReferrer] = useState<User | null>(null);

  // Check for existing session and referral parameters on mount
  useEffect(() => {
    // 1. Check for referral code in URL
    const checkReferral = async () => {
      const params = new URLSearchParams(window.location.search);
      const ref = params.get('ref');
      const pathRef = window.location.pathname.split('/')[1];

      if (ref) {
        localStorage.setItem('unicorn_referral_id', ref);
        setReferralId(ref);
        console.log('Referral tracked (param):', ref);
      } else if (pathRef && pathRef.length > 2 && !['login', 'register', 'privacy', 'about', 'contact', 'dashboard'].includes(pathRef.toLowerCase())) {
        // Check if path is a username
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('username', pathRef.toLowerCase())
          .single();

        if (data && !error) {
          console.log('Referral tracked (path):', data.username);
          setReferrer(data);
          setReferralId(data.username);
          localStorage.setItem('unicorn_referral_id', data.username);
          setCurrentView(AppView.REFERRAL_PAGE);
        } else {
          const storedRef = localStorage.getItem('unicorn_referral_id');
          if (storedRef) setReferralId(storedRef);
        }
      } else {
        const storedRef = localStorage.getItem('unicorn_referral_id');
        if (storedRef) setReferralId(storedRef);
      }
    };
    checkReferral();

    // 2. Initial Session Check
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await fetchAndSetUser(session.user);
        setCurrentView(AppView.DASHBOARD);
      }
    };

    checkSession();

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
      if (event === 'SIGNED_IN' && session?.user) {
        await fetchAndSetUser(session.user);
        setCurrentView(AppView.DASHBOARD);
      } else if (event === 'SIGNED_OUT') {
        setCurrentUser(null);
        setCurrentView(AppView.LANDING);
        localStorage.removeItem('unicorn_current_user');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchAndSetUser = async (user: any) => {
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    const userData: User = {
      id: user.id,
      fullName: profileData?.full_name || user.user_metadata?.full_name || 'User',
      username: profileData?.username || user.user_metadata?.username || user.email?.split('@')[0],
      email: user.email!,
      avatarUrl: profileData?.avatar_url,
      createdAt: user.created_at,
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

    setCurrentUser(userData);
    localStorage.setItem('unicorn_current_user', JSON.stringify(userData));
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
    await supabase.auth.signOut();
    setCurrentUser(null);
    setCurrentView(AppView.LANDING);
    setSidebarOpen(false);
    localStorage.removeItem('unicorn_current_user');
  };

  const updateUser = async (updatedUser: User) => {
    setCurrentUser(updatedUser);
    localStorage.setItem('unicorn_current_user', JSON.stringify(updatedUser));

    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: updatedUser.fullName,
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
        social_links: updatedUser.socialLinks
      })
      .eq('id', updatedUser.id);

    if (error) console.error('Error updating profile:', error);
  };

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

  // ===== MAIN APP (logged in) =====
  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar for Desktop */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-slate-950 text-white transition-all duration-500 transform 
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:relative lg:translate-x-0 border-r border-white/5 shadow-2xl
      `}>
        <div className="p-6 lg:p-8 h-full flex flex-col">
          <button
            className="flex items-center gap-4 mb-12 group cursor-pointer text-left focus:outline-none"
            onClick={() => setCurrentView(AppView.DASHBOARD)}
            aria-label="ไปที่หน้าแดชบอร์ดหลัก"
          >
            <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center font-black text-2xl shadow-xl shadow-amber-500/20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">U</div>
            <div>
              <h1 className="text-xl font-black tracking-tighter text-white">UNICORN</h1>
              <p className="text-xs-plus text-amber-500 font-bold tracking-[0.3em] uppercase opacity-80">Academy</p>
            </div>
          </button>

          <nav className="space-y-2 flex-1 overflow-y-auto scrollbar-hide pr-2">
            {navigation.map((item) => (
              <button
                key={item.name}
                onClick={() => {
                  setCurrentView(item.view);
                  setSidebarOpen(false);
                }}
                aria-label={`ไปที่หน้า ${item.name}`}
                className={`
                  w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group
                  ${currentView === item.view
                    ? 'bg-amber-500 text-slate-950 shadow-xl shadow-amber-500/20 scale-[1.02] font-black'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'}
                `}
              >
                <item.icon size={22} className={`transition-transform duration-500 group-hover:scale-110 ${currentView === item.view ? 'text-slate-950' : 'text-slate-500 group-hover:text-amber-400'}`} />
                <span className="font-semibold tracking-wide">{t(item.name)}</span>
                {currentView === item.view && <ChevronRight size={18} className="ml-auto opacity-50" />}
              </button>
            ))}
          </nav>

          <div className="mt-auto pt-8 space-y-3">
            <button
              onClick={() => {
                setCurrentView(AppView.PROFILE);
                setSidebarOpen(false);
              }}
              aria-label="ดูข้อมูลส่วนตัวทางธุรกิจ"
              className={`
                w-full text-left bg-white/5 rounded-[2rem] p-5 border transition-all group focus:outline-none focus:ring-2 focus:ring-amber-500/50
                ${currentView === AppView.PROFILE ? 'border-amber-500/50 bg-amber-500/10' : 'border-white/10 hover:border-amber-500/30'}
              `}
            >
              <p className="text-xs-plus text-slate-500 mb-3 uppercase tracking-[0.2em] font-black">Business Star</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-400 via-amber-500 to-amber-600 shadow-lg group-hover:scale-110 transition-transform duration-500" />
                <div>
                  <p className="text-sm font-bold tracking-tight text-white">{currentUser.fullName}</p>
                  <div className="flex items-center gap-1">
                    <Trophy size={10} className="text-amber-500" />
                    <p className="text-xs-plus text-slate-400 font-bold uppercase">Super Star</p>
                  </div>
                </div>
              </div>
            </button>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              aria-label="ออกจากระบบ"
              className="w-full flex items-center gap-3 px-5 py-3 text-slate-500 hover:text-red-400 hover:bg-red-500/5 rounded-2xl transition-all group"
            >
              <LogOut size={18} className="group-hover:scale-110 transition-transform" />
              <span className="text-sm font-bold">ออกจากระบบ</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-16 lg:h-20 bg-white/70 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 shrink-0 z-30">
          <div className="flex items-center gap-3 lg:gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              aria-label="เปิดเมนูข้าง"
              className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <Menu size={24} />
            </button>
            <h2 className="text-lg lg:text-xl font-black text-slate-900 tracking-tight">
              {currentView === AppView.PROFILE ? 'ข้อมูลส่วนตัว' : (navigation.find(n => n.view === currentView) ? t(navigation.find(n => n.view === currentView)!.name) : '')}
            </h2>
          </div>

          <div className="flex items-center gap-2 lg:gap-3">
            <button
              aria-label="แจ้งเตือน"
              className="relative p-2 lg:p-3 text-slate-500 hover:bg-slate-100 hover:text-amber-500 rounded-2xl transition-all group"
            >
              <div className="absolute top-2.5 right-2.5 lg:top-3 lg:right-3 w-2 h-2 lg:w-2.5 lg:h-2.5 bg-amber-500 rounded-full border-2 border-white animate-ping" />
              <div className="absolute top-2.5 right-2.5 lg:top-3 lg:right-3 w-2 h-2 lg:w-2.5 lg:h-2.5 bg-amber-500 rounded-full border-2 border-white" />
              <CalendarDays size={20} className="lg:w-[22px] lg:h-[22px] group-hover:rotate-12 transition-transform" />
            </button>
            <LanguageSelector />
            <div className="h-8 w-px bg-slate-200 mx-1 hidden sm:block" />
            <div
              className="hidden sm:flex items-center gap-3 pl-2 cursor-pointer group"
              onClick={() => setCurrentView(AppView.PROFILE)}
            >
              <div className="text-right">
                <p className="text-xs font-black text-slate-900 leading-none group-hover:text-amber-600 transition-colors">
                  {currentUser?.fullName || 'Guest User'}
                </p>
                <p className="text-[10px] text-amber-500 font-bold uppercase tracking-tighter whitespace-nowrap">
                  {currentUser?.isAdmin ? 'ADMIN' : (currentUser?.ubcLevel ? `UBC ${currentUser.ubcLevel}` : 'Partner')}
                </p>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden group-hover:ring-2 group-hover:ring-amber-500/50 transition-all">
                <img src={currentUser?.avatarUrl || "https://api.dicebear.com/7.x/avataaars/svg?seed=UnicornPartner"} alt="Avatar" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className={`flex-1 overflow-y-auto ${currentView === AppView.AI_COACH ? 'p-0' : 'p-2 lg:p-4'} h-full bg-slate-50`}>
          <div className="w-full h-full">
            {currentView === AppView.DASHBOARD && <Dashboard onNavigate={setCurrentView} currentUser={currentUser} />}
            {currentView === AppView.SYSTEM_456 && <System456 onNavigate={setCurrentView} />}
            {currentView === AppView.START_UP && <StartUp onNavigate={setCurrentView} />}
            {currentView === AppView.FUNCTIONS && <Functions onNavigate={setCurrentView} currentUser={currentUser} />}
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
      </main>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default App;
