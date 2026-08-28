import { Router } from 'express';
import { storage } from '../services/storageService';
import { getSchedulerStatus, runAgentPipeline, updateScheduleCron } from '../scheduler/agentScheduler';
import { sendSignalAlertIfNeeded } from '../services/emailAlertService';
import { generateDailyBriefing } from '../services/briefingGenerator';
import { apiSecurityGuard, rateLimiter } from '../middleware/security';
import { fetchAWSFeeds } from '../collectors/awsFeedsCollector';
import { synthesizeDoriSpeech } from '../services/pollyService';
import { askDoriQuestion } from '../services/bedrockService';

const router = Router();

// Real-time Grounded QA with Dori & Amazon Bedrock
router.post('/dori/ask', rateLimiter(60, 15 * 60 * 1000), async (req, res) => {
  try {
    const { question, history, synthesizeAudio = true } = req.body;
    if (!question || typeof question !== 'string') {
      return res.status(400).json({ error: 'question string is required' });
    }

    const signals = storage.getSignals();
    const topics = storage.getTopics();

    const { answer, relevantSignals } = await askDoriQuestion(question, signals, topics, history);

    let audioBase64: string | undefined;
    if (synthesizeAudio) {
      const pollyRes = await synthesizeDoriSpeech(answer, 'Ivy', 'neural');
      if (pollyRes) {
        audioBase64 = pollyRes.audioBase64;
      }
    }

    res.json({
      success: true,
      answer,
      relevantSignals,
      audioBase64,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Amazon Polly Generative & Neural Speech Endpoint for Dori
router.post('/dori/synthesize', rateLimiter(60, 15 * 60 * 1000), async (req, res) => {
  try {
    const { text, voiceId, engine } = req.body;
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'text string is required' });
    }
    const result = await synthesizeDoriSpeech(text, voiceId || 'Ruth', engine || 'generative');
    if (!result) {
      return res.status(500).json({ error: 'Speech synthesis failed' });
    }
    res.json({ success: true, ...result });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Decoupled Public API v1 endpoints (open for external applications to fetch AWS news)
router.get('/v1/news', rateLimiter(100, 15 * 60 * 1000), async (req, res) => {
  try {
    const { items, errors } = await fetchAWSFeeds();
    res.json({
      status: 'success',
      count: items.length,
      errors: errors.length > 0 ? errors : undefined,
      news: items,
    });
  } catch (err: any) {
    res.status(500).json({ status: 'error', error: err.message });
  }
});

router.get('/v1/signals', rateLimiter(100, 15 * 60 * 1000), (req, res) => {
  const signals = storage.getSignals();
  res.json({ status: 'success', count: signals.length, signals });
});

router.get('/v1/briefings/latest', rateLimiter(100, 15 * 60 * 1000), (req, res) => {
  let latest = storage.getLatestBriefing();
  if (!latest) {
    latest = generateDailyBriefing(storage.getSignals());
    storage.saveBriefing(latest);
  }
  res.json({ status: 'success', briefing: latest });
});

router.get('/v1/trends', rateLimiter(100, 15 * 60 * 1000), (req, res) => {
  res.json({ status: 'success', trends: storage.getTopics() });
});

// Builder ID Quick Auth & Profile Endpoints
router.post('/auth/builder-id', rateLimiter(30, 15 * 60 * 1000), (req, res) => {
  const { builder_id, display_name, email } = req.body;
  if (!builder_id) {
    return res.status(400).json({ error: 'builder_id is required' });
  }
  const profile = storage.authenticateBuilderId(builder_id, display_name, email);
  res.json({ success: true, profile });
});

router.get('/auth/profile', (req, res) => {
  res.json(storage.getActiveProfile());
});

// Security Guard Middleware across core API routes
router.use(apiSecurityGuard);

// Agent Status & Telemetry
router.get('/agent/status', rateLimiter(100, 15 * 60 * 1000), (req, res) => {
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

// Bedrock Execution Trigger
router.post('/agent/run', rateLimiter(10, 15 * 60 * 1000), async (req, res) => {
  try {
    const log = await runAgentPipeline('manual_demo');
    res.json({ success: true, log });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Signals
router.get('/signals', rateLimiter(100, 15 * 60 * 1000), (req, res) => {
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

  if (sort === 'importance') {
    signals.sort((a, b) => b.importance_score - a.importance_score);
  } else if (sort === 'relevance') {
    signals.sort((a, b) => b.relevance_score - a.relevance_score);
  } else if (sort === 'score') {
    signals.sort((a, b) => b.signal_score - a.signal_score);
  } else {
    signals.sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());
  }

  res.json({ count: signals.length, signals });
});

router.get('/signals/:id', rateLimiter(100, 15 * 60 * 1000), (req, res) => {
  const signal = storage.getSignalById(req.params.id);
  if (!signal) {
    return res.status(404).json({ error: 'Signal not found' });
  }
  res.json(signal);
});

router.post('/signals/:id/toggle-save', rateLimiter(50, 15 * 60 * 1000), (req, res) => {
  const updated = storage.toggleSaveSignal(req.params.id);
  if (!updated) {
    return res.status(404).json({ error: 'Signal not found' });
  }
  res.json(updated);
});

// Daily Briefings
router.get('/briefings', rateLimiter(100, 15 * 60 * 1000), (req, res) => {
  res.json(storage.getBriefings());
});

router.get('/briefings/latest', rateLimiter(100, 15 * 60 * 1000), (req, res) => {
  let latest = storage.getLatestBriefing();
  if (!latest) {
    const signals = storage.getSignals();
    latest = generateDailyBriefing(signals);
    storage.saveBriefing(latest);
  }
  res.json(latest);
});

// Trends
router.get('/trends', rateLimiter(100, 15 * 60 * 1000), (req, res) => {
  res.json(storage.getTopics());
});

// Services Explorer Data
router.get('/services', rateLimiter(100, 15 * 60 * 1000), (req, res) => {
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
router.get('/summary/while-you-were-away', rateLimiter(100, 15 * 60 * 1000), (req, res) => {
  const summary = storage.getWhileYouWereAwaySummary();
  res.json(summary);
});

// Preferences
router.get('/preferences', rateLimiter(100, 15 * 60 * 1000), (req, res) => {
  res.json(storage.getPreferences());
});

router.put('/preferences', rateLimiter(30, 15 * 60 * 1000), (req, res) => {
  const updated = storage.updatePreferences(req.body);
  if (updated.cron_expression) {
    updateScheduleCron(updated.cron_expression);
  }
  res.json(updated);
});

// Test Email Alert
router.post('/alerts/test', rateLimiter(5, 15 * 60 * 1000), async (req, res) => {
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
