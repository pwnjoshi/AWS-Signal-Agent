import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Radio, 
  Flame, 
  BookOpen, 
  Cloud, 
  Bell, 
  Bookmark, 
  Cpu, 
  Settings, 
  UserCheck, 
  Sun, 
  Moon,
  Sparkles
} from 'lucide-react';
import { Logo } from './Logo';
import { UserProfile } from '../types/clientTypes';
import { useTheme } from '../context/ThemeContext';

interface SidebarProps {
  savedCount?: number;
  alertCount?: number;
  userProfile?: UserProfile | null;
  onOpenAuthModal?: () => void;
  onOpenSettings?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  savedCount = 0,
  alertCount = 0,
  userProfile,
  onOpenAuthModal,
  onOpenSettings,
}) => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const navigationItems = [
    { path: '/dashboard', label: 'Command Hub', icon: Home },
    { path: '/signals', label: 'Radar Signals', icon: Radio },
    { path: '/trending', label: 'Friction Matrix', icon: Flame },
    { path: '/services', label: 'Cloud Mesh', icon: Cloud },
    { path: '/briefings', label: 'Daily Digest', icon: BookOpen },
    { path: '/alerts', label: 'SES Dispatch', icon: Bell, badge: alertCount },
    { path: '/saved', label: 'Vault', icon: Bookmark, badge: savedCount },
    { path: '/telemetry', label: 'Agent Telemetry', icon: Cpu, pill: 'HUD' },
  ];

  return (
    <aside className="hidden md:flex w-64 border-r border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#121216] flex-col justify-between p-4 sticky top-0 h-screen select-none font-sans transition-colors z-40">
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="px-2 py-1 flex items-center justify-between">
          <Link to="/">
            <Logo size="md" showText={true} />
          </Link>
        </div>

        {/* Navigation Stream */}
        <nav className="space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg font-medium text-xs sm:text-sm transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm font-semibold'
                    : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-[#18181b] hover:text-slate-900 dark:hover:text-zinc-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500 dark:text-zinc-400'}`} />
                  <span>{item.label}</span>
                </div>

                {item.badge !== undefined && item.badge > 0 && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                    isActive 
                      ? 'bg-white text-blue-600' 
                      : 'bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400'
                  }`}>
                    {item.badge}
                  </span>
                )}

                {item.pill && (
                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold ${
                    isActive 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400'
                  }`}>
                    {item.pill}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Profile & Config Stack */}
      <div className="space-y-2 pt-4 border-t border-slate-200 dark:border-zinc-800">
        
        {/* Showcase Home Link */}
        <Link
          to="/"
          className="w-full flex items-center justify-between px-3.5 py-2 rounded-lg font-medium text-xs sm:text-sm text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-[#18181b] hover:text-slate-900 dark:hover:text-zinc-100 transition-all"
        >
          <div className="flex items-center gap-3">
            <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Showcase Page</span>
          </div>
        </Link>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="w-full flex items-center justify-between px-3.5 py-2 rounded-lg font-medium text-xs sm:text-sm text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-[#18181b] hover:text-slate-900 dark:hover:text-zinc-100 cursor-pointer transition-all"
        >
          <div className="flex items-center gap-3">
            {theme === 'light' ? (
              <Moon className="w-4 h-4 text-slate-600" />
            ) : (
              <Sun className="w-4 h-4 text-amber-400" />
            )}
            <span>{theme === 'light' ? 'Dark Theme' : 'Light Theme'}</span>
          </div>
        </button>

        <button
          onClick={onOpenSettings}
          className="w-full flex items-center gap-3 px-3.5 py-2 rounded-lg font-medium text-xs sm:text-sm text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-[#18181b] hover:text-slate-900 dark:hover:text-zinc-100 cursor-pointer transition-all"
        >
          <Settings className="w-4 h-4 text-slate-500 dark:text-zinc-400" />
          <span>Alert Preferences</span>
        </button>

        {/* AWS Builder ID Profile Chip */}
        {userProfile?.is_authenticated ? (
          <div 
            onClick={onOpenAuthModal}
            className="pt-2.5 border-t border-slate-200 dark:border-zinc-800 mt-1.5 flex items-center gap-2.5 px-2 cursor-pointer hover:bg-slate-100 dark:hover:bg-[#18181b] rounded-lg p-2 transition-colors border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-[#18181b]"
            title="Manage AWS Builder ID profile"
          >
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
              {userProfile.display_name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-900 dark:text-zinc-100 truncate">{userProfile.display_name}</p>
              <p className="text-[11px] font-mono text-blue-600 dark:text-blue-400 truncate flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00d294]" />
                {userProfile.builder_id}
              </p>
            </div>
          </div>
        ) : (
          <div 
            onClick={onOpenAuthModal}
            className="pt-2.5 border-t border-slate-200 dark:border-zinc-800 mt-1.5 flex items-center gap-2 px-2 cursor-pointer hover:bg-blue-100/50 dark:hover:bg-blue-950/40 rounded-lg p-2 transition-colors border border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400"
            title="Sign in with AWS Builder ID"
          >
            <UserCheck className="w-4 h-4 shrink-0" />
            <span className="text-xs font-medium truncate">Sign in with Builder ID</span>
          </div>
        )}
      </div>
    </aside>
  );
};

// Native Mobile App Style Bottom Navigation Bar (iOS / Android Feel)
export const MobileBottomNav: React.FC<SidebarProps> = ({
  savedCount = 0,
  alertCount = 0,
  onOpenSettings,
}) => {
  const location = useLocation();

  const items = [
    { path: '/dashboard', label: 'Hub', icon: Home },
    { path: '/signals', label: 'Radar', icon: Radio },
    { path: '/trending', label: 'Trends', icon: Flame },
    { path: '/briefings', label: 'Digest', icon: BookOpen },
    { path: '/saved', label: 'Vault', icon: Bookmark, badge: savedCount },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-[#121216]/95 backdrop-blur-xl border-t border-slate-200 dark:border-zinc-800 px-2 pt-2 pb-[max(env(safe-area-inset-bottom),0.75rem)] shadow-lg select-none">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`relative flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all active:scale-90 ${
                isActive 
                  ? 'text-blue-600 dark:text-blue-400 font-semibold' 
                  : 'text-slate-500 dark:text-zinc-400 font-medium'
              }`}
            >
              {/* Active Pill Glow */}
              {isActive && (
                <span className="absolute -top-1 w-5 h-1 bg-blue-600 dark:bg-blue-400 rounded-full animate-in fade-in zoom-in duration-200" />
              )}
              
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1 -right-2 bg-blue-600 text-white text-[8px] font-bold px-1 min-w-[14px] h-[14px] rounded-full flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>

              <span className="text-[10px] mt-1 tracking-tight">{item.label}</span>
            </Link>
          );
        })}
        
        {/* Mobile Settings Button */}
        <button
          onClick={onOpenSettings}
          className="relative flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all active:scale-90 text-slate-500 dark:text-zinc-400 font-medium"
          aria-label="Settings"
        >
          <div className="relative">
            <Settings className="w-5 h-5" />
            {alertCount > 0 && (
              <span className="absolute -top-1 -right-1.5 w-2.5 h-2.5 bg-amber-500 rounded-full border-2 border-white dark:border-[#121216]" />
            )}
          </div>
          <span className="text-[10px] mt-1 tracking-tight">Config</span>
        </button>
      </div>
    </nav>
  );
};
export default Sidebar;
