import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../components/Logo';
import { ParticleBackground } from '../components/ParticleBackground';
import { Home, ArrowLeft, Radio, Compass } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col justify-between font-sans relative overflow-hidden transition-colors">
      
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
          className="px-4 py-2 bg-primary hover:bg-primary-container text-white rounded-lg font-mono text-xs font-bold uppercase shadow-sm transition-all"
        >
          Launch Hub
        </Link>
      </header>

      {/* Main 404 Hero */}
      <main className="max-w-3xl mx-auto px-6 py-16 text-center space-y-6 relative z-10 font-mono">
        <div className="w-16 h-16 rounded-xl bg-surface-low border border-outline mx-auto flex items-center justify-center text-primary shadow-sm">
          <Compass className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold text-[#fe9800] uppercase tracking-widest block">
            404 • SIGNAL LOST
          </span>
          <h1 className="text-3xl sm:text-5xl font-black font-display text-on-background tracking-tight uppercase">
            Out of Orbit
          </h1>
          <p className="text-on-surface-variant text-xs sm:text-sm max-w-md mx-auto leading-relaxed font-mono">
            The requested cloud coordinates could not be located in the AWS Signal neural matrix.
          </p>
        </div>

        <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-container text-white rounded-lg text-xs font-bold uppercase shadow-sm transition-all active:scale-98"
          >
            <Radio className="w-4 h-4" />
            <span>Return to Command Hub</span>
          </Link>

          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-surface hover:bg-surface-container text-on-background border border-outline rounded-lg text-xs font-bold uppercase transition-all"
          >
            <Home className="w-4 h-4 text-primary" />
            <span>Showcase Home</span>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-outline py-6 text-center text-xs text-on-surface-variant font-mono relative z-10">
        © {new Date().getFullYear()} AWS Signal • Autonomous Cloud Intelligence Platform
      </footer>

    </div>
  );
};
export default NotFoundPage;
