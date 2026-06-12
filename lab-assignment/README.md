# Lab Assignment - ExamForge AI

This folder contains the assignment UI app for the Day 12 lab.

The original folder name was `lab-assgment`; it has been renamed to `lab-assignment`.

## Purpose

This is a Next.js app that demonstrates an AI-style exam workflow:

- Generate a Grade 12 multiple-choice exam.
- Compare direct LLM mode vs agent mode.
- Submit answers and view grading results.
- Show study advice, weak areas, strong areas, and agent reasoning trace.
- Generate exams through Next.js backend API routes.

The app can use the sample question bank without real API keys. When `OPENAI_API_KEY` or `GEMINI_API_KEY` is configured, the same backend form can call OpenAI or Gemini.

## Related Code Lab Work

The completed written solution for Code Lab Parts 1-5 is in:

```text
../solution.md
```

That file covers:

- Part 1: Localhost vs Production
- Part 2: Docker Containerization
- Part 3: Cloud Deployment
- Part 4: API Security
- Part 5: Scaling & Reliability

## Run Locally

```powershell
cd lab-assignment
pnpm install
Copy-Item .env.example .env.local
pnpm dev
```

Then open:

```text
http://localhost:3000
```

## Build

```powershell
pnpm build
pnpm start
```

## Docker

This folder includes a production Docker setup:

- `Dockerfile` uses a multi-stage build.
- `.dockerignore` keeps local secrets and build output out of the image context.
- `docker-compose.yml` runs the production container locally with `.env`.
- `next.config.mjs` uses `output: "standalone"` so the runtime image is smaller.

Build and run:

```powershell
docker build -t examforge-ai:local .
docker run --rm -p 3000:3000 --env-file .env examforge-ai:local
```

Or with Compose:

```powershell
docker compose up --build
```

Health checks:

```powershell
Invoke-RestMethod http://localhost:3000/health
Invoke-RestMethod http://localhost:3000/ready
Invoke-RestMethod http://localhost:3000/api/status
```

## CI/CD

The repository root includes:

- `.github/workflows/lab-assignment-ci.yml`
- `render.yaml`

The GitHub Actions workflow:

- Installs dependencies with pnpm.
- Builds the Next.js app.
- Builds the Docker image.
- Runs a container smoke test against `/health`.
- Publishes an image to GitHub Container Registry on push.

`render.yaml` deploys `lab-assignment` as a Docker web service on Render. Add these secrets in Render, not in git:

- `OPENAI_API_KEY`
- `GEMINI_API_KEY`
- `API_GATEWAY_KEY`
- `JWT_SECRET`

## Part 1 Applied: Localhost vs Production

This app now applies the Part 1 production-readiness ideas:

- Config is read from environment variables in `lib/config.ts`.
- `.env.example` documents the expected configuration.
- `/health` is available as a liveness endpoint.
- `/ready` is available as a readiness endpoint.
- Metadata uses environment-driven app config.
- Analytics is enabled only when `NEXT_PUBLIC_ENABLE_ANALYTICS=true`.
- TypeScript build errors are no longer ignored by default.

Health checks:

```powershell
Invoke-RestMethod http://localhost:3000/health
Invoke-RestMethod http://localhost:3000/ready
```

## Part 04 Applied: API Gateway

The exam backend APIs now include API-gateway style protection:

- `app/api/exams/generate/route.ts` validates input, checks auth, applies rate limiting, and applies cost guard before calling OpenAI/Gemini.
- `app/api/exams/grade/route.ts` validates grading payloads and applies auth/rate limiting.
- `lib/server/api-auth.ts` supports `x-api-key` and `Authorization: Bearer <JWT>`.
- `lib/server/rate-limiter.ts` uses a token-bucket limiter.
- `lib/server/cost-guard.ts` estimates token usage and blocks excessive generation requests.

Useful `.env` values:

```env
API_GATEWAY_ENABLED=true
API_GATEWAY_ALLOW_SAME_ORIGIN=true
API_GATEWAY_KEY=change-me
JWT_SECRET=change-me
RATE_LIMIT_ENABLED=true
RATE_LIMIT_REQUESTS_PER_MINUTE=30
COST_GUARD_ENABLED=true
COST_GUARD_TOKENS_PER_MINUTE=1000
```

Same-origin browser requests are allowed by default so the UI works locally. External clients should send:

```powershell
Invoke-RestMethod http://localhost:3000/api/exams/generate `
  -Method Post `
  -Headers @{ "x-api-key" = "change-me" } `
  -ContentType "application/json" `
  -Body '{"subject":"Physics","topic":"Mechanics","difficulty":"medium","questionCount":5,"provider":"sample","mode":"llm"}'
```

## Part 05 Applied: Scaling & Reliability

The app now follows the scaling/reliability ideas before Docker/deployment:

- `/health` is a liveness endpoint.
- `/ready` reports provider configuration, API gateway readiness, and stateless readiness.
- `/api/status` returns `instanceId`, uptime, and stateless status for future load-balancer checks.
- Exam grading is stateless: the client submits the exam and answers together; the server does not rely on local session state.
- AI provider calls use `AI_PROVIDER_TIMEOUT_MS` to avoid hanging requests.
- Dynamic API routes return `Cache-Control: no-store`.

The current rate limiter and cost guard are in-memory because this is a local lab. When running multiple instances behind Nginx/Cloud Run/Render, replace them with Redis/Upstash so limits are shared across instances.

## Main Files

```text
app/page.tsx                    Main workflow
components/exam-generator.tsx   Exam configuration form
components/exam-view.tsx        Exam-taking UI
components/grading-results.tsx  Result and feedback UI
components/agent-trace.tsx      Agent reasoning trace
app/api/exams/generate/route.ts Backend exam generation API
app/api/exams/grade/route.ts    Backend grading API
app/api/status/route.ts         Instance/status endpoint for scaling checks
lib/question-bank.sample.json   Sample question bank template
lib/exam-matrix.ts              Easy/medium/hard exam matrix
lib/question-service.ts         Question selection and grading logic
lib/server/api-auth.ts          API key/JWT guard
lib/server/rate-limiter.ts      Token bucket rate limiting
lib/server/cost-guard.ts        Token budget protection
lib/types.ts                    Shared TypeScript types
```

## Backend Data Shape

Add real questions by following `lib/question-bank.sample.json`:

```json
{
  "id": 1001,
  "subject": "Physics",
  "topic": "Mechanics",
  "difficulty": "medium",
  "cognitiveLevel": "application",
  "text": "Question text",
  "options": {
    "A": "Option A",
    "B": "Option B",
    "C": "Option C",
    "D": "Option D"
  },
  "correctAnswer": "A",
  "explanation": "Why A is correct"
}
```

Supported `cognitiveLevel` values:

- `recognition`
- `understanding`
- `application`
- `advanced_application`

## Exam Matrix

- Easy: 40% recognition, 40% understanding, 20% application.
- Medium: 30% recognition, 30% understanding, 15% application, 5% advanced application. These weights are normalized because the provided medium matrix totals 80%.
- Hard: 20% recognition, 30% understanding, 30% application, 20% advanced application.

## AI Providers

```powershell
OPENAI_API_KEY=your_openai_key
OPENAI_MODEL=gpt-4o-mini
GEMINI_API_KEY=your_gemini_key
GEMINI_MODEL=gemini-1.5-flash
```

If a provider key is missing or the provider call fails, `/api/exams/generate` falls back to the sample question bank.

## Notes

- No real API key is required for sample-bank mode.
- Some generated/mock content may still contain encoding artifacts from the original scaffold.
