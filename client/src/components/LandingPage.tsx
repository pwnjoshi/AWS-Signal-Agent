import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Radio, 
  Sparkles, 
  Play, 
  ArrowRight, 
  ArrowUpRight, 
  ShieldCheck, 
  Zap, 
  Volume2, 
  VolumeX, 
  CheckCircle2, 
  Cpu, 
  Layers, 
  Activity, 
  MessageSquare, 
  Cloud, 
  Compass, 
  Terminal, 
  Share2, 
  Lock, 
  ChevronRight, 
  Mail, 
  Users, 
  Database,
  Flame
} from 'lucide-react';
import { GEUNavbar } from './GEUNavbar';
import { ParticleBackground } from './ParticleBackground';
import { DoriCompanion } from './DoriCompanion';
import { useTheme } from '../context/ThemeContext';

interface LandingPageProps {
  onGetStarted: () => void;
  onOpenAuthModal?: () => void;
}

const HERO_CYCLES = [
  'WITH CLOUD & AI',
  'ON THE AWS CLOUD',
  'AUTONOMOUSLY 24/7',
  'BEFORE BREAKING PROD',
];

const DORI_PROMPTS = [
  {
    category: 'Architecture',
    q: '“What changed in Lambda SnapStart today?”',
    a: 'Java 21 managed runtime SnapStart support expanded to 6 new regions with 90% p99 latency reduction. Zero cold-start tax on containerized functions.',
    impact: 'High Impact • Architecture Optimization',
  },
  {
    category: 'Bedrock AI',
    q: '“Did Anthropic Claude 3.5 Sonnet get updated?”',
    a: 'Cross-region inference profiles are now enabled across us-east-1 and us-west-2 for automatic burst failover during high-demand generative workloads.',
    impact: 'Critical • Production Resilience',
  },
  {
    category: 'Security',
    q: '“Any security alerts on S3 or IAM?”',
    a: 'No high-risk CVEs detected in the last 24h. AWS IAM Access Analyzer added 5 new automated policy checks for cross-account trust validation.',
    impact: 'Safe • Security Verified',
  },
];

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onOpenAuthModal }) => {
  const [cycleIndex, setCycleIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activePromptIdx, setActivePromptIdx] = useState(0);
  const { theme } = useTheme();

  useEffect(() => {
    const interval = setInterval(() => {
      setCycleIndex((prev) => (prev + 1) % HERO_CYCLES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

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

    const textToSpeak = `Good morning AWS builders! This is Dori, your autonomous cloud intelligence companion. In the last 24 hours across the AWS cloud matrix: 247 announcements ingested, 18 high-relevance updates identified, and 4 critical signals flagged for your architecture. Lambda SnapStart latency reduced by 90%, Amazon Bedrock cross-region inference profiles activated, and zero duplicate signals in your deduplication vault. Stay informed and happy building!`;

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 1.05;
    utterance.pitch = 1.1;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="min-h-screen bg-background text-on-background selection:bg-primary/20 selection:text-primary relative font-sans overflow-x-hidden transition-colors">
      
      {/* Particle Canvas & Grid */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute inset-0 site-main-grid opacity-30" />
        <ParticleBackground />
      </div>

      {/* Capsule Navigation */}
      <GEUNavbar onOpenAuthModal={onOpenAuthModal} onLaunchDashboard={onGetStarted} />

      {/* ── Section 1: Hero Section ── */}
      <section id="home" className="relative pt-28 sm:pt-36 pb-16 sm:pb-24 min-h-[85vh] flex items-center justify-center">
        
        {/* Floating AWS Badges on Desktop */}
        <div className="hidden lg:block absolute left-8 top-1/3 -translate-y-1/2 pointer-events-none">
          <div className="w-12 h-12 rounded-xl bg-surface border border-outline shadow-sm flex items-center justify-center p-2">
            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg" alt="AWS" className="w-full h-full object-contain" />
          </div>
          <div className="w-11 h-11 rounded-xl bg-surface border border-outline shadow-sm flex items-center justify-center p-2 mt-6">
            <span className="text-[10px] font-mono font-black text-primary">EC2</span>
          </div>
        </div>

        <div className="hidden lg:block absolute right-8 top-1/3 -translate-y-1/2 pointer-events-none">
          <div className="w-12 h-12 rounded-xl bg-surface border border-outline shadow-sm flex items-center justify-center p-2">
            <span className="text-xs font-mono font-black text-[#fe9800]">Lambda</span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-surface border border-outline shadow-sm flex items-center justify-center p-2 mt-6">
            <span className="text-[10px] font-mono font-black text-[#00d294]">S3</span>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-7 relative z-10">
          
          {/* Active Builder Status Badge */}
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1 rounded-lg bg-surface border border-outline shadow-sm font-mono text-xs text-on-surface-variant hover:border-primary/40 transition-all">
            <span className="w-2 h-2 rounded-full bg-[#00d294]" />
            <span className="font-bold text-on-background">800+ Active Builders • GEU</span>
            <span className="text-outline">•</span>
            <span className="text-primary font-bold">AWS Signal 2.0</span>
          </div>

          {/* Bold Main Headline with Cycling Typography */}
          <div className="space-y-3">
            <h1 className="font-black font-display leading-[1.1] tracking-tight uppercase text-3xl sm:text-5xl md:text-6xl text-on-background">
              WHERE CLOUD BUILDERS <br />
              <span className="inline-flex items-center px-3.5 py-0.5 rounded-lg bg-surface-low border border-outline text-primary text-[0.8em] font-mono uppercase tracking-wider font-extrabold align-middle my-1">
                STAY INFORMED
              </span> <br />
              <span className="text-primary">
                {HERO_CYCLES[cycleIndex]}
              </span>
            </h1>

            <p className="max-w-2xl mx-auto text-xs sm:text-sm text-on-surface-variant leading-relaxed font-sans">
              An autonomous cloud intelligence agent powered by Amazon Bedrock. AWS Signal monitors hundreds of release feeds, analyzes developer friction on re:Post, and delivers personalized audio briefings before breaking your stack.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-1 font-mono">
            <Link
              to="/dashboard"
              className="px-5 py-2.5 bg-primary text-white hover:bg-primary-container rounded-lg text-xs font-bold uppercase tracking-wide shadow-sm active:scale-98 transition-all flex items-center gap-2"
            >
              <Radio className="w-4 h-4" />
              <span>Launch Command Hub</span>
            </Link>

            <button
              onClick={handleAudioNarration}
              className={`px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wide border transition-all flex items-center gap-2 cursor-pointer ${
                isSpeaking
                  ? 'bg-amber-500 text-white border-amber-400'
                  : 'bg-surface border-outline hover:bg-surface-container text-on-background'
              }`}
            >
              {isSpeaking ? (
                <>
                  <VolumeX className="w-4 h-4" />
                  <span>Stop Briefing</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 text-primary" />
                  <span>Listen to Dori (Audio)</span>
                </>
              )}
            </button>
          </div>

        </div>
      </section>

      {/* ── Section 2: Live Status Strip ── */}
      <section className="border-y border-outline bg-surface-low py-3.5 font-mono text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-[#00d294]" />
            <span className="font-bold text-on-background uppercase">Live Agent Heartbeat:</span>
            <span className="text-on-surface-variant">Active Ingestion Pipeline</span>
          </div>

          <div className="flex flex-wrap items-center gap-5 text-[11px] text-on-surface-variant">
            <span>⚡ Deduplication: <strong className="text-on-background font-bold">SHA-256 Memory</strong></span>
            <span>🧠 Model: <strong className="text-primary font-bold">Amazon Bedrock Claude 3.5</strong></span>
            <span>⏱ Interval: <strong className="text-[#fe9800] font-bold">EventBridge Cron</strong></span>
          </div>
        </div>
      </section>

      {/* ── Section 3: Bento Grid Intelligence ── */}
      <section id="intelligence" className="py-16 sm:py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
          
          <div className="text-center space-y-2">
            <span className="text-xs font-mono font-bold text-primary uppercase tracking-widest block">
              Autonomous Cloud Intelligence
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black font-display text-on-background tracking-tight uppercase">
              The Architecture of Clarity
            </h2>
            <p className="text-on-surface-variant text-xs sm:text-sm max-w-xl mx-auto leading-relaxed font-sans">
              Why browse 50 AWS release pages when an autonomous agent can score, synthesize, and filter for you?
            </p>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            
            {/* Bento 1: While You Were Away (Col 8) */}
            <div className="md:col-span-8 p-7 rounded-xl bg-surface border border-outline shadow-sm flex flex-col justify-between min-h-[300px]">
              <div>
                <span className="text-[10px] font-mono font-bold text-primary uppercase tracking-widest block mb-1.5">Signature Capability</span>
                <h3 className="text-lg md:text-xl font-bold text-on-background uppercase mb-2 font-display">
                  "While You Were Away" Executive Synthesis
                </h3>
                <p className="text-on-surface-variant text-xs sm:text-sm leading-relaxed max-w-2xl font-light font-sans">
                  Never suffer from release fatigue. Whenever you open the dashboard, Dori scans the exact timeframe since your last visit, strips out duplicate marketing noise using SHA-256 hashes, and delivers a concise 60-second summary.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-5 border-t border-outline font-mono">
                <div className="p-2.5 bg-surface-low border border-outline rounded-lg">
                  <span className="text-[9px] text-on-surface-variant uppercase block font-bold">Announcements</span>
                  <span className="text-base font-black text-on-background">03</span>
                </div>
                <div className="p-2.5 bg-surface-low border border-outline rounded-lg">
                  <span className="text-[9px] text-on-surface-variant uppercase block font-bold">Discussions</span>
                  <span className="text-base font-black text-on-background">07</span>
                </div>
                <div className="p-2.5 bg-surface-low border border-outline rounded-lg">
                  <span className="text-[9px] text-on-surface-variant uppercase block font-bold">Emerging</span>
                  <span className="text-base font-black text-[#00d294]">02</span>
                </div>
                <div className="p-2.5 bg-surface-low border border-red-500/30 rounded-lg">
                  <span className="text-[9px] text-red-500 uppercase block font-bold">High Alert</span>
                  <span className="text-base font-black text-red-500">01</span>
                </div>
              </div>
            </div>

            {/* Bento 2: Multi-Metric Score (Col 4) */}
            <div className="md:col-span-4 p-7 rounded-xl bg-surface border border-outline shadow-sm flex flex-col justify-between font-mono">
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono font-bold text-primary uppercase tracking-widest block">Bedrock Algorithm</span>
                <h4 className="text-base font-bold text-on-background uppercase font-display">5-Pillar Score</h4>
                <p className="text-on-surface-variant text-xs font-sans">Each raw item is ranked dynamically across weighted parameters.</p>
              </div>

              <div className="space-y-2 pt-3 text-xs">
                <div className="flex justify-between items-center border-b border-outline pb-1">
                  <span className="text-on-surface-variant">Importance</span>
                  <span className="text-on-background font-bold">30%</span>
                </div>
                <div className="flex justify-between items-center border-b border-outline pb-1">
                  <span className="text-on-surface-variant">Developer Value</span>
                  <span className="text-on-background font-bold">25%</span>
                </div>
                <div className="flex justify-between items-center border-b border-outline pb-1">
                  <span className="text-on-surface-variant">Community Pulse</span>
                  <span className="text-on-background font-bold">20%</span>
                </div>
                <div className="flex justify-between items-center border-b border-outline pb-1">
                  <span className="text-on-surface-variant">Novelty Factor</span>
                  <span className="text-on-background font-bold">15%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-on-surface-variant">Actionability</span>
                  <span className="text-primary font-bold">10%</span>
                </div>
              </div>
            </div>

            {/* Bento 3: Meet Dori Simulator (Col 12) */}
            <div id="dori" className="md:col-span-12 p-7 rounded-xl bg-surface border border-outline shadow-sm flex flex-col space-y-5">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1.5 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary" />
                    <span className="text-[10px] font-mono font-bold text-primary uppercase tracking-widest block">AI Companion</span>
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-on-background uppercase font-display">
                    Meet Dori: Your Autonomous Cloud Specialist
                  </h3>
                  <p className="text-on-surface-variant text-xs sm:text-sm leading-relaxed font-light font-sans">
                    Dori runs autonomously in the background, learns your Builder ID stack preferences, and only surfaces intelligence that directly impacts your systems.
                  </p>
                </div>

                <div className="flex gap-2">
                  {DORI_PROMPTS.map((p, idx) => (
                    <button
                      key={p.category}
                      onClick={() => setActivePromptIdx(idx)}
                      className={`px-3 py-1 rounded-lg text-xs font-mono font-bold uppercase transition-all cursor-pointer ${
                        activePromptIdx === idx
                          ? 'bg-primary text-white'
                          : 'bg-surface-low border border-outline text-on-surface-variant hover:text-on-background'
                      }`}
                    >
                      {p.category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dori Simulator Box */}
              <div className="bg-surface-low border border-outline rounded-lg p-5 font-mono space-y-3">
                <div className="flex items-start gap-2.5 text-xs text-primary font-bold">
                  <Terminal className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{DORI_PROMPTS[activePromptIdx].q}</span>
                </div>
                <div className="pl-6 text-xs text-on-background font-sans leading-relaxed">
                  {DORI_PROMPTS[activePromptIdx].a}
                </div>
                <div className="pl-6 pt-1 flex items-center gap-2 text-[10px] text-on-surface-variant">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00d294]" />
                  <span>{DORI_PROMPTS[activePromptIdx].impact}</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ── Section 4: 5-Step Pipeline (How It Works) ── */}
      <section id="how-it-works" className="py-16 sm:py-24 border-t border-outline bg-surface-low">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="text-center space-y-2 font-mono">
            <span className="text-xs font-bold text-primary uppercase tracking-widest block">
              Autonomous Pipeline
            </span>
            <h2 className="text-2xl sm:text-3xl font-black font-display text-on-background tracking-tight uppercase">
              From Raw RSS to Verified Intelligence
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5 font-mono text-xs">
            {[
              { step: '01', title: 'Collect', desc: 'RSS, Blogs & re:Post scraped every hour via EventBridge Scheduler.' },
              { step: '02', title: 'Deduplicate', desc: 'SHA-256 hashing verifies zero repeat items across scans.' },
              { step: '03', title: 'Rank & Score', desc: 'Amazon Bedrock multi-metric 0-100 evaluation of developer relevance.' },
              { step: '04', title: 'Synthesize', desc: 'Auto-generates daily briefing, executive bullet points & practical lab.' },
              { step: '05', title: 'Notify', desc: 'Instant SES email alerts dispatched to subscribed Builder IDs.' },
            ].map((s) => (
              <div key={s.step} className="bg-surface border border-outline rounded-lg p-4 space-y-1.5 hover:border-primary/40 transition-all shadow-sm">
                <span className="text-xs font-black text-primary">{s.step}.</span>
                <h4 className="text-xs font-bold text-on-background uppercase">{s.title}</h4>
                <p className="text-[11px] text-on-surface-variant font-sans leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── Section 5: Leadership Roster ── */}
      <section className="py-16 sm:py-24 border-t border-outline">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="text-center space-y-2 font-mono">
            <span className="text-xs font-bold text-primary uppercase tracking-widest block">
              Graphic Era University Chapter
            </span>
            <h2 className="text-2xl sm:text-3xl font-black font-display text-on-background tracking-tight uppercase">
              Founded & Driven by Builders
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
            {/* Faculty Lead */}
            <div className="group relative rounded-xl overflow-hidden border border-outline bg-surface aspect-[3/4] shadow-sm">
              <img 
                src="/faculty/dr_amit_kumar.jpg" 
                alt="Dr. Amit Kumar" 
                className="absolute inset-0 w-full h-full object-cover object-[center_15%]"
                onError={(e: any) => { e.target.src = 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&q=80&w=800'; }}
              />
              <div className="absolute bottom-0 inset-x-0 h-1/2 bg-gradient-to-t from-black/95 via-black/50 to-transparent pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-full p-3 flex flex-col justify-end font-mono">
                <span className="text-[8px] font-bold text-primary uppercase tracking-wider bg-black/60 px-1.5 py-0.5 rounded w-fit mb-0.5">
                  Faculty Lead
                </span>
                <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-tight truncate">
                  Dr. Amit Kumar
                </h3>
              </div>
            </div>

            {/* Group Lead */}
            <div className="group relative rounded-xl overflow-hidden border border-outline bg-surface aspect-[3/4] shadow-sm">
              <img 
                src="/team/pawan_joshi.jpg" 
                alt="Pawan Joshi" 
                className="absolute inset-0 w-full h-full object-cover object-[center_15%]"
                onError={(e: any) => { e.target.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=800'; }}
              />
              <div className="absolute bottom-0 inset-x-0 h-1/2 bg-gradient-to-t from-black/95 via-black/50 to-transparent pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-full p-3 flex flex-col justify-end font-mono">
                <span className="text-[8px] font-bold text-primary uppercase tracking-wider bg-black/60 px-1.5 py-0.5 rounded w-fit mb-0.5">
                  Student Lead
                </span>
                <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-tight truncate">
                  Pawan Joshi
                </h3>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── Section 6: Final CTA & Footer ── */}
      <footer className="relative font-mono bg-surface-low border-t border-outline">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
          
          <div className="py-6 border-b border-outline flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1">
                AWS Student Builder Group • GEU Chapter
              </p>
              <h2 className="text-xl sm:text-3xl font-black text-on-background uppercase tracking-tight">
                Build. Ship. Stay Ahead.
              </h2>
            </div>

            <Link
              to="/dashboard"
              className="px-5 py-2.5 bg-primary hover:bg-primary-container text-white rounded-lg text-xs font-bold uppercase tracking-wide shadow-sm flex items-center gap-1.5 transition-all"
            >
              <span>Launch Command Hub</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-on-surface-variant">
            <span>© {new Date().getFullYear()} AWS Student Builder Group at Graphic Era University</span>
            <span>Founded &amp; Led by <strong className="text-on-background">Pawan Joshi</strong></span>
          </div>

        </div>
      </footer>

    </div>
  );
};
export default LandingPage;
