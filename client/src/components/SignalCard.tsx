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
    if (score >= 85) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (score >= 70) return 'text-blue-600 bg-blue-50 border-blue-200';
    return 'text-slate-600 bg-slate-100 border-slate-200';
  };

  const getCategoryTheme = (category: string) => {
    switch (category) {
      case 'Community Discussion':
        return {
          icon: Flame,
          bg: 'bg-gradient-to-br from-purple-500 to-indigo-600',
          badge: 'bg-purple-50 text-purple-700 border-purple-200',
        };
      case 'Architecture Pattern':
        return {
          icon: Layers,
          bg: 'bg-gradient-to-br from-amber-500 to-orange-600',
          badge: 'bg-amber-50 text-amber-700 border-amber-200',
        };
      case 'Security Alert':
        return {
          icon: ShieldAlert,
          bg: 'bg-gradient-to-br from-red-500 to-rose-600',
          badge: 'bg-red-50 text-red-700 border-red-200',
        };
      case 'Tutorial':
        return {
          icon: BookOpen,
          bg: 'bg-gradient-to-br from-emerald-500 to-teal-600',
          badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        };
      default:
        return {
          icon: Radio,
          bg: 'bg-gradient-to-br from-blue-600 to-indigo-600',
          badge: 'bg-blue-50 text-blue-700 border-blue-200',
        };
    }
  };

  const theme = getCategoryTheme(signal.category);
  const CategoryIcon = theme.icon;

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 hover:shadow-xl hover:border-blue-300 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden">
      
      <div>
        {/* Top Header: Huge Category Icon & Source Badges */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            {/* Huge Category Icon Container */}
            <div className={`w-12 h-12 rounded-2xl ${theme.bg} flex items-center justify-center text-white shadow-md shadow-slate-900/10 shrink-0 group-hover:scale-105 transition-transform`}>
              <CategoryIcon className="w-6 h-6" />
            </div>

            <div>
              <span className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border ${theme.badge} inline-block mb-1`}>
                {signal.category}
              </span>
              <div className="flex flex-wrap items-center gap-1">
                {signal.aws_services.slice(0, 2).map((service) => (
                  <span key={service} className="text-[10px] font-semibold text-slate-500 flex items-center gap-0.5">
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
                ? 'bg-amber-50 text-amber-600 border-amber-200 shadow-sm' 
                : 'bg-slate-50 text-slate-400 border-slate-200 hover:text-slate-700 hover:bg-slate-100'
            }`}
            title={signal.is_saved ? 'Saved in Website' : 'Save Signal to Website'}
          >
            <Bookmark className={`w-4 h-4 ${signal.is_saved ? 'fill-amber-500 text-amber-500' : ''}`} />
          </button>
        </div>

        {/* Title */}
        <h3 
          onClick={() => onOpenDetail(signal)}
          className="font-extrabold text-slate-900 text-base sm:text-lg group-hover:text-blue-600 transition-colors cursor-pointer leading-snug mb-2 line-clamp-2 font-rounded"
        >
          {signal.title}
        </h3>

        {/* Concise AI Summary */}
        <p className="text-slate-600 text-xs sm:text-sm leading-relaxed line-clamp-3 mb-4 font-normal">
          {signal.summary}
        </p>
      </div>

      {/* Metrics & Actions Footer */}
      <div>
        <div className="grid grid-cols-2 gap-2 mb-4 pt-3 border-t border-slate-100">
          <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-slate-500 text-xs font-semibold">Importance</span>
            <span className={`text-xs font-extrabold px-2 py-0.5 rounded-md border ${getScoreColor(signal.importance_score)}`}>
              {signal.importance_score}
            </span>
          </div>

          <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-slate-500 text-xs font-semibold">Dev Value</span>
            <span className={`text-xs font-extrabold px-2 py-0.5 rounded-md border ${getScoreColor(signal.relevance_score)}`}>
              {signal.relevance_score}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 pt-1">
          <button
            onClick={() => onOpenDetail(signal)}
            className="flex-1 inline-flex items-center justify-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all border border-blue-100"
          >
            <Info className="w-4 h-4 text-blue-600" />
            <span>Why It Matters</span>
          </button>

          <a
            href={signal.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all border border-slate-200"
          >
            <span>Source</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </a>
        </div>
      </div>
    </div>
  );
};
