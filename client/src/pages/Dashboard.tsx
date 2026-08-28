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
    <div className="space-y-8 pb-12 font-sans text-slate-100">
      
      {/* Top Banner & Stats Overview */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-900/80 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-extrabold mb-2 tracking-wider uppercase">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            CYBER-RADAR COMMAND HUB ONLINE
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-rounded">
            AWS Pulse AI Command Center
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Real-time serverless telemetry, SHA-256 content deduplication, and Amazon Bedrock multi-metric neural scoring.
          </p>
        </div>

        {/* Quick Ticker Badge */}
        <div className="flex items-center gap-3 bg-slate-950/80 border border-slate-800 px-4 py-3 rounded-2xl shrink-0">
          <ShieldCheck className="w-8 h-8 text-emerald-400 shrink-0" />
          <div>
            <span className="text-xs font-bold text-slate-200 block">Deduplication Vault</span>
            <span className="text-xs text-slate-400 font-mono">0 Duplicate Repeats</span>
          </div>
        </div>
      </div>

      {/* Signature Feature: "While You Were Away" */}
      <WhileYouWereAway summary={summary} onExplore={onExploreSignals} />

      {/* Today's Highlighted AWS Signal */}
      {topSignal && (
        <div className="bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-xl">
          <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-800">
            <span className="text-xs font-extrabold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-blue-400" />
              TOP SIGNAL OF THE DAY
            </span>
            <span className="text-xs text-slate-500 font-mono">
              Discovered {new Date(topSignal.discovered_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            <div className="lg:col-span-2 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/30">
                  {topSignal.category}
                </span>
                {topSignal.aws_services.map(s => (
                  <span key={s} className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    {s}
                  </span>
                ))}
              </div>

              <h2 
                onClick={() => onOpenSignalDetail(topSignal)}
                className="text-xl sm:text-2xl font-extrabold text-white hover:text-blue-400 cursor-pointer transition-colors leading-tight font-rounded"
              >
                {topSignal.title}
              </h2>

              <p className="text-slate-300 text-sm leading-relaxed">
                {topSignal.summary}
              </p>

              <div className="pt-2">
                <button
                  onClick={() => onOpenSignalDetail(topSignal)}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-3 rounded-2xl font-bold text-xs shadow-lg shadow-blue-500/20 transition-all active:scale-95"
                >
                  <span>Read Full Bedrock Rationale</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Score Breakdown Box */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 space-y-3">
              <div className="text-center pb-3 border-b border-slate-800">
                <span className="text-xs text-slate-500 font-bold uppercase block">Bedrock Signal Score</span>
                <span className="text-4xl font-extrabold text-blue-400 font-rounded">{topSignal.signal_score}</span>
                <span className="text-[11px] text-slate-500 block mt-0.5">Weighted Neural Evaluation</span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Importance</span>
                  <strong className="text-white">{topSignal.importance_score}/100</strong>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Developer Value</span>
                  <strong className="text-white">{topSignal.relevance_score}/100</strong>
                </div>
                <div className="flex justify-between text-slate-400">
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
              <h2 className="text-lg font-bold text-white flex items-center gap-2 font-rounded">
                <Flame className="w-5 h-5 text-purple-400" />
                Community Pulse & re:Post Friction
              </h2>
            </div>
            <TrendCard topic={featuredTrend} />
          </div>
        )}

        {/* Try This Today Card */}
        {briefing?.try_today && (
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2 font-rounded">
              🧪 10-Minute Practical Lab
            </h2>

            <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-3xl p-6 h-[calc(100%-2.25rem)] flex flex-col justify-between backdrop-blur-md">
              <div>
                <span className="text-[11px] font-extrabold text-emerald-300 bg-emerald-500/10 px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-3 inline-block border border-emerald-500/20">
                  HANDS-ON AWS LAB
                </span>
                <h3 className="text-xl font-bold text-white mb-2 leading-snug font-rounded">
                  {briefing.try_today.title}
                </h3>
                <p className="text-emerald-100/80 text-sm leading-relaxed mb-4">
                  {briefing.try_today.description}
                </p>
              </div>

              <a
                href={briefing.try_today.doc_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all self-start"
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
          <h2 className="text-xl font-extrabold text-white tracking-tight font-rounded">
            Recent Radar Signals
          </h2>
          <button 
            onClick={onExploreSignals}
            className="text-xs font-bold text-blue-400 hover:underline flex items-center gap-1"
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
