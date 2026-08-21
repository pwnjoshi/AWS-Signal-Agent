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
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-rounded flex items-center gap-3">
          <Radio className="w-7 h-7 text-blue-600" />
          {savedOnly ? 'Saved Signals' : 'AWS Signals Intelligence Stream'}
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          {savedOnly ? 'Bookmarked AWS articles and community discussions.' : 'All discovered, normalized, and Bedrock-ranked AWS items.'}
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
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-500">
          <Bookmark className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="font-semibold text-base text-slate-700">No signals match your current filter settings.</p>
          <p className="text-xs text-slate-400 mt-1">Try resetting your service or category filters.</p>
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
