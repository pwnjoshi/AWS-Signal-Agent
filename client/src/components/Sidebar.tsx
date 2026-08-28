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
  Activity,
  UserCheck,
  Zap,
  ShieldCheck,
  Cpu
} from 'lucide-react';
import { Logo } from './Logo';
import { UserProfile } from '../types/clientTypes';

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
  userProfile?: UserProfile | null;
  onOpenAuthModal?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  savedCount = 0,
  alertCount = 0,
  userProfile,
  onOpenAuthModal,
}) => {
  const navItems = [
    { id: 'home' as NavTab, label: 'Command Hub', icon: Home },
    { id: 'signals' as NavTab, label: 'Radar Signals', icon: Radio },
    { id: 'trending' as NavTab, label: 'Friction Matrix', icon: Flame },
    { id: 'services' as NavTab, label: 'Cloud Mesh', icon: Cloud },
    { id: 'briefings' as NavTab, label: 'Daily Digest', icon: BookOpen },
    { id: 'alerts' as NavTab, label: 'SES Dispatch', icon: Mail, badge: alertCount },
    { id: 'saved' as NavTab, label: 'Vault', icon: Bookmark, badge: savedCount },
  ];

  return (
    <aside className="hidden md:flex w-64 bg-[#09090b] border-r border-zinc-800/80 flex-col justify-between h-screen sticky top-0 z-20 shrink-0 text-zinc-100 font-sans">
      <div>
        {/* Brand Header */}
        <div className="p-5 border-b border-zinc-800/80">
          <Logo size="md" />
        </div>

        {/* Primary Navigation */}
        <nav className="p-4 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl font-semibold text-xs tracking-wide transition-all duration-200 ${
                  isActive
                    ? 'btn-geu-gradient text-white font-bold shadow-lg shadow-[#ad5cff]/20'
                    : 'text-zinc-400 hover:bg-zinc-900/90 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-zinc-500'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${
                    isActive ? 'bg-white text-zinc-950' : 'bg-zinc-800 text-zinc-300 border border-zinc-700'
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
      <div className="p-4 border-t border-zinc-800/80 space-y-1.5">
        <button
          onClick={() => setActiveTab('demo')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold text-xs transition-all duration-200 ${
            activeTab === 'demo'
              ? 'bg-[#fe6e00]/20 text-[#ffc080] border border-[#fe6e00]/40 font-bold'
              : 'text-zinc-400 hover:bg-zinc-900/90 hover:text-white'
          }`}
        >
          <Activity className="w-4 h-4 text-[#fe6e00] animate-pulse" />
          <span className="flex-1 text-left">Agent Telemetry</span>
          <span className="text-[9px] bg-[#fe6e00]/20 text-[#ffc080] border border-[#fe6e00]/30 px-1.5 py-0.5 rounded-md font-extrabold uppercase tracking-wider">
            HUD
          </span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold text-xs transition-all duration-200 ${
            activeTab === 'settings'
              ? 'bg-[#ad5cff]/20 text-[#ad5cff] border border-[#ad5cff]/40 font-bold'
              : 'text-zinc-400 hover:bg-zinc-900/90 hover:text-white'
          }`}
        >
          <Settings className="w-4 h-4 text-zinc-500" />
          <span>Config</span>
        </button>

        {/* AWS Builder ID Profile Chip */}
        <div 
          onClick={onOpenAuthModal}
          className="pt-3 border-t border-zinc-800/80 mt-2 flex items-center gap-3 px-2 cursor-pointer hover:bg-zinc-900/80 rounded-2xl p-2 transition-colors border border-zinc-800"
          title="Click to manage AWS Builder ID profile"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#ad5cff] to-[#fe6e00] flex items-center justify-center font-extrabold text-white text-xs shadow-md shadow-[#ad5cff]/20">
            <UserCheck className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-white truncate">{userProfile?.display_name || 'Pawan Joshi'}</p>
            <p className="text-[10px] font-mono text-[#ffc080] truncate">{userProfile?.builder_id || 'builder_pawan_2026'}</p>
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
    { id: 'home' as NavTab, label: 'Hub', icon: Home },
    { id: 'signals' as NavTab, label: 'Radar', icon: Radio },
    { id: 'briefings' as NavTab, label: 'Digest', icon: BookOpen },
    { id: 'services' as NavTab, label: 'Mesh', icon: Cloud },
    { id: 'settings' as NavTab, label: 'Config', icon: Settings, badge: alertCount },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#09090b]/95 backdrop-blur-xl border-t border-zinc-800 px-2 py-1.5 flex items-center justify-around shadow-2xl">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all relative ${
              isActive ? 'text-[#ad5cff] font-bold' : 'text-zinc-400 font-medium hover:text-zinc-200'
            }`}
          >
            <div className="relative">
              <Icon className={`w-5 h-5 ${isActive ? 'scale-110 text-[#ad5cff]' : 'text-zinc-500'}`} />
              {item.badge !== undefined && item.badge > 0 && (
                <span className="absolute -top-1 -right-2.5 w-4 h-4 bg-[#fe6e00] text-white text-[9px] font-extrabold rounded-full flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </div>
            <span className="text-[10px] mt-1 tracking-tight">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
