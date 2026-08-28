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
    xl: 'w-16 h-16',
  }[size];

  const textSize = {
    sm: 'text-xs',
    md: 'text-sm sm:text-base',
    lg: 'text-lg sm:text-xl',
    xl: 'text-2xl sm:text-3xl',
  }[size];

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* SA Logo Image */}
      <img
        src="/logo.png"
        alt="Signal Autonomous AWS Agent Logo"
        className={`${dimensions} object-contain shrink-0`}
      />

      {/* Brand Name Typography */}
      {showText && (
        <div className="flex flex-col leading-tight font-sans">
          <span className={`font-extrabold tracking-tight text-white ${textSize}`}>
            Signal<span style={{ color: '#2563eb' }}>Autonomous</span>
          </span>
          <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest flex items-center gap-1" style={{ color: '#fe6e00' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-[#fe6e00] animate-pulse" />
            AWS Agent · GEU Builder Group
          </span>
        </div>
      )}
    </div>
  );
};
