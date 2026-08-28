import React from 'react';
import { 
  AWSSignal, 
  CommunityTopic, 
  DailyBriefing, 
  WhileYouWereAwaySummary 
} from '../types/clientTypes';
import { WhileYouWereAway } from '../components/WhileYouWereAway';
import { SignalCard } from '../components/SignalCard';
import { TrendCard } from '../components/TrendCard';
import { Sparkles, ArrowRight, Zap, Target, BookOpen, ShieldCheck, Radio, Flame, Cpu, CheckCircle2, Activity } from 'lucide-react';

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
  const topSignal = briefing?.top_signal || signals[0];
  const recentSignals = signals.slice(0, 4);
  const featuredTrend = trends[0];

  return (
    <div className="space-y-8 pb-12 font-sans text-zinc-100">
      
      {/* Top Banner & Stats Overview */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-[#121216]/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-[#ad5cff]/20 shadow-xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#ad5cff]/10 text-[#d8b4fe] border border-[#ad5cff]/30 text-xs font-extrabold mb-2 tracking-wider uppercase">
            <span className="w-2 h-2 rounded-full bg-[#fe6e00] animate-ping" />
            AWS STUDENT BUILDER GROUP GEU ONLINE
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            AWS Pulse AI Command Center
          </h1>
          <p className="text-zinc-400 text-sm mt-1">
            Real-time serverless telemetry, SHA-256 content deduplication, and Amazon Bedrock multi-metric neural scoring.
          </p>
        </div>

        {/* Quick Ticker Badge */}
        <div className="flex items-center gap-3 bg-[#09090b] border border-zinc-800 px-4 py-3 rounded-2xl shrink-0">
          <ShieldCheck className="w-8 h-8 text-[#00d294] shrink-0" />
          <div>
            <span className="text-xs font-bold text-zinc-200 block">Deduplication Vault</span>
            <span className="text-xs text-zinc-500 font-mono">0 Duplicate Repeats</span>
          </div>
        </div>
      </div>

      {/* Signature Feature: "While You Were Away" */}
      <WhileYouWereAway summary={summary} onExplore={onExploreSignals} />

      {/* Today's Highlighted AWS Signal */}
      {topSignal && (
        <div className="bg-[#121216]/90 backdrop-blur-xl rounded-3xl border border-[#ad5cff]/20 p-6 sm:p-8 shadow-xl">
          <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-zinc-800">
            <span className="text-xs font-extrabold text-[#ad5cff] uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#ad5cff]" />
              TOP SIGNAL OF THE DAY
            </span>
            <span className="text-xs text-zinc-500 font-mono">
              Discovered {new Date(topSignal.discovered_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            <div className="lg:col-span-2 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-[#ad5cff]/10 text-[#d8b4fe] border border-[#ad5cff]/30">
                  {topSignal.category}
                </span>
                {topSignal.aws_services.map(s => (
                  <span key={s} className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-zinc-900 text-zinc-300 border border-zinc-800">
                    {s}
                  </span>
                ))}
              </div>

              <h2 
                onClick={() => onOpenSignalDetail(topSignal)}
                className="text-xl sm:text-2xl font-extrabold text-white hover:text-[#ad5cff] cursor-pointer transition-colors leading-tight"
              >
                {topSignal.title}
              </h2>

              <p className="text-zinc-300 text-sm leading-relaxed">
                {topSignal.summary}
              </p>

              <div className="pt-2">
                <button
                  onClick={() => onOpenSignalDetail(topSignal)}
                  className="inline-flex items-center gap-2 btn-geu-gradient text-white px-5 py-3 rounded-2xl font-bold text-xs shadow-lg shadow-[#ad5cff]/20 transition-all active:scale-95"
                >
                  <span>Read Full Bedrock Rationale</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Score Breakdown Box */}
            <div className="bg-[#09090b] border border-zinc-800 rounded-2xl p-5 space-y-3">
              <div className="text-center pb-3 border-b border-zinc-800">
                <span className="text-xs text-zinc-500 font-bold uppercase block">Bedrock Signal Score</span>
                <span className="text-4xl font-extrabold text-geu-gradient">{topSignal.signal_score}</span>
                <span className="text-[11px] text-zinc-500 block mt-0.5">Weighted Neural Evaluation</span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-zinc-400">
                  <span>Importance</span>
                  <strong className="text-white">{topSignal.importance_score}/100</strong>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Developer Value</span>
                  <strong className="text-white">{topSignal.relevance_score}/100</strong>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Community Momentum</span>
                  <strong className="text-white">{topSignal.momentum_score}/100</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grid: Community Pulse & Practical Task */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Featured Community Trend */}
        {featuredTrend && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Flame className="w-5 h-5 text-[#fe6e00]" />
                Community Pulse & re:Post Friction
              </h2>
            </div>
            <TrendCard topic={featuredTrend} />
          </div>
        )}

        {/* Try This Today Card */}
        {briefing?.try_today && (
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              🧪 10-Minute Practical Lab
            </h2>

            <div className="bg-[#00d294]/10 border border-[#00d294]/30 rounded-3xl p-6 h-[calc(100%-2.25rem)] flex flex-col justify-between backdrop-blur-md">
              <div>
                <span className="text-[11px] font-extrabold text-[#5ee9b5] bg-[#00d294]/20 px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-3 inline-block border border-[#00d294]/30">
                  HANDS-ON AWS LAB
                </span>
                <h3 className="text-xl font-bold text-white mb-2 leading-snug">
                  {briefing.try_today.title}
                </h3>
                <p className="text-zinc-300 text-sm leading-relaxed mb-4">
                  {briefing.try_today.description}
                </p>
              </div>

              <a
                href={briefing.try_today.doc_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#00d294] hover:bg-[#00bb7f] text-zinc-950 px-5 py-2.5 rounded-xl font-extrabold text-xs shadow-md transition-all self-start"
              >
                <span>Launch Tutorial</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        )}

      </div>

      {/* Recent Signals Stream */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-extrabold text-white tracking-tight">
            Recent Radar Signals
          </h2>
          <button 
            onClick={onExploreSignals}
            className="text-xs font-bold text-[#ad5cff] hover:underline flex items-center gap-1"
          >
            <span>View All Signals</span>
            <ArrowRight className="w-3.5 h-3.5" />
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
