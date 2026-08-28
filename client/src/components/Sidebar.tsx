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
        <div className="p-4 border-b border-outline">
          <Link to="/">
            <Logo size="md" />
          </Link>
        </div>

        {/* Primary Navigation */}
        <nav className="p-3 space-y-1 font-mono">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg font-bold text-xs tracking-wide transition-all ${
                  isActive
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-on-surface-variant hover:bg-surface-container hover:text-on-background'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-on-surface-variant'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-md font-extrabold ${
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
      <div className="p-3 border-t border-outline space-y-1 font-mono">
        <Link
          to="/telemetry"
          className={`w-full flex items-center gap-2.5 px-3.5 py-2 rounded-lg font-bold text-xs transition-all ${
            location.pathname === '/telemetry'
              ? 'bg-surface-container text-primary border border-outline'
              : 'text-on-surface-variant hover:bg-surface-container hover:text-on-background'
          }`}
        >
          <Activity className="w-4 h-4 text-primary" />
          <span className="flex-1 text-left">Agent Telemetry</span>
          <span className="text-[9px] bg-surface border border-outline px-1.5 py-0.5 rounded text-on-surface-variant font-bold">
            HUD
          </span>
        </Link>

        {/* Theme Switcher Button */}
        <button
          onClick={toggleTheme}
          className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-lg font-bold text-xs text-on-surface-variant hover:bg-surface-container hover:text-on-background cursor-pointer transition-all"
        >
          {theme === 'light' ? (
            <>
              <Moon className="w-4 h-4" />
              <span>Dark Theme</span>
            </>
          ) : (
            <>
              <Sun className="w-4 h-4 text-[#fe9800]" />
              <span>Light Theme</span>
            </>
          )}
        </button>

        <button
          onClick={onOpenSettings}
          className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-lg font-bold text-xs text-on-surface-variant hover:bg-surface-container hover:text-on-background cursor-pointer transition-all"
        >
          <Settings className="w-4 h-4 text-on-surface-variant" />
          <span>Config</span>
        </button>

        {/* AWS Builder ID Profile Chip */}
        <div 
          onClick={onOpenAuthModal}
          className="pt-2.5 border-t border-outline mt-1.5 flex items-center gap-2.5 px-2 cursor-pointer hover:bg-surface-container rounded-lg p-2 transition-colors border border-outline bg-surface-low"
          title="Manage AWS Builder ID profile"
        >
          <div className="w-8 h-8 rounded-md bg-surface border border-outline flex items-center justify-center font-bold text-primary text-xs shrink-0">
            <UserCheck className="w-4 h-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-on-background truncate">{userProfile?.display_name || 'Pawan Joshi'}</p>
            <p className="text-[10px] font-mono text-on-surface-variant truncate">{userProfile?.builder_id || 'builder_pawan_2026'}</p>
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
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur-md border-t border-outline px-2 py-1.5 flex items-center justify-around font-mono">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg transition-all ${
              isActive ? 'text-primary font-bold' : 'text-on-surface-variant font-medium hover:text-on-background'
            }`}
          >
            <Icon className={`w-4 h-4 ${isActive ? 'text-primary' : 'text-on-surface-variant'}`} />
            <span className="text-[10px] mt-0.5">{item.label}</span>
          </Link>
        );
      })}
      
      <button
        onClick={onOpenSettings}
        className="flex flex-col items-center justify-center py-1 px-3 rounded-lg transition-all text-on-surface-variant font-medium hover:text-on-background"
      >
        <div className="relative">
          <Settings className="w-4 h-4 text-on-surface-variant" />
          {alertCount > 0 && (
            <span className="absolute -top-1 -right-2 w-3 h-3 bg-[#fe9800] text-white text-[7px] font-extrabold rounded-full flex items-center justify-center">
              {alertCount}
            </span>
          )}
        </div>
        <span className="text-[10px] mt-0.5">Config</span>
      </button>
    </nav>
  );
};
