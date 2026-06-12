import { NextResponse } from "next/server"
import type { ExamGenerationRequest } from "@/lib/types"

type CostWindow = {
  tokens: number
  resetAt: number
}

const windows = new Map<string, CostWindow>()

function getClientId(request: Request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "local"
  )
}

export function estimateExamTokens(config: ExamGenerationRequest) {
  const baseTokens = config.provider === "sample" ? 80 : 280
  const providerMultiplier = config.provider === "sample" ? 35 : 120
  const modeMultiplier = config.mode === "agent" ? 1.3 : 1

  return Math.ceil((baseTokens + config.questionCount * providerMultiplier) * modeMultiplier)
}

export function enforceCostGuard(request: Request, config: ExamGenerationRequest) {
  if (process.env.COST_GUARD_ENABLED === "false") return null

  const limit = Number(process.env.COST_GUARD_TOKENS_PER_MINUTE || 1000)
  const now = Date.now()
  const key = getClientId(request)
  const window = windows.get(key)
  const activeWindow = window && window.resetAt > now ? window : { tokens: 0, resetAt: now + 60_000 }
  const estimatedTokens = estimateExamTokens(config)

  if (activeWindow.tokens + estimatedTokens > limit) {
    windows.set(key, activeWindow)

    return NextResponse.json(
      {
        error: "Cost guard blocked request",
        message: "Estimated token usage would exceed the per-minute budget.",
        estimatedTokens,
        remainingTokens: Math.max(0, limit - activeWindow.tokens),
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil((activeWindow.resetAt - now) / 1000)),
          "X-CostGuard-Limit": String(limit),
          "X-CostGuard-Estimated": String(estimatedTokens),
        },
      },
    )
  }

  windows.set(key, {
    tokens: activeWindow.tokens + estimatedTokens,
    resetAt: activeWindow.resetAt,
  })

  return null
}
