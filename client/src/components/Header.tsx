import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Play, RefreshCw, Bell, Search, UserCheck, Sparkles, Sun, Moon } from 'lucide-react';
import { Logo } from './Logo';
import { UserProfile } from '../types/clientTypes';
import { useTheme } from '../context/ThemeContext';

interface HeaderProps {
  onRunAgent: () => void;
  isAgentRunning: boolean;
  onSearchChange?: (term: string) => void;
  searchTerm?: string;
  onOpenSettings?: () => void;
  userProfile?: UserProfile | null;
  onOpenAuthModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onRunAgent,
  isAgentRunning,
  onSearchChange,
  searchTerm = '',
  onOpenSettings,
  userProfile,
  onOpenAuthModal,
}) => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="h-16 bg-surface/90 backdrop-blur-xl border-b border-outline px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-sm text-on-background font-sans transition-colors">
      
      {/* Mobile Brand Title using Logo */}
      <div className="md:hidden shrink-0">
        <Link to="/">
          <Logo size="sm" showText={true} />
        </Link>
      </div>

      {/* Search Input */}
      <div className="flex-1 max-w-md mx-2 sm:mx-4 relative font-mono">
        <Search className="w-4 h-4 text-on-surface-variant absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            if (onSearchChange) onSearchChange(e.target.value);
            if (e.target.value && window.location.pathname !== '/signals') {
              navigate('/signals');
            }
          }}
          placeholder="Search AWS Signal radar feeds, services..."
          className="w-full bg-surface-low border border-outline rounded-xl pl-10 pr-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary focus:bg-surface transition-all placeholder:text-on-surface-variant text-on-background"
        />
      </div>

      {/* Action Controls & Agent Status */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0 font-mono">
        {/* Showcase Link */}
        <Link
          to="/"
          className="hidden md:flex items-center gap-1.5 bg-surface-low hover:bg-surface-container text-on-surface-variant hover:text-on-background px-3.5 py-1.5 rounded-full text-xs font-bold transition-all border border-outline"
          title="Return to Showcase Landing Page"
        >
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span>Showcase</span>
        </Link>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-xl transition-all border border-outline cursor-pointer"
          title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          aria-label="Toggle Theme"
        >
          {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-[#ffc080]" />}
        </button>

        {/* AWS Builder ID Profile Badge */}
        <button
          onClick={onOpenAuthModal}
          className="flex items-center gap-2 bg-[#fe6e00]/10 hover:bg-[#fe6e00]/20 border border-[#fe6e00]/40 px-3.5 py-1.5 rounded-full text-xs font-bold text-[#fe9800] dark:text-[#ffc080] transition-all"
          title="Switch AWS Builder ID Profile"
        >
          <UserCheck className="w-3.5 h-3.5 text-[#fe6e00]" />
          <span className="hidden sm:inline font-mono">{userProfile?.builder_id || 'builder_pawan_2026'}</span>
        </button>

        {/* Demo Trigger: "Run Agent Now" */}
        <button
          onClick={onRunAgent}
          disabled={isAgentRunning}
          className="flex items-center gap-1.5 sm:gap-2 btn-geu-primary text-white px-3.5 sm:px-4 py-2 rounded-xl font-bold text-xs shadow-purple-glow transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
        >
          {isAgentRunning ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span className="hidden sm:inline">Analyzing...</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-white" />
              <span className="hidden sm:inline">Run Radar</span>
              <span className="sm:hidden">Run</span>
            </>
          )}
        </button>

        {/* Notification / Settings Button */}
        <button 
          onClick={onOpenSettings}
          className="p-2 text-on-surface-variant hover:text-on-background hover:bg-surface-container rounded-xl transition-all relative border border-outline"
          title="Notification Settings"
        >
          <Bell className="w-4 h-4" />
          <span className="w-2 h-2 rounded-full bg-[#fe6e00] absolute top-1.5 right-1.5 border border-surface"></span>
        </button>
      </div>
    </header>
  );
};
export default Header;
