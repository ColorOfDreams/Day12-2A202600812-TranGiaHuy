import { NextResponse } from "next/server"

type Bucket = {
  tokens: number
  updatedAt: number
}

const buckets = new Map<string, Bucket>()

function getClientId(request: Request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "local"
  )
}

export function enforceRateLimit(request: Request, scope: string) {
  if (process.env.RATE_LIMIT_ENABLED === "false") return null

  const capacity = Number(process.env.RATE_LIMIT_REQUESTS_PER_MINUTE || 30)
  const refillPerMs = capacity / 60_000
  const now = Date.now()
  const key = `${scope}:${getClientId(request)}`
  const bucket = buckets.get(key) || { tokens: capacity, updatedAt: now }
  const refilled = Math.min(capacity, bucket.tokens + (now - bucket.updatedAt) * refillPerMs)

  if (refilled < 1) {
    buckets.set(key, { tokens: refilled, updatedAt: now })
    return NextResponse.json(
      {
        error: "Rate limit exceeded",
        message: "Too many requests. Please retry later.",
      },
      {
        status: 429,
        headers: {
          "Retry-After": "60",
          "X-RateLimit-Limit": String(capacity),
          "X-RateLimit-Remaining": "0",
        },
      },
    )
  }

  buckets.set(key, { tokens: refilled - 1, updatedAt: now })
  return null
}
