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
    <header className="h-16 bg-white dark:bg-[#121216] border-b border-slate-200 dark:border-zinc-800 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 text-slate-900 dark:text-zinc-100 font-sans transition-colors">
      
      {/* Mobile Brand Title */}
      <div className="md:hidden shrink-0">
        <Link to="/">
          <Logo size="sm" showText={true} />
        </Link>
      </div>

      {/* Search Input */}
      <div className="flex-1 max-w-md mx-2 sm:mx-4 relative font-mono">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
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
          className="w-full bg-slate-50 dark:bg-[#18181b] border border-slate-200 dark:border-zinc-800 rounded-lg pl-9 pr-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-400 text-slate-900 dark:text-zinc-100"
        />
      </div>

      {/* Action Controls & Agent Status */}
      <div className="flex items-center gap-2.5 shrink-0 font-mono text-xs">
        {/* Showcase Link */}
        <Link
          to="/"
          className="hidden md:inline-flex items-center gap-1.5 bg-slate-50 dark:bg-[#18181b] hover:bg-slate-100 dark:hover:bg-[#1f1f26] text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-zinc-100 px-3 py-1.5 rounded-lg font-semibold transition-all border border-slate-200 dark:border-zinc-800"
          title="Return to Showcase Landing Page"
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span>Showcase</span>
        </Link>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="p-2 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100 hover:bg-slate-100 dark:hover:bg-[#1f1f26] rounded-lg transition-all border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] cursor-pointer flex items-center justify-center"
          title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          aria-label="Toggle Theme"
        >
          {theme === 'light' ? <Moon className="w-4 h-4 text-slate-700" /> : <Sun className="w-4 h-4 text-amber-400" />}
        </button>

        {/* AWS Builder ID Profile Badge */}
        <button
          onClick={onOpenAuthModal}
          className="flex items-center gap-1.5 bg-slate-50 dark:bg-[#18181b] hover:bg-slate-100 dark:hover:bg-[#1f1f26] border border-slate-200 dark:border-zinc-800 px-3 py-1.5 rounded-lg font-bold text-slate-800 dark:text-zinc-200 transition-all cursor-pointer"
          title="Switch AWS Builder ID Profile"
        >
          <UserCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span className="hidden sm:inline font-mono text-[11px]">{userProfile?.builder_id || 'builder_pawan_2026'}</span>
        </button>

        {/* Run Radar Agent Trigger */}
        <button
          onClick={onRunAgent}
          disabled={isAgentRunning}
          className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-1.5 rounded-lg font-bold text-xs shadow-sm transition-all active:scale-98 disabled:opacity-50 cursor-pointer"
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
          className="p-2 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100 hover:bg-slate-100 dark:hover:bg-[#1f1f26] rounded-lg transition-all relative border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] cursor-pointer"
          title="Notification Settings"
        >
          <Bell className="w-4 h-4" />
          <span className="w-2 h-2 rounded-full bg-amber-500 absolute top-1.5 right-1.5"></span>
        </button>
      </div>
    </header>
  );
};
export default Header;
