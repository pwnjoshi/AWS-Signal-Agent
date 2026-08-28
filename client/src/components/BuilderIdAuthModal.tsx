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
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-bold shadow-md shadow-amber-500/20">
              ⚡
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 font-rounded">
                AWS Builder ID Quick Auth
              </h2>
              <p className="text-xs text-slate-400">Instant One-Click Profile Authentication</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              AWS Builder ID Username / Handle
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={builderId}
                onChange={(e) => setBuilderId(e.target.value)}
                placeholder="e.g. builder_pawan_2026 or pawan_aws"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Display Name
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="e.g. Pawan Joshi"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Notification Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. pawan@builder.aws"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
              />
            </div>
          </div>

          <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-3.5 flex items-start gap-2.5 text-xs text-amber-950">
            <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p>
              Entering your Builder ID immediately authenticates your session, syncs your custom topic preferences, and enables email alerts.
            </p>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !builderId.trim()}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md shadow-amber-500/20 transition-all disabled:opacity-50"
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
