import React from 'react';
import { DailyBriefing } from '../types/clientTypes';
import { DailyBriefingView } from '../components/DailyBriefingView';

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
    <div className="space-y-6 pb-12 font-sans text-slate-900 dark:text-zinc-100">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-zinc-100 tracking-tight">
          Autonomous AWS Signal Daily Briefings
        </h1>
        <p className="text-slate-500 dark:text-zinc-400 text-xs sm:text-sm mt-1 font-normal">
          Synthesized every morning at 08:00 AM by Dori to deliver what changed, why developers care, community pulse, and practical labs.
        </p>
      </div>

      <DailyBriefingView briefing={briefing} onOpenSignalDetail={onOpenSignalDetail} />
    </div>
  );
};
export default BriefingsPage;
