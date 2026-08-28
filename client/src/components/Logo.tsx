import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', showText = true, className = '' }) => {
  const containerSize = {
    sm: 'h-7 w-7 p-1',
    md: 'h-9 w-9 p-1.5',
    lg: 'h-11 w-11 p-2',
  }[size];

  const titleSize = {
    sm: 'text-xs',
    md: 'text-sm sm:text-base',
    lg: 'text-base sm:text-lg',
  }[size];

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Crisp White Container so the original logo is 100% visible and vivid in both Light and Dark mode */}
      <div className={`${containerSize} rounded-lg bg-white border border-outline flex items-center justify-center shrink-0 shadow-sm`}>
        <img
          src="/logo.png"
          alt="AWS Signal Logo"
          className="h-full w-full object-contain"
        />
      </div>

      {/* Brand Name Typography */}
      {showText && (
        <div className="flex flex-col text-left leading-none font-mono">
          <div className="flex items-center gap-1">
            <span className={`font-black tracking-tight text-on-background uppercase ${titleSize}`}>
              AWS Signal
            </span>
          </div>
          <span className="text-[10px] text-on-surface-variant font-medium tracking-wide mt-1">
            Autonomous Cloud Intelligence
          </span>
        </div>
      )}
    </div>
  );
};
export default Logo;
