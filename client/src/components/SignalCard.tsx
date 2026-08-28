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
    if (score >= 70) return 'text-primary bg-primary/10 border-primary/30';
    return 'text-on-surface-variant bg-surface-low border-outline';
  };

  const getCategoryTheme = (category: string) => {
    switch (category) {
      case 'Community Discussion':
        return {
          icon: Flame,
          badge: 'bg-primary/10 text-primary border-primary/20',
          iconBg: 'bg-primary/10 text-primary border border-primary/20',
        };
      case 'Architecture Pattern':
        return {
          icon: Layers,
          badge: 'bg-secondary/10 text-[#fe9800] border-secondary/30',
          iconBg: 'bg-secondary/10 text-[#fe9800] border border-secondary/30',
        };
      case 'Security Alert':
        return {
          icon: ShieldAlert,
          badge: 'bg-red-500/10 text-red-500 border-red-500/20',
          iconBg: 'bg-red-500/10 text-red-500 border border-red-500/20',
        };
      case 'Tutorial':
        return {
          icon: BookOpen,
          badge: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
          iconBg: 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20',
        };
      default:
        return {
          icon: Radio,
          badge: 'bg-primary/10 text-primary border-primary/20',
          iconBg: 'bg-primary/10 text-primary border border-primary/20',
        };
    }
  };

  const theme = getCategoryTheme(signal.category);
  const CategoryIcon = theme.icon;

  return (
    <div className="bg-surface border border-outline rounded-xl p-5 hover:border-primary/40 transition-all flex flex-col justify-between group relative font-mono text-on-background shadow-sm">
      
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
                  <span key={service} className="text-[10px] font-semibold text-on-surface-variant bg-surface-low px-1.5 py-0.5 rounded border border-outline">
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
                ? 'bg-[#fe6e00]/10 text-[#fe6e00] border-[#fe6e00]/40' 
                : 'bg-surface-low text-on-surface-variant border-outline hover:text-on-background hover:border-primary/40'
            }`}
            title={signal.is_saved ? 'Saved in Vault' : 'Save Signal to Vault'}
          >
            <Bookmark className={`w-3.5 h-3.5 ${signal.is_saved ? 'fill-[#fe6e00] text-[#fe6e00]' : ''}`} />
          </button>
        </div>

        {/* Title */}
        <h3 
          onClick={() => onOpenDetail(signal)}
          className="font-bold text-on-background text-sm group-hover:text-primary transition-colors cursor-pointer leading-snug mb-1.5 line-clamp-2 font-sans"
        >
          {signal.title}
        </h3>

        {/* Concise AI Summary */}
        <p className="text-on-surface-variant text-xs leading-relaxed line-clamp-3 mb-3.5 font-sans">
          {signal.summary}
        </p>
      </div>

      {/* Metrics & Actions Footer */}
      <div>
        <div className="grid grid-cols-2 gap-2 mb-3 pt-2.5 border-t border-outline text-xs">
          <div className="flex items-center justify-between px-2.5 py-1 rounded-md bg-surface-low border border-outline">
            <span className="text-on-surface-variant text-[11px] font-medium">Importance</span>
            <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded border ${getScoreColor(signal.importance_score)}`}>
              {signal.importance_score}/100
            </span>
          </div>

          <div className="flex items-center justify-between px-2.5 py-1 rounded-md bg-surface-low border border-outline">
            <span className="text-on-surface-variant text-[11px] font-medium">Dev Value</span>
            <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded border ${getScoreColor(signal.relevance_score)}`}>
              {signal.relevance_score}/100
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 pt-0.5 text-xs">
          <button
            onClick={() => onOpenDetail(signal)}
            className="flex-1 inline-flex items-center justify-center gap-1.5 bg-surface-low hover:bg-surface-container text-on-background px-3 py-1.5 rounded-lg font-bold transition-all border border-outline cursor-pointer"
          >
            <Info className="w-3.5 h-3.5 text-primary" />
            <span>Why It Matters</span>
          </button>

          <a
            href={signal.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 bg-surface-low hover:bg-surface-container text-on-surface-variant hover:text-on-background px-3 py-1.5 rounded-lg font-bold transition-all border border-outline"
          >
            <span>Source</span>
            <ExternalLink className="w-3.5 h-3.5 text-on-surface-variant" />
          </a>
        </div>
      </div>
    </div>
  );
};
export default SignalCard;
