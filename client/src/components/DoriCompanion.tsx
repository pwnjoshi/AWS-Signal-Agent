import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Volume2, Mic, Loader2, Zap } from 'lucide-react';
import { playDoriSpeech, stopDoriSpeech, askDoriQuestionApi, triggerAgentRun } from '../services/apiClient';
import { useTheme } from '../context/ThemeContext';

export type DoriEmotion = 'happy' | 'curious' | 'thinking' | 'excited' | 'speaking';

interface DoriCompanionProps {
  size?: 'sm' | 'md' | 'lg' | 'hero';
  showSpeechBubble?: boolean;
  interactive?: boolean;
  emotion?: DoriEmotion;
  message?: string;
  onExecuteAction?: (actionName: string) => void;
}

export const DoriCompanion: React.FC<DoriCompanionProps> = ({
  size = 'hero',
  showSpeechBubble = true,
  interactive = true,
  emotion: propEmotion,
  message: propMessage,
  onExecuteAction,
}) => {
  const navigate = useNavigate();
  const { toggleTheme } = useTheme();

  const [isBlinking, setIsBlinking] = useState(false);
  const [mouthOpen, setMouthOpen] = useState(false);
  
  // States: 'idle' | 'listening' | 'thinking' | 'speaking'
  const [conversationState, setConversationState] = useState<'idle' | 'listening' | 'thinking' | 'speaking'>('idle');
  const [displayedText, setDisplayedText] = useState<string>(propMessage || "Click to start hands-free voice intelligence");

  // Session flags and references
  const isSessionActiveRef = useRef(false);
  const recognitionRef = useRef<any>(null);
  const typewriterTimerRef = useRef<any>(null);
  const mouthTimerRef = useRef<any>(null);
  const conversationHistoryRef = useRef<Array<{ role: 'user' | 'assistant'; content: string }>>([]);

  // Natural blinking eyes animation every 3.2 seconds
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 180);
    }, 3200);

    return () => clearInterval(blinkInterval);
  }, []);

  // Cute talking mouth animation while speaking
  useEffect(() => {
    if (conversationState === 'speaking') {
      mouthTimerRef.current = setInterval(() => {
        setMouthOpen(prev => !prev);
      }, 160);
    } else {
      setMouthOpen(false);
      if (mouthTimerRef.current) clearInterval(mouthTimerRef.current);
    }
    return () => {
      if (mouthTimerRef.current) clearInterval(mouthTimerRef.current);
    };
  }, [conversationState]);

  // Clean unmount
  useEffect(() => {
    return () => {
      isSessionActiveRef.current = false;
      if (typewriterTimerRef.current) clearInterval(typewriterTimerRef.current);
      if (mouthTimerRef.current) clearInterval(mouthTimerRef.current);
      stopDoriSpeech();
      killRecognition();
    };
  }, []);

  // Safely stop microphone
  const killRecognition = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.onresult = null;
        recognitionRef.current.onend = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.abort();
      } catch {}
      recognitionRef.current = null;
    }
  };

  // Fast Word-by-Word Streaming Reveal (~65ms per word)
  const streamWords = (fullText: string) => {
    if (typewriterTimerRef.current) clearInterval(typewriterTimerRef.current);
    const words = fullText.split(' ');
    let currentIndex = 0;
    setDisplayedText('');

    typewriterTimerRef.current = setInterval(() => {
      currentIndex++;
      if (currentIndex <= words.length) {
        setDisplayedText(words.slice(0, currentIndex).join(' '));
      } else {
        clearInterval(typewriterTimerRef.current);
      }
    }, 65);
  };

  // ── Autonomous Voice Agent Tool Executor ──
  const handleAutonomousVoiceActions = async (input: string): Promise<string | null> => {
    const q = input.toLowerCase().trim();

    // 1. Autonomous Feed Ingestion & Scan
    if (q.includes('scan feed') || q.includes('run agent') || q.includes('fetch new data') || q.includes('fetch data') || q.includes('run pipeline') || q.includes('refresh data')) {
      try {
        triggerAgentRun().catch(() => {});
        if (onExecuteAction) onExecuteAction('run_agent');
        return "Autonomous agent pipeline triggered! I am currently scanning all 6 RSS feeds, developer forums, and Bedrock rankings!";
      } catch {
        return "Triggered the autonomous ingestion run for you!";
      }
    }

    // 2. Autonomous Search Navigation
    if (q.startsWith('search for') || q.startsWith('search') || q.startsWith('find signals about') || q.startsWith('find signals on')) {
      const queryTerm = q.replace(/^(search for|search|find signals about|find signals on)\s*/i, '').trim();
      if (queryTerm) {
        navigate(`/signals?search=${encodeURIComponent(queryTerm)}`);
        return `Searching live Radar signals for ${queryTerm}!`;
      }
    }

    // 3. Autonomous Navigation Actions
    if (q.includes('open hub') || q.includes('go to hub') || q.includes('open dashboard') || q.includes('go to dashboard')) {
      navigate('/dashboard');
      return "Navigating to Command Hub dashboard!";
    }

    if (q.includes('show radar') || q.includes('open radar') || q.includes('open signals') || q.includes('view signals')) {
      navigate('/signals');
      return "Opening live Radar Intelligence stream!";
    }

    if (q.includes('open vault') || q.includes('show my bookmarks') || q.includes('show bookmarks') || q.includes('saved signals') || q.includes('view vault')) {
      navigate('/saved');
      return "Opening your personal Bookmarks Vault!";
    }

    if (q.includes('show trends') || q.includes('open trends') || q.includes('friction matrix') || q.includes('community discussions')) {
      navigate('/trending');
      return "Opening the Friction Matrix!";
    }

    if (q.includes('show briefings') || q.includes('daily digest') || q.includes('open briefings') || q.includes('executive summary')) {
      navigate('/briefings');
      return "Opening today's Executive Daily Digest!";
    }

    if (q.includes('show services') || q.includes('cloud mesh') || q.includes('open services')) {
      navigate('/services');
      return "Opening the Cloud Mesh services breakdown!";
    }

    if (q.includes('toggle theme') || q.includes('dark mode') || q.includes('light mode') || q.includes('switch theme')) {
      toggleTheme();
      return "Switched theme for you!";
    }

    // 4. Exact Single-Word Greetings only (does NOT intercept full questions)
    if (q === 'hi' || q === 'hello' || q === 'hey' || q === 'good morning' || q === 'good evening') {
      return "Hi builder! I'm Dori, your autonomous AWS cloud copilot! What would you like to explore or do?";
    }

    if (q === 'can you hear me' || q === 'hear me' || q === 'are you there' || q === 'test') {
      return "Yay! I can hear you loud and clear! What AWS release or command should we run?";
    }

    if (q === 'who are you' || q === 'what can you do') {
      return "I'm Dori, an autonomous AI cloud agent! I monitor AWS release feeds, execute live searches, trigger scans, and deliver personalized briefings!";
    }

    return null;
  };

  // Main voice query handler with autonomous actions + Bedrock QA
  const processVoiceQuestion = async (question: string) => {
    if (!isSessionActiveRef.current) return;

    // 1. Immediately mute mic during processing & speaking
    killRecognition();
    stopDoriSpeech();

    // 2. Check for Autonomous Voice Platform Action
    const autonomousActionReply = await handleAutonomousVoiceActions(question);
    if (autonomousActionReply) {
      setConversationState('speaking');
      streamWords(autonomousActionReply);
      await playDoriSpeech(autonomousActionReply, null, () => {
        if (isSessionActiveRef.current) {
          startListeningForSpeech();
        }
      });
      return;
    }

    setConversationState('thinking');
    setDisplayedText("Analyzing AWS intelligence matrix...");

    try {
      const currentHistory = [...conversationHistoryRef.current];
      
      const res = await askDoriQuestionApi(question, currentHistory);
      if (!isSessionActiveRef.current) return;

      // Update multi-turn context
      conversationHistoryRef.current = [
        ...currentHistory,
        { role: 'user' as const, content: question },
        { role: 'assistant' as const, content: res.answer },
      ].slice(-8);

      setConversationState('speaking');
      streamWords(res.answer);

      // Play cute Ivy neural voice
      await playDoriSpeech(res.answer, res.audioBase64, () => {
        if (isSessionActiveRef.current) {
          startListeningForSpeech();
        }
      });
    } catch (err) {
      if (!isSessionActiveRef.current) return;
      const fallback = "I'm tracking updates across Amazon Bedrock, AWS Lambda, and DynamoDB. What service would you like to explore?";
      setConversationState('speaking');
      setDisplayedText(fallback);
      await playDoriSpeech(fallback, null, () => {
        if (isSessionActiveRef.current) {
          startListeningForSpeech();
        }
      });
    }
  };

  // Turn-taking Microphone Listener (Active ONLY when Dori is NOT speaking)
  const startListeningForSpeech = () => {
    if (!isSessionActiveRef.current) return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      const defaultBriefing = "Good day builder! Amazon Bedrock and AWS Lambda are active. What would you like to build today?";
      setConversationState('speaking');
      setDisplayedText(defaultBriefing);
      playDoriSpeech(defaultBriefing, null, () => {
        setConversationState('idle');
        isSessionActiveRef.current = false;
        setDisplayedText("Click to start hands-free voice intelligence");
      });
      return;
    }

    try {
      killRecognition();

      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        if (isSessionActiveRef.current) {
          setConversationState('listening');
          setDisplayedText("Listening... (Speak a question or command)");
        }
      };

      recognition.onresult = (event: any) => {
        if (!isSessionActiveRef.current) return;
        const transcript = event.results[0][0].transcript;
        if (transcript && transcript.trim().length > 0) {
          processVoiceQuestion(transcript);
        }
      };

      recognition.onerror = (event: any) => {
        if (isSessionActiveRef.current && event.error === 'no-speech') {
          setDisplayedText("I'm listening... Ask me an AWS question or command!");
          setTimeout(() => {
            if (isSessionActiveRef.current && conversationState === 'listening') {
              startListeningForSpeech();
            }
          }, 600);
        }
      };

      recognition.onend = () => {
        if (isSessionActiveRef.current && conversationState === 'listening') {
          setTimeout(() => {
            if (isSessionActiveRef.current && conversationState === 'listening') {
              try { recognition.start(); } catch {}
            }
          }, 200);
        }
      };

      recognition.start();
    } catch (err) {
      console.warn('Speech recognition notice:', err);
      if (isSessionActiveRef.current) {
        setConversationState('idle');
        isSessionActiveRef.current = false;
        setDisplayedText("Click to start hands-free voice intelligence");
      }
    }
  };

  // Master Click Handler: Instant Start / 0ms Instant Interruption & End
  const handleToggleVoiceSession = () => {
    if (!interactive) return;

    if (isSessionActiveRef.current) {
      // User clicked to TURN OFF session
      isSessionActiveRef.current = false;
      if (typewriterTimerRef.current) clearInterval(typewriterTimerRef.current);
      if (mouthTimerRef.current) clearInterval(mouthTimerRef.current);
      killRecognition();
      stopDoriSpeech();
      setConversationState('idle');
      setDisplayedText("Click to start hands-free voice intelligence");
    } else {
      // User clicked to START session
      isSessionActiveRef.current = true;
      conversationHistoryRef.current = [];
      setConversationState('listening');
      setDisplayedText("Listening... Speak your question or command!");
      startListeningForSpeech();
    }
  };

  const getDimensions = () => {
    switch (size) {
      case 'sm': return { width: 70, height: 70 };
      case 'lg': return { width: 140, height: 140 };
      case 'hero': return { width: 160, height: 160 };
      default: return { width: 105, height: 105 };
    }
  };

  const { width, height } = getDimensions();
  const isActive = conversationState !== 'idle';

  return (
    <div className="relative inline-flex flex-col items-center select-none group font-sans">
      
      {/* ── Expressive Clean Speech Bubble (No duplicate text, No star icon) ── */}
      {showSpeechBubble && (
        <div 
          onClick={handleToggleVoiceSession}
          className={`mb-4 max-w-xs sm:max-w-md px-4 py-2.5 rounded-2xl border text-center shadow-xl relative z-10 transition-all duration-300 cursor-pointer active:scale-98 ${
            conversationState === 'speaking'
              ? 'bg-blue-600 text-white border-blue-400 shadow-blue-500/30' 
              : conversationState === 'listening'
                ? 'bg-emerald-600 text-white border-emerald-400 shadow-emerald-500/30 animate-pulse'
                : conversationState === 'thinking'
                  ? 'bg-indigo-600 text-white border-indigo-400 shadow-indigo-500/30'
                  : 'bg-white dark:bg-[#18181b] text-slate-900 dark:text-zinc-100 border-slate-200 dark:border-zinc-700 hover:border-blue-400 hover:shadow-md'
          }`}
        >
          <div className="flex items-center justify-center gap-1.5 mb-1">
            {conversationState === 'speaking' ? (
              <span className="text-[11px] font-bold flex items-center gap-1 text-white">
                <Volume2 className="w-3.5 h-3.5 animate-pulse" />
                Dori is Talking (Click to Stop)
              </span>
            ) : conversationState === 'listening' ? (
              <span className="text-[11px] font-bold flex items-center gap-1 text-white">
                <Mic className="w-3.5 h-3.5 animate-bounce text-amber-300" />
                Listening to you... (Click to End)
              </span>
            ) : conversationState === 'thinking' ? (
              <span className="text-[11px] font-bold flex items-center gap-1 text-white">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-300" />
                Processing Cloud Intelligence...
              </span>
            ) : (
              <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                <Mic className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                Talk with Dori
              </span>
            )}
          </div>
          
          <p className={`text-xs leading-relaxed font-medium min-h-[1.25rem] ${isActive ? 'text-white' : 'text-slate-700 dark:text-zinc-300'}`}>
            {displayedText}
          </p>

          {/* Speech Bubble Pointer Arrow */}
          <div className={`absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 border-b border-r ${
            conversationState === 'speaking'
              ? 'bg-blue-600 border-blue-400'
              : conversationState === 'listening'
                ? 'bg-emerald-600 border-emerald-400'
                : conversationState === 'thinking'
                  ? 'bg-indigo-600 border-indigo-400'
                  : 'bg-white dark:bg-[#18181b] border-slate-200 dark:border-zinc-700'
          }`} />
        </div>
      )}

      {/* ── Expressive Dori Animated Character ── */}
      <div 
        onClick={handleToggleVoiceSession} 
        className={`relative cursor-pointer transition-all duration-300 ${
          interactive ? 'hover:scale-110 active:scale-95' : ''
        } ${
          conversationState === 'speaking' 
            ? 'animate-[bounce_1s_infinite]' 
            : conversationState === 'listening' 
              ? 'scale-105 rotate-1' 
              : conversationState === 'thinking' 
                ? 'animate-pulse -rotate-1' 
                : 'hover:-translate-y-1'
        }`}
        title={isActive ? "Click to stop conversation" : "Click to talk with Dori"}
      >
        {/* Animated Glow Aura */}
        {isActive && (
          <div className={`absolute -inset-6 rounded-full blur-2xl animate-pulse transition-all ${
            conversationState === 'speaking' 
              ? 'bg-blue-500/40 scale-110' 
              : conversationState === 'listening' 
                ? 'bg-emerald-500/40 scale-105' 
                : 'bg-purple-500/40'
          }`} />
        )}

        <svg
          width={width}
          height={height}
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-xl relative z-10"
        >
          {/* Radiating Sound / Thought Radar Waves */}
          {conversationState === 'speaking' && (
            <>
              <circle cx="60" cy="8" r="8" stroke="#60A5FA" strokeWidth="1.5" opacity="0.8" className="animate-ping" />
              <circle cx="60" cy="8" r="14" stroke="#38BDF8" strokeWidth="1" opacity="0.4" className="animate-pulse" />
            </>
          )}

          {conversationState === 'listening' && (
            <circle cx="60" cy="8" r="10" stroke="#34D399" strokeWidth="2" opacity="0.9" className="animate-ping" />
          )}

          {/* Antenna / Sensor with Status Glow */}
          <line x1="60" y1="18" x2="60" y2="7" stroke="#2563EB" strokeWidth="4" strokeLinecap="round" />
          <circle 
            cx="60" 
            cy="6" 
            r="5.5" 
            fill={conversationState === 'listening' ? '#10B981' : conversationState === 'speaking' ? '#F59E0B' : conversationState === 'thinking' ? '#A855F7' : '#3B82F6'} 
          />
          <circle cx="62" cy="5" r="1.5" fill="#FFFFFF" />

          {/* Main Robotic Cloud Body */}
          <rect x="20" y="18" width="80" height="78" rx="39" fill="#2563EB" />
          
          {/* Outer Cloud Ears / Shoulders */}
          <circle cx="16" cy="50" r="13" fill="#3B82F6" />
          <circle cx="104" cy="50" r="13" fill="#3B82F6" />
          <circle cx="16" cy="50" r="7" fill="#60A5FA" opacity="0.6" />
          <circle cx="104" cy="50" r="7" fill="#60A5FA" opacity="0.6" />

          {/* White Face Container */}
          <rect x="27" y="25" width="66" height="48" rx="24" fill="#FFFFFF" />

          {/* White Belly Area */}
          <path d="M 35 72 Q 60 62 85 72 Q 90 92 60 94 Q 30 92 35 72 Z" fill="#F8FAFC" />

          {/* Red Ribbon/Collar Accent & Gold Bell */}
          <rect x="35" y="68" width="50" height="6" rx="3" fill="#EF4444" />
          <circle cx="60" cy="71" r="5.5" fill="#F59E0B" stroke="#FFFFFF" strokeWidth="1.5" />
          <circle cx="60" cy="73" r="1.5" fill="#B45309" />

          {/* Utility Cloud Pouch */}
          <path d="M 48 80 Q 60 76 72 80 Q 72 88 60 89 Q 48 88 48 80 Z" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="1.5" />

          {/* ── Expressive Eyes ── */}
          {isBlinking ? (
            // Cute Closed Wink / Blink Slits
            <>
              <line x1="41" y1="42" x2="51" y2="42" stroke="#1E293B" strokeWidth="3.5" strokeLinecap="round" />
              <line x1="69" y1="42" x2="79" y2="42" stroke="#1E293B" strokeWidth="3.5" strokeLinecap="round" />
            </>
          ) : conversationState === 'speaking' ? (
            // Excited Happy Anime Eyes
            <>
              <path d="M 41 43 Q 46 34 51 43" stroke="#1E293B" strokeWidth="3.5" strokeLinecap="round" fill="none" />
              <path d="M 69 43 Q 74 34 79 43" stroke="#1E293B" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            </>
          ) : conversationState === 'thinking' ? (
            // Curious Eyes Looking Up
            <>
              <circle cx="48" cy="39" r="5" fill="#1E293B" />
              <circle cx="76" cy="39" r="5" fill="#1E293B" />
              <circle cx="50" cy="37" r="2" fill="#FFFFFF" />
              <circle cx="78" cy="37" r="2" fill="#FFFFFF" />
            </>
          ) : (
            // Big Curious Sparkling Eyes
            <>
              <circle cx="46" cy="42" r="5.5" fill="#1E293B" />
              <circle cx="74" cy="42" r="5.5" fill="#1E293B" />
              <circle cx="48" cy="40" r="2.2" fill="#FFFFFF" />
              <circle cx="76" cy="40" r="2.2" fill="#FFFFFF" />
              <circle cx="44" cy="44" r="1" fill="#FFFFFF" opacity="0.8" />
              <circle cx="72" cy="44" r="1" fill="#FFFFFF" opacity="0.8" />
            </>
          )}

          {/* Rosy Glowing Cheeks */}
          <ellipse cx="37" cy="49" rx="4.5" ry="2.5" fill="#F472B6" opacity="0.85" />
          <ellipse cx="83" cy="49" rx="4.5" ry="2.5" fill="#F472B6" opacity="0.85" />

          {/* ── Expressive Animated Mouth ── */}
          {conversationState === 'speaking' ? (
            mouthOpen ? (
              // Open animated talking mouth with cute pink tongue
              <g>
                <path d="M 53 51 Q 60 62 67 51 Z" fill="#1E293B" />
                <ellipse cx="60" cy="56" rx="3.5" ry="2.2" fill="#FB7185" />
              </g>
            ) : (
              // Talking curve
              <path d="M 55 53 Q 60 58 65 53" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            )
          ) : conversationState === 'thinking' ? (
            // Thoughtful small cute 'o' mouth
            <circle cx="60" cy="54" r="2.5" fill="#1E293B" />
          ) : (
            // Big sweet smile
            <path d="M 52 51 Q 60 60 68 51" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          )}

          {/* Cute Blue Feet */}
          <ellipse cx="44" cy="97" rx="10" ry="5.5" fill="#1D4ED8" />
          <ellipse cx="76" cy="97" rx="10" ry="5.5" fill="#1D4ED8" />
        </svg>
      </div>
    </div>
  );
};
export default DoriCompanion;
