import React from 'react';
import { DailyBriefing } from '../types/clientTypes';
import { DailyBriefingView } from '../components/DailyBriefingView';
import { BookOpen } from 'lucide-react';

interface BriefingsPageProps {
  briefing: DailyBriefing | null;
  allBriefings: DailyBriefing[];
  onOpenSignalDetail: (sig: any) => void;
}

export const BriefingsPage: React.FC<BriefingsPageProps> = ({
  briefing,
  allBriefings,
  onOpenSignalDetail,
}) => {
  return (
    <div className="space-y-6 pb-12 font-mono text-slate-900 dark:text-zinc-100">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-zinc-100 font-display uppercase tracking-tight flex items-center gap-2.5">
          <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          Autonomous AWS Signal Daily Briefings
        </h1>
        <p className="text-slate-600 dark:text-zinc-400 text-xs sm:text-sm mt-1 font-sans">
          Synthesized every morning at 08:00 AM by Dori to deliver what changed, why developers care, community pulse, and practical labs.
        </p>
      </div>

      <DailyBriefingView briefing={briefing} onOpenSignalDetail={onOpenSignalDetail} />
    </div>
  );
};
export default BriefingsPage;
