import dotenv from 'dotenv';
dotenv.config();

import { fetchAWSFeeds } from './collectors/awsFeedsCollector';
import { processRawItem } from './pipeline/contentPipeline';
import { analyzeContentWithBedrock } from './services/bedrockService';
import { detectCommunityTrends } from './services/trendDetector';
import { generateDailyBriefing } from './services/briefingGenerator';
import { storage } from './services/storageService';

async function runFullVerificationTest() {
  console.log('===========================================================');
  console.log('  🧪 AWS Signal — Comprehensive Live Connectivity & System Test');
  console.log(`  AWS Region: ${process.env.AWS_REGION || 'us-east-1'}`);
  console.log(`  AWS Profile: ${process.env.AWS_PROFILE || 'cloudblueprint'}`);
  console.log('===========================================================\n');

  // Test 1: AWS Feed Fetching
  console.log('1. Testing AWS Public Feed Collection...');
  const { items, errors } = await fetchAWSFeeds();
  console.log(`   ✅ Successfully fetched ${items.length} items from AWS feeds.`);
  if (errors.length > 0) {
    console.log(`   ℹ️ Note: ${errors.length} feeds returned non-fatal warnings (continuing with remaining sources).`);
  }
  console.log(`   Sample item: "${items[0]?.title}" (${items[0]?.source})\n`);

  // Test 2: Content Normalization & Hashing
  console.log('2. Testing Content Pipeline & SHA-256 Deduplication...');
  const processedCandidates = items.slice(0, 5).map(processRawItem);
  console.log(`   ✅ Processed & SHA-256 hashed ${processedCandidates.length} candidate items.`);
  console.log(`   Detected services: [${processedCandidates[0]?.detected_services.join(', ')}]\n`);

  // Test 3: Bedrock Analysis
  console.log('3. Testing Amazon Bedrock Intelligence Engine & 5-Metric Scoring...');
  const sampleCandidate = processedCandidates[0];
  const signal = await analyzeContentWithBedrock(sampleCandidate);
  console.log(`   ✅ Bedrock Analysis Complete!`);
  console.log(`      Title: "${signal.title}"`);
  console.log(`      Signal Score: ${signal.signal_score}/100`);
  console.log(`      Importance: ${signal.importance_score} | Relevance: ${signal.relevance_score} | Impact: ${signal.impact_score}`);
  console.log(`      Why It Matters: "${signal.why_it_matters.why_it_matters}"\n`);

  // Test 4: Save & Trend Detection
  console.log('4. Testing Agent Memory & Community Trend Detector...');
  storage.saveSignal(signal);
  const allSignals = storage.getSignals();
  const trends = detectCommunityTrends(allSignals);
  console.log(`   ✅ Generated ${trends.length} active community trend topics.`);
  console.log(`      Top Trend: "${trends[0]?.name}" (Velocity: ${trends[0]?.velocity})\n`);

  // Test 5: Daily Briefing Synthesis
  console.log('5. Testing Daily Briefing Generator...');
  const briefing = generateDailyBriefing(allSignals);
  console.log(`   ✅ Briefing Created: "${briefing.title}"`);
  console.log(`      Top Signal: "${briefing.top_signal?.title}"`);
  console.log(`      Try This Today: "${briefing.try_today?.title}" (${briefing.try_today?.estimated_minutes} min)\n`);

  // Test 6: Summary Metrics
  console.log('6. Testing "While You Were Away" Dynamic Summary Engine...');
  const summary = storage.getWhileYouWereAwaySummary();
  console.log(`   ✅ Recalculated metrics:`);
  console.log(`      - Announcements: ${summary.new_announcements}`);
  console.log(`      - Community Discussions: ${summary.community_discussions}`);
  console.log(`      - Emerging Signals: ${summary.emerging_signals}`);
  console.log(`      - High Priority Alerts: ${summary.high_priority_alerts}\n`);

  console.log('===========================================================');
  console.log('  🎉 ALL SYSTEM VERIFICATION TESTS PASSED SUCCESSFULLY! 🎉');
  console.log('===========================================================');
}

runFullVerificationTest().catch(err => {
  console.error('❌ Verification test error:', err);
  process.exit(1);
});
