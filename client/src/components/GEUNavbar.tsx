import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Menu, 
  X, 
  ArrowUpRight, 
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
        ? 'bg-white/95 dark:bg-[#09090b]/95 backdrop-blur-md border-slate-200 dark:border-zinc-800 shadow-sm py-1' 
        : 'bg-white/70 dark:bg-[#09090b]/70 backdrop-blur-sm border-transparent py-2.5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          
          {/* Brand Logo */}
          <Link to="/">
            <Logo size="md" showText={true} />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100 dark:bg-[#18181b] border border-slate-200 dark:border-zinc-800 px-2 py-1 rounded-lg font-mono text-xs font-semibold text-slate-600 dark:text-zinc-400">
            <a href="#home" className="px-3 py-1.5 rounded-md hover:text-slate-900 dark:hover:text-zinc-100 hover:bg-white dark:hover:bg-[#27272a] transition-all">Home</a>
            <a href="#intelligence" className="px-3 py-1.5 rounded-md hover:text-slate-900 dark:hover:text-zinc-100 hover:bg-white dark:hover:bg-[#27272a] transition-all">Intelligence</a>
            <a href="#how-it-works" className="px-3 py-1.5 rounded-md hover:text-slate-900 dark:hover:text-zinc-100 hover:bg-white dark:hover:bg-[#27272a] transition-all">How It Works</a>
            <a href="#dori" className="px-3 py-1.5 rounded-md hover:text-slate-900 dark:hover:text-zinc-100 hover:bg-white dark:hover:bg-[#27272a] transition-all">Dori</a>
            <a href="#architecture" className="px-3 py-1.5 rounded-md hover:text-slate-900 dark:hover:text-zinc-100 hover:bg-white dark:hover:bg-[#27272a] transition-all">Architecture</a>
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-2.5 font-mono text-xs">
            {/* Theme Toggle Button */}
            <button 
              onClick={toggleTheme}
              className="p-2 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100 rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] hover:bg-slate-100 dark:hover:bg-[#27272a] transition-all cursor-pointer flex items-center justify-center"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon className="w-4 h-4 text-slate-700" /> : <Sun className="w-4 h-4 text-amber-400" />}
            </button>

            {onOpenAuthModal && (
              <button
                onClick={onOpenAuthModal}
                className="px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] hover:bg-slate-100 dark:hover:bg-[#27272a] text-slate-800 dark:text-zinc-200 font-mono font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <UserCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>Builder ID</span>
              </button>
            )}

            <Link
              to="/dashboard"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-mono font-bold uppercase tracking-wide text-xs flex items-center gap-1.5 transition-all active:scale-98 shadow-sm"
            >
              <span>Command Hub</span>
              <ArrowUpRight className="w-3.5 h-3.5 opacity-90" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100 transition-colors flex items-center justify-center p-2 rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#18181b]"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="md:hidden absolute top-[calc(100%+0.5rem)] left-3 right-3 bg-white dark:bg-[#18181b] border border-slate-200 dark:border-zinc-800 rounded-xl p-4 shadow-xl z-50 max-h-[calc(100vh-6rem)] overflow-y-auto font-mono text-xs space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <a href="#home" onClick={() => setIsOpen(false)} className="p-2.5 rounded-lg bg-slate-50 dark:bg-[#202026] text-slate-700 dark:text-zinc-300">Home</a>
            <a href="#intelligence" onClick={() => setIsOpen(false)} className="p-2.5 rounded-lg bg-slate-50 dark:bg-[#202026] text-slate-700 dark:text-zinc-300">Intelligence</a>
            <a href="#how-it-works" onClick={() => setIsOpen(false)} className="p-2.5 rounded-lg bg-slate-50 dark:bg-[#202026] text-slate-700 dark:text-zinc-300">How It Works</a>
            <a href="#dori" onClick={() => setIsOpen(false)} className="p-2.5 rounded-lg bg-slate-50 dark:bg-[#202026] text-slate-700 dark:text-zinc-300">Dori</a>
            <a href="#architecture" onClick={() => setIsOpen(false)} className="p-2.5 rounded-lg bg-slate-50 dark:bg-[#202026] text-slate-700 dark:text-zinc-300">Architecture</a>
          </div>

          <div className="pt-3 border-t border-slate-200 dark:border-zinc-800 flex flex-col gap-2">
            <button 
              onClick={toggleTheme}
              className="w-full py-2 rounded-lg border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-[#202026] text-slate-700 dark:text-zinc-300 font-bold flex items-center justify-center gap-2"
            >
              {theme === 'light' ? <><Moon className="w-4 h-4" /> Dark Theme</> : <><Sun className="w-4 h-4 text-amber-400" /> Light Theme</>}
            </button>

            {onOpenAuthModal && (
              <button
                onClick={() => { setIsOpen(false); onOpenAuthModal(); }}
                className="w-full py-2 rounded-lg border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-[#202026] text-slate-800 dark:text-zinc-200 font-bold"
              >
                Sign in with Builder ID
              </button>
            )}
            <Link
              to="/dashboard"
              onClick={() => setIsOpen(false)}
              className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-center"
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
