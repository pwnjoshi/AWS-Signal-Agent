import React, { useState } from 'react';
import { CommunityTopic } from '../types/clientTypes';
import { TrendingUp, AlertTriangle, CheckCircle, ExternalLink, ChevronDown, ChevronUp, Clock, Cloud } from 'lucide-react';

interface TrendCardProps {
  topic: CommunityTopic;
}

export const TrendCard: React.FC<TrendCardProps> = ({ topic }) => {
  const [expanded, setExpanded] = useState<boolean>(false);

  const getVelocityBadge = (velocity: string) => {
    switch (velocity) {
      case 'rising':
        return 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800';
      case 'stable':
        return 'bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-800';
      default:
        return 'bg-slate-50 dark:bg-[#18181b] text-slate-600 dark:text-zinc-400 border-slate-200 dark:border-zinc-700';
    }
  };

  return (
    <div className="bg-white dark:bg-[#121216] rounded-xl border border-slate-200 dark:border-zinc-800 p-5 hover:border-blue-400 dark:hover:border-blue-600 transition-all font-mono text-slate-900 dark:text-zinc-100 shadow-sm">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-50 dark:bg-[#18181b] text-blue-600 dark:text-blue-400 border border-slate-200 dark:border-zinc-700 uppercase flex items-center gap-1">
              <Cloud className="w-3 h-3" />
              <span>{topic.service}</span>
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border capitalize flex items-center gap-1 ${getVelocityBadge(topic.velocity)}`}>
              <TrendingUp className="w-3 h-3" />
              {topic.velocity}
            </span>
            <span className="text-xs text-slate-500 dark:text-zinc-400 font-medium">
              {topic.mention_count} discussions
            </span>
          </div>

          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-zinc-100 leading-snug font-sans">
            {topic.name}
          </h3>
        </div>

        <div className="text-center shrink-0 bg-slate-50 dark:bg-[#18181b] border border-slate-200 dark:border-zinc-800 px-3 py-1.5 rounded-lg">
          <span className="text-[10px] text-slate-500 dark:text-zinc-400 font-bold uppercase block tracking-wider">Score</span>
          <span className="text-xl font-black text-blue-600 dark:text-blue-400">{topic.trend_score}/100</span>
        </div>
      </div>

      {/* Intro nuance text */}
      <p className="text-xs text-slate-600 dark:text-zinc-400 italic mb-3.5 font-sans">
        "Dori detected this discussion friction pattern across AWS re:Post and technical blogs."
      </p>

      {/* Common Symptoms */}
      <div className="space-y-1.5 mb-3.5">
        <h4 className="text-xs font-bold text-slate-900 dark:text-zinc-100 uppercase tracking-wider flex items-center gap-1.5">
          <AlertTriangle className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
          Common Symptoms Reported
        </h4>
        <ul className="space-y-1 text-xs text-slate-600 dark:text-zinc-400 pl-1 font-sans">
          {topic.common_symptoms.map((sym, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5 shrink-0" />
              <span>{sym}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Suggested Solutions */}
      <div className="space-y-1.5 mb-3.5 bg-slate-50 dark:bg-[#18181b] border border-[#00d294]/30 rounded-lg p-3.5">
        <h4 className="text-xs font-bold text-[#00d294] uppercase tracking-wider flex items-center gap-1.5">
          <CheckCircle className="w-3.5 h-3.5 text-[#00d294]" />
          Suggested Solutions
        </h4>
        <ul className="space-y-1 text-xs text-slate-800 dark:text-zinc-200 font-sans">
          {topic.suggested_solutions.map((sol, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00d294] mt-1.5 shrink-0" />
              <span>{sol}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Evolution Timeline Accordion */}
      {topic.evolution_timeline && topic.evolution_timeline.length > 0 && (
        <div className="pt-1">
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full flex items-center justify-between text-xs font-bold text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100 py-1 transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              Topic Evolution Stages ({topic.evolution_timeline.length})
            </span>
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {expanded && (
            <div className="mt-2.5 p-3.5 bg-slate-50 dark:bg-[#18181b] rounded-lg border border-slate-200 dark:border-zinc-800 space-y-2.5">
              {topic.evolution_timeline.map((evo, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs">
                  <span className="font-bold text-blue-600 dark:text-blue-400 w-14 shrink-0">{evo.date}</span>
                  <div className="flex-1">
                    <span className="font-bold text-slate-900 dark:text-zinc-100 px-1.5 py-0.5 bg-white dark:bg-[#202026] border border-slate-200 dark:border-zinc-700 rounded text-[10px] mr-2">
                      {evo.stage}
                    </span>
                    <span className="text-slate-600 dark:text-zinc-400 font-sans">{evo.note}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Related Documentation Links */}
      {topic.related_docs && topic.related_docs.length > 0 && (
        <div className="mt-3.5 pt-2.5 border-t border-slate-200 dark:border-zinc-800 flex flex-wrap items-center gap-3">
          <span className="text-xs text-slate-500 dark:text-zinc-400 font-medium">Docs:</span>
          {topic.related_docs.map((doc, idx) => (
            <a
              key={idx}
              href={doc.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
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
export default TrendCard;
