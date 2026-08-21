import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', showText = true, className = '' }) => {
  const dimensions = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
    xl: 'w-14 h-14',
  }[size];

  const textSize = {
    sm: 'text-sm',
    md: 'text-base sm:text-lg',
    lg: 'text-xl sm:text-2xl',
    xl: 'text-2xl sm:text-3xl',
  }[size];

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Professional Vector Logo Graphic */}
      <div className={`${dimensions} relative shrink-0 flex items-center justify-center rounded-2xl bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 p-1.5 shadow-md shadow-blue-500/20 border border-blue-500/30 group hover:scale-105 transition-all duration-300`}>
        {/* Glow aura */}
        <div className="absolute inset-0 rounded-2xl bg-blue-500/20 blur-sm group-hover:bg-blue-400/30 transition-all" />
        
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full relative z-10">
          <defs>
            <linearGradient id="logo-grad-1" x1="10" y1="90" x2="90" y2="10" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="50%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
          </defs>

          {/* Radar Signal Wave Outer Arc */}
          <path d="M 18,36 A 36,36 0 0,1 82,36" stroke="url(#logo-grad-1)" strokeWidth="6" strokeLinecap="round" opacity="0.4" />
          <path d="M 26,28 A 26,26 0 0,1 74,28" stroke="url(#logo-grad-1)" strokeWidth="7" strokeLinecap="round" opacity="0.85" />

          {/* Cloud Signal Base */}
          <path 
            d="M 26,70 C 17,70 13,61 17,52 C 21,43 30,43 34,39 C 39,30 52,26 62,33 C 72,28 84,37 82,48 C 88,53 87,64 78,70 Z" 
            fill="url(#logo-grad-1)" 
          />

          {/* Lightning Signal Core */}
          <path 
            d="M 54,34 L 42,54 L 52,54 L 46,73 L 62,47 L 51,47 Z" 
            fill="#ffffff" 
          />

          {/* Active AI Pulse Indicator */}
          <circle cx="78" cy="26" r="5" fill="#10b981" />
          <circle cx="78" cy="26" r="9" stroke="#10b981" strokeWidth="2" opacity="0.6" />
        </svg>
      </div>

      {/* Brand Name Typography */}
      {showText && (
        <div className="flex flex-col leading-none">
          <span className={`font-extrabold tracking-tight text-slate-900 font-rounded ${textSize}`}>
            AWS <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 bg-clip-text text-transparent">Signal</span>
          </span>
          <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-blue-600 mt-1 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Autonomous Agent
          </span>
        </div>
      )}
    </div>
  );
};
