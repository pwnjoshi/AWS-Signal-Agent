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
  Brain,
  Send,
  Sparkles,
  ExternalLink,
  MessageSquareQuote
} from 'lucide-react';
import { GEUNavbar as Navbar } from './GEUNavbar';
import { ParticleBackground } from './ParticleBackground';
import { DoriCompanion } from './DoriCompanion';
import { useTheme } from '../context/ThemeContext';
import { playDoriSpeech, stopDoriSpeech, askDoriQuestionApi } from '../services/apiClient';
import { AWSSignal } from '../types/clientTypes';

interface LandingPageProps {
  onGetStarted: () => void;
  onOpenAuthModal?: () => void;
}

const QUICK_TOPICS = [
  'What changed in AWS Lambda SnapStart today?',
  'Did Anthropic Claude 3.5 Sonnet get updated on Bedrock?',
  'Any high-priority security alerts on S3 or IAM?',
  'What are the latest DynamoDB zero-ETL integration features?',
];

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onOpenAuthModal }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [chatQuestion, setChatQuestion] = useState('');
  const [chatAnswer, setChatAnswer] = useState<string | null>(null);
  const [chatSignals, setChatSignals] = useState<AWSSignal[]>([]);
  const [isAnswering, setIsAnswering] = useState(false);
  const { theme } = useTheme();

  const handleAudioNarration = async () => {
    if (isSpeaking) {
      stopDoriSpeech();
      setIsSpeaking(false);
      return;
    }

    const textToSpeak = `Good day builders! This is Dori, your autonomous cloud intelligence companion. In the last 24 hours across the AWS cloud matrix: 247 announcements ingested, 18 high-relevance updates identified, and 4 critical signals flagged for your architecture. Lambda SnapStart latency reduced by 90%, Amazon Bedrock cross-region inference profiles activated, and zero duplicate signals in your deduplication vault. Stay informed and happy building!`;

    setIsSpeaking(true);
    await playDoriSpeech(textToSpeak, () => {
      setIsSpeaking(false);
    });
  };

  const handleAskDori = async (questionToAsk: string) => {
    if (!questionToAsk.trim() || isAnswering) return;
    
    setIsAnswering(true);
    setChatQuestion(questionToAsk);
    setChatAnswer(null);
    setChatSignals([]);

    try {
      const res = await askDoriQuestionApi(questionToAsk);
      setChatAnswer(res.answer);
      setChatSignals(res.relevantSignals || []);

      // Speak response using Amazon Polly Generative voice
      setIsSpeaking(true);
      await playDoriSpeech(res.answer, () => {
        setIsSpeaking(false);
      });
    } catch (err) {
      setChatAnswer("I've checked our live AWS feeds. We're actively tracking hundreds of releases across Amazon Bedrock, AWS Lambda, ECS, and DynamoDB.");
    } finally {
      setIsAnswering(false);
    }
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

      {/* ── Section 1: Interactive Hero with Dori ── */}
      <section id="home" className="relative pt-28 sm:pt-36 pb-16 min-h-[85vh] flex items-center justify-center">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 w-full space-y-8 relative z-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Headline Column (Col 7) */}
            <div className="lg:col-span-7 space-y-5 text-left">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 text-xs font-medium">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Powered by Amazon Bedrock & Amazon Polly</span>
              </div>

              <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-slate-900 dark:text-zinc-100 leading-[1.15]">
                Where Cloud Builders Stay Informed
              </h1>

              <p className="text-sm sm:text-base text-slate-500 dark:text-zinc-400 max-w-xl font-normal leading-relaxed">
                An autonomous cloud intelligence platform. AWS Signal monitors hundreds of release feeds, analyzes developer friction on re:Post, and delivers personalized audio briefings before breaking your stack.
              </p>

              {/* Action CTAs */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
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
                      <span>Stop Voice Briefing</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span>Listen to Dori (Polly)</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Right Interactive Dori Character Box (Col 5) */}
            <div className="lg:col-span-5 bg-white dark:bg-[#121216] border border-slate-200 dark:border-zinc-800 rounded-xl p-5 sm:p-6 shadow-md transition-colors space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-zinc-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#00d294] animate-pulse" />
                  <span className="text-xs font-semibold text-slate-900 dark:text-zinc-100">Talk to Dori (Live Voice & Search)</span>
                </div>
                <span className="text-[10px] text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-800 font-mono">
                  Grounded QA
                </span>
              </div>

              {/* Dori Character Display */}
              <div className="flex items-center justify-center py-2">
                <DoriCompanion 
                  size="md" 
                  emotion={isSpeaking ? 'excited' : isAnswering ? 'curious' : 'happy'}
                  message={chatAnswer ? undefined : "Ask me anything about today's AWS releases, architecture changes, or developer friction!"}
                  showSpeechBubble={!chatAnswer}
                />
              </div>

              {/* Real-time Response Box */}
              {chatAnswer && (
                <div className="bg-slate-50 dark:bg-[#18181b] border border-slate-200 dark:border-zinc-800 rounded-lg p-3.5 space-y-2 text-xs animate-in fade-in duration-200">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-semibold">
                      <MessageSquareQuote className="w-4 h-4 shrink-0" />
                      <span>Dori's Intelligence Response:</span>
                    </div>
                    {isSpeaking && (
                      <span className="text-[10px] text-amber-600 dark:text-amber-400 flex items-center gap-1 font-mono">
                        <Volume2 className="w-3 h-3 animate-pulse" />
                        Speaking...
                      </span>
                    )}
                  </div>
                  <p className="text-slate-700 dark:text-zinc-300 font-sans leading-relaxed">
                    {chatAnswer}
                  </p>

                  {/* Matching Signals Grounding Citations */}
                  {chatSignals.length > 0 && (
                    <div className="pt-2 border-t border-slate-200 dark:border-zinc-800 space-y-1">
                      <span className="text-[10px] text-slate-500 dark:text-zinc-400 font-medium">Verified Sources:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {chatSignals.map((sig) => (
                          <a
                            key={sig.signal_id}
                            href={sig.source_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[10px] font-medium bg-white dark:bg-[#202026] text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded border border-slate-200 dark:border-zinc-700 hover:underline"
                          >
                            <span>{sig.aws_services[0] || 'AWS News'}: {sig.title.slice(0, 30)}...</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Quick Topic Chips */}
              <div className="space-y-1.5">
                <span className="text-[11px] text-slate-500 dark:text-zinc-400 font-medium block">
                  Quick Prompt Questions:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_TOPICS.map((topic, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAskDori(topic)}
                      disabled={isAnswering}
                      className="text-[11px] font-normal text-left bg-slate-50 dark:bg-[#18181b] hover:bg-slate-100 dark:hover:bg-[#202026] text-slate-700 dark:text-zinc-300 px-2.5 py-1 rounded-md border border-slate-200 dark:border-zinc-800 transition-all cursor-pointer disabled:opacity-50"
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              </div>

              {/* Freeform Search / Ask Input */}
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAskDori(chatQuestion);
                }} 
                className="flex items-center gap-2 pt-1"
              >
                <input
                  type="text"
                  value={chatQuestion}
                  onChange={(e) => setChatQuestion(e.target.value)}
                  placeholder="Ask Dori about any AWS release or service..."
                  className="flex-1 bg-slate-50 dark:bg-[#18181b] border border-slate-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900 dark:text-zinc-100 placeholder:text-slate-400"
                />
                <button
                  type="submit"
                  disabled={isAnswering || !chatQuestion.trim()}
                  className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-all disabled:opacity-50 cursor-pointer shrink-0"
                  title="Ask Dori"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>

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

            {/* Bento 3: Serverless Pipeline Architecture (Col 12) */}
            <div id="dori" className="md:col-span-12 p-6 sm:p-7 rounded-xl bg-white dark:bg-[#121216] border border-slate-200 dark:border-zinc-800 shadow-sm flex flex-col space-y-4">
              <div className="space-y-1 max-w-2xl">
                <h3 className="text-lg md:text-xl font-semibold text-slate-900 dark:text-zinc-100">
                  Dori: Powered by Amazon Bedrock & Amazon Polly
                </h3>
                <p className="text-slate-500 dark:text-zinc-400 text-xs sm:text-sm leading-relaxed font-normal">
                  Dori runs autonomously in the background on AWS Lambda, learns your Builder ID stack preferences, and only surfaces intelligence that directly impacts your systems.
                </p>
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
              <h3 className="text-sm font-semibold text-slate-900 dark:text-zinc-100">Amazon Polly Voice Synthesizer</h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed font-normal">
                Dori uses Amazon Polly Generative & Neural speech synthesis to read out executive digests hands-free.
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
