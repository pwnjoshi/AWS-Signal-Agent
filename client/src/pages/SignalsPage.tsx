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
    <div className="space-y-6 pb-12 font-mono text-slate-900 dark:text-zinc-100">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-zinc-100 font-display uppercase tracking-tight flex items-center gap-2.5">
          <Radio className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          {savedOnly ? 'Saved Signals Vault' : 'AWS Radar Intelligence Stream'}
        </h1>
        <p className="text-slate-600 dark:text-zinc-400 text-xs sm:text-sm mt-1 font-sans">
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
        <div className="bg-white dark:bg-[#121216] rounded-xl border border-slate-200 dark:border-zinc-800 p-10 text-center text-slate-600 dark:text-zinc-400 space-y-2.5 shadow-sm">
          <Bookmark className="w-8 h-8 text-slate-400 mx-auto opacity-50" />
          <p className="font-bold text-sm sm:text-base text-slate-900 dark:text-zinc-100">No signals match your filter criteria.</p>
          <p className="text-xs text-slate-500 dark:text-zinc-400">Try clearing your filters or running the radar agent.</p>
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
