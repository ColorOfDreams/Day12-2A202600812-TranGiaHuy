import { allocateQuestionCounts, cognitiveLevelLabels } from "./exam-matrix"
import type { Exam, ExamGenerationRequest, Question } from "./types"

type LlmResponse = {
  questions: Question[]
}

const requestTimeoutMs = Number(process.env.AI_PROVIDER_TIMEOUT_MS || 25_000)

function buildPrompt(config: ExamGenerationRequest, seedQuestions: Question[]) {
  const allocation = allocateQuestionCounts(config.difficulty, config.questionCount)

  return `Create a Grade 12 multiple-choice exam as strict JSON.

Form:
- subject: ${config.subject}
- topic: ${config.topic}
- difficulty: ${config.difficulty}
- questionCount: ${config.questionCount}
- mode: ${config.mode}

Exam matrix question counts:
${Object.entries(allocation)
  .map(([level, count]) => `- ${cognitiveLevelLabels[level as keyof typeof cognitiveLevelLabels]}: ${count}`)
  .join("\n")}

Use the seed question bank as source style and topic grounding:
${JSON.stringify(seedQuestions.slice(0, 12), null, 2)}

Return only JSON with this shape:
{
  "questions": [
    {
      "id": 1,
      "subject": "${config.subject}",
      "topic": "${config.topic}",
      "difficulty": "${config.difficulty}",
      "cognitiveLevel": "recognition",
      "text": "...",
      "options": { "A": "...", "B": "...", "C": "...", "D": "..." },
      "correctAnswer": "A",
      "explanation": "..."
    }
  ]
}`
}

function parseJson(text: string): LlmResponse {
  const cleaned = text.replace(/```json|```/g, "").trim()
  const parsed = JSON.parse(cleaned) as LlmResponse
  if (!Array.isArray(parsed.questions)) {
    throw new Error("Provider did not return a questions array")
  }
  return parsed
}

export async function generateWithOpenAI(config: ExamGenerationRequest, seedQuestions: Question[]): Promise<Exam> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not configured")
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are an exam generation service. Return strict JSON only." },
        { role: "user", content: buildPrompt(config, seedQuestions) },
      ],
      temperature: 0.3,
    }),
    signal: AbortSignal.timeout(requestTimeoutMs),
  })

  if (!response.ok) {
    throw new Error(`OpenAI request failed: ${response.status}`)
  }

  const data = await response.json()
  const content = data.choices?.[0]?.message?.content
  if (!content) throw new Error("OpenAI returned an empty response")
  const result = parseJson(content)

  return {
    id: `exam-${Date.now()}`,
    subject: config.subject,
    topic: config.topic,
    difficulty: config.difficulty,
    questions: result.questions.slice(0, config.questionCount),
    createdAt: new Date().toISOString(),
    provider: "openai",
    matrix: allocateQuestionCounts(config.difficulty, config.questionCount),
  }
}

export async function generateWithGemini(config: ExamGenerationRequest, seedQuestions: Question[]): Promise<Exam> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured")
  }

  const model = process.env.GEMINI_MODEL || "gemini-1.5-flash"
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: buildPrompt(config, seedQuestions) }] }],
        generationConfig: {
          temperature: 0.3,
          responseMimeType: "application/json",
        },
      }),
      signal: AbortSignal.timeout(requestTimeoutMs),
    },
  )

  if (!response.ok) {
    throw new Error(`Gemini request failed: ${response.status}`)
  }

  const data = await response.json()
  const content = data.candidates?.[0]?.content?.parts?.[0]?.text
  if (!content) throw new Error("Gemini returned an empty response")
  const result = parseJson(content)

  return {
    id: `exam-${Date.now()}`,
    subject: config.subject,
    topic: config.topic,
    difficulty: config.difficulty,
    questions: result.questions.slice(0, config.questionCount),
    createdAt: new Date().toISOString(),
    provider: "gemini",
    matrix: allocateQuestionCounts(config.difficulty, config.questionCount),
  }
}
