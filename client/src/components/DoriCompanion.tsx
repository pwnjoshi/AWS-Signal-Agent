import React, { useState, useEffect, useRef } from 'react';
import { Volume2, Mic, Loader2, Sparkles, Zap, Heart } from 'lucide-react';
import { playDoriSpeech, stopDoriSpeech, askDoriQuestionApi } from '../services/apiClient';

export type DoriEmotion = 'happy' | 'curious' | 'thinking' | 'excited' | 'speaking';

interface DoriCompanionProps {
  size?: 'sm' | 'md' | 'lg' | 'hero';
  showSpeechBubble?: boolean;
  interactive?: boolean;
  emotion?: DoriEmotion;
  message?: string;
}

export const DoriCompanion: React.FC<DoriCompanionProps> = ({
  size = 'hero',
  showSpeechBubble = true,
  interactive = true,
  emotion: propEmotion,
  message: propMessage,
}) => {
  const [isBlinking, setIsBlinking] = useState(false);
  const [mouthOpen, setMouthOpen] = useState(false);
  
  // States: 'idle' | 'listening' | 'thinking' | 'speaking'
  const [conversationState, setConversationState] = useState<'idle' | 'listening' | 'thinking' | 'speaking'>('idle');
  const [displayedText, setDisplayedText] = useState<string>(propMessage || "Click me to talk with me!");

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

  // Crazy cute talking mouth animation while speaking
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

  // Instant Local Query Matcher (Sub-10ms response for greetings and checks)
  const checkInstantLocalMatch = (q: string): string | null => {
    const lower = q.toLowerCase().trim();
    if (lower.includes('hear me') || lower.includes('can you hear') || lower.includes('are you there') || lower === 'test') {
      return "Yay! I can hear you loud and clear! What awesome AWS service or release are we exploring today?";
    }
    if (lower.startsWith('hi') || lower.startsWith('hello') || lower.startsWith('hey') || lower.includes('good morning') || lower.includes('good evening')) {
      return "Hi builder! I'm Dori! I'm actively tracking all release feeds and developer friction. What's on your mind?";
    }
    if (lower.includes('who are you') || lower.includes('what are you') || lower.includes('what do you do')) {
      return "I'm Dori, your cute AI cloud intelligence companion! I score AWS releases with Amazon Bedrock and deliver personalized briefings!";
    }
    return null;
  };

  // Main voice query handler with blazing speed
  const processVoiceQuestion = async (question: string) => {
    if (!isSessionActiveRef.current) return;

    // Immediately mute mic during processing & speaking to eliminate self-feedback!
    killRecognition();
    stopDoriSpeech();

    // Instant local match (< 10ms!)
    const instantMatch = checkInstantLocalMatch(question);
    if (instantMatch) {
      setConversationState('speaking');
      streamWords(instantMatch);
      await playDoriSpeech(instantMatch, null, () => {
        if (isSessionActiveRef.current) {
          startListeningForSpeech();
        }
      });
      return;
    }

    setConversationState('thinking');
    setDisplayedText("Ooh, let me check that for you...");

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
      const fallback = "Aha! I'm tracking updates across Amazon Bedrock, AWS Lambda, and DynamoDB. What service would you like to explore?";
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
        setDisplayedText("Click me to talk with me!");
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
          setDisplayedText("Listening... (Speak your question)");
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
          setDisplayedText("I'm listening... Ask me anything about AWS!");
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
        setDisplayedText("Click me to talk with me!");
      }
    }
  };

  // Master Click Handler: Instant Start / 0ms Instant Interruption & End
  const handleToggleVoiceSession = () => {
    if (!interactive) return;

    if (isSessionActiveRef.current) {
      // User clicked to INSTANTLY INTERRUPT / TURN OFF
      isSessionActiveRef.current = false;
      if (typewriterTimerRef.current) clearInterval(typewriterTimerRef.current);
      if (mouthTimerRef.current) clearInterval(mouthTimerRef.current);
      killRecognition();
      stopDoriSpeech();
      setConversationState('idle');
      setDisplayedText("Click me to talk with me!");
    } else {
      // User clicked to START session
      isSessionActiveRef.current = true;
      conversationHistoryRef.current = [];
      setConversationState('listening');
      setDisplayedText("Listening... Speak your question now!");
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
      
      {/* ── Expressive Speech Bubble on Top of Dori's Head ── */}
      {showSpeechBubble && (
        <div 
          onClick={handleToggleVoiceSession}
          className={`mb-4 max-w-xs sm:max-w-md px-4 py-2.5 rounded-2xl border text-center shadow-xl relative z-10 transition-all duration-300 cursor-pointer active:scale-98 ${
            conversationState === 'speaking'
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-400 shadow-blue-500/30 ring-2 ring-blue-400/50' 
              : conversationState === 'listening'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-emerald-400 shadow-emerald-500/30 animate-pulse'
                : conversationState === 'thinking'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-indigo-400 shadow-indigo-500/30'
                  : 'bg-white dark:bg-[#18181b] text-slate-900 dark:text-zinc-100 border-slate-200 dark:border-zinc-700 hover:border-blue-400 hover:shadow-md'
          }`}
        >
          <div className="flex items-center justify-center gap-1.5 mb-1">
            {conversationState === 'speaking' ? (
              <span className="text-[11px] font-bold flex items-center gap-1 text-amber-200 animate-pulse">
                <Sparkles className="w-3.5 h-3.5" />
                Dori is Talking (Click to Stop)
              </span>
            ) : conversationState === 'listening' ? (
              <span className="text-[11px] font-bold flex items-center gap-1 text-emerald-100">
                <Mic className="w-3.5 h-3.5 animate-bounce text-amber-300" />
                Listening to you... (Click to End)
              </span>
            ) : conversationState === 'thinking' ? (
              <span className="text-[11px] font-bold flex items-center gap-1 text-purple-200">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-300" />
                Scanning AWS Intelligence Matrix...
              </span>
            ) : (
              <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                Click me to talk with me!
              </span>
            )}
          </div>
          
          <p className={`text-xs leading-relaxed font-medium min-h-[1.25rem] ${isActive ? 'text-white' : 'text-slate-700 dark:text-zinc-300'}`}>
            {displayedText}
          </p>

          {/* Speech Bubble Pointer Arrow */}
          <div className={`absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 border-b border-r ${
            conversationState === 'speaking'
              ? 'bg-indigo-600 border-indigo-500'
              : conversationState === 'listening'
                ? 'bg-teal-600 border-teal-500'
                : conversationState === 'thinking'
                  ? 'bg-purple-600 border-purple-500'
                  : 'bg-white dark:bg-[#18181b] border-slate-200 dark:border-zinc-700'
          }`} />
        </div>
      )}

      {/* ── Crazy Expressive Dori Animated Character ── */}
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

          {/* Main Robotic Cloud Body (Rich Blue Gradient) */}
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
            // Excited Starry Happy Anime Eyes
            <>
              <path d="M 41 43 Q 46 34 51 43" stroke="#1E293B" strokeWidth="3.5" strokeLinecap="round" fill="none" />
              <path d="M 69 43 Q 74 34 79 43" stroke="#1E293B" strokeWidth="3.5" strokeLinecap="round" fill="none" />
              {/* Star sparkles in eyes */}
              <circle cx="46" cy="38" r="1.5" fill="#F59E0B" />
              <circle cx="74" cy="38" r="1.5" fill="#F59E0B" />
            </>
          ) : conversationState === 'thinking' ? (
            // Curious Eyes Looking Up & Right
            <>
              <circle cx="48" cy="39" r="5" fill="#1E293B" />
              <circle cx="76" cy="39" r="5" fill="#1E293B" />
              <circle cx="50" cy="37" r="2" fill="#FFFFFF" />
              <circle cx="78" cy="37" r="2" fill="#FFFFFF" />
            </>
          ) : (
            // Big Curious Sparkling Baby Eyes
            <>
              <circle cx="46" cy="42" r="5.5" fill="#1E293B" />
              <circle cx="74" cy="42" r="5.5" fill="#1E293B" />
              <circle cx="48" cy="40" r="2.2" fill="#FFFFFF" />
              <circle cx="76" cy="40" r="2.2" fill="#FFFFFF" />
              <circle cx="44" cy="44" r="1" fill="#FFFFFF" opacity="0.8" />
              <circle cx="72" cy="44" r="1" fill="#FFFFFF" opacity="0.8" />
            </>
          )}

          {/* Rosy Glowing Cheeks (Anime Blush) */}
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
              // Sweet small talking curve
              <path d="M 55 53 Q 60 58 65 53" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            )
          ) : conversationState === 'thinking' ? (
            // Thoughtful small cute 'o' mouth
            <circle cx="60" cy="54" r="2.5" fill="#1E293B" />
          ) : (
            // Big sweet smile
            <path d="M 52 51 Q 60 60 68 51" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          )}

          {/* Cute Little Blue Feet */}
          <ellipse cx="44" cy="97" rx="10" ry="5.5" fill="#1D4ED8" />
          <ellipse cx="76" cy="97" rx="10" ry="5.5" fill="#1D4ED8" />
        </svg>
      </div>
    </div>
  );
};
export default DoriCompanion;
