"use client"

import { Trophy, XCircle, CheckCircle2, Lightbulb, BookOpen, RefreshCw, Plus, TrendingUp, TrendingDown, Target } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import type { Exam, GradingResult } from "@/lib/types"

interface GradingResultsProps {
  result: GradingResult
  exam: Exam
  answers: Record<number, string>
  onRetake: () => void
  onNewExam: () => void
}

export function GradingResults({ result, exam, answers, onRetake, onNewExam }: GradingResultsProps) {
  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-600 dark:text-green-400"
    if (percentage >= 60) return "text-yellow-600 dark:text-yellow-400"
    return "text-red-600 dark:text-red-400"
  }

  const getScoreBg = (percentage: number) => {
    if (percentage >= 80) return "bg-green-500/10 border-green-500/20"
    if (percentage >= 60) return "bg-yellow-500/10 border-yellow-500/20"
    return "bg-red-500/10 border-red-500/20"
  }

  const getGrade = (percentage: number) => {
    if (percentage >= 90) return "A+"
    if (percentage >= 80) return "A"
    if (percentage >= 70) return "B"
    if (percentage >= 60) return "C"
    if (percentage >= 50) return "D"
    return "F"
  }

  return (
    <div className="space-y-6">
      {/* Score Overview */}
      <Card className={`border-2 ${getScoreBg(result.percentage)}`}>
        <CardContent className="py-6">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
            <div className="flex items-center gap-4">
              <div className={`flex h-16 w-16 items-center justify-center rounded-2xl ${
                result.percentage >= 70 ? "bg-green-500/20" : result.percentage >= 50 ? "bg-yellow-500/20" : "bg-red-500/20"
              }`}>
                <Trophy className={`h-8 w-8 ${getScoreColor(result.percentage)}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Your Score</p>
                <p className={`text-4xl font-bold ${getScoreColor(result.percentage)}`}>
                  {result.percentage}%
                </p>
                <p className="text-sm text-muted-foreground">
                  {result.score} out of {result.totalQuestions} correct
                </p>
              </div>
            </div>
            <div className="text-center sm:text-right">
              <p className="text-sm font-medium text-muted-foreground">Grade</p>
              <p className={`text-5xl font-bold ${getScoreColor(result.percentage)}`}>
                {getGrade(result.percentage)}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <Progress 
              value={result.percentage} 
              className="h-3"
            />
          </div>
        </CardContent>
      </Card>

      {/* Performance Summary */}
      <div className="grid gap-4 sm:grid-cols-2">
        {result.strongAreas.length > 0 && (
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <TrendingUp className="h-4 w-4 text-green-500" />
                Strong Areas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {result.strongAreas.map((area) => (
                  <Badge key={area} variant="outline" className="border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-400">
                    {area}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
        
        {result.weakAreas.length > 0 && (
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <TrendingDown className="h-4 w-4 text-red-500" />
                Areas to Improve
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {result.weakAreas.map((area) => (
                  <Badge key={area} variant="outline" className="border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-400">
                    {area}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Study Advice */}
      <Card className="border-border">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Personalized Study Advice
          </CardTitle>
          <CardDescription>Based on your performance</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {result.studyAdvice.map((advice, index) => (
              <li key={index} className="flex items-start gap-3">
                <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-yellow-500" />
                <span className="text-sm text-foreground">{advice}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Question Review */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            Question Review
          </CardTitle>
          <CardDescription>Review your answers and learn from mistakes</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {exam.questions.map((question, index) => {
              const questionResult = result.questionResults[index]
              const userAnswer = answers[question.id]
              
              return (
                <AccordionItem key={question.id} value={`question-${question.id}`}>
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3 text-left">
                      {questionResult.isCorrect ? (
                        <CheckCircle2 className="h-5 w-5 shrink-0 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 shrink-0 text-red-500" />
                      )}
                      <span className="text-sm font-medium">
                        Question {index + 1}: {question.text.slice(0, 60)}...
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pl-8">
                      <p className="text-sm text-foreground">{question.text}</p>
                      
                      <div className="space-y-2">
                        {(["A", "B", "C", "D"] as const).map((option) => {
                          const isCorrect = option === question.correctAnswer
                          const isUserAnswer = option === userAnswer
                          
                          return (
                            <div
                              key={option}
                              className={`flex items-center gap-2 rounded-lg border p-2 text-sm ${
                                isCorrect
                                  ? "border-green-500/50 bg-green-500/10"
                                  : isUserAnswer && !isCorrect
                                  ? "border-red-500/50 bg-red-500/10"
                                  : "border-border"
                              }`}
                            >
                              <span className="font-medium text-muted-foreground">{option}.</span>
                              <span className="text-foreground">{question.options[option]}</span>
                              {isCorrect && (
                                <Badge variant="outline" className="ml-auto border-green-500/50 text-green-600">
                                  Correct
                                </Badge>
                              )}
                              {isUserAnswer && !isCorrect && (
                                <Badge variant="outline" className="ml-auto border-red-500/50 text-red-600">
                                  Your Answer
                                </Badge>
                              )}
                            </div>
                          )
                        })}
                      </div>

                      <div className="rounded-lg bg-secondary/50 p-3">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Explanation</p>
                        <p className="text-sm text-foreground">{question.explanation}</p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )
            })}
          </Accordion>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button variant="outline" onClick={onRetake} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Retake Exam
        </Button>
        <Button onClick={onNewExam} className="gap-2">
          <Plus className="h-4 w-4" />
          Generate New Exam
        </Button>
      </div>
    </div>
  )
}
