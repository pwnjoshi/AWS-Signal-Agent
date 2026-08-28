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
        return 'bg-red-500/15 text-red-300 border-red-500/30';
      case 'stable':
        return 'bg-[#ffc080]/15 text-[#ffc080] border-[#ffc080]/30';
      default:
        return 'bg-zinc-800 text-zinc-300 border-zinc-700';
    }
  };

  return (
    <div className="bg-[#121216] rounded-3xl border border-[#27272a] p-6 hover:border-[#AD5CFF]/40 transition-all font-mono text-zinc-100 shadow-xl">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#AD5CFF]/15 text-[#d8b4fe] border border-[#AD5CFF]/30 uppercase">
              ☁ {topic.service}
            </span>
            <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border capitalize flex items-center gap-1 ${getVelocityBadge(topic.velocity)}`}>
              <TrendingUp className="w-3 h-3" />
              {topic.velocity}
            </span>
            <span className="text-xs text-zinc-500 font-medium">
              {topic.mention_count} discussions
            </span>
          </div>

          <h3 className="text-base sm:text-lg font-bold text-white leading-snug font-sans">
            {topic.name}
          </h3>
        </div>

        <div className="text-center shrink-0 bg-[#09090b] border border-[#27272a] px-3 py-2 rounded-2xl">
          <span className="text-[10px] text-zinc-500 font-bold uppercase block tracking-wider">Score</span>
          <span className="text-xl font-black text-[#AD5CFF]">{topic.trend_score}/100</span>
        </div>
      </div>

      {/* Intro nuance text */}
      <p className="text-xs text-zinc-400 italic mb-4 font-sans">
        "Dori detected this discussion friction pattern across AWS re:Post and technical blogs."
      </p>

      {/* Common Symptoms */}
      <div className="space-y-2 mb-4">
        <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
          <AlertTriangle className="w-3.5 h-3.5 text-[#ffc080]" />
          Common Symptoms Reported
        </h4>
        <ul className="space-y-1.5 text-xs text-zinc-400 pl-1 font-sans">
          {topic.common_symptoms.map((sym, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ffc080] mt-1.5 shrink-0" />
              <span>{sym}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Suggested Workarounds */}
      <div className="space-y-2 mb-4 bg-[#09090b] border border-[#00d294]/30 rounded-2xl p-4">
        <h4 className="text-xs font-bold text-[#00d294] uppercase tracking-wider flex items-center gap-1.5">
          <CheckCircle className="w-3.5 h-3.5 text-[#00d294]" />
          Suggested Solutions
        </h4>
        <ul className="space-y-1.5 text-xs text-zinc-300 font-sans">
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
        <div className="pt-2">
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full flex items-center justify-between text-xs font-bold text-zinc-400 hover:text-white py-1 transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#AD5CFF]" />
              Topic Evolution Stages ({topic.evolution_timeline.length})
            </span>
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {expanded && (
            <div className="mt-3 p-4 bg-[#09090b] rounded-2xl border border-[#27272a] space-y-3">
              {topic.evolution_timeline.map((evo, idx) => (
                <div key={idx} className="flex items-start gap-3 text-xs">
                  <span className="font-bold text-[#AD5CFF] w-14 shrink-0">{evo.date}</span>
                  <div className="flex-1">
                    <span className="font-bold text-white px-2 py-0.5 bg-[#18181b] border border-[#27272a] rounded-md text-[10px] mr-2">
                      {evo.stage}
                    </span>
                    <span className="text-zinc-400 font-sans">{evo.note}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Related Documentation Links */}
      {topic.related_docs && topic.related_docs.length > 0 && (
        <div className="mt-4 pt-3 border-t border-[#27272a] flex flex-wrap items-center gap-3">
          <span className="text-xs text-zinc-500 font-medium">Docs:</span>
          {topic.related_docs.map((doc, idx) => (
            <a
              key={idx}
              href={doc.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-[#AD5CFF] hover:underline flex items-center gap-1"
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
