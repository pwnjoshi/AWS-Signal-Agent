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
    sm: 'text-xs',
    md: 'text-sm sm:text-base',
    lg: 'text-lg sm:text-xl',
    xl: 'text-2xl sm:text-3xl',
  }[size];

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* AWS Club GEU Style Logo Graphic */}
      <div className={`${dimensions} relative shrink-0 flex items-center justify-center rounded-2xl bg-gradient-to-br from-[#ad5cff] via-[#8d36eb] to-[#fe6e00] p-1.5 shadow-lg shadow-[#ad5cff]/30 border border-white/20 group hover:scale-105 transition-all duration-300`}>
        {/* Glow aura */}
        <div className="absolute inset-0 rounded-2xl bg-[#ad5cff]/30 blur-md group-hover:bg-[#fe6e00]/40 transition-all" />
        
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full relative z-10">
          {/* Signal Arcs */}
          <path d="M 18,36 A 36,36 0 0,1 82,36" stroke="#ffffff" strokeWidth="7" strokeLinecap="round" opacity="0.6" />
          <path d="M 28,28 A 26,26 0 0,1 72,28" stroke="#ffffff" strokeWidth="8" strokeLinecap="round" opacity="0.9" />

          {/* Cloud Signal Base */}
          <path 
            d="M 26,70 C 17,70 13,61 17,52 C 21,43 30,43 34,39 C 39,30 52,26 62,33 C 72,28 84,37 82,48 C 88,53 87,64 78,70 Z" 
            fill="#ffffff" 
          />

          {/* Lightning Core */}
          <path 
            d="M 54,34 L 42,54 L 52,54 L 46,73 L 62,47 L 51,47 Z" 
            fill="#fe6e00" 
          />
        </svg>
      </div>

      {/* Brand Name Typography */}
      {showText && (
        <div className="flex flex-col leading-tight font-sans">
          <span className={`font-extrabold tracking-tight text-white ${textSize}`}>
            AWS <span className="text-geu-gradient">Pulse AI</span>
          </span>
          <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-[#ad5cff] flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#fe6e00] animate-pulse" />
            Student Builder Group GEU
          </span>
        </div>
      )}
    </div>
  );
};
