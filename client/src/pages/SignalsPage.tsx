import React, { useState } from 'react';
import { AWSSignal } from '../types/clientTypes';
import { SearchFilterBar } from '../components/SearchFilterBar';
import { SignalCard } from '../components/SignalCard';
import { Radio, Bookmark } from 'lucide-react';

interface SignalsPageProps {
  signals: AWSSignal[];
  onOpenSignalDetail: (sig: AWSSignal) => void;
  onToggleSave: (id: string) => void;
  savedOnlyDefault?: boolean;
}

export const SignalsPage: React.FC<SignalsPageProps> = ({
  signals,
  onOpenSignalDetail,
  onToggleSave,
  savedOnlyDefault = false,
}) => {
  const [category, setCategory] = useState<string>('');
  const [service, setService] = useState<string>('');
  const [source, setSource] = useState<string>('');
  const [sort, setSort] = useState<string>('newest');
  const [savedOnly, setSavedOnly] = useState<boolean>(savedOnlyDefault);

  let filtered = [...signals];

  if (category) {
    filtered = filtered.filter(s => s.category === category);
  }

  if (service) {
    filtered = filtered.filter(s => s.aws_services.includes(service));
  }

  if (source) {
    filtered = filtered.filter(s => s.source === source);
  }

  if (savedOnly) {
    filtered = filtered.filter(s => s.is_saved);
  }

  // Sort
  if (sort === 'score') {
    filtered.sort((a, b) => b.signal_score - a.signal_score);
  } else if (sort === 'importance') {
    filtered.sort((a, b) => b.importance_score - a.importance_score);
  } else if (sort === 'relevance') {
    filtered.sort((a, b) => b.relevance_score - a.relevance_score);
  } else {
    filtered.sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());
  }

  return (
    <div className="space-y-6 pb-12 font-mono text-zinc-100">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-white font-display uppercase tracking-tight flex items-center gap-3">
          <Radio className="w-6 h-6 text-[#AD5CFF]" />
          {savedOnly ? 'Saved Signals Vault' : 'AWS Radar Intelligence Stream'}
        </h1>
        <p className="text-zinc-400 text-xs sm:text-sm mt-1 font-sans">
          {savedOnly ? 'Your personally bookmarked AWS articles and architecture patterns.' : 'All discovered, normalized, SHA-256 deduplicated, and Bedrock-ranked signals.'}
        </p>
      </div>

      <SearchFilterBar
        category={category}
        setCategory={setCategory}
        service={service}
        setService={setService}
        source={source}
        setSource={setSource}
        sort={sort}
        setSort={setSort}
        savedOnly={savedOnly}
        setSavedOnly={setSavedOnly}
        signalCount={filtered.length}
      />

      {filtered.length === 0 ? (
        <div className="bg-[#121216] rounded-3xl border border-[#27272a] p-12 text-center text-zinc-400 space-y-3">
          <Bookmark className="w-10 h-10 text-zinc-600 mx-auto" />
          <p className="font-bold text-sm sm:text-base text-white">No signals match your filter criteria.</p>
          <p className="text-xs text-zinc-500">Try clearing your filters or running the radar agent.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((sig) => (
            <SignalCard
              key={sig.signal_id}
              signal={sig}
              onOpenDetail={onOpenSignalDetail}
              onToggleSave={onToggleSave}
            />
          ))}
        </div>
      )}
    </div>
  );
};
export default SignalsPage;
