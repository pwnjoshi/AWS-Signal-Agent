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
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                {signal.category}
              </span>
              {signal.aws_services.map(s => (
                <span key={s} className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                  {s}
                </span>
              ))}
              <span className="text-xs text-slate-400">
                Discovered {new Date(signal.discovered_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight">
              {signal.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* AI Scores Banner */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-4 mb-6 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div>
            <span className="text-[11px] text-slate-500 font-semibold block uppercase">Overall Signal</span>
            <span className="text-xl font-extrabold text-blue-600">{signal.signal_score}</span>
          </div>
          <div>
            <span className="text-[11px] text-slate-500 font-semibold block uppercase">Importance</span>
            <span className="text-xl font-extrabold text-slate-800">{signal.importance_score}</span>
          </div>
          <div>
            <span className="text-[11px] text-slate-500 font-semibold block uppercase">Dev Value</span>
            <span className="text-xl font-extrabold text-slate-800">{signal.relevance_score}</span>
          </div>
          <div>
            <span className="text-[11px] text-slate-500 font-semibold block uppercase">Novelty</span>
            <span className="text-xl font-extrabold text-slate-800">{signal.novelty_score}</span>
          </div>
        </div>

        {/* Structured Sections */}
        <div className="space-y-6 text-sm text-slate-700">
          
          {/* Section 1: What Happened */}
          <div>
            <h3 className="font-bold text-slate-900 text-base mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              What Happened?
            </h3>
            <p className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-slate-700 leading-relaxed">
              {signal.why_it_matters.what_happened}
            </p>
          </div>

          {/* Section 2: Why Does It Matter */}
          <div>
            <h3 className="font-bold text-slate-900 text-base mb-2 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              Why Does It Matter?
            </h3>
            <p className="bg-amber-50/60 border border-amber-100 rounded-2xl p-4 text-slate-800 leading-relaxed">
              {signal.why_it_matters.why_it_matters}
            </p>
          </div>

          {/* Section 3: Who Should Care */}
          <div>
            <h3 className="font-bold text-slate-900 text-base mb-2 flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-600" />
              Who Should Care?
            </h3>
            <div className="flex flex-wrap gap-2">
              {signal.why_it_matters.who_should_care.map(persona => (
                <span key={persona} className="px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 font-semibold text-xs border border-indigo-100">
                  {persona}
                </span>
              ))}
            </div>
          </div>

          {/* Section 4: What Are People Saying */}
          <div>
            <h3 className="font-bold text-slate-900 text-base mb-2 flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-purple-600" />
              Community Reaction
            </h3>
            <p className="bg-purple-50/60 border border-purple-100 rounded-2xl p-4 text-purple-950 leading-relaxed">
              {signal.why_it_matters.community_reaction}
            </p>
          </div>

          {/* Section 5: What Should I Do */}
          <div>
            <h3 className="font-bold text-slate-900 text-base mb-2 flex items-center gap-2 text-emerald-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Recommended Next Step
            </h3>
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-emerald-950">
              {signal.why_it_matters.recommended_action}
            </div>
          </div>
        </div>

        {/* Footer Link */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Source: <strong className="text-slate-600">{signal.source}</strong>
          </span>

          <a
            href={signal.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all"
          >
            <span>Read Original Source</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

      </div>
    </div>
  );
};
