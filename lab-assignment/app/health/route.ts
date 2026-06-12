import { NextResponse } from "next/server"
import { getPublicConfig } from "@/lib/config"
import { runtimeStatus } from "@/lib/server/runtime"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export function GET() {
  return NextResponse.json({
    status: "ok",
    service: getPublicConfig().name,
    version: getPublicConfig().version,
    environment: getPublicConfig().environment,
    mockMode: getPublicConfig().mockMode,
    runtime: runtimeStatus(),
    timestamp: new Date().toISOString(),
  }, { headers: { "Cache-Control": "no-store" } })
}
