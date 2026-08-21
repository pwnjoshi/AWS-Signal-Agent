import React from 'react';
import { 
  Home, 
  Radio, 
  Flame, 
  Cloud, 
  Mail, 
  BookOpen, 
  Bookmark, 
  Settings, 
  Activity 
} from 'lucide-react';

export type NavTab = 
  | 'home' 
  | 'signals' 
  | 'trending' 
  | 'services' 
  | 'alerts' 
  | 'briefings' 
  | 'saved' 
  | 'settings' 
  | 'demo';

interface SidebarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  savedCount?: number;
  alertCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  savedCount = 0,
  alertCount = 0,
}) => {
  const navItems = [
    { id: 'home' as NavTab, label: 'Home', icon: Home },
    { id: 'signals' as NavTab, label: 'Signals', icon: Radio },
    { id: 'trending' as NavTab, label: 'Trending', icon: Flame },
    { id: 'services' as NavTab, label: 'AWS Services', icon: Cloud },
    { id: 'briefings' as NavTab, label: 'Briefings', icon: BookOpen },
    { id: 'alerts' as NavTab, label: 'Alerts', icon: Mail, badge: alertCount },
    { id: 'saved' as NavTab, label: 'Saved', icon: Bookmark, badge: savedCount },
  ];

  return (
    <aside className="hidden md:flex w-64 bg-white border-r border-slate-200 flex-col justify-between h-screen sticky top-0 z-20 shrink-0">
      <div>
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/20 text-white font-bold text-lg">
            ⚡
          </div>
          <div>
            <h1 className="font-extrabold text-slate-900 tracking-tight text-lg leading-none font-rounded">
              AWS Signal
            </h1>
            <p className="text-xs text-blue-600 font-semibold mt-1 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Autonomous Agent
            </p>
          </div>
        </div>

        {/* Primary Navigation */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl font-medium text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-bold shadow-sm'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                    isActive ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Navigation */}
      <div className="p-4 border-t border-slate-100 space-y-1">
        <button
          onClick={() => setActiveTab('demo')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-medium text-sm transition-all duration-200 ${
            activeTab === 'demo'
              ? 'bg-amber-50 text-amber-800 font-bold'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <Activity className="w-4 h-4 text-amber-500 animate-pulse" />
          <span className="flex-1 text-left">Agent Telemetry</span>
          <span className="text-[10px] bg-amber-200/60 text-amber-900 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
            Demo
          </span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-medium text-sm transition-all duration-200 ${
            activeTab === 'settings'
              ? 'bg-blue-50 text-blue-700 font-bold'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <Settings className="w-4 h-4 text-slate-400" />
          <span>Settings</span>
        </button>

        {/* User Profile */}
        <div className="pt-3 border-t border-slate-100 mt-2 flex items-center gap-3 px-2">
          <div className="w-9 h-9 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center font-bold text-blue-700 text-xs">
            P
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-slate-800 truncate">Pawan</p>
            <p className="text-[11px] text-slate-400 truncate">AWS Developer</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

// Touch-Friendly Mobile Bottom Navigation Component
export const MobileBottomNav: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  alertCount = 0,
}) => {
  const items = [
    { id: 'home' as NavTab, label: 'Home', icon: Home },
    { id: 'signals' as NavTab, label: 'Signals', icon: Radio },
    { id: 'briefings' as NavTab, label: 'Briefing', icon: BookOpen },
    { id: 'services' as NavTab, label: 'Services', icon: Cloud },
    { id: 'settings' as NavTab, label: 'Settings', icon: Settings, badge: alertCount },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 flex items-center justify-around shadow-2xl">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all relative ${
              isActive ? 'text-blue-600 font-bold' : 'text-slate-500 font-medium hover:text-slate-800'
            }`}
          >
            <div className="relative">
              <Icon className={`w-5 h-5 ${isActive ? 'scale-110 text-blue-600' : 'text-slate-400'}`} />
              {item.badge !== undefined && item.badge > 0 && (
                <span className="absolute -top-1 -right-2.5 w-4 h-4 bg-red-500 text-white text-[9px] font-extrabold rounded-full flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </div>
            <span className="text-[10px] mt-1 font-rounded tracking-tight">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
