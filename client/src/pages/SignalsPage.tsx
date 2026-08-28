import React, { useState } from 'react';
import { AWSSignal } from '../types/clientTypes';
import { SearchFilterBar } from '../components/SearchFilterBar';
import { SignalCard } from '../components/SignalCard';
import { Bookmark, Search } from 'lucide-react';

interface SignalsPageProps {
  signals: AWSSignal[];
  onOpenSignalDetail: (sig: AWSSignal) => void;
  onToggleSave: (id: string) => void;
  savedOnlyDefault?: boolean;
  searchTerm?: string;
  onSearchChange?: (val: string) => void;
}

export const SignalsPage: React.FC<SignalsPageProps> = ({
  signals,
  onOpenSignalDetail,
  onToggleSave,
  savedOnlyDefault = false,
  searchTerm = '',
  onSearchChange,
}) => {
  const [localSearch, setLocalSearch] = useState<string>(searchTerm);
  const [category, setCategory] = useState<string>('');
  const [service, setService] = useState<string>('');
  const [source, setSource] = useState<string>('');
  const [sort, setSort] = useState<string>('score');
  const [savedOnly, setSavedOnly] = useState<boolean>(savedOnlyDefault);

  const activeSearch = (searchTerm || localSearch).trim();

  let filtered = [...signals];

  // 1. Full-Text Search across Title, Summary, Services, Category, Why-It-Matters & Code Labs
  if (activeSearch.length > 0) {
    const term = activeSearch.toLowerCase();
    filtered = filtered.filter(s => {
      const titleMatch = s.title.toLowerCase().includes(term);
      const summaryMatch = s.summary.toLowerCase().includes(term);
      const serviceMatch = s.aws_services.some(srv => srv.toLowerCase().includes(term));
      const categoryMatch = s.category.toLowerCase().includes(term);
      const sourceMatch = s.source.toLowerCase().includes(term);
      const whyMatch = s.why_it_matters?.why_it_matters?.toLowerCase().includes(term) ||
        s.why_it_matters?.what_happened?.toLowerCase().includes(term) ||
        s.why_it_matters?.recommended_action?.toLowerCase().includes(term);
      return titleMatch || summaryMatch || serviceMatch || categoryMatch || sourceMatch || whyMatch;
    });
  }

  // 2. Category Filter
  if (category) {
    filtered = filtered.filter(s => s.category === category);
  }

  // 3. Service Filter
  if (service) {
    filtered = filtered.filter(s => s.aws_services.includes(service));
  }

  // 4. Source Filter
  if (source) {
    filtered = filtered.filter(s => s.source === source);
  }

  // 5. Saved Filter
  if (savedOnly) {
    filtered = filtered.filter(s => s.is_saved);
  }

  // 6. Sorting Logic
  if (sort === 'score') {
    filtered.sort((a, b) => (b.signal_score || 0) - (a.signal_score || 0));
  } else if (sort === 'importance') {
    filtered.sort((a, b) => (b.importance_score || 0) - (a.importance_score || 0));
  } else if (sort === 'relevance') {
    filtered.sort((a, b) => (b.relevance_score || 0) - (a.relevance_score || 0));
  } else if (sort === 'momentum') {
    filtered.sort((a, b) => (b.momentum_score || 0) - (a.momentum_score || 0));
  } else if (sort === 'oldest') {
    filtered.sort((a, b) => new Date(a.published_at || a.discovered_at).getTime() - new Date(b.published_at || b.discovered_at).getTime());
  } else if (sort === 'title') {
    filtered.sort((a, b) => a.title.localeCompare(b.title));
  } else {
    // Newest first
    filtered.sort((a, b) => new Date(b.published_at || b.discovered_at).getTime() - new Date(a.published_at || a.discovered_at).getTime());
  }

  const handleSearchUpdate = (val: string) => {
    setLocalSearch(val);
    if (onSearchChange) onSearchChange(val);
  };

  return (
    <div className="space-y-6 pb-12 font-sans text-slate-900 dark:text-zinc-100">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-zinc-100 tracking-tight">
          {savedOnly ? 'Saved Signals Vault' : 'AWS Radar Intelligence Stream'}
        </h1>
        <p className="text-slate-500 dark:text-zinc-400 text-xs sm:text-sm mt-1 font-normal">
          {savedOnly ? 'Your personally bookmarked AWS articles and architecture patterns.' : 'All discovered, normalized, SHA-256 deduplicated, and Bedrock-ranked signals.'}
        </p>
      </div>

      <SearchFilterBar
        searchTerm={searchTerm || localSearch}
        setSearchTerm={handleSearchUpdate}
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
          <Search className="w-8 h-8 text-slate-400 mx-auto opacity-50" />
          <p className="font-semibold text-sm sm:text-base text-slate-900 dark:text-zinc-100">No signals match "{activeSearch}" or filter criteria.</p>
          <p className="text-xs text-slate-500 dark:text-zinc-400">Try clearing search keywords or switching filters.</p>
          {activeSearch && (
            <button
              onClick={() => handleSearchUpdate('')}
              className="mt-2 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-all"
            >
              Clear Search Query
            </button>
          )}
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
