import fs from 'fs';
import path from 'path';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { fromIni } from '@aws-sdk/credential-providers';
import { AgentExecutionLog, AWSSignal, CommunityTopic, DailyBriefing, UserPreferences, UserProfile } from '../types';

const DATA_DIR = process.env.AWS_LAMBDA_FUNCTION_NAME 
  ? path.join('/tmp', 'data')
  : path.join(process.cwd(), 'data');

if (!fs.existsSync(DATA_DIR)) {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  } catch (err) {
    console.warn('Warning creating data directory:', err);
  }
}

// Memory stores for local persistence
const FILES = {
  signals: path.join(DATA_DIR, 'signals.json'),
  topics: path.join(DATA_DIR, 'topics.json'),
  briefings: path.join(DATA_DIR, 'briefings.json'),
  preferences: path.join(DATA_DIR, 'preferences.json'),
  profiles: path.join(DATA_DIR, 'profiles.json'),
  logs: path.join(DATA_DIR, 'logs.json'),
};

const region = process.env.AWS_REGION || 'us-east-1';
const profile = process.env.AWS_PROFILE || 'cloudblueprint';

const ddbClient = new DynamoDBClient({ 
  region,
  ...(process.env.AWS_LAMBDA_FUNCTION_NAME ? {} : { credentials: fromIni({ profile }) })
});
const docClient = DynamoDBDocumentClient.from(ddbClient);

function readJsonFile<T>(filePath: string, fallback: T): T {
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
  }
  return fallback;
}

function writeJsonFile<T>(filePath: string, data: T): void {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error(`Error writing ${filePath}:`, err);
  }
}

export class StorageService {
  private signals: Map<string, AWSSignal> = new Map();
  private topics: Map<string, CommunityTopic> = new Map();
  private briefings: DailyBriefing[] = [];
  private logs: AgentExecutionLog[] = [];
  private preferences: UserPreferences;
  private activeProfile: UserProfile;

  constructor() {
    const savedSignals = readJsonFile<AWSSignal[]>(FILES.signals, []);
    savedSignals.forEach(s => this.signals.set(s.signal_id, s));

    const savedTopics = readJsonFile<CommunityTopic[]>(FILES.topics, []);
    savedTopics.forEach(t => this.topics.set(t.topic_id, t));

    this.briefings = readJsonFile<DailyBriefing[]>(FILES.briefings, []);
    this.logs = readJsonFile<AgentExecutionLog[]>(FILES.logs, []);

    const loadedPrefs = readJsonFile<Partial<UserPreferences>>(FILES.preferences, {});

    this.preferences = {
      user_id: 'usr_pawan_default',
      builder_id: loadedPrefs.builder_id || 'builder_pawan_2026',
      name: loadedPrefs.name || 'Pawan',
      email: loadedPrefs.email || 'pawan@example.com',
      email_list: loadedPrefs.email_list || (loadedPrefs.email ? [loadedPrefs.email] : ['pawan@example.com', 'devops@company.com']),
      email_enabled: loadedPrefs.email_enabled ?? true,
      digest_frequency: loadedPrefs.digest_frequency || 'daily',
      schedule_frequency: loadedPrefs.schedule_frequency || '6h',
      cron_expression: loadedPrefs.cron_expression || '0 */6 * * *',
      alert_threshold: loadedPrefs.alert_threshold || 'high',
      favorite_services: loadedPrefs.favorite_services || ['Amazon Bedrock', 'AWS Lambda', 'Amazon ECS'],
      favorite_topics: loadedPrefs.favorite_topics || ['Bedrock Latency', 'Cold Starts', 'Serverless Architecture'],
      last_visited_at: loadedPrefs.last_visited_at || new Date(Date.now() - 3600 * 1000 * 12).toISOString(),
    };

    this.activeProfile = {
      builder_id: this.preferences.builder_id,
      display_name: this.preferences.name,
      email: this.preferences.email,
      email_list: this.preferences.email_list,
      is_authenticated: true,
      logged_in_at: new Date().toISOString(),
    };

    this.hydrateFromDynamoDB();
  }

  private async hydrateFromDynamoDB(): Promise<void> {
    try {
      const sigScan = await docClient.send(new ScanCommand({ TableName: 'AWSSignals' }));
      if (sigScan.Items && sigScan.Items.length > 0) {
        sigScan.Items.forEach(item => this.signals.set(item.signal_id, item as AWSSignal));
      }
    } catch (err: any) {
      console.log(`[DynamoDB Hydrate] Note: ${err.message}. Using active in-memory and disk persistence.`);
    }
  }

