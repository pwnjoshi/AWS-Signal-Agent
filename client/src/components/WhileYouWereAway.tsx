import React from 'react';
import { DoriCompanion } from './DoriCompanion';
import { ArrowRight, Sparkles, AlertCircle, MessageSquare, Megaphone, TrendingUp } from 'lucide-react';
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
    <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-blue-500/15 relative overflow-hidden">
      {/* Background Decorative Cloud Circles */}
      <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute top-0 right-1/3 w-32 h-32 bg-blue-400/10 rounded-full blur-xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        {/* Left Info Column */}
        <div className="flex-1 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-blue-100 text-xs font-semibold backdrop-blur-md border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>AUTONOMOUS RECAP</span>
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-rounded">
              While You Were Away
            </h2>
            <p className="text-blue-100/90 text-sm mt-1">
              Dori has been watching AWS feeds and synthesized these new signals for you:
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-3.5 hover:bg-white/15 transition-all">
              <div className="flex items-center gap-2 text-blue-200 text-xs font-medium mb-1">
                <Megaphone className="w-3.5 h-3.5 text-blue-300" />
                Announcements
              </div>
              <p className="text-2xl font-extrabold text-white">
                {String(announcements).padStart(2, '0')}
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-3.5 hover:bg-white/15 transition-all">
              <div className="flex items-center gap-2 text-blue-200 text-xs font-medium mb-1">
                <MessageSquare className="w-3.5 h-3.5 text-indigo-300" />
                Discussions
              </div>
              <p className="text-2xl font-extrabold text-white">
                {String(discussions).padStart(2, '0')}
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-3.5 hover:bg-white/15 transition-all">
              <div className="flex items-center gap-2 text-blue-200 text-xs font-medium mb-1">
                <TrendingUp className="w-3.5 h-3.5 text-amber-300" />
                Emerging Signals
              </div>
              <p className="text-2xl font-extrabold text-white">
                {String(emerging).padStart(2, '0')}
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-3.5 hover:bg-white/15 transition-all">
              <div className="flex items-center gap-2 text-blue-200 text-xs font-medium mb-1">
                <AlertCircle className="w-3.5 h-3.5 text-red-300" />
                High Priority
              </div>
              <p className="text-2xl font-extrabold text-white text-red-300">
                {String(alerts).padStart(2, '0')}
              </p>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={onExplore}
              className="inline-flex items-center gap-2 bg-white text-blue-700 hover:bg-blue-50 px-5 py-2.5 rounded-xl font-bold text-sm shadow-md transition-all active:scale-95"
            >
              <span>Explore Signals</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Companion Illustration */}
        <div className="self-center lg:self-auto shrink-0 flex flex-col items-center">
          <DoriCompanion 
            emotion={alerts > 0 ? 'curious' : 'happy'}
            message="I found something you should probably know about!"
            size="lg"
            showSpeechBubble={true}
          />
        </div>
      </div>
    </div>
  );
};
