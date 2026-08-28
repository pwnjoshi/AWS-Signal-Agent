import React from 'react';
import { AWSSignal } from '../types/clientTypes';
import { X, ExternalLink, Sparkles, CheckCircle2, Users, MessageCircle, Lightbulb } from 'lucide-react';

interface SignalDetailModalProps {
  signal: AWSSignal | null;
  onClose: () => void;
}

export const SignalDetailModal: React.FC<SignalDetailModalProps> = ({ signal, onClose }) => {
  if (!signal) return null;

  return (
    <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto font-sans text-on-background">
      <div className="bg-surface rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-outline p-6 animate-in fade-in zoom-in-95 duration-150 font-mono">
        
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-4 pb-4 border-b border-outline">
          <div>
            <div className="flex flex-wrap items-center gap-1.5 mb-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-surface-low text-primary border border-outline uppercase">
                {signal.category}
              </span>
              {signal.aws_services.map(s => (
                <span key={s} className="text-xs font-semibold px-2 py-0.5 rounded-md bg-surface-low text-on-surface-variant border border-outline">
                  {s}
                </span>
              ))}
              <span className="text-xs text-on-surface-variant font-mono">
                Discovered {new Date(signal.discovered_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-on-background leading-tight font-sans">
              {signal.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-on-surface-variant hover:text-on-background hover:bg-surface-container rounded-lg transition-all border border-outline cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* AI Scores Banner */}
        <div className="bg-surface-low border border-outline rounded-lg p-3.5 mb-5 grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
          <div>
            <span className="text-[10px] text-on-surface-variant font-bold block uppercase tracking-wider">Overall Signal</span>
            <span className="text-lg font-black text-primary">{signal.signal_score}</span>
          </div>
          <div>
            <span className="text-[10px] text-on-surface-variant font-bold block uppercase tracking-wider">Importance</span>
            <span className="text-lg font-black text-on-background">{signal.importance_score}</span>
          </div>
          <div>
            <span className="text-[10px] text-on-surface-variant font-bold block uppercase tracking-wider">Dev Value</span>
            <span className="text-lg font-black text-on-background">{signal.relevance_score}</span>
          </div>
          <div>
            <span className="text-[10px] text-on-surface-variant font-bold block uppercase tracking-wider">Novelty</span>
            <span className="text-lg font-black text-on-background">{signal.novelty_score}</span>
          </div>
        </div>

        {/* Structured Sections */}
        <div className="space-y-4 text-xs text-on-surface-variant font-mono">
          
          {/* Section 1: What Happened */}
          <div>
            <h3 className="font-bold text-on-background text-xs mb-1.5 flex items-center gap-1.5 uppercase tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              What Happened?
            </h3>
            <p className="bg-surface-low border border-outline rounded-lg p-3 text-on-background leading-relaxed font-sans">
              {signal.why_it_matters.what_happened}
            </p>
          </div>

          {/* Section 2: Why Does It Matter */}
          <div>
            <h3 className="font-bold text-on-background text-xs mb-1.5 flex items-center gap-1.5 uppercase tracking-wide">
              <Lightbulb className="w-3.5 h-3.5 text-[#fe9800]" />
              Why Does It Matter?
            </h3>
            <p className="bg-surface-low border border-outline rounded-lg p-3 text-on-background leading-relaxed font-sans">
              {signal.why_it_matters.why_it_matters}
            </p>
          </div>

          {/* Section 3: Who Should Care */}
          <div>
            <h3 className="font-bold text-on-background text-xs mb-1.5 flex items-center gap-1.5 uppercase tracking-wide">
              <Users className="w-3.5 h-3.5 text-primary" />
              Who Should Care?
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {signal.why_it_matters.who_should_care.map(persona => (
                <span key={persona} className="px-2.5 py-0.5 rounded-md bg-surface-low text-primary font-bold text-xs border border-outline">
                  {persona}
                </span>
              ))}
            </div>
          </div>

          {/* Section 4: Community Reaction */}
          <div>
            <h3 className="font-bold text-on-background text-xs mb-1.5 flex items-center gap-1.5 uppercase tracking-wide">
              <MessageCircle className="w-3.5 h-3.5 text-[#fe9800]" />
              Community Reaction
            </h3>
            <p className="bg-surface-low border border-outline rounded-lg p-3 text-on-background leading-relaxed font-sans">
              {signal.why_it_matters.community_reaction}
            </p>
          </div>

          {/* Section 5: What Should I Do */}
          <div>
            <h3 className="font-bold text-[#00d294] text-xs mb-1.5 flex items-center gap-1.5 uppercase tracking-wide">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#00d294]" />
              Recommended Next Step
            </h3>
            <div className="bg-surface-low border border-[#00d294]/30 rounded-lg p-3 text-on-background font-sans">
              {signal.why_it_matters.recommended_action}
            </div>
          </div>
        </div>

        {/* Footer Link */}
        <div className="mt-6 pt-4 border-t border-outline flex items-center justify-between font-mono">
          <span className="text-xs text-on-surface-variant">
            Source: <strong className="text-on-background">{signal.source}</strong>
          </span>

          <a
            href={signal.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 bg-primary hover:bg-primary-container text-white px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wide shadow-sm transition-all"
          >
            <span>Read Source</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

      </div>
    </div>
  );
};
export default SignalDetailModal;
