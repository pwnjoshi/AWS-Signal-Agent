import React from 'react';
import { Play, RefreshCw, Bell, Search, UserCheck } from 'lucide-react';
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
  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      
      {/* Mobile Brand Title using Logo */}
      <div className="md:hidden shrink-0">
        <Logo size="sm" showText={true} />
      </div>

      {/* Search Input */}
      <div className="flex-1 max-w-md mx-2 sm:mx-4 relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
          placeholder="Search AWS Pulse AI signals, services..."
          className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all placeholder:text-slate-400"
        />
      </div>

      {/* Action Controls & Agent Status */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* AWS Builder ID Profile Badge */}
        <button
          onClick={onOpenAuthModal}
          className="flex items-center gap-2 bg-amber-50 hover:bg-amber-100/80 border border-amber-200 px-3 py-1.5 rounded-full text-xs font-bold text-amber-900 transition-all"
          title="Switch AWS Builder ID Profile"
        >
          <UserCheck className="w-3.5 h-3.5 text-amber-600" />
          <span className="hidden sm:inline">{userProfile?.builder_id || 'builder_pawan'}</span>
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
              <span className="hidden sm:inline">Run Agent</span>
              <span className="sm:hidden">Run</span>
            </>
          )}
        </button>

        {/* Notification / Settings Button */}
        <button 
          onClick={onOpenSettings}
          className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all relative"
          title="Notification Settings"
        >
          <Bell className="w-5 h-5" />
          <span className="w-2 h-2 rounded-full bg-blue-600 absolute top-2 right-2 border-2 border-white"></span>
        </button>
      </div>
    </header>
  );
};
