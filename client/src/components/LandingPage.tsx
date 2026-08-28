import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Radio, 
  ArrowRight, 
  ArrowUpRight, 
  ShieldCheck, 
  Zap, 
  Volume2, 
  VolumeX, 
  Cpu, 
  Terminal, 
  Clock, 
  Brain
} from 'lucide-react';
import { GEUNavbar as Navbar } from './GEUNavbar';
import { ParticleBackground } from './ParticleBackground';
import { useTheme } from '../context/ThemeContext';

interface LandingPageProps {
  onGetStarted: () => void;
  onOpenAuthModal?: () => void;
}

const DORI_PROMPTS = [
  {
    category: 'Architecture',
    q: 'What changed in AWS Lambda SnapStart today?',
    a: 'Java 21 managed runtime SnapStart support expanded to 6 new regions with 90% p99 latency reduction. Zero cold-start tax on containerized functions.',
    impact: 'High Impact • Architecture Optimization',
  },
  {
    category: 'Bedrock AI',
    q: 'Did Anthropic Claude 3.5 Sonnet get updated?',
    a: 'Cross-region inference profiles are now enabled across us-east-1 and us-west-2 for automatic burst failover during high-demand generative workloads.',
    impact: 'Critical • Production Resilience',
  },
  {
    category: 'Security',
    q: 'Any security alerts on S3 or IAM?',
    a: 'No high-risk CVEs detected in the last 24h. AWS IAM Access Analyzer added 5 new automated policy checks for cross-account trust validation.',
    impact: 'Safe • Security Verified',
  },
];

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onOpenAuthModal }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activePromptIdx, setActivePromptIdx] = useState(0);
  const { theme } = useTheme();

  const handleAudioNarration = () => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported in your browser.');
      return;
    }
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const textToSpeak = `Good morning builders! This is Dori, your autonomous cloud intelligence companion. In the last 24 hours across the AWS cloud matrix: 247 announcements ingested, 18 high-relevance updates identified, and 4 critical signals flagged for your architecture. Lambda SnapStart latency reduced by 90%, Amazon Bedrock cross-region inference profiles activated, and zero duplicate signals in your deduplication vault. Stay informed and happy building!`;

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 1.05;
    utterance.pitch = 1.1;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#09090b] text-slate-900 dark:text-zinc-100 selection:bg-blue-500/20 selection:text-blue-600 relative font-sans overflow-x-hidden transition-colors">
      
      {/* Background Grid & Canvas */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute inset-0 site-main-grid opacity-40" />
        <ParticleBackground />
      </div>

      {/* Standalone Navigation */}
      <Navbar onOpenAuthModal={onOpenAuthModal} onLaunchDashboard={onGetStarted} />

      {/* ── Section 1: Clean, Professional Hero ── */}
      <section id="home" className="relative pt-32 sm:pt-40 pb-16 sm:pb-24 min-h-[80vh] flex items-center justify-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6 relative z-10">
          
          {/* Clean Main Headline */}
          <div className="space-y-4">
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-slate-900 dark:text-zinc-100 leading-[1.15]">
              Where Cloud Builders Stay Informed
            </h1>

            <p className="text-sm sm:text-lg text-slate-500 dark:text-zinc-400 max-w-2xl mx-auto font-normal leading-relaxed">
              An autonomous cloud intelligence platform powered by Amazon Bedrock. AWS Signal monitors hundreds of release feeds, analyzes developer friction on re:Post, and delivers personalized audio briefings before breaking your stack.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              to="/dashboard"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs sm:text-sm font-medium shadow-sm active:scale-98 transition-all flex items-center gap-2"
            >
              <Radio className="w-4 h-4" />
              <span>Launch Command Hub</span>
            </Link>

            <button
              onClick={handleAudioNarration}
              className={`px-4 py-2.5 rounded-lg text-xs sm:text-sm font-medium border transition-all flex items-center gap-2 cursor-pointer ${
                isSpeaking
                  ? 'bg-amber-500 text-white border-amber-400'
                  : 'bg-white dark:bg-[#18181b] border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-[#202026] text-slate-800 dark:text-zinc-200'
              }`}
            >
              {isSpeaking ? (
                <>
                  <VolumeX className="w-4 h-4" />
                  <span>Stop Briefing</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>Listen to Dori (Audio)</span>
                </>
              )}
            </button>
          </div>

        </div>
      </section>

      {/* ── Section 2: Live Status Strip ── */}
      <section className="border-y border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-[#121216] py-3.5 text-xs text-slate-700 dark:text-zinc-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-[#00d294]" />
            <span className="font-semibold text-slate-900 dark:text-zinc-100">Live Agent Heartbeat:</span>
            <span className="text-slate-500 dark:text-zinc-400">Active Ingestion Pipeline</span>
          </div>

          <div className="flex flex-wrap items-center gap-5 text-[11px] text-slate-600 dark:text-zinc-400 font-mono">
            <span className="flex items-center gap-1.5 font-sans">
              <Zap className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Deduplication: <strong className="text-slate-900 dark:text-zinc-100 font-semibold font-mono">SHA-256 Memory</strong></span>
            </span>
            <span className="flex items-center gap-1.5 font-sans">
              <Brain className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Model: <strong className="text-blue-600 dark:text-blue-400 font-semibold font-mono">Amazon Bedrock Claude 3.5</strong></span>
            </span>
            <span className="flex items-center gap-1.5 font-sans">
              <Clock className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
              <span>Interval: <strong className="text-orange-600 dark:text-orange-400 font-semibold font-mono">EventBridge Cron</strong></span>
            </span>
          </div>
        </div>
      </section>

      {/* ── Section 3: Bento Grid Intelligence ── */}
      <section id="intelligence" className="py-16 sm:py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
          
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 dark:text-zinc-100 tracking-tight">
              The Architecture of Clarity
            </h2>
            <p className="text-slate-500 dark:text-zinc-400 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
              Why browse 50 AWS release pages when an autonomous agent can score, synthesize, and filter for you?
            </p>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            
            {/* Bento 1: While You Were Away (Col 8) */}
            <div className="md:col-span-8 p-6 sm:p-7 rounded-xl bg-white dark:bg-[#121216] border border-slate-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between min-h-[280px]">
              <div>
                <h3 className="text-lg md:text-xl font-semibold text-slate-900 dark:text-zinc-100 mb-2">
                  "While You Were Away" Executive Synthesis
                </h3>
                <p className="text-slate-500 dark:text-zinc-400 text-xs sm:text-sm leading-relaxed max-w-2xl font-normal">
                  Never suffer from release fatigue. Whenever you open the dashboard, Dori scans the exact timeframe since your last visit, strips out duplicate marketing noise using SHA-256 hashes, and delivers a concise 60-second summary.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-5 border-t border-slate-200 dark:border-zinc-800 font-mono">
                <div className="p-2.5 bg-slate-50 dark:bg-[#18181b] border border-slate-200 dark:border-zinc-800 rounded-lg">
                  <span className="text-[10px] text-slate-500 dark:text-zinc-400 block font-medium font-sans">Announcements</span>
                  <span className="text-base font-bold text-slate-900 dark:text-zinc-100">03</span>
                </div>
                <div className="p-2.5 bg-slate-50 dark:bg-[#18181b] border border-slate-200 dark:border-zinc-800 rounded-lg">
                  <span className="text-[10px] text-slate-500 dark:text-zinc-400 block font-medium font-sans">Discussions</span>
                  <span className="text-base font-bold text-slate-900 dark:text-zinc-100">07</span>
                </div>
                <div className="p-2.5 bg-slate-50 dark:bg-[#18181b] border border-slate-200 dark:border-zinc-800 rounded-lg">
                  <span className="text-[10px] text-slate-500 dark:text-zinc-400 block font-medium font-sans">Emerging</span>
                  <span className="text-base font-bold text-[#00d294]">02</span>
                </div>
                <div className="p-2.5 bg-slate-50 dark:bg-[#18181b] border border-red-500/30 rounded-lg">
                  <span className="text-[10px] text-red-500 block font-medium font-sans">High Alert</span>
                  <span className="text-base font-bold text-red-500">01</span>
                </div>
              </div>
            </div>

            {/* Bento 2: Multi-Metric Score (Col 4) */}
            <div className="md:col-span-4 p-6 sm:p-7 rounded-xl bg-white dark:bg-[#121216] border border-slate-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between">
              <div className="space-y-1">
                <h4 className="text-base font-semibold text-slate-900 dark:text-zinc-100">5-Pillar Score</h4>
                <p className="text-slate-500 dark:text-zinc-400 text-xs font-normal">Each raw item is ranked dynamically across weighted parameters.</p>
              </div>

              <div className="space-y-2 pt-3 text-xs font-mono">
                <div className="flex justify-between items-center border-b border-slate-200 dark:border-zinc-800 pb-1">
                  <span className="text-slate-500 dark:text-zinc-400 font-sans">Importance</span>
                  <span className="text-slate-900 dark:text-zinc-100 font-semibold">30%</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-200 dark:border-zinc-800 pb-1">
                  <span className="text-slate-500 dark:text-zinc-400 font-sans">Developer Value</span>
                  <span className="text-slate-900 dark:text-zinc-100 font-semibold">25%</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-200 dark:border-zinc-800 pb-1">
                  <span className="text-slate-500 dark:text-zinc-400 font-sans">Community Pulse</span>
                  <span className="text-slate-900 dark:text-zinc-100 font-semibold">20%</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-200 dark:border-zinc-800 pb-1">
                  <span className="text-slate-500 dark:text-zinc-400 font-sans">Novelty Factor</span>
                  <span className="text-slate-900 dark:text-zinc-100 font-semibold">15%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-zinc-400 font-sans">Actionability</span>
                  <span className="text-blue-600 dark:text-blue-400 font-semibold">10%</span>
                </div>
              </div>
            </div>

            {/* Bento 3: Meet Dori Simulator (Col 12) */}
            <div id="dori" className="md:col-span-12 p-6 sm:p-7 rounded-xl bg-white dark:bg-[#121216] border border-slate-200 dark:border-zinc-800 shadow-sm flex flex-col space-y-4">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1 max-w-2xl">
                  <h3 className="text-lg md:text-xl font-semibold text-slate-900 dark:text-zinc-100">
                    Meet Dori: Your Autonomous Cloud Specialist
                  </h3>
                  <p className="text-slate-500 dark:text-zinc-400 text-xs sm:text-sm leading-relaxed font-normal">
                    Dori runs autonomously in the background, learns your Builder ID stack preferences, and only surfaces intelligence that directly impacts your systems.
                  </p>
                </div>

                <div className="flex gap-2">
                  {DORI_PROMPTS.map((p, idx) => (
                    <button
                      key={p.category}
                      onClick={() => setActivePromptIdx(idx)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                        activePromptIdx === idx
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-50 dark:bg-[#18181b] border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100'
                      }`}
                    >
                      {p.category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dori Simulator Box */}
              <div className="bg-slate-50 dark:bg-[#18181b] border border-slate-200 dark:border-zinc-800 rounded-lg p-4 sm:p-5 space-y-2">
                <div className="flex items-start gap-2.5 text-xs text-blue-600 dark:text-blue-400 font-semibold font-mono">
                  <Terminal className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>"{DORI_PROMPTS[activePromptIdx].q}"</span>
                </div>
                <div className="pl-6 text-xs text-slate-700 dark:text-zinc-300 font-sans leading-relaxed font-normal">
                  {DORI_PROMPTS[activePromptIdx].a}
                </div>
                <div className="pl-6 pt-1 flex items-center gap-2 text-[11px] text-slate-500 dark:text-zinc-400 font-sans">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00d294]" />
                  <span>{DORI_PROMPTS[activePromptIdx].impact}</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ── Section 4: 5-Step Pipeline (How It Works) ── */}
      <section id="how-it-works" className="py-16 sm:py-24 border-t border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-[#121216]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-zinc-100 tracking-tight">
              From Raw Feeds to Verified Intelligence
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5 text-xs">
            {[
              { step: '01', title: 'Collect', desc: 'RSS, Blogs & re:Post scraped every hour via EventBridge Scheduler.' },
              { step: '02', title: 'Deduplicate', desc: 'SHA-256 hashing verifies zero repeat items across scans.' },
              { step: '03', title: 'Rank & Score', desc: 'Amazon Bedrock multi-metric 0-100 evaluation of developer relevance.' },
              { step: '04', title: 'Synthesize', desc: 'Auto-generates daily briefing, executive bullet points & practical lab.' },
              { step: '05', title: 'Notify', desc: 'Instant SES email alerts dispatched to subscribed Builder IDs.' },
            ].map((s) => (
              <div key={s.step} className="bg-white dark:bg-[#18181b] border border-slate-200 dark:border-zinc-800 rounded-lg p-4 space-y-1.5 hover:border-blue-400 transition-all shadow-sm">
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 font-mono">{s.step}.</span>
                <h4 className="text-xs font-semibold text-slate-900 dark:text-zinc-100">{s.title}</h4>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400 leading-relaxed font-normal">{s.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── Section 5: Core Engineering Pillars ── */}
      <section id="architecture" className="py-16 sm:py-24 border-t border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#09090b]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-zinc-100 tracking-tight">
              Engineered for Modern Cloud Teams
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-5 sm:p-6 rounded-xl bg-slate-50 dark:bg-[#18181b] border border-slate-200 dark:border-zinc-800 shadow-sm space-y-2">
              <div className="w-9 h-9 rounded-lg bg-white dark:bg-[#202026] border border-slate-200 dark:border-zinc-700 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <Cpu className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-zinc-100">Serverless Autonomous Agent</h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed font-normal">
                Runs 24/7 on AWS Lambda, EventBridge Scheduler, and Amazon DynamoDB with zero idle container costs.
              </p>
            </div>

            <div className="p-5 sm:p-6 rounded-xl bg-slate-50 dark:bg-[#18181b] border border-slate-200 dark:border-zinc-800 shadow-sm space-y-2">
              <div className="w-9 h-9 rounded-lg bg-white dark:bg-[#202026] border border-slate-200 dark:border-zinc-700 flex items-center justify-center text-orange-600 dark:text-orange-400">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-zinc-100">Cryptographic Deduplication</h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed font-normal">
                SHA-256 content hashing guarantees you never read duplicate release updates or syndicated press releases.
              </p>
            </div>

            <div className="p-5 sm:p-6 rounded-xl bg-slate-50 dark:bg-[#18181b] border border-slate-200 dark:border-zinc-800 shadow-sm space-y-2">
              <div className="w-9 h-9 rounded-lg bg-white dark:bg-[#202026] border border-slate-200 dark:border-zinc-700 flex items-center justify-center text-[#00d294]">
                <Volume2 className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-zinc-100">Audio Voice Synthesizer</h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed font-normal">
                Dori's built-in neural speech engine reads out executive morning digests so you can listen hands-free.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ── Section 6: Final CTA & Footer ── */}
      <footer className="relative bg-slate-50 dark:bg-[#121216] border-t border-slate-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
          
          <div className="py-6 border-b border-slate-200 dark:border-zinc-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-zinc-100 tracking-tight">
                Build. Ship. Stay Ahead.
              </h2>
            </div>

            <Link
              to="/dashboard"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs sm:text-sm font-medium shadow-sm flex items-center gap-1.5 transition-all"
            >
              <span>Launch Command Hub</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-zinc-400 font-sans">
            <span>© {new Date().getFullYear()} AWS Signal • Autonomous Cloud Intelligence Platform</span>
            <span>All AWS Trademarks belong to Amazon Web Services, Inc.</span>
          </div>

        </div>
      </footer>

    </div>
  );
};
export default LandingPage;
