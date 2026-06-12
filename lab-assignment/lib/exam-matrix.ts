import type { CognitiveLevel, ExamDifficulty } from "./types"

export const cognitiveLevelLabels: Record<CognitiveLevel, string> = {
  recognition: "Nhan biet",
  understanding: "Thong hieu",
  application: "Van dung",
  advanced_application: "Van dung cao",
}

export const examMatrix: Record<ExamDifficulty, Record<CognitiveLevel, number>> = {
  easy: {
    recognition: 40,
    understanding: 40,
    application: 20,
    advanced_application: 0,
  },
  medium: {
    recognition: 30,
    understanding: 30,
    application: 15,
    advanced_application: 5,
  },
  hard: {
    recognition: 20,
    understanding: 30,
    application: 30,
    advanced_application: 20,
  },
}

export function allocateQuestionCounts(
  difficulty: ExamDifficulty,
  questionCount: number,
): Record<CognitiveLevel, number> {
  const weights = examMatrix[difficulty]
  const totalWeight = Object.values(weights).reduce((sum, value) => sum + value, 0)
  const raw = Object.entries(weights).map(([level, weight]) => {
    const exact = totalWeight === 0 ? 0 : (questionCount * weight) / totalWeight
    return {
      level: level as CognitiveLevel,
      base: Math.floor(exact),
      remainder: exact - Math.floor(exact),
    }
  })

  let remaining = questionCount - raw.reduce((sum, item) => sum + item.base, 0)
  const sorted = [...raw].sort((a, b) => b.remainder - a.remainder)

  for (const item of sorted) {
    if (remaining <= 0) break
    item.base += 1
    remaining -= 1
  }

  return sorted.reduce(
    (acc, item) => {
      acc[item.level] = item.base
      return acc
    },
    {
      recognition: 0,
      understanding: 0,
      application: 0,
      advanced_application: 0,
    } as Record<CognitiveLevel, number>,
  )
}
