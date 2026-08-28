# ⚡ AWS Pulse AI — Autonomous AWS Intelligence Network

[![AWS Bedrock](https://img.shields.io/badge/AWS-Amazon%20Bedrock-orange?logo=amazon-aws)](https://aws.amazon.com/bedrock/)
[![AWS Lambda](https://img.shields.io/badge/AWS-Lambda%20Function%20URL-ff9900?logo=aws-lambda)](https://aws.amazon.com/lambda/)
[![React 18](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite-61dafb?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-blue?logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**AWS Pulse AI** is a production-grade autonomous cloud intelligence platform featuring **AWS Builder ID Quick Auth**, **Decoupled Public REST APIs**, **Bedrock 5-Metric Scoring**, **Dori Voice Audio Briefings**, and **Automated Amazon SES Email Alerts**.

---

## 🌐 Live AWS Production Endpoints

| Resource | Live Endpoint URL | Details |
| :--- | :--- | :--- |
| **🌐 Web Application** | **[http://aws-signal-web-013131247228.s3-website-us-east-1.amazonaws.com](http://aws-signal-web-013131247228.s3-website-us-east-1.amazonaws.com)** | Mobile-First React 18 SPA hosted on AWS S3 Static Web Hosting |
| **⚡ Serverless API** | **[https://mfolke7x65n2gdosj6i5777c3y0zcmxq.lambda-url.us-east-1.on.aws](https://mfolke7x65n2gdosj6i5777c3y0zcmxq.lambda-url.us-east-1.on.aws)** | Bundled Node.js Express Lambda Function URL |
| **📖 Decoupled API** | **[https://mfolke7x65n2gdosj6i5777c3y0zcmxq.lambda-url.us-east-1.on.aws/api/v1/news](https://mfolke7x65n2gdosj6i5777c3y0zcmxq.lambda-url.us-east-1.on.aws/api/v1/news)** | Public REST API for third-party apps to fetch real-time AWS news |
| **🐙 GitHub Repo** | **[https://github.com/pwnjoshi/AWS-Signal-Agent-Specification](https://github.com/pwnjoshi/AWS-Signal-Agent-Specification)** | Full monorepo containing client, server, and deployment stacks |

---

## 🌟 Production Capabilities

1. **🔑 AWS Builder ID Quick Auth**: One-click handle authentication (`builder_pawan_2026`). Instantly syncs Cloud Profiles, saved signals, custom topics, and recipient lists.
2. **📖 Decoupled Reusable Backend Platform**: Exposes open public API v1 endpoints (`/api/v1/news`, `/api/v1/signals`, `/api/v1/briefings/latest`) so ANY external web/mobile application can consume normalized AWS news.
3. **🤖 Amazon Bedrock 5-Metric Scoring**: Evaluates updates across 5 weighted dimensions: Importance, Developer Relevance, Novelty, Community Momentum, and AWS Impact.
4. **🔊 Dori AI Voice Speech Synthesis**: Interactive voice briefings using Web Speech API synthesis so Dori reads your daily briefing out loud.
5. **📱 Mobile-First Design**: Glassmorphism touch bottom navigation bar, mobile-first card layouts, and touch bottom-sheet drawers.
6. **🔒 Security & Rate Limiting**: Secured with sliding-window rate limiters, security guard headers, and mandatory `X-API-Key` headers on core routes.

---

## 🔌 Decoupled API Reference

| Endpoint | Method | Public / Auth | Description |
| :--- | :--- | :--- | :--- |
| `/api/v1/news` | `GET` | **Public** | Ingest & return latest normalized AWS news items |
| `/api/v1/signals` | `GET` | **Public** | Get ranked Bedrock AI signals |
| `/api/v1/briefings/latest` | `GET` | **Public** | Get latest synthesized daily intelligence briefing |
| `/api/v1/trends` | `GET` | **Public** | Get active community discussion topics |
| `/api/auth/builder-id` | `POST` | **Public** | Quick-authenticate session with AWS Builder ID handle |
| `/api/agent/run` | `POST` | `X-API-Key` | Trigger manual Bedrock intelligence pipeline run |
| `/api/preferences` | `PUT` | `X-API-Key` | Update schedule frequencies & recipient email lists |

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
