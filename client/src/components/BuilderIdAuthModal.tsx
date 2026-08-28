import React, { useState } from 'react';
import { 
  X, 
  KeyRound, 
  ShieldCheck, 
  ShieldAlert, 
  User, 
  Mail, 
  ArrowRight, 
  LogOut, 
  RefreshCw, 
  CheckCircle2, 
  Sparkles 
} from 'lucide-react';
import { UserProfile } from '../types/clientTypes';
import { authenticateBuilderId, signOutBuilderId } from '../services/apiClient';

interface BuilderIdAuthModalProps {
  isOpen?: boolean;
  onClose: () => void;
  currentProfile: UserProfile | null;
  onSuccess: (profile: UserProfile) => void;
}

export const BuilderIdAuthModal: React.FC<BuilderIdAuthModalProps> = ({
  isOpen = true,
  onClose,
  currentProfile,
  onSuccess,
}) => {
  const [builderId, setBuilderId] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSwitching, setIsSwitching] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!builderId.trim()) return;

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const verifiedProfile = await authenticateBuilderId(builderId, displayName, email);
      setSuccessMsg(`Welcome, ${verifiedProfile.display_name}!`);
      setTimeout(() => {
        onSuccess(verifiedProfile);
        setSuccessMsg('');
        setIsSubmitting(false);
        setIsSwitching(false);
        onClose();
      }, 700);
    } catch (err: any) {
      setErrorMsg(err.message || 'Verification failed. Please check your AWS Builder handle.');
      setIsSubmitting(false);
    }
  };

  const handleSignOut = async () => {
    setIsSubmitting(true);
    try {
      const guest = await signOutBuilderId();
      onSuccess(guest);
      setIsSubmitting(false);
      onClose();
    } catch {
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
    <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-3.5 sm:p-4 font-sans text-slate-900 dark:text-zinc-100">
      <div className="bg-white dark:bg-[#18181b] rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 dark:border-zinc-800 p-5 sm:p-6 animate-in fade-in zoom-in-95 duration-150 max-h-[92vh] overflow-y-auto">
        
        {/* Modal Top Header */}
        <div className="flex items-start justify-between pb-3.5 border-b border-slate-200 dark:border-zinc-800 mb-4 gap-2">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400 font-semibold text-sm shrink-0 shadow-sm">
              <KeyRound className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-zinc-100 leading-tight">
                  AWS Builder ID
                </h2>
                <span className="text-[9px] sm:text-[10px] bg-blue-100 dark:bg-blue-950/90 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full font-mono font-semibold whitespace-nowrap">
                  Verified Directory
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-zinc-400 font-normal mt-0.5 truncate">
                {currentProfile?.is_authenticated && !isSwitching ? 'Active Verified Session' : 'AWS Builder Center Verification'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-zinc-100 hover:bg-slate-100 dark:hover:bg-[#27272a] rounded-lg transition-all border border-slate-200 dark:border-zinc-800 cursor-pointer shrink-0"
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
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#202026] border border-slate-200 dark:border-zinc-700 space-y-3 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-blue-600 text-white font-bold text-base flex items-center justify-center shadow-sm">
                  {(currentProfile.display_name || currentProfile.builder_id).charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100 truncate">
                    {currentProfile.display_name}
                  </h3>
                  <p className="text-xs font-mono text-blue-600 dark:text-blue-400 font-medium flex items-center gap-1 mt-0.5 truncate">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00d294] shrink-0" />
                    <span className="truncate">{currentProfile.builder_id}</span>
                  </p>
                </div>
              </div>

              <div className="pt-2.5 border-t border-slate-200 dark:border-zinc-700/80 space-y-2 text-slate-600 dark:text-zinc-400 text-xs">
                <div className="flex items-center justify-between gap-2">
                  <span>Notification Email:</span>
                  <strong className="text-slate-900 dark:text-zinc-200 font-medium truncate max-w-[180px]">{currentProfile.email || 'None configured'}</strong>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span>Directory Status:</span>
                  <span className="text-[#00d294] font-medium flex items-center gap-1 shrink-0">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verified
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-2.5 pt-2">
              <button
                type="button"
                onClick={handleSignOut}
                disabled={isSubmitting}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 border border-red-200 dark:border-red-800 transition-all cursor-pointer disabled:opacity-50"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Signing out...' : 'Sign out'}</span>
              </button>

              <div className="w-full sm:w-auto flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsSwitching(true);
                    setErrorMsg('');
                  }}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-[#202026] border border-slate-200 dark:border-zinc-700 transition-all cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Switch</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 sm:flex-none px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-medium shadow-sm transition-all cursor-pointer text-center"
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
              <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 p-3 rounded-xl flex items-start gap-2 animate-in fade-in duration-200">
                <ShieldAlert className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-xs">Verification Error</p>
                  <p className="text-[11px] mt-0.5 leading-relaxed">{errorMsg}</p>
                </div>
              </div>
            )}

            {/* Handle Input */}
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-zinc-300 mb-1.5">
                AWS Builder ID Handle <span className="text-blue-600 dark:text-blue-400">*</span>
              </label>
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
                  placeholder="e.g. builder_srijana_2026"
                  className="w-full bg-slate-50 dark:bg-[#202026] border border-slate-200 dark:border-zinc-700 rounded-xl pl-9 pr-3 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 font-mono"
                />
              </div>
              <p className="text-[10px] text-slate-500 dark:text-zinc-400 mt-1 font-normal">
                Must be registered in the AWS Builder Center directory.
              </p>
            </div>

            {/* Optional Display Name */}
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-zinc-300 mb-1.5">
                Display Name (Optional)
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="e.g. Srijana"
                className="w-full bg-slate-50 dark:bg-[#202026] border border-slate-200 dark:border-zinc-700 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900 dark:text-zinc-100 placeholder:text-slate-400"
              />
            </div>

            {/* Optional Notification Email */}
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
                  className="w-full bg-slate-50 dark:bg-[#202026] border border-slate-200 dark:border-zinc-700 rounded-xl pl-9 pr-3 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 font-mono"
                />
              </div>
            </div>

            {/* Directory Guarantee Note */}
            <div className="bg-slate-50 dark:bg-[#202026] border border-slate-200 dark:border-zinc-700 rounded-xl p-3 flex items-start gap-2.5 text-xs text-slate-600 dark:text-zinc-400 font-sans shadow-sm">
              <ShieldCheck className="w-4 h-4 text-[#00d294] shrink-0 mt-0.5" />
              <p className="leading-relaxed font-normal text-[11px]">
                Your handle is verified in real-time against the AWS Builder Center directory to isolate your personal bookmark vault and custom alerts.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5">
              {currentProfile?.is_authenticated && (
                <button
                  type="button"
                  onClick={() => {
                    setIsSwitching(false);
                    setErrorMsg('');
                  }}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-medium text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-[#27272a] transition-all cursor-pointer text-center"
                >
                  Back
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-medium text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-[#27272a] hover:text-slate-900 dark:hover:text-zinc-100 transition-all border border-slate-200 dark:border-zinc-700 cursor-pointer text-center"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !builderId.trim()}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium text-xs shadow-sm transition-all active:scale-98 disabled:opacity-50 cursor-pointer text-center"
              >
                <span>{isSubmitting ? 'Verifying...' : 'Verify & Sign In'}</span>
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
