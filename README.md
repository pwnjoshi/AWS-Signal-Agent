# AWS Signal — Autonomous AWS Intelligence Assistant

**AWS Signal** is a production-quality autonomous AWS intelligence agent inspired by a friendly futuristic AI companion (**Dori**) that continuously monitors official/public AWS sources, normalizes and deduplicates content, analyzes & scores signals using Amazon Bedrock, detects emerging community trends, generates daily briefings, and delivers intelligent email alerts.

---

## 🌟 Key Features

1. **Autonomous EventBridge Scheduler & Pipeline**:
   - Runs automatically on a background schedule (every 6 hours / morning 08:00 briefing) without requiring manual user initiation.
   - Live telemetry timeline displaying source counts, duplicate filters, Bedrock scoring, and alerts.

2. **Official AWS Public Source Collectors**:
   - AWS What's New (Feature announcements)
   - AWS News Blog & AWS Architecture Blog
   - AWS re:Post & Developer Discussions (recurring developer issues)
   - AWS Builder Center

3. **Amazon Bedrock AI Intelligence Engine**:
   - Structured JSON analysis output using Claude 3 / Nova models.
   - Calculates 5 key metrics (0-100): **Importance**, **Developer Relevance**, **Novelty**, **Community Momentum**, and **AWS Impact**.
   - Computes weighted Signal Score: $0.25 \times \text{Importance} + 0.25 \times \text{Relevance} + 0.15 \times \text{Novelty} + 0.15 \times \text{Momentum} + 0.20 \times \text{Impact}$.
   - Synthesizes "Why It Matters" developer views, persona classifications, and actionable lab steps.

4. **Community Trend & Issue Detection**:
   - Detects recurring developer friction across forums (e.g. Bedrock request latency or Lambda cold starts).
   - Generates velocity metrics (`rising`, `stable`, `fading`), common symptoms, suggested workarounds, and topic evolution timelines.

5. **Signature "While You Were Away" Feature**:
   - Dynamically calculates announcements, community discussions, emerging signals, and high priority alerts since the user's last visit.

6. **Original Companion "Dori"**:
   - Friendly robotic cloud companion with 7 interactive expressions (`happy`, `curious`, `thinking`, `alert`, `excited`, `sleeping`, `working`), speech bubbles, and helpful tooltips.

7. **Intelligent SES Email Alerts**:
   - Evaluates signal priority against user preference thresholds before sending alerts to avoid email fatigue.

---

## 🚀 Architecture

```text
Amazon EventBridge Scheduler / Background Cron
            ↓
       AWS Lambda / Express Pipeline Orchestrator
            ↓
  Source Collector (AWS What's New, Blogs, re:Post)
            ↓
  Content Normalizer & SHA-256 Hasher (Deduplication)
            ↓
     Amazon Bedrock Runtime (Structured LLM Output)
            ↓
   Community Trend Detector & Briefing Generator
            ↓
 DynamoDB / Persistent Data Store & S3 Daily Briefings
            ↓
   Web Dashboard & Amazon SES Intelligent Email Alerts
```

---

## ⚙️ Environment Variables & Configuration

Create a `.env` file in `server/`:

```env
PORT=3001
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
BEDROCK_MODEL_ID=anthropic.claude-3-haiku-20240307-v1:0
SES_SENDER_EMAIL=alerts@yourdomain.com
```

*Note: If AWS credentials are omitted, the application automatically uses its built-in intelligent fallback AI engine and local JSON persistence so it runs 100% out of the box.*

---

## 🛠 Local Development Instructions

### Install All Dependencies

```bash
# In root directory
npm run install:all
```

### Start Development Server & Client Concurrently

```bash
npm run dev
```

- **Frontend Dashboard**: `http://localhost:3000`
- **Backend API**: `http://localhost:3001`
- **Health Check**: `http://localhost:3001/health`

---

## 🧪 Testing & Demonstration

1. Navigate to the **Agent Telemetry (Demo)** tab in the sidebar.
2. Click **"Run Agent Now"** to trigger a live execution of the autonomous pipeline.
3. Observe step-by-step logs: raw feed fetching -> SHA-256 hashing -> Bedrock classification -> trend detection -> briefing generation -> storage.
4. View updated stats in **"While You Were Away"** and the **Briefings** tab!

---

## 🔒 Security Best Practices

- AWS credentials are managed securely server-side and never exposed to the client bundle.
- Inputs and rendered HTML contents are sanitized.
- IAM permissions follow least-privilege principles (`bedrock:InvokeModel`, `dynamodb:PutItem`, `ses:SendEmail`).
