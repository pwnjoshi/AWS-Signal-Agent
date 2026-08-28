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
import { Sparkles, ArrowRight, Zap, Target, BookOpen, ShieldCheck, Radio, Flame, Cpu, CheckCircle2, Activity, FlaskConical, MessageSquare } from 'lucide-react';

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
    <div className="space-y-6 pb-12 font-sans text-on-background">
      
      {/* Top Banner & Stats Overview */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-surface border border-outline rounded-xl p-5 sm:p-6 shadow-sm font-mono transition-colors">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-md bg-surface-low border border-outline text-primary text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00d294]" />
            <span>Autonomous Intelligence Matrix</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black font-display text-on-background tracking-tight uppercase">
            AWS Signal Command Center
          </h1>
          <p className="text-on-surface-variant text-xs sm:text-sm mt-1 font-sans">
            Real-time cloud telemetry, SHA-256 content deduplication, and Amazon Bedrock multi-metric ranking.
          </p>
        </div>

        {/* Quick Deduplication Badge */}
        <div className="flex items-center gap-3 bg-surface-low border border-outline px-3.5 py-2.5 rounded-lg shrink-0">
          <ShieldCheck className="w-6 h-6 text-[#00d294] shrink-0" />
          <div>
            <span className="text-xs font-bold text-on-background block uppercase">Deduplication Vault</span>
            <span className="text-xs text-on-surface-variant font-mono">0 Duplicate Repeats</span>
          </div>
        </div>
      </div>

      {/* Signature Feature: "While You Were Away" */}
      <WhileYouWereAway summary={summary} onExplore={onExploreSignals} />

      {/* Today's Highlighted AWS Signal */}
      {topSignal && (
        <div className="bg-surface border border-outline rounded-xl p-5 sm:p-6 shadow-sm font-mono transition-colors">
          <div className="flex items-center justify-between gap-2 mb-3 pb-3 border-b border-outline">
            <span className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-primary" />
              TOP SIGNAL OF THE DAY
            </span>
            <span className="text-xs text-on-surface-variant font-mono">
              Discovered {new Date(topSignal.discovered_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            <div className="lg:col-span-2 space-y-2.5">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-surface-low text-primary border border-outline uppercase">
                  {topSignal.category}
                </span>
                {topSignal.aws_services.map(s => (
                  <span key={s} className="text-xs font-semibold px-2 py-0.5 rounded-md bg-surface-low text-on-surface-variant border border-outline">
                    {s}
                  </span>
                ))}
              </div>

              <h2 
                onClick={() => onOpenSignalDetail(topSignal)}
                className="text-base sm:text-xl font-bold text-on-background hover:text-primary cursor-pointer transition-colors leading-snug font-sans"
              >
                {topSignal.title}
              </h2>

              <p className="text-on-surface-variant text-xs leading-relaxed font-sans">
                {topSignal.summary}
              </p>

              <div className="pt-1">
                <button
                  onClick={() => onOpenSignalDetail(topSignal)}
                  className="inline-flex items-center gap-1.5 bg-primary hover:bg-primary-container text-white px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wide shadow-sm transition-all active:scale-98 cursor-pointer"
                >
                  <span>Read Full Bedrock Rationale</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Score Breakdown Box */}
            <div className="bg-surface-low border border-outline rounded-lg p-4 space-y-2.5 font-mono">
              <div className="text-center pb-2.5 border-b border-outline">
                <span className="text-[10px] text-on-surface-variant font-bold uppercase block tracking-wider">Bedrock Score</span>
                <span className="text-2xl font-black text-primary">{topSignal.signal_score}</span>
                <span className="text-[10px] text-on-surface-variant block mt-0.5">Weighted Evaluation</span>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-on-surface-variant">
                  <span>Importance</span>
                  <strong className="text-on-background">{topSignal.importance_score}/100</strong>
                </div>
                <div className="flex justify-between text-on-surface-variant">
                  <span>Developer Value</span>
                  <strong className="text-on-background">{topSignal.relevance_score}/100</strong>
                </div>
                <div className="flex justify-between text-on-surface-variant">
                  <span>Momentum</span>
                  <strong className="text-on-background">{topSignal.momentum_score}/100</strong>
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
            <div className="flex items-center justify-between font-mono">
              <h2 className="text-xs sm:text-sm font-bold text-on-background flex items-center gap-2 uppercase tracking-wide">
                <Flame className="w-4 h-4 text-[#fe9800]" />
                Community Pulse & re:Post Friction
              </h2>
            </div>
            <TrendCard topic={featuredTrend} />
          </div>
        )}

        {/* Try This Today Card */}
        {briefing?.try_today && (
          <div className="space-y-2.5 font-mono">
            <h2 className="text-xs sm:text-sm font-bold text-on-background flex items-center gap-2 uppercase tracking-wide">
              <FlaskConical className="w-4 h-4 text-[#00d294]" />
              <span>10-Minute Practical Lab</span>
            </h2>

            <div className="bg-surface border border-outline rounded-xl p-5 h-[calc(100%-2rem)] flex flex-col justify-between shadow-sm transition-colors">
              <div>
                <span className="text-[10px] font-bold text-[#00d294] bg-[#00d294]/10 px-2 py-0.5 rounded-md uppercase tracking-wider mb-2.5 inline-block border border-[#00d294]/30">
                  HANDS-ON LAB
                </span>
                <h3 className="text-sm sm:text-base font-bold text-on-background mb-1.5 leading-snug font-sans">
                  {briefing.try_today.title}
                </h3>
                <p className="text-on-surface-variant text-xs leading-relaxed mb-3 font-sans">
                  {briefing.try_today.description}
                </p>
              </div>

              <a
                href={briefing.try_today.doc_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 bg-[#00d294] hover:bg-[#00baa7] text-zinc-950 px-3.5 py-1.5 rounded-lg font-bold text-xs uppercase tracking-wide shadow-sm transition-all self-start"
              >
                <span>Launch Tutorial</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        )}

      </div>

      {/* Recent Signals Stream */}
      <div className="space-y-3 font-mono">
        <div className="flex items-center justify-between">
          <h2 className="text-sm sm:text-base font-bold text-on-background uppercase tracking-tight">
            Recent Radar Signals
          </h2>
          <button 
            onClick={onExploreSignals}
            className="text-xs font-bold text-primary hover:underline flex items-center gap-1 uppercase"
          >
            <span>View All Signals</span>
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
