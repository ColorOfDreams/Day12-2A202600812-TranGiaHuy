import { NextResponse } from "next/server"
import { gradeExamAnswers } from "@/lib/question-service"
import { requireApiAccess } from "@/lib/server/api-auth"
import { enforceRateLimit } from "@/lib/server/rate-limiter"
import { parseGradeRequest } from "@/lib/server/request-validation"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function POST(request: Request) {
  const authResponse = requireApiAccess(request)
  if (authResponse) return authResponse

  const rateLimitResponse = enforceRateLimit(request, "exam-grade")
  if (rateLimitResponse) return rateLimitResponse

  let body
  try {
    body = parseGradeRequest(await request.json())
  } catch (error) {
    return NextResponse.json(
      {
        error: "Invalid request",
        message: error instanceof Error ? error.message : "Invalid request body",
      },
      { status: 400 },
    )
  }

  return NextResponse.json({
    result: gradeExamAnswers(body.exam, body.answers),
  }, { headers: { "Cache-Control": "no-store" } })
}
