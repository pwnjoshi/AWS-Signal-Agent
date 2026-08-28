import React, { useState } from 'react';
import { UserProfile } from '../types/clientTypes';
import { X, ShieldCheck, User, Mail, ArrowRight, CheckCircle2, LogOut, RefreshCw, KeyRound, AlertTriangle, ShieldAlert } from 'lucide-react';
import { authenticateBuilderId, signOutBuilderId } from '../services/apiClient';

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
  const [isSwitching, setIsSwitching] = useState<boolean>(!currentProfile?.is_authenticated);
  const [builderId, setBuilderId] = useState(currentProfile?.builder_id && currentProfile.builder_id !== 'guest' ? currentProfile.builder_id : '');
  const [displayName, setDisplayName] = useState(currentProfile?.display_name && currentProfile.display_name !== 'Guest Builder' ? currentProfile.display_name : '');
  const [email, setEmail] = useState(currentProfile?.email || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!builderId.trim()) return;

    setErrorMsg('');
    setIsSubmitting(true);
    try {
      const profile = await authenticateBuilderId(builderId.trim(), displayName.trim(), email.trim());
      setSuccessMsg(`Verified with AWS Builder Center: Welcome, ${profile.display_name || profile.builder_id}!`);
      setTimeout(() => {
        onSuccess(profile);
        onClose();
      }, 600);
    } catch (err: any) {
      setErrorMsg(err.message || 'AWS Builder Center verification failed.');
      setIsSubmitting(false);
    }
  };

  const handleSignOut = async () => {
    setIsSubmitting(true);
    try {
      const guestProfile = await signOutBuilderId();
      setSuccessMsg('Signed out successfully. Session reset to guest.');
      setTimeout(() => {
        onSuccess(guestProfile);
        onClose();
      }, 400);
    } catch (err: any) {
      console.error('Sign out error:', err);
      const fallbackGuest: UserProfile = {
        builder_id: 'guest',
        display_name: 'Guest Builder',
        email: '',
        email_list: [],
        is_authenticated: false,
        logged_in_at: new Date().toISOString(),
      };
      onSuccess(fallbackGuest);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 font-sans text-slate-900 dark:text-zinc-100">
      <div className="bg-white dark:bg-[#18181b] rounded-xl max-w-md w-full shadow-2xl border border-slate-200 dark:border-zinc-800 p-6 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-zinc-800 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400 font-semibold text-sm shrink-0">
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900 dark:text-zinc-100 leading-tight flex items-center gap-1.5">
                <span>AWS Builder ID</span>
                <span className="text-[10px] bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 px-1.5 py-0.2 rounded font-mono font-bold">
                  Verified Directory
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-zinc-400 font-normal mt-0.5">
                {currentProfile?.is_authenticated && !isSwitching ? 'Active Verified Session' : 'AWS Builder Center Verification'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-zinc-100 hover:bg-slate-100 dark:hover:bg-[#27272a] rounded-lg transition-all border border-slate-200 dark:border-zinc-800 cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Success Transition */}
        {successMsg ? (
          <div className="py-8 text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-[#00d294] mx-auto animate-bounce" />
            <h3 className="text-base font-semibold text-slate-900 dark:text-zinc-100">{successMsg}</h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400">Loading your verified profile and bookmark vault...</p>
          </div>
        ) : currentProfile?.is_authenticated && !isSwitching ? (
          /* Active Authenticated Profile View */
          <div className="space-y-4 text-xs font-sans">
            <div className="p-4 rounded-lg bg-slate-50 dark:bg-[#202026] border border-slate-200 dark:border-zinc-700 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold text-sm flex items-center justify-center">
                  {(currentProfile.display_name || currentProfile.builder_id).charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-zinc-100">
                    {currentProfile.display_name}
                  </h3>
                  <p className="text-xs font-mono text-blue-600 dark:text-blue-400 font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00d294]" />
                    {currentProfile.builder_id}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-zinc-700/80 space-y-1.5 text-slate-600 dark:text-zinc-400">
                <div className="flex justify-between">
                  <span>Notification Email:</span>
                  <strong className="text-slate-900 dark:text-zinc-200 font-medium">{currentProfile.email || 'None configured'}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Directory Status:</span>
                  <span className="text-[#00d294] font-medium flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    AWS Builder Center Verified
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={handleSignOut}
                disabled={isSubmitting}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 border border-red-200 dark:border-red-800 transition-all cursor-pointer disabled:opacity-50"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Signing out...' : 'Sign out'}</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsSwitching(true);
                    setErrorMsg('');
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-[#202026] border border-slate-200 dark:border-zinc-700 transition-all cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Switch account</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium shadow-sm transition-all cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Sign-In / Switch Form */
          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
            
            {/* Error Banner */}
            {errorMsg && (
              <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 p-3 rounded-lg flex items-start gap-2 animate-in fade-in duration-200">
                <ShieldAlert className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold text-xs">Verification Error</p>
                  <p className="text-[11px] mt-0.5 leading-relaxed">{errorMsg}</p>
                </div>
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-medium text-slate-700 dark:text-zinc-300">
                  AWS Builder ID Handle
                </label>
                <span className="text-[10px] text-slate-500 dark:text-zinc-400">Must be registered in AWS Builder Center</span>
              </div>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={builderId}
                  onChange={(e) => {
                    setBuilderId(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  placeholder="e.g. builder_srijana_2026 or srijana_aws"
                  className="w-full bg-slate-50 dark:bg-[#202026] border border-slate-200 dark:border-zinc-700 rounded-lg pl-9 pr-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-zinc-300 mb-1.5">
                Display Name (Optional)
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="e.g. Srijana"
                className="w-full bg-slate-50 dark:bg-[#202026] border border-slate-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900 dark:text-zinc-100 placeholder:text-slate-400"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-zinc-300 mb-1.5">
                Notification Email (Optional)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. srijana@example.com"
                  className="w-full bg-slate-50 dark:bg-[#202026] border border-slate-200 dark:border-zinc-700 rounded-lg pl-9 pr-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 font-mono"
                />
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-[#202026] border border-slate-200 dark:border-zinc-700 rounded-lg p-3 flex items-start gap-2 text-xs text-slate-600 dark:text-zinc-400 font-sans">
              <ShieldCheck className="w-4 h-4 text-[#00d294] shrink-0 mt-0.5" />
              <p className="leading-relaxed font-normal">
                Your handle is verified in real-time against the AWS Builder Center directory. Only verified AWS Builder IDs are granted access to isolate personal vaults and custom alerts.
              </p>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2.5">
              {currentProfile?.is_authenticated && (
                <button
                  type="button"
                  onClick={() => {
                    setIsSwitching(false);
                    setErrorMsg('');
                  }}
                  className="px-3.5 py-2 rounded-lg text-xs font-medium text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-[#27272a] transition-all cursor-pointer"
                >
                  Back
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-xs font-medium text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-[#27272a] hover:text-slate-900 dark:hover:text-zinc-100 transition-all border border-slate-200 dark:border-zinc-700 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !builderId.trim()}
                className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-xs shadow-sm transition-all active:scale-98 disabled:opacity-50 cursor-pointer"
              >
                <span>{isSubmitting ? 'Verifying with AWS Builder Center...' : 'Verify & Sign In'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
export default BuilderIdAuthModal;
