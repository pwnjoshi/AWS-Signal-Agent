import React from 'react';
import { CommunityTopic } from '../types/clientTypes';
import { TrendCard } from '../components/TrendCard';

interface TrendingPageProps {
  trends: CommunityTopic[];
}

export const TrendingPage: React.FC<TrendingPageProps> = ({ trends }) => {
  return (
    <div className="space-y-6 pb-12 font-sans text-slate-900 dark:text-zinc-100">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-zinc-100 tracking-tight">
          Emerging AWS Community Friction & Trends
        </h1>
        <p className="text-slate-500 dark:text-zinc-400 text-xs sm:text-sm mt-1 font-normal">
          Dori monitors re:Post developer questions, blogs, and forums to spot recurring developer challenges before they become official issues.
        </p>
      </div>

      <div className="space-y-5">
        {trends.map((topic) => (
          <TrendCard key={topic.topic_id} topic={topic} />
        ))}
      </div>
    </div>
  );
};
export default TrendingPage;
