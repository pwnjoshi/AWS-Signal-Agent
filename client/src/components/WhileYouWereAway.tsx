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
    <div className="bg-surface border border-outline rounded-3xl p-6 sm:p-8 text-on-background shadow-sm relative overflow-hidden font-mono transition-colors">
      {/* Background Decorative Ambient Glow */}
      <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-0 right-1/3 w-40 h-40 bg-secondary/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        {/* Left Info Column */}
        <div className="flex-1 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-low border border-outline text-primary text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#fe9800] dark:text-[#ffc080]" />
            <span>Autonomous Intelligence Recap</span>
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-black font-display tracking-tight text-on-background uppercase">
              While You Were Away
            </h2>
            <p className="text-on-surface-variant text-xs sm:text-sm mt-1 font-sans">
              Dori watched official AWS feeds, blogs, and re:Post discussions while you focused on code:
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="bg-surface-low border border-outline rounded-2xl p-3.5 hover:border-primary/40 transition-all">
              <div className="flex items-center gap-1.5 text-on-surface-variant text-xs font-medium mb-1">
                <Megaphone className="w-3.5 h-3.5 text-primary" />
                Announcements
              </div>
              <p className="text-2xl font-black text-on-background">
                {String(announcements).padStart(2, '0')}
              </p>
            </div>

            <div className="bg-surface-low border border-outline rounded-2xl p-3.5 hover:border-primary/40 transition-all">
              <div className="flex items-center gap-1.5 text-on-surface-variant text-xs font-medium mb-1">
                <MessageSquare className="w-3.5 h-3.5 text-[#fe9800] dark:text-[#ffc080]" />
                Discussions
              </div>
              <p className="text-2xl font-black text-on-background">
                {String(discussions).padStart(2, '0')}
              </p>
            </div>

            <div className="bg-surface-low border border-outline rounded-2xl p-3.5 hover:border-primary/40 transition-all">
              <div className="flex items-center gap-1.5 text-on-surface-variant text-xs font-medium mb-1">
                <TrendingUp className="w-3.5 h-3.5 text-[#00d294]" />
                Emerging
              </div>
              <p className="text-2xl font-black text-on-background">
                {String(emerging).padStart(2, '0')}
              </p>
            </div>

            <div className="bg-surface-low border border-red-500/30 rounded-2xl p-3.5 hover:border-red-500/60 transition-all">
              <div className="flex items-center gap-1.5 text-red-500 text-xs font-medium mb-1">
                <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                High Priority
              </div>
              <p className="text-2xl font-black text-red-500">
                {String(alerts).padStart(2, '0')}
              </p>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={onExplore}
              className="inline-flex items-center gap-2 btn-geu-primary text-white px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-purple-glow transition-all active:scale-95 cursor-pointer"
            >
              <span>Explore All Signals</span>
              <ArrowRight className="w-4 h-4" />
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