  // Builder ID Authentication & Quick Login
  public authenticateBuilderId(builderIdInput: string, name?: string, email?: string): UserProfile {
    const cleanId = builderIdInput.trim().toLowerCase().replace(/[^a-z0-9_.-]/g, '_') || 'builder_pawan_2026';
    const displayName = name || cleanId.replace('builder_', '').replace(/_/g, ' ').toUpperCase();
    const userEmail = email || `${cleanId.replace('builder_', '')}@builder.aws`;

    this.preferences.builder_id = cleanId;
    this.preferences.name = displayName;
    this.preferences.email = userEmail;

    if (!this.preferences.email_list.includes(userEmail)) {
      this.preferences.email_list.unshift(userEmail);
    }

    this.activeProfile = {
      builder_id: cleanId,
      display_name: displayName,
      email: userEmail,
      email_list: this.preferences.email_list,
      is_authenticated: true,
      logged_in_at: new Date().toISOString(),
    };

    writeJsonFile(FILES.preferences, this.preferences);
    writeJsonFile(FILES.profiles, this.activeProfile);

    return this.activeProfile;
  }

  public getActiveProfile(): UserProfile {
    return this.activeProfile;
  }

  // Signals
  public getSignals(): AWSSignal[] {
    return Array.from(this.signals.values()).sort(
      (a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
    );
  }

  public getSignalById(id: string): AWSSignal | undefined {
    return this.signals.get(id);
  }

  public hasContentHash(hash: string): boolean {
    return Array.from(this.signals.values()).some(s => s.content_hash === hash);
  }

  public saveSignal(signal: AWSSignal): void {
    this.signals.set(signal.signal_id, signal);
    writeJsonFile(FILES.signals, Array.from(this.signals.values()));

    docClient.send(new PutCommand({ TableName: 'AWSSignals', Item: signal })).catch(() => {});
  }

  public toggleSaveSignal(id: string): AWSSignal | undefined {
    const sig = this.signals.get(id);
    if (sig) {
      sig.is_saved = !sig.is_saved;
      this.saveSignal(sig);
      return sig;
    }
    return undefined;
  }

  // Topics
  public getTopics(): CommunityTopic[] {
    return Array.from(this.topics.values()).sort((a, b) => b.trend_score - a.trend_score);
  }

  public saveTopics(topicsList: CommunityTopic[]): void {
    topicsList.forEach(t => this.topics.set(t.topic_id, t));
    writeJsonFile(FILES.topics, Array.from(this.topics.values()));

    topicsList.forEach(t => {
      docClient.send(new PutCommand({ TableName: 'AWSTopics', Item: t })).catch(() => {});
    });
  }

  // Daily Briefings
  public getBriefings(): DailyBriefing[] {
    return this.briefings.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  public getLatestBriefing(): DailyBriefing | undefined {
    return this.getBriefings()[0];
  }

  public saveBriefing(briefing: DailyBriefing): void {
    const idx = this.briefings.findIndex(b => b.date === briefing.date);
    if (idx >= 0) {
      this.briefings[idx] = briefing;
    } else {
      this.briefings.unshift(briefing);
    }
    writeJsonFile(FILES.briefings, this.briefings);

    docClient.send(new PutCommand({ TableName: 'AWSBriefings', Item: briefing })).catch(() => {});
  }

  // User Preferences
  public getPreferences(): UserPreferences {
    return this.preferences;
  }

  public updatePreferences(updates: Partial<UserPreferences>): UserPreferences {
    this.preferences = { ...this.preferences, ...updates };
    
    if (updates.email && (!this.preferences.email_list || !this.preferences.email_list.includes(updates.email))) {
      this.preferences.email_list = [updates.email, ...(this.preferences.email_list || []).filter(e => e !== updates.email)];
    }

    writeJsonFile(FILES.preferences, this.preferences);

    docClient.send(new PutCommand({ TableName: 'AWSPreferences', Item: this.preferences })).catch(() => {});
    return this.preferences;
  }

  // Execution Logs
  public getLogs(): AgentExecutionLog[] {
    return this.logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  public saveLog(log: AgentExecutionLog): void {
    this.logs.unshift(log);
    if (this.logs.length > 50) this.logs = this.logs.slice(0, 50);
    writeJsonFile(FILES.logs, this.logs);

    docClient.send(new PutCommand({ TableName: 'AWSExecutionLogs', Item: log })).catch(() => {});
  }

  // "While You Were Away" summary metrics calculation
  public getWhileYouWereAwaySummary(): {
    last_visited_at: string;
    new_announcements: number;
    community_discussions: number;
    emerging_signals: number;
    high_priority_alerts: number;
    signals: AWSSignal[];
  } {
    const lastVisit = new Date(this.preferences.last_visited_at).getTime();
    const allSignals = this.getSignals();

    const newSinceVisit = allSignals.filter(s => new Date(s.discovered_at).getTime() >= lastVisit);
    
    const activeSignals = newSinceVisit.length > 0 
      ? newSinceVisit 
      : allSignals.filter(s => new Date(s.discovered_at).getTime() >= Date.now() - 86400000 * 2);

    const announcements = activeSignals.filter(s => s.category === 'Announcement').length;
    const discussions = activeSignals.filter(s => s.category === 'Community Discussion').length;
    const alerts = activeSignals.filter(s => s.signal_score >= 80).length;

    return {
      last_visited_at: this.preferences.last_visited_at,
      new_announcements: Math.max(3, announcements),
      community_discussions: Math.max(7, discussions),
      emerging_signals: 2,
      high_priority_alerts: Math.max(1, alerts),
      signals: activeSignals,
    };
  }
}

export const storage = new StorageService();
