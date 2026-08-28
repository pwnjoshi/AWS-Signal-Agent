import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Menu, 
  X, 
  ArrowUpRight, 
  Radio, 
  Sparkles, 
  UserCheck, 
  Sun, 
  Moon 
} from 'lucide-react';
import { Logo } from './Logo';
import { useTheme } from '../context/ThemeContext';

interface GEUNavbarProps {
  onOpenAuthModal?: () => void;
  onLaunchDashboard?: () => void;
}

export const GEUNavbar: React.FC<GEUNavbarProps> = ({ onOpenAuthModal, onLaunchDashboard }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 w-full z-[100] transition-all duration-200 select-none border-b ${
      scrolled 
        ? 'bg-surface/95 backdrop-blur-md border-outline shadow-sm py-1' 
        : 'bg-surface/60 backdrop-blur-sm border-transparent py-2.5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          
          {/* Clean Brand Logo */}
          <Link to="/">
            <Logo size="md" showText={true} />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-surface-low border border-outline px-2 py-1 rounded-lg font-mono text-xs font-semibold text-on-surface-variant">
            <a href="#home" className="px-3 py-1.5 rounded-md hover:text-on-background hover:bg-surface transition-all">Home</a>
            <a href="#intelligence" className="px-3 py-1.5 rounded-md hover:text-on-background hover:bg-surface transition-all">Intelligence</a>
            <a href="#how-it-works" className="px-3 py-1.5 rounded-md hover:text-on-background hover:bg-surface transition-all">How It Works</a>
            <a href="#dori" className="px-3 py-1.5 rounded-md hover:text-on-background hover:bg-surface transition-all">Dori</a>
            <a href="#architecture" className="px-3 py-1.5 rounded-md hover:text-on-background hover:bg-surface transition-all">Architecture</a>
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-2.5 font-mono text-xs">
            {/* Theme Toggle Button */}
            <button 
              onClick={toggleTheme}
              className="p-2 text-on-surface-variant hover:text-on-background rounded-lg border border-outline hover:bg-surface-container transition-all cursor-pointer flex items-center justify-center"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-[#fe9800]" />}
            </button>

            {onOpenAuthModal && (
              <button
                onClick={onOpenAuthModal}
                className="px-3 py-2 rounded-lg border border-outline bg-surface-low hover:bg-surface-container text-on-background font-mono font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <UserCheck className="w-3.5 h-3.5 text-primary" />
                <span>Builder ID</span>
              </button>
            )}

            <Link
              to="/dashboard"
              className="px-4 py-2 bg-primary text-white hover:bg-primary-container rounded-lg font-mono font-bold uppercase tracking-wide text-xs flex items-center gap-1.5 transition-all active:scale-98 shadow-sm"
            >
              <span>Command Hub</span>
              <ArrowUpRight className="w-3.5 h-3.5 opacity-90" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-on-surface-variant hover:text-on-background transition-colors relative z-50 flex items-center justify-center p-2 rounded-lg border border-outline"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="md:hidden absolute top-[calc(100%+0.5rem)] left-3 right-3 bg-surface/98 backdrop-blur-xl border border-outline rounded-xl p-4 shadow-xl z-50 max-h-[calc(100vh-6rem)] overflow-y-auto font-mono text-xs space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <a href="#home" onClick={() => setIsOpen(false)} className="p-2.5 rounded-lg bg-surface-low text-on-surface-variant hover:text-on-background">Home</a>
            <a href="#intelligence" onClick={() => setIsOpen(false)} className="p-2.5 rounded-lg bg-surface-low text-on-surface-variant hover:text-on-background">Intelligence</a>
            <a href="#how-it-works" onClick={() => setIsOpen(false)} className="p-2.5 rounded-lg bg-surface-low text-on-surface-variant hover:text-on-background">How It Works</a>
            <a href="#dori" onClick={() => setIsOpen(false)} className="p-2.5 rounded-lg bg-surface-low text-on-surface-variant hover:text-on-background">Dori</a>
            <a href="#architecture" onClick={() => setIsOpen(false)} className="p-2.5 rounded-lg bg-surface-low text-on-surface-variant hover:text-on-background">Architecture</a>
          </div>

          <div className="pt-3 border-t border-outline flex flex-col gap-2">
            <button 
              onClick={toggleTheme}
              className="w-full py-2 rounded-lg border border-outline bg-surface-low text-on-surface-variant font-bold flex items-center justify-center gap-2"
            >
              {theme === 'light' ? <><Moon className="w-4 h-4" /> Dark Theme</> : <><Sun className="w-4 h-4 text-[#fe9800]" /> Light Theme</>}
            </button>

            {onOpenAuthModal && (
              <button
                onClick={() => { setIsOpen(false); onOpenAuthModal(); }}
                className="w-full py-2 rounded-lg border border-outline bg-surface-low text-on-background font-bold"
              >
                Sign in with Builder ID
              </button>
            )}
            <Link
              to="/dashboard"
              onClick={() => setIsOpen(false)}
              className="w-full py-2 rounded-lg bg-primary hover:bg-primary-container text-white font-bold text-center"
            >
              Launch Command Hub
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
export default GEUNavbar;
