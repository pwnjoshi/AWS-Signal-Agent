import React from 'react';
import { Play, RefreshCw, Bell, Search, UserCheck, Layout, Sparkles } from 'lucide-react';
import { Logo } from './Logo';
import { UserProfile } from '../types/clientTypes';

interface HeaderProps {
  onRunAgent: () => void;
  isAgentRunning: boolean;
  onSearchChange?: (term: string) => void;
  searchTerm?: string;
  onOpenSettings?: () => void;
  userProfile?: UserProfile | null;
  onOpenAuthModal?: () => void;
  onToggleLanding?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onRunAgent,
  isAgentRunning,
  onSearchChange,
  searchTerm = '',
  onOpenSettings,
  userProfile,
  onOpenAuthModal,
  onToggleLanding,
}) => {
  return (
    <header className="h-16 bg-slate-900/90 backdrop-blur-xl border-b border-slate-800/80 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-md text-slate-100">
      
      {/* Mobile Brand Title using Logo */}
      <div className="md:hidden shrink-0">
        <Logo size="sm" showText={true} />
      </div>

      {/* Search Input */}
      <div className="flex-1 max-w-md mx-2 sm:mx-4 relative">
        <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
          placeholder="Search AWS Pulse AI signals, services..."
          className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-slate-950 transition-all placeholder:text-slate-500 text-slate-200"
        />
      </div>

      {/* Action Controls & Agent Status */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Landing Page Quick Toggle */}
        <button
          onClick={onToggleLanding}
          className="hidden md:flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all border border-slate-700"
          title="Switch to Landing Showcase Page"
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          <span>Showcase</span>
        </button>

        {/* AWS Builder ID Profile Badge */}
        <button
          onClick={onOpenAuthModal}
          className="flex items-center gap-2 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 px-3 py-1.5 rounded-full text-xs font-extrabold text-amber-300 transition-all"
          title="Switch AWS Builder ID Profile"
        >
          <UserCheck className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline font-mono">{userProfile?.builder_id || 'builder_pawan'}</span>
        </button>

        {/* Demo Trigger: "Run Agent Now" */}
        <button
          onClick={onRunAgent}
          disabled={isAgentRunning}
          className="flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-3 sm:px-4 py-2 rounded-xl font-bold text-xs shadow-md shadow-blue-500/20 transition-all active:scale-95 disabled:opacity-50"
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
          className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-xl transition-all relative"
          title="Notification Settings"
        >
          <Bell className="w-5 h-5" />
          <span className="w-2 h-2 rounded-full bg-blue-500 absolute top-2 right-2 border-2 border-slate-900"></span>
        </button>
      </div>
    </header>
  );
};
