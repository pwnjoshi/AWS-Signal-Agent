import React, { useState } from 'react';

export type DoriEmotion = 'happy' | 'curious' | 'thinking' | 'alert' | 'excited' | 'sleeping' | 'working';

interface DoriCompanionProps {
  emotion?: DoriEmotion;
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  showSpeechBubble?: boolean;
  interactive?: boolean;
}

export const DoriCompanion: React.FC<DoriCompanionProps> = ({
  emotion = 'happy',
  message = "I've been watching the cloud for you!",
  size = 'md',
  showSpeechBubble = true,
  interactive = true,
}) => {
  const [currentEmotion, setCurrentEmotion] = useState<DoriEmotion>(emotion);
  const [speech, setSpeech] = useState<string>(message);

  React.useEffect(() => {
    setCurrentEmotion(emotion);
  }, [emotion]);

  React.useEffect(() => {
    setSpeech(message);
  }, [message]);

  const handleCompanionClick = () => {
    if (!interactive) return;
    const quotes = [
      "I'm keeping an eye on AWS What's New and re:Post discussions!",
      "Tip: Bedrock Cross-Region inference is trending today!",
      "I deduplicate everything with SHA-256 so you don't read duplicate AWS news.",
      "Need a daily briefing? Check out Today's Briefing tab!",
      "Everything is clear in your AWS environment right now!",
    ];
    const nextQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setSpeech(nextQuote);
    setCurrentEmotion('excited');
    setTimeout(() => setCurrentEmotion(emotion), 3000);
  };

  const getDimensions = () => {
    switch (size) {
      case 'sm': return { width: 64, height: 64 };
      case 'lg': return { width: 140, height: 140 };
      default: return { width: 96, height: 96 };
    }
  };

  const { width, height } = getDimensions();

  return (
    <div className="relative inline-flex flex-col items-center select-none group">
      {/* Speech Bubble */}
      {showSpeechBubble && speech && (
        <div className="mb-3 max-w-xs bg-white dark:bg-[#18181b] text-slate-900 dark:text-zinc-100 border border-slate-200 dark:border-zinc-800 rounded-xl p-3 text-xs md:text-sm shadow-sm relative z-10 transition-all duration-200">
          <div className="font-mono font-bold text-blue-600 dark:text-blue-400 mb-0.5 flex items-center gap-1.5 text-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00d294]" />
            Dori Assistant
          </div>
          <p className="text-slate-600 dark:text-zinc-400 leading-relaxed font-sans text-xs">{speech}</p>
          {/* Arrow */}
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white dark:bg-[#18181b] border-b border-r border-slate-200 dark:border-zinc-800 rotate-45" />
        </div>
      )}

      {/* Dori Companion Vector Graphic */}
      <div 
        onClick={handleCompanionClick} 
        className={`relative cursor-pointer transition-transform duration-200 ${interactive ? 'hover:scale-105 active:scale-98' : ''}`}
        title="Dori - Your Autonomous AWS Intelligence Companion"
      >
        <svg
          width={width}
          height={height}
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-sm"
        >
          {/* Antenna / Sensor */}
          <line x1="60" y1="18" x2="60" y2="8" stroke="#2563EB" strokeWidth="4" strokeLinecap="round" />
          <circle cx="60" cy="7" r="5" fill={currentEmotion === 'alert' ? '#EF4444' : '#3B82F6'} />

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

          {/* Eyes depending on emotion */}
          {currentEmotion === 'happy' && (
            <>
              <circle cx="46" cy="42" r="5" fill="#1E293B" />
              <circle cx="74" cy="42" r="5" fill="#1E293B" />
              <circle cx="48" cy="40" r="1.8" fill="#FFFFFF" />
              <circle cx="76" cy="40" r="1.8" fill="#FFFFFF" />
            </>
          )}

          {currentEmotion === 'excited' && (
            <>
              <path d="M 41 42 L 46 37 L 51 42 M 41 42 L 46 45 Z" fill="#1E293B" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
              <path d="M 69 42 L 74 37 L 79 42 M 69 42 L 74 45 Z" fill="#1E293B" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
            </>
          )}

          {currentEmotion === 'curious' && (
            <>
              <circle cx="46" cy="42" r="6" fill="#1E293B" />
              <circle cx="74" cy="40" r="4" fill="#1E293B" />
              <circle cx="48" cy="40" r="2" fill="#FFFFFF" />
              <circle cx="75" cy="39" r="1.5" fill="#FFFFFF" />
            </>
          )}

          {currentEmotion === 'thinking' && (
            <>
              <ellipse cx="46" cy="40" rx="5" ry="3" fill="#1E293B" />
              <circle cx="74" cy="38" r="5" fill="#1E293B" />
              <circle cx="76" cy="36" r="1.8" fill="#FFFFFF" />
            </>
          )}

          {currentEmotion === 'alert' && (
            <>
              <circle cx="46" cy="42" r="6" fill="#EF4444" />
              <circle cx="74" cy="42" r="6" fill="#EF4444" />
              <circle cx="46" cy="42" r="2" fill="#FFFFFF" />
              <circle cx="74" cy="42" r="2" fill="#FFFFFF" />
            </>
          )}

          {currentEmotion === 'sleeping' && (
            <>
              <path d="M 41 43 Q 46 47 51 43" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <path d="M 69 43 Q 74 47 79 43" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            </>
          )}

          {currentEmotion === 'working' && (
            <>
              <circle cx="46" cy="42" r="5" fill="#2563EB" />
              <circle cx="74" cy="42" r="5" fill="#2563EB" />
              <line x1="40" y1="36" x2="52" y2="36" stroke="#2563EB" strokeWidth="2" />
              <line x1="68" y1="36" x2="80" y2="36" stroke="#2563EB" strokeWidth="2" />
            </>
          )}

          {/* Cute Blush */}
          <ellipse cx="38" cy="49" rx="4" ry="2" fill="#F472B6" opacity="0.6" />
          <ellipse cx="82" cy="49" rx="4" ry="2" fill="#F472B6" opacity="0.6" />

          {/* Mouth Expression */}
          {currentEmotion === 'sleeping' ? (
            <ellipse cx="60" cy="54" rx="2" ry="3" fill="#64748B" />
          ) : currentEmotion === 'alert' ? (
            <circle cx="60" cy="54" r="4" stroke="#1E293B" strokeWidth="2" fill="none" />
          ) : (
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
