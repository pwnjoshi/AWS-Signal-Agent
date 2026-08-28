import React from 'react';
import { DoriCompanion } from './DoriCompanion';
import { ArrowRight, AlertCircle, MessageSquare, Megaphone, TrendingUp } from 'lucide-react';
import { WhileYouWereAwaySummary } from '../types/clientTypes';

interface WhileYouWereAwayProps {
  summary: WhileYouWereAwaySummary | null;
  onExplore: () => void;
}

export const WhileYouWereAway: React.FC<WhileYouWereAwayProps> = ({ summary, onExplore }) => {
  const announcements = summary?.new_announcements ?? 3;
  const discussions = summary?.community_discussions ?? 7;
  const emerging = summary?.emerging_signals ?? 2;
  const alerts = summary?.high_priority_alerts ?? 1;

  return (
    <div className="bg-white dark:bg-[#121216] border border-slate-200 dark:border-zinc-800 rounded-xl p-5 sm:p-6 text-slate-900 dark:text-zinc-100 shadow-sm relative overflow-hidden font-sans transition-colors">
      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        {/* Left Info Column */}
        <div className="flex-1 space-y-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-zinc-100">
              While You Were Away
            </h2>
            <p className="text-slate-500 dark:text-zinc-400 text-xs sm:text-sm mt-0.5 font-normal">
              Dori checked AWS release feeds, architectural blogs, and re:Post discussions:
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1 font-mono">
            <div className="bg-slate-50 dark:bg-[#18181b] border border-slate-200 dark:border-zinc-800 rounded-lg p-3 hover:border-blue-400 transition-all">
              <div className="flex items-center gap-1.5 text-slate-500 dark:text-zinc-400 text-xs font-medium mb-1 font-sans">
                <Megaphone className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                Announcements
              </div>
              <p className="text-xl font-bold text-slate-900 dark:text-zinc-100">
                {String(announcements).padStart(2, '0')}
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-[#18181b] border border-slate-200 dark:border-zinc-800 rounded-lg p-3 hover:border-blue-400 transition-all">
              <div className="flex items-center gap-1.5 text-slate-500 dark:text-zinc-400 text-xs font-medium mb-1 font-sans">
                <MessageSquare className="w-3.5 h-3.5 text-amber-500" />
                Discussions
              </div>
              <p className="text-xl font-bold text-slate-900 dark:text-zinc-100">
                {String(discussions).padStart(2, '0')}
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-[#18181b] border border-slate-200 dark:border-zinc-800 rounded-lg p-3 hover:border-blue-400 transition-all">
              <div className="flex items-center gap-1.5 text-slate-500 dark:text-zinc-400 text-xs font-medium mb-1 font-sans">
                <TrendingUp className="w-3.5 h-3.5 text-[#00d294]" />
                Emerging
              </div>
              <p className="text-xl font-bold text-slate-900 dark:text-zinc-100">
                {String(emerging).padStart(2, '0')}
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-[#18181b] border border-red-500/30 rounded-lg p-3 hover:border-red-500/60 transition-all">
              <div className="flex items-center gap-1.5 text-red-500 text-xs font-medium mb-1 font-sans">
                <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                High Priority
              </div>
              <p className="text-xl font-bold text-red-500">
                {String(alerts).padStart(2, '0')}
              </p>
            </div>
          </div>

          <div className="pt-1">
            <button
              onClick={onExplore}
              className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-xs shadow-sm transition-all active:scale-98 cursor-pointer"
            >
              <span>Explore all signals</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Companion Illustration */}
        <div className="self-center lg:self-auto shrink-0 flex flex-col items-center">
          <DoriCompanion 
            emotion={alerts > 0 ? 'curious' : 'happy'}
            message="I've synthesized all new AWS signals since your last session!"
            size="lg"
            showSpeechBubble={true}
          />
        </div>
      </div>
    </div>
  );
};
export default WhileYouWereAway;
