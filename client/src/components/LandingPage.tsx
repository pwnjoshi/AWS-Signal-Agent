import React from 'react';
import { DoriCompanion } from './DoriCompanion';
import { ArrowRight, Sparkles, Shield, Cpu, Zap, Radio, Bell } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* Header */}
      <header className="max-w-7xl mx-auto w-full px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-md text-white font-bold text-lg">
            ⚡
          </div>
          <span className="font-extrabold text-xl text-slate-900 tracking-tight">AWS Signal</span>
        </div>

        <button
          onClick={onGetStarted}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs md:text-sm shadow-md shadow-blue-500/20 transition-all"
        >
          Open Companion Dashboard
        </button>
      </header>

      {/* Hero Section */}
      <main className="max-w-5xl mx-auto px-6 py-12 md:py-20 flex flex-col md:flex-row items-center justify-between gap-12 flex-1">
        
        {/* Left Copy */}
        <div className="flex-1 space-y-6 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>AUTONOMOUS AWS INTELLIGENCE COMPANION</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-none font-rounded">
            Your AWS world, <br />
            <span className="text-blue-600">watched while you're away.</span>
          </h1>

          <p className="text-slate-600 text-base sm:text-lg max-w-xl leading-relaxed">
            An autonomous AI companion that discovers, understands, and delivers the AWS signals worth knowing — powered by Amazon Bedrock.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 pt-2">
            <button
              onClick={onGetStarted}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-7 py-3.5 rounded-2xl font-bold text-base shadow-xl shadow-blue-500/25 transition-all active:scale-95"
            >
              <span>Meet Your AWS Companion</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={onGetStarted}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 px-6 py-3.5 rounded-2xl font-bold text-base shadow-sm transition-all"
            >
              <span>See Today's Signals</span>
            </button>
          </div>

          {/* Key Value Bullets */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200 text-left">
            <div>
              <span className="font-extrabold text-slate-900 text-sm block">100% Autonomous</span>
              <span className="text-xs text-slate-500">EventBridge background runs</span>
            </div>
            <div>
              <span className="font-extrabold text-slate-900 text-sm block">Amazon Bedrock</span>
              <span className="text-xs text-slate-500">5-metric signal scoring</span>
            </div>
            <div>
              <span className="font-extrabold text-slate-900 text-sm block">Zero Noise</span>
              <span className="text-xs text-slate-500">SHA-256 deduplicated</span>
            </div>
          </div>
        </div>

        {/* Right Hero Visual: Dori Companion Art */}
        <div className="shrink-0 flex flex-col items-center justify-center bg-gradient-to-br from-blue-100/60 to-indigo-50 border border-blue-100 p-8 sm:p-12 rounded-4xl shadow-xl shadow-blue-500/10">
          <DoriCompanion
            emotion="excited"
            message="Good morning! I found 7 important AWS signals for you today!"
            size="lg"
            showSpeechBubble={true}
          />
        </div>

      </main>

      {/* Minimal Footer */}
      <footer className="border-t border-slate-200 py-6 text-center text-xs text-slate-400">
        AWS Signal — Your Autonomous AWS Intelligence Companion • Inspired by friendly futuristic companion aesthetics
      </footer>
    </div>
  );
};
