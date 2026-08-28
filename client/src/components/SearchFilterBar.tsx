import React from 'react';
import { Filter, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

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
    <div className="bg-[#121216] rounded-2xl border border-[#27272a] p-4 mb-6 space-y-3 shadow-lg font-mono">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Filters Group */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filter */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-[#18181b] border border-[#27272a] rounded-xl px-3 py-1.5 text-xs font-semibold text-zinc-200 focus:outline-none focus:ring-2 focus:ring-[#AD5CFF]"
          >
            <option value="" className="bg-[#18181b] text-zinc-200">All Categories</option>
            <option value="Announcement" className="bg-[#18181b] text-zinc-200">Announcements</option>
            <option value="Community Discussion" className="bg-[#18181b] text-zinc-200">Community Discussions</option>
            <option value="Architecture Pattern" className="bg-[#18181b] text-zinc-200">Architecture Patterns</option>
            <option value="Tutorial" className="bg-[#18181b] text-zinc-200">Tutorials</option>
            <option value="Security Alert" className="bg-[#18181b] text-zinc-200">Security Alerts</option>
          </select>

          {/* Service Filter */}
          <select
            value={service}
            onChange={(e) => setService(e.target.value)}
            className="bg-[#18181b] border border-[#27272a] rounded-xl px-3 py-1.5 text-xs font-semibold text-zinc-200 focus:outline-none focus:ring-2 focus:ring-[#AD5CFF]"
          >
            <option value="" className="bg-[#18181b] text-zinc-200">All AWS Services</option>
            <option value="Amazon Bedrock" className="bg-[#18181b] text-zinc-200">Amazon Bedrock</option>
            <option value="AWS Lambda" className="bg-[#18181b] text-zinc-200">AWS Lambda</option>
            <option value="Amazon ECS" className="bg-[#18181b] text-zinc-200">Amazon ECS</option>
            <option value="Amazon DynamoDB" className="bg-[#18181b] text-zinc-200">Amazon DynamoDB</option>
            <option value="Amazon S3" className="bg-[#18181b] text-zinc-200">Amazon S3</option>
            <option value="Amazon OpenSearch" className="bg-[#18181b] text-zinc-200">Amazon OpenSearch</option>
          </select>

          {/* Source Filter */}
          <select
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="bg-[#18181b] border border-[#27272a] rounded-xl px-3 py-1.5 text-xs font-semibold text-zinc-200 focus:outline-none focus:ring-2 focus:ring-[#AD5CFF]"
          >
            <option value="" className="bg-[#18181b] text-zinc-200">All Public Sources</option>
            <option value="AWS What's New" className="bg-[#18181b] text-zinc-200">AWS What's New</option>
            <option value="AWS News Blog" className="bg-[#18181b] text-zinc-200">AWS News Blog</option>
            <option value="AWS Architecture Blog" className="bg-[#18181b] text-zinc-200">AWS Architecture Blog</option>
            <option value="AWS re:Post" className="bg-[#18181b] text-zinc-200">AWS re:Post / Forums</option>
          </select>

          {/* Saved Toggle */}
          <button
            onClick={() => setSavedOnly(!savedOnly)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
              savedOnly
                ? 'bg-[#fe6e00]/20 text-[#ffc080] border-[#fe6e00]/50'
                : 'bg-[#18181b] text-zinc-400 border-[#27272a] hover:bg-[#27272a] hover:text-white'
            }`}
          >
            {savedOnly ? '★ Saved Only' : 'Saved Filter'}
          </button>
        </div>

        {/* Sort & Count */}
        <div className="flex items-center gap-3 text-xs">
          <span className="text-zinc-500 font-medium">
            Showing <strong className="text-white">{signalCount}</strong> signals
          </span>

          <div className="flex items-center gap-1.5 bg-[#18181b] border border-[#27272a] rounded-xl px-2.5 py-1">
            <ArrowUpDown className="w-3.5 h-3.5 text-zinc-400" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="bg-transparent text-xs font-semibold text-zinc-200 focus:outline-none cursor-pointer"
            >
              <option value="newest" className="bg-[#18181b] text-zinc-200">Newest First</option>
              <option value="score" className="bg-[#18181b] text-zinc-200">Highest Score</option>
              <option value="importance" className="bg-[#18181b] text-zinc-200">Highest Importance</option>
              <option value="relevance" className="bg-[#18181b] text-zinc-200">Highest Dev Value</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SearchFilterBar;
