import { 
  AgentExecutionLog, 
  AWSSignal, 
  CommunityTopic, 
  DailyBriefing, 
  ServiceExplorerItem, 
  UserPreferences, 
  UserProfile, 
  WhileYouWereAwaySummary 
} from '../types/clientTypes';

const BASE_URL = window.location.hostname.includes('amazonaws.com') 
  ? 'https://mfolke7x65n2gdosj6i5777c3y0zcmxq.lambda-url.us-east-1.on.aws' 
  : '';

const API_KEY = 'aws-signal-secret-key-2026';

function defaultHeaders(extra?: Record<string, string>): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    'X-API-Key': API_KEY,
    ...extra,
  };
}

// AWS Builder ID Auth & Profile API
export async function authenticateBuilderId(builder_id: string, display_name?: string, email?: string): Promise<UserProfile> {
  const res = await fetch(`${BASE_URL}/api/auth/builder-id`, {
    method: 'POST',
    headers: defaultHeaders(),
    body: JSON.stringify({ builder_id, display_name, email }),
  });
  if (!res.ok) throw new Error('Failed to authenticate Builder ID');
  const data = await res.json();
  return data.profile;
}

export async function fetchActiveProfile(): Promise<UserProfile> {
  const res = await fetch(`${BASE_URL}/api/auth/profile`, {
    headers: defaultHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch profile');
  return res.json();
}

// Agent Status & Execution
export async function fetchAgentStatus(): Promise<{
  status: string;
  is_running: boolean;
  next_scheduled_run: string;
  latest_run: AgentExecutionLog | null;
  execution_history: AgentExecutionLog[];
}> {
  const res = await fetch(`${BASE_URL}/api/agent/status`, {
    headers: defaultHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch agent status');
  return res.json();
}

export async function triggerAgentRun(): Promise<{ success: boolean; log: AgentExecutionLog }> {
  const res = await fetch(`${BASE_URL}/api/agent/run`, { 
    method: 'POST',
    headers: defaultHeaders(),
  });
  if (!res.ok) throw new Error('Failed to trigger agent run');
  return res.json();
}

export async function fetchSignals(params?: {
  search?: string;
  service?: string;
  category?: string;
  minImportance?: number;
  source?: string;
  sort?: string;
  savedOnly?: boolean;
}): Promise<{ count: number; signals: AWSSignal[] }> {
  const query = new URLSearchParams();
  if (params?.search) query.set('search', params.search);
  if (params?.service) query.set('service', params.service);
  if (params?.category) query.set('category', params.category);
  if (params?.minImportance) query.set('minImportance', params.minImportance.toString());
  if (params?.source) query.set('source', params.source);
  if (params?.sort) query.set('sort', params.sort);
  if (params?.savedOnly) query.set('savedOnly', 'true');

  const res = await fetch(`${BASE_URL}/api/signals?${query.toString()}`, {
    headers: defaultHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch signals');
  return res.json();
}

export async function toggleSaveSignal(id: string): Promise<AWSSignal> {
  const res = await fetch(`${BASE_URL}/api/signals/${id}/toggle-save`, { 
    method: 'POST',
    headers: defaultHeaders(),
  });
  if (!res.ok) throw new Error('Failed to toggle save status');
  return res.json();
}

export async function fetchLatestBriefing(): Promise<DailyBriefing | null> {
  const res = await fetch(`${BASE_URL}/api/briefings/latest`, {
    headers: defaultHeaders(),
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error('Failed to fetch latest briefing');
  return res.json();
}

export async function fetchBriefings(): Promise<DailyBriefing[]> {
  const res = await fetch(`${BASE_URL}/api/briefings`, {
    headers: defaultHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch briefings');
  return res.json();
}

export async function fetchTrends(): Promise<CommunityTopic[]> {
  const res = await fetch(`${BASE_URL}/api/trends`, {
    headers: defaultHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch trends');
  return res.json();
}

export async function fetchServicesExplorer(): Promise<ServiceExplorerItem[]> {
  const res = await fetch(`${BASE_URL}/api/services`, {
    headers: defaultHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch services explorer data');
  return res.json();
}

export async function fetchWhileYouWereAway(): Promise<WhileYouWereAwaySummary> {
  const res = await fetch(`${BASE_URL}/api/summary/while-you-were-away`, {
    headers: defaultHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch summary');
  return res.json();
}

export async function fetchPreferences(): Promise<UserPreferences> {
  const res = await fetch(`${BASE_URL}/api/preferences`, {
    headers: defaultHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch preferences');
  return res.json();
}

export async function updatePreferences(prefs: Partial<UserPreferences>): Promise<UserPreferences> {
  const res = await fetch(`${BASE_URL}/api/preferences`, {
    method: 'PUT',
    headers: defaultHeaders(),
    body: JSON.stringify(prefs),
  });
  if (!res.ok) throw new Error('Failed to update preferences');
  return res.json();
}

export async function sendTestEmailAlert(): Promise<any> {
  const res = await fetch(`${BASE_URL}/api/alerts/test`, { 
    method: 'POST',
    headers: defaultHeaders(),
  });
  if (!res.ok) throw new Error('Failed to send test alert');
  return res.json();
}
