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
    <header className="h-16 bg-[#09090b]/95 backdrop-blur-xl border-b border-zinc-800/80 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-md text-zinc-100 font-sans">
      
      {/* Mobile Brand Title using Logo */}
      <div className="md:hidden shrink-0">
        <Logo size="sm" showText={true} />
      </div>

      {/* Search Input */}
      <div className="flex-1 max-w-md mx-2 sm:mx-4 relative">
        <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
          placeholder="Search AWS Pulse AI signals, services..."
          className="w-full bg-[#18181b] border border-zinc-800 rounded-xl pl-10 pr-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#ad5cff] focus:bg-[#18181b] transition-all placeholder:text-zinc-500 text-zinc-200"
        />
      </div>

      {/* Action Controls & Agent Status */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Landing Page Quick Toggle */}
        <button
          onClick={onToggleLanding}
          className="hidden md:flex items-center gap-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all border border-zinc-700"
          title="Switch to Landing Showcase Page"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#ad5cff]" />
          <span>Showcase</span>
        </button>

        {/* AWS Builder ID Profile Badge */}
        <button
          onClick={onOpenAuthModal}
          className="flex items-center gap-2 bg-[#fe6e00]/10 hover:bg-[#fe6e00]/20 border border-[#fe6e00]/40 px-3.5 py-1.5 rounded-full text-xs font-extrabold text-[#ffc080] transition-all"
          title="Switch AWS Builder ID Profile"
        >
          <UserCheck className="w-3.5 h-3.5 text-[#fe6e00]" />
          <span className="hidden sm:inline font-mono">{userProfile?.builder_id || 'builder_pawan_2026'}</span>
        </button>

        {/* Demo Trigger: "Run Agent Now" */}
        <button
          onClick={onRunAgent}
          disabled={isAgentRunning}
          className="flex items-center gap-1.5 sm:gap-2 btn-geu-gradient text-white px-3.5 sm:px-4 py-2 rounded-xl font-extrabold text-xs shadow-md transition-all active:scale-95 disabled:opacity-50"
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
          className="p-2 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded-xl transition-all relative"
          title="Notification Settings"
        >
          <Bell className="w-5 h-5" />
          <span className="w-2 h-2 rounded-full bg-[#fe6e00] absolute top-2 right-2 border-2 border-[#09090b]"></span>
        </button>
      </div>
    </header>
  );
};
