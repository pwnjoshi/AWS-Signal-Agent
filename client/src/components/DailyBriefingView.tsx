import React, { useState } from 'react';
import { DailyBriefing } from '../types/clientTypes';
import { Volume2, VolumeX, Sparkles, ExternalLink } from 'lucide-react';

interface DailyBriefingViewProps {
  briefing: DailyBriefing | null;
  onOpenSignalDetail: (signal: any) => void;
}

export const DailyBriefingView: React.FC<DailyBriefingViewProps> = ({ briefing, onOpenSignalDetail }) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  if (!briefing) {
    return (
      <div className="bg-white dark:bg-[#121216] rounded-xl border border-slate-200 dark:border-zinc-800 p-8 text-center text-slate-600 dark:text-zinc-400 font-sans">
        <Sparkles className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
        <p className="font-semibold text-slate-900 dark:text-zinc-100">No Daily Briefing has been synthesized yet today.</p>
        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">Click "Run Radar Agent" to trigger an autonomous scan and synthesis.</p>
      </div>
    );
  }

  const handlePlayAudio = () => {
    if (!('speechSynthesis' in window)) {
      alert('Text-to-speech is not supported by your browser.');
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    const narrationScript = `
      Good morning builders. This is Dori with your AWS Signal intelligence briefing for ${briefing.date}.
      Here is what changed across the AWS cloud:
      ${briefing.what_changed}
      
      Why it matters for developers:
      ${briefing.why_developers_care}
      
      Community Pulse:
      ${briefing.community_pulse}
      
      Your recommended hands-on lab for today:
      ${briefing.try_today?.title || ''}. ${briefing.try_today?.description || ''}.
      
      Stay curious and happy building!
    `;

    const utterance = new SpeechSynthesisUtterance(narrationScript);
    utterance.rate = 1.05;
    utterance.pitch = 1.1;

    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    setIsPlayingAudio(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="space-y-6 font-sans text-slate-900 dark:text-zinc-100">
      
      {/* Briefing Header Hero Card */}
      <div className="bg-white dark:bg-[#121216] rounded-xl border border-slate-200 dark:border-zinc-800 p-6 shadow-sm transition-colors">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-md bg-slate-50 dark:bg-[#18181b] text-blue-600 dark:text-blue-400 border border-slate-200 dark:border-zinc-800 text-[11px] font-medium">
                Autonomous Briefing
              </span>
              <span className="text-xs text-slate-500 dark:text-zinc-400 font-mono font-medium">{briefing.date}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-zinc-100">
              {briefing.title || 'AWS Signal Daily Intelligence Digest'}
            </h1>
            <p className="text-slate-500 dark:text-zinc-400 text-xs sm:text-sm mt-1 font-normal">
              Generated autonomously by Amazon Bedrock Claude 3.5 from 24h cloud feed telemetry.
            </p>
          </div>

          {/* Dori Audio Synthesizer Button */}
          <button
            onClick={handlePlayAudio}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-medium transition-all shadow-sm cursor-pointer shrink-0 ${
              isPlayingAudio
                ? 'bg-amber-500 hover:bg-amber-600 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isPlayingAudio ? (
              <>
                <VolumeX className="w-4 h-4" />
                <span>Stop audio</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4" />
                <span>Listen to briefing</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 4 Core Briefing Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Section 1: What Changed */}
        <div className="bg-white dark:bg-[#121216] rounded-xl border border-slate-200 dark:border-zinc-800 p-5 shadow-sm space-y-3">
          <div className="border-b border-slate-200 dark:border-zinc-800 pb-2.5">
            <h3 className="text-xs font-semibold text-slate-900 dark:text-zinc-100 uppercase tracking-wider">
              1. What Changed in the Cloud
            </h3>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-[#18181b] border border-slate-200 dark:border-zinc-800 rounded-lg">
            <p className="text-xs sm:text-sm text-slate-700 dark:text-zinc-300 leading-relaxed whitespace-pre-line font-normal">
              {briefing.what_changed}
            </p>
          </div>
        </div>

        {/* Section 2: Why Developers Care */}
        <div className="bg-white dark:bg-[#121216] rounded-xl border border-slate-200 dark:border-zinc-800 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-zinc-800 pb-2.5">
            <h3 className="text-xs font-semibold text-slate-900 dark:text-zinc-100 uppercase tracking-wider">
              2. Why Developers Care
            </h3>
            <span className="text-[10px] text-slate-500 dark:text-zinc-400 font-medium">Architectural Impact</span>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-[#18181b] border border-slate-200 dark:border-zinc-800 rounded-lg">
            <p className="text-xs sm:text-sm text-slate-700 dark:text-zinc-300 leading-relaxed whitespace-pre-line font-normal">
              {briefing.why_developers_care}
            </p>
          </div>
        </div>

        {/* Section 3: Community Pulse */}
        <div className="bg-white dark:bg-[#121216] rounded-xl border border-slate-200 dark:border-zinc-800 p-5 shadow-sm space-y-3">
          <div className="border-b border-slate-200 dark:border-zinc-800 pb-2.5">
            <h3 className="text-xs font-semibold text-slate-900 dark:text-zinc-100 uppercase tracking-wider">
              3. Community Pulse & Discussions
            </h3>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-[#18181b] border border-slate-200 dark:border-zinc-800 rounded-lg">
            <p className="text-xs sm:text-sm text-slate-700 dark:text-zinc-300 leading-relaxed whitespace-pre-line font-normal">
              {briefing.community_pulse}
            </p>
          </div>
        </div>

        {/* Section 4: 10-Minute Practical Lab */}
        {briefing.try_today && (
          <div className="bg-white dark:bg-[#121216] rounded-xl border border-slate-200 dark:border-zinc-800 p-5 shadow-sm space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-zinc-800 pb-2.5">
                <h3 className="text-xs font-semibold text-[#00d294] uppercase tracking-wider">
                  4. 10-Minute Practical Lab
                </h3>
                <span className="text-[10px] font-medium text-[#00d294] bg-[#00d294]/10 border border-[#00d294]/30 px-2 py-0.5 rounded">
                  Actionable
                </span>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-[#18181b] border border-slate-200 dark:border-zinc-800 rounded-lg space-y-1.5">
                <h4 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-zinc-100">
                  {briefing.try_today.title}
                </h4>
                <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed font-normal">
                  {briefing.try_today.description}
                </p>
              </div>
            </div>

            <div className="pt-2">
              <a
                href={briefing.try_today.doc_url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-[#00d294] hover:bg-[#00baa7] text-zinc-950 px-4 py-2 rounded-lg font-medium text-xs shadow-sm transition-all"
              >
                <span>Launch documentation & tutorial</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
export default DailyBriefingView;
