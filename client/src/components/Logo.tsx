import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', showText = true, className = '' }) => {
  const containerSize = {
    sm: 'h-7 w-7 p-1',
    md: 'h-8 w-8 p-1.5',
    lg: 'h-10 w-10 p-2',
  }[size];

  const titleSize = {
    sm: 'text-xs',
    md: 'text-sm font-semibold',
    lg: 'text-base font-bold',
  }[size];

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Crisp White Container so the original logo is 100% visible and vivid in both Light and Dark mode */}
      <div className={`${containerSize} rounded-lg bg-white border border-slate-200 dark:border-zinc-700 flex items-center justify-center shrink-0 shadow-sm`}>
        <img
          src="/logo.png"
          alt="AWS Signal Logo"
          className="h-full w-full object-contain"
        />
      </div>

      {/* Brand Name Typography */}
      {showText && (
        <div className="flex flex-col text-left leading-tight font-sans">
          <span className={`tracking-tight text-slate-900 dark:text-zinc-100 ${titleSize}`}>
            AWS Signal
          </span>
          <span className="text-[11px] text-slate-500 dark:text-zinc-400 font-normal tracking-normal">
            Autonomous Cloud Intelligence
          </span>
        </div>
      )}
    </div>
  );
};
export default Logo;
