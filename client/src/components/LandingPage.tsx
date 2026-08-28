import React, { useState, useEffect } from 'react';
import { DoriCompanion, DoriEmotion } from './DoriCompanion';
import { Logo } from './Logo';
import { 
  ArrowRight, 
  Sparkles, 
  UserCheck, 
  ShieldCheck, 
  Cpu, 
  Zap, 
  Radio, 
  Bell, 
  CheckCircle2, 
  Globe, 
  BookOpen, 
  Layers, 
  Flame, 
  Volume2, 
  Activity,
  Code2,
  ExternalLink,
  ShieldAlert,
  HelpCircle,
  TrendingUp,
  RefreshCw,
  Award,
  Terminal,
  Server,
  Database,
  Mail,
  Sliders,
  Play,
  Pause,
  ChevronRight,
  Menu,
  X,
  Compass
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  onOpenAuthModal: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onOpenAuthModal }) => {
  // Mobile Nav Drawer State
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Cycling Hero Subtitle
  const heroSubtitles = [
    "While you build.",
    "While you sleep.",
    "While you focus.",
    "AWS Signal is listening."
  ];
  const [subtitleIndex, setSubtitleIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSubtitleIndex((prev) => (prev + 1) % heroSubtitles.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  // Web Speech API Voice Synthesis for Dori
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [speechText, setSpeechText] = useState(
    "Good day Builder! While you were away, I analyzed 247 AWS signals across What's New, Tech Blogs, and re:Post. I detected 4 high-priority updates including Amazon Bedrock cross-region streaming and EventBridge Pipes filtering."
  );
  const [doriEmotion, setDoriEmotion] = useState<DoriEmotion>('happy');

  const handleSpeak = (textToSpeak: string, emotion: DoriEmotion = 'excited') => {
    if (!('speechSynthesis' in window)) {
      alert("Web Speech API is not supported in your browser.");
      return;
    }

    window.speechSynthesis.cancel();

    if (isPlayingAudio) {
      setIsPlayingAudio(false);
      setDoriEmotion('happy');
      return;
    }

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 1.0;
    utterance.pitch = 1.1;

    utterance.onstart = () => {
      setIsPlayingAudio(true);
      setDoriEmotion(emotion);
    };

    utterance.onend = () => {
      setIsPlayingAudio(false);
      setDoriEmotion('happy');
    };

    utterance.onerror = () => {
      setIsPlayingAudio(false);
      setDoriEmotion('happy');
    };

    window.speechSynthesis.speak(utterance);
  };

  // Interactive Architecture Tab
  const [selectedArchStep, setSelectedArchStep] = useState<number>(0);
  const archSteps = [
    {
      step: '01',
      title: 'Scrapes & Ingests',
      badge: 'MULTI-STREAM INGESTION',
      icon: Radio,
      color: '#fe6e00',
      description: 'Continuous ingestion engine listening to AWS RSS feeds, official Developer Blogs, re:Post threads, and AWS Builder Center publications.',
      details: [
        'AWS What’s New Announcements Feed',
        'Official AWS Architecture & Compute Blogs',
        'AWS re:Post Community Developer Friction',
        'AWS Builder Center Project Updates'
      ],
      flow: '4 Stream Sources ➔ EventBridge Trigger ➔ Ingestion Worker'
    },
    {
      step: '02',
      title: 'Deduplicates',
      badge: 'SHA-256 CRYPTOGRAPHIC HASH',
      icon: ShieldCheck,
      color: '#38bdf8',
      description: 'Calculates SHA-256 checksums on normalized content payloads and queries DynamoDB agent memory to eliminate 100% of repetitive news.',
      details: [
        'SHA-256 Title & URL normalized fingerprinting',
        'DynamoDB Agent Memory lookup in < 5ms',
        'Collapses 4x syndicated duplicate press releases into 1 verified signal',
        'Zero duplicate signal guarantee for developers'
      ],
      flow: 'Raw Ingested Feed ➔ SHA-256 Checksum ➔ DynamoDB Check ➔ Verified Unique'
    },
    {
      step: '03',
      title: 'Scores & Ranks',
      badge: 'AMAZON BEDROCK 5-METRIC SCORING',
      icon: Cpu,
      color: '#a855f7',
      description: 'Amazon Bedrock multi-metric neural evaluation engine computes a weighted signal score from 0 to 100.',
      details: [
        'Importance (Weight: 0.25) — Significance of cloud release',
        'Developer Value (Weight: 0.25) — Day-to-day builder utility',
        'Novelty (Weight: 0.15) — Genuinely new capabilities vs minor bumps',
        'Momentum (Weight: 0.15) — Community engagement & friction',
        'Impact (Weight: 0.20) — Potential disruption or breaking change'
      ],
      flow: 'Unique Payload ➔ Bedrock Neural Inference ➔ Weighted Score (0-100)'
    },
    {
      step: '04',
      title: 'Synthesizes & Speaks',
      badge: 'WEB SPEECH AUDIO SYNTHESIS',
      icon: Volume2,
      color: '#06b6d4',
      description: 'Dori generates an executive daily intelligence briefing and delivers voice speech audio narration directly in the browser.',
      details: [
        'Executive bulleted summaries of top changes',
        'Contextual "Why It Matters" developer rationale',
        'Actionable "Try This Today" 10-minute lab tutorial',
        'Web Speech API high-fidelity voice synthesis'
      ],
      flow: 'Ranked Signals ➔ Executive Digest ➔ Dori Audio Voice Synthesis'
    },
    {
      step: '05',
      title: 'Alerts & Self-Improves',
      badge: 'SES DISPATCH & LEARNING LOOP',
      icon: Bell,
      color: '#10b981',
      description: 'Dispatches high-priority (Score ≥ 80) HTML alerts via Amazon SES and refines scoring weights based on developer bookmark telemetry.',
      details: [
        'Multi-recipient team SES email distribution lists',
        'Saved bookmark telemetry stored in profile state',
        'Self-correcting prompts and adaptive category weights',
        'Zero-maintenance automated cloud monitoring'
      ],
      flow: 'High Priority Alert ➔ Amazon SES Dispatch ➔ Telemetry Feedback Loop'
    },
  ];

  // Interactive Dori Prompt Simulator
  const doriPrompts = [
    {
      label: '“Dori, what changed today?”',
      emotion: 'excited' as DoriEmotion,
      response: "Today we had 18 updates! The biggest is Amazon Bedrock's cross-region inference endpoints launching in us-east-1 and eu-west-1."
    },
    {
      label: '“Summarize the important AWS updates.”',
      emotion: 'curious' as DoriEmotion,
      response: "Top 3 updates: 1) Bedrock streaming latency dropped 40%. 2) EventBridge Pipes added payload filtering. 3) IAM Access Analyzer added automated S3 policy checks."
    },
    {
      label: '“What should I care about?”',
      emotion: 'alert' as DoriEmotion,
      response: "Pay attention to the new IAM Access Analyzer rule if you manage public S3 buckets — it flags unrestricted write policies immediately."
    },
    {
      label: '“Read my morning briefing.”',
      emotion: 'happy' as DoriEmotion,
      response: "Good morning Builder! Your cloud infrastructure is running smoothly. 4 high-priority updates detected overnight. Ready when you are!"
    },
  ];

  // Interactive Dashboard Preview Filter Tab
  const [dashboardFilter, setDashboardFilter] = useState<'all' | 'priority' | 'security' | 'architecture'>('all');

  const previewSignals = [
    {
      id: 'sig-1',
      title: 'Amazon Bedrock Launches Low-Latency Streaming & Cross-Region Inference',
      category: 'AI / Machine Learning',
      service: 'Amazon Bedrock',
      score: 95,
      priority: 'HIGH',
      summary: 'Developers can now seamlessly route generative AI inference traffic across multiple AWS regions with dynamic fallback and reduced latency.',
      badgeColor: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
    },
    {
      id: 'sig-2',
      title: 'AWS EventBridge Pipes Adds Advanced JSONPath Payload Filtering',
      category: 'Architecture Pattern',
      service: 'Amazon EventBridge',
      score: 88,
      priority: 'HIGH',
      summary: 'Filter and enrich streaming events directly within EventBridge Pipes before reaching Lambda consumers, reducing unnecessary invocations by up to 60%.',
      badgeColor: 'bg-amber-500/15 text-amber-300 border-amber-500/30'
    },
    {
      id: 'sig-3',
      title: 'IAM Access Analyzer Introduces Automated S3 Bucket Policy Verification',
      category: 'Security Alert',
      service: 'AWS IAM / S3',
      score: 92,
      priority: 'HIGH',
      summary: 'Automated mathematical reasoning detects public bucket exposure and overly permissive wildcard policies before deployment in CI/CD.',
      badgeColor: 'bg-red-500/15 text-red-300 border-red-500/30'
    },
    {
      id: 'sig-4',
      title: 're:Post Trending: Optimizing AWS Lambda Cold Starts on Graviton3 (ARM64)',
      category: 'Community Discussion',
      service: 'AWS Lambda',
      score: 79,
      priority: 'MEDIUM',
      summary: 'Community benchmark reveals memory allocation strategies to achieve sub-150ms cold starts when compiling Go & Rust runtimes on ARM64.',
      badgeColor: 'bg-purple-500/15 text-purple-300 border-purple-500/30'
    }
  ];

  const filteredPreviewSignals = previewSignals.filter(s => {
    if (dashboardFilter === 'priority') return s.score >= 90;
    if (dashboardFilter === 'security') return s.category === 'Security Alert';
    if (dashboardFilter === 'architecture') return s.category === 'Architecture Pattern';
    return true;
  });

  return (
    <div id="home" className="min-h-screen bg-[#07090e] text-slate-100 font-sans selection:bg-[#fe6e00] selection:text-white relative overflow-x-hidden">
      
      {/* Background Radial Ambiance Gradients */}
      <div className="fixed top-0 left-1/4 w-[700px] h-[700px] bg-[#fe6e00]/10 rounded-full blur-[160px] pointer-events-none -z-10" />
      <div className="fixed bottom-1/4 right-1/4 w-[650px] h-[650px] bg-[#2563eb]/10 rounded-full blur-[160px] pointer-events-none -z-10" />
      <div className="fixed top-1/2 right-10 w-[500px] h-[500px] bg-[#8b5cf6]/10 rounded-full blur-[150px] pointer-events-none -z-10" />

      {/* ========================================================================= */}
      {/* 1. STICKY NAVIGATION BAR                                                  */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-50 bg-[#07090e]/85 backdrop-blur-xl border-b border-slate-800/80 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Brand Logo */}
          <a href="#home" className="flex items-center gap-3 group">
            <Logo size="md" />
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-xs font-semibold text-slate-300">
            <a href="#home" className="hover:text-[#fe6e00] transition-colors">Home</a>
            <a href="#intelligence" className="hover:text-[#fe6e00] transition-colors">Intelligence</a>
            <a href="#how-it-works" className="hover:text-[#fe6e00] transition-colors">How It Works</a>
            <a href="#dori" className="hover:text-[#fe6e00] transition-colors">Dori</a>
            <a href="#showcase" className="hover:text-[#fe6e00] transition-colors">Showcase</a>
            <a href="#architecture" className="hover:text-[#fe6e00] transition-colors">Architecture</a>
            <a href="#technology" className="hover:text-[#fe6e00] transition-colors">Technology</a>
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              href="https://github.com/pwnjoshi/AWS-Signal-Agent-Specification"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-all"
              title="GitHub Repository"
            >
              <Code2 className="w-4 h-4" />
            </a>

            <button
              onClick={onOpenAuthModal}
              className="inline-flex items-center gap-2 bg-[#fe6e00]/10 hover:bg-[#fe6e00]/20 border border-[#fe6e00]/30 text-[#ffc080] px-3.5 py-2 rounded-xl text-xs font-bold transition-all"
            >
              <UserCheck className="w-3.5 h-3.5 text-[#fe6e00]" />
              <span>Builder ID Auth</span>
            </button>

            <button
              onClick={onGetStarted}
              className="inline-flex items-center gap-2 btn-signal-primary text-white px-5 py-2.5 rounded-xl text-xs font-extrabold shadow-lg transition-all active:scale-95"
            >
              <span>Launch Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile Menu Hamburger Button */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={onGetStarted}
              className="inline-flex items-center gap-1 btn-signal-primary text-white px-3 py-1.5 rounded-lg text-xs font-bold"
            >
              <span>Dashboard</span>
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#0a0e17] border-b border-slate-800 px-6 py-5 space-y-4">
            <nav className="flex flex-col space-y-3 text-sm font-semibold text-slate-300">
              <a href="#home" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#fe6e00]">Home</a>
              <a href="#intelligence" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#fe6e00]">Intelligence</a>
              <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#fe6e00]">How It Works</a>
              <a href="#dori" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#fe6e00]">Dori</a>
              <a href="#showcase" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#fe6e00]">Showcase</a>
              <a href="#architecture" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#fe6e00]">Architecture</a>
              <a href="#technology" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#fe6e00]">Technology</a>
            </nav>
            <div className="pt-4 border-t border-slate-800 flex flex-col gap-2">
              <button
                onClick={() => { setMobileMenuOpen(false); onOpenAuthModal(); }}
                className="w-full inline-flex items-center justify-center gap-2 bg-[#fe6e00]/10 border border-[#fe6e00]/30 text-[#ffc080] px-4 py-2.5 rounded-xl text-xs font-bold"
              >
                <UserCheck className="w-4 h-4 text-[#fe6e00]" />
                <span>Sign in with AWS Builder ID</span>
              </button>
              <button
                onClick={() => { setMobileMenuOpen(false); onGetStarted(); }}
                className="w-full inline-flex items-center justify-center gap-2 btn-signal-primary text-white px-4 py-2.5 rounded-xl text-xs font-extrabold"
              >
                <span>Launch Full Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ========================================================================= */}
      {/* 2. HERO SECTION WITH INTERACTIVE DORI VISUALIZATION                       */}
      {/* ========================================================================= */}
      <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
          
          {/* Left Column: Headlines & Storytelling */}
          <div className="flex-1 text-center lg:text-left space-y-6">
            
            {/* Status Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs font-semibold text-slate-300 shadow-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-[#fe6e00] font-extrabold uppercase tracking-wider">AWS Signal v2.0</span>
              <span className="text-slate-500">|</span>
              <span>Amazon Bedrock Powered</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.08]">
              Your Autonomous <br />
              <span className="text-signal-gradient">
                AWS Intelligence.
              </span>
            </h1>

            {/* Cycling Animated Subtitle */}
            <div className="h-8 flex items-center justify-center lg:justify-start">
              <p className="text-lg sm:text-xl font-bold text-[#ffc080] transition-all duration-500 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#fe6e00]" />
                <span>{heroSubtitles[subtitleIndex]}</span>
              </p>
            </div>

            {/* Supporting Copy */}
            <p className="text-slate-300 text-base sm:text-lg max-w-2xl leading-relaxed font-normal">
              AWS Signal autonomously monitors the vast AWS ecosystem, detects meaningful architectural updates, eliminates repetitive noise, and delivers personalized cloud intelligence before you even have to search.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={onGetStarted}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 btn-signal-primary text-white px-8 py-4 rounded-2xl font-extrabold text-base shadow-xl transition-all active:scale-95 group"
              >
                <span>Explore AWS Signal</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <a
                href="#dori"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-900/90 hover:bg-slate-800/90 text-slate-200 border border-slate-800 px-7 py-4 rounded-2xl font-bold text-base shadow-md backdrop-blur-md transition-all"
              >
                <Sparkles className="w-5 h-5 text-[#fe6e00]" />
                <span>Meet Dori</span>
              </a>
            </div>

            {/* Micro Highlights */}
            <div className="pt-6 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-400 font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Zero Duplicate Articles (SHA-256)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#38bdf8]" />
                <span>5-Metric Weighted Scoring</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#fe6e00]" />
                <span>Voice Audio Synthesis</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Intelligence Engine */}
          <div className="w-full lg:w-[500px] shrink-0">
            <div className="relative bg-[#0f172a]/80 border border-slate-800/90 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl overflow-hidden">
              
              {/* Radar Grid Graphic */}
              <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none" />

              {/* Status Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 relative z-10">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-bold text-slate-200 tracking-wide uppercase">Dori Neural Core Active</span>
                </div>
                <span className="text-[11px] font-mono text-[#fe6e00] bg-[#fe6e00]/10 px-2 py-0.5 rounded-md border border-[#fe6e00]/20">
                  CONFIDENCE: 96%
                </span>
              </div>

              {/* Central Interactive Dori with Flowing Particle Signals */}
              <div className="py-6 flex flex-col items-center justify-center relative z-10">
                
                {/* Orbiting Signal Badges */}
                <div className="w-full flex justify-between gap-2 mb-4 text-[10px] font-semibold">
                  <span className="bg-slate-900/90 border border-slate-700 text-slate-300 px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                    <Radio className="w-3 h-3 text-[#fe6e00]" />
                    AWS What's New
                  </span>
                  <span className="bg-slate-900/90 border border-slate-700 text-slate-300 px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                    <Layers className="w-3 h-3 text-[#38bdf8]" />
                    Tech Blogs
                  </span>
                </div>

                {/* Central Dori Avatar */}
                <div className="my-2 relative flex items-center justify-center">
                  <div className="absolute w-40 h-40 rounded-full bg-[#fe6e00]/20 blur-2xl animate-pulse-glow" />
                  <DoriCompanion
                    emotion={doriEmotion}
                    message={speechText}
                    size="lg"
                    showSpeechBubble={true}
                    interactive={true}
                  />
                </div>

                {/* Orbiting Bottom Signals */}
                <div className="w-full flex justify-between gap-2 mt-4 text-[10px] font-semibold">
                  <span className="bg-slate-900/90 border border-slate-700 text-slate-300 px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                    <ShieldAlert className="w-3 h-3 text-red-400" />
                    Security Advisories
                  </span>
                  <span className="bg-slate-900/90 border border-slate-700 text-slate-300 px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                    <Flame className="w-3 h-3 text-[#a855f7]" />
                    re:Post Friction
                  </span>
                </div>
              </div>

              {/* Flow Pipeline Indicator */}
              <div className="pt-4 border-t border-slate-800/80 text-[11px] font-mono text-slate-400 flex items-center justify-between">
                <span className="text-slate-500">RAW DATA</span>
                <ChevronRight className="w-3 h-3 text-[#fe6e00]" />
                <span className="text-[#38bdf8]">DORI AI</span>
                <ChevronRight className="w-3 h-3 text-[#fe6e00]" />
                <span className="text-emerald-400 font-bold">CLARITY</span>
              </div>

              {/* Speech Playback Trigger */}
              <div className="mt-4 pt-3 bg-slate-950/70 border border-slate-800 rounded-2xl p-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleSpeak(speechText)}
                    className="w-8 h-8 rounded-full bg-[#fe6e00] hover:bg-[#e05b00] text-white flex items-center justify-center shadow-md transition-transform active:scale-90"
                    title={isPlayingAudio ? 'Pause Narration' : 'Listen to Dori'}
                  >
                    {isPlayingAudio ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
                  </button>
                  <div>
                    <p className="text-xs font-bold text-white">Daily Digest Audio</p>
                    <p className="text-[10px] text-slate-400">Web Speech API Voice Synthesis</p>
                  </div>
                </div>

                {/* Animated Waveform Bars */}
                {isPlayingAudio ? (
                  <div className="flex items-center gap-1 h-6 px-2">
                    <span className="w-1 bg-[#fe6e00] rounded-full waveform-bar-1" />
                    <span className="w-1 bg-[#38bdf8] rounded-full waveform-bar-2" />
                    <span className="w-1 bg-[#fe6e00] rounded-full waveform-bar-3" />
                    <span className="w-1 bg-[#38bdf8] rounded-full waveform-bar-4" />
                    <span className="w-1 bg-[#fe6e00] rounded-full waveform-bar-5" />
                  </div>
                ) : (
                  <span className="text-[10px] font-mono text-slate-500">READY</span>
                )}
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. LIVE STATUS TELEMETRY STRIP                                            */}
      {/* ========================================================================= */}
      <section className="border-y border-slate-800 bg-[#0a0f1d]/90 backdrop-blur-md py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
            
            <div className="space-y-1 border-r border-slate-800/80 pr-4">
              <div className="flex items-center justify-center md:justify-start gap-2 text-xs font-semibold text-slate-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Autonomous Status</span>
              </div>
              <p className="text-xl sm:text-2xl font-extrabold text-white">Dori Active 24/7</p>
              <p className="text-[11px] text-slate-500 font-mono">Monitoring AWS Ecosystem</p>
            </div>

            <div className="space-y-1 border-r border-slate-800/80 pr-4">
              <div className="flex items-center justify-center md:justify-start gap-2 text-xs font-semibold text-slate-400">
                <Radio className="w-3.5 h-3.5 text-[#fe6e00]" />
                <span>Signals Processed</span>
              </div>
              <p className="text-xl sm:text-2xl font-extrabold text-[#ffc080]">247 Items</p>
              <p className="text-[11px] text-slate-500 font-mono">Continuous RSS Ingestion</p>
            </div>

            <div className="space-y-1 border-r border-slate-800/80 pr-4">
              <div className="flex items-center justify-center md:justify-start gap-2 text-xs font-semibold text-slate-400">
                <Sparkles className="w-3.5 h-3.5 text-[#38bdf8]" />
                <span>High-Priority Alerts</span>
              </div>
              <p className="text-xl sm:text-2xl font-extrabold text-[#38bdf8]">4 Verified</p>
              <p className="text-[11px] text-slate-500 font-mono">Score ≥ 80 / 100</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-center md:justify-start gap-2 text-xs font-semibold text-slate-400">
                <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                <span>Bedrock Confidence</span>
              </div>
              <p className="text-xl sm:text-2xl font-extrabold text-emerald-400">96.4%</p>
              <p className="text-[11px] text-slate-500 font-mono">5-Metric Neural Weighting</p>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. THE PROBLEM SECTION: CHAOS VS CLARITY                                  */}
      {/* ========================================================================= */}
      <section id="intelligence" className="py-20 lg:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#fe6e00]/10 text-[#ffc080] border border-[#fe6e00]/20 text-xs font-bold uppercase tracking-wider">
            <span>The Developer Dilemma</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            AWS Moves Fast. <br />
            <span className="text-signal-gradient">Too Fast to Read Everything.</span>
          </h2>
          <p className="text-slate-300 text-base leading-relaxed">
            Every day, hundreds of release notes, blog posts, and community discussions are published. Searching for what matters costs hours of deep focus time.
          </p>
        </div>

        {/* Side-by-Side Comparison: The Old Way vs The AWS Signal Way */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Left: The Old Way */}
          <div className="bg-[#0f172a]/60 border border-red-500/20 rounded-3xl p-8 space-y-6 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-bold text-red-400 uppercase tracking-wider block">The Traditional Approach</span>
                <h3 className="text-2xl font-extrabold text-white">The Old Way: Noise & Chaos</h3>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 font-extrabold">
                ✕
              </div>
            </div>

            <ul className="space-y-4 text-sm text-slate-300">
              <li className="flex items-start gap-3">
                <span className="text-red-400 font-bold mt-0.5">•</span>
                <span><strong>45 Open Browser Tabs:</strong> Frantically checking What's New feeds, Reddit, and Twitter every morning.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-400 font-bold mt-0.5">•</span>
                <span><strong>Repetitive Syndicated Noise:</strong> Reading the same launch announcement 4 times across different blogs.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-400 font-bold mt-0.5">•</span>
                <span><strong>Missed Breaking Changes:</strong> Overlooking critical IAM security bulletins buried under marketing announcements.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-400 font-bold mt-0.5">•</span>
                <span><strong>5-10 Hours Wasted Weekly:</strong> Shifting context away from building products to manual information hunting.</span>
              </li>
            </ul>

            <div className="p-4 rounded-2xl bg-red-950/30 border border-red-500/20 text-xs text-red-300 font-mono">
              STATUS: INFORMATION OVERLOAD & COGNITIVE FATIGUE
            </div>
          </div>

          {/* Right: The AWS Signal Way */}
          <div className="bg-gradient-to-br from-[#0f172a] to-[#162036] border border-[#fe6e00]/40 rounded-3xl p-8 space-y-6 relative overflow-hidden shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-bold text-[#fe6e00] uppercase tracking-wider block">The Autonomous Approach</span>
                <h3 className="text-2xl font-extrabold text-white">The AWS Signal Way: Clarity</h3>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-[#fe6e00]/20 border border-[#fe6e00]/40 flex items-center justify-center text-[#fe6e00] font-extrabold">
                ✓
              </div>
            </div>

            <ul className="space-y-4 text-sm text-slate-300">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#fe6e00] shrink-0 mt-0.5" />
                <span><strong>One Autonomous Companion (Dori):</strong> Working quietly 24/7 in the background while you focus on code.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#fe6e00] shrink-0 mt-0.5" />
                <span><strong>SHA-256 Deduplication:</strong> Identical announcements are merged into a single verified high-yield signal.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#fe6e00] shrink-0 mt-0.5" />
                <span><strong>5-Metric Bedrock Ranking:</strong> Instant separation of high-impact releases from trivial updates.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#fe6e00] shrink-0 mt-0.5" />
                <span><strong>Voice Briefing in 60 Seconds:</strong> Listen to or read an executive digest right before your morning standup.</span>
              </li>
            </ul>

            <div className="p-4 rounded-2xl bg-[#fe6e00]/10 border border-[#fe6e00]/30 text-xs text-[#ffc080] font-mono flex items-center justify-between">
              <span>STATUS: 100% BUILDER FOCUS RESTORED</span>
              <Sparkles className="w-4 h-4 text-[#fe6e00]" />
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. THE CORE PHILOSOPHY SECTION                                            */}
      {/* ========================================================================= */}
      <section className="py-20 bg-gradient-to-b from-[#07090e] via-[#0b101c] to-[#07090e] border-y border-slate-800/80 relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-slate-900 border border-slate-700 text-xs font-bold uppercase tracking-widest text-slate-400">
            <span>Guiding Principle</span>
          </div>

          <blockquote className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
            “The best tool is the one you <span className="text-signal-gradient">never have to open.</span>”
          </blockquote>

          <p className="text-slate-300 text-base sm:text-xl max-w-3xl mx-auto leading-relaxed">
            AWS Signal doesn't wait for you to search. It works continuously in the background. It watches. It learns. It filters. It prioritizes. And when something matters — it tells you.
          </p>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. HOW AWS SIGNAL WORKS (INTERACTIVE 5-STEP ARCHITECTURE)                 */}
      {/* ========================================================================= */}
      <section id="how-it-works" className="py-20 lg:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#38bdf8]/10 text-[#38bdf8] border border-[#38bdf8]/30 text-xs font-bold uppercase tracking-wider">
            <span>Autonomous Intelligence Pipeline</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            How AWS Signal Operates
          </h2>
          <p className="text-slate-300 text-base">
            Click through the 5-stage pipeline to inspect how raw AWS data is transformed into high-confidence intelligence.
          </p>
        </div>

        {/* Step Navigation Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-10">
          {archSteps.map((s, idx) => {
            const Icon = s.icon;
            const isSelected = selectedArchStep === idx;
            return (
              <button
                key={s.step}
                onClick={() => setSelectedArchStep(idx)}
                className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-slate-900 border-[#fe6e00] shadow-lg shadow-[#fe6e00]/15'
                    : 'bg-slate-950/60 border-slate-800 hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-mono font-bold ${isSelected ? 'text-[#fe6e00]' : 'text-slate-500'}`}>
                    {s.step}
                  </span>
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-[#fe6e00]' : 'text-slate-400'}`} />
                </div>
                <span className="text-xs sm:text-sm font-bold text-white leading-tight">
                  {s.title}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Step Deep Dive Card */}
        {archSteps[selectedArchStep] && (
          <div className="bg-[#0f172a]/90 border border-slate-800 rounded-3xl p-8 sm:p-12 shadow-2xl backdrop-blur-xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-xs font-mono font-bold text-[#fe6e00]">
                  <span>STAGE {archSteps[selectedArchStep].step}</span>
                  <span>•</span>
                  <span>{archSteps[selectedArchStep].badge}</span>
                </div>

                <h3 className="text-2xl sm:text-4xl font-extrabold text-white">
                  {archSteps[selectedArchStep].title}
                </h3>

                <p className="text-slate-300 text-base leading-relaxed">
                  {archSteps[selectedArchStep].description}
                </p>

                <div className="space-y-2.5 pt-2">
                  {archSteps[selectedArchStep].details.map((detail, dIdx) => (
                    <div key={dIdx} className="flex items-center gap-3 text-sm text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Technical Flow Visualization Box */}
              <div className="lg:col-span-5 bg-slate-950 border border-slate-800 rounded-2xl p-6 font-mono text-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-slate-400">
                  <span>// ARCHITECTURE EXECUTION</span>
                  <span className="text-emerald-400">STATUS: LIVE</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-[#ffc080]">
                  {archSteps[selectedArchStep].flow}
                </div>

                <div className="text-[11px] text-slate-400 space-y-1.5 pt-2">
                  <p>• Serverless AWS Lambda Execution</p>
                  <p>• Zero Cold-Start Latency with Function URLs</p>
                  <p>• DynamoDB Continuous Hash State Storage</p>
                </div>
              </div>

            </div>
          </div>
        )}

      </section>

      {/* ========================================================================= */}
      {/* 7. THE "WHILE YOU WERE AWAY..." SIGNATURE EXPERIENCE                      */}
      {/* ========================================================================= */}
      <section id="showcase" className="py-20 bg-[#080d19] border-y border-slate-800/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#fe6e00]/10 text-[#ffc080] border border-[#fe6e00]/30 text-xs font-bold uppercase tracking-wider">
              <span>Signature Experience</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              “While You Were Away...”
            </h2>
            <p className="text-slate-300 text-base">
              The flagship feature that greets builders when they return. A synthesized executive brief ready in seconds.
            </p>
          </div>

          {/* Large Heroic Dashboard Centerpiece Card */}
          <div className="bg-[#0f172a]/95 border border-slate-700/80 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-2xl">
            
            {/* Header Strip */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div>
                <span className="text-xs font-bold text-[#fe6e00] uppercase tracking-wider block">Executive Briefing Digest</span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-white">Here is what changed in the AWS Cloud:</h3>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleSpeak(speechText, 'excited')}
                  className="inline-flex items-center gap-2 bg-[#fe6e00] hover:bg-[#e05b00] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md transition-all active:scale-95"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>{isPlayingAudio ? 'Pause Audio Briefing' : 'Listen to Dori'}</span>
                </button>
              </div>
            </div>

            {/* 4 Categorized Highlight Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 my-8">
              
              {/* High Priority */}
              <div className="bg-slate-950/80 border border-emerald-500/30 rounded-2xl p-4 space-y-2">
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase">
                  🔥 High Priority
                </span>
                <h4 className="text-sm font-bold text-white">Amazon Bedrock Cross-Region Streaming</h4>
                <p className="text-xs text-slate-400 line-clamp-2">Low latency AI endpoint routing across us-east-1 and eu-west-1.</p>
                <span className="text-[10px] text-emerald-400 font-mono block">Score: 95/100</span>
              </div>

              {/* Developer Signal */}
              <div className="bg-slate-950/80 border border-[#38bdf8]/30 rounded-2xl p-4 space-y-2">
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-[#38bdf8]/20 text-[#38bdf8] border border-[#38bdf8]/30 uppercase">
                  ⚡ Developer Signal
                </span>
                <h4 className="text-sm font-bold text-white">EventBridge Pipes JSONPath Filters</h4>
                <p className="text-xs text-slate-400 line-clamp-2">Filter and enrich event streams before invoking downstream Lambda functions.</p>
                <span className="text-[10px] text-[#38bdf8] font-mono block">Score: 88/100</span>
              </div>

              {/* Security Alert */}
              <div className="bg-slate-950/80 border border-red-500/30 rounded-2xl p-4 space-y-2">
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/30 uppercase">
                  🛡 Security Alert
                </span>
                <h4 className="text-sm font-bold text-white">IAM Access Analyzer S3 Policy Check</h4>
                <p className="text-xs text-slate-400 line-clamp-2">Automated mathematical verification of public S3 bucket policies.</p>
                <span className="text-[10px] text-red-400 font-mono block">Score: 92/100</span>
              </div>

              {/* Community Insight */}
              <div className="bg-slate-950/80 border border-purple-500/30 rounded-2xl p-4 space-y-2">
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase">
                  💡 Community Insight
                </span>
                <h4 className="text-sm font-bold text-white">Lambda ARM64 Graviton3 Memory Tuning</h4>
                <p className="text-xs text-slate-400 line-clamp-2">re:Post benchmark achieving sub-150ms cold starts on compiled Go binaries.</p>
                <span className="text-[10px] text-purple-400 font-mono block">Score: 79/100</span>
              </div>

            </div>

            {/* Bottom Dori Voice Quote */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-950 via-[#0a1020] to-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#fe6e00]/20 border border-[#fe6e00]/40 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5 text-[#fe6e00]" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Dori's Intelligence Summary</p>
                  <p className="text-xs text-slate-300">
                    “While you were away, I analyzed 247 signals and found 6 updates worth your immediate attention.”
                  </p>
                </div>
              </div>

              <button
                onClick={onGetStarted}
                className="inline-flex items-center gap-2 btn-signal-primary text-white px-5 py-2.5 rounded-xl text-xs font-bold shrink-0 transition-transform active:scale-95"
              >
                <span>Open in Command Center</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. MEET DORI SECTION (YOUR ALWAYS-ON CLOUD COMPANION)                     */}
      {/* ========================================================================= */}
      <section id="dori" className="py-20 lg:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Interactive Dori Playground */}
          <div className="lg:col-span-6 bg-[#0f172a]/90 border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl flex flex-col items-center justify-center text-center relative">
            
            <div className="w-full flex justify-between items-center pb-4 border-b border-slate-800 text-xs font-mono text-slate-400">
              <span className="text-[#fe6e00] font-bold">COMPANION SIMULATOR</span>
              <span>CLICK TO INTERACT</span>
            </div>

            <div className="my-8">
              <DoriCompanion
                emotion={doriEmotion}
                message={speechText}
                size="lg"
                showSpeechBubble={true}
                interactive={true}
              />
            </div>

            {/* Clickable prompt chips */}
            <div className="w-full space-y-2 text-left">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Ask Dori a Question:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {doriPrompts.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSpeechText(p.response);
                      setDoriEmotion(p.emotion);
                      handleSpeak(p.response, p.emotion);
                    }}
                    className="p-3 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white transition-all text-left"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Dori Personality & Philosophy */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#fe6e00]/10 text-[#ffc080] border border-[#fe6e00]/30 text-xs font-bold uppercase tracking-wider">
              <span>Your Cloud Companion</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Meet Dori. <br />
              <span className="text-signal-gradient">Always Listening. Never Intrusive.</span>
            </h2>

            <p className="text-slate-300 text-base leading-relaxed">
              Dori is not just a mascot — she is an autonomous agent persona engineered to represent AWS Signal’s underlying reasoning engine. Friendly, curious, and relentless about cloud efficiency.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-xs font-extrabold text-[#fe6e00] block">FRIENDLY & CURIOUS</span>
                <p className="text-xs text-slate-400">Approachable intelligence that simplifies complex AWS announcements.</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-xs font-extrabold text-[#38bdf8] block">ALWAYS WORKING</span>
                <p className="text-xs text-slate-400">Continuous EventBridge automation running while you sleep.</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-xs font-extrabold text-emerald-400 block">DEVELOPER FOCUSED</span>
                <p className="text-xs text-slate-400">Extracts code patterns and architectural takeaways builders can use immediately.</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-xs font-extrabold text-purple-400 block">NEVER INTRUSIVE</span>
                <p className="text-xs text-slate-400">Only alerts for verified high-impact updates (Score ≥ 80).</p>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onGetStarted}
                className="inline-flex items-center gap-2 btn-signal-primary text-white px-7 py-3.5 rounded-2xl font-extrabold text-sm shadow-xl transition-all active:scale-95"
              >
                <span>Launch Assistant in Command Center</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

      </section>

      {/* ========================================================================= */}
      {/* 9. INTELLIGENCE DASHBOARD PREVIEW                                         */}
      {/* ========================================================================= */}
      <section className="py-20 bg-[#080d19] border-y border-slate-800/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#38bdf8]/10 text-[#38bdf8] border border-[#38bdf8]/30 text-xs font-bold uppercase tracking-wider">
              <span>Command Center Preview</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Production-Grade Intelligence Dashboard
            </h2>
            <p className="text-slate-300 text-base">
              Filter, search, inspect AI rationales, and save signals into your personal vault.
            </p>
          </div>

          {/* Interactive Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {[
              { id: 'all', label: 'All Verified Signals' },
              { id: 'priority', label: '🔥 High Priority Only' },
              { id: 'security', label: '🛡 Security Watch' },
              { id: 'architecture', label: '⚡ Architecture Patterns' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setDashboardFilter(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                  dashboardFilter === tab.id
                    ? 'btn-signal-primary text-white border-transparent'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Signal Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredPreviewSignals.map(sig => (
              <div
                key={sig.id}
                className="bg-[#0f172a]/90 border border-slate-800 rounded-3xl p-6 hover:border-[#fe6e00]/50 transition-all space-y-4 shadow-xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${sig.badgeColor}`}>
                      {sig.category}
                    </span>
                    <span className="text-xs font-mono font-bold text-[#ffc080] bg-slate-950 px-2 py-0.5 rounded-md border border-slate-800">
                      SCORE {sig.score}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
                    {sig.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
                    {sig.summary}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">Service: <strong className="text-white">{sig.service}</strong></span>
                  <button
                    onClick={onGetStarted}
                    className="inline-flex items-center gap-1 text-[#fe6e00] font-bold hover:underline"
                  >
                    <span>Read Bedrock Rationale</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 10. SYSTEM ARCHITECTURE SECTION                                           */}
      {/* ========================================================================= */}
      <section id="architecture" className="py-20 lg:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider">
            <span>Serverless Infrastructure</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            End-to-End Cloud Architecture
          </h2>
          <p className="text-slate-300 text-base">
            Built 100% serverless on AWS Free Tier using Amazon Bedrock, AWS Lambda, DynamoDB, EventBridge, and Amazon SES.
          </p>
        </div>

        {/* High Polish Visual Architecture Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
          
          {/* Layer 1: Ingestion */}
          <div className="bg-[#0f172a]/90 border border-slate-800 rounded-3xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-[#fe6e00] font-bold pb-2 border-b border-slate-800">
              <Radio className="w-4 h-4" />
              <span>01. INGESTION & HASHING</span>
            </div>
            <p className="text-slate-400 font-sans text-xs leading-relaxed">
              AWS EventBridge triggers an AWS Lambda worker every 3 hours to parse RSS feeds, format HTML content, and compute SHA-256 fingerprints.
            </p>
            <div className="p-3 bg-slate-950 rounded-xl text-slate-300 space-y-1 text-[11px]">
              <p>• AWS EventBridge Scheduler</p>
              <p>• Lambda Node.js Ingestion Worker</p>
              <p>• SHA-256 Fingerprint Generator</p>
            </div>
          </div>

          {/* Layer 2: Bedrock Reasoning */}
          <div className="bg-[#0f172a]/90 border border-[#fe6e00]/30 rounded-3xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center gap-2 text-[#38bdf8] font-bold pb-2 border-b border-slate-800">
              <Cpu className="w-4 h-4" />
              <span>02. BEDROCK REASONING</span>
            </div>
            <p className="text-slate-400 font-sans text-xs leading-relaxed">
              Amazon Bedrock evaluates verified new signals against 5 scoring dimensions, extracts takeaways, and generates conversational audio briefings.
            </p>
            <div className="p-3 bg-slate-950 rounded-xl text-slate-300 space-y-1 text-[11px]">
              <p>• Amazon Bedrock Claude / Nova Models</p>
              <p>• 5-Metric Weighted Evaluation</p>
              <p>• DynamoDB Signal Memory Store</p>
            </div>
          </div>

          {/* Layer 3: Delivery & Dispatch */}
          <div className="bg-[#0f172a]/90 border border-slate-800 rounded-3xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-emerald-400 font-bold pb-2 border-b border-slate-800">
              <Mail className="w-4 h-4" />
              <span>03. DISPATCH & UI</span>
            </div>
            <p className="text-slate-400 font-sans text-xs leading-relaxed">
              High-priority alerts trigger Amazon SES email dispatch. Signals are surfaced via the standalone REST API and Web Command Center.
            </p>
            <div className="p-3 bg-slate-950 rounded-xl text-slate-300 space-y-1 text-[11px]">
              <p>• Amazon SES HTML Alert Dispatch</p>
              <p>• Decoupled Public REST API (/api/v1)</p>
              <p>• Vite React Single Page Application</p>
            </div>
          </div>

        </div>

      </section>

      {/* ========================================================================= */}
      {/* 11. TECHNOLOGY STACK PILLARS                                              */}
      {/* ========================================================================= */}
      <section id="technology" className="py-20 bg-[#080d19] border-y border-slate-800/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#fe6e00]/10 text-[#ffc080] border border-[#fe6e00]/30 text-xs font-bold uppercase tracking-wider">
              <span>Core Stack</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Built for Autonomous Cloud Intelligence
            </h2>
            <p className="text-slate-300 text-base">
              Every layer of AWS Signal has been selected for resilience, security, and developer clarity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Amazon Bedrock */}
            <div className="p-6 rounded-3xl bg-[#0f172a]/80 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#fe6e00]/10 text-[#fe6e00] flex items-center justify-center font-bold">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Amazon Bedrock</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                The core reasoning engine powering multi-metric signal ranking, developer takeaways, and daily briefing synthesis.
              </p>
            </div>

            {/* Amazon DynamoDB */}
            <div className="p-6 rounded-3xl bg-[#0f172a]/80 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#38bdf8]/10 text-[#38bdf8] flex items-center justify-center font-bold">
                <Database className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Amazon DynamoDB</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Single-digit millisecond latency storage for agent memory, SHA-256 deduplication state, and saved signal vaults.
              </p>
            </div>

            {/* Amazon SES */}
            <div className="p-6 rounded-3xl bg-[#0f172a]/80 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                <Mail className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Amazon SES</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                High-deliverability email dispatch alerting teams when critical security or architectural updates occur.
              </p>
            </div>

            {/* Web Speech API */}
            <div className="p-6 rounded-3xl bg-[#0f172a]/80 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold">
                <Volume2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Web Speech API</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                In-browser audio synthesis enabling Dori to read out daily intelligence digests hands-free.
              </p>
            </div>

            {/* SHA-256 Hashing */}
            <div className="p-6 rounded-3xl bg-[#0f172a]/80 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">SHA-256 Hashing</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Cryptographic content fingerprinting that prevents repetitive syndicated press releases from appearing twice.
              </p>
            </div>

            {/* Serverless Lambda */}
            <div className="p-6 rounded-3xl bg-[#0f172a]/80 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center font-bold">
                <Server className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Serverless Lambda</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Zero standby costs, automated scalability, and sub-100ms API response times with Lambda Function URLs.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 12. SUMMER BUILDS SHOWCASE SECTION                                        */}
      {/* ========================================================================= */}
      <section className="py-20 lg:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-gradient-to-br from-[#0f172a] via-[#151f38] to-[#0f172a] border border-[#fe6e00]/40 rounded-3xl p-8 sm:p-14 shadow-2xl relative overflow-hidden">
          
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#fe6e00]/20 text-[#ffc080] border border-[#fe6e00]/30 text-xs font-bold uppercase tracking-wider">
              <Award className="w-4 h-4 text-[#fe6e00]" />
              <span>AWS Community Showcase</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Built for the Summer Builds Showcase.
            </h2>

            <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
              AWS Signal is the culmination of the entire Summer Build Series. From an initial creative companion idea to a production-grade autonomous cloud intelligence platform.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
                <span className="text-[#fe6e00] font-bold block">01. THE BEGINNING</span>
                <strong className="text-white block text-sm">Dori Companion</strong>
                <p className="text-slate-400">A friendly robotic companion prototype.</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
                <span className="text-[#38bdf8] font-bold block">02. THE EVOLUTION</span>
                <strong className="text-white block text-sm">AWS Signal</strong>
                <p className="text-slate-400">Autonomous intelligence agent running 24/7.</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
                <span className="text-emerald-400 font-bold block">03. THE VISION</span>
                <strong className="text-white block text-sm">Zero-Search Future</strong>
                <p className="text-slate-400">Builders stay informed effortlessly.</p>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <button
                onClick={onGetStarted}
                className="inline-flex items-center gap-2 btn-signal-primary text-white px-6 py-3 rounded-xl font-bold text-xs shadow-md transition-transform active:scale-95"
              >
                <span>Launch Showcase Project</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="https://github.com/pwnjoshi/AWS-Signal-Agent-Specification"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 px-5 py-3 rounded-xl font-bold text-xs transition-colors"
              >
                <Code2 className="w-4 h-4" />
                <span>View GitHub Repository</span>
              </a>
            </div>
          </div>

        </div>

      </section>

      {/* ========================================================================= */}
      {/* 13. FINAL CALL TO ACTION                                                  */}
      {/* ========================================================================= */}
      <section className="py-20 lg:py-28 border-t border-slate-800 relative bg-gradient-to-b from-[#07090e] to-[#0a0f1d] text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-[#fe6e00] to-[#2563eb] mx-auto flex items-center justify-center text-white shadow-xl shadow-[#fe6e00]/25">
            <Sparkles className="w-8 h-8 text-white animate-spin" style={{ animationDuration: '6s' }} />
          </div>

          <h2 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight">
            Stop Searching for Signals. <br />
            <span className="text-signal-gradient">Let Intelligence Find You.</span>
          </h2>

          <p className="text-slate-300 text-base sm:text-xl max-w-2xl mx-auto leading-relaxed">
            AWS Signal works quietly in the background so you can spend more time building and less time searching.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={onGetStarted}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 btn-signal-primary text-white px-8 py-4 rounded-2xl font-extrabold text-base shadow-xl transition-all active:scale-95"
            >
              <span>Launch AWS Signal</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={onOpenAuthModal}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 px-7 py-4 rounded-2xl font-bold text-base shadow-md transition-all"
            >
              <UserCheck className="w-5 h-5 text-[#fe6e00]" />
              <span>Connect Builder ID</span>
            </button>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 14. FOOTER                                                                */}
      {/* ========================================================================= */}
      <footer id="about" className="border-t border-slate-800 bg-[#07090e] py-12 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <Logo size="md" />

            <div className="flex flex-wrap items-center gap-6 font-semibold">
              <a href="#home" className="hover:text-white transition-colors">Home</a>
              <a href="#intelligence" className="hover:text-white transition-colors">Intelligence</a>
              <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
              <a href="#dori" className="hover:text-white transition-colors">Dori</a>
              <a href="#showcase" className="hover:text-white transition-colors">Showcase</a>
              <a href="#architecture" className="hover:text-white transition-colors">Architecture</a>
              <a href="https://github.com/pwnjoshi/AWS-Signal-Agent-Specification" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub</a>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
            <p>
              AWS Signal — Autonomous Intelligence for the AWS Ecosystem • Powered by Amazon Bedrock, AWS Lambda, DynamoDB & SES.
            </p>
            <p>
              Graphic Era University Student Builder Group • Led by Pawan Joshi
            </p>
          </div>

        </div>
      </footer>

    </div>
  );
};
