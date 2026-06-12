import type { AiProvider, Exam, ExamDifficulty, ExamGenerationRequest } from "@/lib/types"

const providers: AiProvider[] = ["sample", "openai", "gemini"]
const difficulties: ExamDifficulty[] = ["easy", "medium", "hard"]

export function parseExamGenerationRequest(value: unknown): ExamGenerationRequest {
  const body = value as Partial<ExamGenerationRequest>

  if (!body.subject || !body.topic) {
    throw new Error("Subject and topic are required")
  }

  if (!body.difficulty || !difficulties.includes(body.difficulty)) {
    throw new Error("Difficulty must be easy, medium, or hard")
  }

  if (!body.provider || !providers.includes(body.provider)) {
    throw new Error("Provider must be sample, openai, or gemini")
  }

  const questionCount = Number(body.questionCount)
  if (!Number.isInteger(questionCount) || questionCount < 3 || questionCount > 10) {
    throw new Error("Question count must be between 3 and 10")
  }

  return {
    subject: String(body.subject),
    topic: String(body.topic),
    difficulty: body.difficulty,
    provider: body.provider,
    questionCount,
    mode: body.mode === "agent" ? "agent" : "llm",
  }
}

export function parseGradeRequest(value: unknown) {
  const body = value as {
    exam?: Exam
    answers?: Record<number, string>
  }

  if (!body.exam || !Array.isArray(body.exam.questions)) {
    throw new Error("Exam with questions is required")
  }

  if (body.exam.questions.length < 1 || body.exam.questions.length > 50) {
    throw new Error("Exam question count is outside the allowed range")
  }

  if (!body.answers || typeof body.answers !== "object") {
    throw new Error("Answers are required")
  }

  return {
    exam: body.exam,
    answers: body.answers,
  }
}
