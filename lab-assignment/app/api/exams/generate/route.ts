import { NextResponse } from "next/server"
import questionBank from "@/lib/question-bank.sample.json"
import { generateWithGemini, generateWithOpenAI } from "@/lib/ai-exam-provider"
import { buildExamFromQuestionBank } from "@/lib/question-service"
import { requireApiAccess } from "@/lib/server/api-auth"
import { enforceCostGuard, estimateExamTokens } from "@/lib/server/cost-guard"
import { enforceRateLimit } from "@/lib/server/rate-limiter"
import { parseExamGenerationRequest } from "@/lib/server/request-validation"
import type { ExamGenerationRequest, Question } from "@/lib/types"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function POST(request: Request) {
  const authResponse = requireApiAccess(request)
  if (authResponse) return authResponse

  const rateLimitResponse = enforceRateLimit(request, "exam-generate")
  if (rateLimitResponse) return rateLimitResponse

  let config: ExamGenerationRequest
  try {
    config = parseExamGenerationRequest(await request.json())
  } catch (error) {
    return NextResponse.json(
      {
        error: "Invalid request",
        message: error instanceof Error ? error.message : "Invalid request body",
      },
      { status: 400 },
    )
  }

  const costGuardResponse = enforceCostGuard(request, config)
  if (costGuardResponse) return costGuardResponse

  const seedQuestions = questionBank as Question[]

  try {
    if (config.provider === "openai") {
      const exam = await generateWithOpenAI(config, seedQuestions)
      return NextResponse.json(
        { exam, source: "openai", estimatedTokens: estimateExamTokens(config) },
        { headers: { "Cache-Control": "no-store" } },
      )
    }

    if (config.provider === "gemini") {
      const exam = await generateWithGemini(config, seedQuestions)
      return NextResponse.json(
        { exam, source: "gemini", estimatedTokens: estimateExamTokens(config) },
        { headers: { "Cache-Control": "no-store" } },
      )
    }
  } catch (error) {
    const exam = buildExamFromQuestionBank({ ...config, provider: "sample" })
    return NextResponse.json(
      {
        exam,
        source: "sample",
        estimatedTokens: estimateExamTokens(config),
        warning: error instanceof Error ? error.message : "Provider failed, used sample bank",
      },
      { headers: { "Cache-Control": "no-store" } },
    )
  }

  const exam = buildExamFromQuestionBank(config)
  return NextResponse.json(
    { exam, source: "sample", estimatedTokens: estimateExamTokens(config) },
    { headers: { "Cache-Control": "no-store" } },
  )
}
