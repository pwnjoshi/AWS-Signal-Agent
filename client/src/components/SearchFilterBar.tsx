import React from 'react';
import { Filter, SlidersHorizontal, ArrowUpDown, Bookmark } from 'lucide-react';

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
    <div className="bg-surface rounded-xl border border-outline p-3.5 mb-5 space-y-3 shadow-sm font-mono transition-colors">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Filters Group */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filter */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-surface-low border border-outline rounded-lg px-3 py-1.5 text-xs font-semibold text-on-background focus:outline-none focus:ring-1 focus:ring-primary"
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
            className="bg-surface-low border border-outline rounded-lg px-3 py-1.5 text-xs font-semibold text-on-background focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="">All AWS Services</option>
            <option value="Amazon Bedrock">Amazon Bedrock</option>
            <option value="AWS Lambda">AWS Lambda</option>
            <option value="Amazon ECS">Amazon ECS</option>
            <option value="Amazon DynamoDB">Amazon DynamoDB</option>
            <option value="Amazon S3">Amazon S3</option>
            <option value="Amazon OpenSearch">Amazon OpenSearch</option>
          </select>

          {/* Source Filter */}
          <select
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="bg-surface-low border border-outline rounded-lg px-3 py-1.5 text-xs font-semibold text-on-background focus:outline-none focus:ring-1 focus:ring-primary"
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
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border cursor-pointer flex items-center gap-1.5 ${
              savedOnly
                ? 'bg-[#fe6e00]/15 text-[#fe9800] border-[#fe6e00]/40'
                : 'bg-surface-low text-on-surface-variant border-outline hover:bg-surface-container hover:text-on-background'
            }`}
          >
            <Bookmark className={`w-3 h-3 ${savedOnly ? 'fill-[#fe9800]' : ''}`} />
            <span>{savedOnly ? 'Saved Only' : 'Saved Filter'}</span>
          </button>
        </div>

        {/* Sort & Count */}
        <div className="flex items-center gap-3 text-xs">
          <span className="text-on-surface-variant font-medium">
            Showing <strong className="text-on-background">{signalCount}</strong> signals
          </span>

          <div className="flex items-center gap-1.5 bg-surface-low border border-outline rounded-lg px-2.5 py-1">
            <ArrowUpDown className="w-3.5 h-3.5 text-on-surface-variant" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="bg-transparent text-xs font-semibold text-on-background focus:outline-none cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="score">Highest Score</option>
              <option value="importance">Highest Importance</option>
              <option value="relevance">Highest Dev Value</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SearchFilterBar;
