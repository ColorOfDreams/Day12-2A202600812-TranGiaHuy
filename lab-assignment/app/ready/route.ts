import { NextResponse } from "next/server"
import { getPublicConfig } from "@/lib/config"
import { runtimeStatus } from "@/lib/server/runtime"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export function GET() {
  const config = getPublicConfig()
  const openAiReady = Boolean(process.env.OPENAI_API_KEY)
  const geminiReady = Boolean(process.env.GEMINI_API_KEY)
  const gatewayReady =
    process.env.API_GATEWAY_ENABLED === "false" ||
    Boolean(process.env.API_GATEWAY_KEY || process.env.APP_API_KEY || process.env.JWT_SECRET) ||
    process.env.API_GATEWAY_ALLOW_SAME_ORIGIN !== "false"

  return NextResponse.json({
    ready: true,
    service: config.name,
    environment: config.environment,
    checks: {
      config: "ok",
      questionBank: "ok",
      openai: openAiReady ? "configured" : "not-configured",
      gemini: geminiReady ? "configured" : "not-configured",
      apiGateway: gatewayReady ? "ok" : "missing-secret",
      stateless: "ok",
    },
    runtime: runtimeStatus(),
    timestamp: new Date().toISOString(),
  }, { headers: { "Cache-Control": "no-store" } })
}
