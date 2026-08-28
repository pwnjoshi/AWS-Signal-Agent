import React from 'react';
import { useTheme } from '../context/ThemeContext';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', showText = true, className = '' }) => {
  const { theme } = useTheme();

  const imgSize = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-10 w-10',
  }[size];

  const titleSize = {
    sm: 'text-xs',
    md: 'text-sm sm:text-base',
    lg: 'text-base sm:text-lg',
  }[size];

  const logoSrc = theme === 'dark' ? '/whitelogo.png' : '/logo.png';

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Crisp Logo Icon Container with Clean Border */}
      <div className="h-9 w-9 rounded-lg bg-surface border border-outline flex items-center justify-center p-1.5 shrink-0 transition-colors shadow-sm">
        <img
          src={logoSrc}
          alt="AWS Signal Logo"
          className="h-full w-full object-contain"
          onError={(e: any) => {
            e.target.src = '/logo.png';
          }}
        />
      </div>

      {/* Clean Brand Typography */}
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
