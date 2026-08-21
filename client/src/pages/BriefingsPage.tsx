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
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-rounded flex items-center gap-3">
          <BookOpen className="w-7 h-7 text-blue-600" />
          Autonomous AWS Signal Daily Briefings
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Synthesized every morning at 08:00 AM by Dori to deliver what changed, why developers care, community pulse, and practical labs.
        </p>
      </div>

      <DailyBriefingView briefing={briefing} onOpenSignalDetail={onOpenSignalDetail} />
    </div>
  );
};
