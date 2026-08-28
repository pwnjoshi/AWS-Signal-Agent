import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Mic, MicOff } from 'lucide-react';

export type DoriEmotion = 'happy' | 'curious' | 'thinking' | 'alert' | 'excited' | 'sleeping' | 'working';

interface DoriCompanionProps {
  emotion?: DoriEmotion;
  message?: string;
  size?: 'sm' | 'md' | 'lg' | 'hero';
  showSpeechBubble?: boolean;
  interactive?: boolean;
  isSpeaking?: boolean;
  isListening?: boolean;
  onToggleSpeech?: () => void;
  onTranscribedQuestion?: (question: string) => void;
}

export const DoriCompanion: React.FC<DoriCompanionProps> = ({
  emotion = 'happy',
  message = "Click me to talk with me!",
  size = 'md',
  showSpeechBubble = true,
  interactive = true,
  isSpeaking = false,
  isListening = false,
  onToggleSpeech,
  onTranscribedQuestion,
}) => {
  const [isBlinking, setIsBlinking] = useState(false);
  const [localEmotion, setLocalEmotion] = useState<DoriEmotion>(emotion);
  const [localListening, setLocalListening] = useState(false);
  const [micError, setMicError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  // Natural blinking eyes animation every 3.5 seconds
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 200);
    }, 3500);

    return () => clearInterval(blinkInterval);
  }, []);

  useEffect(() => {
    if (isSpeaking) {
      setLocalEmotion('excited');
    } else if (localListening || isListening) {
      setLocalEmotion('curious');
    } else {
      setLocalEmotion(emotion);
    }
  }, [isSpeaking, localListening, isListening, emotion]);

  const startVoiceConversation = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      // Fallback: If browser does not support Web Speech Recognition, trigger direct briefing
      if (onToggleSpeech) onToggleSpeech();
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setLocalListening(true);
        setMicError(null);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setLocalListening(false);
        if (onTranscribedQuestion && transcript) {
          onTranscribedQuestion(transcript);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition notice:', event.error);
        setLocalListening(false);
        // If mic denied or errored, fallback to audio briefing narration
        if (onToggleSpeech) {
          onToggleSpeech();
        }
      };

      recognition.onend = () => {
        setLocalListening(false);
      };

      recognition.start();
    } catch (err) {
      console.warn('Failed to start speech recognition:', err);
      setLocalListening(false);
      if (onToggleSpeech) onToggleSpeech();
    }
  };

  const handleClick = () => {
    if (!interactive) return;

    if (isSpeaking) {
      if (onToggleSpeech) onToggleSpeech();
      return;
    }

    if (localListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setLocalListening(false);
      return;
    }

    // Start voice conversation flow
    startVoiceConversation();
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

  const isCurrentlyActive = isSpeaking || localListening || isListening;

  return (
    <div className="relative inline-flex flex-col items-center select-none group font-sans">
      
      {/* Speech Bubble on Top of Dori's Head (No Star Icon) */}
      {showSpeechBubble && (
        <div 
          onClick={handleClick}
          className={`mb-3.5 max-w-xs sm:max-w-md px-4 py-2.5 rounded-xl border text-center shadow-md relative z-10 transition-all duration-200 cursor-pointer active:scale-98 ${
            isSpeaking 
              ? 'bg-blue-600 text-white border-blue-500 shadow-blue-500/20' 
              : localListening
                ? 'bg-emerald-600 text-white border-emerald-500 shadow-emerald-500/20 animate-pulse'
                : 'bg-white dark:bg-[#18181b] text-slate-900 dark:text-zinc-100 border-slate-200 dark:border-zinc-700 hover:border-blue-400'
          }`}
        >
          <div className="flex items-center justify-center gap-1.5 mb-0.5">
            {isSpeaking ? (
              <span className="text-[11px] font-semibold flex items-center gap-1 text-white">
                <Volume2 className="w-3.5 h-3.5 animate-pulse" />
                Dori is Speaking (Click to Mute)
              </span>
            ) : localListening ? (
              <span className="text-[11px] font-semibold flex items-center gap-1 text-white">
                <Mic className="w-3.5 h-3.5 animate-pulse text-amber-300" />
                Listening to your microphone... (Ask anything)
              </span>
            ) : (
              <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                <Mic className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                Click me to talk with me
              </span>
            )}
          </div>
          
          <p className={`text-xs leading-relaxed font-normal ${isCurrentlyActive ? 'text-blue-50' : 'text-slate-600 dark:text-zinc-400'}`}>
            {localListening 
              ? "Speak your question now (e.g., 'What happened with Lambda SnapStart?')..."
              : message
            }
          </p>

          {/* Speech Bubble Pointer Arrow */}
          <div className={`absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 border-b border-r ${
            isSpeaking
              ? 'bg-blue-600 border-blue-500'
              : localListening
                ? 'bg-emerald-600 border-emerald-500'
                : 'bg-white dark:bg-[#18181b] border-slate-200 dark:border-zinc-700'
          }`} />
        </div>
      )}

      {/* Dori Animated Character */}
      <div 
        onClick={handleClick} 
        className={`relative cursor-pointer transition-all duration-300 ${
          interactive ? 'hover:scale-105 active:scale-95' : ''
        } ${isSpeaking ? 'animate-bounce' : localListening ? 'animate-pulse' : ''}`}
        title={isCurrentlyActive ? "Click to stop" : "Click to talk with Dori (Microphone access)"}
      >
        {/* Glowing aura when speaking or listening */}
        {isCurrentlyActive && (
          <div className="absolute -inset-3 bg-blue-500/25 rounded-full blur-lg animate-pulse" />
        )}

        <svg
          width={width}
          height={height}
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-md relative z-10"
        >
          {/* Antenna / Sensor with Pulse */}
          <line x1="60" y1="18" x2="60" y2="8" stroke="#2563EB" strokeWidth="4" strokeLinecap="round" />
          <circle cx="60" cy="7" r="5" fill={localListening ? '#10B981' : isSpeaking ? '#00D294' : '#3B82F6'} />

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
          ) : localEmotion === 'excited' || isSpeaking ? (
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
          {isSpeaking ? (
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
