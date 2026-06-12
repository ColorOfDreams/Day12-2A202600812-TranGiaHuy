"use client"

import { useEffect, useMemo, useState } from "react"
import { BookOpen, GraduationCap, BarChart3, Hash, Loader2, Sparkles, Cpu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { examMatrix, cognitiveLevelLabels } from "@/lib/exam-matrix"
import type { AiProvider, CognitiveLevel, ExamDifficulty } from "@/lib/types"

interface ExamGeneratorProps {
  onGenerate: (config: {
    subject: string
    topic: string
    difficulty: ExamDifficulty
    questionCount: number
    provider: AiProvider
  }) => void
  isGenerating: boolean
  activeMode: "llm" | "agent"
}

const subjects = [
  { value: "Physics", label: "Physics", icon: "⚛️" },
  { value: "Chemistry", label: "Chemistry", icon: "🧪" },
  { value: "Mathematics", label: "Mathematics", icon: "📐" },
  { value: "Biology", label: "Biology", icon: "🧬" },
]

const topicsBySubject: Record<string, string[]> = {
  Physics: ["Mechanics", "Waves & Optics", "Electricity & Magnetism", "Thermodynamics", "Modern Physics"],
  Chemistry: ["Organic Chemistry", "Inorganic Chemistry", "Physical Chemistry", "Biochemistry", "Electrochemistry"],
  Mathematics: ["Calculus", "Algebra", "Trigonometry", "Statistics & Probability", "Coordinate Geometry"],
  Biology: ["Cell Biology", "Genetics", "Human Physiology", "Ecology", "Evolution"],
}

const difficulties = [
  { value: "easy", label: "Easy", description: "80% recognition/understanding, 20% application" },
  { value: "medium", label: "Medium", description: "60% recognition/understanding, 15% application, 5% advanced" },
  { value: "hard", label: "Hard", description: "20% recognition, 30% understanding, 30% application, 20% advanced" },
]

const providers: Array<{ value: AiProvider; label: string; description: string }> = [
  { value: "sample", label: "Sample Bank", description: "Use backend data only" },
  { value: "openai", label: "OpenAI", description: "Use OPENAI_API_KEY" },
  { value: "gemini", label: "Gemini", description: "Use GEMINI_API_KEY" },
]

export function ExamGenerator({ onGenerate, isGenerating, activeMode }: ExamGeneratorProps) {
  const [subject, setSubject] = useState("Physics")
  const [topic, setTopic] = useState("Mechanics")
  const [difficulty, setDifficulty] = useState<ExamDifficulty>("medium")
  const [questionCount, setQuestionCount] = useState(5)
  const [provider, setProvider] = useState<AiProvider>("sample")
  const [subjectOptions, setSubjectOptions] = useState(subjects)
  const [topicOptions, setTopicOptions] = useState(topicsBySubject)

  useEffect(() => {
    async function loadSubjects() {
      const response = await fetch("/api/subjects")
      if (!response.ok) return
      const data = await response.json()
      const nextSubjects = data.subjects.map((item: { name: string }) => ({
        value: item.name,
        label: item.name,
        icon: "",
      }))
      const nextTopics = data.subjects.reduce(
        (acc: Record<string, string[]>, item: { name: string; topics: string[] }) => {
          acc[item.name] = item.topics
          return acc
        },
        {},
      )

      if (nextSubjects.length > 0) {
        setSubjectOptions(nextSubjects)
        setTopicOptions(nextTopics)
      }
    }

    loadSubjects().catch(() => undefined)
  }, [])

  const matrixRows = useMemo(
    () =>
      Object.entries(examMatrix[difficulty]).map(([level, percent]) => ({
        level: level as CognitiveLevel,
        percent,
      })),
    [difficulty],
  )

  const handleGenerate = () => {
    onGenerate({ subject, topic, difficulty, questionCount, provider })
  }

  return (
    <Card className="border-border shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            <GraduationCap className="h-6 w-6 text-primary" />
          </div>
          <div>
            <CardTitle className="text-2xl">Generate New Exam</CardTitle>
            <CardDescription>
              Configure your exam parameters and let AI create a customized assessment
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-6 sm:grid-cols-2">
          {/* Subject Selection */}
          <div className="space-y-2">
            <Label htmlFor="subject" className="flex items-center gap-2 text-sm font-medium">
              <BookOpen className="h-4 w-4 text-muted-foreground" />
              Subject
            </Label>
            <Select value={subject} onValueChange={(val) => {
              setSubject(val)
              setTopic(topicOptions[val]?.[0] || "")
            }}>
              <SelectTrigger id="subject" className="h-11">
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent>
                {subjectOptions.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    <span className="flex items-center gap-2">
                      {s.icon && <span>{s.icon}</span>}
                      <span>{s.label}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Topic Selection */}
          <div className="space-y-2">
            <Label htmlFor="topic" className="flex items-center gap-2 text-sm font-medium">
              <Sparkles className="h-4 w-4 text-muted-foreground" />
              Topic
            </Label>
            <Select value={topic} onValueChange={setTopic}>
              <SelectTrigger id="topic" className="h-11">
                <SelectValue placeholder="Select topic" />
              </SelectTrigger>
              <SelectContent>
                {(topicOptions[subject] || []).map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Difficulty Selection */}
          <div className="space-y-2">
            <Label htmlFor="difficulty" className="flex items-center gap-2 text-sm font-medium">
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
              Difficulty
            </Label>
            <Select value={difficulty} onValueChange={(value) => setDifficulty(value as ExamDifficulty)}>
              <SelectTrigger id="difficulty" className="h-11">
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                {difficulties.map((d) => (
                  <SelectItem key={d.value} value={d.value}>
                    <span className="flex flex-col">
                      <span>{d.label}</span>
                      <span className="text-xs text-muted-foreground">{d.description}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="provider" className="flex items-center gap-2 text-sm font-medium">
              <Cpu className="h-4 w-4 text-muted-foreground" />
              Backend Provider
            </Label>
            <Select value={provider} onValueChange={(value) => setProvider(value as AiProvider)}>
              <SelectTrigger id="provider" className="h-11">
                <SelectValue placeholder="Select provider" />
              </SelectTrigger>
              <SelectContent>
                {providers.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    <span className="flex flex-col">
                      <span>{item.label}</span>
                      <span className="text-xs text-muted-foreground">{item.description}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Question Count */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <Hash className="h-4 w-4 text-muted-foreground" />
              Number of Questions: {questionCount}
            </Label>
            <div className="pt-2">
              <Slider
                value={[questionCount]}
                onValueChange={(val) => setQuestionCount(val[0])}
                min={3}
                max={10}
                step={1}
                className="w-full"
              />
              <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                <span>3</span>
                <span>10</span>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-secondary/30 p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-sm font-medium text-foreground">Exam Matrix</p>
            <span className="text-xs text-muted-foreground">{difficulty.toUpperCase()} profile</span>
          </div>
          <div className="grid gap-2 sm:grid-cols-4">
            {matrixRows.map((row) => (
              <div key={row.level} className="rounded-md border border-border bg-background p-3">
                <p className="text-xs text-muted-foreground">{cognitiveLevelLabels[row.level]}</p>
                <p className="text-lg font-semibold text-foreground">{row.percent}%</p>
              </div>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            {activeMode === "agent" 
              ? "Agent will validate questions and ensure quality"
              : "Quick generation with direct LLM response"
            }
          </p>
          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            size="lg"
            className="gap-2"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Generate Exam
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
