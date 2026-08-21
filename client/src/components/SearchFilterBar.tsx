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
    <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-6 space-y-3 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Filters Group */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filter */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
              savedOnly
                ? 'bg-blue-50 text-blue-700 border-blue-300'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            {savedOnly ? '★ Saved Signals' : 'Saved Only'}
          </button>
        </div>

        {/* Sort & Count */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 font-medium">
            Showing <strong className="text-slate-700">{signalCount}</strong> signals
          </span>

          <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-xl px-2 py-1">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="score">Highest Signal Score</option>
              <option value="importance">Highest Importance</option>
              <option value="relevance">Highest Dev Value</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
