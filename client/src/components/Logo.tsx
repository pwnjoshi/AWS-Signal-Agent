import React from 'react';
import { useTheme } from '../context/ThemeContext';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', showText = true, className = '' }) => {
  const { theme } = useTheme();

  const dimensions = {
    sm: 'w-7 h-7',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
    xl: 'w-14 h-14',
  }[size];

  const textSize = {
    sm: 'text-xs',
    md: 'text-sm sm:text-base',
    lg: 'text-base sm:text-lg',
    xl: 'text-xl sm:text-2xl',
  }[size];

  // In dark mode use whitelogo.png with crisp visibility, in light mode use standard logo.png
  const logoSrc = theme === 'dark' ? '/whitelogo.png' : '/logo.png';

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Brand Logo Container with contrast styling */}
      <div className="p-1 rounded-xl bg-surface-low border border-outline shadow-sm flex items-center justify-center shrink-0 transition-colors">
        <img
          src={logoSrc}
          alt="AWS Signal Logo"
          className={`${dimensions} object-contain shrink-0 transform transition-transform duration-300 hover:scale-105`}
          onError={(e: any) => {
            e.target.src = '/logo.png';
          }}
        />
      </div>

      {/* Brand Name Typography */}
      {showText && (
        <div className="flex flex-col leading-tight font-mono text-left">
          <span className={`font-black tracking-tight text-on-background uppercase ${textSize}`}>
            AWS <span className="text-primary">Signal</span>
          </span>
          <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 text-[#fe9800] dark:text-secondary">
            <span className="w-1.5 h-1.5 rounded-full bg-[#fe9800] dark:bg-secondary animate-pulse" />
            GEU Builder Group
          </span>
        </div>
      )}
    </div>
  );
};
export default Logo;
