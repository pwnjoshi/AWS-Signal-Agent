import React from 'react';
import { AWSSignal } from '../types/clientTypes';
import { X, ExternalLink, ShieldCheck, Sparkles, ArrowUpRight, Cpu, Layers, Bookmark } from 'lucide-react';

interface SignalDetailModalProps {
  signal: AWSSignal | null;
  onClose: () => void;
  onToggleSave?: (signalId: string) => void;
}

export const SignalDetailModal: React.FC<SignalDetailModalProps> = ({
  signal,
  onClose,
  onToggleSave,
}) => {
  if (!signal) return null;

  return (
    <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 font-sans text-slate-900 dark:text-zinc-100">
      <div className="bg-white dark:bg-[#18181b] rounded-xl max-w-2xl w-full shadow-2xl border border-slate-200 dark:border-zinc-800 p-6 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto font-mono">
        
        {/* Modal Top Controls */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-200 dark:border-zinc-800 mb-5">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 uppercase">
                {signal.category}
              </span>
              {signal.aws_services.map((s) => (
                <span key={s} className="text-[10px] font-semibold text-slate-600 dark:text-zinc-400 bg-slate-50 dark:bg-[#202026] px-2 py-0.5 rounded border border-slate-200 dark:border-zinc-700">
                  {s}
                </span>
              ))}
            </div>

            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-zinc-100 leading-snug font-sans">
              {signal.title}
            </h2>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {onToggleSave && (
              <button
                onClick={() => onToggleSave(signal.signal_id)}
                className={`p-2 rounded-lg border transition-all cursor-pointer ${
                  signal.is_saved 
                    ? 'bg-orange-50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400 border-orange-300 dark:border-orange-700' 
                    : 'bg-slate-50 dark:bg-[#202026] text-slate-500 dark:text-zinc-400 border-slate-200 dark:border-zinc-700 hover:text-slate-900 dark:hover:text-zinc-100'
                }`}
                title={signal.is_saved ? 'Saved' : 'Save'}
              >
                <Bookmark className={`w-4 h-4 ${signal.is_saved ? 'fill-orange-500' : ''}`} />
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 text-slate-500 hover:text-slate-900 dark:hover:text-zinc-100 hover:bg-slate-100 dark:hover:bg-[#27272a] rounded-lg border border-slate-200 dark:border-zinc-700 transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 5-Metric Breakdown */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-5">
          <div className="bg-slate-50 dark:bg-[#202026] border border-slate-200 dark:border-zinc-700 p-2.5 rounded-lg text-center">
            <span className="text-[10px] text-slate-500 dark:text-zinc-400 uppercase font-bold block">Overall Score</span>
            <span className="text-lg font-black text-blue-600 dark:text-blue-400">{signal.signal_score}</span>
          </div>

          <div className="bg-slate-50 dark:bg-[#202026] border border-slate-200 dark:border-zinc-700 p-2.5 rounded-lg text-center">
            <span className="text-[10px] text-slate-500 dark:text-zinc-400 uppercase font-bold block">Importance</span>
            <span className="text-lg font-bold text-slate-900 dark:text-zinc-100">{signal.importance_score}</span>
          </div>

          <div className="bg-slate-50 dark:bg-[#202026] border border-slate-200 dark:border-zinc-700 p-2.5 rounded-lg text-center">
            <span className="text-[10px] text-slate-500 dark:text-zinc-400 uppercase font-bold block">Dev Value</span>
            <span className="text-lg font-bold text-slate-900 dark:text-zinc-100">{signal.relevance_score}</span>
          </div>

          <div className="bg-slate-50 dark:bg-[#202026] border border-slate-200 dark:border-zinc-700 p-2.5 rounded-lg text-center">
            <span className="text-[10px] text-slate-500 dark:text-zinc-400 uppercase font-bold block">Momentum</span>
            <span className="text-lg font-bold text-slate-900 dark:text-zinc-100">{signal.momentum_score}</span>
          </div>
        </div>

        {/* AI Synthesis & Why It Matters */}
        <div className="space-y-4 mb-6 font-sans">
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-zinc-100 uppercase tracking-wider mb-1.5 font-mono flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              Executive AI Synthesis
            </h4>
            <p className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed bg-slate-50 dark:bg-[#202026] p-3.5 rounded-lg border border-slate-200 dark:border-zinc-700">
              {signal.summary}
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-zinc-100 uppercase tracking-wider mb-1.5 font-mono flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
              Why Developers Should Care & Recommended Action
            </h4>
            <p className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed bg-slate-50 dark:bg-[#202026] p-3.5 rounded-lg border border-slate-200 dark:border-zinc-700">
              {typeof signal.why_it_matters === 'string' 
                ? signal.why_it_matters 
                : `${signal.why_it_matters?.why_it_matters || ''} ${signal.why_it_matters?.recommended_action || ''}`}
            </p>
          </div>
        </div>

        {/* Metadata & Direct Source Link */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200 dark:border-zinc-800 text-xs">
          <div className="space-y-0.5 text-[11px] text-slate-500 dark:text-zinc-400">
            <div>Discovered: {new Date(signal.discovered_at).toLocaleString()}</div>
            <div>Source Feed: {signal.source}</div>
          </div>

          <a
            href={signal.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold uppercase tracking-wide text-xs shadow-sm transition-all"
          >
            <span>Open Official AWS Resource</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>

      </div>
    </div>
  );
};
export default SignalDetailModal;
