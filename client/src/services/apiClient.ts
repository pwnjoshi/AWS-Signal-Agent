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

// Local Storage Keys
const STORAGE_KEYS = {
  PROFILE: 'aws_signal_builder_profile',
  SAVED_IDS: 'aws_signal_saved_ids',
  PREFS: 'aws_signal_user_prefs',
};

function getLocalSavedIds(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SAVED_IDS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function setLocalSavedIds(ids: string[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.SAVED_IDS, JSON.stringify(ids));
  } catch (err) {
    console.error('Error saving to localStorage:', err);
  }
}

// AWS Builder ID Auth & Profile API with instant localStorage persistence
export async function authenticateBuilderId(builder_id: string, display_name?: string, email?: string): Promise<UserProfile> {
  const localProfile: UserProfile = {
    builder_id: builder_id.trim(),
    display_name: display_name?.trim() || builder_id.trim(),
    email: email?.trim() || `${builder_id.trim()}@builder.aws`,
    email_list: [email?.trim() || `${builder_id.trim()}@builder.aws`],
    is_authenticated: true,
    logged_in_at: new Date().toISOString(),
  };

  localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(localProfile));

  try {
    const res = await fetch(`${BASE_URL}/api/auth/builder-id`, {
      method: 'POST',
      headers: defaultHeaders(),
      body: JSON.stringify({ builder_id, display_name, email }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.profile) {
        localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(data.profile));
        return data.profile;
      }
    }
  } catch (err) {
    console.warn('Backend sync failed, using local profile:', err);
  }

  return localProfile;
}

export async function fetchActiveProfile(): Promise<UserProfile> {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (raw) {
      const local = JSON.parse(raw);
      if (local && local.builder_id) return local;
    }
  } catch {}

  try {
    const res = await fetch(`${BASE_URL}/api/auth/profile`, {
      headers: defaultHeaders(),
    });
    if (res.ok) {
      const data = await res.json();
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(data));
      return data;
    }
  } catch (err) {
    console.warn('Failed to fetch profile from API, using default:', err);
  }

  return {
    builder_id: 'builder_pawan_2026',
    display_name: 'Pawan Joshi',
    email: 'pawan@example.com',
    email_list: ['pawan@example.com'],
    is_authenticated: true,
    logged_in_at: new Date().toISOString(),
  };
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

  const savedIds = new Set(getLocalSavedIds());

  try {
    const res = await fetch(`${BASE_URL}/api/signals?${query.toString()}`, {
      headers: defaultHeaders(),
    });
    if (res.ok) {
      const data = await res.json();
      const signals = (data.signals || []).map((s: AWSSignal) => ({
        ...s,
        is_saved: savedIds.has(s.signal_id) || !!s.is_saved,
      }));
      return { count: signals.length, signals };
    }
  } catch (err) {
    console.warn('API error fetching signals:', err);
  }

  return { count: 0, signals: [] };
}

export async function toggleSaveSignal(id: string): Promise<AWSSignal> {
  const savedIds = getLocalSavedIds();
  const exists = savedIds.includes(id);
  const updatedIds = exists ? savedIds.filter(i => i !== id) : [...savedIds, id];
  setLocalSavedIds(updatedIds);

  try {
    const res = await fetch(`${BASE_URL}/api/signals/${id}/toggle-save`, { 
      method: 'POST',
      headers: defaultHeaders(),
    });
    if (res.ok) {
      const sig = await res.json();
      return { ...sig, is_saved: !exists };
    }
  } catch (err) {
    console.warn('Backend sync for save signal failed, local saved:', err);
  }

  return {
    signal_id: id,
    is_saved: !exists,
  } as AWSSignal;
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

let activeAudioElement: HTMLAudioElement | null = null;

/**
 * Plays conversational speech using Amazon Polly Generative/Neural voice with Web Speech fallback.
 */
export async function playDoriSpeech(
  text: string,
  onEnd?: () => void
): Promise<() => void> {
  // Stop any currently playing audio or speech
  stopDoriSpeech();

  // Try Amazon Polly First for real human-like conversation voice
  try {
    const res = await fetch(`${BASE_URL}/api/dori/synthesize`, {
      method: 'POST',
      headers: defaultHeaders(),
      body: JSON.stringify({ text, voiceId: 'Ruth', engine: 'generative' }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.audioBase64) {
        const audio = new Audio(data.audioBase64);
        activeAudioElement = audio;
        audio.onended = () => {
          activeAudioElement = null;
          if (onEnd) onEnd();
        };
        audio.onerror = () => {
          activeAudioElement = null;
          fallbackBrowserSpeech(text, onEnd);
        };
        await audio.play();
        return () => stopDoriSpeech();
      }
    }
  } catch (err) {
    console.warn('Amazon Polly endpoint unavailable, using neural browser speech fallback:', err);
  }

  // Fallback to browser Web Speech API
  fallbackBrowserSpeech(text, onEnd);
  return () => stopDoriSpeech();
}

function fallbackBrowserSpeech(text: string, onEnd?: () => void) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1.02;
  utterance.pitch = 1.05;
  utterance.onend = () => {
    if (onEnd) onEnd();
  };
  utterance.onerror = () => {
    if (onEnd) onEnd();
  };
  window.speechSynthesis.speak(utterance);
}

export function stopDoriSpeech() {
  if (activeAudioElement) {
    activeAudioElement.pause();
    activeAudioElement.currentTime = 0;
    activeAudioElement = null;
  }
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

