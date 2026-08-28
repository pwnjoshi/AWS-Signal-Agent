import React, { useState } from 'react';
import { CommunityTopic } from '../types/clientTypes';
import { TrendCard } from '../components/TrendCard';
import { ArrowUpDown, Flame } from 'lucide-react';

interface TrendingPageProps {
  trends: CommunityTopic[];
}

export const TrendingPage: React.FC<TrendingPageProps> = ({ trends }) => {
  const [sort, setSort] = useState<'score' | 'discussions' | 'rising'>('score');

  const sortedTrends = [...trends].sort((a, b) => {
    if (sort === 'discussions') {
      return b.mention_count - a.mention_count;
    } else if (sort === 'rising') {
      if (a.velocity === 'rising' && b.velocity !== 'rising') return -1;
      if (b.velocity === 'rising' && a.velocity !== 'rising') return 1;
      return b.trend_score - a.trend_score;
    }
    return b.trend_score - a.trend_score;
  });

  return (
    <div className="space-y-6 pb-12 font-sans text-slate-900 dark:text-zinc-100">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-zinc-100 tracking-tight">
            Emerging AWS Community Friction & Trends
          </h1>
          <p className="text-slate-500 dark:text-zinc-400 text-xs sm:text-sm mt-1 font-normal">
            Dori monitors re:Post developer questions, blogs, and forums to spot recurring developer challenges before they become official issues.
          </p>
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2 bg-white dark:bg-[#121216] border border-slate-200 dark:border-zinc-800 rounded-lg px-3 py-1.5 shadow-sm text-xs">
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as any)}
            className="bg-transparent text-xs font-medium text-slate-800 dark:text-zinc-200 focus:outline-none cursor-pointer"
          >
            <option value="score">Sort: Highest Trend Score</option>
            <option value="rising">Sort: Rising Velocity First</option>
            <option value="discussions">Sort: Most Discussions</option>
          </select>
        </div>
      </div>

      <div className="space-y-5">
        {sortedTrends.map((topic) => (
          <TrendCard key={topic.topic_id} topic={topic} />
        ))}
      </div>
    </div>
  );
};
export default TrendingPage;
