import React, { useState } from 'react';
import { UserPreferences } from '../types/clientTypes';
import { X, Mail, Bell, Check, Sparkles, Shield, Cpu, Cloud, Radio } from 'lucide-react';
import { updatePreferences } from '../services/apiClient';

interface AlertSettingsModalProps {
  preferences: UserPreferences | null;
  onClose: () => void;
  onUpdate: (prefs: UserPreferences) => void;
}

const AWS_SERVICES = [
  'Amazon Bedrock',
  'AWS Lambda',
  'Amazon ECS',
  'Amazon DynamoDB',
  'Amazon S3',
  'Amazon OpenSearch',
  'Amazon SageMaker',
  'AWS CloudFormation',
  'AWS Step Functions',
  'Amazon Q Developer',
];

export const AlertSettingsModal: React.FC<AlertSettingsModalProps> = ({
  preferences,
  onClose,
  onUpdate,
}) => {
  const [email, setEmail] = useState(preferences?.email || '');
  const [alertThreshold, setAlertThreshold] = useState<'high' | 'medium' | 'all'>(preferences?.alert_threshold || 'high');
  const [topics, setTopics] = useState<string[]>(preferences?.favorite_topics || ['Amazon Bedrock', 'AWS Lambda']);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const toggleTopic = (t: string) => {
    if (topics.includes(t)) {
      setTopics(topics.filter(x => x !== t));
    } else {
      setTopics([...topics, t]);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const updated = await updatePreferences({
        email,
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
    <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 font-sans text-slate-900 dark:text-zinc-100">
      <div className="bg-white dark:bg-[#18181b] rounded-xl max-w-lg w-full shadow-2xl border border-slate-200 dark:border-zinc-800 p-6 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-zinc-800 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold shrink-0">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-black font-mono uppercase tracking-tight text-slate-900 dark:text-zinc-100 leading-tight">
                SES Intelligence Dispatch Settings
              </h2>
              <p className="text-xs text-slate-600 dark:text-zinc-400 font-sans mt-0.5">Automated High-Priority Notification Delivery</p>
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

        <form onSubmit={handleSave} className="space-y-4 text-xs font-sans">
          
          {/* Notification Email */}
          <div>
            <label className="block text-xs font-bold text-slate-900 dark:text-zinc-100 uppercase font-mono tracking-wider mb-1.5">
              Amazon SES Recipient Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@organization.com"
                className="w-full bg-slate-50 dark:bg-[#202026] border border-slate-200 dark:border-zinc-700 rounded-lg pl-9 pr-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 font-mono"
              />
            </div>
          </div>

          {/* Threshold Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-900 dark:text-zinc-100 uppercase font-mono tracking-wider mb-1.5">
              Alert Trigger Threshold
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['high', 'medium', 'all'] as const).map((lvl) => (
                <button
                  type="button"
                  key={lvl}
                  onClick={() => setAlertThreshold(lvl)}
                  className={`py-2 rounded-lg text-xs font-mono font-bold capitalize border transition-all ${
                    alertThreshold === lvl
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-slate-50 dark:bg-[#202026] border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-300'
                  }`}
                >
                  {lvl} Priority
                </button>
              ))}
            </div>
          </div>

          {/* Topic Subscriptions */}
          <div>
            <label className="block text-xs font-bold text-slate-900 dark:text-zinc-100 uppercase font-mono tracking-wider mb-2">
              Followed AWS Services & Stack Priorities ({topics.length} Selected)
            </label>
            <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto p-2 bg-slate-50 dark:bg-[#202026] rounded-lg border border-slate-200 dark:border-zinc-700">
              {AWS_SERVICES.map((srv) => {
                const isSelected = topics.includes(srv);
                return (
                  <button
                    type="button"
                    key={srv}
                    onClick={() => toggleTopic(srv)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold font-mono transition-all flex items-center gap-1 cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-white dark:bg-[#18181b] border border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 text-white" />}
                    <span>{srv}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-200 dark:border-zinc-800 flex items-center justify-end gap-2.5 font-mono">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-bold text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-[#27272a] hover:text-slate-900 dark:hover:text-zinc-100 transition-all border border-slate-200 dark:border-zinc-700 uppercase cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving || !email}
              className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider shadow-sm transition-all active:scale-98 disabled:opacity-50 cursor-pointer"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Saved!</span>
                </>
              ) : (
                <span>{isSaving ? 'Saving...' : 'Save Preferences'}</span>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
export default AlertSettingsModal;
