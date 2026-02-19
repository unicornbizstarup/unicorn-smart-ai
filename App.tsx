
import React, { useState } from 'react';
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
  FolderOpen
} from 'lucide-react';
import { AppView } from './types';
import Dashboard from './pages/Dashboard';
import System456 from './pages/System456';
import StartUp from './pages/StartUp';
import Functions from './pages/Functions';
import AICoach from './pages/AICoach';
import Library from './pages/Library';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: 'แดชบอร์ด', icon: LayoutDashboard, view: AppView.DASHBOARD },
    { name: 'ระบบ 4-5-6', icon: Layers, view: AppView.SYSTEM_456 },
    { name: '5 Start-Up', icon: Rocket, view: AppView.START_UP },
    { name: 'คลังสื่อ/เอกสาร', icon: FolderOpen, view: AppView.LIBRARY },
    { name: 'ฟังก์ชั่นการเรียนรู้', icon: CalendarDays, view: AppView.FUNCTIONS },
    { name: 'โค้ชอัจฉริยะ AI', icon: Bot, view: AppView.AI_COACH },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar for Desktop */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-slate-950 text-white transition-all duration-500 transform 
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:relative lg:translate-x-0 border-r border-white/5 shadow-2xl
      `}>
        <div className="p-8 h-full flex flex-col">
          <div className="flex items-center gap-4 mb-12 group cursor-pointer">
            <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center font-black text-2xl shadow-xl shadow-amber-500/20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">U</div>
            <div>
              <h1 className="text-xl font-black tracking-tighter">UNICORN</h1>
              <p className="text-[10px] text-amber-500 font-bold tracking-[0.3em] uppercase opacity-80">Academy</p>
            </div>
          </div>

          <nav className="space-y-2 flex-1">
            {navigation.map((item) => (
              <button
                key={item.name}
                onClick={() => {
                  setCurrentView(item.view);
                  setSidebarOpen(false);
                }}
                className={`
                  w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group
                  ${currentView === item.view
                    ? 'bg-amber-500 text-slate-950 shadow-xl shadow-amber-500/20 scale-[1.02] font-black'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'}
                `}
              >
                <item.icon size={22} className={`transition-transform duration-500 group-hover:scale-110 ${currentView === item.view ? 'text-slate-950' : 'text-slate-500 group-hover:text-amber-400'}`} />
                <span className="font-semibold tracking-wide">{item.name}</span>
                {currentView === item.view && <ChevronRight size={18} className="ml-auto opacity-50" />}
              </button>
            ))}
          </nav>

          <div className="mt-auto pt-8">
            <div className="bg-white/5 rounded-[2rem] p-5 border border-white/10 hover:border-amber-500/30 transition-colors group cursor-pointer">
              <p className="text-[10px] text-slate-500 mb-3 uppercase tracking-[0.2em] font-black">Business Star</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-400 via-amber-500 to-amber-600 shadow-lg group-hover:scale-110 transition-transform duration-500" />
                <div>
                  <p className="text-sm font-bold tracking-tight">Kru Den Master Fa</p>
                  <div className="flex items-center gap-1">
                    <Trophy size={10} className="text-amber-500" />
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Super Star</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-white/70 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-8 shrink-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <Menu size={24} />
            </button>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              {navigation.find(n => n.view === currentView)?.name}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button className="relative p-3 text-slate-500 hover:bg-slate-100 hover:text-amber-500 rounded-2xl transition-all group">
              <div className="absolute top-3 right-3 w-2.5 h-2.5 bg-amber-500 rounded-full border-2 border-white animate-ping" />
              <div className="absolute top-3 right-3 w-2.5 h-2.5 bg-amber-500 rounded-full border-2 border-white" />
              <CalendarDays size={22} className="group-hover:rotate-12 transition-transform" />
            </button>
            <div className="h-8 w-px bg-slate-200 mx-2 hidden sm:block" />
            <div className="hidden sm:flex items-center gap-3 pl-2">
              <div className="text-right">
                <p className="text-xs font-black text-slate-900 leading-none">Business Partner</p>
                <p className="text-[10px] text-amber-500 font-bold uppercase tracking-tighter">Diamond Executive</p>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-slate-100 border border-slate-200" />
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="max-w-6xl mx-auto h-full">
            {currentView === AppView.DASHBOARD && <Dashboard onNavigate={setCurrentView} />}
            {currentView === AppView.SYSTEM_456 && <System456 />}
            {currentView === AppView.START_UP && <StartUp />}
            {currentView === AppView.FUNCTIONS && <Functions />}
            {currentView === AppView.AI_COACH && <AICoach />}
            {currentView === AppView.LIBRARY && <Library />}
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
