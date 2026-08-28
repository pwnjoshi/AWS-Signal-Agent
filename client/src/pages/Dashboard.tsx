import React, { useState } from 'react';
import { 
  AWSSignal, 
  CommunityTopic, 
  DailyBriefing, 
  WhileYouWereAwaySummary 
} from '../types/clientTypes';
import { WhileYouWereAway } from '../components/WhileYouWereAway';
import { SignalCard } from '../components/SignalCard';
import { TrendCard } from '../components/TrendCard';
import { DoriCompanion } from '../components/DoriCompanion';
import { ArrowRight, ShieldCheck, Volume2, VolumeX, Sparkles, Radio } from 'lucide-react';

import { playDoriSpeech, stopDoriSpeech } from '../services/apiClient';

interface DashboardProps {
  summary: WhileYouWereAwaySummary | null;
  signals: AWSSignal[];
  briefing: DailyBriefing | null;
  trends: CommunityTopic[];
  onOpenSignalDetail: (sig: AWSSignal) => void;
  onToggleSave: (id: string) => void;
  onExploreSignals: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  summary,
  signals,
  briefing,
  trends,
  onOpenSignalDetail,
  onToggleSave,
  onExploreSignals,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const topSignal = briefing?.top_signal || signals[0];
  const recentSignals = signals.slice(0, 4);
  const featuredTrend = trends[0];

  const handleAudioNarration = async () => {
    if (isPlayingAudio) {
      stopDoriSpeech();
      setIsPlayingAudio(false);
      return;
    }

    const narrationScript = `Good day builder! This is Dori, your cloud specialist. Here is your live summary: ${summary?.new_announcements || 3} new official announcements, ${summary?.community_discussions || 7} developer friction topics detected, and ${summary?.high_priority_alerts || 1} high priority items requiring attention. Today's top highlighted signal is ${topSignal?.title || 'Amazon Bedrock updates'}. Stay curious and happy building!`;

    setIsPlayingAudio(true);
    await playDoriSpeech(narrationScript, () => {
      setIsPlayingAudio(false);
    });
  };

