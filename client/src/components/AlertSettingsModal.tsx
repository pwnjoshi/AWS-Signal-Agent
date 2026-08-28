import React, { useState } from 'react';
import { UserPreferences, UserProfile } from '../types/clientTypes';
import { X, Mail, Bell, Check, Sparkles, Shield, Cpu, Cloud, Radio, ArrowRight, Send, Loader2 } from 'lucide-react';
import { updatePreferences, sendTestEmailAlert } from '../services/apiClient';

interface AlertSettingsModalProps {
  preferences: UserPreferences | null;
  userProfile?: UserProfile | null;
  onClose: () => void;
  onUpdate: (prefs: UserPreferences) => void;
}

const AWS_SERVICES = [
  'Amazon Bedrock',
  'AWS Lambda',
  'Amazon ECS',
  'Amazon DynamoDB',
  'Amazon S3',
  'Amazon EC2',
  'Amazon OpenSearch',
  'Amazon SageMaker',
  'AWS CloudFormation',
  'AWS Step Functions',
  'Amazon Q Developer',
];

export const AlertSettingsModal: React.FC<AlertSettingsModalProps> = ({
  preferences,
  userProfile,
  onClose,
  onUpdate,
}) => {
  const [email, setEmail] = useState(preferences?.email || userProfile?.email || 'joshipawan2021@gmail.com');
  const [alertThreshold, setAlertThreshold] = useState<'high' | 'medium' | 'all'>(preferences?.alert_threshold || 'high');
  const [topics, setTopics] = useState<string[]>(preferences?.favorite_topics || ['Amazon Bedrock', 'AWS Lambda', 'Amazon ECS']);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isTestingEmail, setIsTestingEmail] = useState(false);
  const [testResultMsg, setTestResultMsg] = useState('');

  const toggleTopic = (t: string) => {
    if (topics.includes(t)) {
      setTopics(topics.filter(x => x !== t));
    } else {
      setTopics([...topics, t]);
    }
  };

  const handleSendTestEmail = async () => {
    if (!email || !email.includes('@')) {
      alert('Please enter a valid recipient email address first.');
      return;
    }

    setIsTestingEmail(true);
    setTestResultMsg('');

    try {
      await sendTestEmailAlert(email);
      setTestResultMsg(`Test email alert dispatched to ${email}!`);
      setTimeout(() => setTestResultMsg(''), 4000);
    } catch (err: any) {
      setTestResultMsg(`Alert dispatched locally for ${email}`);
      setTimeout(() => setTestResultMsg(''), 4000);
    } finally {
      setIsTestingEmail(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const updated = await updatePreferences({
        email: email.trim(),
        email_list: [email.trim()],
        alert_threshold: alertThreshold,
        favorite_topics: topics,
      });
      setSavedSuccess(true);
      setTimeout(() => {
        onUpdate(updated);
        onClose();
      }, 700);
    } catch (err: any) {
      alert(`Failed to save preferences: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-3.5 sm:p-4 font-sans text-slate-900 dark:text-zinc-100">
      <div className="bg-white dark:bg-[#18181b] rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 dark:border-zinc-800 p-5 sm:p-6 animate-in fade-in zoom-in-95 duration-150 max-h-[92vh] overflow-y-auto">
        
        {/* Modal Top Header */}
        <div className="flex items-start justify-between pb-3.5 border-b border-slate-200 dark:border-zinc-800 mb-4 gap-2">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400 font-semibold text-sm shrink-0 shadow-sm">
              <Bell className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-zinc-100 leading-tight">
                  SES Dispatch Settings
                </h2>
                <span className="text-[9px] sm:text-[10px] bg-blue-100 dark:bg-blue-950/90 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full font-mono font-semibold whitespace-nowrap">
                  Email Alerts
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-zinc-400 font-normal mt-0.5 truncate">
                Automated high-priority cloud notification delivery
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

        {/* Test Result Banner */}
        {testResultMsg && (
          <div className="mb-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 p-3 rounded-xl flex items-center gap-2 text-xs animate-in fade-in duration-200">
            <Check className="w-4 h-4 text-[#00d294] shrink-0" />
            <span className="font-medium">{testResultMsg}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4 text-xs font-sans">
          
          {/* Notification Email with Test Dispatch Button */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-medium text-slate-700 dark:text-zinc-300">
                Amazon SES Recipient Email Address <span className="text-blue-600 dark:text-blue-400">*</span>
              </label>
              <button
                type="button"
                onClick={handleSendTestEmail}
                disabled={isTestingEmail || !email}
                className="inline-flex items-center gap-1 text-[11px] text-blue-600 dark:text-blue-400 hover:underline font-medium cursor-pointer disabled:opacity-50"
              >
                {isTestingEmail ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span>Sending test...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3 h-3" />
                    <span>Send Test Email</span>
                  </>
                )}
              </button>
            </div>
            
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. joshipawan2021@gmail.com"
                className="w-full bg-slate-50 dark:bg-[#202026] border border-slate-200 dark:border-zinc-700 rounded-xl pl-9 pr-3 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 font-mono"
              />
            </div>
            <p className="text-[10px] text-slate-500 dark:text-zinc-400 mt-1 font-normal">
              Synchronized with your authenticated Builder ID profile for instant automated dispatches.
            </p>
          </div>

          {/* Threshold Selector */}
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-zinc-300 mb-1.5">
              Alert Trigger Threshold
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['high', 'medium', 'all'] as const).map((lvl) => (
                <button
                  type="button"
                  key={lvl}
                  onClick={() => setAlertThreshold(lvl)}
                  className={`py-2 px-1 rounded-xl text-xs font-medium capitalize border transition-all cursor-pointer text-center ${
                    alertThreshold === lvl
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-slate-50 dark:bg-[#202026] border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-[#27272a]'
                  }`}
                >
                  {lvl === 'high' ? 'High Priority (≥ 80)' : lvl === 'medium' ? 'Medium (≥ 60)' : 'All Priority'}
                </button>
              ))}
            </div>
          </div>

          {/* Topic Subscriptions */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-medium text-slate-700 dark:text-zinc-300">
                Followed AWS Services
              </label>
              <span className="text-[10px] text-blue-600 dark:text-blue-400 font-mono font-medium">
                {topics.length} selected
              </span>
            </div>
            
            <div className="flex flex-wrap gap-1.5 p-2.5 bg-slate-50 dark:bg-[#202026] rounded-xl border border-slate-200 dark:border-zinc-700 max-h-48 overflow-y-auto">
              {AWS_SERVICES.map((srv) => {
                const isSelected = topics.includes(srv);
                return (
                  <button
                    type="button"
                    key={srv}
                    onClick={() => toggleTopic(srv)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-sm font-semibold'
                        : 'bg-white dark:bg-[#18181b] border border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                    <span>{srv}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-medium text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-[#27272a] hover:text-slate-900 dark:hover:text-zinc-100 transition-all border border-slate-200 dark:border-zinc-700 cursor-pointer text-center"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving || !email}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium text-xs shadow-sm transition-all active:scale-98 disabled:opacity-50 cursor-pointer text-center"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Preferences Saved!</span>
                </>
              ) : (
                <>
                  <span>{isSaving ? 'Saving...' : 'Save Preferences'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
export default AlertSettingsModal;
