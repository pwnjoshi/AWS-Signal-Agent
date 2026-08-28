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
    if (score >= 70) return 'text-[#ad5cff] bg-[#ad5cff]/10 border-[#ad5cff]/30';
    return 'text-zinc-400 bg-zinc-800 border-zinc-700';
  };

  const getCategoryTheme = (category: string) => {
    switch (category) {
      case 'Community Discussion':
        return {
          icon: Flame,
          bg: 'bg-gradient-to-br from-[#ac4bff] to-[#625fff]',
          badge: 'bg-[#ac4bff]/10 text-[#e9d5ff] border-[#ac4bff]/30',
        };
      case 'Architecture Pattern':
        return {
          icon: Layers,
          bg: 'bg-gradient-to-br from-[#fe6e00] to-[#f59e0b]',
          badge: 'bg-[#fe6e00]/10 text-[#ffc080] border-[#fe6e00]/30',
        };
      case 'Security Alert':
        return {
          icon: ShieldAlert,
          bg: 'bg-gradient-to-br from-[#fb2c36] to-[#e70044]',
          badge: 'bg-[#fb2c36]/10 text-[#ff6568] border-[#fb2c36]/30',
        };
      case 'Tutorial':
        return {
          icon: BookOpen,
          bg: 'bg-gradient-to-br from-[#00d294] to-[#00baa7]',
          badge: 'bg-[#00d294]/10 text-[#5ee9b5] border-[#00d294]/30',
        };
      default:
        return {
          icon: Radio,
          bg: 'bg-gradient-to-br from-[#ad5cff] via-[#8d36eb] to-[#fe6e00]',
          badge: 'bg-[#ad5cff]/10 text-[#d8b4fe] border-[#ad5cff]/30',
        };
    }
  };

  const theme = getCategoryTheme(signal.category);
  const CategoryIcon = theme.icon;

  return (
    <div className="bg-[#121216]/90 backdrop-blur-md rounded-3xl border border-[#ad5cff]/20 p-5 sm:p-6 hover:shadow-2xl hover:shadow-[#ad5cff]/15 hover:border-[#fe6e00]/50 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden text-zinc-100 font-sans">
      
      <div>
        {/* Top Header: Huge Category Icon & Source Badges */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            {/* Huge Category Icon Container */}
            <div className={`w-12 h-12 rounded-2xl ${theme.bg} flex items-center justify-center text-white shadow-lg shadow-[#ad5cff]/20 shrink-0 group-hover:scale-105 transition-transform`}>
              <CategoryIcon className="w-6 h-6" />
            </div>

            <div>
              <span className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border ${theme.badge} inline-block mb-1`}>
                {signal.category}
              </span>
              <div className="flex flex-wrap items-center gap-1">
                {signal.aws_services.slice(0, 2).map((service) => (
                  <span key={service} className="text-[10px] font-semibold text-zinc-400 flex items-center gap-0.5 bg-zinc-900/90 px-2 py-0.5 rounded-md border border-zinc-800">
                    <Cpu className="w-2.5 h-2.5 text-zinc-400" />
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
                ? 'bg-[#fe6e00]/20 text-[#ffc080] border-[#fe6e00]/50 shadow-sm' 
                : 'bg-zinc-900/80 text-zinc-400 border-zinc-800 hover:text-zinc-200 hover:bg-zinc-800'
            }`}
            title={signal.is_saved ? 'Saved in Vault' : 'Save Signal to Vault'}
          >
            <Bookmark className={`w-4 h-4 ${signal.is_saved ? 'fill-[#fe6e00] text-[#fe6e00]' : ''}`} />
          </button>
        </div>

        {/* Title */}
        <h3 
          onClick={() => onOpenDetail(signal)}
          className="font-extrabold text-white text-base sm:text-lg group-hover:text-[#ad5cff] transition-colors cursor-pointer leading-snug mb-2 line-clamp-2"
        >
          {signal.title}
        </h3>

        {/* Concise AI Summary */}
        <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed line-clamp-3 mb-4 font-normal">
          {signal.summary}
        </p>
      </div>

      {/* Metrics & Actions Footer */}
      <div>
        <div className="grid grid-cols-2 gap-2 mb-4 pt-3 border-t border-zinc-800/80">
          <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-zinc-950/70 border border-zinc-800">
            <span className="text-zinc-500 text-xs font-semibold">Importance</span>
            <span className={`text-xs font-extrabold px-2 py-0.5 rounded-md border ${getScoreColor(signal.importance_score)}`}>
              {signal.importance_score}
            </span>
          </div>

          <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-zinc-950/70 border border-zinc-800">
            <span className="text-zinc-500 text-xs font-semibold">Dev Value</span>
            <span className={`text-xs font-extrabold px-2 py-0.5 rounded-md border ${getScoreColor(signal.relevance_score)}`}>
              {signal.relevance_score}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 pt-1">
          <button
            onClick={() => onOpenDetail(signal)}
            className="flex-1 inline-flex items-center justify-center gap-1.5 bg-[#ad5cff]/15 hover:bg-[#ad5cff]/25 text-[#d8b4fe] px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all border border-[#ad5cff]/30"
          >
            <Info className="w-4 h-4 text-[#ad5cff]" />
            <span>Why It Matters</span>
          </button>

          <a
            href={signal.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all border border-zinc-800"
          >
            <span>Source</span>
            <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
          </a>
        </div>
      </div>
    </div>
  );
};
