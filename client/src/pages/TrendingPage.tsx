import React from 'react';
import { CommunityTopic } from '../types/clientTypes';
import { TrendCard } from '../components/TrendCard';
import { Flame } from 'lucide-react';

interface TrendingPageProps {
  trends: CommunityTopic[];
}

export const TrendingPage: React.FC<TrendingPageProps> = ({ trends }) => {
  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-rounded flex items-center gap-3">
          <Flame className="w-7 h-7 text-amber-500" />
          Emerging AWS Community Signals & Trends
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Dori monitors re:Post developer questions, blogs, and forums to spot recurring developer challenges before they become official outages.
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
