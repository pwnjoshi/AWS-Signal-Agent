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
    <aside className="hidden md:flex w-64 bg-surface border-r border-outline flex-col justify-between h-screen sticky top-0 z-20 shrink-0 text-on-background font-sans transition-colors">
      <div>
        {/* Brand Header */}
        <div className="p-5 border-b border-outline">
          <Link to="/">
            <Logo size="md" />
          </Link>
        </div>

        {/* Primary Navigation */}
        <nav className="p-4 space-y-1.5 font-mono">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl font-bold text-xs tracking-wide transition-all duration-200 ${
                  isActive
                    ? 'btn-geu-primary shadow-purple-glow text-white'
                    : 'text-on-surface-variant hover:bg-surface-container hover:text-on-background'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-on-surface-variant'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${
                    isActive ? 'bg-white text-zinc-950' : 'bg-surface-container text-on-surface-variant border border-outline'
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
      <div className="p-4 border-t border-outline space-y-1.5 font-mono">
        <Link
          to="/telemetry"
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-xs transition-all duration-200 ${
            location.pathname === '/telemetry'
              ? 'bg-[#fe6e00]/15 text-[#fe9800] dark:text-[#ffc080] border border-[#fe6e00]/40'
              : 'text-on-surface-variant hover:bg-surface-container hover:text-on-background'
          }`}
        >
          <Activity className="w-4 h-4 text-[#fe6e00] animate-pulse" />
          <span className="flex-1 text-left">Agent Telemetry</span>
          <span className="text-[9px] bg-[#fe6e00]/15 text-[#fe9800] dark:text-[#ffc080] border border-[#fe6e00]/30 px-1.5 py-0.5 rounded-md font-extrabold uppercase tracking-wider">
            HUD
          </span>
        </Link>

        {/* Theme Switcher Button in Sidebar */}
        <button
          onClick={toggleTheme}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-xs transition-all duration-200 text-on-surface-variant hover:bg-surface-container hover:text-on-background cursor-pointer"
        >
          {theme === 'light' ? (
            <>
              <Moon className="w-4 h-4" />
              <span>Dark Theme</span>
            </>
          ) : (
            <>
              <Sun className="w-4 h-4 text-[#ffc080]" />
              <span>Light Theme</span>
            </>
          )}
        </button>

        <button
          onClick={onOpenSettings}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-xs transition-all duration-200 text-on-surface-variant hover:bg-surface-container hover:text-on-background cursor-pointer"
        >
          <Settings className="w-4 h-4 text-on-surface-variant" />
          <span>Config</span>
        </button>

        {/* AWS Builder ID Profile Chip */}
        <div 
          onClick={onOpenAuthModal}
          className="pt-3 border-t border-outline mt-2 flex items-center gap-3 px-2 cursor-pointer hover:bg-surface-container rounded-2xl p-2 transition-colors border border-outline bg-surface-low"
          title="Click to manage AWS Builder ID profile"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-[#fe6e00] flex items-center justify-center font-extrabold text-white text-xs shadow-purple-glow">
            <UserCheck className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-on-background truncate">{userProfile?.display_name || 'Pawan Joshi'}</p>
            <p className="text-[10px] font-mono text-[#fe9800] dark:text-[#ffc080] truncate">{userProfile?.builder_id || 'builder_pawan_2026'}</p>
          </div>
        </div>
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
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur-xl border-t border-outline px-2 py-1.5 flex items-center justify-around shadow-2xl font-mono">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all relative ${
              isActive ? 'text-primary font-bold' : 'text-on-surface-variant font-medium hover:text-on-background'
            }`}
          >
            <div className="relative">
              <Icon className={`w-5 h-5 ${isActive ? 'scale-110 text-primary' : 'text-on-surface-variant'}`} />
            </div>
            <span className="text-[10px] mt-1 tracking-tight">{item.label}</span>
          </Link>
        );
      })}
      
      <button
        onClick={onOpenSettings}
        className="flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all relative text-on-surface-variant font-medium hover:text-on-background"
      >
        <div className="relative">
          <Settings className="w-5 h-5 text-on-surface-variant" />
          {alertCount > 0 && (
            <span className="absolute -top-1 -right-2.5 w-3.5 h-3.5 bg-[#fe6e00] text-white text-[8px] font-extrabold rounded-full flex items-center justify-center">
              {alertCount}
            </span>
          )}
        </div>
        <span className="text-[10px] mt-1 tracking-tight">Config</span>
      </button>
    </nav>
  );
};
