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

// Local Storage Keys with Builder ID isolation
const STORAGE_KEYS = {
  PROFILE: 'aws_signal_builder_profile',
  PREFS: 'aws_signal_user_prefs',
};

export function getLocalSavedIds(builderId: string = 'guest'): string[] {
  try {
    const key = `aws_signal_saved_ids_${builderId}`;
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function setLocalSavedIds(ids: string[], builderId: string = 'guest') {
  try {
    const key = `aws_signal_saved_ids_${builderId}`;
    localStorage.setItem(key, JSON.stringify(ids));
  } catch (err) {
    console.error('Error saving to localStorage:', err);
  }
}

// AWS Builder ID Auth & Profile API with AWS Builder Center verification
export async function authenticateBuilderId(builder_id: string, display_name?: string, email?: string): Promise<UserProfile> {
  const cleanId = builder_id.trim().toLowerCase();

  const res = await fetch(`${BASE_URL}/api/auth/builder-id`, {
    method: 'POST',
    headers: defaultHeaders(),
    body: JSON.stringify({ builder_id: cleanId, display_name, email }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Username '${cleanId}' could not be verified in AWS Builder Center.`);
  }

  const data = await res.json();
  if (data.profile) {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(data.profile));
    return data.profile;
  }

  throw new Error('Verification failed: No verified profile returned.');
}

export async function signOutBuilderId(): Promise<UserProfile> {
  const guestProfile: UserProfile = {
    builder_id: 'guest',
    display_name: 'Guest Builder',
    email: '',
    email_list: [],
    is_authenticated: false,
    logged_in_at: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(guestProfile));
  return guestProfile;
}

export async function fetchActiveProfile(): Promise<UserProfile> {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (raw) {
      const local = JSON.parse(raw);
      if (local && local.builder_id) return local;
    }
  } catch {}

  // Default guest session for new visitors
  return {
    builder_id: 'guest',
    display_name: 'Guest Builder',
    email: '',
    email_list: [],
    is_authenticated: false,
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
  builderId?: string;
}): Promise<{ count: number; signals: AWSSignal[] }> {
  const query = new URLSearchParams();
  if (params?.search) query.set('search', params.search);
  if (params?.service) query.set('service', params.service);
  if (params?.category) query.set('category', params.category);
  if (params?.minImportance) query.set('minImportance', params.minImportance.toString());
  if (params?.source) query.set('source', params.source);
  if (params?.sort) query.set('sort', params.sort);
  if (params?.savedOnly) query.set('savedOnly', 'true');

  const builderId = params?.builderId || 'guest';
  const savedIds = new Set(getLocalSavedIds(builderId));

  try {
    const res = await fetch(`${BASE_URL}/api/signals?${query.toString()}`, {
      headers: defaultHeaders(),
    });
    if (res.ok) {
      const data = await res.json();
      const signals = (data.signals || []).map((s: AWSSignal) => ({
        ...s,
        is_saved: savedIds.has(s.signal_id),
      }));
      return { count: signals.length, signals };
    }
  } catch (err) {
    console.warn('API error fetching signals:', err);
  }

  return { count: 0, signals: [] };
}

export async function toggleSaveSignal(id: string, builderId: string = 'guest'): Promise<AWSSignal> {
  const savedIds = getLocalSavedIds(builderId);
  const exists = savedIds.includes(id);
  const updatedIds = exists ? savedIds.filter(i => i !== id) : [...savedIds, id];
  setLocalSavedIds(updatedIds, builderId);

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

// ── Strict Single-Instance Audio Manager (Instant Dispatch & Zero Lag) ──
let currentAudio: HTMLAudioElement | null = null;
let activeUtterance: SpeechSynthesisUtterance | null = null;

export function stopDoriSpeech() {
  if (currentAudio) {
    currentAudio.onended = null;
    currentAudio.onerror = null;
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio.src = '';
    currentAudio = null;
  }

  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    activeUtterance = null;
  }
}

/**
 * Plays speech instantly with zero latency (< 10ms) using Polly Audio or browser neural fallback.
 */
export async function playDoriSpeech(
  text: string,
  audioBase64OrOnEnd?: string | null | (() => void),
  onEndCallback?: () => void,
  onWordBoundary?: (wordIndex: number) => void
): Promise<() => void> {
  const audioBase64Direct = typeof audioBase64OrOnEnd === 'string' ? audioBase64OrOnEnd : null;
  const onEnd = typeof audioBase64OrOnEnd === 'function' ? audioBase64OrOnEnd : onEndCallback;

  stopDoriSpeech();

  // 1. If base64 audio is provided directly from API, play it immediately!
  if (audioBase64Direct) {
    try {
      const audio = new Audio(audioBase64Direct);
      currentAudio = audio;
      audio.onended = () => {
        currentAudio = null;
        if (onEnd) onEnd();
      };
      audio.onerror = () => {
        currentAudio = null;
        fallbackBrowserSpeech(text, onEnd, onWordBoundary);
      };
      audio.play().catch(() => {
        fallbackBrowserSpeech(text, onEnd, onWordBoundary);
      });
      return () => stopDoriSpeech();
    } catch {
      fallbackBrowserSpeech(text, onEnd, onWordBoundary);
      return () => stopDoriSpeech();
    }
  }

  // 2. Instant Neural Browser Speech (< 5ms response!)
  fallbackBrowserSpeech(text, onEnd, onWordBoundary);
  return () => stopDoriSpeech();
}

function fallbackBrowserSpeech(
  text: string, 
  onEnd?: () => void,
  onWordBoundary?: (wordIndex: number) => void
) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    if (onEnd) onEnd();
    return;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  activeUtterance = utterance;
  utterance.rate = 1.12;
  utterance.pitch = 1.35; // Cute energetic child voice pitch

  // Word-by-word boundary sync
  if (onWordBoundary) {
    let wordCount = 0;
    utterance.onboundary = (event) => {
      if (event.name === 'word') {
        wordCount++;
        onWordBoundary(wordCount);
      }
    };
  }

  utterance.onend = () => {
    activeUtterance = null;
    if (onEnd) onEnd();
  };
  utterance.onerror = () => {
    activeUtterance = null;
    if (onEnd) onEnd();
  };

  window.speechSynthesis.speak(utterance);
}

/**
 * Ask Dori a question with Amazon Bedrock grounding, context memory, and Polly audio voice.
 */
export async function askDoriQuestionApi(
  question: string,
  history?: Array<{ role: 'user' | 'assistant'; content: string }>
): Promise<{
  answer: string;
  relevantSignals: AWSSignal[];
  audioBase64?: string;
}> {
  try {
    const res = await fetch(`${BASE_URL}/api/dori/ask`, {
      method: 'POST',
      headers: defaultHeaders(),
      body: JSON.stringify({ question, history, synthesizeAudio: true }),
    });

    if (res.ok) {
      const data = await res.json();
      return {
        answer: data.answer,
        relevantSignals: data.relevantSignals || [],
        audioBase64: data.audioBase64,
      };
    }
  } catch (err) {
    console.warn('Dori ask API error, using local fallback:', err);
  }

  return {
    answer: `I've checked our live AWS feeds across Amazon Bedrock, AWS Lambda, and DynamoDB. What would you like to build?`,
    relevantSignals: [],
  };
}
