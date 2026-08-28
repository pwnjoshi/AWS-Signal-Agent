import React, { useState, useEffect } from 'react';
import { DoriCompanion, DoriEmotion } from './DoriCompanion';
import { Logo } from './Logo';
import { ParticleBackground } from './ParticleBackground';
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
  Compass,
  ArrowUpRight
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  onOpenAuthModal: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onOpenAuthModal }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Cycling Hero Text
  const CYCLE_LINES = [
    'WITH CLOUD & AI',
    'ON THE AWS CLOUD',
    'AUTONOMOUSLY 24/7',
    'BEFORE YOU EVEN ASK',
    'WHILE YOU WERE AWAY',
  ];
  const [cycleIndex, setCycleIndex] = useState(0);
  const [cycleVisible, setCycleVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setCycleVisible(false);
      setTimeout(() => {
        setCycleIndex(i => (i + 1) % CYCLE_LINES.length);
        setCycleVisible(true);
      }, 350);
    }, 2800);
    return () => clearInterval(interval);
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

  // Interactive 5-Step Architecture Timeline
  const [selectedArchStep, setSelectedArchStep] = useState<number>(0);
  const archSteps = [
    {
      step: '01',
      title: 'Scrapes & Ingests',
      badge: 'MULTI-STREAM INGESTION',
      icon: Radio,
      description: 'Continuous ingestion engine listening to AWS RSS feeds, official Developer Blogs, re:Post threads, and AWS Builder Center publications.',
      details: [
        'AWS What’s New Announcements Feed',
        'Official AWS Architecture & Compute Blogs',
        'AWS re:Post Community Developer Friction',
        'AWS Builder Center Project Updates'
      ],
      flow: '4 Stream Sources ➔ EventBridge Trigger ➔ Lambda Worker'
    },
    {
      step: '02',
      title: 'Deduplicates',
      badge: 'SHA-256 CRYPTOGRAPHIC HASH',
      icon: ShieldCheck,
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
      badgeColor: 'bg-[#AD5CFF]/15 text-[#d8b4fe] border-[#AD5CFF]/30'
    },
    {
      id: 'sig-2',
      title: 'AWS EventBridge Pipes Adds Advanced JSONPath Payload Filtering',
      category: 'Architecture Pattern',
      service: 'Amazon EventBridge',
      score: 88,
      priority: 'HIGH',
      summary: 'Filter and enrich streaming events directly within EventBridge Pipes before reaching Lambda consumers, reducing unnecessary invocations by up to 60%.',
      badgeColor: 'bg-[#ffc080]/15 text-[#ffc080] border-[#ffc080]/30'
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
      badgeColor: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
    }
  ];

  const filteredPreviewSignals = previewSignals.filter(s => {
    if (dashboardFilter === 'priority') return s.score >= 90;
    if (dashboardFilter === 'security') return s.category === 'Security Alert';
    if (dashboardFilter === 'architecture') return s.category === 'Architecture Pattern';
    return true;
  });

  return (
    <div id="home" className="relative w-full selection:bg-[#AD5CFF] selection:text-[#161616] min-h-screen font-sans overflow-x-hidden text-[#f4f4f5] bg-[#09090b] transition-colors duration-300">
      
      {/* Background Blueprint Grid, Ambient Glows & Particles */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute inset-0 site-main-grid opacity-30" />
        <div className="site-gradient-glows" />
        <ParticleBackground />
      </div>

      {/* Laser Light Scanlines */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
        <div className="laser-grid-line-h top-1/4" style={{ animationDelay: '0s' }} />
        <div className="laser-grid-line-h top-3/4" style={{ animationDelay: '4s' }} />
        <div className="laser-grid-line-v left-1/5" style={{ animationDelay: '2s' }} />
        <div className="laser-grid-line-v right-1/5" style={{ animationDelay: '6s' }} />
      </div>

      {/* ========================================================================= */}
      {/* 1. STICKY CAPSULE NAVIGATION BAR (AWS STUDENT BUILDER GROUP GEU STYLE)     */}
      {/* ========================================================================= */}
      <header className="fixed top-0 left-0 w-full z-50 transition-all duration-300 select-none border-b border-[#27272a]/70 bg-[#09090b]/80 backdrop-blur-xl py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-12">
            
            {/* Logo */}
            <a href="#home" className="flex items-center gap-3 group select-none">
              <Logo size="md" />
            </a>

            {/* Desktop Capsule Menu */}
            <div className="hidden lg:flex items-center gap-1 bg-[#18181b]/80 border border-[#27272a] backdrop-blur-xl px-3 py-1.5 rounded-full shadow-inner text-xs font-mono font-semibold text-zinc-300">
              <a href="#home" className="px-3 py-1 rounded-full hover:text-white hover:bg-[#27272a] transition-all">Home</a>
              <a href="#intelligence" className="px-3 py-1 rounded-full hover:text-white hover:bg-[#27272a] transition-all">Intelligence</a>
              <a href="#how-it-works" className="px-3 py-1 rounded-full hover:text-white hover:bg-[#27272a] transition-all">How It Works</a>
              <a href="#dori" className="px-3 py-1 rounded-full hover:text-white hover:bg-[#27272a] transition-all">Dori</a>
              <a href="#showcase" className="px-3 py-1 rounded-full hover:text-white hover:bg-[#27272a] transition-all">Showcase</a>
              <a href="#architecture" className="px-3 py-1 rounded-full hover:text-white hover:bg-[#27272a] transition-all">Architecture</a>
              <a href="#technology" className="px-3 py-1 rounded-full hover:text-white hover:bg-[#27272a] transition-all">Technology</a>
            </div>

            {/* Right Action Buttons */}
            <div className="hidden sm:flex items-center gap-2.5">
              <a 
                href="https://github.com/pwnjoshi/AWS-Signal-Agent-Specification"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full border border-[#27272a] hover:border-[#AD5CFF] text-zinc-400 hover:text-white bg-[#18181b]/70 hover:bg-[#27272a] transition-all"
                title="GitHub Repo"
              >
                <Code2 className="w-4 h-4" />
              </a>

              <button
                onClick={onOpenAuthModal}
                className="px-4 py-2 rounded-full border border-[#fe6e00]/40 bg-[#fe6e00]/10 hover:bg-[#fe6e00]/20 text-[#ffc080] font-mono font-bold text-[11px] uppercase tracking-wider transition-all"
              >
                <span className="flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-[#fe6e00]" />
                  Builder ID
                </span>
              </button>

              <button
                onClick={onGetStarted}
                className="px-5 py-2 bg-[#AD5CFF] hover:bg-[#9C47FF] text-white rounded-full font-mono font-bold text-[11px] tracking-wider uppercase shadow-md hover:shadow-purple-glow transition-all active:scale-95 flex items-center gap-1.5"
              >
                <span>Launch Hub</span>
                <ArrowUpRight className="w-3.5 h-3.5 opacity-90" />
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="lg:hidden text-zinc-400 hover:text-white p-2 rounded-xl border border-zinc-800"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-2 mx-4 bg-[#121216]/98 border border-[#27272a] rounded-3xl p-5 shadow-2xl space-y-4 font-mono text-xs">
            <div className="flex flex-col space-y-2 text-zinc-300">
              <a href="#home" onClick={() => setMobileMenuOpen(false)} className="py-2 hover:text-[#AD5CFF]">Home</a>
              <a href="#intelligence" onClick={() => setMobileMenuOpen(false)} className="py-2 hover:text-[#AD5CFF]">Intelligence</a>
              <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="py-2 hover:text-[#AD5CFF]">How It Works</a>
              <a href="#dori" onClick={() => setMobileMenuOpen(false)} className="py-2 hover:text-[#AD5CFF]">Dori</a>
              <a href="#showcase" onClick={() => setMobileMenuOpen(false)} className="py-2 hover:text-[#AD5CFF]">Showcase</a>
              <a href="#architecture" onClick={() => setMobileMenuOpen(false)} className="py-2 hover:text-[#AD5CFF]">Architecture</a>
            </div>
            <div className="pt-3 border-t border-zinc-800 flex flex-col gap-2">
              <button
                onClick={() => { setMobileMenuOpen(false); onOpenAuthModal(); }}
                className="w-full py-2.5 rounded-xl border border-[#fe6e00]/40 bg-[#fe6e00]/10 text-[#ffc080] font-bold"
              >
                Sign in with AWS Builder ID
              </button>
              <button
                onClick={() => { setMobileMenuOpen(false); onGetStarted(); }}
                className="w-full py-2.5 rounded-xl bg-[#AD5CFF] hover:bg-[#9C47FF] text-white font-bold shadow-purple-glow"
              >
                Launch Live Dashboard
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ========================================================================= */}
      {/* 2. HERO SECTION WITH FLOATING AWS BADGES & INTERACTIVE DORI               */}
      {/* ========================================================================= */}
      <section className="relative flex flex-col justify-center pt-28 sm:pt-36 pb-16 sm:pb-24 min-h-[90vh] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center overflow-hidden">
        
        {/* Floating AWS Service Badges on Desktop */}
        <div className="hidden lg:block absolute inset-0 pointer-events-none z-10 overflow-hidden">
          {/* Top Left: AWS Primary */}
          <div className="absolute top-28 left-6 w-12 h-12 rounded-2xl bg-[#121216]/90 border border-[#27272a] hover:border-[#AD5CFF]/60 shadow-lg backdrop-blur-md flex items-center justify-center p-2.5 animate-float">
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg" 
              alt="AWS" 
              className="w-full h-full object-contain" 
            />
          </div>

          {/* Top Right: AWS EC2 Compute */}
          <div className="absolute top-28 right-6 w-12 h-12 rounded-2xl bg-[#121216]/90 border border-[#27272a] hover:border-orange-400/60 shadow-lg backdrop-blur-md flex items-center justify-center p-2.5 animate-float" style={{ animationDelay: '1.5s' }}>
            <img 
              src="https://icon.icepanel.io/AWS/svg/Compute/EC2.svg" 
              alt="EC2" 
              className="w-full h-full object-contain" 
            />
          </div>

          {/* Bottom Left: AWS Lambda Serverless */}
          <div className="absolute bottom-20 left-10 w-12 h-12 rounded-2xl bg-[#121216]/90 border border-[#27272a] hover:border-amber-400/60 shadow-lg backdrop-blur-md flex items-center justify-center p-2.5 animate-float" style={{ animationDelay: '3s' }}>
            <img 
              src="https://icon.icepanel.io/AWS/svg/Compute/Lambda.svg" 
              alt="Lambda" 
              className="w-full h-full object-contain" 
            />
          </div>

          {/* Bottom Right: AWS S3 Storage */}
          <div className="absolute bottom-20 right-10 w-12 h-12 rounded-2xl bg-[#121216]/90 border border-[#27272a] hover:border-emerald-400/60 shadow-lg backdrop-blur-md flex items-center justify-center p-2.5 animate-float" style={{ animationDelay: '4.5s' }}>
            <img 
              src="https://icon.icepanel.io/AWS/svg/Storage/Simple-Storage-Service.svg" 
              alt="S3" 
              className="w-full h-full object-contain" 
            />
          </div>
        </div>

        <div className="relative z-20 space-y-6 sm:space-y-8 stagger-children w-full flex flex-col items-center my-auto">
          
          {/* 1. Sleek Builder Status Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#18181b] border border-[#27272a] hover:border-[#AD5CFF]/50 text-zinc-300 transition-all select-none shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#AD5CFF] animate-ping" />
            <div className="flex items-center gap-1.5 font-mono text-[10px] sm:text-[11px]">
              <span className="font-extrabold text-white">AWS Student Builder Group GEU</span>
              <span className="text-zinc-500">·</span>
              <span className="text-[#ffc080] font-bold">AWS Signal 2.0</span>
            </div>
          </div>

          {/* 2. Main Headline */}
          <div className="space-y-3 max-w-4xl mx-auto">
            <h1 className="font-black font-display leading-[1.08] tracking-tight uppercase text-3xl sm:text-5xl md:text-6xl text-white">
              Where cloud builders <br />
              <span className="text-gradient">
                Stay Informed
              </span>{' '}
              <span
                className="text-shimmer inline-block"
                style={{
                  opacity: cycleVisible ? 1 : 0,
                  transform: cycleVisible ? 'translateY(0)' : 'translateY(-8px)',
                  transition: 'opacity 0.35s ease, transform 0.35s ease',
                }}
              >
                {CYCLE_LINES[cycleIndex]}
              </span>
            </h1>

            <p className="text-xs sm:text-sm md:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed font-mono pt-2 px-2">
              An always-on autonomous intelligence assistant powered by Amazon Bedrock. Monitors What's New feeds, eliminates noise with SHA-256 hashing, and delivers daily executive briefings with voice synthesis.
            </p>
          </div>

          {/* 3. Action Buttons */}
          <div className="pt-2 flex flex-row items-center justify-center gap-3 sm:gap-4 w-full">
            <button
              onClick={onGetStarted}
              className="inline-flex items-center justify-center px-6 sm:px-8 py-3 bg-[#AD5CFF] hover:bg-[#9C47FF] text-white rounded-xl text-xs sm:text-sm font-mono font-bold uppercase tracking-wider shadow-md hover:shadow-purple-glow active:scale-95 transition-all cursor-pointer"
            >
              <span>Launch Dashboard</span>
              <ArrowUpRight className="w-4 h-4 ml-1.5" />
            </button>

            <a 
              href="#dori" 
              className="inline-flex items-center justify-center px-5 sm:px-7 py-3 bg-[#18181b] border border-[#27272a] hover:border-[#AD5CFF]/40 text-white rounded-xl text-xs sm:text-sm font-mono font-bold uppercase tracking-wider gap-2 active:scale-95 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#AD5CFF]" />
              <span>Meet Dori</span>
            </a>
          </div>

          {/* 4. Interactive Hero Dori Avatar */}
          <div className="pt-6 relative flex flex-col items-center">
            <div className="absolute -inset-4 rounded-full bg-[#AD5CFF]/15 blur-3xl animate-pulse-glow pointer-events-none" />
            <DoriCompanion
              emotion={doriEmotion}
              message={speechText}
              size="lg"
              showSpeechBubble={true}
              interactive={true}
            />

            {/* Audio Waveform Player Bar */}
            <div className="mt-4 bg-[#121216]/90 border border-[#27272a] rounded-2xl px-4 py-2.5 flex items-center gap-3 shadow-lg font-mono text-xs">
              <button
                onClick={() => handleSpeak(speechText)}
                className="w-7 h-7 rounded-full bg-[#AD5CFF] hover:bg-[#9C47FF] text-white flex items-center justify-center shadow-md active:scale-90 transition-transform"
                title={isPlayingAudio ? 'Pause Narration' : 'Listen to Dori'}
              >
                {isPlayingAudio ? <Pause className="w-3.5 h-3.5 fill-white" /> : <Play className="w-3.5 h-3.5 fill-white ml-0.5" />}
              </button>
              
              <div className="text-left">
                <span className="text-white font-bold block text-[11px]">Dori Voice Narration</span>
                <span className="text-[10px] text-zinc-500">Web Speech API</span>
              </div>

              {isPlayingAudio ? (
                <div className="flex items-center gap-1 h-5 ml-2">
                  <span className="w-1 bg-[#AD5CFF] rounded-full waveform-bar-1" />
                  <span className="w-1 bg-[#ffc080] rounded-full waveform-bar-2" />
                  <span className="w-1 bg-[#AD5CFF] rounded-full waveform-bar-3" />
                  <span className="w-1 bg-[#ffc080] rounded-full waveform-bar-4" />
                </div>
              ) : (
                <span className="text-[10px] text-zinc-500 ml-2">CLICK TO HEAR</span>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. LIVE STATUS TELEMETRY STRIP                                            */}
      {/* ========================================================================= */}
      <section className="py-12 border-y border-[#27272a]/70 bg-[#121216]/60 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left font-mono">
            
            <div className="space-y-1 border-r border-[#27272a] pr-4">
              <div className="flex items-center justify-center md:justify-start gap-2 text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-[#00d294] animate-pulse" />
                <span>Status</span>
              </div>
              <p className="text-xl sm:text-2xl font-black text-white">Dori Active</p>
              <p className="text-[10px] text-zinc-500">Monitoring AWS 24/7</p>
            </div>

            <div className="space-y-1 border-r border-[#27272a] pr-4">
              <div className="flex items-center justify-center md:justify-start gap-2 text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                <Radio className="w-3.5 h-3.5 text-[#AD5CFF]" />
                <span>Ingested</span>
              </div>
              <p className="text-xl sm:text-2xl font-black text-[#AD5CFF]">247 Signals</p>
              <p className="text-[10px] text-zinc-500">EventBridge Ingestion</p>
            </div>

            <div className="space-y-1 border-r border-[#27272a] pr-4">
              <div className="flex items-center justify-center md:justify-start gap-2 text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-[#ffc080]" />
                <span>Priority</span>
              </div>
              <p className="text-xl sm:text-2xl font-black text-[#ffc080]">4 Verified</p>
              <p className="text-[10px] text-zinc-500">Score ≥ 80/100</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-center md:justify-start gap-2 text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                <Cpu className="w-3.5 h-3.5 text-[#00d294]" />
                <span>Bedrock</span>
              </div>
              <p className="text-xl sm:text-2xl font-black text-[#00d294]">96.4% Conf</p>
              <p className="text-[10px] text-zinc-500">5-Metric Weighted</p>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. THE PROBLEM SECTION: CHAOS VS CLARITY                                  */}
      {/* ========================================================================= */}
      <section id="intelligence" className="py-20 lg:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <span className="text-[10px] text-[#AD5CFF] font-mono font-bold uppercase tracking-[0.2em] block">Developer Dilemma</span>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black font-display text-white tracking-tight uppercase">
            AWS Moves Fast. <br />
            <span className="text-gradient">Too Fast to Read Everything.</span>
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm font-mono leading-relaxed max-w-xl mx-auto">
            Hundreds of release notes, blog posts, and re:Post threads are published weekly. Searching for what matters costs precious coding hours.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* The Old Way */}
          <div className="premium-card p-8 rounded-3xl space-y-6 border-red-500/20">
            <div className="flex items-center justify-between border-b border-[#27272a] pb-4">
              <div>
                <span className="text-xs font-mono font-bold text-red-400 uppercase tracking-wider block">Traditional Noise</span>
                <h3 className="text-xl font-bold text-white">The Old Way: Alert Fatigue</h3>
              </div>
              <div className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 font-black">
                ✕
              </div>
            </div>

            <ul className="space-y-3.5 text-xs sm:text-sm text-zinc-300 font-sans">
              <li className="flex items-start gap-3">
                <span className="text-red-400 font-bold">•</span>
                <span><strong>45 Open Tabs:</strong> Checking RSS feeds, Reddit, and Twitter every single morning.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-400 font-bold">•</span>
                <span><strong>Repetitive Syndicated Noise:</strong> Reading the same feature launch 4 times across different blogs.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-400 font-bold">•</span>
                <span><strong>Missed Breaking Changes:</strong> Overlooking critical IAM security bulletins buried under marketing news.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-400 font-bold">•</span>
                <span><strong>5-10 Hours Lost Weekly:</strong> Manual information hunting instead of building code.</span>
              </li>
            </ul>

            <div className="p-3.5 rounded-xl bg-red-950/20 border border-red-500/20 text-xs text-red-300 font-mono">
              STATUS: INFORMATION OVERLOAD & COGNITIVE FATIGUE
            </div>
          </div>

          {/* The AWS Signal Way */}
          <div className="premium-card p-8 rounded-3xl space-y-6 border-[#AD5CFF]/40 shadow-purple-glow">
            <div className="flex items-center justify-between border-b border-[#27272a] pb-4">
              <div>
                <span className="text-xs font-mono font-bold text-[#AD5CFF] uppercase tracking-wider block">Autonomous AI Agent</span>
                <h3 className="text-xl font-bold text-white">The AWS Signal Way: Clarity</h3>
              </div>
              <div className="w-9 h-9 rounded-xl bg-[#AD5CFF]/20 border border-[#AD5CFF]/40 flex items-center justify-center text-[#AD5CFF] font-black">
                ✓
              </div>
            </div>

            <ul className="space-y-3.5 text-xs sm:text-sm text-zinc-300 font-sans">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-[#AD5CFF] shrink-0 mt-0.5" />
                <span><strong>One Autonomous Companion (Dori):</strong> Listening 24/7 in the background while you build.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-[#AD5CFF] shrink-0 mt-0.5" />
                <span><strong>SHA-256 Deduplication:</strong> Identical articles are compressed into a single verified signal.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-[#AD5CFF] shrink-0 mt-0.5" />
                <span><strong>5-Metric Bedrock Ranking:</strong> Instant neural separation of high-impact releases.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-[#AD5CFF] shrink-0 mt-0.5" />
                <span><strong>Voice Briefings:</strong> Hands-free narration ready before your morning standup.</span>
              </li>
            </ul>

            <div className="p-3.5 rounded-xl bg-[#AD5CFF]/10 border border-[#AD5CFF]/30 text-xs text-[#d8b4fe] font-mono flex items-center justify-between">
              <span>STATUS: 100% BUILDER FOCUS RESTORED</span>
              <Sparkles className="w-4 h-4 text-[#AD5CFF]" />
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. THE CORE PHILOSOPHY SECTION                                            */}
      {/* ========================================================================= */}
      <section className="py-20 border-y border-[#27272a]/80 bg-[#121216]/40 relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          
          <span className="text-[10px] text-[#ffc080] font-mono font-bold uppercase tracking-[0.2em] block">Philosophy</span>

          <blockquote className="text-2xl sm:text-4xl md:text-5xl font-black font-display text-white tracking-tight uppercase leading-tight">
            “The best tool is the one you <span className="text-gradient">never have to open.</span>”
          </blockquote>

          <p className="text-zinc-400 text-xs sm:text-sm md:text-base font-mono max-w-2xl mx-auto leading-relaxed">
            AWS Signal doesn't wait for you to search. It works continuously in the background. It watches. It learns. It filters. It prioritizes. And when something matters — it tells you.
          </p>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. HOW AWS SIGNAL WORKS (5-STEP PIPELINE TIMELINE)                        */}
      {/* ========================================================================= */}
      <section id="how-it-works" className="py-20 lg:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-[10px] text-[#AD5CFF] font-mono font-bold uppercase tracking-[0.2em] block">Architecture Pipeline</span>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black font-display text-white tracking-tight uppercase">
            How AWS Signal Operates
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm font-mono leading-relaxed">
            Click through the 5-stage pipeline to inspect how raw AWS data is transformed into high-confidence intelligence.
          </p>
        </div>

        {/* Step Selector Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {archSteps.map((s, idx) => {
            const Icon = s.icon;
            const isSelected = selectedArchStep === idx;
            return (
              <button
                key={s.step}
                onClick={() => setSelectedArchStep(idx)}
                className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between font-mono ${
                  isSelected
                    ? 'bg-[#18181b] border-[#AD5CFF] shadow-purple-glow'
                    : 'bg-[#121216]/70 border-[#27272a] hover:bg-[#18181b]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-bold ${isSelected ? 'text-[#AD5CFF]' : 'text-zinc-500'}`}>
                    {s.step}
                  </span>
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-[#AD5CFF]' : 'text-zinc-500'}`} />
                </div>
                <span className="text-xs font-bold text-white leading-tight">
                  {s.title}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Step Deep Dive Card */}
        {archSteps[selectedArchStep] && (
          <div className="premium-card p-8 sm:p-12 rounded-3xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              <div className="lg:col-span-7 space-y-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#18181b] border border-[#27272a] text-xs font-mono font-bold text-[#AD5CFF]">
                  <span>STAGE {archSteps[selectedArchStep].step}</span>
                  <span>•</span>
                  <span>{archSteps[selectedArchStep].badge}</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-black font-display text-white uppercase">
                  {archSteps[selectedArchStep].title}
                </h3>

                <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed">
                  {archSteps[selectedArchStep].description}
                </p>

                <div className="space-y-2 pt-2 font-mono text-xs text-zinc-300">
                  {archSteps[selectedArchStep].details.map((detail, dIdx) => (
                    <div key={dIdx} className="flex items-center gap-3">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#00d294] shrink-0" />
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-5 bg-[#09090b] border border-[#27272a] rounded-2xl p-6 font-mono text-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#27272a] text-zinc-500">
                  <span>// ARCHITECTURE LOG</span>
                  <span className="text-[#00d294]">STATUS: ACTIVE</span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#18181b] border border-[#27272a] text-[#ffc080] text-[11px]">
                  {archSteps[selectedArchStep].flow}
                </div>

                <div className="text-[11px] text-zinc-400 space-y-1 pt-1">
                  <p>• Serverless AWS Lambda Execution</p>
                  <p>• Sub-5ms DynamoDB Checksum Indexing</p>
                  <p>• Amazon Bedrock Multi-Dimensional Prompting</p>
                </div>
              </div>

            </div>
          </div>
        )}

      </section>

      {/* ========================================================================= */}
      {/* 7. THE "WHILE YOU WERE AWAY..." SIGNATURE EXPERIENCE                      */}
      {/* ========================================================================= */}
      <section id="showcase" className="py-20 bg-[#121216]/50 border-y border-[#27272a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-[10px] text-[#ffc080] font-mono font-bold uppercase tracking-[0.2em] block">Showcase Feature</span>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black font-display text-white tracking-tight uppercase">
              “While You Were Away...”
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm font-mono leading-relaxed">
              The flagship feature that greets builders when they return. A synthesized executive brief ready in seconds.
            </p>
          </div>

          <div className="premium-card p-6 sm:p-10 rounded-3xl space-y-8">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#27272a]">
              <div>
                <span className="text-xs font-mono font-bold text-[#AD5CFF] uppercase tracking-wider block">Executive Briefing</span>
                <h3 className="text-lg sm:text-xl font-bold text-white">Here is what changed in the AWS Cloud:</h3>
              </div>

              <button
                onClick={() => handleSpeak(speechText, 'excited')}
                className="inline-flex items-center gap-2 bg-[#AD5CFF] hover:bg-[#9C47FF] text-white px-4 py-2 rounded-full font-mono text-xs font-bold uppercase shadow-purple-glow transition-all active:scale-95 self-start sm:self-auto"
              >
                <Volume2 className="w-4 h-4" />
                <span>{isPlayingAudio ? 'Pause Narration' : 'Listen to Briefing'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div className="bg-[#09090b] border border-emerald-500/30 rounded-2xl p-4 space-y-2">
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase font-mono">
                  🔥 High Priority
                </span>
                <h4 className="text-xs sm:text-sm font-bold text-white">Amazon Bedrock Cross-Region Streaming</h4>
                <p className="text-xs text-zinc-400 line-clamp-2 font-mono">Low latency AI endpoint routing across us-east-1 and eu-west-1.</p>
                <span className="text-[10px] text-emerald-400 font-mono block">Score: 95/100</span>
              </div>

              <div className="bg-[#09090b] border border-[#AD5CFF]/30 rounded-2xl p-4 space-y-2">
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-[#AD5CFF]/20 text-[#d8b4fe] border border-[#AD5CFF]/30 uppercase font-mono">
                  ⚡ Developer Signal
                </span>
                <h4 className="text-xs sm:text-sm font-bold text-white">EventBridge Pipes JSONPath Filters</h4>
                <p className="text-xs text-zinc-400 line-clamp-2 font-mono">Filter and enrich event streams before invoking downstream Lambda functions.</p>
                <span className="text-[10px] text-[#d8b4fe] font-mono block">Score: 88/100</span>
              </div>

              <div className="bg-[#09090b] border border-red-500/30 rounded-2xl p-4 space-y-2">
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/30 uppercase font-mono">
                  🛡 Security Alert
                </span>
                <h4 className="text-xs sm:text-sm font-bold text-white">IAM Access Analyzer S3 Policy Check</h4>
                <p className="text-xs text-zinc-400 line-clamp-2 font-mono">Automated mathematical verification of public S3 bucket policies.</p>
                <span className="text-[10px] text-red-400 font-mono block">Score: 92/100</span>
              </div>

              <div className="bg-[#09090b] border border-[#ffc080]/30 rounded-2xl p-4 space-y-2">
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-[#ffc080]/20 text-[#ffc080] border border-[#ffc080]/30 uppercase font-mono">
                  💡 Community Insight
                </span>
                <h4 className="text-xs sm:text-sm font-bold text-white">Lambda ARM64 Graviton3 Memory Tuning</h4>
                <p className="text-xs text-zinc-400 line-clamp-2 font-mono">re:Post benchmark achieving sub-150ms cold starts on compiled Go binaries.</p>
                <span className="text-[10px] text-[#ffc080] font-mono block">Score: 79/100</span>
              </div>

            </div>

            <div className="p-5 rounded-2xl bg-[#09090b] border border-[#27272a] flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#AD5CFF]/20 border border-[#AD5CFF]/40 flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4 text-[#AD5CFF]" />
                </div>
                <div>
                  <p className="text-white font-bold">Dori's Intelligence Summary</p>
                  <p className="text-zinc-400 text-[11px]">
                    “While you were away, I analyzed 247 signals and found 6 updates worth your attention.”
                  </p>
                </div>
              </div>

              <button
                onClick={onGetStarted}
                className="inline-flex items-center gap-2 bg-[#18181b] hover:bg-[#27272a] text-white px-5 py-2.5 rounded-xl border border-[#27272a] text-xs font-bold uppercase transition-all"
              >
                <span>Open Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#AD5CFF]" />
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. MEET DORI SECTION                                                      */}
      {/* ========================================================================= */}
      <section id="dori" className="py-20 lg:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 premium-card p-8 sm:p-10 rounded-3xl flex flex-col items-center justify-center text-center relative">
            <div className="w-full flex justify-between items-center pb-4 border-b border-[#27272a] text-[11px] font-mono text-zinc-500">
              <span className="text-[#AD5CFF] font-bold">DORI SIMULATOR</span>
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

            <div className="w-full space-y-2 text-left font-mono">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Ask Dori a Question:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {doriPrompts.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSpeechText(p.response);
                      setDoriEmotion(p.emotion);
                      handleSpeak(p.response, p.emotion);
                    }}
                    className="p-3 rounded-xl bg-[#09090b] hover:bg-[#18181b] border border-[#27272a] text-xs text-zinc-300 hover:text-white transition-all text-left"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6">
            <span className="text-[10px] text-[#AD5CFF] font-mono font-bold uppercase tracking-[0.2em] block">Your Cloud Companion</span>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black font-display text-white tracking-tight uppercase leading-tight">
              Meet Dori. <br />
              <span className="text-gradient">Always Listening. Never Intrusive.</span>
            </h2>

            <p className="text-zinc-400 text-xs sm:text-sm font-mono leading-relaxed">
              Dori is an autonomous agent persona engineered to represent AWS Signal’s underlying reasoning engine. Friendly, curious, and relentless about cloud efficiency.
            </p>

            <div className="grid grid-cols-2 gap-3.5 pt-2 font-mono text-xs">
              <div className="p-4 rounded-2xl bg-[#121216] border border-[#27272a] space-y-1">
                <span className="text-[#AD5CFF] font-bold block">FRIENDLY & CURIOUS</span>
                <p className="text-zinc-400 text-[11px]">Approachable intelligence simplifying complex launches.</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#121216] border border-[#27272a] space-y-1">
                <span className="text-[#ffc080] font-bold block">ALWAYS WORKING</span>
                <p className="text-zinc-400 text-[11px]">EventBridge automation running while you sleep.</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#121216] border border-[#27272a] space-y-1">
                <span className="text-[#00d294] font-bold block">BUILDER FOCUSED</span>
                <p className="text-zinc-400 text-[11px]">Extracts architecture patterns developers use.</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#121216] border border-[#27272a] space-y-1">
                <span className="text-purple-300 font-bold block">NEVER INTRUSIVE</span>
                <p className="text-zinc-400 text-[11px]">Only alerts for verified high-impact updates.</p>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onGetStarted}
                className="px-7 py-3 bg-[#AD5CFF] hover:bg-[#9C47FF] text-white rounded-full font-mono font-bold text-xs uppercase shadow-purple-glow transition-all active:scale-95 flex items-center gap-2"
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
      <section className="py-20 bg-[#121216]/50 border-y border-[#27272a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-[10px] text-[#AD5CFF] font-mono font-bold uppercase tracking-[0.2em] block">Dashboard Preview</span>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black font-display text-white tracking-tight uppercase">
              Production Command Center
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm font-mono leading-relaxed">
              Filter, search, inspect AI rationales, and bookmark signals into your personal vault.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 font-mono text-xs">
            {[
              { id: 'all', label: 'All Verified Signals' },
              { id: 'priority', label: '🔥 High Priority Only' },
              { id: 'security', label: '🛡 Security Watch' },
              { id: 'architecture', label: '⚡ Architecture Patterns' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setDashboardFilter(tab.id as any)}
                className={`px-4 py-2 rounded-full font-bold transition-all border ${
                  dashboardFilter === tab.id
                    ? 'bg-[#AD5CFF] text-white border-[#AD5CFF] shadow-purple-glow'
                    : 'bg-[#18181b] border-[#27272a] text-zinc-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredPreviewSignals.map(sig => (
              <div
                key={sig.id}
                className="premium-card p-6 rounded-3xl space-y-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${sig.badgeColor}`}>
                      {sig.category}
                    </span>
                    <span className="text-xs font-mono font-bold text-[#ffc080] bg-[#09090b] px-2 py-0.5 rounded-md border border-[#27272a]">
                      SCORE {sig.score}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
                    {sig.title}
                  </h3>

                  <p className="text-xs text-zinc-400 mt-2 leading-relaxed font-mono">
                    {sig.summary}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#27272a] flex items-center justify-between text-xs font-mono">
                  <span className="text-zinc-500">Service: <strong className="text-white">{sig.service}</strong></span>
                  <button
                    onClick={onGetStarted}
                    className="inline-flex items-center gap-1 text-[#AD5CFF] font-bold hover:underline"
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
      <section id="architecture" className="py-20 lg:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-[10px] text-[#00d294] font-mono font-bold uppercase tracking-[0.2em] block">Cloud Infrastructure</span>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black font-display text-white tracking-tight uppercase">
            End-to-End Serverless Architecture
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm font-mono leading-relaxed">
            Built 100% serverless on AWS Free Tier using Amazon Bedrock, AWS Lambda, DynamoDB, EventBridge, and Amazon SES.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
          
          <div className="premium-card p-6 rounded-3xl space-y-4">
            <div className="flex items-center gap-2 text-[#AD5CFF] font-bold pb-2 border-b border-[#27272a]">
              <Radio className="w-4 h-4" />
              <span>01. INGESTION & HASHING</span>
            </div>
            <p className="text-zinc-400 text-xs leading-relaxed font-sans">
              AWS EventBridge triggers an AWS Lambda worker every 3 hours to parse RSS feeds and compute SHA-256 fingerprints.
            </p>
            <div className="p-3 bg-[#09090b] rounded-xl text-zinc-300 space-y-1 text-[11px]">
              <p>• AWS EventBridge Scheduler</p>
              <p>• Lambda Node.js Ingestion Worker</p>
              <p>• SHA-256 Fingerprint Generator</p>
            </div>
          </div>

          <div className="premium-card p-6 rounded-3xl space-y-4 border-[#AD5CFF]/40 shadow-purple-glow">
            <div className="flex items-center gap-2 text-[#ffc080] font-bold pb-2 border-b border-[#27272a]">
              <Cpu className="w-4 h-4" />
              <span>02. BEDROCK REASONING</span>
            </div>
            <p className="text-zinc-400 text-xs leading-relaxed font-sans">
              Amazon Bedrock evaluates verified new signals against 5 scoring dimensions, extracts takeaways, and generates briefings.
            </p>
            <div className="p-3 bg-[#09090b] rounded-xl text-zinc-300 space-y-1 text-[11px]">
              <p>• Amazon Bedrock Claude / Nova</p>
              <p>• 5-Metric Weighted Evaluation</p>
              <p>• DynamoDB Signal Memory Store</p>
            </div>
          </div>

          <div className="premium-card p-6 rounded-3xl space-y-4">
            <div className="flex items-center gap-2 text-[#00d294] font-bold pb-2 border-b border-[#27272a]">
              <Mail className="w-4 h-4" />
              <span>03. DISPATCH & UI</span>
            </div>
            <p className="text-zinc-400 text-xs leading-relaxed font-sans">
              High-priority alerts trigger Amazon SES email dispatch. Signals are surfaced via the standalone REST API and Command Center.
            </p>
            <div className="p-3 bg-[#09090b] rounded-xl text-zinc-300 space-y-1 text-[11px]">
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
      <section id="technology" className="py-20 bg-[#121216]/50 border-y border-[#27272a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-[10px] text-[#ffc080] font-mono font-bold uppercase tracking-[0.2em] block">Core Technology</span>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black font-display text-white tracking-tight uppercase">
              Built for Autonomous Intelligence
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm font-mono leading-relaxed">
              Every layer of AWS Signal has been selected for resilience, security, and developer clarity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-mono text-xs">
            
            <div className="premium-card p-6 rounded-3xl space-y-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#AD5CFF]/15 text-[#AD5CFF] flex items-center justify-center font-bold">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">Amazon Bedrock</h3>
              <p className="text-zinc-400 text-[11px] leading-relaxed font-sans">
                The core reasoning engine powering multi-metric signal ranking, developer takeaways, and daily briefing synthesis.
              </p>
            </div>

            <div className="premium-card p-6 rounded-3xl space-y-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#ffc080]/15 text-[#ffc080] flex items-center justify-center font-bold">
                <Database className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">Amazon DynamoDB</h3>
              <p className="text-zinc-400 text-[11px] leading-relaxed font-sans">
                Single-digit millisecond latency storage for agent memory, SHA-256 deduplication state, and saved signal vaults.
              </p>
            </div>

            <div className="premium-card p-6 rounded-3xl space-y-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-[#00d294] flex items-center justify-center font-bold">
                <Mail className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">Amazon SES</h3>
              <p className="text-zinc-400 text-[11px] leading-relaxed font-sans">
                High-deliverability email dispatch alerting teams when critical security or architectural updates occur.
              </p>
            </div>

            <div className="premium-card p-6 rounded-3xl space-y-2.5">
              <div className="w-9 h-9 rounded-xl bg-purple-500/15 text-purple-300 flex items-center justify-center font-bold">
                <Volume2 className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">Web Speech API</h3>
              <p className="text-zinc-400 text-[11px] leading-relaxed font-sans">
                In-browser audio synthesis enabling Dori to read out daily intelligence digests hands-free.
              </p>
            </div>

            <div className="premium-card p-6 rounded-3xl space-y-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-300 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">SHA-256 Hashing</h3>
              <p className="text-zinc-400 text-[11px] leading-relaxed font-sans">
                Cryptographic content fingerprinting that prevents repetitive syndicated press releases from appearing twice.
              </p>
            </div>

            <div className="premium-card p-6 rounded-3xl space-y-2.5">
              <div className="w-9 h-9 rounded-xl bg-sky-500/15 text-sky-300 flex items-center justify-center font-bold">
                <Server className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">Serverless Lambda</h3>
              <p className="text-zinc-400 text-[11px] leading-relaxed font-sans">
                Zero standby costs, automated scalability, and sub-100ms API response times with Lambda Function URLs.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 12. FINAL CALL TO ACTION                                                  */}
      {/* ========================================================================= */}
      <section className="py-20 lg:py-28 border-t border-[#27272a] text-center bg-gradient-to-b from-[#09090b] to-[#121216]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#AD5CFF] to-[#ffc080] mx-auto flex items-center justify-center text-white shadow-purple-glow">
            <Sparkles className="w-7 h-7 text-white" />
          </div>

          <h2 className="text-3xl sm:text-5xl font-black font-display text-white tracking-tight uppercase leading-tight">
            Stop Searching for Signals. <br />
            <span className="text-gradient">Let Intelligence Find You.</span>
          </h2>

          <p className="text-zinc-400 text-xs sm:text-sm font-mono max-w-xl mx-auto leading-relaxed">
            AWS Signal works quietly in the background so you can spend more time building and less time searching.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3 font-mono">
            <button
              onClick={onGetStarted}
              className="px-8 py-3.5 bg-[#AD5CFF] hover:bg-[#9C47FF] text-white rounded-full font-bold text-xs uppercase tracking-wider shadow-purple-glow transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <span>Launch AWS Signal</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenAuthModal}
              className="px-7 py-3.5 bg-[#18181b] hover:bg-[#27272a] text-white rounded-full border border-[#27272a] font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
            >
              <UserCheck className="w-4 h-4 text-[#ffc080]" />
              <span>Connect Builder ID</span>
            </button>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 13. FOOTER                                                                */}
      {/* ========================================================================= */}
      <footer className="border-t border-[#27272a] bg-[#09090b] py-10 text-zinc-500 text-xs font-mono">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <Logo size="md" />

            <div className="flex flex-wrap items-center gap-5 text-[11px] font-bold uppercase">
              <a href="#home" className="hover:text-white transition-colors">Home</a>
              <a href="#intelligence" className="hover:text-white transition-colors">Intelligence</a>
              <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
              <a href="#dori" className="hover:text-white transition-colors">Dori</a>
              <a href="#showcase" className="hover:text-white transition-colors">Showcase</a>
              <a href="#architecture" className="hover:text-white transition-colors">Architecture</a>
              <a href="https://github.com/pwnjoshi/AWS-Signal-Agent-Specification" target="_blank" rel="noopener noreferrer" className="hover:text-[#AD5CFF] transition-colors">GitHub</a>
            </div>
          </div>

          <div className="pt-6 border-t border-[#27272a]/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-[10.5px]">
            <p>
              AWS Signal — Autonomous Intelligence for the AWS Ecosystem • Powered by Amazon Bedrock, AWS Lambda, DynamoDB & SES.
            </p>
            <p className="text-zinc-400">
              AWS Student Builder Group GEU • Graphic Era Deemed to be University
            </p>
          </div>

        </div>
      </footer>

    </div>
  );
};
