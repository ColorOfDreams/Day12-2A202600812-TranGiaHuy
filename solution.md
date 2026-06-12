# Day 12 Code Lab Solution - Parts 1 to 5

## Part 1: Localhost vs Production

### Exercise 1.1: Anti-patterns Found

In `01-localhost-vs-production/develop/app.py`, the main production risks are:

1. Hardcoded secrets:
   - `OPENAI_API_KEY = "sk-hardcoded-fake-key-never-do-this"`
   - `DATABASE_URL = "postgresql://admin:password123@localhost:5432/mydb"`
2. Fixed host and port:
   - `host="localhost"` only accepts local connections.
   - `port=8000` ignores cloud-provided `PORT`.
3. Debug reload is enabled directly in code:
   - `reload=True` is useful locally but unsafe for production.
4. No health or readiness endpoints:
   - A cloud platform cannot tell whether the process is healthy or ready.
5. No graceful shutdown:
   - Existing requests may be interrupted when the platform sends `SIGTERM`.
6. Uses `print()` instead of structured logging.
7. Logs the fake secret, which teaches a dangerous production habit.

### Exercise 1.2: Basic Version

The basic version can run locally, but it is not production-ready because it depends on local assumptions and hardcoded values.

Example run:

```powershell
cd 01-localhost-vs-production
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r develop\requirements.txt
cd develop
..\.venv\Scripts\python.exe app.py
```

Example test:

```powershell
Invoke-RestMethod http://localhost:8000/ask `
  -Method Post `
  -ContentType "application/json" `
  -Body '{"question":"hello"}'
```

### Exercise 1.3: Basic vs Production

| Feature | Basic | Advanced | Why Important? |
|---|---|---|---|
| Config | Hardcoded in code | Loaded from environment variables and `.env` | Cloud platforms inject config through environment variables. |
| Secrets | Fake key and DB URL in source | `OPENAI_API_KEY`, `AGENT_API_KEY` from env | Secrets must not be committed or logged. |
| Port | Fixed `8000` | Reads `PORT` | Railway, Render, and Cloud Run provide the port dynamically. |
| Host | `localhost` | `0.0.0.0` | Containers must listen on all interfaces. |
| Health check | Missing | `GET /health` | Platforms use this to restart broken containers. |
| Readiness | Missing | `GET /ready` | Load balancers use this before routing traffic. |
| Logging | `print()` | Structured JSON logging | Cloud logs are easier to search and parse. |
| Shutdown | Abrupt | Lifespan + SIGTERM handling | Allows in-flight requests to finish. |

### Checkpoint 1

- Hardcoded secrets are dangerous because they can leak through Git history or logs.
- Environment variables make the same code work across local, staging, and production.
- Health checks let platforms detect broken instances.
- Graceful shutdown protects users during deploys, restarts, and scaling events.

---

## Part 2: Docker Containerization

### Exercise 2.1: Dockerfile Questions

For `02-docker/develop/Dockerfile`:

1. Base image:
   - `python:3.11`
   - This is easy to understand but large.
2. Working directory:
   - `/app`
3. Why copy `requirements.txt` first?
   - Docker can cache the dependency installation layer. If only app code changes, dependencies do not need to reinstall.
4. `CMD` vs `ENTRYPOINT`:
   - `CMD` provides the default command and can be overridden easily.
   - `ENTRYPOINT` defines the executable that always runs unless explicitly overridden.

### Exercise 2.2: Build and Run

Build from repo root:

```powershell
docker build -f 02-docker/develop/Dockerfile -t my-agent:develop .
docker run -p 8000:8000 my-agent:develop
```

Test:

```powershell
Invoke-RestMethod http://localhost:8000/ask `
  -Method Post `
  -ContentType "application/json" `
  -Body '{"question":"What is Docker?"}'
