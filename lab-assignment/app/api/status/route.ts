import { NextResponse } from "next/server"
import { runtimeStatus } from "@/lib/server/runtime"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export function GET() {
  return NextResponse.json(runtimeStatus(), {
    headers: {
      "Cache-Control": "no-store",
    },
  })
}
