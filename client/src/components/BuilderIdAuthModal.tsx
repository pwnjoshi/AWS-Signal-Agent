import React, { useState } from 'react';
import { UserProfile } from '../types/clientTypes';
import { X, ShieldCheck, User, Mail, Sparkles, ArrowRight } from 'lucide-react';
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
    <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 font-sans text-on-background">
      <div className="bg-surface rounded-xl max-w-md w-full shadow-2xl border border-outline p-6 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-outline mb-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-surface-low border border-outline flex items-center justify-center text-[#fe9800] font-bold text-sm shrink-0">
              ⚡
            </div>
            <div>
              <h2 className="text-base font-black font-mono uppercase tracking-tight text-on-background leading-tight">
                AWS Builder ID Quick Auth
              </h2>
              <p className="text-xs text-on-surface-variant font-sans mt-0.5">Instant One-Click Profile Authentication</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-on-surface-variant hover:text-on-background hover:bg-surface-container rounded-lg transition-all border border-outline cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
          <div>
            <label className="block text-xs font-bold text-on-background uppercase font-mono tracking-wider mb-1.5">
              AWS Builder ID Username / Handle
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-on-surface-variant absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={builderId}
                onChange={(e) => setBuilderId(e.target.value)}
                placeholder="e.g. builder_pawan_2026 or pawan_aws"
                className="w-full bg-surface-low border border-outline rounded-lg pl-9 pr-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary text-on-background placeholder:text-on-surface-variant font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-on-background uppercase font-mono tracking-wider mb-1.5">
              Display Name
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="e.g. Pawan Joshi"
              className="w-full bg-surface-low border border-outline rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary text-on-background placeholder:text-on-surface-variant"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-on-background uppercase font-mono tracking-wider mb-1.5">
              Notification Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-on-surface-variant absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. pawan@example.com"
                className="w-full bg-surface-low border border-outline rounded-lg pl-9 pr-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary text-on-background placeholder:text-on-surface-variant font-mono"
              />
            </div>
          </div>

          <div className="bg-surface-low border border-outline rounded-lg p-3 flex items-start gap-2 text-xs text-on-surface-variant font-sans">
            <ShieldCheck className="w-4 h-4 text-[#00d294] shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Entering your Builder ID immediately authenticates your session, syncs your custom topic preferences, and enables email alerts.
            </p>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2.5 font-mono">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-bold text-on-surface-variant hover:bg-surface-container hover:text-on-background transition-all border border-outline uppercase cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !builderId.trim()}
              className="inline-flex items-center gap-1.5 bg-primary hover:bg-primary-container text-white px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider shadow-sm transition-all active:scale-98 disabled:opacity-50 cursor-pointer"
            >
              <span>{isSubmitting ? 'Authenticating...' : 'Sign In with Builder ID'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
export default BuilderIdAuthModal;
