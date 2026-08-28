import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Menu, 
  X, 
  ArrowUpRight, 
  Radio, 
  Sparkles, 
  UserCheck, 
  Layers, 
  Cpu, 
  Activity, 
  Compass, 
  BookOpen, 
  Flame, 
  ExternalLink 
} from 'lucide-react';
import { Logo } from './Logo';

interface GEUNavbarProps {
  onOpenAuthModal?: () => void;
  onLaunchDashboard?: () => void;
}

export const GEUNavbar: React.FC<GEUNavbarProps> = ({ onOpenAuthModal, onLaunchDashboard }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 w-full z-[100] transition-all duration-300 select-none border-b ${
      scrolled 
        ? 'bg-[#09090b]/85 backdrop-blur-md border-[#27272a] shadow-md py-1' 
        : 'bg-[#09090b]/40 backdrop-blur-sm border-transparent py-3'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          
          {/* Brand Logo with exact GEU typography */}
          <Link to="/" className="flex items-center gap-3 group select-none">
            <img 
              src="/logo.png" 
              alt="AWS Student Builder Group GEU" 
              className="h-8 sm:h-9 w-auto object-contain transform group-hover:scale-105 transition-transform duration-300" 
            />
            <div className="flex flex-col text-left font-mono">
              <span className="text-[11px] sm:text-[12px] font-black uppercase tracking-wider text-[#f4f4f5] leading-tight">
                AWS Student Builder Group
              </span>
              <span className="text-[9.5px] sm:text-[10.5px] text-[#AD5CFF] font-extrabold tracking-wide leading-tight mt-0.5">
                Graphic Era Deemed to be University
              </span>
            </div>
          </Link>

          {/* Desktop Capsule Menu */}
          <div className="hidden md:flex items-center gap-1 bg-[#18181b]/70 border border-[#27272a]/70 backdrop-blur-xl px-2 py-1 rounded-full shadow-inner font-mono text-xs font-semibold text-zinc-300">
            <a href="#home" className="px-3.5 py-1.5 rounded-full hover:text-white hover:bg-[#27272a] transition-all">Home</a>
            <a href="#intelligence" className="px-3.5 py-1.5 rounded-full hover:text-white hover:bg-[#27272a] transition-all">Intelligence</a>
            <a href="#how-it-works" className="px-3.5 py-1.5 rounded-full hover:text-white hover:bg-[#27272a] transition-all">How It Works</a>
            <a href="#dori" className="px-3.5 py-1.5 rounded-full hover:text-white hover:bg-[#27272a] transition-all">Dori</a>
            <a href="#showcase" className="px-3.5 py-1.5 rounded-full hover:text-white hover:bg-[#27272a] transition-all">Showcase</a>
            <a href="#architecture" className="px-3.5 py-1.5 rounded-full hover:text-white hover:bg-[#27272a] transition-all">Architecture</a>
          </div>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-3 font-mono">
            {onOpenAuthModal && (
              <button
                onClick={onOpenAuthModal}
                className="px-3.5 py-2 rounded-full border border-[#fe6e00]/40 bg-[#fe6e00]/10 hover:bg-[#fe6e00]/20 text-[#ffc080] font-mono font-bold text-[10px] uppercase tracking-wider transition-all flex items-center gap-1.5"
              >
                <UserCheck className="w-3.5 h-3.5 text-[#fe6e00]" />
                <span>Builder ID</span>
              </button>
            )}

            <Link
              to="/dashboard"
              className="px-5 py-2.5 bg-[#AD5CFF] text-white hover:bg-[#9C47FF] rounded-full font-mono font-bold tracking-wider uppercase shadow-md hover:shadow-purple-glow transition-all duration-300 text-[10px] flex items-center gap-1.5 active:scale-95"
            >
              <span>Command Hub</span>
              <ArrowUpRight className="w-3 h-3 opacity-90" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-zinc-400 hover:text-white transition-colors relative z-50 flex items-center justify-center p-2 rounded-xl border border-zinc-800"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="md:hidden absolute top-[calc(100%+0.5rem)] left-3 right-3 bg-[#09090b]/98 backdrop-blur-xl border border-[#27272a] rounded-3xl p-5 shadow-2xl z-50 max-h-[calc(100vh-6rem)] overflow-y-auto font-mono text-xs space-y-4">
          <div className="space-y-3">
            <span className="text-[10px] font-mono font-bold text-[#AD5CFF] uppercase tracking-widest block px-1">
              Navigation
            </span>
            <div className="grid grid-cols-2 gap-2">
              <a href="#home" onClick={() => setIsOpen(false)} className="p-2.5 rounded-xl bg-[#18181b] text-zinc-300 hover:text-white">Home</a>
              <a href="#intelligence" onClick={() => setIsOpen(false)} className="p-2.5 rounded-xl bg-[#18181b] text-zinc-300 hover:text-white">Intelligence</a>
              <a href="#how-it-works" onClick={() => setIsOpen(false)} className="p-2.5 rounded-xl bg-[#18181b] text-zinc-300 hover:text-white">How It Works</a>
              <a href="#dori" onClick={() => setIsOpen(false)} className="p-2.5 rounded-xl bg-[#18181b] text-zinc-300 hover:text-white">Dori</a>
              <a href="#showcase" onClick={() => setIsOpen(false)} className="p-2.5 rounded-xl bg-[#18181b] text-zinc-300 hover:text-white">Showcase</a>
              <a href="#architecture" onClick={() => setIsOpen(false)} className="p-2.5 rounded-xl bg-[#18181b] text-zinc-300 hover:text-white">Architecture</a>
            </div>
          </div>

          <div className="pt-3 border-t border-zinc-800 flex flex-col gap-2">
            {onOpenAuthModal && (
              <button
                onClick={() => { setIsOpen(false); onOpenAuthModal(); }}
                className="w-full py-2.5 rounded-xl border border-[#fe6e00]/40 bg-[#fe6e00]/10 text-[#ffc080] font-bold"
              >
                Sign in with AWS Builder ID
              </button>
            )}
            <Link
              to="/dashboard"
              onClick={() => setIsOpen(false)}
              className="w-full py-2.5 rounded-xl bg-[#AD5CFF] hover:bg-[#9C47FF] text-white font-bold text-center shadow-purple-glow"
            >
              Launch Live Dashboard
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
export default GEUNavbar;
