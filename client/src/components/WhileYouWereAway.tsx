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
    <div className="bg-surface border border-outline rounded-xl p-5 sm:p-6 text-on-background shadow-sm relative overflow-hidden font-mono transition-colors">
      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        {/* Left Info Column */}
        <div className="flex-1 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-surface-low border border-outline text-primary text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#fe9800]" />
            <span>Autonomous Intelligence Recap</span>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-black font-display tracking-tight text-on-background uppercase">
              While You Were Away
            </h2>
            <p className="text-on-surface-variant text-xs sm:text-sm mt-0.5 font-sans">
              Dori checked AWS release feeds, architectural blogs, and re:Post discussions:
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
            <div className="bg-surface-low border border-outline rounded-lg p-3 hover:border-primary/40 transition-all">
              <div className="flex items-center gap-1.5 text-on-surface-variant text-xs font-medium mb-1">
                <Megaphone className="w-3.5 h-3.5 text-primary" />
                Announcements
              </div>
              <p className="text-xl font-black text-on-background">
                {String(announcements).padStart(2, '0')}
              </p>
            </div>

            <div className="bg-surface-low border border-outline rounded-lg p-3 hover:border-primary/40 transition-all">
              <div className="flex items-center gap-1.5 text-on-surface-variant text-xs font-medium mb-1">
                <MessageSquare className="w-3.5 h-3.5 text-[#fe9800]" />
                Discussions
              </div>
              <p className="text-xl font-black text-on-background">
                {String(discussions).padStart(2, '0')}
              </p>
            </div>

            <div className="bg-surface-low border border-outline rounded-lg p-3 hover:border-primary/40 transition-all">
              <div className="flex items-center gap-1.5 text-on-surface-variant text-xs font-medium mb-1">
                <TrendingUp className="w-3.5 h-3.5 text-[#00d294]" />
                Emerging
              </div>
              <p className="text-xl font-black text-on-background">
                {String(emerging).padStart(2, '0')}
              </p>
            </div>

            <div className="bg-surface-low border border-red-500/30 rounded-lg p-3 hover:border-red-500/60 transition-all">
              <div className="flex items-center gap-1.5 text-red-500 text-xs font-medium mb-1">
                <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                High Priority
              </div>
              <p className="text-xl font-black text-red-500">
                {String(alerts).padStart(2, '0')}
              </p>
            </div>
          </div>

          <div className="pt-1">
            <button
              onClick={onExplore}
              className="inline-flex items-center gap-1.5 bg-primary hover:bg-primary-container text-white px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wide shadow-sm transition-all active:scale-98 cursor-pointer"
            >
              <span>Explore All Signals</span>
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
