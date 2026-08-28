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
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 font-mono text-zinc-100">
      <div className="bg-[#121216] rounded-3xl max-w-lg w-full shadow-2xl border border-[#27272a] p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-[#27272a]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#AD5CFF]/15 border border-[#AD5CFF]/30 flex items-center justify-center text-[#AD5CFF] font-bold">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black font-display uppercase tracking-tight text-white">
                Schedule & Alert Settings
              </h2>
              <p className="text-xs text-zinc-400 font-sans">Configure Autonomous Agent Frequency & Email List</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white hover:bg-[#18181b] rounded-full transition-all border border-[#27272a]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Options Form */}
        <div className="space-y-6 text-xs text-zinc-300">

          {/* 1. Recipient Email List */}
          <div>
            <label className="block text-xs font-bold text-white uppercase tracking-wider mb-2">
              Notification Recipient Emails
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddEmail())}
                placeholder="Add email address (e.g. devops@company.com)..."
                className="flex-1 bg-[#18181b] border border-[#27272a] rounded-xl px-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#AD5CFF] text-zinc-100 placeholder:text-zinc-500 font-medium"
              />
              <button
                type="button"
                onClick={handleAddEmail}
                className="bg-[#AD5CFF] hover:bg-[#9C47FF] text-white px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 uppercase"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>

            {/* Email Chips */}
            <div className="flex flex-wrap gap-2 pt-1">
              {emailList.map((addr) => (
                <span key={addr} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#09090b] text-[#AD5CFF] border border-[#AD5CFF]/30 text-xs font-bold">
                  <span>{addr}</span>
                  {emailList.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveEmail(addr)}
                      className="text-zinc-400 hover:text-red-400 transition-colors"
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
            <label className="block text-xs font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#AD5CFF]" />
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
                      ? 'border-[#AD5CFF] bg-[#AD5CFF]/15 text-white font-bold shadow-purple-glow'
                      : 'border-[#27272a] bg-[#09090b] text-zinc-400 hover:bg-[#18181b] hover:text-zinc-200'
                  }`}
                >
                  <span className="text-xs block font-bold">{opt.label}</span>
                  <span className="text-[10px] text-zinc-500 font-mono block mt-0.5">{opt.cron}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 3. Enable Toggle */}
          <div className="flex items-center justify-between p-4 bg-[#09090b] rounded-2xl border border-[#27272a]">
            <div>
              <span className="font-bold text-white block text-xs uppercase tracking-wide">Enable Email Alerts</span>
              <span className="text-[11px] text-zinc-400 font-sans">Sends alerts to all emails in your list.</span>
            </div>
            <input
              type="checkbox"
              checked={emailEnabled}
              onChange={(e) => setEmailEnabled(e.target.checked)}
              className="w-5 h-5 accent-[#AD5CFF] rounded cursor-pointer"
            />
          </div>

          {/* 4. Alert Threshold */}
          <div>
            <label className="block text-xs font-bold text-white uppercase tracking-wider mb-2">
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
                      ? 'border-[#AD5CFF] bg-[#AD5CFF]/15 text-white font-bold shadow-purple-glow'
                      : 'border-[#27272a] bg-[#09090b] text-zinc-400 hover:bg-[#18181b] hover:text-zinc-200'
                  }`}
                >
                  <span className="text-xs block font-bold">{opt.label}</span>
                  <span className="text-[10px] text-zinc-500 font-normal">{opt.sub}</span>
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
              className="w-full flex items-center justify-center gap-2 bg-[#18181b] hover:bg-[#27272a] text-zinc-200 border border-[#27272a] px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5 text-[#AD5CFF]" />
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
        <div className="mt-8 pt-4 border-t border-[#27272a] flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-zinc-400 hover:bg-[#18181b] hover:text-white transition-all uppercase"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-[#AD5CFF] hover:bg-[#9C47FF] text-white px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-purple-glow transition-all"
          >
            Save Schedule & Preferences
          </button>
        </div>

      </div>
    </div>
  );
};
export default AlertSettingsModal;
