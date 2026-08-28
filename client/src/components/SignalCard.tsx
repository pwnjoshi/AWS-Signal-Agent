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
    if (score >= 85) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    if (score >= 70) return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
    return 'text-slate-400 bg-slate-800 border-slate-700';
  };

  const getCategoryTheme = (category: string) => {
    switch (category) {
      case 'Community Discussion':
        return {
          icon: Flame,
          bg: 'bg-gradient-to-br from-purple-500 to-indigo-600',
          badge: 'bg-purple-500/10 text-purple-300 border-purple-500/30',
        };
      case 'Architecture Pattern':
        return {
          icon: Layers,
          bg: 'bg-gradient-to-br from-amber-500 to-orange-600',
          badge: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
        };
      case 'Security Alert':
        return {
          icon: ShieldAlert,
          bg: 'bg-gradient-to-br from-red-500 to-rose-600',
          badge: 'bg-red-500/10 text-red-300 border-red-500/30',
        };
      case 'Tutorial':
        return {
          icon: BookOpen,
          bg: 'bg-gradient-to-br from-emerald-500 to-teal-600',
          badge: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
        };
      default:
        return {
          icon: Radio,
          bg: 'bg-gradient-to-br from-blue-600 to-indigo-600',
          badge: 'bg-blue-500/10 text-blue-300 border-blue-500/30',
        };
    }
  };

  const theme = getCategoryTheme(signal.category);
  const CategoryIcon = theme.icon;

  return (
    <div className="bg-slate-900/80 backdrop-blur-md rounded-3xl border border-slate-800 p-5 sm:p-6 hover:shadow-2xl hover:shadow-blue-500/10 hover:border-blue-500/40 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden text-slate-100">
      
      <div>
        {/* Top Header: Huge Category Icon & Source Badges */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            {/* Huge Category Icon Container */}
            <div className={`w-12 h-12 rounded-2xl ${theme.bg} flex items-center justify-center text-white shadow-lg shadow-slate-950/40 shrink-0 group-hover:scale-105 transition-transform`}>
              <CategoryIcon className="w-6 h-6" />
            </div>

            <div>
              <span className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border ${theme.badge} inline-block mb-1`}>
                {signal.category}
              </span>
              <div className="flex flex-wrap items-center gap-1">
                {signal.aws_services.slice(0, 2).map((service) => (
                  <span key={service} className="text-[10px] font-semibold text-slate-400 flex items-center gap-0.5 bg-slate-800/80 px-2 py-0.5 rounded-md border border-slate-700/60">
                    <Cpu className="w-2.5 h-2.5 text-slate-400" />
                    {service}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Prominent Save / Bookmark Button */}
          <button
            onClick={() => onToggleSave && onToggleSave(signal.signal_id)}
            className={`p-2.5 rounded-2xl transition-all border ${
              signal.is_saved 
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm' 
                : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-slate-200 hover:bg-slate-800'
            }`}
            title={signal.is_saved ? 'Saved in Vault' : 'Save Signal to Vault'}
          >
            <Bookmark className={`w-4 h-4 ${signal.is_saved ? 'fill-amber-400 text-amber-400' : ''}`} />
          </button>
        </div>

        {/* Title */}
        <h3 
          onClick={() => onOpenDetail(signal)}
          className="font-extrabold text-white text-base sm:text-lg group-hover:text-blue-400 transition-colors cursor-pointer leading-snug mb-2 line-clamp-2 font-rounded"
        >
          {signal.title}
        </h3>

        {/* Concise AI Summary */}
        <p className="text-slate-400 text-xs sm:text-sm leading-relaxed line-clamp-3 mb-4 font-normal">
          {signal.summary}
        </p>
      </div>

      {/* Metrics & Actions Footer */}
      <div>
        <div className="grid grid-cols-2 gap-2 mb-4 pt-3 border-t border-slate-800">
          <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-slate-500 text-xs font-semibold">Importance</span>
            <span className={`text-xs font-extrabold px-2 py-0.5 rounded-md border ${getScoreColor(signal.importance_score)}`}>
              {signal.importance_score}
            </span>
          </div>

          <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-slate-500 text-xs font-semibold">Dev Value</span>
            <span className={`text-xs font-extrabold px-2 py-0.5 rounded-md border ${getScoreColor(signal.relevance_score)}`}>
              {signal.relevance_score}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 pt-1">
          <button
            onClick={() => onOpenDetail(signal)}
            className="flex-1 inline-flex items-center justify-center gap-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all border border-blue-500/30"
          >
            <Info className="w-4 h-4 text-blue-400" />
            <span>Why It Matters</span>
          </button>

          <a
            href={signal.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all border border-slate-700"
          >
            <span>Source</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </a>
        </div>
      </div>
    </div>
  );
};
