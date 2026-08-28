import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../components/Logo';
import { ParticleBackground } from '../components/ParticleBackground';
import { Home, ArrowLeft, Radio, Compass } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] flex flex-col justify-between font-sans relative overflow-hidden">
      
      {/* Background Particle Mesh & Grid */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute inset-0 site-main-grid opacity-30" />
        <div className="site-gradient-glows" />
        <ParticleBackground />
      </div>

      {/* Header */}
      <header className="max-w-7xl mx-auto w-full px-6 py-6 flex items-center justify-between relative z-10">
        <Link to="/">
          <Logo size="md" />
        </Link>
        <Link
          to="/dashboard"
          className="px-5 py-2 bg-[#AD5CFF] hover:bg-[#9C47FF] text-white rounded-full font-mono text-xs font-bold uppercase shadow-purple-glow transition-all"
        >
          Launch Hub
        </Link>
      </header>

      {/* Main 404 Hero */}
      <main className="max-w-3xl mx-auto px-6 py-16 text-center space-y-6 relative z-10 font-mono">
        <div className="w-20 h-20 rounded-3xl bg-[#AD5CFF]/15 border border-[#AD5CFF]/30 mx-auto flex items-center justify-center text-[#AD5CFF] shadow-purple-glow">
          <Compass className="w-10 h-10 animate-spin" style={{ animationDuration: '10s' }} />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold text-[#ffc080] uppercase tracking-widest block">
            404 • SIGNAL LOST
          </span>
          <h1 className="text-4xl sm:text-6xl font-black font-display text-white tracking-tight uppercase">
            Out of Orbit
          </h1>
          <p className="text-zinc-400 text-xs sm:text-sm max-w-md mx-auto leading-relaxed font-mono">
            The requested cloud coordinates could not be located in the AWS Signal neural matrix.
          </p>
        </div>

        <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#AD5CFF] hover:bg-[#9C47FF] text-white rounded-xl text-xs font-bold uppercase shadow-purple-glow transition-all active:scale-95"
          >
            <Radio className="w-4 h-4" />
            <span>Return to Command Hub</span>
          </Link>

          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#18181b] hover:bg-[#27272a] text-zinc-200 border border-[#27272a] rounded-xl text-xs font-bold uppercase transition-all"
          >
            <Home className="w-4 h-4 text-[#AD5CFF]" />
            <span>Showcase Home</span>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#27272a] py-8 text-center text-xs text-zinc-500 font-mono relative z-10">
        AWS Signal • AWS Student Builder Group Graphic Era University
      </footer>

    </div>
  );
};
export default NotFoundPage;
