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
        return 'bg-red-500/15 text-red-500 border-red-500/30';
      case 'stable':
        return 'bg-secondary/15 text-[#fe9800] dark:text-secondary border-secondary/30';
      default:
        return 'bg-surface-low text-on-surface-variant border-outline';
    }
  };

  return (
    <div className="bg-surface rounded-3xl border border-outline p-6 hover:border-primary/40 transition-all font-mono text-on-background shadow-sm">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/30 uppercase">
              ☁ {topic.service}
            </span>
            <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border capitalize flex items-center gap-1 ${getVelocityBadge(topic.velocity)}`}>
              <TrendingUp className="w-3 h-3" />
              {topic.velocity}
            </span>
            <span className="text-xs text-on-surface-variant font-medium">
              {topic.mention_count} discussions
            </span>
          </div>

          <h3 className="text-base sm:text-lg font-bold text-on-background leading-snug font-sans">
            {topic.name}
          </h3>
        </div>

        <div className="text-center shrink-0 bg-surface-low border border-outline px-3 py-2 rounded-2xl">
          <span className="text-[10px] text-on-surface-variant font-bold uppercase block tracking-wider">Score</span>
          <span className="text-xl font-black text-primary">{topic.trend_score}/100</span>
        </div>
      </div>

      {/* Intro nuance text */}
      <p className="text-xs text-on-surface-variant italic mb-4 font-sans">
        "Dori detected this discussion friction pattern across AWS re:Post and technical blogs."
      </p>

      {/* Common Symptoms */}
      <div className="space-y-2 mb-4">
        <h4 className="text-xs font-bold text-on-background uppercase tracking-wider flex items-center gap-1.5">
          <AlertTriangle className="w-3.5 h-3.5 text-[#fe9800] dark:text-secondary" />
          Common Symptoms Reported
        </h4>
        <ul className="space-y-1.5 text-xs text-on-surface-variant pl-1 font-sans">
          {topic.common_symptoms.map((sym, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#fe9800] dark:bg-secondary mt-1.5 shrink-0" />
              <span>{sym}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Suggested Workarounds */}
      <div className="space-y-2 mb-4 bg-surface-low border border-[#00d294]/30 rounded-2xl p-4">
        <h4 className="text-xs font-bold text-[#00d294] uppercase tracking-wider flex items-center gap-1.5">
          <CheckCircle className="w-3.5 h-3.5 text-[#00d294]" />
          Suggested Solutions
        </h4>
        <ul className="space-y-1.5 text-xs text-on-background font-sans">
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
            className="w-full flex items-center justify-between text-xs font-bold text-on-surface-variant hover:text-on-background py-1 transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-primary" />
              Topic Evolution Stages ({topic.evolution_timeline.length})
            </span>
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {expanded && (
            <div className="mt-3 p-4 bg-surface-low rounded-2xl border border-outline space-y-3">
              {topic.evolution_timeline.map((evo, idx) => (
                <div key={idx} className="flex items-start gap-3 text-xs">
                  <span className="font-bold text-primary w-14 shrink-0">{evo.date}</span>
                  <div className="flex-1">
                    <span className="font-bold text-on-background px-2 py-0.5 bg-surface border border-outline rounded-md text-[10px] mr-2">
                      {evo.stage}
                    </span>
                    <span className="text-on-surface-variant font-sans">{evo.note}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Related Documentation Links */}
      {topic.related_docs && topic.related_docs.length > 0 && (
        <div className="mt-4 pt-3 border-t border-outline flex flex-wrap items-center gap-3">
          <span className="text-xs text-on-surface-variant font-medium">Docs:</span>
          {topic.related_docs.map((doc, idx) => (
            <a
              key={idx}
              href={doc.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
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
