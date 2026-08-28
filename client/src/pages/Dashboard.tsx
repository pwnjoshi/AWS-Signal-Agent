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
import { Sparkles, ArrowRight, Zap, Target, BookOpen, ShieldCheck, Radio, Flame, Cpu, CheckCircle2 } from 'lucide-react';

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
    <div className="space-y-8 pb-12 font-sans">
      
      {/* Top Banner & Stats Overview */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-extrabold mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            AUTONOMOUS AWS INTELLIGENCE ACTIVE
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-rounded">
            AWS Pulse AI Dashboard
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Real-time serverless monitoring, SHA-256 content deduplication, and Amazon Bedrock multi-metric scoring.
          </p>
        </div>

        {/* Quick Ticker Badge */}
        <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 px-4 py-3 rounded-2xl shrink-0">
          <ShieldCheck className="w-8 h-8 text-emerald-500 shrink-0" />
          <div>
            <span className="text-xs font-bold text-slate-700 block">Deduplication Memory</span>
            <span className="text-xs text-slate-500 font-mono">0 Duplicate Repeats</span>
          </div>
        </div>
      </div>

      {/* Signature Feature: "While You Were Away" */}
      <WhileYouWereAway summary={summary} onExplore={onExploreSignals} />

      {/* Today's Highlighted AWS Signal */}
      {topSignal && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs">
          <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100">
            <span className="text-xs font-extrabold text-blue-600 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-blue-500" />
              TOP SIGNAL OF THE DAY
            </span>
            <span className="text-xs text-slate-400 font-medium">
              Discovered {new Date(topSignal.discovered_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            <div className="lg:col-span-2 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  {topSignal.category}
                </span>
                {topSignal.aws_services.map(s => (
                  <span key={s} className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    {s}
                  </span>
                ))}
              </div>

              <h2 
                onClick={() => onOpenSignalDetail(topSignal)}
                className="text-xl sm:text-2xl font-extrabold text-slate-900 hover:text-blue-600 cursor-pointer transition-colors leading-tight font-rounded"
              >
                {topSignal.title}
              </h2>

              <p className="text-slate-600 text-sm leading-relaxed">
                {topSignal.summary}
              </p>

              <div className="pt-2">
                <button
                  onClick={() => onOpenSignalDetail(topSignal)}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-3 rounded-2xl font-bold text-xs shadow-md shadow-blue-500/20 transition-all active:scale-95"
                >
                  <span>Read Full Bedrock Rationale</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Score Breakdown Box */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
              <div className="text-center pb-3 border-b border-slate-200">
                <span className="text-xs text-slate-400 font-bold uppercase block">Bedrock Signal Score</span>
                <span className="text-4xl font-extrabold text-blue-600 font-rounded">{topSignal.signal_score}</span>
                <span className="text-[11px] text-slate-400 block mt-0.5">Weighted Assessment</span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Importance</span>
                  <strong className="text-slate-900">{topSignal.importance_score}/100</strong>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Developer Value</span>
                  <strong className="text-slate-900">{topSignal.relevance_score}/100</strong>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Community Momentum</span>
                  <strong className="text-slate-900">{topSignal.momentum_score}/100</strong>
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
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 font-rounded">
                <Flame className="w-5 h-5 text-purple-600" />
                Community Pulse & re:Post Friction
              </h2>
            </div>
            <TrendCard topic={featuredTrend} />
          </div>
        )}

        {/* Try This Today Card */}
        {briefing?.try_today && (
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 font-rounded">
              🧪 10-Minute Practical Lab
            </h2>

            <div className="bg-emerald-50/80 border border-emerald-200 rounded-3xl p-6 h-[calc(100%-2.25rem)] flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-extrabold text-emerald-800 bg-emerald-200/60 px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-3 inline-block">
                  HANDS-ON AWS LAB
                </span>
                <h3 className="text-xl font-bold text-emerald-950 mb-2 leading-snug font-rounded">
                  {briefing.try_today.title}
                </h3>
                <p className="text-emerald-900 text-sm leading-relaxed mb-4">
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
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight font-rounded">
            Recent Intelligence Signals
          </h2>
          <button 
            onClick={onExploreSignals}
            className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
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