  return (
    <div className="space-y-6 pb-12 font-sans text-slate-900 dark:text-zinc-100">
      
      {/* Top Banner & Stats Overview */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white dark:bg-[#121216] border border-slate-200 dark:border-zinc-800 rounded-xl p-5 sm:p-6 shadow-sm transition-colors">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-zinc-100 tracking-tight">
            AWS Signal Command Center
          </h1>
          <p className="text-slate-500 dark:text-zinc-400 text-xs sm:text-sm mt-1 font-normal">
            Real-time cloud telemetry, SHA-256 content deduplication, and Amazon Bedrock multi-metric ranking.
          </p>
        </div>

        {/* Action Controls in Dashboard Header */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handleAudioNarration}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium transition-all border cursor-pointer ${
              isPlayingAudio
                ? 'bg-amber-500 text-white border-amber-400'
                : 'bg-slate-50 dark:bg-[#18181b] border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-zinc-100'
            }`}
          >
            {isPlayingAudio ? (
              <>
                <VolumeX className="w-3.5 h-3.5" />
                <span>Stop briefing</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>Listen to Dori</span>
              </>
            )}
          </button>

          <div className="flex items-center gap-2.5 bg-slate-50 dark:bg-[#18181b] border border-slate-200 dark:border-zinc-800 px-3.5 py-2 rounded-lg shrink-0">
            <ShieldCheck className="w-4 h-4 text-[#00d294] shrink-0" />
            <div>
              <span className="text-xs font-semibold text-slate-800 dark:text-zinc-200 block">Deduplication Vault</span>
              <span className="text-[11px] text-slate-500 dark:text-zinc-400 font-mono">0 duplicate repeats</span>
            </div>
          </div>
        </div>
      </div>

      {/* Signature Feature: "While You Were Away" */}
      <WhileYouWereAway summary={summary} onExplore={onExploreSignals} />

      {/* Dori Proactive Assistant Card */}
      <div className="bg-white dark:bg-[#121216] border border-slate-200 dark:border-zinc-800 rounded-xl p-5 sm:p-6 shadow-sm transition-colors">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="shrink-0">
              <DoriCompanion 
                size="md" 
                emotion={summary?.high_priority_alerts ? 'curious' : 'happy'} 
                showSpeechBubble={false}
              />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-semibold text-slate-900 dark:text-zinc-100">
                  Dori AI Cloud Specialist
                </span>
                <span className="text-[10px] text-[#00d294] bg-[#00d294]/10 border border-[#00d294]/30 px-2 py-0.2 rounded-full font-medium">
                  Active Assistant
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-zinc-400 font-normal leading-relaxed max-w-xl">
                I'm actively monitoring 6 RSS channels, Reddit dev forums, and AWS re:Post. Let me know if you want an audio digest or architecture deep-dive.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleAudioNarration}
              className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 rounded-lg text-xs font-medium shadow-sm transition-all cursor-pointer"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>{isPlayingAudio ? 'Stop audio' : 'Play voice briefing'}</span>
            </button>
            <button
              onClick={onExploreSignals}
              className="inline-flex items-center gap-1.5 bg-slate-50 dark:bg-[#18181b] hover:bg-slate-100 dark:hover:bg-[#202026] text-slate-700 dark:text-zinc-300 px-3.5 py-2 rounded-lg text-xs font-medium border border-slate-200 dark:border-zinc-800 transition-all cursor-pointer"
            >
              <Radio className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Explore signals</span>
            </button>
          </div>
        </div>
      </div>

      {/* Today's Highlighted AWS Signal */}
      {topSignal && (
        <div className="bg-white dark:bg-[#121216] border border-slate-200 dark:border-zinc-800 rounded-xl p-5 sm:p-6 shadow-sm transition-colors">
          <div className="flex items-center justify-between gap-2 mb-3 pb-3 border-b border-slate-200 dark:border-zinc-800">
            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
              Top Signal of the Day
            </span>
            <span className="text-xs text-slate-500 dark:text-zinc-400 font-mono">
              Discovered {new Date(topSignal.discovered_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            <div className="lg:col-span-2 space-y-3">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                  {topSignal.category}
                </span>
                {topSignal.aws_services.map(s => (
                  <span key={s} className="text-[11px] font-normal px-2 py-0.5 rounded-md bg-slate-50 dark:bg-[#18181b] text-slate-600 dark:text-zinc-400 border border-slate-200 dark:border-zinc-800">
                    {s}
                  </span>
                ))}
              </div>

              <h2 
                onClick={() => onOpenSignalDetail(topSignal)}
                className="text-base sm:text-lg font-semibold text-slate-900 dark:text-zinc-100 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors leading-snug"
              >
                {topSignal.title}
              </h2>

              <p className="text-slate-600 dark:text-zinc-400 text-xs sm:text-sm leading-relaxed font-normal">
                {topSignal.summary}
              </p>

              <div className="pt-1">
                <button
                  onClick={() => onOpenSignalDetail(topSignal)}
                  className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-xs shadow-sm transition-all active:scale-98 cursor-pointer"
                >
                  <span>Read Bedrock rationale</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Score Breakdown Box */}
            <div className="bg-slate-50 dark:bg-[#18181b] border border-slate-200 dark:border-zinc-800 rounded-lg p-4 space-y-2.5 font-mono">
              <div className="text-center pb-2.5 border-b border-slate-200 dark:border-zinc-800">
                <span className="text-[10px] text-slate-500 dark:text-zinc-400 font-semibold uppercase tracking-wider block">Bedrock Score</span>
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{topSignal.signal_score}</span>
                <span className="text-[10px] text-slate-500 dark:text-zinc-400 block mt-0.5">Weighted evaluation</span>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600 dark:text-zinc-400 font-sans">
                  <span>Importance</span>
                  <strong className="text-slate-900 dark:text-zinc-100 font-semibold font-mono">{topSignal.importance_score}/100</strong>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-zinc-400 font-sans">
                  <span>Developer Value</span>
                  <strong className="text-slate-900 dark:text-zinc-100 font-semibold font-mono">{topSignal.relevance_score}/100</strong>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-zinc-400 font-sans">
                  <span>Momentum</span>
                  <strong className="text-slate-900 dark:text-zinc-100 font-semibold font-mono">{topSignal.momentum_score}/100</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grid: Community Pulse & Practical Task */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* Featured Community Trend */}
        {featuredTrend && (
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h2 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-zinc-100">
                Community Pulse & re:Post Discussions
              </h2>
            </div>
            <TrendCard topic={featuredTrend} />
          </div>
        )}

        {/* Try This Today Card */}
        {briefing?.try_today && (
          <div className="space-y-2.5">
            <h2 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-zinc-100">
              10-Minute Practical Lab
            </h2>

            <div className="bg-white dark:bg-[#121216] border border-slate-200 dark:border-zinc-800 rounded-xl p-5 h-[calc(100%-2rem)] flex flex-col justify-between shadow-sm transition-colors">
              <div>
                <span className="text-[10px] font-semibold text-[#00d294] bg-[#00d294]/10 px-2 py-0.5 rounded-md uppercase tracking-wider mb-2.5 inline-block border border-[#00d294]/30">
                  Hands-On Lab
                </span>
                <h3 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-zinc-100 mb-1.5 leading-snug">
                  {briefing.try_today.title}
                </h3>
                <p className="text-slate-600 dark:text-zinc-400 text-xs sm:text-sm leading-relaxed mb-3 font-normal">
                  {briefing.try_today.description}
                </p>
              </div>

              <a
                href={briefing.try_today.doc_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 bg-[#00d294] hover:bg-[#00baa7] text-zinc-950 px-3.5 py-1.5 rounded-lg font-medium text-xs shadow-sm transition-all self-start"
              >
                <span>Launch tutorial</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        )}

      </div>

      {/* Recent Signals Stream */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-zinc-100">
            Recent Radar Signals
          </h2>
          <button 
            onClick={onExploreSignals}
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View all signals</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recentSignals.map((sig) => (
            <SignalCard
              key={sig.signal_id}
              signal={sig}
              onOpenDetail={onOpenSignalDetail}
              onToggleSave={onToggleSave}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
