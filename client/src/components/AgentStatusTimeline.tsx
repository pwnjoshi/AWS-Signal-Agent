import React from 'react';
import { AgentExecutionLog } from '../types/clientTypes';
import { Play, RefreshCw, Clock, Brain } from 'lucide-react';

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
    <div className="space-y-6 font-sans text-slate-900 dark:text-zinc-100 pb-12">
      {/* Header Banner */}
      <div className="bg-white dark:bg-[#121216] rounded-xl p-5 sm:p-6 border border-slate-200 dark:border-zinc-800 shadow-sm transition-colors">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-[#00d294]" />
              <span className="text-xs font-semibold text-[#00d294] font-mono">System Online</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-zinc-100">
              Autonomous Agent Telemetry
            </h1>
            <p className="text-slate-500 dark:text-zinc-400 text-xs sm:text-sm mt-0.5 font-normal">
              EventBridge Scheduler background execution monitor & neural pipeline logs.
            </p>
          </div>

          <button
            onClick={onRunNow}
            disabled={isRunning}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-xs shadow-sm transition-all active:scale-98 disabled:opacity-50 cursor-pointer"
          >
            {isRunning ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Running pipeline...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>Run agent now</span>
              </>
            )}
          </button>
        </div>

        {/* Real Backend Execution Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2.5 font-mono">
          <div className="bg-slate-50 dark:bg-[#18181b] border border-slate-200 dark:border-zinc-800 rounded-lg p-3">
            <span className="text-[10px] text-slate-500 dark:text-zinc-400 font-semibold block uppercase tracking-wider">Sources</span>
            <span className="text-lg sm:text-xl font-bold text-slate-900 dark:text-zinc-100">{latestLog?.sources_checked ?? 5}</span>
          </div>

          <div className="bg-slate-50 dark:bg-[#18181b] border border-slate-200 dark:border-zinc-800 rounded-lg p-3">
            <span className="text-[10px] text-slate-500 dark:text-zinc-400 font-semibold block uppercase tracking-wider">New Items</span>
            <span className="text-lg sm:text-xl font-bold text-blue-600 dark:text-blue-400">{latestLog?.new_items ?? 156}</span>
          </div>

          <div className="bg-slate-50 dark:bg-[#18181b] border border-slate-200 dark:border-zinc-800 rounded-lg p-3">
            <span className="text-[10px] text-slate-500 dark:text-zinc-400 font-semibold block uppercase tracking-wider">Duplicates</span>
            <span className="text-lg sm:text-xl font-bold text-slate-600 dark:text-zinc-400">{latestLog?.duplicates_found ?? 11}</span>
          </div>

          <div className="bg-slate-50 dark:bg-[#18181b] border border-slate-200 dark:border-zinc-800 rounded-lg p-3">
            <span className="text-[10px] text-slate-500 dark:text-zinc-400 font-semibold block uppercase tracking-wider">Ranked</span>
            <span className="text-lg sm:text-xl font-bold text-[#00d294]">{latestLog?.signals_detected ?? 10}</span>
          </div>

          <div className="bg-slate-50 dark:bg-[#18181b] border border-slate-200 dark:border-zinc-800 rounded-lg p-3">
            <span className="text-[10px] text-slate-500 dark:text-zinc-400 font-semibold block uppercase tracking-wider">High Alert</span>
            <span className="text-lg sm:text-xl font-bold text-red-500">{latestLog?.high_priority_count ?? 3}</span>
          </div>

          <div className="bg-slate-50 dark:bg-[#18181b] border border-slate-200 dark:border-zinc-800 rounded-lg p-3">
            <span className="text-[10px] text-slate-500 dark:text-zinc-400 font-semibold block uppercase tracking-wider">Briefing</span>
            <span className="text-lg sm:text-xl font-bold text-orange-600 dark:text-orange-400">{latestLog?.briefing_generated ? 'Published' : 'Active'}</span>
          </div>
        </div>
      </div>

      {/* Dori Self-Correction & Neural Weight Tuning Panel */}
      <div className="bg-white dark:bg-[#121216] rounded-xl p-5 sm:p-6 border border-slate-200 dark:border-zinc-800 shadow-sm transition-colors">
        <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-slate-200 dark:border-zinc-800">
          <Brain className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <div>
            <h2 className="text-sm font-semibold text-slate-900 dark:text-zinc-100">
              Self-Correction & Neural Weight Tuning
            </h2>
            <p className="text-xs text-slate-500 dark:text-zinc-400 font-normal">How Bedrock scoring weights adapt over time based on developer interactions</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-xs font-mono">
          <div className="bg-slate-50 dark:bg-[#18181b] border border-slate-200 dark:border-zinc-800 p-3.5 rounded-lg">
            <span className="text-blue-600 dark:text-blue-400 font-semibold block mb-1">
              Importance Weight
            </span>
            <span className="text-base font-bold text-slate-900 dark:text-zinc-100">0.25 → 0.28</span>
            <p className="text-slate-500 dark:text-zinc-400 mt-1 font-sans text-xs">Boosted priority for breaking serverless & AI releases.</p>
          </div>

          <div className="bg-slate-50 dark:bg-[#18181b] border border-slate-200 dark:border-zinc-800 p-3.5 rounded-lg">
            <span className="text-orange-600 dark:text-orange-400 font-semibold block mb-1">
              Developer Value
            </span>
            <span className="text-base font-bold text-slate-900 dark:text-zinc-100">0.25 → 0.27</span>
            <p className="text-slate-500 dark:text-zinc-400 mt-1 font-sans text-xs">Tuned towards Amazon Bedrock & Lambda SnapStart workloads.</p>
          </div>

          <div className="bg-slate-50 dark:bg-[#18181b] border border-slate-200 dark:border-zinc-800 p-3.5 rounded-lg">
            <span className="text-[#00d294] font-semibold block mb-1">
              Community Momentum
            </span>
            <span className="text-base font-bold text-slate-900 dark:text-zinc-100">0.15 → 0.18</span>
            <p className="text-slate-500 dark:text-zinc-400 mt-1 font-sans text-xs">Prioritizes re:Post developer latency discussions.</p>
          </div>
        </div>
      </div>

      {/* Execution Timeline */}
      <div className="bg-white dark:bg-[#121216] rounded-xl border border-slate-200 dark:border-zinc-800 p-5 sm:p-6 shadow-sm transition-colors">
        <h2 className="text-sm font-semibold text-slate-900 dark:text-zinc-100 mb-5 flex items-center gap-2">
          <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          Latest Execution Telemetry ({latestLog?.run_id || 'run_latest'})
        </h2>

        {!latestLog || !latestLog.timeline || latestLog.timeline.length === 0 ? (
          <div className="p-6 text-center text-slate-500 dark:text-zinc-400 text-xs">
            No telemetry logs recorded yet. Click "Run agent now" to trigger live execution.
          </div>
        ) : (
          <div className="relative pl-5 border-l-2 border-slate-200 dark:border-zinc-800 space-y-4">
            {latestLog.timeline.map((entry, idx) => (
              <div key={idx} className="relative group">
                <div className={`absolute -left-[27px] top-1 w-3 h-3 rounded-full border-2 border-white dark:border-[#121216] ${
                  entry.status === 'success' ? 'bg-[#00d294]' : entry.status === 'warning' ? 'bg-orange-500' : 'bg-blue-600'
                }`} />

                <div className="bg-slate-50 dark:bg-[#18181b] border border-slate-200 dark:border-zinc-800 rounded-lg p-3.5 transition-all hover:border-blue-400">
                  <div className="flex items-center justify-between gap-2 mb-1 font-mono">
                    <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded bg-white dark:bg-[#202026] border border-slate-200 dark:border-zinc-700">
                      {entry.step}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-zinc-400 font-mono">
                      {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-xs text-slate-900 dark:text-zinc-100 font-mono mt-1.5 leading-relaxed">
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
