import crypto from 'crypto';
import { RawContentItem, SignalCategory, SourceType } from '../types/index.js';

export interface ProcessedItemCandidate {
  title: string;
  source: SourceType;
  source_url: string;
  published_at: string;
  discovered_at: string;
  content_snippet: string;
  content_hash: string;
  detected_services: string[];
  category: SignalCategory;
}

const AWS_SERVICES_KEYWORDS: Record<string, string[]> = {
  'Amazon Bedrock': ['bedrock', 'foundation model', 'claude 3', 'anthropic', 'rag', 'knowledge bases', 'prompt routing'],
  'AWS Lambda': ['lambda', 'serverless function', 'cold start', 'provisioned concurrency', 'event source mapping'],
  'Amazon ECS': ['ecs', 'fargate', 'task definition', 'capacity provider', 'container service'],
  'Amazon DynamoDB': ['dynamodb', 'global tables', 'on-demand', 'dynamodb streams', 'single-table design'],
  'Amazon S3': ['s3', 's3 express', 'object storage', 's3 vectors', 'bucket policy'],
  'Amazon OpenSearch': ['opensearch', 'vector database', 'opensearch serverless', 'knn index'],
  'AWS IAM': ['iam', 'identity and access management', 'iam identity center', 'role assumption'],
  'Amazon CloudWatch': ['cloudwatch', 'cloudwatch logs', 'x-ray', 'observability', 'metrics'],
  'Amazon SageMaker': ['sagemaker', 'model training', 'sagemaker jumpstart', 'inference endpoint'],
  'AWS App Runner': ['app runner', 'container runner'],
  'Amazon Aurora': ['aurora', 'aurora serverless', 'postgresql', 'mysql', 'aurora limitless'],
  'AWS Step Functions': ['step functions', 'state machine', 'workflow orchestration'],
};

export function generateContentHash(url: string, title: string): string {
  return crypto.createHash('sha256').update(`${url.toLowerCase().trim()}|${title.toLowerCase().trim()}`).digest('hex');
}

export function detectAWSServices(title: string, snippet: string): string[] {
  const text = `${title} ${snippet}`.toLowerCase();
  const detected: string[] = [];

  for (const [serviceName, keywords] of Object.entries(AWS_SERVICES_KEYWORDS)) {
    if (keywords.some(kw => text.includes(kw))) {
      detected.push(serviceName);
    }
  }

  return detected.length > 0 ? detected : ['AWS Cloud Services'];
}

export function categorizeContent(source: SourceType, title: string, snippet: string): SignalCategory {
  const text = `${title} ${snippet}`.toLowerCase();

  if (source === 'AWS re:Post' || text.includes('discussion') || text.includes('question') || text.includes('issue') || text.includes('latency')) {
    return 'Community Discussion';
  }
  if (source === 'AWS Architecture Blog' || text.includes('architecture') || text.includes('pattern') || text.includes('design')) {
    return 'Architecture Pattern';
  }
  if (text.includes('tutorial') || text.includes('how to') || text.includes('guide') || text.includes('building')) {
    return 'Tutorial';
  }
  if (text.includes('security') || text.includes('vulnerability') || text.includes('cve') || text.includes('patch')) {
    return 'Security Alert';
  }

  return 'Announcement';
}

export function processRawItem(item: RawContentItem): ProcessedItemCandidate {
  const content_hash = generateContentHash(item.url, item.title);
  const detected_services = detectAWSServices(item.title, item.contentSnippet);
  const category = categorizeContent(item.source, item.title, item.contentSnippet);

  return {
    title: item.title,
    source: item.source,
    source_url: item.url,
    published_at: item.pubDate,
    discovered_at: new Date().toISOString(),
    content_snippet: item.contentSnippet,
    content_hash,
    detected_services,
    category,
  };
}