```

Check image size:

```powershell
docker images my-agent
```

Expected observation: the develop image is larger because it uses the full `python:3.11` image and a single-stage build.

### Exercise 2.3: Multi-stage Build

For `02-docker/production/Dockerfile`:

- Stage 1 installs dependencies in a builder layer.
- Stage 2 starts from a slim runtime image and copies only what is needed.
- The final image is smaller because build tools and unnecessary files are left behind.

Build:

```powershell
docker build -f 02-docker/production/Dockerfile -t my-agent:production .
docker images my-agent
```

### Exercise 2.4: Docker Compose Stack

The production Compose stack contains:

- `agent`: FastAPI application.
- `redis`: cache/session service.
- `qdrant`: vector database demo service.
- `nginx`: reverse proxy and load balancer.

Architecture:

```text
Client
  |
  v
Nginx :80
  |
  v
FastAPI Agent :8000
  |              |
  v              v
Redis          Qdrant
```

Run:

```powershell
docker compose -f 02-docker/production/docker-compose.yml up --build
```

Test:

```powershell
Invoke-RestMethod http://localhost/health
Invoke-RestMethod http://localhost/ask `
  -Method Post `
  -ContentType "application/json" `
  -Body '{"question":"Explain microservices"}'
```

### Checkpoint 2

- Dockerfile layers should be ordered to maximize caching.
- Multi-stage builds reduce image size and attack surface.
- Compose lets one command start a full local stack.
- Useful debug commands: `docker logs`, `docker exec`, `docker compose ps`, `docker compose logs`.

---

## Part 3: Cloud Deployment

### Exercise 3.1: Railway

Folder:

```powershell
cd 03-cloud-deployment/railway
```

Important files:

- `app.py`: Railway-ready FastAPI app.
- `railway.toml`: Railway deployment config.
- `requirements.txt`: Python dependencies.

Railway config highlights:

- Uses Nixpacks.
- Starts with:
  - `uvicorn app:app --host 0.0.0.0 --port $PORT`
- Health check path:
  - `/health`

Deploy commands:

```bash
railway login
railway init
railway up
railway domain
```

Test:

```bash
curl https://your-railway-domain/health
curl https://your-railway-domain/ask \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"question":"Hello from Railway"}'
```

### Exercise 3.2: Render

Folder:

```powershell
cd 03-cloud-deployment/render
```

Important files:

- `app.py`: Render-ready FastAPI app.
- `requirements.txt`: Python dependencies.
- `render.yaml`: Render Blueprint.

Render config highlights:

- `rootDir: 03-cloud-deployment/render`
- `buildCommand: pip install -r requirements.txt`
- `startCommand: uvicorn app:app --host 0.0.0.0 --port $PORT`
- `healthCheckPath: /health`
- Includes a Redis service definition for the stack.

Comparison:

| Topic | Railway | Render |
|---|---|---|
| Config file | `railway.toml` | `render.yaml` |
| Deployment style | CLI/project-based | Blueprint/IaC |
| Start command | `startCommand` in TOML | `startCommand` in YAML |
| Health check | `healthcheckPath` | `healthCheckPath` |
| Env vars | Railway dashboard/CLI | Blueprint/dashboard |

### Exercise 3.3: Cloud Run and CI/CD

Folder:

```powershell
cd 03-cloud-deployment/production-cloud-run
```

Important files:

- `service.yaml`: Cloud Run service definition.
- `cloudbuild.yaml`: CI/CD pipeline.

Cloud Build pipeline:

1. Install requirements and compile the production Docker app.
2. Build Docker image from `02-docker/production/Dockerfile`.
3. Push image to `gcr.io/$PROJECT_ID/ai-agent`.
4. Replace the placeholder image in `service.yaml`.
5. Deploy with `gcloud run services replace`.
6. Add public invoker access.

Run from repo root:

```bash
gcloud builds submit \
  --config 03-cloud-deployment/production-cloud-run/cloudbuild.yaml .
