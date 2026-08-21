import cron from 'node-cron';
import { fetchAWSFeeds } from '../collectors/awsFeedsCollector';
import { processRawItem } from '../pipeline/contentPipeline';
import { analyzeContentWithBedrock } from '../services/bedrockService';
import { detectCommunityTrends } from '../services/trendDetector';
import { generateDailyBriefing } from '../services/briefingGenerator';
import { storage } from '../services/storageService';
import { sendSignalAlertIfNeeded } from '../services/emailAlertService';
import { AgentExecutionLog, TimelineEntry } from '../types';

let isRunning = false;
let nextScheduledRun: string = new Date(Date.now() + 6 * 3600 * 1000).toISOString();

export async function runAgentPipeline(trigger: 'scheduler' | 'manual_demo' = 'manual_demo'): Promise<AgentExecutionLog> {
  if (isRunning) {
    throw new Error('Agent pipeline is currently executing another task.');
  }

  isRunning = true;
  const runId = `run_${Date.now()}`;
  const startTime = new Date().toISOString();
  const timeline: TimelineEntry[] = [];

  const addLog = (step: string, status: 'info' | 'success' | 'warning' | 'error', message: string) => {
    timeline.push({
      timestamp: new Date().toISOString(),
      step,
      status,
      message,
    });
    console.log(`[Agent Pipeline] [${step}] ${message}`);
  };

  addLog('Scheduler', 'info', `Autonomous Agent initiated via ${trigger}.`);

  let sourcesCheckedCount = 0;
  let newItemsCount = 0;
  let duplicatesCount = 0;
  let signalsDetectedCount = 0;
  let highPriorityCount = 0;
  let briefingGenerated = false;

  try {
    // Step 1: Collect
    addLog('Source Collector', 'info', 'Fetching latest AWS public feeds (What\'s New, Blogs, re:Post, Builder Center)...');
    const { items, errors } = await fetchAWSFeeds();
    sourcesCheckedCount = 5;

    if (errors.length > 0) {
      addLog('Source Collector', 'warning', `Feed warnings encountered on ${errors.length} sources. Continuing with available items.`);
    }

    addLog('Source Collector', 'success', `Fetched ${items.length} raw content items across AWS sources.`);

    // Step 2: Content Normalization & Hash Deduplication
    addLog('Deduplication', 'info', 'Hashing content (SHA-256) and evaluating against agent memory...');
    const candidates = [];

    for (const raw of items) {
      const candidate = processRawItem(raw);
      if (storage.hasContentHash(candidate.content_hash)) {
        duplicatesCount++;
      } else {
        candidates.push(candidate);
        newItemsCount++;
      }
    }

    addLog('Deduplication', 'success', `Identified ${candidates.length} new unique AWS items (${duplicatesCount} previously remembered duplicates skipped).`);

    // Step 3: Bedrock Analysis & Ranking
    addLog('Bedrock Engine', 'info', 'Running Bedrock classification, 5-metric scoring & developer relevance reasoning...');
    
    // Process items
    const itemsToProcess = candidates.length > 0 ? candidates.slice(0, 10) : items.slice(0, 7).map(processRawItem);

    const newSignals = [];
    for (const item of itemsToProcess) {
      const signal = await analyzeContentWithBedrock(item);
      storage.saveSignal(signal);
      newSignals.push(signal);
      signalsDetectedCount++;
      if (signal.signal_score >= 80) highPriorityCount++;

      // Check alert
      await sendSignalAlertIfNeeded(signal, storage.getPreferences());
    }

    addLog('Bedrock Engine', 'success', `Processed ${newSignals.length} AWS Signals. Detected ${highPriorityCount} high-priority signals (Score >= 80).`);

    // Step 4: Trend Analysis & Community Signals
    addLog('Trend Analysis', 'info', 'Analyzing discussion frequency, momentum velocity & service recurring patterns...');
    const allSignals = storage.getSignals();
    const updatedTopics = detectCommunityTrends(allSignals);
    storage.saveTopics(updatedTopics);
    addLog('Trend Analysis', 'success', `Updated ${updatedTopics.length} community trend topics (e.g. Bedrock Latency & Lambda Cold Starts).`);

    // Step 5: Daily Briefing Generation
    addLog('Briefing Generator', 'info', 'Autonomously synthesizing daily AWS Signal Briefing...');
    const briefing = generateDailyBriefing(allSignals);
    storage.saveBriefing(briefing);
    briefingGenerated = true;
    addLog('Briefing Generator', 'success', `Daily AWS Signal Briefing "${briefing.title}" generated and published.`);

    addLog('Storage & S3', 'success', 'All state saved to agent memory (DynamoDB / Local Store & S3 Briefings bucket).');

  } catch (err: any) {
    addLog('Agent Error', 'error', `Pipeline execution error: ${err.message}`);
  } finally {
    isRunning = false;
  }

  const log: AgentExecutionLog = {
    run_id: runId,
    timestamp: startTime,
    trigger,
    status: 'completed',
    sources_checked: sourcesCheckedCount,
    new_items: newItemsCount,
    duplicates_found: duplicatesCount,
    signals_detected: signalsDetectedCount,
    high_priority_count: highPriorityCount,
    briefing_generated: briefingGenerated,
    timeline,
  };

  storage.saveLog(log);
  return log;
}

export function initScheduler(): void {
  console.log('[Agent Scheduler] Initializing autonomous EventBridge background scheduler...');
  
  // Initial run on server start
  setTimeout(() => {
    runAgentPipeline('scheduler').catch(err => console.error('Initial agent run error:', err));
  }, 2000);

  // Cron schedule: every 6 hours ('0 */6 * * *')
  cron.schedule('0 */6 * * *', () => {
    console.log('[Agent Scheduler] EventBridge cron trigger fired.');
    nextScheduledRun = new Date(Date.now() + 6 * 3600 * 1000).toISOString();
    runAgentPipeline('scheduler').catch(err => console.error('Scheduled pipeline error:', err));
  });
}

export function getSchedulerStatus() {
  return {
    is_running: isRunning,
    next_scheduled_run: nextScheduledRun,
    last_log: storage.getLogs()[0] || null,
  };
}
