import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Radio, 
  ArrowRight,
  ArrowUpRight, 
  ShieldCheck, 
  Zap, 
  Volume2, 
  Cpu, 
  Clock, 
  Brain,
  Layers,
  Activity,
  CheckCircle2,
  Lock,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { GEUNavbar as Navbar } from './GEUNavbar';
import { ParticleBackground } from './ParticleBackground';
import { DoriCompanion } from './DoriCompanion';

interface LandingPageProps {
  onGetStarted: () => void;
  onOpenAuthModal?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onOpenAuthModal }) => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#09090b] text-slate-900 dark:text-zinc-100 selection:bg-blue-500/20 selection:text-blue-600 relative font-sans overflow-x-hidden transition-colors pb-24 md:pb-0">
      
      {/* Ambient Particle & Canvas Background */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute inset-0 site-main-grid opacity-30" />
        <ParticleBackground />
      </div>

      {/* Standalone Navigation Bar */}
      <Navbar onOpenAuthModal={onOpenAuthModal} onLaunchDashboard={onGetStarted} />

      {/* ── Section 1: Hero Section (Optimized for both Desktop & Mobile) ── */}
      <section id="home" className="relative pt-28 sm:pt-36 md:pt-40 pb-8 sm:pb-12 md:pb-16 px-4 sm:px-6 max-w-5xl mx-auto flex flex-col items-center justify-center text-center">
        
        {/* Animated Lightning Shimmer Border Pill */}
        <div className="inline-block p-[1.5px] rounded-full lightning-border-wrapper shadow-sm select-none mb-4 sm:mb-6">
          <div className="px-4 py-1.5 rounded-full bg-white dark:bg-[#121216] backdrop-blur-md">
            <span className="text-xs font-semibold text-slate-800 dark:text-zinc-200 tracking-normal">
              Autonomous AWS Intelligence
            </span>
          </div>
        </div>

        {/* Hero Headline */}
        <h1 className="text-2xl sm:text-4xl md:text-6xl font-bold tracking-tight text-slate-900 dark:text-zinc-100 leading-[1.18] max-w-3xl">
          Where Cloud Builders Stay Informed
        </h1>

        <p className="text-xs sm:text-base md:text-lg text-slate-600 dark:text-zinc-400 max-w-2xl mx-auto font-normal leading-relaxed mt-3 sm:mt-4">
          AWS Signal monitors release feeds 24/7, scores developer relevance via Amazon Bedrock, and delivers personalized audio briefings before breaking your stack.
        </p>

        {/* Exactly Two Action CTAs (Full touch width on mobile, inline on desktop) */}
        <div className="w-full max-w-md sm:max-w-none flex flex-col sm:flex-row items-center justify-center gap-3 pt-5 sm:pt-6">
          <Link
            to="/dashboard"
            className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 active:scale-98 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <span>Get Started</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            to="/signals"
            className="w-full sm:w-auto px-6 py-3 bg-white dark:bg-[#18181b] hover:bg-slate-50 dark:hover:bg-[#202026] active:scale-98 text-slate-800 dark:text-zinc-200 border border-slate-200 dark:border-zinc-800 rounded-xl text-xs sm:text-sm font-semibold shadow-sm flex items-center justify-center gap-2 transition-all"
          >
            <Radio className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Explore Live Radar</span>
          </Link>
        </div>

        {/* ── Dori Sitting Centered with Continuous AI Voice Loop ── */}
        <div className="mt-8 sm:mt-12 flex flex-col items-center justify-center relative z-20 w-full">
          <DoriCompanion
            size="hero"
            showSpeechBubble={true}
          />
        </div>
      </section>

      {/* ── Section 2: Live Agent Heartbeat Strip ── */}
      <section className="border-y border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#121216] py-3.5 px-4 sm:px-6 shadow-sm">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-[#00d294] animate-pulse" />
            <span className="font-semibold text-slate-900 dark:text-zinc-100">Live Agent Heartbeat:</span>
            <span className="text-slate-500 dark:text-zinc-400">Autonomous 24/7 Ingestion Pipeline</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-[11px] text-slate-600 dark:text-zinc-400 font-mono">
            <span className="flex items-center gap-1.5 font-sans">
              <Zap className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Deduplication: <strong className="font-mono text-slate-900 dark:text-zinc-100 font-semibold">SHA-256</strong></span>
            </span>
            <span className="flex items-center gap-1.5 font-sans">
              <Brain className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Model: <strong className="font-mono text-indigo-600 dark:text-indigo-400 font-semibold">Bedrock Claude 3.5</strong></span>
            </span>
            <span className="flex items-center gap-1.5 font-sans">
              <Clock className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
              <span>Interval: <strong className="font-mono text-orange-600 dark:text-orange-400 font-semibold">EventBridge Cron</strong></span>
            </span>
          </div>
        </div>
      </section>

      {/* ── Section 3: Bento Grid Intelligence (Responsive for PC & Phone) ── */}
      <section id="intelligence" className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 max-w-6xl mx-auto space-y-8">
        
        <div className="text-center space-y-2">
          <h2 className="text-xl sm:text-3xl md:text-4xl font-bold text-slate-900 dark:text-zinc-100 tracking-tight">
            The Architecture of Clarity
          </h2>
          <p className="text-slate-500 dark:text-zinc-400 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            Why browse 50 AWS release pages when an autonomous agent can score, synthesize, and filter for you?
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          
          {/* Bento 1: While You Were Away (Col 8) */}
          <div className="md:col-span-8 p-5 sm:p-7 rounded-2xl bg-white dark:bg-[#121216] border border-slate-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between min-h-[260px]">
            <div>
              <h3 className="text-base sm:text-xl font-semibold text-slate-900 dark:text-zinc-100 mb-2">
                "While You Were Away" Executive Synthesis
              </h3>
              <p className="text-slate-500 dark:text-zinc-400 text-xs sm:text-sm leading-relaxed max-w-2xl font-normal">
                Never suffer from release fatigue. Whenever you open the dashboard, Dori scans the exact timeframe since your last visit, strips out duplicate marketing noise using SHA-256 hashes, and delivers a concise 60-second summary.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-5 border-t border-slate-200 dark:border-zinc-800 font-mono">
              <div className="p-2.5 bg-slate-50 dark:bg-[#18181b] border border-slate-200 dark:border-zinc-800 rounded-xl text-center">
                <span className="text-[10px] text-slate-500 dark:text-zinc-400 block font-medium font-sans">Announcements</span>
                <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-zinc-100">03</span>
              </div>
              <div className="p-2.5 bg-slate-50 dark:bg-[#18181b] border border-slate-200 dark:border-zinc-800 rounded-xl text-center">
                <span className="text-[10px] text-slate-500 dark:text-zinc-400 block font-medium font-sans">Discussions</span>
                <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-zinc-100">07</span>
              </div>
              <div className="p-2.5 bg-slate-50 dark:bg-[#18181b] border border-slate-200 dark:border-zinc-800 rounded-xl text-center">
                <span className="text-[10px] text-slate-500 dark:text-zinc-400 block font-medium font-sans">Emerging</span>
                <span className="text-sm sm:text-base font-bold text-[#00d294]">02</span>
              </div>
              <div className="p-2.5 bg-slate-50 dark:bg-[#18181b] border border-red-500/30 rounded-xl text-center">
                <span className="text-[10px] text-red-500 block font-medium font-sans">High Alert</span>
                <span className="text-sm sm:text-base font-bold text-red-500">01</span>
              </div>
            </div>
          </div>

          {/* Bento 2: Multi-Metric Score (Col 4) */}
          <div className="md:col-span-4 p-5 sm:p-7 rounded-2xl bg-white dark:bg-[#121216] border border-slate-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between">
            <div className="space-y-1">
              <h4 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-zinc-100">5-Pillar Score</h4>
              <p className="text-slate-500 dark:text-zinc-400 text-xs font-normal">Each raw item is ranked dynamically across weighted parameters.</p>
            </div>

            <div className="space-y-2 pt-4 text-xs font-mono">
              <div className="flex justify-between items-center border-b border-slate-200 dark:border-zinc-800 pb-1.5">
                <span className="text-slate-500 dark:text-zinc-400 font-sans">Importance</span>
                <span className="text-slate-900 dark:text-zinc-100 font-semibold">30%</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-200 dark:border-zinc-800 pb-1.5">
                <span className="text-slate-500 dark:text-zinc-400 font-sans">Developer Value</span>
                <span className="text-slate-900 dark:text-zinc-100 font-semibold">25%</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-200 dark:border-zinc-800 pb-1.5">
                <span className="text-slate-500 dark:text-zinc-400 font-sans">Community Pulse</span>
                <span className="text-slate-900 dark:text-zinc-100 font-semibold">20%</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-200 dark:border-zinc-800 pb-1.5">
                <span className="text-slate-500 dark:text-zinc-400 font-sans">Novelty Factor</span>
                <span className="text-slate-900 dark:text-zinc-100 font-semibold">15%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 dark:text-zinc-400 font-sans">Actionability</span>
                <span className="text-blue-600 dark:text-blue-400 font-semibold">10%</span>
              </div>
            </div>
          </div>

        </div>

      </section>

      {/* ── Section 4: 5-Step Pipeline (How It Works) ── */}
      <section id="how-it-works" className="py-12 sm:py-16 md:py-20 border-t border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#121216]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="text-center space-y-2">
            <h2 className="text-xl sm:text-3xl font-bold text-slate-900 dark:text-zinc-100 tracking-tight">
              From Raw Feeds to Verified Intelligence
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3.5 text-xs">
            {[
              { step: '01', title: 'Collect', desc: 'RSS, Blogs & re:Post scraped every hour via EventBridge Scheduler.' },
              { step: '02', title: 'Deduplicate', desc: 'SHA-256 hashing verifies zero repeat items across scans.' },
              { step: '03', title: 'Rank & Score', desc: 'Amazon Bedrock multi-metric 0-100 evaluation of developer relevance.' },
              { step: '04', title: 'Synthesize', desc: 'Auto-generates daily briefing, executive bullet points & practical lab.' },
              { step: '05', title: 'Notify', desc: 'Instant SES email alerts dispatched to subscribed Builder IDs.' },
            ].map((s) => (
              <div key={s.step} className="bg-slate-50 dark:bg-[#18181b] border border-slate-200 dark:border-zinc-800 rounded-xl p-4 space-y-1.5 hover:border-blue-400 transition-all shadow-sm">
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 font-mono">{s.step}.</span>
                <h4 className="text-xs font-semibold text-slate-900 dark:text-zinc-100">{s.title}</h4>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400 leading-relaxed font-normal">{s.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── Section 5: Core Engineering Pillars ── */}
      <section id="architecture" className="py-12 sm:py-16 md:py-20 border-t border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-[#09090b]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="text-center space-y-2">
            <h2 className="text-xl sm:text-3xl font-bold text-slate-900 dark:text-zinc-100 tracking-tight">
              Engineered for Modern Cloud Teams
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#18181b] border border-slate-200 dark:border-zinc-800 shadow-sm space-y-2">
              <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Cpu className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-zinc-100">Serverless Autonomous Agent</h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed font-normal">
                Runs 24/7 on AWS Lambda, EventBridge Scheduler, and Amazon DynamoDB with zero idle container costs.
              </p>
            </div>

            <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#18181b] border border-slate-200 dark:border-zinc-800 shadow-sm space-y-2">
              <div className="w-9 h-9 rounded-xl bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-zinc-100">Cryptographic Deduplication</h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed font-normal">
                SHA-256 content hashing guarantees you never read duplicate release updates or syndicated press releases.
              </p>
            </div>

            <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#18181b] border border-slate-200 dark:border-zinc-800 shadow-sm space-y-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-[#00d294] flex items-center justify-center">
                <Volume2 className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-zinc-100">Amazon Polly Voice Synthesizer</h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed font-normal">
                Dori uses Amazon Polly Generative & Neural speech synthesis to read out executive digests hands-free.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ── Section 6: Final CTA & Footer ── */}
      <footer className="relative bg-white dark:bg-[#121216] border-t border-slate-200 dark:border-zinc-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-zinc-800 text-center sm:text-left">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-zinc-100 tracking-tight">
                Build. Ship. Stay Ahead.
              </h2>
            </div>

            <Link
              to="/dashboard"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-medium shadow-sm flex items-center justify-center gap-1.5 transition-all"
            >
              <span>Command Hub</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-zinc-400 font-sans text-center sm:text-left">
            <span>© {new Date().getFullYear()} AWS Signal • Autonomous Cloud Intelligence Platform</span>
            <span>All AWS Trademarks belong to Amazon Web Services, Inc.</span>
          </div>

        </div>
      </footer>

    </div>
  );
};
export default LandingPage;