```

### Checkpoint 3

- Railway is fastest for demos and prototypes.
- Render is good for GitHub-connected blueprints.
- Cloud Run is better for production container workloads.
- All platforms need correct `PORT`, env vars, logs, and health checks.

---

## Part 4: API Security

### Exercise 4.1: API Key Authentication

Folder:

```powershell
cd 04-api-gateway/develop
```

Where the key is checked:

- `verify_api_key()` reads the `X-API-Key` header.
- It compares the header against `AGENT_API_KEY`.

Behavior:

- Missing key returns `401`.
- Wrong key returns `403`.
- Correct key allows `/ask`.

Run:

```powershell
$env:AGENT_API_KEY="my-secret-key"
..\.venv\Scripts\python.exe app.py
```

Test without key:

```powershell
Invoke-RestMethod http://localhost:8000/ask `
  -Method Post `
  -ContentType "application/json" `
  -Body '{"question":"Hello"}'
```

Test with key:

```powershell
Invoke-RestMethod http://localhost:8000/ask `
  -Method Post `
  -Headers @{"X-API-Key"="my-secret-key"} `
  -ContentType "application/json" `
  -Body '{"question":"Hello"}'
```

How to rotate key:

- Generate a new value.
- Update `AGENT_API_KEY` in the environment or cloud dashboard.
- Restart/redeploy the service.
- Revoke the old key from clients.

### Exercise 4.2: JWT Authentication

Folder:

```powershell
cd 04-api-gateway/production
```

JWT flow:

1. Client posts username/password to `/auth/token`.
2. Server validates credentials in `auth.py`.
3. Server returns a signed JWT containing `sub`, `role`, `iat`, and `exp`.
4. Client sends `Authorization: Bearer <token>` on protected requests.
5. Server verifies the signature and expiry.

Run:

```powershell
$env:JWT_SECRET="dev-secret-change-me"
..\.venv\Scripts\python.exe app.py
```

Get token:

```powershell
$tokenResponse = Invoke-RestMethod http://localhost:8000/auth/token `
  -Method Post `
  -ContentType "application/json" `
  -Body '{"username":"student","password":"demo123"}'

$token = $tokenResponse.access_token
```

Use token:

```powershell
Invoke-RestMethod http://localhost:8000/ask `
  -Method Post `
  -Headers @{Authorization="Bearer $token"} `
  -ContentType "application/json" `
  -Body '{"question":"Explain JWT"}'
```

### Exercise 4.3: Rate Limiting

Algorithm used:

- Token bucket.

Limits:

- User:
  - Burst capacity: 10 requests.
  - Refill rate: 10 requests/minute.
- Admin:
  - Burst capacity: 100 requests.
  - Refill rate: 100 requests/minute.

Admin bypass:

- Admin does not bypass the limiter completely.
- Admin gets a larger bucket through role-based selection.

Test idea:

```powershell
for ($i = 1; $i -le 20; $i++) {
  Invoke-RestMethod http://localhost:8000/ask `
    -Method Post `
    -Headers @{Authorization="Bearer $token"} `
    -ContentType "application/json" `
    -Body "{`"question`":`"Test $i`"}"
}
```

Expected observation:

- After the bucket is empty, the API returns `429 Rate limit exceeded`.
- Response includes `Retry-After`.

### Exercise 4.4: Cost Guard

Implemented behavior:

- Per-user daily budget: `$1/day`.
- Global daily budget: `$10/day`.
- Token abuse guard: `1000 tokens/minute/user`.
- Usage is tracked in memory for the lab demo.
- In production, the same counters should be stored in Redis or a database.

Important functions:

- `check_budget(user_id)`
- `check_token_budget(user_id, estimated_tokens)`
- `record_usage(user_id, input_tokens, output_tokens)`
- `get_usage(user_id)`

Production Redis approach:

```python
import redis
from datetime import datetime

r = redis.Redis()

