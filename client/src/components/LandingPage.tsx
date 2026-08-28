import React, { useState } from 'react';
import { DoriCompanion } from './DoriCompanion';
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
  Code2
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  onOpenAuthModal: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onOpenAuthModal }) => {
  const [activeFeatureTab, setActiveFeatureTab] = useState<'bedrock' | 'decoupled' | 'companion' | 'alerts'>('bedrock');

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between font-sans selection:bg-blue-500 selection:text-white relative overflow-hidden">
      
      {/* Background Decorative Mesh Gradients */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-amber-500/10 rounded-full blur-[160px] pointer-events-none" />

      {/* Top Navigation Bar */}
      <header className="max-w-7xl mx-auto w-full px-6 py-6 flex items-center justify-between relative z-20">
        <div className="bg-slate-800/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-slate-700/60 shadow-lg">
          <Logo size="md" />
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenAuthModal}
            className="hidden sm:inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-4 py-2.5 rounded-xl font-bold text-xs transition-all"
          >
            <UserCheck className="w-4 h-4 text-amber-400" />
            <span>Builder ID Auth</span>
          </button>

          <button
            onClick={onGetStarted}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-amber-500 hover:opacity-90 text-white px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-lg shadow-blue-500/20 transition-all active:scale-95"
          >
            <span>Launch Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-12 lg:py-20 relative z-10 flex-1 space-y-20">
        
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Left Copy */}
          <div className="flex-1 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-extrabold tracking-wider uppercase backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '4s' }} />
              <span>AUTONOMOUS AWS INTELLIGENCE PLATFORM</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05] font-rounded">
              AWS Pulse AI <br />
              <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-amber-400 bg-clip-text text-transparent">
                Watched while you're away.
              </span>
            </h1>

            <p className="text-slate-300 text-base sm:text-xl max-w-2xl leading-relaxed font-normal">
              An always-on serverless cloud companion powered by **Amazon Bedrock**. Ingests, deduplicates, ranks AWS news & re:Post community friction, generates voice briefings, and dispatches automated SES team alerts.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <button
                onClick={onOpenAuthModal}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-8 py-4 rounded-2xl font-extrabold text-base shadow-xl shadow-amber-500/25 transition-all active:scale-95"
              >
                <UserCheck className="w-5 h-5" />
                <span>Sign In with AWS Builder ID</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                onClick={onGetStarted}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-800/90 hover:bg-slate-700 text-slate-100 border border-slate-700/80 px-7 py-4 rounded-2xl font-bold text-base shadow-md backdrop-blur-md transition-all"
              >
                <Radio className="w-5 h-5 text-blue-400" />
                <span>Explore Live Signals</span>
              </button>
            </div>

            {/* Live Ticker Stats */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-slate-800 text-left">
              <div>
                <span className="text-xl sm:text-2xl font-extrabold text-white block font-rounded">100%</span>
                <span className="text-xs text-slate-400 font-medium">EventBridge Autonomous</span>
              </div>
              <div>
                <span className="text-xl sm:text-2xl font-extrabold text-blue-400 block font-rounded">5-Metric</span>
                <span className="text-xs text-slate-400 font-medium">Bedrock AI Scoring</span>
              </div>
              <div>
                <span className="text-xl sm:text-2xl font-extrabold text-amber-400 block font-rounded">REST API</span>
                <span className="text-xs text-slate-400 font-medium">Open `/api/v1/news`</span>
              </div>
            </div>
          </div>

          {/* Right Visual: Interactive Dori Showcase Card */}
          <div className="shrink-0 w-full lg:w-[480px] bg-slate-800/70 border border-slate-700/80 p-8 sm:p-10 rounded-4xl shadow-2xl backdrop-blur-xl relative flex flex-col items-center">
            <div className="absolute top-4 right-4 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full text-[10px] font-extrabold tracking-wider uppercase flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              LIVE TELEMETRY ONLINE
            </div>

            <DoriCompanion
              emotion="excited"
              message="Welcome Builder! I'm Dori — I've ingested 167 raw AWS items and ranked 10 high-impact signals for you!"
              size="lg"
              showSpeechBubble={true}
            />

            <div className="w-full mt-6 bg-slate-900/80 border border-slate-700/60 rounded-2xl p-4 text-xs space-y-2">
              <div className="flex justify-between text-slate-300 font-bold">
                <span>Top Signal Detected</span>
                <span className="text-blue-400">Score 95/100</span>
              </div>
              <p className="text-slate-400 line-clamp-2">
                Amazon Bedrock streaming low-latency inference endpoints launched in us-east-1.
              </p>
            </div>
          </div>
        </div>

        {/* Feature Tabs & Architecture Showcase */}
        <div className="pt-12 border-t border-slate-800 space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-rounded">
              Enterprise Autonomous Cloud Architecture
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              AWS Pulse AI operates completely serverless on AWS Free Tier infrastructure.
            </p>
          </div>

          {/* Interactive Feature Selector Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {[
              { id: 'bedrock', label: '🤖 Amazon Bedrock Engine', icon: Cpu },
              { id: 'decoupled', label: '📖 Decoupled REST API', icon: Code2 },
              { id: 'companion', label: '🔊 Voice Audio Briefings', icon: Volume2 },
              { id: 'alerts', label: '✉️ Multi-Recipient SES Alerts', icon: Bell },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveFeatureTab(tab.id as any)}
                className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-extrabold transition-all border ${
                  activeFeatureTab === tab.id
                    ? 'bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-500/25'
                    : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:bg-slate-700 hover:text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Display Panel */}
          <div className="bg-slate-800/60 border border-slate-700/80 rounded-3xl p-6 sm:p-10 backdrop-blur-xl">
            {activeFeatureTab === 'bedrock' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <span className="text-xs font-extrabold text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                    5-METRIC WEIGHTED SCORING
                  </span>
                  <h3 className="text-2xl font-bold text-white font-rounded">
                    Precision Signal Ranking with Bedrock Nova & Claude Models
                  </h3>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    Ingested RSS feed items pass through SHA-256 deduplication before evaluation by Amazon Bedrock. Calculates 5 weighted metrics: Importance (0.25), Relevance (0.25), Novelty (0.15), Momentum (0.15), and Impact (0.20).
                  </p>
                  <ul className="space-y-2 text-xs text-slate-300">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Synthesizes "Why It Matters" developer perspective</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Classifies target engineer personas & recommended 10-min lab steps</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 font-mono text-xs text-slate-300 space-y-3">
                  <div className="text-slate-500 border-b border-slate-800 pb-2 flex justify-between">
                    <span>// BEDROCK SCORE FORMULA</span>
                    <span className="text-emerald-400">STATUS: ACTIVE</span>
                  </div>
                  <p className="text-amber-300">
                    Score = (Importance * 0.25) + (Relevance * 0.25) + (Novelty * 0.15) + (Momentum * 0.15) + (Impact * 0.20)
                  </p>
                  <div className="pt-2 text-[11px] text-slate-400">
                    High Priority Threshold: <strong className="text-red-400">Score ≥ 80</strong> → Triggers automated SES email alert.
                  </div>
                </div>
              </div>
            )}

            {activeFeatureTab === 'decoupled' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <span className="text-xs font-extrabold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                    DECOUPLED REST PLATFORM
                  </span>
                  <h3 className="text-2xl font-bold text-white font-rounded">
                    Open Public API Endpoints for Any Application
                  </h3>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    The backend operates as a standalone serverless API. Third-party developers, Discord bots, or internal enterprise dashboards can consume normalized AWS news directly via <code className="text-amber-300 bg-slate-900 px-2 py-0.5 rounded">GET /api/v1/news</code>.
                  </p>
                  <a
                    href="https://mfolke7x65n2gdosj6i5777c3y0zcmxq.lambda-url.us-east-1.on.aws/api/v1/news"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 px-4 py-2 rounded-xl text-xs font-bold transition-all"
                  >
                    <span>Test Decoupled Endpoint URL</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>

                <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 font-mono text-xs text-slate-300 space-y-2">
                  <span className="text-blue-400 block">// GET /api/v1/news</span>
                  <pre className="text-slate-400 overflow-x-auto text-[11px]">
{`{
  "status": "success",
  "count": 156,
  "news": [
    {
      "title": "Amazon Bedrock streaming...",
      "source": "AWS What's New",
      "pubDate": "2026-08-28T05:43:58Z"
    }
  ]
}`}
                  </pre>
                </div>
              </div>
            )}

            {activeFeatureTab === 'companion' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <span className="text-xs font-extrabold text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">
                    VOICE SPEECH AUDIO SYNTHESIS
                  </span>
                  <h3 className="text-2xl font-bold text-white font-rounded">
                    Dori Reads Daily Briefings Out Loud
                  </h3>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    Equipped with Web Speech API audio synthesis, Dori reads out synthesized daily briefings, top signals of the day, and community pulse summaries directly in your browser.
                  </p>
                </div>

                <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-4">
                  <Volume2 className="w-12 h-12 text-blue-400 animate-bounce" />
                  <p className="text-xs text-slate-300 font-mono">
                    "Good day! Here is your AWS Signal Daily Briefing for today..."
                  </p>
                </div>
              </div>
            )}

            {activeFeatureTab === 'alerts' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <span className="text-xs font-extrabold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                    MULTI-RECIPIENT TEAM ALERTS
                  </span>
                  <h3 className="text-2xl font-bold text-white font-rounded">
                    Automated Amazon SES Email Alerts
                  </h3>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    Configure distribution lists (`devops@company.com, pawan@builder.aws`). When high priority updates occur (Score ≥ 80), formatted HTML alert digests are sent via Amazon SES.
                  </p>
                </div>

                <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 space-y-3 text-xs">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold border-b border-slate-800 pb-2">
                    <Bell className="w-4 h-4" />
                    <span>[AWS Signal Alert] High Priority Update</span>
                  </div>
                  <p className="text-slate-300">
                    Delivered to: <strong className="text-white">pawan@example.com, devops@company.com</strong>
                  </p>
                  <p className="text-slate-400">
                    "Amazon Bedrock introduces real-time streaming capabilities with enhanced latency guarantees."
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 text-center text-xs text-slate-500 relative z-10">
        AWS Pulse AI — Autonomous AWS Intelligence Platform • Powered by Amazon Bedrock, AWS Lambda, DynamoDB & AWS Builder ID
      </footer>
    </div>
  );
};
