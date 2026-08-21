import React, { useState } from 'react';
import { CommunityTopic } from '../types/clientTypes';
import { Flame, TrendingUp, AlertTriangle, CheckCircle, ExternalLink, ChevronDown, ChevronUp, Clock } from 'lucide-react';

interface TrendCardProps {
  topic: CommunityTopic;
}

export const TrendCard: React.FC<TrendCardProps> = ({ topic }) => {
  const [expanded, setExpanded] = useState<boolean>(false);

  const getVelocityBadge = (velocity: string) => {
    switch (velocity) {
      case 'rising':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'stable':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 hover:shadow-md transition-all">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              ☁ {topic.service}
            </span>
            <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border capitalize flex items-center gap-1 ${getVelocityBadge(topic.velocity)}`}>
              <TrendingUp className="w-3 h-3" />
              {topic.velocity} trend
            </span>
            <span className="text-xs text-slate-400 font-medium">
              {topic.mention_count} discussions
            </span>
          </div>

          <h3 className="text-lg font-bold text-slate-900 leading-snug">
            {topic.name}
          </h3>
        </div>

        <div className="text-center shrink-0 bg-slate-50 border border-slate-100 px-3 py-2 rounded-2xl">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Trend Score</span>
          <span className="text-xl font-extrabold text-blue-600">{topic.trend_score}/100</span>
        </div>
      </div>

      {/* Intro nuance text */}
      <p className="text-xs text-slate-500 italic mb-4">
        "The agent detected an emerging discussion pattern across AWS re:Post and technical blogs."
      </p>

      {/* Common Symptoms */}
      <div className="space-y-2 mb-4">
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
          Common Symptoms Reported
        </h4>
        <ul className="space-y-1.5 text-xs text-slate-600 pl-1">
          {topic.common_symptoms.map((sym, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
              <span>{sym}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Suggested Workarounds */}
      <div className="space-y-2 mb-4 bg-emerald-50/60 border border-emerald-100 rounded-2xl p-4">
        <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
          Suggested Community Solutions
        </h4>
        <ul className="space-y-1.5 text-xs text-emerald-950">
          {topic.suggested_solutions.map((sol, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
              <span>{sol}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Evolution Timeline Accordion */}
      {topic.evolution_timeline && topic.evolution_timeline.length > 0 && (
        <div className="pt-2">
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full flex items-center justify-between text-xs font-bold text-slate-600 hover:text-blue-600 py-1"
          >
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-500" />
              View Topic Evolution Timeline ({topic.evolution_timeline.length} stages)
            </span>
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {expanded && (
            <div className="mt-3 p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              {topic.evolution_timeline.map((evo, idx) => (
                <div key={idx} className="flex items-start gap-3 text-xs">
                  <span className="font-extrabold text-blue-600 w-12 shrink-0">{evo.date}</span>
                  <div className="flex-1">
                    <span className="font-bold text-slate-800 px-2 py-0.5 bg-white border border-slate-200 rounded-md text-[11px] mr-2">
                      {evo.stage}
                    </span>
                    <span className="text-slate-600">{evo.note}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Related Documentation Links */}
      {topic.related_docs && topic.related_docs.length > 0 && (
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-3">
          <span className="text-xs text-slate-400 font-medium">AWS Docs:</span>
          {topic.related_docs.map((doc, idx) => (
            <a
              key={idx}
              href={doc.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
            >
              <span>{doc.title}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          ))}
        </div>
      )}
    </div>
  );
};
