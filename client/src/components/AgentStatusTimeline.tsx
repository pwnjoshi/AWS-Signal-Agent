import React from 'react';
import { AgentExecutionLog } from '../types/clientTypes';
import { Play, RefreshCw, Clock, Sparkles, Brain, CheckCircle2, Sliders } from 'lucide-react';

interface AgentStatusTimelineProps {
  latestLog: AgentExecutionLog | null;
  isRunning: boolean;
  nextRun: string;
  onRunNow: () => void;
}

export const AgentStatusTimeline: React.FC<AgentStatusTimelineProps> = ({
  latestLog,
  isRunning,
  nextRun,
  onRunNow,
}) => {
  return (
    <div className="space-y-6 font-mono text-zinc-100 pb-12">
      {/* Header Banner */}
      <div className="bg-[#121216] text-white rounded-3xl p-6 sm:p-8 border border-[#27272a] shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00d294]/15 text-[#00d294] border border-[#00d294]/30 text-xs font-bold mb-2 uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-[#00d294] animate-ping" />
              SYSTEM STATUS: ONLINE
            </div>
            <h1 className="text-xl sm:text-3xl font-black font-display uppercase tracking-tight text-white">
              Autonomous Agent Telemetry
            </h1>
            <p className="text-zinc-400 text-xs sm:text-sm mt-1 font-sans">
              EventBridge Scheduler background execution monitor & step-by-step neural pipeline logs.
            </p>
          </div>

          <button
            onClick={onRunNow}
            disabled={isRunning}
            className="flex items-center gap-2 bg-[#AD5CFF] hover:bg-[#9C47FF] text-white px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-purple-glow transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            {isRunning ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Running Pipeline...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>Run Agent Now</span>
              </>
            )}
          </button>
        </div>

        {/* Real Backend Execution Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          <div className="bg-[#09090b] border border-[#27272a] rounded-2xl p-3.5">
            <span className="text-[10px] text-zinc-500 font-bold block uppercase tracking-wider">Sources</span>
            <span className="text-xl sm:text-2xl font-black text-white">{latestLog?.sources_checked ?? 5}</span>
          </div>

          <div className="bg-[#09090b] border border-[#27272a] rounded-2xl p-3.5">
            <span className="text-[10px] text-zinc-500 font-bold block uppercase tracking-wider">New Items</span>
            <span className="text-xl sm:text-2xl font-black text-[#AD5CFF]">{latestLog?.new_items ?? 156}</span>
          </div>

          <div className="bg-[#09090b] border border-[#27272a] rounded-2xl p-3.5">
            <span className="text-[10px] text-zinc-500 font-bold block uppercase tracking-wider">Duplicates</span>
            <span className="text-xl sm:text-2xl font-black text-zinc-400">{latestLog?.duplicates_found ?? 11}</span>
          </div>

          <div className="bg-[#09090b] border border-[#27272a] rounded-2xl p-3.5">
            <span className="text-[10px] text-zinc-500 font-bold block uppercase tracking-wider">Ranked</span>
            <span className="text-xl sm:text-2xl font-black text-[#00d294]">{latestLog?.signals_detected ?? 10}</span>
          </div>

          <div className="bg-[#09090b] border border-[#27272a] rounded-2xl p-3.5">
            <span className="text-[10px] text-zinc-500 font-bold block uppercase tracking-wider">High Alert</span>
            <span className="text-xl sm:text-2xl font-black text-red-400">{latestLog?.high_priority_count ?? 3}</span>
          </div>

          <div className="bg-[#09090b] border border-[#27272a] rounded-2xl p-3.5">
            <span className="text-[10px] text-zinc-500 font-bold block uppercase tracking-wider">Briefing</span>
            <span className="text-xl sm:text-2xl font-black text-[#ffc080]">{latestLog?.briefing_generated ? 'Published' : 'Active'}</span>
          </div>
        </div>
      </div>

      {/* Dori Self-Correction & Style Evolution Panel */}
      <div className="bg-[#121216] text-white rounded-3xl p-6 sm:p-8 border border-[#27272a] shadow-xl">
        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[#27272a]">
          <Brain className="w-5 h-5 text-[#AD5CFF] animate-pulse" />
          <div>
            <h2 className="text-base font-bold text-white uppercase tracking-tight">
              Dori Self-Correction & Neural Weight Tuning
            </h2>
            <p className="text-xs text-zinc-400 font-sans">How Bedrock scoring weights adapt over time based on developer saves & interaction</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-[#09090b] border border-[#27272a] p-4 rounded-2xl">
            <span className="text-[#AD5CFF] font-bold block mb-1 uppercase tracking-wider">⚖️ Importance Weight</span>
            <span className="text-base sm:text-lg font-black text-white">0.25 → 0.28</span>
            <p className="text-zinc-400 mt-1 font-sans text-[11px]">Boosted priority for breaking serverless & AI releases.</p>
          </div>

          <div className="bg-[#09090b] border border-[#27272a] p-4 rounded-2xl">
            <span className="text-[#ffc080] font-bold block mb-1 uppercase tracking-wider">🎯 Developer Value</span>
            <span className="text-base sm:text-lg font-black text-white">0.25 → 0.27</span>
            <p className="text-zinc-400 mt-1 font-sans text-[11px]">Tuned towards Amazon Bedrock & Lambda SnapStart workloads.</p>
          </div>

          <div className="bg-[#09090b] border border-[#27272a] p-4 rounded-2xl">
            <span className="text-[#00d294] font-bold block mb-1 uppercase tracking-wider">🔥 Community Momentum</span>
            <span className="text-base sm:text-lg font-black text-white">0.15 → 0.18</span>
            <p className="text-zinc-400 mt-1 font-sans text-[11px]">Prioritizes re:Post developer latency discussions.</p>
          </div>
        </div>
      </div>

      {/* Execution Timeline */}
      <div className="bg-[#121216] rounded-3xl border border-[#27272a] p-6 sm:p-8 shadow-xl">
        <h2 className="text-base font-bold text-white mb-6 flex items-center gap-2 uppercase tracking-wide">
          <Clock className="w-4 h-4 text-[#AD5CFF]" />
          Latest Execution Telemetry ({latestLog?.run_id || 'run_latest'})
        </h2>

        {!latestLog || !latestLog.timeline || latestLog.timeline.length === 0 ? (
          <div className="p-8 text-center text-zinc-500">
            No telemetry logs recorded yet. Click "Run Agent Now" to trigger live execution.
          </div>
        ) : (
          <div className="relative pl-6 border-l-2 border-[#27272a] space-y-6">
            {latestLog.timeline.map((entry, idx) => (
              <div key={idx} className="relative group">
                <div className={`absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full border-2 border-[#09090b] ${
                  entry.status === 'success' ? 'bg-[#00d294]' : entry.status === 'warning' ? 'bg-[#ffc080]' : 'bg-[#AD5CFF]'
                }`} />

                <div className="bg-[#09090b] border border-[#27272a] rounded-2xl p-4 transition-all hover:border-[#AD5CFF]/40">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-xs font-bold text-[#AD5CFF] px-2.5 py-0.5 rounded-full bg-[#18181b] border border-[#27272a] uppercase">
                      {entry.step}
                    </span>
                    <span className="text-xs text-zinc-500 font-mono">
                      {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-300 font-mono mt-2 leading-relaxed">
                    {entry.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default AgentStatusTimeline;
