import { Router } from 'express';
import { storage } from '../services/storageService';
import { getSchedulerStatus, runAgentPipeline, updateScheduleCron } from '../scheduler/agentScheduler';
import { sendSignalAlertIfNeeded } from '../services/emailAlertService';

const router = Router();

// Agent Status & Telemetry
router.get('/agent/status', (req, res) => {
  const status = getSchedulerStatus();
  const logs = storage.getLogs();
  res.json({
    status: 'ONLINE',
    is_running: status.is_running,
    cron_expression: status.cron_expression,
    next_scheduled_run: status.next_scheduled_run,
    latest_run: status.last_log,
    execution_history: logs,
  });
});

router.post('/agent/run', async (req, res) => {
  try {
    const log = await runAgentPipeline('manual_demo');
    res.json({ success: true, log });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Signals
router.get('/signals', (req, res) => {
  const { search, service, category, minImportance, source, sort, savedOnly } = req.query;
  let signals = storage.getSignals();

  if (search) {
    const q = (search as string).toLowerCase();
    signals = signals.filter(
      s => s.title.toLowerCase().includes(q) || s.summary.toLowerCase().includes(q) || s.aws_services.some(srv => srv.toLowerCase().includes(q))
    );
  }

  if (service) {
    signals = signals.filter(s => s.aws_services.includes(service as string));
  }

  if (category) {
    signals = signals.filter(s => s.category === category);
  }

  if (source) {
    signals = signals.filter(s => s.source === source);
  }

  if (minImportance) {
    const min = parseInt(minImportance as string, 10);
    signals = signals.filter(s => s.importance_score >= min);
  }

  if (savedOnly === 'true') {
    signals = signals.filter(s => s.is_saved);
  }

  // Sorting
  if (sort === 'importance') {
    signals.sort((a, b) => b.importance_score - a.importance_score);
  } else if (sort === 'relevance') {
    signals.sort((a, b) => b.relevance_score - a.relevance_score);
  } else if (sort === 'score') {
    signals.sort((a, b) => b.signal_score - a.signal_score);
  } else {
    // default newest
    signals.sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());
  }

  res.json({ count: signals.length, signals });
});

router.get('/signals/:id', (req, res) => {
  const signal = storage.getSignalById(req.params.id);
  if (!signal) {
    return res.status(404).json({ error: 'Signal not found' });
  }
  res.json(signal);
});

router.post('/signals/:id/toggle-save', (req, res) => {
  const updated = storage.toggleSaveSignal(req.params.id);
  if (!updated) {
    return res.status(404).json({ error: 'Signal not found' });
  }
  res.json(updated);
});

// Daily Briefings
router.get('/briefings', (req, res) => {
  res.json(storage.getBriefings());
});

router.get('/briefings/latest', (req, res) => {
  const latest = storage.getLatestBriefing();
  if (!latest) {
    return res.status(404).json({ error: 'No briefings generated yet' });
  }
  res.json(latest);
});

// Trends
router.get('/trends', (req, res) => {
  res.json(storage.getTopics());
});

// Services Explorer Data
router.get('/services', (req, res) => {
  const signals = storage.getSignals();
  const serviceCounts: Record<string, { count: number; signals: any[]; avgScore: number }> = {};

  for (const sig of signals) {
    for (const srv of sig.aws_services) {
      if (!serviceCounts[srv]) {
        serviceCounts[srv] = { count: 0, signals: [], avgScore: 0 };
      }
      serviceCounts[srv].count++;
      serviceCounts[srv].signals.push(sig);
    }
  }

  const result = Object.entries(serviceCounts).map(([name, data]) => {
    const totalScore = data.signals.reduce((acc, curr) => acc + curr.signal_score, 0);
    return {
      service_name: name,
      signal_count: data.count,
      avg_signal_score: Math.round(totalScore / data.count),
      recent_signals: data.signals.slice(0, 5),
    };
  }).sort((a, b) => b.signal_count - a.signal_count);

  res.json(result);
});

// "While You Were Away" summary
router.get('/summary/while-you-were-away', (req, res) => {
  const summary = storage.getWhileYouWereAwaySummary();
  res.json(summary);
});

// Preferences
router.get('/preferences', (req, res) => {
  res.json(storage.getPreferences());
});

router.put('/preferences', (req, res) => {
  const updated = storage.updatePreferences(req.body);
  if (updated.cron_expression) {
    updateScheduleCron(updated.cron_expression);
  }
  res.json(updated);
});

// Test Email Alert
router.post('/alerts/test', async (req, res) => {
  const signals = storage.getSignals();
  const targetSignal = signals[0];
  const prefs = storage.getPreferences();

  if (!targetSignal) {
    return res.status(400).json({ error: 'No signals available for test alert' });
  }

  const result = await sendSignalAlertIfNeeded(targetSignal, prefs);
  res.json({ success: true, result });
});

export default router;
