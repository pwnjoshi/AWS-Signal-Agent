# ⚡ AWS Signal — Autonomous AWS Intelligence Agent

[![AWS Bedrock](https://img.shields.io/badge/AWS-Amazon%20Bedrock-orange?logo=amazon-aws)](https://aws.amazon.com/bedrock/)
[![AWS Lambda](https://img.shields.io/badge/AWS-Lambda%20Function%20URL-ff9900?logo=aws-lambda)](https://aws.amazon.com/lambda/)
[![React 18](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite-61dafb?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-blue?logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**AWS Signal** is a production-quality autonomous AWS intelligence agent inspired by a friendly futuristic AI companion (**Dori**). It continuously discovers information from official AWS public feeds (What's New RSS, Tech Blogs, re:Post, Builder Center), normalizes and deduplicates updates using SHA-256 hashes, scores content across 5 weighted metrics using **Amazon Bedrock**, detects emerging community trends, generates structured daily intelligence briefings, and delivers automated email alerts via **Amazon SES**.

---

## 🌐 Live AWS Production Endpoints

| Resource | Live Endpoint URL | Details |
| :--- | :--- | :--- |
| **🌐 Web Application** | **[http://aws-signal-web-013131247228.s3-website-us-east-1.amazonaws.com](http://aws-signal-web-013131247228.s3-website-us-east-1.amazonaws.com)** | Mobile-First React 18 SPA hosted on AWS S3 Static Web Hosting |
| **⚡ Serverless API** | **[https://mfolke7x65n2gdosj6i5777c3y0zcmxq.lambda-url.us-east-1.on.aws](https://mfolke7x65n2gdosj6i5777c3y0zcmxq.lambda-url.us-east-1.on.aws)** | Bundled Node.js Express Lambda Function URL |
| **🐙 GitHub Repo** | **[https://github.com/pwnjoshi/AWS-Signal-Agent-Specification](https://github.com/pwnjoshi/AWS-Signal-Agent-Specification)** | Full monorepo containing client, server, and deployment stacks |

---

## 🌟 Key Architecture & Capabilities

```text
                        ┌───────────────────────────────────────────────┐
                        │ Amazon EventBridge / Cron Trigger             │
                        └───────────────────────┬───────────────────────┘
                                                │ (Scheduled Scan)
                                                ▼
                        ┌───────────────────────────────────────────────┐
                        │ AWS Lambda Orchestrator (AWSSignalAgentLambda)│
                        └───────────────────────┬───────────────────────┘
                                                │
       ┌────────────────────────────────────────┼────────────────────────────────────────┐
       ▼                                        ▼                                        ▼
┌───────────────────────────┐      ┌───────────────────────────┐      ┌───────────────────────────┐
│ AWS What's New RSS        │      │ AWS Tech & News Blogs     │      │ AWS re:Post Discussions   │
└──────────────┬────────────┘      └────────────┬──────────────┘      └────────────┬──────────────┘
               │                                │                                  │
               └────────────────────────────────┼──────────────────────────────────┘
                                                │ (Raw Feeds)
                                                ▼
                        ┌───────────────────────────────────────────────┐
                        │ SHA-256 Deduplication & Memory Evaluator      │
                        └───────────────────────┬───────────────────────┘
                                                │ (New Unique Items)
                                                ▼
                        ┌───────────────────────────────────────────────┐
                        │ Amazon Bedrock Runtime Scoring Engine         │
                        │ (Importance, Relevance, Novelty, Momentum)    │
                        └───────────────────────┬───────────────────────┘
                                                │
       ┌────────────────────────────────────────┼────────────────────────────────────────┐
       ▼                                        ▼                                        ▼
┌───────────────────────────┐      ┌───────────────────────────┐      ┌───────────────────────────┐
│ AWS DynamoDB Data Store   │      │ Daily Intelligence Digest │      │ Amazon SES Email Alerts   │
│ (AWSSignals, AWSTopics)   │      │ (S3 Bucket Persistence)   │      │ (Multi-Recipient List)    │
└───────────────────────────┘      └───────────────────────────┘      └───────────────────────────┘
```

### 1. 🤖 Amazon Bedrock 5-Metric Scoring Engine
Evaluates every new AWS item using Amazon Bedrock with a 5-dimensional weighted algorithm:
$$\text{Signal Score} = 0.25 \times \text{Importance} + 0.25 \times \text{Relevance} + 0.15 \times \text{Novelty} + 0.15 \times \text{Momentum} + 0.20 \times \text{Impact}$$
- **Why It Matters**: Generates concise developer explanations, target persona classifications, community sentiments, and 10-minute recommended lab steps.

### 2. 📱 Mobile-First Touch Interface
- Glassmorphism **Mobile Bottom Navigation Bar** with 5 primary touch targets (`Home`, `Signals`, `Briefings`, `Services`, `Settings`).
- Adaptive top header bar with quick search and one-tap **"Run"** demo trigger.
- Touch-friendly bottom sheet drawers (`max-h-[92vh]`) for Signal Detail and Settings modals.

### 3. ⏰ Custom Schedule & Multi-Email Alerts
- **Scan Frequencies**: Every 1 Hour, Every 6 Hours, Every 12 Hours, Daily at 8:00 AM, Weekly on Monday.
- **Multiple Email Recipients**: Configurable email list with instant test SES alerts.

### 4. 🔒 Enterprise Security & Protection
- **Sliding-Window Rate Limiting**: Max 10 runs per 15 minutes on `POST /api/agent/run`; max 100 requests per 15 minutes on `GET /api/*`.
- **API Key Guard**: Mandatory `X-API-Key` authentication header requirement across API routes.
- **Security Headers**: `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Strict-Transport-Security`.

---

## 🛠 Project Structure

```text
.
├── client/                     # React 18 + Vite + Tailwind CSS Frontend
│   ├── src/
│   │   ├── components/         # MobileBottomNav, Logo, Header, DoriCompanion, Modals
│   │   ├── pages/              # Dashboard, SignalsPage, TrendingPage, BriefingsPage
│   │   ├── services/           # apiClient (X-API-Key header authenticated fetch)
│   │   └── types/              # Client TypeScript type definitions
│   └── index.html              # Custom SVG favicon & responsive viewport meta
├── server/                     # Node.js + Express + TypeScript Backend
│   ├── src/
│   │   ├── api/                # Security-guarded Express REST API routes
│   │   ├── collectors/         # Official AWS RSS & re:Post feed scrapers
│   │   ├── middleware/         # Sliding window rate limiter & API key guard
│   │   ├── pipeline/           # SHA-256 deduplication & content normalizer
│   │   ├── scheduler/          # Dynamic background cron scheduler
│   │   ├── services/           # BedrockRuntime, DynamoDB storage, SES alerts
│   │   └── lambda.ts           # AWS Lambda Function URL entrypoint
│   └── package.json
└── deploy/                     # AWS CloudFormation & S3 website policies
    ├── cloudformation.yaml     # DynamoDB tables, S3 storage, IAM Role definitions
    ├── cors-config.json        # Lambda Function URL CORS configuration
    └── s3-policy.json          # S3 static website public bucket policy
```

---

## 🔑 Environment Variables & AWS Credentials

Create a `.env` file inside `server/`:

```env
PORT=3001
AWS_REGION=us-east-1
AWS_PROFILE=cloudblueprint
BEDROCK_MODEL_ID=anthropic.claude-3-haiku-20240307-v1:0
SES_SENDER_EMAIL=alerts@yourdomain.com
API_SECRET_KEY=aws-signal-secret-key-2026
```

---

## 💻 Local Development Setup

### 1. Install Dependencies
```bash
npm run install:all
```

### 2. Run Local Development Stack
```bash
npm run dev
```

- **Frontend Dashboard**: `http://localhost:3000`
- **Backend API**: `http://localhost:3001`
- **Health Check**: `http://localhost:3001/health`

---

## 🔌 API Reference

| Endpoint | Method | Security Header Required | Description |
| :--- | :--- | :--- | :--- |
| `/health` | `GET` | None | Service diagnostic health check |
| `/api/agent/status` | `GET` | `X-API-Key` | Get agent status, schedule & telemetry logs |
| `/api/agent/run` | `POST` | `X-API-Key` | Manually trigger full AI pipeline run |
| `/api/signals` | `GET` | `X-API-Key` | Query, filter, and search AWS signals |
| `/api/briefings/latest`| `GET` | `X-API-Key` | Get today's daily intelligence briefing |
| `/api/preferences` | `PUT` | `X-API-Key` | Update scan schedule and email recipient list |
| `/api/alerts/test` | `POST` | `X-API-Key` | Send instant test SES email alert |

---

## 🚀 AWS Deployment Commands

Deployment uses AWS profile **`cloudblueprint`** (`account 013131247228`):

```bash
# 1. Deploy CloudFormation Stack (DynamoDB Tables, S3 Storage, IAM Role)
aws cloudformation deploy \
  --template-file deploy/cloudformation.yaml \
  --stack-name aws-signal-stack \
  --capabilities CAPABILITY_NAMED_IAM \
  --region us-east-1 \
  --profile cloudblueprint

# 2. Build & Sync Frontend to S3 Static Website Hosting Bucket
cd client
npm run build
aws s3 sync dist s3://aws-signal-web-013131247228/ --region us-east-1 --profile cloudblueprint

# 3. Bundle & Deploy Serverless Backend to AWS Lambda
cd ../server
npm run build
npx esbuild src/lambda.ts --bundle --platform=node --target=node20 --outfile=dist/lambda.js
cd ..
powershell -Command "Compress-Archive -Path server/dist/lambda.js -DestinationPath deploy/lambda-bundle.zip -Force"
aws lambda update-function-code \
  --function-name AWSSignalAgentLambda \
  --zip-file fileb://deploy/lambda-bundle.zip \
  --region us-east-1 \
  --profile cloudblueprint
```

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
