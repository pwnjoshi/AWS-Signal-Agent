import React from 'react';
import { AWSSignal } from '../types/clientTypes';
import { X, ExternalLink, Sparkles, CheckCircle2, Users, MessageCircle, AlertTriangle, Lightbulb } from 'lucide-react';

interface SignalDetailModalProps {
  signal: AWSSignal | null;
  onClose: () => void;
}

export const SignalDetailModal: React.FC<SignalDetailModalProps> = ({ signal, onClose }) => {
  if (!signal) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto font-mono text-on-background">
      <div className="bg-surface rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-outline p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-4 pb-4 border-b border-outline">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-xs font-bold px-3 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/30 uppercase">
                {signal.category}
              </span>
              {signal.aws_services.map(s => (
                <span key={s} className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-surface-low text-on-surface-variant border border-outline">
                  {s}
                </span>
              ))}
              <span className="text-xs text-on-surface-variant font-mono">
                Discovered {new Date(signal.discovered_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-on-background leading-tight font-sans">
              {signal.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-on-surface-variant hover:text-on-background hover:bg-surface-container rounded-full transition-all border border-outline cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* AI Scores Banner */}
        <div className="bg-surface-low border border-outline rounded-2xl p-4 mb-6 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div>
            <span className="text-[10px] text-on-surface-variant font-bold block uppercase tracking-wider">Overall Signal</span>
            <span className="text-xl font-black text-primary">{signal.signal_score}</span>
          </div>
          <div>
            <span className="text-[10px] text-on-surface-variant font-bold block uppercase tracking-wider">Importance</span>
            <span className="text-xl font-black text-on-background">{signal.importance_score}</span>
          </div>
          <div>
            <span className="text-[10px] text-on-surface-variant font-bold block uppercase tracking-wider">Dev Value</span>
            <span className="text-xl font-black text-on-background">{signal.relevance_score}</span>
          </div>
          <div>
            <span className="text-[10px] text-on-surface-variant font-bold block uppercase tracking-wider">Novelty</span>
            <span className="text-xl font-black text-on-background">{signal.novelty_score}</span>
          </div>
        </div>

        {/* Structured Sections */}
        <div className="space-y-6 text-xs sm:text-sm text-on-surface-variant font-mono">
          
          {/* Section 1: What Happened */}
          <div>
            <h3 className="font-bold text-on-background text-sm mb-2 flex items-center gap-2 uppercase tracking-wide">
              <Sparkles className="w-4 h-4 text-primary" />
              What Happened?
            </h3>
            <p className="bg-surface-low border border-outline rounded-2xl p-4 text-on-background leading-relaxed font-sans">
              {signal.why_it_matters.what_happened}
            </p>
          </div>

          {/* Section 2: Why Does It Matter */}
          <div>
            <h3 className="font-bold text-on-background text-sm mb-2 flex items-center gap-2 uppercase tracking-wide">
              <Lightbulb className="w-4 h-4 text-[#fe9800] dark:text-secondary" />
              Why Does It Matter?
            </h3>
            <p className="bg-surface-low border border-secondary/30 rounded-2xl p-4 text-on-background leading-relaxed font-sans">
              {signal.why_it_matters.why_it_matters}
            </p>
          </div>

          {/* Section 3: Who Should Care */}
          <div>
            <h3 className="font-bold text-on-background text-sm mb-2 flex items-center gap-2 uppercase tracking-wide">
              <Users className="w-4 h-4 text-primary" />
              Who Should Care?
            </h3>
            <div className="flex flex-wrap gap-2">
              {signal.why_it_matters.who_should_care.map(persona => (
                <span key={persona} className="px-3 py-1 rounded-xl bg-surface-low text-primary font-bold text-xs border border-primary/30">
                  {persona}
                </span>
              ))}
            </div>
          </div>

          {/* Section 4: What Are People Saying */}
          <div>
            <h3 className="font-bold text-on-background text-sm mb-2 flex items-center gap-2 uppercase tracking-wide">
              <MessageCircle className="w-4 h-4 text-[#fe9800] dark:text-secondary" />
              Community Reaction
            </h3>
            <p className="bg-surface-low border border-outline rounded-2xl p-4 text-on-background leading-relaxed font-sans">
              {signal.why_it_matters.community_reaction}
            </p>
          </div>

          {/* Section 5: What Should I Do */}
          <div>
            <h3 className="font-bold text-[#00d294] text-sm mb-2 flex items-center gap-2 uppercase tracking-wide">
              <CheckCircle2 className="w-4 h-4 text-[#00d294]" />
              Recommended Next Step
            </h3>
            <div className="bg-surface-low border border-[#00d294]/30 rounded-2xl p-4 text-on-background font-sans">
              {signal.why_it_matters.recommended_action}
            </div>
          </div>
        </div>

        {/* Footer Link */}
        <div className="mt-8 pt-6 border-t border-outline flex items-center justify-between">
          <span className="text-xs text-on-surface-variant font-mono">
            Source: <strong className="text-on-background">{signal.source}</strong>
          </span>

          <a
            href={signal.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 btn-geu-primary text-white px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-purple-glow transition-all"
          >
            <span>Read Original Source</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

      </div>
    </div>
  );
};
export default SignalDetailModal;
