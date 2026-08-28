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
    if (score >= 70) return 'text-[#AD5CFF] bg-[#AD5CFF]/10 border-[#AD5CFF]/30';
    return 'text-zinc-400 bg-zinc-800 border-zinc-700';
  };

  const getCategoryTheme = (category: string) => {
    switch (category) {
      case 'Community Discussion':
        return {
          icon: Flame,
          badge: 'bg-[#AD5CFF]/15 text-[#d8b4fe] border-[#AD5CFF]/30',
          iconBg: 'bg-[#AD5CFF]/15 text-[#AD5CFF] border border-[#AD5CFF]/30',
        };
      case 'Architecture Pattern':
        return {
          icon: Layers,
          badge: 'bg-[#ffc080]/15 text-[#ffc080] border-[#ffc080]/30',
          iconBg: 'bg-[#ffc080]/15 text-[#ffc080] border border-[#ffc080]/30',
        };
      case 'Security Alert':
        return {
          icon: ShieldAlert,
          badge: 'bg-red-500/15 text-red-300 border-red-500/30',
          iconBg: 'bg-red-500/15 text-red-400 border border-red-500/30',
        };
      case 'Tutorial':
        return {
          icon: BookOpen,
          badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
          iconBg: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
        };
      default:
        return {
          icon: Radio,
          badge: 'bg-[#AD5CFF]/15 text-[#d8b4fe] border-[#AD5CFF]/30',
          iconBg: 'bg-[#AD5CFF]/15 text-[#AD5CFF] border border-[#AD5CFF]/30',
        };
    }
  };

  const theme = getCategoryTheme(signal.category);
  const CategoryIcon = theme.icon;

  return (
    <div className="bg-[#121216] border border-[#27272a] rounded-3xl p-5 sm:p-6 hover:border-[#AD5CFF]/40 hover:shadow-purple-glow transition-all duration-300 flex flex-col justify-between group relative overflow-hidden font-mono text-zinc-100">
      
      <div>
        {/* Header Badges */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            {/* Category Icon Container */}
            <div className={`w-10 h-10 rounded-2xl ${theme.iconBg} flex items-center justify-center shrink-0`}>
              <CategoryIcon className="w-5 h-5" />
            </div>

            <div>
              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${theme.badge} inline-block mb-1 uppercase tracking-wider`}>
                {signal.category}
              </span>
              <div className="flex flex-wrap items-center gap-1.5">
                {signal.aws_services.slice(0, 2).map((service) => (
                  <span key={service} className="text-[10px] font-semibold text-zinc-400 bg-[#18181b] px-2 py-0.5 rounded-md border border-[#27272a]">
                    {service}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Bookmark Button */}
          <button
            onClick={() => onToggleSave && onToggleSave(signal.signal_id)}
            className={`p-2.5 rounded-xl transition-all border ${
              signal.is_saved 
                ? 'bg-[#fe6e00]/20 text-[#ffc080] border-[#fe6e00]/50 shadow-sm' 
                : 'bg-[#18181b] text-zinc-500 border-[#27272a] hover:text-white hover:border-[#AD5CFF]/40'
            }`}
            title={signal.is_saved ? 'Saved in Vault' : 'Save Signal to Vault'}
          >
            <Bookmark className={`w-4 h-4 ${signal.is_saved ? 'fill-[#fe6e00] text-[#fe6e00]' : ''}`} />
          </button>
        </div>

        {/* Title */}
        <h3 
          onClick={() => onOpenDetail(signal)}
          className="font-bold text-white text-sm sm:text-base group-hover:text-[#AD5CFF] transition-colors cursor-pointer leading-snug mb-2 line-clamp-2"
        >
          {signal.title}
        </h3>

        {/* Concise AI Summary */}
        <p className="text-zinc-400 text-xs leading-relaxed line-clamp-3 mb-4 font-sans">
          {signal.summary}
        </p>
      </div>

      {/* Metrics & Actions Footer */}
      <div>
        <div className="grid grid-cols-2 gap-2 mb-4 pt-3 border-t border-[#27272a]">
          <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-[#09090b] border border-[#27272a]">
            <span className="text-zinc-500 text-[11px] font-medium">Importance</span>
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${getScoreColor(signal.importance_score)}`}>
              {signal.importance_score}/100
            </span>
          </div>

          <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-[#09090b] border border-[#27272a]">
            <span className="text-zinc-500 text-[11px] font-medium">Dev Value</span>
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${getScoreColor(signal.relevance_score)}`}>
              {signal.relevance_score}/100
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 pt-1 text-xs">
          <button
            onClick={() => onOpenDetail(signal)}
            className="flex-1 inline-flex items-center justify-center gap-1.5 bg-[#AD5CFF]/15 hover:bg-[#AD5CFF]/25 text-[#d8b4fe] px-3.5 py-2 rounded-xl font-bold transition-all border border-[#AD5CFF]/30 cursor-pointer"
          >
            <Info className="w-3.5 h-3.5 text-[#AD5CFF]" />
            <span>Why It Matters</span>
          </button>

          <a
            href={signal.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 bg-[#18181b] hover:bg-[#27272a] text-zinc-300 hover:text-white px-3.5 py-2 rounded-xl font-bold transition-all border border-[#27272a]"
          >
            <span>Source</span>
            <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
          </a>
        </div>
      </div>
    </div>
  );
};
export default SignalCard;
