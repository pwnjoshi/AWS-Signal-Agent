import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Radio, 
  ArrowUpRight, 
  Flame, 
  Mail, 
  ShieldCheck, 
  Brain, 
  Zap, 
  Clock, 
  Cpu, 
  Volume2, 
  Bookmark, 
  Layers, 
  FileText, 
  BarChart3,
  Search,
  CheckCircle2
} from 'lucide-react';
import { Logo } from './Logo';
import { DoriCompanion } from './DoriCompanion';

interface LandingPageProps {
  onOpenAuthModal?: () => void;
  onGetStarted?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onOpenAuthModal }) => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#09090b] text-slate-900 dark:text-zinc-100 font-sans selection:bg-blue-600 selection:text-white transition-colors duration-200">
      
      {/* ── Top Navigation Bar with Original Logo & Centered Menu ── */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-[#09090b]/80 backdrop-blur-md border-b border-slate-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Original Brand Logo */}
          <Link to="/" className="shrink-0 group">
            <Logo size="md" showText={true} />
          </Link>

          {/* Centered Navigation Menu */}
          <div className="hidden lg:flex items-center justify-center gap-6 text-xs text-slate-600 dark:text-zinc-400 font-medium mx-auto">
            <Link to="/dashboard" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Command Hub</Link>
            <Link to="/signals" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Radar Signals</Link>
            <Link to="/trending" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Friction Matrix</Link>
            <Link to="/briefings" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Daily Digest</Link>
            <Link to="/services" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Cloud Mesh</Link>
            <Link to="/saved" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Vault</Link>
            <a href="#how-it-works" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Architecture</a>
          </div>

          {/* Right Launch CTA */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <Link
              to="/dashboard"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-medium shadow-sm transition-all flex items-center gap-1.5 active:scale-98 cursor-pointer"
            >
              <span>Launch Hub</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Section 1: Hero Showcase ── */}
      <section className="relative overflow-hidden pt-8 pb-10 sm:pt-14 sm:pb-14 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto flex flex-col items-center text-center">
        
        {/* Animated Moving Lightning Shimmer Border Pill (No blinking dot) */}
        <div className="relative p-[1.5px] rounded-full overflow-hidden inline-flex mb-5 shadow-sm">
          <div className="absolute inset-[-100%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#2563eb_0%,#38bdf8_40%,#10b981_70%,#2563eb_100%)]" />
          <div className="relative px-4 py-1.5 rounded-full bg-white dark:bg-[#121216] text-blue-600 dark:text-blue-400 text-xs font-semibold tracking-wide flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Autonomous AWS Intelligence</span>
          </div>
        </div>

        {/* Crisp High-Impact Heading */}
        <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-zinc-100 tracking-tight leading-[1.15] max-w-3xl">
          AWS updates without noise. <br className="hidden sm:inline" />
          Scored by <span className="text-blue-600 dark:text-blue-400">Bedrock</span>. Spoken by <span className="text-indigo-600 dark:text-indigo-400">Dori</span>.
        </h1>

        {/* Clean, Concise Subtitle */}
        <p className="mt-3.5 sm:mt-4 text-xs sm:text-sm md:text-base text-slate-600 dark:text-zinc-400 max-w-xl mx-auto leading-relaxed font-normal">
          Autonomous 24/7 cloud intelligence. Ingests feeds, eliminates duplicate noise via SHA-256 hashing, and delivers hands-free voice briefings.
        </p>

        {/* Action Button Grid */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3.5 w-full max-w-md">
          <Link
            to="/dashboard"
            className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-medium shadow-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-98"
          >
            <span>Open Command Hub</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            to="/signals"
            className="w-full sm:w-auto px-5 py-2.5 bg-white dark:bg-[#18181b] hover:bg-slate-100 dark:hover:bg-[#27272a] text-slate-800 dark:text-zinc-200 border border-slate-200 dark:border-zinc-800 rounded-xl text-xs sm:text-sm font-medium shadow-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <Radio className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Browse Radar Signals</span>
          </Link>
        </div>

        {/* ── Dori Voice Copilot Centered ── */}
        <div className="mt-8 sm:mt-10 flex flex-col items-center justify-center relative z-20 w-full">
          <DoriCompanion
            size="hero"
            showSpeechBubble={true}
          />
        </div>
      </section>

      {/* ── Section 2: Live Agent Telemetry Strip ── */}
      <section className="border-y border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#121216] py-3.5 px-4 sm:px-6 shadow-sm">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-[#00d294] animate-pulse" />
            <span className="font-semibold text-slate-900 dark:text-zinc-100">Live Agent Pipeline:</span>
            <span className="text-slate-500 dark:text-zinc-400">Autonomous Ingestion &amp; Bedrock Scoring</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-[11px] text-slate-600 dark:text-zinc-400 font-mono">
            <span className="flex items-center gap-1.5 font-sans">
              <Zap className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Deduplication: <strong className="font-mono text-slate-900 dark:text-zinc-100 font-semibold">SHA-256 Vault</strong></span>
            </span>
            <span className="flex items-center gap-1.5 font-sans">
              <Brain className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Scoring: <strong className="font-mono text-indigo-600 dark:text-indigo-400 font-semibold">Claude 3.5 Haiku</strong></span>
            </span>
            <span className="flex items-center gap-1.5 font-sans">
              <Clock className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
              <span>Scheduler: <strong className="font-mono text-orange-600 dark:text-orange-400 font-semibold">EventBridge Cron</strong></span>
            </span>
          </div>
        </div>
      </section>

      {/* ── Section 3: Comprehensive Platform Features Grid ── */}
      <section id="features" className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 max-w-6xl mx-auto space-y-10">
        
        <div className="text-center space-y-2">
          <h2 className="text-xl sm:text-3xl md:text-4xl font-bold text-slate-900 dark:text-zinc-100 tracking-tight">
            Complete Command Hub Capabilities
          </h2>
          <p className="text-slate-500 dark:text-zinc-400 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed font-normal">
            Everything you need to monitor, filter, save, and listen to AWS intelligence in one place.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          
          {/* Card 1: Command Hub Dashboard */}
          <Link to="/dashboard" className="group p-5 rounded-2xl bg-white dark:bg-[#121216] border border-slate-200 dark:border-zinc-800 shadow-sm hover:border-blue-500 transition-all flex flex-col justify-between space-y-3">
            <div className="space-y-2">
              <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <BarChart3 className="w-4 h-4" />
              </div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-zinc-100 group-hover:text-blue-600 transition-colors flex items-center justify-between">
                <span>Command Hub</span>
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed font-normal">
                Real-time agent execution telemetry, "While You Were Away" executive delta summaries, high-priority alert meters, and quick actions.
              </p>
            </div>
            <span className="text-[11px] font-medium text-blue-600 dark:text-blue-400 flex items-center gap-1">
              <span>View Dashboard</span>
              <span>&rarr;</span>
            </span>
          </Link>

          {/* Card 2: Radar Intelligence Stream */}
          <Link to="/signals" className="group p-5 rounded-2xl bg-white dark:bg-[#121216] border border-slate-200 dark:border-zinc-800 shadow-sm hover:border-blue-500 transition-all flex flex-col justify-between space-y-3">
            <div className="space-y-2">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <Radio className="w-4 h-4" />
              </div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-zinc-100 group-hover:text-indigo-600 transition-colors flex items-center justify-between">
                <span>Radar Signals Matrix</span>
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed font-normal">
                Live stream of scored cloud updates. Filter by 5-pillar scores, category, AWS service, and source with full-text search.
              </p>
            </div>
            <span className="text-[11px] font-medium text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
              <span>Explore Signals</span>
              <span>&rarr;</span>
            </span>
          </Link>

          {/* Card 3: Friction Matrix */}
          <Link to="/trending" className="group p-5 rounded-2xl bg-white dark:bg-[#121216] border border-slate-200 dark:border-zinc-800 shadow-sm hover:border-amber-500 transition-all flex flex-col justify-between space-y-3">
            <div className="space-y-2">
              <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Flame className="w-4 h-4" />
              </div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-zinc-100 group-hover:text-amber-600 transition-colors flex items-center justify-between">
                <span>Friction Matrix</span>
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed font-normal">
                Tracks community pain points, migration challenges, and emerging architectural debates scraped from AWS re:Post and dev forums.
              </p>
            </div>
            <span className="text-[11px] font-medium text-amber-600 dark:text-amber-400 flex items-center gap-1">
              <span>View Trending Debates</span>
              <span>&rarr;</span>
            </span>
          </Link>

          {/* Card 4: Daily Briefings & Hands-On Labs */}
          <Link to="/briefings" className="group p-5 rounded-2xl bg-white dark:bg-[#121216] border border-slate-200 dark:border-zinc-800 shadow-sm hover:border-purple-500 transition-all flex flex-col justify-between space-y-3">
            <div className="space-y-2">
              <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-zinc-100 group-hover:text-purple-600 transition-colors flex items-center justify-between">
                <span>Daily Digest &amp; Labs</span>
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed font-normal">
                AI-synthesized executive briefings paired with practical step-by-step AWS CLI &amp; CDK implementation labs.
              </p>
            </div>
            <span className="text-[11px] font-medium text-purple-600 dark:text-purple-400 flex items-center gap-1">
              <span>Read Latest Briefing</span>
              <span>&rarr;</span>
            </span>
          </Link>

          {/* Card 5: Cloud Mesh Explorer */}
          <Link to="/services" className="group p-5 rounded-2xl bg-white dark:bg-[#121216] border border-slate-200 dark:border-zinc-800 shadow-sm hover:border-teal-500 transition-all flex flex-col justify-between space-y-3">
            <div className="space-y-2">
              <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                <Layers className="w-4 h-4" />
              </div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-zinc-100 group-hover:text-teal-600 transition-colors flex items-center justify-between">
                <span>Cloud Mesh Explorer</span>
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed font-normal">
                Service-level breakdown of AWS intelligence, tracking velocity, release frequency, and average importance scores per service.
              </p>
            </div>
            <span className="text-[11px] font-medium text-teal-600 dark:text-teal-400 flex items-center gap-1">
              <span>Explore Cloud Mesh</span>
              <span>&rarr;</span>
            </span>
          </Link>

          {/* Card 6: Personal Bookmarks Vault */}
          <Link to="/saved" className="group p-5 rounded-2xl bg-white dark:bg-[#121216] border border-slate-200 dark:border-zinc-800 shadow-sm hover:border-[#00d294] transition-all flex flex-col justify-between space-y-3">
            <div className="space-y-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-[#00d294] flex items-center justify-center">
                <Bookmark className="w-4 h-4" />
              </div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-zinc-100 group-hover:text-[#00d294] transition-colors flex items-center justify-between">
                <span>Bookmarks Vault</span>
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-[#00d294] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed font-normal">
                Isolated per-account storage verified via AWS Builder Center. Save critical signals, export architecture bookmarks, and manage custom topics.
              </p>
            </div>
            <span className="text-[11px] font-medium text-[#00d294] flex items-center gap-1">
              <span>Open Vault</span>
              <span>&rarr;</span>
            </span>
          </Link>

        </div>
      </section>

      {/* ── Section 4: 5-Pillar Scoring Breakdown ── */}
      <section id="intelligence" className="py-12 sm:py-16 md:py-20 border-t border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#121216]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="text-center space-y-2">
            <h2 className="text-xl sm:text-3xl md:text-4xl font-bold text-slate-900 dark:text-zinc-100 tracking-tight">
              5-Pillar Multi-Metric Evaluation
            </h2>
            <p className="text-slate-500 dark:text-zinc-400 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed font-normal">
              Amazon Bedrock Claude evaluates every single release across 5 weighted dimensions.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3.5 text-xs">
            {[
              { score: '30%', title: 'Architecture Importance', desc: 'Long-term structural impact on cloud infrastructure and resilience.' },
              { score: '25%', title: 'Developer Value', desc: 'Day-to-day engineering velocity, SDK ergonomics, and workflow impact.' },
              { score: '20%', title: 'Community Pulse', desc: 'Velocity of questions, discussions, and migration challenges on re:Post.' },
              { score: '15%', title: 'Novelty Factor', desc: 'Uniqueness of capability versus existing cloud patterns.' },
              { score: '10%', title: 'Actionability', desc: 'Direct steps to adopt or migrate without breaking changes.' },
            ].map((p) => (
              <div key={p.title} className="bg-slate-50 dark:bg-[#18181b] border border-slate-200 dark:border-zinc-800 rounded-xl p-4 space-y-2 hover:border-blue-400 transition-all shadow-sm">
                <span className="text-base font-bold text-blue-600 dark:text-blue-400 font-mono">{p.score}</span>
                <h4 className="text-xs font-semibold text-slate-900 dark:text-zinc-100 leading-tight">{p.title}</h4>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400 leading-relaxed font-normal">{p.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── Section 5: 5-Step Pipeline (How It Works) ── */}
      <section id="how-it-works" className="py-12 sm:py-16 md:py-20 border-t border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-[#09090b]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="text-center space-y-2">
            <h2 className="text-xl sm:text-3xl font-bold text-slate-900 dark:text-zinc-100 tracking-tight">
              From Raw Feeds to Actionable Intelligence
            </h2>
            <p className="text-slate-500 dark:text-zinc-400 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed font-normal">
              Autonomous end-to-end serverless pipeline with zero manual intervention.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3.5 text-xs">
            {[
              { step: '01', title: 'Scrape Feeds', desc: 'Hourly EventBridge triggers scrape 6 AWS RSS feeds, blogs, and re:Post.' },
              { step: '02', title: 'SHA-256 Dedupe', desc: 'Cryptographic hash vault strips repeat items and syndicated announcements.' },
              { step: '03', title: 'Bedrock 5-Pillar Score', desc: 'Anthropic Claude evaluates architectural importance from 0 to 100.' },
              { step: '04', title: 'Synthesize Digests', desc: 'Auto-generates daily briefing, executive bullet points & CDK labs.' },
              { step: '05', title: 'Instant SES Alerts', desc: 'Dispatches high-priority (score >= 80) email notifications to builders.' },
            ].map((s) => (
              <div key={s.step} className="bg-white dark:bg-[#18181b] border border-slate-200 dark:border-zinc-800 rounded-xl p-4 space-y-1.5 hover:border-blue-400 transition-all shadow-sm">
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 font-mono">{s.step}.</span>
                <h4 className="text-xs font-semibold text-slate-900 dark:text-zinc-100">{s.title}</h4>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400 leading-relaxed font-normal">{s.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── Section 6: Final CTA & Footer ── */}
      <footer className="relative bg-white dark:bg-[#121216] border-t border-slate-200 dark:border-zinc-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-zinc-800 text-center sm:text-left">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-zinc-100 tracking-tight">
                Build. Ship. Stay Ahead with AWS Signal.
              </h2>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                Autonomous cloud intelligence network powered by Amazon Bedrock &amp; Polly.
              </p>
            </div>

            <Link
              to="/dashboard"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-medium shadow-sm flex items-center justify-center gap-1.5 transition-all"
            >
              <span>Launch Command Hub</span>
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
