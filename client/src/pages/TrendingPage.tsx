import React from 'react';
import { CommunityTopic } from '../types/clientTypes';
import { TrendCard } from '../components/TrendCard';
import { Flame } from 'lucide-react';

interface TrendingPageProps {
  trends: CommunityTopic[];
}

export const TrendingPage: React.FC<TrendingPageProps> = ({ trends }) => {
  return (
    <div className="space-y-6 pb-12 font-mono text-on-background">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-on-background font-display uppercase tracking-tight flex items-center gap-3">
          <Flame className="w-6 h-6 text-[#fe9800] dark:text-secondary" />
          Emerging AWS Community Friction & Trends
        </h1>
        <p className="text-on-surface-variant text-xs sm:text-sm mt-1 font-sans">
          Dori monitors re:Post developer questions, blogs, and forums to spot recurring developer challenges before they become official issues.
        </p>
      </div>

      <div className="space-y-6">
        {trends.map((topic) => (
          <TrendCard key={topic.topic_id} topic={topic} />
        ))}
      </div>
    </div>
  );
};
export default TrendingPage;
