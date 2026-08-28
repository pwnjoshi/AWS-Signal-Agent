import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Volume2, Mic, MicOff, Sparkles, Loader2 } from 'lucide-react';
import { playDoriSpeech, stopDoriSpeech, askDoriQuestionApi } from '../services/apiClient';

export type DoriEmotion = 'happy' | 'curious' | 'thinking' | 'alert' | 'excited' | 'sleeping' | 'working';

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
  const [emotion, setEmotion] = useState<DoriEmotion>(propEmotion || 'happy');
  
  // Continuous conversation loop states: 'idle' | 'listening' | 'thinking' | 'speaking'
  const [conversationState, setConversationState] = useState<'idle' | 'listening' | 'thinking' | 'speaking'>('idle');
  const [bubbleMessage, setBubbleMessage] = useState<string>(propMessage || "Click me to talk with me!");
  const [transcriptDisplay, setTranscriptDisplay] = useState<string>('');

  const isSessionActiveRef = useRef(false);
  const recognitionRef = useRef<any>(null);

  // Natural blinking eyes animation every 3.5 seconds
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 200);
    }, 3500);

    return () => clearInterval(blinkInterval);
  }, []);

  // Update visual emotion based on conversational state
  useEffect(() => {
    if (conversationState === 'speaking') {
      setEmotion('excited');
    } else if (conversationState === 'listening') {
      setEmotion('curious');
    } else if (conversationState === 'thinking') {
      setEmotion('thinking');
    } else {
      setEmotion('happy');
    }
  }, [conversationState]);

  // Main voice query processor (Bedrock + Polly)
  const processVoiceQuestion = useCallback(async (question: string) => {
    if (!isSessionActiveRef.current) return;

    setConversationState('thinking');
    setBubbleMessage(`Thinking about "${question.slice(0, 45)}${question.length > 45 ? '...' : ''}"...`);
    setTranscriptDisplay(question);

    try {
      const res = await askDoriQuestionApi(question);
      if (!isSessionActiveRef.current) return;

      setConversationState('speaking');
      setBubbleMessage(res.answer);

      // Play human-like conversational voice using Amazon Polly
      await playDoriSpeech(res.answer, () => {
        // Callback when Dori finishes speaking
        if (isSessionActiveRef.current) {
          // Continuous Loop: Automatically turn microphone back on for next question!
          startListeningForSpeech();
        }
      });
    } catch (err) {
      if (!isSessionActiveRef.current) return;
      const fallback = "I've checked our live feeds across Amazon Bedrock, AWS Lambda, and DynamoDB. What specific AWS service would you like to explore?";
      setConversationState('speaking');
      setBubbleMessage(fallback);
      await playDoriSpeech(fallback, () => {
        if (isSessionActiveRef.current) {
          startListeningForSpeech();
        }
      });
    }
  }, []);

  // Start microphone listener
  const startListeningForSpeech = useCallback(() => {
    if (!isSessionActiveRef.current) return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      // Fallback: If Web Speech Recognition API is unavailable
      const defaultBriefing = "Good day builder! Amazon Bedrock cross-region inferencing and Lambda SnapStart are active. What would you like to build today?";
      setConversationState('speaking');
      setBubbleMessage(defaultBriefing);
      playDoriSpeech(defaultBriefing, () => {
        setConversationState('idle');
        isSessionActiveRef.current = false;
        setBubbleMessage("Click me to talk with me!");
      });
      return;
    }

    try {
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch {}
      }

      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        if (isSessionActiveRef.current) {
          setConversationState('listening');
          setBubbleMessage("Listening... Speak your AWS question now!");
        }
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript && isSessionActiveRef.current) {
          processVoiceQuestion(transcript);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition notice:', event.error);
        if (isSessionActiveRef.current && event.error === 'no-speech') {
          // If silent, prompt gently or re-listen
          setBubbleMessage("I'm still listening... Ask me anything about AWS!");
          setTimeout(() => {
            if (isSessionActiveRef.current && conversationState === 'listening') {
              startListeningForSpeech();
            }
          }, 1000);
        }
      };

      recognition.onend = () => {
        if (isSessionActiveRef.current && conversationState === 'listening') {
          // If speech recognition ended without result, restart listener
          setTimeout(() => {
            if (isSessionActiveRef.current && conversationState === 'listening') {
              try { recognition.start(); } catch {}
            }
          }, 300);
        }
      };

      recognition.start();
    } catch (err) {
      console.warn('Failed to start speech recognition:', err);
      if (isSessionActiveRef.current) {
        setConversationState('idle');
        isSessionActiveRef.current = false;
        setBubbleMessage("Click me to talk with me!");
      }
    }
  }, [processVoiceQuestion, conversationState]);

  // Master click handler: Toggle voice session on / off
  const handleToggleVoiceSession = () => {
    if (!interactive) return;

    if (isSessionActiveRef.current) {
      // User clicked to TURN OFF session
      isSessionActiveRef.current = false;
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch {}
      }
      stopDoriSpeech();
      setConversationState('idle');
      setBubbleMessage("Click me to talk with me!");
      setTranscriptDisplay('');
    } else {
      // User clicked to TURN ON session
      isSessionActiveRef.current = true;
      setConversationState('listening');
      setBubbleMessage("Listening... Speak your question now!");
      startListeningForSpeech();
    }
  };

  const getDimensions = () => {
    switch (size) {
      case 'sm': return { width: 64, height: 64 };
      case 'lg': return { width: 130, height: 130 };
      case 'hero': return { width: 150, height: 150 };
      default: return { width: 96, height: 96 };
    }
  };

  const { width, height } = getDimensions();
  const isActive = conversationState !== 'idle';

  return (
    <div className="relative inline-flex flex-col items-center select-none group font-sans">
      
      {/* Speech Bubble on Top of Dori's Head */}
      {showSpeechBubble && (
        <div 
          onClick={handleToggleVoiceSession}
          className={`mb-4 max-w-xs sm:max-w-md px-4 py-2.5 rounded-xl border text-center shadow-lg relative z-10 transition-all duration-300 cursor-pointer active:scale-98 ${
            conversationState === 'speaking'
              ? 'bg-blue-600 text-white border-blue-500 shadow-blue-500/25' 
              : conversationState === 'listening'
                ? 'bg-emerald-600 text-white border-emerald-500 shadow-emerald-500/25'
                : conversationState === 'thinking'
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-indigo-500/25 animate-pulse'
                  : 'bg-white dark:bg-[#18181b] text-slate-900 dark:text-zinc-100 border-slate-200 dark:border-zinc-700 hover:border-blue-400'
          }`}
        >
          <div className="flex items-center justify-center gap-1.5 mb-0.5">
            {conversationState === 'speaking' ? (
              <span className="text-[11px] font-semibold flex items-center gap-1 text-white">
                <Volume2 className="w-3.5 h-3.5 animate-pulse" />
                Dori is Speaking (Click to End)
              </span>
            ) : conversationState === 'listening' ? (
              <span className="text-[11px] font-semibold flex items-center gap-1 text-white">
                <Mic className="w-3.5 h-3.5 animate-pulse text-amber-300" />
                Listening to your Voice... (Click to End)
              </span>
            ) : conversationState === 'thinking' ? (
              <span className="text-[11px] font-semibold flex items-center gap-1 text-white">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-300" />
                Analyzing Cloud Intelligence...
              </span>
            ) : (
              <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                <Mic className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                Click me to talk with me
              </span>
            )}
          </div>
          
          <p className={`text-xs leading-relaxed font-normal ${isActive ? 'text-white' : 'text-slate-600 dark:text-zinc-400'}`}>
            {bubbleMessage}
          </p>

          {/* Speech Bubble Pointer Arrow */}
          <div className={`absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 border-b border-r ${
            conversationState === 'speaking'
              ? 'bg-blue-600 border-blue-500'
              : conversationState === 'listening'
                ? 'bg-emerald-600 border-emerald-500'
                : conversationState === 'thinking'
                  ? 'bg-indigo-600 border-indigo-500'
                  : 'bg-white dark:bg-[#18181b] border-slate-200 dark:border-zinc-700'
          }`} />
        </div>
      )}

      {/* Dori Animated Character */}
      <div 
        onClick={handleToggleVoiceSession} 
        className={`relative cursor-pointer transition-all duration-300 ${
          interactive ? 'hover:scale-105 active:scale-95' : ''
        } ${conversationState === 'speaking' ? 'animate-bounce' : conversationState === 'listening' ? 'scale-105' : ''}`}
        title={isActive ? "Click to stop conversation" : "Click to start continuous AI voice conversation"}
      >
        {/* Animated Sound Wave Aura when Speaking or Listening */}
        {isActive && (
          <div className={`absolute -inset-4 rounded-full blur-xl animate-pulse ${
            conversationState === 'speaking' 
              ? 'bg-blue-500/30' 
              : conversationState === 'listening' 
                ? 'bg-emerald-500/30' 
                : 'bg-indigo-500/30'
          }`} />
        )}

        <svg
          width={width}
          height={height}
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-md relative z-10"
        >
          {/* Antenna / Sensor with Status Pulse */}
          <line x1="60" y1="18" x2="60" y2="8" stroke="#2563EB" strokeWidth="4" strokeLinecap="round" />
          <circle 
            cx="60" 
            cy="7" 
            r="5" 
            fill={conversationState === 'listening' ? '#10B981' : conversationState === 'speaking' ? '#00D294' : conversationState === 'thinking' ? '#818CF8' : '#3B82F6'} 
          />

          {/* Main Robotic Cloud Body */}
          <rect x="20" y="18" width="80" height="78" rx="39" fill="#2563EB" />
          
          {/* Outer Cloud Ears/Shoulders */}
          <circle cx="16" cy="50" r="12" fill="#3B82F6" />
          <circle cx="104" cy="50" r="12" fill="#3B82F6" />

          {/* White Face Container */}
          <rect x="28" y="26" width="64" height="46" rx="23" fill="#FFFFFF" />

          {/* White Belly Area */}
          <path d="M 35 72 Q 60 62 85 72 Q 90 92 60 94 Q 30 92 35 72 Z" fill="#F8FAFC" />

          {/* Red Ribbon/Collar Accent */}
          <rect x="36" y="68" width="48" height="6" rx="3" fill="#EF4444" />
          <circle cx="60" cy="71" r="5" fill="#F59E0B" stroke="#FFFFFF" strokeWidth="1.5" />

          {/* Utility Cloud Pouch */}
          <path d="M 48 80 Q 60 76 72 80 Q 72 88 60 89 Q 48 88 48 80 Z" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="1.5" />

          {/* Eyes with Blinking State */}
          {isBlinking ? (
            // Blinking Slit Eyes
            <>
              <line x1="41" y1="42" x2="51" y2="42" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />
              <line x1="69" y1="42" x2="79" y2="42" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />
            </>
          ) : emotion === 'excited' || conversationState === 'speaking' ? (
            // Excited Happy Curve Eyes
            <>
              <path d="M 41 43 Q 46 36 51 43" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" fill="none" />
              <path d="M 69 43 Q 74 36 79 43" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" fill="none" />
            </>
          ) : (
            // Open Curious Round Eyes
            <>
              <circle cx="46" cy="42" r="5" fill="#1E293B" />
              <circle cx="74" cy="42" r="5" fill="#1E293B" />
              <circle cx="48" cy="40" r="1.8" fill="#FFFFFF" />
              <circle cx="76" cy="40" r="1.8" fill="#FFFFFF" />
            </>
          )}

          {/* Cute Rosy Cheek Blush */}
          <ellipse cx="38" cy="49" rx="4" ry="2" fill="#F472B6" opacity="0.65" />
          <ellipse cx="82" cy="49" rx="4" ry="2" fill="#F472B6" opacity="0.65" />

          {/* Mouth Expression */}
          {conversationState === 'speaking' ? (
            // Talking animated open mouth
            <ellipse cx="60" cy="55" rx="5" ry="4" fill="#1E293B" />
          ) : (
            // Sweet smile
            <path d="M 53 52 Q 60 60 67 52" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          )}

          {/* Feet */}
          <ellipse cx="44" cy="97" rx="10" ry="5" fill="#1D4ED8" />
          <ellipse cx="76" cy="97" rx="10" ry="5" fill="#1D4ED8" />
        </svg>
      </div>
    </div>
  );
};
export default DoriCompanion;
