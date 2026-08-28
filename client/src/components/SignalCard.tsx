import React from 'react';
import { AWSSignal } from '../types/clientTypes';
import { ExternalLink, Info, Bookmark, Sparkles, ShieldAlert, Cpu, Radio, Flame, BookOpen, Layers } from 'lucide-react';

interface SignalCardProps {
  signal: AWSSignal;
  onOpenDetail: (signal: AWSSignal) => void;
  onToggleSave?: (signalId: string) => void;
}

export const SignalCard: React.FC<SignalCardProps> = ({ signal, onOpenDetail, onToggleSave }) => {
  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-[#00d294] bg-[#00d294]/10 border-[#00d294]/30';
    if (score >= 70) return 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800';
    return 'text-slate-600 dark:text-zinc-400 bg-slate-50 dark:bg-[#18181b] border-slate-200 dark:border-zinc-800';
  };

  const getCategoryTheme = (category: string) => {
    switch (category) {
      case 'Community Discussion':
        return {
          icon: Flame,
          badge: 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800',
          iconBg: 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800',
        };
      case 'Architecture Pattern':
        return {
          icon: Layers,
          badge: 'bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-800',
          iconBg: 'bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-800',
        };
      case 'Security Alert':
        return {
          icon: ShieldAlert,
          badge: 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800',
          iconBg: 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800',
        };
      case 'Tutorial':
        return {
          icon: BookOpen,
          badge: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
          iconBg: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800',
        };
      default:
        return {
          icon: Radio,
          badge: 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800',
          iconBg: 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800',
        };
    }
  };

  const theme = getCategoryTheme(signal.category);
  const CategoryIcon = theme.icon;

  return (
    <div className="bg-white dark:bg-[#121216] border border-slate-200 dark:border-zinc-800 rounded-xl p-5 hover:border-blue-400 dark:hover:border-blue-600 transition-all flex flex-col justify-between group relative font-mono text-slate-900 dark:text-zinc-100 shadow-sm">
      
      <div>
        {/* Header Badges */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            {/* Category Icon Container */}
            <div className={`w-8 h-8 rounded-lg ${theme.iconBg} flex items-center justify-center shrink-0`}>
              <CategoryIcon className="w-4 h-4" />
            </div>

            <div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${theme.badge} inline-block mb-1 uppercase tracking-wider`}>
                {signal.category}
              </span>
              <div className="flex flex-wrap items-center gap-1">
                {signal.aws_services.slice(0, 2).map((service) => (
                  <span key={service} className="text-[10px] font-semibold text-slate-600 dark:text-zinc-400 bg-slate-50 dark:bg-[#18181b] px-1.5 py-0.5 rounded border border-slate-200 dark:border-zinc-800">
                    {service}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Bookmark Button */}
          <button
            onClick={() => onToggleSave && onToggleSave(signal.signal_id)}
            className={`p-2 rounded-lg transition-all border cursor-pointer ${
              signal.is_saved 
                ? 'bg-orange-50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400 border-orange-300 dark:border-orange-700' 
                : 'bg-slate-50 dark:bg-[#18181b] text-slate-500 dark:text-zinc-400 border-slate-200 dark:border-zinc-800 hover:text-slate-900 dark:hover:text-zinc-100'
            }`}
            title={signal.is_saved ? 'Saved in Vault' : 'Save Signal to Vault'}
          >
            <Bookmark className={`w-3.5 h-3.5 ${signal.is_saved ? 'fill-orange-500 text-orange-500' : ''}`} />
          </button>
        </div>

        {/* Title */}
        <h3 
          onClick={() => onOpenDetail(signal)}
          className="font-bold text-slate-900 dark:text-zinc-100 text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors cursor-pointer leading-snug mb-1.5 line-clamp-2 font-sans"
        >
          {signal.title}
        </h3>

        {/* Concise AI Summary */}
        <p className="text-slate-600 dark:text-zinc-400 text-xs leading-relaxed line-clamp-3 mb-3.5 font-sans">
          {signal.summary}
        </p>
      </div>

      {/* Metrics & Actions Footer */}
      <div>
        <div className="grid grid-cols-2 gap-2 mb-3 pt-2.5 border-t border-slate-200 dark:border-zinc-800 text-xs">
          <div className="flex items-center justify-between px-2.5 py-1 rounded-md bg-slate-50 dark:bg-[#18181b] border border-slate-200 dark:border-zinc-800">
            <span className="text-slate-500 dark:text-zinc-400 text-[11px] font-medium">Importance</span>
            <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded border ${getScoreColor(signal.importance_score)}`}>
              {signal.importance_score}/100
            </span>
          </div>

          <div className="flex items-center justify-between px-2.5 py-1 rounded-md bg-slate-50 dark:bg-[#18181b] border border-slate-200 dark:border-zinc-800">
            <span className="text-slate-500 dark:text-zinc-400 text-[11px] font-medium">Dev Value</span>
            <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded border ${getScoreColor(signal.relevance_score)}`}>
              {signal.relevance_score}/100
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 pt-0.5 text-xs">
          <button
            onClick={() => onOpenDetail(signal)}
            className="flex-1 inline-flex items-center justify-center gap-1.5 bg-slate-50 dark:bg-[#18181b] hover:bg-slate-100 dark:hover:bg-[#1f1f26] text-slate-800 dark:text-zinc-200 px-3 py-1.5 rounded-lg font-bold transition-all border border-slate-200 dark:border-zinc-800 cursor-pointer"
          >
            <Info className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Why It Matters</span>
          </button>

          <a
            href={signal.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 bg-slate-50 dark:bg-[#18181b] hover:bg-slate-100 dark:hover:bg-[#1f1f26] text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100 px-3 py-1.5 rounded-lg font-bold transition-all border border-slate-200 dark:border-zinc-800"
          >
            <span>Source</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </a>
        </div>
      </div>
    </div>
  );
};
export default SignalCard;
