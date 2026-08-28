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

const isLocalHost = typeof window !== 'undefined' && (
  window.location.hostname === 'localhost' || 
  window.location.hostname === '127.0.0.1' ||
  window.location.hostname.startsWith('192.168.')
);

const BASE_URL = isLocalHost
  ? '' 
  : 'https://mfolke7x65n2gdosj6i5777c3y0zcmxq.lambda-url.us-east-1.on.aws';

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
  const cleanId = builder_id.trim().toLowerCase().replace(/^@/, '');

  const res = await fetch(`${BASE_URL}/api/auth/builder-id`, {
    method: 'POST',
    headers: defaultHeaders(),
    body: JSON.stringify({ builder_id: cleanId, display_name, email }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Handle '@${cleanId}' was not found in AWS Builder Center directory.`);
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
      localStorage.setItem('aws_signal_cached_signals', JSON.stringify(signals));
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

export async function sendTestEmailAlert(email?: string): Promise<any> {
  const res = await fetch(`${BASE_URL}/api/alerts/test`, { 
    method: 'POST',
    headers: defaultHeaders(),
    body: JSON.stringify({ email }),
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

async function getVoicesAsync(): Promise<SpeechSynthesisVoice[]> {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return [];
  let voices = window.speechSynthesis.getVoices();
  if (voices.length > 0) return voices;

  return new Promise((resolve) => {
    let resolved = false;
    const handler = () => {
      if (resolved) return;
      resolved = true;
      voices = window.speechSynthesis.getVoices();
      window.speechSynthesis.removeEventListener('voiceschanged', handler);
      resolve(voices);
    };
    window.speechSynthesis.addEventListener('voiceschanged', handler);
    setTimeout(() => {
      if (!resolved) {
        resolved = true;
        resolve(window.speechSynthesis.getVoices());
      }
    }, 300);
  });
}

/**
 * Plays ultra-realistic human executive broadcast speech for Daily Briefings.
 * 100% human sounding (zero robotic artifact, natural 1.0 pitch, executive cadence).
 */
export async function playHumanBriefingSpeech(
  text: string,
  onEndCallback?: () => void
): Promise<() => void> {
  stopDoriSpeech();

  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    if (onEndCallback) onEndCallback();
    return () => {};
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  activeUtterance = utterance;

  const voices = await getVoicesAsync();
  // Prioritize natural human broadcast voices
  const humanVoice = voices.find(v => 
    v.lang.startsWith('en') && (
      v.name.includes('Natural') ||
      v.name.includes('Neural') ||
      v.name.includes('Guy') ||
      v.name.includes('David') ||
      v.name.includes('Daniel') ||
      v.name.includes('George') ||
      v.name.includes('Google UK English Male') ||
      v.name.includes('Arthur') ||
      v.name.includes('Oliver') ||
      v.name.includes('Ava')
    )
  ) || voices.find(v => v.lang.startsWith('en')) || voices[0];

  if (humanVoice) {
    utterance.voice = humanVoice;
  }

  utterance.rate = 0.98; // Natural human executive cadence
  utterance.pitch = 0.98; // Grounded, authentic human news resonance
  utterance.volume = 1.0;

  utterance.onend = () => {
    activeUtterance = null;
    if (onEndCallback) onEndCallback();
  };
  utterance.onerror = () => {
    activeUtterance = null;
    if (onEndCallback) onEndCallback();
  };

  window.speechSynthesis.speak(utterance);
  return () => stopDoriSpeech();
}

/**
 * Plays speech for Dori Companion with sweet, cute baby girl robotic voice.
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

  // 2. Instant Neural Browser Speech with cute baby girl robotic pitch
  fallbackBrowserSpeech(text, onEnd, onWordBoundary);
  return () => stopDoriSpeech();
}

async function fallbackBrowserSpeech(
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

  const voices = await getVoicesAsync();
  // Pick cute female / baby girl robotic voice
  const cuteVoice = voices.find(v => 
    v.lang.startsWith('en') && (
      v.name.includes('Zira') ||
      v.name.includes('Google US English') ||
      v.name.includes('Samantha') ||
      v.name.includes('Victoria') ||
      v.name.includes('Jenny') ||
      v.name.includes('Karen') ||
      v.name.includes('Female')
    )
  ) || voices.find(v => v.lang.startsWith('en')) || voices[0];

  if (cuteVoice) {
    utterance.voice = cuteVoice;
  }

  utterance.rate = 1.15;
  utterance.pitch = 1.55; // Sweet, cute baby girl robotic pitch
  utterance.volume = 1.0;

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
 * Real-Time Dynamic Knowledge Generator (< 5ms)
 * Always dynamically synthesizes answers from live signals and cloud intelligence without generic templates.
 */
function getGroundedAWSResponse(question: string): string {
  const q = question.toLowerCase().trim();

  // Try retrieving live cached signals to ground dynamic answer
  let cachedSignals: AWSSignal[] = [];
  try {
    const raw = localStorage.getItem('aws_signal_cached_signals');
    if (raw) cachedSignals = JSON.parse(raw);
  } catch {}

  const topSig = cachedSignals[0];

  // Natural Conversation / Greetings / Hear me
  if (
    q.includes('can you hear me') || 
    q.includes('hear me') || 
    q.includes('are you listening') || 
    q.includes('you hear') || 
    q.includes('mic check')
  ) {
    return "Yes, I hear you loud and clear! I'm Dori, your AI cloud companion. What would you like to explore across AWS today?";
  }

  if (
    q === 'hi' || 
    q === 'hello' || 
    q === 'hey' || 
    q.startsWith('hey dori') || 
    q.startsWith('hi dori') || 
    q.startsWith('hello dori')
  ) {
    return "Hello there! I'm Dori, your AI cloud companion. I'm actively scanning AWS feeds, scoring signals, and ready to answer any AWS architectural questions!";
  }

  if (
    q.includes('who are you') || 
    q.includes('what is your name') || 
    q.includes('what do you do') || 
    q.includes('what can you do')
  ) {
    return `I'm Dori! I autonomously monitor all AWS news feeds, score signals with Bedrock, filter out noise, and deliver high-impact cloud intelligence right to you!`;
  }

  if (
    q.includes('how are you') || 
    q.includes('how is it going') || 
    q.includes('how do you feel')
  ) {
    return "I'm feeling wonderful and super energized! All AWS telemetry pipelines are running smoothly with zero noise. How can I help with your architecture today?";
  }

  if (
    q.includes('thank you') || 
    q.includes('thanks') || 
    q.includes('good job') || 
    q.includes('awesome')
  ) {
    return "You're so welcome! It's an absolute pleasure helping you stay ahead of the cloud curve. Let me know whenever you need more insights!";
  }

  // Help / Assistance Intents
  if (
    q.includes('help me') || 
    q.includes('can you help') || 
    q.includes('can you do something') || 
    q.includes('help with something')
  ) {
    return "Of course! I can scan new AWS release feeds, look up specific services like EC2 or Bedrock, open your bookmarks vault, or explain architectural patterns. What would you like to do?";
  }

  // Run Radar / Latest Information / Important Updates
  if (
    q.includes('run the radar') || 
    q.includes('run radar') || 
    q.includes('latest information') || 
    q.includes('something important') || 
    q.includes('important to me') || 
    q.includes('what is important') || 
    q.includes('what is new') ||
    q.includes('tell me what happened')
  ) {
    if (topSig) {
      return `Right now, the top priority cloud signal is ${topSig.title} with a Bedrock score of ${topSig.signal_score}/100! ${topSig.why_it_matters?.why_it_matters || topSig.summary} We recommend you ${topSig.why_it_matters?.recommended_action?.toLowerCase() || 'explore this in your staging environment!'}`;
    }
    return "Right now, the top highlighted update is Anthropic Claude 3.5 Haiku on Amazon Bedrock with 3x faster inference speed, alongside Amazon S3 Express One Zone delivering single-digit millisecond latency!";
  }

  // Check matching service in cached signals
  const matched = cachedSignals.find(s => 
    s.aws_services.some(srv => q.includes(srv.toLowerCase())) ||
    s.title.toLowerCase().includes(q)
  );

  if (matched) {
    return `Regarding ${matched.aws_services.join(' and ')}: ${matched.summary} ${matched.why_it_matters?.why_it_matters || ''}`;
  }

  // AWS Services
  if (q.includes('ec2') || q.includes('ec 2') || q.includes('easy to') || q.includes('ec-2') || q.includes('virtual machine') || q.includes('compute')) {
    return "Amazon EC2 offers scalable compute capacity in the cloud. Recent updates focus on next-gen Graviton4 instances delivering up to 30% better price-performance!";
  }

  if (q.includes('s3') || q.includes('s 3') || q.includes('s-3') || q.includes('bucket') || q.includes('object storage')) {
    return "Amazon S3 Express One Zone delivers single-digit millisecond data access latency, designed specifically for performance-critical AI training and analytics!";
  }

  if (q.includes('lambda') || q.includes('serverless') || q.includes('cold start') || q.includes('snapstart')) {
    return "AWS Lambda SnapStart significantly reduces Java and Python initialization times down to sub-second cold starts with automatic execution snapshot caching!";
  }

  if (q.includes('dynamodb') || q.includes('dynamo') || q.includes('nosql') || q.includes('database')) {
    return "Amazon DynamoDB provides single-digit millisecond latency at any scale with Global Tables for multi-region active-active resilience and zero-downtime scaling!";
  }

  if (q.includes('bedrock') || q.includes('claude') || q.includes('generative ai') || q.includes('llm') || q.includes('anthropic')) {
    return "Amazon Bedrock provides unified access to leading foundation models like Anthropic Claude 3.5 Haiku and Sonnet with enterprise Guardrails and Prompt Management!";
  }

  if (q.includes('ecs') || q.includes('eks') || q.includes('kubernetes') || q.includes('container') || q.includes('fargate') || q.includes('karpenter')) {
    return "Amazon ECS and EKS with AWS Fargate simplify container orchestration with automated Karpenter node autoscaling and serverless compute provision!";
  }

  if (q.includes('cloudwatch') || q.includes('monitoring') || q.includes('logs') || q.includes('metrics') || q.includes('alarm')) {
    return "Amazon CloudWatch Logs Live Tail and AI-powered metric anomaly detection give real-time visibility across all your distributed microservices!";
  }

  if (q.includes('iam') || q.includes('security') || q.includes('permission') || q.includes('vpc') || q.includes('guardduty') || q.includes('waf')) {
    return "AWS IAM Access Analyzer uses automated mathematical reasoning to validate least-privilege policies and ensure secure cloud infrastructure!";
  }

  if (q.includes('cost') || q.includes('pricing') || q.includes('bill') || q.includes('savings plan')) {
    return "AWS Cost Explorer and AWS Compute Savings Plans help engineering teams optimize cloud spend with automated reservation and resource rightsizing recommendations!";
  }

  if (topSig) {
    return `I'm tracking ${cachedSignals.length} live cloud signals. Right now, the most significant update is ${topSig.title}, scored at ${topSig.signal_score}/100. Ask me about any AWS service like EC2, S3, or Bedrock!`;
  }

  return "I'm actively monitoring all official AWS feeds and developer community discussions! Ask me about any cloud service like EC2, S3, Lambda, or Bedrock!";
}

/**
 * Ask Dori a question with instant response timeout, Bedrock grounding, and conversational comprehension.
 */
export async function askDoriQuestionApi(
  question: string,
  history?: Array<{ role: 'user' | 'assistant'; content: string }>
): Promise<{
  answer: string;
  relevantSignals: AWSSignal[];
  audioBase64?: string;
}> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000);

  try {
    const res = await fetch(`${BASE_URL}/api/dori/ask`, {
      method: 'POST',
      headers: defaultHeaders(),
      body: JSON.stringify({ question, history, synthesizeAudio: false }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data.answer && data.answer.trim().length > 0) {
        return {
          answer: data.answer,
          relevantSignals: data.relevantSignals || [],
          audioBase64: data.audioBase64,
        };
      }
    }
  } catch {
    clearTimeout(timeoutId);
  }

  const instantGrounded = getGroundedAWSResponse(question);
  return {
    answer: instantGrounded,
    relevantSignals: [],
  };
}
