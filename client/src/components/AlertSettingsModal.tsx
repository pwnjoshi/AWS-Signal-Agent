import React, { useState } from 'react';
import { UserPreferences } from '../types/clientTypes';
import { X, Mail, Bell, Check, Send, ShieldCheck, Sparkles } from 'lucide-react';
import { sendTestEmailAlert, updatePreferences } from '../services/apiClient';

interface AlertSettingsModalProps {
  preferences: UserPreferences | null;
  onClose: () => void;
  onUpdate: (updated: UserPreferences) => void;
}

export const AlertSettingsModal: React.FC<AlertSettingsModalProps> = ({
  preferences,
  onClose,
  onUpdate,
}) => {
  const [emailEnabled, setEmailEnabled] = useState(preferences?.email_enabled ?? true);
  const [email, setEmail] = useState(preferences?.email ?? 'pawan@example.com');
  const [digestFreq, setDigestFreq] = useState<'daily' | 'weekly' | 'instant_only' | 'off'>(preferences?.digest_frequency ?? 'daily');
  const [threshold, setThreshold] = useState<'high' | 'medium' | 'all'>(preferences?.alert_threshold ?? 'high');
  const [sendingTest, setSendingTest] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  const handleSave = async () => {
    try {
      const updated = await updatePreferences({
        email,
        email_enabled: emailEnabled,
        digest_frequency: digestFreq,
        alert_threshold: threshold,
      });
      onUpdate(updated);
      onClose();
    } catch (err: any) {
      alert(`Error updating preferences: ${err.message}`);
    }
  };

  const handleSendTest = async () => {
    setSendingTest(true);
    setTestResult(null);
    try {
      const res = await sendTestEmailAlert();
      setTestResult(`Test SES alert dispatched to ${email}! Check console/inbox logs.`);
    } catch (err: any) {
      setTestResult(`Failed: ${err.message}`);
    } finally {
      setSendingTest(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 leading-tight">
                Alert Preferences
              </h2>
              <p className="text-xs text-slate-400">Configure Amazon SES & Autonomous Digest Alerts</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Options Form */}
        <div className="space-y-5 text-sm text-slate-700">
          
          {/* Email Address */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Notification Email (SES Destination)
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            />
          </div>

          {/* Enable Toggle */}
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <div>
              <span className="font-bold text-slate-900 block text-sm">Enable Autonomous Email Alerts</span>
              <span className="text-xs text-slate-500">Only genuine high-priority signals will trigger an email.</span>
            </div>
            <input
              type="checkbox"
              checked={emailEnabled}
              onChange={(e) => setEmailEnabled(e.target.checked)}
              className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
            />
          </div>

          {/* Alert Threshold */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Alert Trigger Threshold
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'high', label: 'High Priority Only', sub: 'Score >= 80' },
                { id: 'medium', label: 'Medium & Above', sub: 'Score >= 60' },
                { id: 'all', label: 'All Signals', sub: 'Every update' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setThreshold(opt.id as any)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    threshold === opt.id
                      ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold shadow-sm'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-xs block font-bold">{opt.label}</span>
                  <span className="text-[10px] text-slate-400 font-normal">{opt.sub}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Digest Frequency */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Daily Digest Frequency
            </label>
            <select
              value={digestFreq}
              onChange={(e) => setDigestFreq(e.target.value as any)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            >
              <option value="daily">Every Morning (Daily Briefing Digest)</option>
              <option value="weekly">Weekly Summary</option>
              <option value="instant_only">Instant High-Priority Alerts Only</option>
              <option value="off">Disabled</option>
            </select>
          </div>

          {/* Test Alert Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleSendTest}
              disabled={sendingTest}
              className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-bold text-xs transition-all disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{sendingTest ? 'Sending Test Alert...' : 'Send Test SES Email Alert'}</span>
            </button>
            {testResult && (
              <p className="text-xs font-semibold text-emerald-600 mt-2 text-center">
                {testResult}
              </p>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md shadow-blue-500/20 transition-all"
          >
            Save Preferences
          </button>
        </div>

      </div>
    </div>
  );
};
