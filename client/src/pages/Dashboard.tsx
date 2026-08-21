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
import { Sparkles, ArrowRight, Zap, Target, BookOpen } from 'lucide-react';

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
    <div className="space-y-8 pb-12">
      {/* Personalized Greeting */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-rounded">
          Good morning, Pawan 👋
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Your AWS companion has been watching the cloud for you.
        </p>
      </div>

      {/* Signature Feature: "While You Were Away" */}
      <WhileYouWereAway summary={summary} onExplore={onExploreSignals} />

      {/* Today's Highlighted AWS Signal */}
      {topSignal && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100">
            <span className="text-xs font-extrabold text-blue-600 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-blue-500" />
              TODAY'S HIGHLIGHTED AWS SIGNAL
            </span>
            <span className="text-xs text-slate-400 font-medium">
              Discovered {new Date(topSignal.discovered_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            <div className="lg:col-span-2 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
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
                className="text-xl sm:text-2xl font-extrabold text-slate-900 hover:text-blue-600 cursor-pointer transition-colors leading-tight"
              >
                {topSignal.title}
              </h2>

              <p className="text-slate-600 text-sm leading-relaxed">
                {topSignal.summary}
              </p>

              <div className="pt-2">
                <button
                  onClick={() => onOpenSignalDetail(topSignal)}
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md shadow-blue-500/20 transition-all"
                >
                  <span>Read Full Developer Analysis</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Score Breakdown Box */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
              <div className="text-center pb-3 border-b border-slate-200">
                <span className="text-xs text-slate-400 font-bold uppercase block">Bedrock Signal Score</span>
                <span className="text-4xl font-extrabold text-blue-600">{topSignal.signal_score}</span>
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

      {/* Grid: Community Pulse & Try This Today */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Featured Community Trend */}
        {featuredTrend && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                💬 Community Pulse Signal
              </h2>
            </div>
            <TrendCard topic={featuredTrend} />
          </div>
        )}

        {/* Try This Today Card */}
        {briefing?.try_today && (
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              🧪 Try This Today
            </h2>

            <div className="bg-emerald-50/80 border border-emerald-200 rounded-3xl p-6 h-[calc(100%-2.25rem)] flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-extrabold text-emerald-800 bg-emerald-200/60 px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-3 inline-block">
                  10-MINUTE PRACTICAL LAB
                </span>
                <h3 className="text-xl font-bold text-emerald-950 mb-2 leading-snug">
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
