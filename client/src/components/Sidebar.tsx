import React from 'react';
import { Link, useLocation } from 'react-router-dom';
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
  Sun,
  Moon
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

  const navItems = [
    { path: '/dashboard', label: 'Command Hub', icon: Home },
    { path: '/signals', label: 'Radar Signals', icon: Radio },
    { path: '/trending', label: 'Friction Matrix', icon: Flame },
    { path: '/services', label: 'Cloud Mesh', icon: Cloud },
    { path: '/briefings', label: 'Daily Digest', icon: BookOpen },
    { path: '/alerts', label: 'SES Dispatch', icon: Mail, badge: alertCount },
    { path: '/saved', label: 'Vault', icon: Bookmark, badge: savedCount },
  ];

  return (
    <aside className="hidden md:flex w-64 bg-white dark:bg-[#121216] border-r border-slate-200 dark:border-zinc-800 flex-col justify-between h-screen sticky top-0 z-20 shrink-0 text-slate-900 dark:text-zinc-100 font-sans transition-colors">
      <div>
        {/* Brand Header */}
        <div className="p-4 border-b border-slate-200 dark:border-zinc-800">
          <Link to="/">
            <Logo size="md" />
          </Link>
        </div>

        {/* Primary Navigation */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg font-medium text-xs sm:text-sm tracking-normal transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-[#18181b] hover:text-slate-900 dark:hover:text-zinc-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500 dark:text-zinc-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className={`text-[11px] px-2 py-0.5 rounded-md font-medium font-mono ${
                    isActive ? 'bg-white text-blue-600' : 'bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Navigation */}
      <div className="p-3 border-t border-slate-200 dark:border-zinc-800 space-y-1">
        <Link
          to="/telemetry"
          className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-lg font-medium text-xs sm:text-sm transition-all ${
            location.pathname === '/telemetry'
              ? 'bg-slate-100 dark:bg-[#1f1f26] text-blue-600 dark:text-blue-400 border border-slate-200 dark:border-zinc-700'
              : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-[#18181b] hover:text-slate-900 dark:hover:text-zinc-100'
          }`}
        >
          <Activity className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span className="flex-1 text-left">Agent Telemetry</span>
          <span className="text-[10px] font-mono bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 px-1.5 py-0.5 rounded text-slate-600 dark:text-zinc-400 font-medium">
            HUD
          </span>
        </Link>

        {/* Theme Switcher Button */}
        <button
          onClick={toggleTheme}
          className="w-full flex items-center gap-3 px-3.5 py-2 rounded-lg font-medium text-xs sm:text-sm text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-[#18181b] hover:text-slate-900 dark:hover:text-zinc-100 cursor-pointer transition-all"
        >
          {theme === 'light' ? (
            <>
              <Moon className="w-4 h-4 text-slate-600" />
              <span>Dark Theme</span>
            </>
          ) : (
            <>
              <Sun className="w-4 h-4 text-amber-400" />
              <span>Light Theme</span>
            </>
          )}
        </button>

        <button
          onClick={onOpenSettings}
          className="w-full flex items-center gap-3 px-3.5 py-2 rounded-lg font-medium text-xs sm:text-sm text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-[#18181b] hover:text-slate-900 dark:hover:text-zinc-100 cursor-pointer transition-all"
        >
          <Settings className="w-4 h-4 text-slate-500 dark:text-zinc-400" />
          <span>Config</span>
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

// Touch-Friendly Mobile Bottom Navigation Component
export const MobileBottomNav: React.FC<SidebarProps> = ({
  alertCount = 0,
  onOpenSettings,
}) => {
  const location = useLocation();

  const items = [
    { path: '/dashboard', label: 'Hub', icon: Home },
    { path: '/signals', label: 'Radar', icon: Radio },
    { path: '/briefings', label: 'Digest', icon: BookOpen },
    { path: '/services', label: 'Mesh', icon: Cloud },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#121216]/95 backdrop-blur-md border-t border-slate-200 dark:border-zinc-800 px-2 py-1.5 flex items-center justify-around">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg transition-all ${
              isActive ? 'text-blue-600 dark:text-blue-400 font-semibold' : 'text-slate-600 dark:text-zinc-400 font-medium hover:text-slate-900 dark:hover:text-zinc-100'
            }`}
          >
            <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-zinc-400'}`} />
            <span className="text-[10px] mt-0.5">{item.label}</span>
          </Link>
        );
      })}
      
      <button
        onClick={onOpenSettings}
        className="flex flex-col items-center justify-center py-1 px-3 rounded-lg transition-all text-slate-600 dark:text-zinc-400 font-medium hover:text-slate-900 dark:hover:text-zinc-100"
      >
        <div className="relative">
          <Settings className="w-4 h-4 text-slate-500 dark:text-zinc-400" />
          {alertCount > 0 && (
            <span className="absolute -top-1 -right-2 w-3 h-3 bg-amber-500 text-white text-[7px] font-bold rounded-full flex items-center justify-center">
              {alertCount}
            </span>
          )}
        </div>
        <span className="text-[10px] mt-0.5">Config</span>
      </button>
    </nav>
  );
};
export default Sidebar;
