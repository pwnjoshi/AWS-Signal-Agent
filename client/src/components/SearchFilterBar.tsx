import React from 'react';
import { ArrowUpDown, Bookmark } from 'lucide-react';

interface SearchFilterBarProps {
  category: string;
  setCategory: (val: string) => void;
  service: string;
  setService: (val: string) => void;
  source: string;
  setSource: (val: string) => void;
  sort: string;
  setSort: (val: string) => void;
  savedOnly: boolean;
  setSavedOnly: (val: boolean) => void;
  signalCount: number;
}

export const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  category,
  setCategory,
  service,
  setService,
  source,
  setSource,
  sort,
  setSort,
  savedOnly,
  setSavedOnly,
  signalCount,
}) => {
  return (
    <div className="bg-white dark:bg-[#121216] rounded-xl border border-slate-200 dark:border-zinc-800 p-3.5 mb-5 space-y-3 shadow-sm font-sans transition-colors">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Filters Group */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filter */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-slate-50 dark:bg-[#18181b] border border-slate-200 dark:border-zinc-700 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-800 dark:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
          >
            <option value="">All Categories</option>
            <option value="Announcement">Announcements</option>
            <option value="Community Discussion">Community Discussions</option>
            <option value="Architecture Pattern">Architecture Patterns</option>
            <option value="Tutorial">Tutorials</option>
            <option value="Security Alert">Security Alerts</option>
          </select>

          {/* Service Filter */}
          <select
            value={service}
            onChange={(e) => setService(e.target.value)}
            className="bg-slate-50 dark:bg-[#18181b] border border-slate-200 dark:border-zinc-700 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-800 dark:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
          >
            <option value="">All AWS Services</option>
            <option value="Amazon Bedrock">Amazon Bedrock</option>
            <option value="AWS Lambda">AWS Lambda</option>
            <option value="Amazon ECS">Amazon ECS</option>
            <option value="Amazon DynamoDB">Amazon DynamoDB</option>
            <option value="Amazon S3">Amazon S3</option>
            <option value="Amazon SageMaker">Amazon SageMaker</option>
            <option value="Amazon OpenSearch">Amazon OpenSearch</option>
          </select>

          {/* Source Filter */}
          <select
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="bg-slate-50 dark:bg-[#18181b] border border-slate-200 dark:border-zinc-700 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-800 dark:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
          >
            <option value="">All Public Sources</option>
            <option value="AWS What's New">AWS What's New</option>
            <option value="AWS News Blog">AWS News Blog</option>
            <option value="AWS Architecture Blog">AWS Architecture Blog</option>
            <option value="AWS re:Post">AWS re:Post / Forums</option>
          </select>

          {/* Saved Toggle */}
          <button
            onClick={() => setSavedOnly(!savedOnly)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border cursor-pointer flex items-center gap-1.5 ${
              savedOnly
                ? 'bg-orange-50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400 border-orange-300 dark:border-orange-700'
                : 'bg-slate-50 dark:bg-[#18181b] text-slate-600 dark:text-zinc-400 border-slate-200 dark:border-zinc-700 hover:bg-slate-100 dark:hover:bg-[#202026] hover:text-slate-900 dark:hover:text-zinc-100'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${savedOnly ? 'fill-orange-500 text-orange-500' : ''}`} />
            <span>{savedOnly ? 'Bookmarked Only' : 'Saved Filter'}</span>
          </button>
        </div>

        {/* Sort & Count */}
        <div className="flex items-center gap-3 text-xs">
          <span className="text-slate-500 dark:text-zinc-400 font-normal">
            Showing <strong className="text-slate-900 dark:text-zinc-100 font-medium font-mono">{signalCount}</strong> signals
          </span>

          <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-[#18181b] border border-slate-200 dark:border-zinc-700 rounded-lg px-2.5 py-1">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="bg-transparent text-xs font-medium text-slate-800 dark:text-zinc-200 focus:outline-none cursor-pointer"
            >
              <option value="score">Sort: Highest Bedrock Score</option>
              <option value="newest">Sort: Newest First</option>
              <option value="importance">Sort: Architecture Importance</option>
              <option value="relevance">Sort: Developer Value</option>
              <option value="momentum">Sort: Community Momentum</option>
              <option value="oldest">Sort: Oldest First</option>
              <option value="title">Sort: Title (A–Z)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SearchFilterBar;