def check_budget(user_id: str, estimated_cost: float) -> bool:
    month_key = datetime.now().strftime("%Y-%m")
    key = f"budget:{user_id}:{month_key}"

    current = float(r.get(key) or 0)
    if current + estimated_cost > 10:
        return False

    r.incrbyfloat(key, estimated_cost)
    r.expire(key, 32 * 24 * 3600)
    return True
```

### Checkpoint 4

- API Key is simpler and suitable for internal/B2B APIs.
- JWT is better for user identity, roles, and expiry.
- Rate limiting protects availability.
- Cost guard protects against unexpected LLM bills and abuse.

---

## Part 5: Scaling & Reliability

### Exercise 5.1: Health Checks

Folder:

```powershell
cd 05-scaling-reliability/develop
```

Implemented endpoints:

- `GET /health`
  - Liveness probe.
  - Returns status, uptime, version, environment, timestamp, and dependency checks.
- `GET /ready`
  - Readiness probe.
  - Returns `503` if the app is starting or shutting down.

Example:

```powershell
Invoke-RestMethod http://localhost:8000/health
Invoke-RestMethod http://localhost:8000/ready
```

### Exercise 5.2: Graceful Shutdown

Implemented behavior:

- Tracks in-flight requests with middleware.
- On shutdown, readiness is set to false.
- The app waits up to 30 seconds for in-flight requests.
- `SIGTERM` and `SIGINT` are logged.
- Uvicorn is configured with `timeout_graceful_shutdown=30`.

Why it matters:

- Rolling deploys and container restarts should not interrupt active requests.

### Exercise 5.3: Stateless Design

In `05-scaling-reliability/production/app.py`:

- Conversation state is not stored only in process memory.
- Session history is stored in Redis using keys such as:
  - `session:{session_id}`
- Any instance can serve the next request because all instances read from the same Redis store.

Local fallback:

- If Redis is unavailable and `REQUIRE_REDIS=false`, the app can fall back to memory for local demos.

Production behavior:

- Docker Compose sets `REQUIRE_REDIS=true`, so missing Redis fails fast.

### Exercise 5.4: Load Balancing

Production stack:

```text
Client
  |
  v
Nginx :8080
  |
  +--> agent1 :8000
  +--> agent2 :8000
  +--> agent3 :8000
  |
  v
Redis :6379
```

Important files:

- `05-scaling-reliability/production/docker-compose.yml`
- `05-scaling-reliability/production/nginx.conf`

Services:

- `agent1`
- `agent2`
- `agent3`
- `redis`
- `nginx`

Nginx strategy:

- Uses `least_conn`.
- Retries failed upstreams.
- Proxies `/health`, `/ready`, and app endpoints.

Run:

```powershell
cd 05-scaling-reliability/production
docker compose up --build
```

Test:

```powershell
Invoke-RestMethod http://localhost:8080/health
Invoke-RestMethod http://localhost:8080/ready
```

### Exercise 5.5: Test Stateless

Run:

```powershell
cd 05-scaling-reliability/production
..\.venv\Scripts\python.exe test_stateless.py
```

What the script verifies:

1. Creates a new session.
2. Sends multiple requests through Nginx.
3. Observes `served_by` to see which instance handled the request.
4. Fetches conversation history by session ID.
5. Confirms history is preserved across instances via Redis.

### Checkpoint 5

- `/health` tells the platform the process is alive.
- `/ready` tells the load balancer the instance can receive traffic.
- Graceful shutdown prevents interrupted requests.
- Stateless design enables horizontal scaling.
- Nginx distributes requests across multiple agent instances.
- Redis is the shared state layer for session history.

---

## Summary

Parts 1 to 5 demonstrate the path from a local-only AI agent to a production-ready service:

1. Remove localhost assumptions and hardcoded config.
2. Package the app with Docker.
3. Deploy with cloud-specific config.
4. Protect public APIs with authentication, rate limiting, and cost guard.
5. Make the system reliable and horizontally scalable with health checks, graceful shutdown, stateless design, Redis, and Nginx load balancing.
