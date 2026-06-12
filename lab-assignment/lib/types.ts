export type CognitiveLevel = "recognition" | "understanding" | "application" | "advanced_application"

export type ExamDifficulty = "easy" | "medium" | "hard"

export type AiProvider = "sample" | "openai" | "gemini"

export interface Question {
  id: number
  text: string
  options: {
    A: string
    B: string
    C: string
    D: string
  }
  correctAnswer: "A" | "B" | "C" | "D"
  explanation: string
  topic: string
  subject?: string
  difficulty?: ExamDifficulty
  cognitiveLevel?: CognitiveLevel
}

export interface Exam {
  id: string
  subject: string
  topic: string
  difficulty: ExamDifficulty
  questions: Question[]
  createdAt: string | Date
  provider?: AiProvider
  matrix?: Record<CognitiveLevel, number>
}

export interface QuestionResult {
  questionId: number
  isCorrect: boolean
  userAnswer: string | null
  correctAnswer: string
  explanation: string
}

export interface GradingResult {
  score: number
  totalQuestions: number
  percentage: number
  questionResults: QuestionResult[]
  studyAdvice: string[]
  weakAreas: string[]
  strongAreas: string[]
}

export interface AgentTraceStep {
  type: "thought" | "action" | "observation" | "validation"
  content: string
  timestamp: Date
  status?: "success" | "warning" | "error"
}

export interface ExamGenerationRequest {
  subject: string
  topic: string
  difficulty: ExamDifficulty
  questionCount: number
  provider: AiProvider
  mode: "llm" | "agent"
}
