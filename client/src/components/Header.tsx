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
    <header className="h-16 bg-surface/95 backdrop-blur-md border-b border-outline px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 text-on-background font-sans transition-colors">
      
      {/* Mobile Brand Title using Logo */}
      <div className="md:hidden shrink-0">
        <Link to="/">
          <Logo size="sm" showText={true} />
        </Link>
      </div>

      {/* Search Input - Clean Rectangular Rounded */}
      <div className="flex-1 max-w-md mx-2 sm:mx-4 relative font-mono">
        <Search className="w-4 h-4 text-on-surface-variant absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            if (onSearchChange) onSearchChange(e.target.value);
            if (e.target.value && window.location.pathname !== '/signals') {
              navigate('/signals');
            }
          }}
          placeholder="Search signals, AWS services..."
          className="w-full bg-surface-low border border-outline rounded-lg pl-9 pr-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary transition-all placeholder:text-on-surface-variant text-on-background"
        />
      </div>

      {/* Action Controls & Agent Status */}
      <div className="flex items-center gap-2.5 shrink-0 font-mono text-xs">
        {/* Showcase Link */}
        <Link
          to="/"
          className="hidden md:inline-flex items-center gap-1.5 bg-surface-low hover:bg-surface-container text-on-surface-variant hover:text-on-background px-3 py-1.5 rounded-lg font-semibold transition-all border border-outline"
          title="Return to Showcase Landing Page"
        >
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span>Showcase</span>
        </Link>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="p-2 text-on-surface-variant hover:text-on-background hover:bg-surface-container rounded-lg transition-all border border-outline cursor-pointer"
          title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          aria-label="Toggle Theme"
        >
          {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-[#fe9800]" />}
        </button>

        {/* AWS Builder ID Profile Badge */}
        <button
          onClick={onOpenAuthModal}
          className="flex items-center gap-1.5 bg-surface-low hover:bg-surface-container border border-outline px-3 py-1.5 rounded-lg font-bold text-on-background transition-all cursor-pointer"
          title="Switch AWS Builder ID Profile"
        >
          <UserCheck className="w-3.5 h-3.5 text-primary" />
          <span className="hidden sm:inline font-mono text-[11px]">{userProfile?.builder_id || 'builder_pawan_2026'}</span>
        </button>

        {/* Run Radar Agent Trigger */}
        <button
          onClick={onRunAgent}
          disabled={isAgentRunning}
          className="flex items-center gap-1.5 bg-primary hover:bg-primary-container text-white px-3.5 py-1.5 rounded-lg font-bold text-xs shadow-sm transition-all active:scale-98 disabled:opacity-50 cursor-pointer"
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
          className="p-2 text-on-surface-variant hover:text-on-background hover:bg-surface-container rounded-lg transition-all relative border border-outline cursor-pointer"
          title="Notification Settings"
        >
          <Bell className="w-4 h-4" />
          <span className="w-2 h-2 rounded-full bg-[#fe9800] absolute top-1.5 right-1.5"></span>
        </button>
      </div>
    </header>
  );
};
export default Header;
