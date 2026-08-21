import React from 'react';
import { AWSSignal } from '../types/clientTypes';
import { ExternalLink, Info, Bookmark, Sparkles, ShieldAlert, Cpu } from 'lucide-react';

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

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'Community Discussion':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Architecture Pattern':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Security Alert':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'Tutorial':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default:
        return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-lg hover:border-blue-200 transition-all duration-200 flex flex-col justify-between group">
      <div>
        {/* Header Badges & Source */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${getCategoryBadge(signal.category)}`}>
              {signal.category}
            </span>
            {signal.aws_services.map((service) => (
              <span key={service} className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1">
                <Cpu className="w-3 h-3 text-slate-400" />
                {service}
              </span>
            ))}
          </div>

          <button
            onClick={() => onToggleSave && onToggleSave(signal.signal_id)}
            className={`p-1.5 rounded-lg transition-colors ${
              signal.is_saved ? 'text-blue-600 bg-blue-50' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
            }`}
            title={signal.is_saved ? 'Saved' : 'Save Signal'}
          >
            <Bookmark className={`w-4 h-4 ${signal.is_saved ? 'fill-blue-600' : ''}`} />
          </button>
        </div>

        {/* Title */}
        <h3 
          onClick={() => onOpenDetail(signal)}
          className="font-bold text-slate-900 text-base group-hover:text-blue-600 transition-colors cursor-pointer leading-snug mb-2 line-clamp-2"
        >
          {signal.title}
        </h3>

        {/* Concise AI Summary */}
        <p className="text-slate-600 text-xs md:text-sm leading-relaxed line-clamp-3 mb-4">
          {signal.summary}
        </p>
      </div>

      {/* Metrics & Actions Footer */}
      <div>
        <div className="grid grid-cols-2 gap-2 mb-4 pt-3 border-t border-slate-100">
          <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-slate-500 text-xs">Importance</span>
            <span className={`text-xs font-extrabold px-2 py-0.5 rounded-md border ${getScoreColor(signal.importance_score)}`}>
              {signal.importance_score}
            </span>
          </div>

          <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-slate-500 text-xs">Dev Value</span>
            <span className={`text-xs font-extrabold px-2 py-0.5 rounded-md border ${getScoreColor(signal.relevance_score)}`}>
              {signal.relevance_score}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 pt-1">
          <button
            onClick={() => onOpenDetail(signal)}
            className="flex-1 inline-flex items-center justify-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 rounded-xl text-xs font-bold transition-all"
          >
            <Info className="w-3.5 h-3.5" />
            <span>Why It Matters</span>
          </button>

          <a
            href={signal.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-xl text-xs font-semibold transition-all"
          >
            <span>Read Source</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>
        </div>
      </div>
    </div>
  );
};
