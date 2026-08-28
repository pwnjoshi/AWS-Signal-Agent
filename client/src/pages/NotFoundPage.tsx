import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../components/Logo';
import { ParticleBackground } from '../components/ParticleBackground';
import { Home, Radio, Compass } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-[#09090b] text-slate-900 dark:text-zinc-100 flex flex-col justify-between font-sans relative overflow-hidden transition-colors">
      
      {/* Background Particle Mesh & Grid */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute inset-0 site-main-grid opacity-30" />
        <ParticleBackground />
      </div>

      {/* Header */}
      <header className="max-w-7xl mx-auto w-full px-6 py-6 flex items-center justify-between relative z-10">
        <Link to="/">
          <Logo size="md" />
        </Link>
        <Link
          to="/dashboard"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-mono text-xs font-bold uppercase shadow-sm transition-all"
        >
          Launch Hub
        </Link>
      </header>

      {/* Main 404 Hero */}
      <main className="max-w-3xl mx-auto px-6 py-16 text-center space-y-6 relative z-10 font-mono">
        <div className="w-16 h-16 rounded-xl bg-slate-50 dark:bg-[#18181b] border border-slate-200 dark:border-zinc-800 mx-auto flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-sm">
          <Compass className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-widest block">
            404 • SIGNAL LOST
          </span>
          <h1 className="text-3xl sm:text-5xl font-black font-display text-slate-900 dark:text-zinc-100 tracking-tight uppercase">
            Out of Orbit
          </h1>
          <p className="text-slate-600 dark:text-zinc-400 text-xs sm:text-sm max-w-md mx-auto leading-relaxed font-mono">
            The requested cloud coordinates could not be located in the AWS Signal neural matrix.
          </p>
        </div>

        <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold uppercase shadow-sm transition-all active:scale-98"
          >
            <Radio className="w-4 h-4" />
            <span>Return to Command Hub</span>
          </Link>

          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-[#18181b] hover:bg-slate-50 dark:hover:bg-[#202026] text-slate-900 dark:text-zinc-100 border border-slate-200 dark:border-zinc-800 rounded-lg text-xs font-bold uppercase transition-all"
          >
            <Home className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Showcase Home</span>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-zinc-800 py-6 text-center text-xs text-slate-500 dark:text-zinc-400 font-mono relative z-10">
        © {new Date().getFullYear()} AWS Signal • Autonomous Cloud Intelligence Platform
      </footer>

    </div>
  );
};
export default NotFoundPage;
