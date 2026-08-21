export type SourceType = 
  | 'AWS What\'s New' 
  | 'AWS News Blog' 
  | 'AWS Architecture Blog' 
  | 'AWS re:Post' 
  | 'AWS Builder Center';

export type SignalCategory = 
  | 'Announcement' 
  | 'Community Discussion' 
  | 'Architecture Pattern' 
  | 'Tutorial' 
  | 'Security Alert';

export interface WhyItMatters {
  what_happened: string;
  why_it_matters: string;
  who_should_care: string[];
  community_reaction: string;
  recommended_action: string;
}

export interface AWSSignal {
  signal_id: string;
  title: string;
  source: SourceType;
  source_url: string;
  published_at: string;
  discovered_at: string;
  aws_services: string[];
  category: SignalCategory;
  summary: string;
  importance_score: number; // 0-100
  relevance_score: number;  // 0-100
  novelty_score: number;    // 0-100
  momentum_score: number;   // 0-100
  impact_score: number;     // 0-100
  signal_score: number;     // Weighted calculated score
  confidence_score: number; // 0-100
  why_it_matters: WhyItMatters;
  content_hash: string;
  status: 'new' | 'processed' | 'alerted' | 'archived';
  is_saved?: boolean;
}

export interface CommunityTopic {
  topic_id: string;
  name: string;
  service: string;
  mention_count: number;
  trend_score: number; // 0-100
  velocity: 'rising' | 'stable' | 'fading';
  common_symptoms: string[];
  suggested_solutions: string[];
  related_docs: Array<{ title: string; url: string }>;
  related_signals: string[]; // IDs
  first_seen: string;
  last_seen: string;
  evolution_timeline?: Array<{ date: string; stage: string; note: string }>;
}

export interface ServiceSpotlight {
  service_name: string;
  description: string;
  why_try: string;
}

export interface PracticalTask {
  title: string;
  description: string;
  estimated_minutes: number;
  doc_url: string;
}

export interface DailyBriefing {
  briefing_id: string;
  date: string;
  title: string;
  top_signal: AWSSignal;
  what_changed: string;
  why_developers_care: string;
  community_pulse: string;
  service_spotlight: ServiceSpotlight;
  try_today: PracticalTask;
  watchlist: string[];
  stats: {
    new_announcements: number;
    community_discussions: number;
    emerging_signals: number;
    high_priority_alerts: number;
  };
  created_at: string;
}

export type ScheduleFrequency = '1h' | '6h' | '12h' | 'daily_8am' | 'weekly_mon';

export interface UserPreferences {
  user_id: string;
  name: string;
  email: string;
  email_list: string[];
  email_enabled: boolean;
  digest_frequency: 'daily' | 'weekly' | 'instant_only' | 'off';
  schedule_frequency: ScheduleFrequency;
  cron_expression: string;
  alert_threshold: 'high' | 'medium' | 'all';
  favorite_services: string[];
  favorite_topics: string[];
  last_visited_at: string;
}

export interface TimelineEntry {
  timestamp: string;
  step: string;
  status: 'info' | 'success' | 'warning' | 'error';
  message: string;
}

export interface AgentExecutionLog {
  run_id: string;
  timestamp: string;
  trigger: 'scheduler' | 'manual_demo';
  status: 'running' | 'completed' | 'failed';
  sources_checked: number;
  new_items: number;
  duplicates_found: number;
  signals_detected: number;
  high_priority_count: number;
  briefing_generated: boolean;
  timeline: TimelineEntry[];
}

export interface RawContentItem {
  title: string;
  source: SourceType;
  url: string;
  pubDate: string;
  contentSnippet: string;
  rawHtml?: string;
}
