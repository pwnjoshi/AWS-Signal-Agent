import React, { useState } from 'react';
import { UserProfile } from '../types/clientTypes';
import { X, ShieldCheck, User, Mail, Sparkles, LogIn, ArrowRight } from 'lucide-react';
import { authenticateBuilderId } from '../services/apiClient';

interface BuilderIdAuthModalProps {
  currentProfile: UserProfile | null;
  onClose: () => void;
  onSuccess: (profile: UserProfile) => void;
}

export const BuilderIdAuthModal: React.FC<BuilderIdAuthModalProps> = ({
  currentProfile,
  onClose,
  onSuccess,
}) => {
  const [builderId, setBuilderId] = useState(currentProfile?.builder_id || '');
  const [displayName, setDisplayName] = useState(currentProfile?.display_name || '');
  const [email, setEmail] = useState(currentProfile?.email || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!builderId.trim()) return;

    setIsSubmitting(true);
    try {
      const profile = await authenticateBuilderId(builderId.trim(), displayName.trim(), email.trim());
      onSuccess(profile);
      onClose();
    } catch (err: any) {
      alert(`Quick Auth error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 font-mono text-zinc-100">
      <div className="bg-[#121216] rounded-3xl max-w-md w-full shadow-2xl border border-[#27272a] p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#27272a] mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#fe6e00]/15 border border-[#fe6e00]/30 flex items-center justify-center text-[#ffc080] font-bold shadow-md shadow-[#fe6e00]/20">
              ⚡
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black font-display uppercase tracking-tight text-white">
                AWS Builder ID Quick Auth
              </h2>
              <p className="text-xs text-zinc-400 font-sans">Instant One-Click Profile Authentication</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white hover:bg-[#18181b] rounded-full transition-all border border-[#27272a]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-xs font-bold text-white uppercase tracking-wider mb-2">
              AWS Builder ID Username / Handle
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={builderId}
                onChange={(e) => setBuilderId(e.target.value)}
                placeholder="e.g. builder_pawan_2026 or pawan_aws"
                className="w-full bg-[#18181b] border border-[#27272a] rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#AD5CFF] text-white placeholder:text-zinc-500 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-white uppercase tracking-wider mb-2">
              Display Name
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="e.g. Pawan Joshi"
              className="w-full bg-[#18181b] border border-[#27272a] rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#AD5CFF] text-white placeholder:text-zinc-500 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-white uppercase tracking-wider mb-2">
              Notification Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. pawan@builder.aws"
                className="w-full bg-[#18181b] border border-[#27272a] rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#AD5CFF] text-white placeholder:text-zinc-500 font-medium"
              />
            </div>
          </div>

          <div className="bg-[#09090b] border border-[#fe6e00]/30 rounded-2xl p-3.5 flex items-start gap-2.5 text-xs text-[#ffc080] font-sans">
            <ShieldCheck className="w-4 h-4 text-[#fe6e00] shrink-0 mt-0.5" />
            <p>
              Entering your Builder ID immediately authenticates your session, syncs your custom topic preferences, and enables email alerts.
            </p>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 font-mono">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-zinc-400 hover:bg-[#18181b] hover:text-white transition-all uppercase"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !builderId.trim()}
              className="inline-flex items-center gap-2 bg-[#AD5CFF] hover:bg-[#9C47FF] text-white px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-purple-glow transition-all disabled:opacity-50"
            >
              <span>{isSubmitting ? 'Authenticating...' : 'Sign In with Builder ID'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
export default BuilderIdAuthModal;
