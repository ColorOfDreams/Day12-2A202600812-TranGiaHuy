import questionBank from "./question-bank.sample.json"
import { allocateQuestionCounts } from "./exam-matrix"
import type { CognitiveLevel, Exam, ExamGenerationRequest, Question } from "./types"

const questions = questionBank as Question[]

function shuffle<T>(items: T[]) {
  return [...items].sort(() => Math.random() - 0.5)
}

function byLevel(
  candidates: Question[],
  subject: string,
  topic: string,
  level: CognitiveLevel,
  limit: number,
) {
  if (limit <= 0) return []

  const exact = candidates.filter(
    (question) =>
      question.subject === subject &&
      question.topic === topic &&
      question.cognitiveLevel === level,
  )
  const sameSubject = candidates.filter(
    (question) =>
      question.subject === subject &&
      question.cognitiveLevel === level &&
      !exact.some((item) => item.id === question.id),
  )
  const fallback = candidates.filter(
    (question) =>
      question.cognitiveLevel === level &&
      !exact.some((item) => item.id === question.id) &&
      !sameSubject.some((item) => item.id === question.id),
  )

  return shuffle([...exact, ...sameSubject, ...fallback]).slice(0, limit)
}

export function listSubjects() {
  const subjects = Array.from(
    new Set(questions.map((question) => question.subject).filter((subject): subject is string => Boolean(subject))),
  )
  return subjects.map((subject) => ({
    id: subject.toLowerCase().replace(/\s+/g, "-"),
    name: subject,
    topics: Array.from(
      new Set(
        questions
          .filter((question) => question.subject === subject)
          .map((question) => question.topic),
      ),
    ),
  }))
}

export function buildExamFromQuestionBank(config: ExamGenerationRequest): Exam {
  const allocation = allocateQuestionCounts(config.difficulty, config.questionCount)
  const selected: Question[] = []

  for (const [level, count] of Object.entries(allocation)) {
    const nextQuestions = byLevel(
      questions,
      config.subject,
      config.topic,
      level as CognitiveLevel,
      count,
    )

    for (const question of nextQuestions) {
      if (!selected.some((item) => item.id === question.id)) {
        selected.push(question)
      }
    }
  }

  const topUp = shuffle(questions).filter((question) => !selected.some((item) => item.id === question.id))
  const finalQuestions = [...selected, ...topUp].slice(0, config.questionCount)

  return {
    id: `exam-${Date.now()}`,
    subject: config.subject,
    topic: config.topic,
    difficulty: config.difficulty,
    questions: finalQuestions,
    createdAt: new Date().toISOString(),
    provider: config.provider,
    matrix: allocation,
  }
}

export function gradeExamAnswers(exam: Exam, answers: Record<number, string>) {
  const questionResults = exam.questions.map((question) => {
    const userAnswer = answers[question.id] || null
    const isCorrect = userAnswer === question.correctAnswer

    return {
      questionId: question.id,
      isCorrect,
      userAnswer,
      correctAnswer: question.correctAnswer,
      explanation: question.explanation,
    }
  })

  const score = questionResults.filter((result) => result.isCorrect).length
  const percentage = exam.questions.length === 0 ? 0 : Math.round((score / exam.questions.length) * 100)
  const weakAreas = Array.from(
    new Set(exam.questions.filter((question, index) => !questionResults[index].isCorrect).map((question) => question.topic)),
  )
  const strongAreas = Array.from(
    new Set(exam.questions.filter((question, index) => questionResults[index].isCorrect).map((question) => question.topic)),
  )

  return {
    score,
    totalQuestions: exam.questions.length,
    percentage,
    questionResults,
    weakAreas,
    strongAreas,
    studyAdvice:
      percentage >= 80
        ? ["Review explanations for any missed questions and move to a harder matrix next."]
        : percentage >= 60
          ? ["Focus on weak topics, then retry with the same matrix before increasing difficulty."]
          : ["Rebuild core concepts first, then practice recognition and understanding questions before application questions."],
  }
}
