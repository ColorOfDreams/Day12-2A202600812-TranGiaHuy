"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { ExamGenerator } from "@/components/exam-generator"
import { ExamView } from "@/components/exam-view"
import { GradingResults } from "@/components/grading-results"
import { ModeComparison } from "@/components/mode-comparison"
import { AgentTrace } from "@/components/agent-trace"
import type { AiProvider, Exam, ExamDifficulty, GradingResult, AgentTraceStep } from "@/lib/types"
import { generateAgentTrace } from "@/lib/mock-data"
import { apiHeaders } from "@/lib/api-client"

export default function Home() {
  const [activeMode, setActiveMode] = useState<"llm" | "agent">("llm")
  const [currentView, setCurrentView] = useState<"generate" | "exam" | "results">("generate")
  const [exam, setExam] = useState<Exam | null>(null)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [gradingResult, setGradingResult] = useState<GradingResult | null>(null)
  const [agentTrace, setAgentTrace] = useState<AgentTraceStep[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [isGrading, setIsGrading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGenerateExam = async (config: {
    subject: string
    topic: string
    difficulty: ExamDifficulty
    questionCount: number
    provider: AiProvider
  }) => {
    setIsGenerating(true)
    setError(null)

    try {
      const response = await fetch("/api/exams/generate", {
        method: "POST",
        headers: apiHeaders(),
        body: JSON.stringify({ ...config, mode: activeMode }),
      })

      if (!response.ok) {
        throw new Error("Could not generate exam")
      }

      const data = await response.json()

      if (activeMode === "agent") {
        const trace = generateAgentTrace("generate", config)
        setAgentTrace(trace)
      }

      setExam(data.exam)
      setAnswers({})
      setGradingResult(null)
      setCurrentView("exam")
      if (data.warning) setError(data.warning)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not generate exam")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleAnswerChange = (questionId: number, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }))
  }

  const handleSubmitExam = async () => {
    if (!exam) return
    
    setIsGrading(true)
    setError(null)

    try {
      const response = await fetch("/api/exams/grade", {
        method: "POST",
        headers: apiHeaders(),
        body: JSON.stringify({ exam, answers }),
      })

      if (!response.ok) {
        throw new Error("Could not grade exam")
      }

      if (activeMode === "agent") {
        const trace = generateAgentTrace("grade", { exam, answers })
        setAgentTrace(trace)
      }

      const data = await response.json()
      setGradingResult(data.result)
      setCurrentView("results")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not grade exam")
    } finally {
      setIsGrading(false)
    }
  }

  const handleBackToGenerator = () => {
    setCurrentView("generate")
    setExam(null)
    setAnswers({})
    setGradingResult(null)
    setAgentTrace([])
  }

  const handleRetakeExam = () => {
    setCurrentView("exam")
    setAnswers({})
    setGradingResult(null)
    setAgentTrace([])
  }

  return (
    <div className="min-h-screen bg-background">
      <Header activeMode={activeMode} onModeChange={setActiveMode} />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {error && (
          <div className="mb-6 rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-4 text-sm text-yellow-800 dark:text-yellow-200">
            {error}
          </div>
        )}

        {currentView === "generate" && (
          <div className="space-y-8">
            <ExamGenerator
              onGenerate={handleGenerateExam}
              isGenerating={isGenerating}
              activeMode={activeMode}
            />
            <ModeComparison />
          </div>
        )}

        {currentView === "exam" && exam && (
          <ExamView
            exam={exam}
            answers={answers}
            onAnswerChange={handleAnswerChange}
            onSubmit={handleSubmitExam}
            onBack={handleBackToGenerator}
            isGrading={isGrading}
            activeMode={activeMode}
          />
        )}

        {currentView === "results" && gradingResult && exam && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <GradingResults
                result={gradingResult}
                exam={exam}
                answers={answers}
                onRetake={handleRetakeExam}
                onNewExam={handleBackToGenerator}
              />
            </div>
            {activeMode === "agent" && agentTrace.length > 0 && (
              <div className="lg:col-span-1">
                <AgentTrace trace={agentTrace} />
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
