import React, { useState } from 'react';
import { UserPreferences, ScheduleFrequency } from '../types/clientTypes';
import { X, Mail, Bell, Check, Send, Plus, Trash2, Clock, Calendar } from 'lucide-react';
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
  const [emailInput, setEmailInput] = useState('');
  const [emailList, setEmailList] = useState<string[]>(
    preferences?.email_list && preferences.email_list.length > 0
      ? preferences.email_list
      : [preferences?.email || 'pawan@example.com']
  );
  const [emailEnabled, setEmailEnabled] = useState(preferences?.email_enabled ?? true);
  const [digestFreq, setDigestFreq] = useState<'daily' | 'weekly' | 'instant_only' | 'off'>(preferences?.digest_frequency ?? 'daily');
  const [scheduleFreq, setScheduleFreq] = useState<ScheduleFrequency>(preferences?.schedule_frequency || '6h');
  const [threshold, setThreshold] = useState<'high' | 'medium' | 'all'>(preferences?.alert_threshold ?? 'high');
  const [sendingTest, setSendingTest] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  const getCronForFrequency = (freq: ScheduleFrequency): string => {
    switch (freq) {
      case '1h': return '0 */1 * * *';
      case '6h': return '0 */6 * * *';
      case '12h': return '0 */12 * * *';
      case 'daily_8am': return '0 8 * * *';
      case 'weekly_mon': return '0 8 * * 1';
      default: return '0 */6 * * *';
    }
  };

  const handleAddEmail = () => {
    const trimmed = emailInput.trim();
    if (trimmed && trimmed.includes('@') && !emailList.includes(trimmed)) {
      setEmailList([...emailList, trimmed]);
      setEmailInput('');
    }
  };

  const handleRemoveEmail = (target: string) => {
    if (emailList.length > 1) {
      setEmailList(emailList.filter(e => e !== target));
    }
  };

  const handleSave = async () => {
    try {
      const cron_expression = getCronForFrequency(scheduleFreq);
      const primaryEmail = emailList[0] || 'pawan@example.com';
      const updated = await updatePreferences({
        email: primaryEmail,
        email_list: emailList,
        email_enabled: emailEnabled,
        digest_frequency: digestFreq,
        schedule_frequency: scheduleFreq,
        cron_expression,
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
      setTestResult(`Test SES alert sent to ${emailList.length} recipient(s): [${emailList.join(', ')}]!`);
    } catch (err: any) {
      setTestResult(`Failed: ${err.message}`);
    } finally {
      setSendingTest(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 font-mono text-on-background">
      <div className="bg-surface rounded-3xl max-w-lg w-full shadow-2xl border border-outline p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-outline">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary font-bold">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black font-display uppercase tracking-tight text-on-background">
                Schedule & Alert Settings
              </h2>
              <p className="text-xs text-on-surface-variant font-sans">Configure Autonomous Agent Frequency & Email List</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-on-surface-variant hover:text-on-background hover:bg-surface-container rounded-full transition-all border border-outline cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Options Form */}
        <div className="space-y-6 text-xs text-on-surface-variant">

          {/* 1. Recipient Email List */}
          <div>
            <label className="block text-xs font-bold text-on-background uppercase tracking-wider mb-2">
              Notification Recipient Emails
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddEmail())}
                placeholder="Add email address (e.g. devops@company.com)..."
                className="flex-1 bg-surface-low border border-outline rounded-xl px-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary text-on-background placeholder:text-on-surface-variant font-medium"
              />
              <button
                type="button"
                onClick={handleAddEmail}
                className="btn-geu-primary text-white px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 uppercase cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>

            {/* Email Chips */}
            <div className="flex flex-wrap gap-2 pt-1">
              {emailList.map((addr) => (
                <span key={addr} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-surface-low text-primary border border-primary/30 text-xs font-bold">
                  <span>{addr}</span>
                  {emailList.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveEmail(addr)}
                      className="text-on-surface-variant hover:text-red-500 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </span>
              ))}
            </div>
          </div>

          {/* 2. Autonomous Agent Execution Schedule */}
          <div>
            <label className="block text-xs font-bold text-on-background uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-primary" />
              Autonomous Agent Scan Frequency
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { id: '1h', label: 'Every Hour', cron: '0 */1 * * *' },
                { id: '6h', label: 'Every 6 Hours', cron: '0 */6 * * *' },
                { id: '12h', label: 'Every 12 Hours', cron: '0 */12 * * *' },
                { id: 'daily_8am', label: 'Daily at 8:00 AM', cron: '0 8 * * *' },
                { id: 'weekly_mon', label: 'Weekly (Monday)', cron: '0 8 * * 1' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setScheduleFreq(opt.id as any)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    scheduleFreq === opt.id
                      ? 'border-primary bg-primary/15 text-primary font-bold shadow-sm'
                      : 'border-outline bg-surface-low text-on-surface-variant hover:bg-surface-container hover:text-on-background'
                  }`}
                >
                  <span className="text-xs block font-bold">{opt.label}</span>
                  <span className="text-[10px] text-on-surface-variant font-mono block mt-0.5">{opt.cron}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 3. Enable Toggle */}
          <div className="flex items-center justify-between p-4 bg-surface-low rounded-2xl border border-outline">
            <div>
              <span className="font-bold text-on-background block text-xs uppercase tracking-wide">Enable Email Alerts</span>
              <span className="text-[11px] text-on-surface-variant font-sans">Sends alerts to all emails in your list.</span>
            </div>
            <input
              type="checkbox"
              checked={emailEnabled}
              onChange={(e) => setEmailEnabled(e.target.checked)}
              className="w-5 h-5 accent-primary rounded cursor-pointer"
            />
          </div>

          {/* 4. Alert Threshold */}
          <div>
            <label className="block text-xs font-bold text-on-background uppercase tracking-wider mb-2">
              Alert Priority Threshold
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'high', label: 'High Priority', sub: 'Score >= 80' },
                { id: 'medium', label: 'Medium & Above', sub: 'Score >= 60' },
                { id: 'all', label: 'All Signals', sub: 'Every update' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setThreshold(opt.id as any)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    threshold === opt.id
                      ? 'border-primary bg-primary/15 text-primary font-bold shadow-sm'
                      : 'border-outline bg-surface-low text-on-surface-variant hover:bg-surface-container hover:text-on-background'
                  }`}
                >
                  <span className="text-xs block font-bold">{opt.label}</span>
                  <span className="text-[10px] text-on-surface-variant font-normal">{opt.sub}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Test Alert Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleSendTest}
              disabled={sendingTest}
              className="w-full flex items-center justify-center gap-2 bg-surface-low hover:bg-surface-container text-on-background border border-outline px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5 text-primary" />
              <span>{sendingTest ? 'Sending Test Alert...' : `Send Test SES Alert to ${emailList.length} Recipient(s)`}</span>
            </button>
            {testResult && (
              <p className="text-xs font-semibold text-[#00d294] mt-2 text-center">
                {testResult}
              </p>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-8 pt-4 border-t border-outline flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-on-surface-variant hover:bg-surface-container hover:text-on-background transition-all uppercase cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="btn-geu-primary text-white px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-purple-glow transition-all cursor-pointer"
          >
            Save Schedule & Preferences
          </button>
        </div>

      </div>
    </div>
  );
};
export default AlertSettingsModal;
