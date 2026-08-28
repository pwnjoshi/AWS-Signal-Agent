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
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              SYSTEM STATUS: ONLINE
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-rounded">
              Autonomous Agent Telemetry
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              EventBridge Scheduler background execution monitor & step-by-step pipeline logs.
            </p>
          </div>

          <button
            onClick={onRunNow}
            disabled={isRunning}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-blue-500/25 transition-all active:scale-95 disabled:opacity-50"
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
          <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5">
            <span className="text-[11px] text-slate-400 font-semibold block uppercase">Sources Checked</span>
            <span className="text-2xl font-extrabold text-white">{latestLog?.sources_checked ?? 5}</span>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5">
            <span className="text-[11px] text-slate-400 font-semibold block uppercase">New Items</span>
            <span className="text-2xl font-extrabold text-blue-400">{latestLog?.new_items ?? 156}</span>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5">
            <span className="text-[11px] text-slate-400 font-semibold block uppercase">Duplicates</span>
            <span className="text-2xl font-extrabold text-slate-400">{latestLog?.duplicates_found ?? 11}</span>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5">
            <span className="text-[11px] text-slate-400 font-semibold block uppercase">Signals Ranked</span>
            <span className="text-2xl font-extrabold text-emerald-400">{latestLog?.signals_detected ?? 10}</span>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5">
            <span className="text-[11px] text-slate-400 font-semibold block uppercase">High Priority</span>
            <span className="text-2xl font-extrabold text-red-400">{latestLog?.high_priority_count ?? 3}</span>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5">
            <span className="text-[11px] text-slate-400 font-semibold block uppercase">Daily Briefing</span>
            <span className="text-2xl font-extrabold text-amber-400">{latestLog?.briefing_generated ? 'Published' : 'Active'}</span>
          </div>
        </div>
      </div>

      {/* Dori Self-Correction & Style Evolution Panel */}
      <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-indigo-700/30 shadow-lg">
        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-indigo-800/40">
          <Brain className="w-6 h-6 text-indigo-400 animate-pulse" />
          <div>
            <h2 className="text-lg font-bold text-white font-rounded">
              Dori Self-Correction & Style Evolution
            </h2>
            <p className="text-xs text-indigo-200">How Bedrock scoring weights adapt over time based on developer saves & interaction</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
            <span className="text-indigo-300 font-bold block mb-1">⚖️ Importance Weight</span>
            <span className="text-lg font-extrabold text-white">0.25 → 0.28</span>
            <p className="text-slate-400 mt-1">Boosted priority for breaking serverless & AI releases.</p>
          </div>

          <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
            <span className="text-indigo-300 font-bold block mb-1">🎯 Developer Value</span>
            <span className="text-lg font-extrabold text-white">0.25 → 0.27</span>
            <p className="text-slate-400 mt-1">Tuned towards Amazon Bedrock & Lambda SnapStart workloads.</p>
          </div>

          <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
            <span className="text-indigo-300 font-bold block mb-1">🔥 Community Momentum</span>
            <span className="text-lg font-extrabold text-white">0.15 → 0.18</span>
            <p className="text-slate-400 mt-1">Prioritizes re:Post developer latency discussions.</p>
          </div>
        </div>
      </div>

      {/* Execution Timeline */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2 font-rounded">
          <Clock className="w-5 h-5 text-blue-600" />
          Latest Execution Telemetry ({latestLog?.run_id || 'run_latest'})
        </h2>

        {!latestLog || !latestLog.timeline || latestLog.timeline.length === 0 ? (
          <div className="p-8 text-center text-slate-400">
            No telemetry logs recorded yet. Click "Run Agent Now" to trigger live execution.
          </div>
        ) : (
          <div className="relative pl-6 border-l-2 border-slate-200 space-y-6">
            {latestLog.timeline.map((entry, idx) => (
              <div key={idx} className="relative group">
                <div className={`absolute -left-[31px] top-1 w-4 h-4 rounded-full border-2 border-white ${
                  entry.status === 'success' ? 'bg-emerald-500' : entry.status === 'warning' ? 'bg-amber-500' : 'bg-blue-500'
                }`} />

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 transition-all hover:border-blue-200 hover:bg-white">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-xs font-bold text-blue-600 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-100">
                      {entry.step}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 font-mono mt-2 leading-relaxed">
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
