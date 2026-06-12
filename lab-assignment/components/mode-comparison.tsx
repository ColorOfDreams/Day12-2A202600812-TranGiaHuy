"use client"

import { Zap, Shield, MessageSquare, Clock, Brain, Bot, CheckCircle2, AlertCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const comparisonData = [
  {
    metric: "Response Speed",
    icon: Clock,
    llm: { value: "~1.5s", score: 5, label: "Very Fast" },
    agent: { value: "~2.5s", score: 3, label: "Moderate" },
    description: "Time to generate or grade an exam"
  },
  {
    metric: "Accuracy",
    icon: Zap,
    llm: { value: "92%", score: 4, label: "High" },
    agent: { value: "97%", score: 5, label: "Very High" },
    description: "Question quality and correctness"
  },
  {
    metric: "Validation",
    icon: Shield,
    llm: { value: "Basic", score: 2, label: "Limited" },
    agent: { value: "Full", score: 5, label: "Comprehensive" },
    description: "Answer verification and cross-checking"
  },
  {
    metric: "Feedback Quality",
    icon: MessageSquare,
    llm: { value: "Good", score: 3, label: "Standard" },
    agent: { value: "Excellent", score: 5, label: "Personalized" },
    description: "Depth of explanations and study advice"
  },
]

export function ModeComparison() {
  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          LLM vs Agent Mode Comparison
        </CardTitle>
        <CardDescription>
          Choose the mode that best fits your needs
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Mode Cards */}
        <div className="grid gap-4 sm:grid-cols-2 mb-6">
          <div className="rounded-xl border border-border bg-secondary/30 p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                <Brain className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">LLM Mode</h3>
                <p className="text-xs text-muted-foreground">Direct AI Response</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Fast, single-pass generation. Great for quick assessments and time-sensitive tasks.
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="text-xs">Fast</Badge>
              <Badge variant="outline" className="text-xs">Efficient</Badge>
              <Badge variant="outline" className="text-xs">Streamlined</Badge>
            </div>
          </div>

          <div className="rounded-xl border border-primary/30 bg-primary/5 p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Bot className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Agent Mode</h3>
                <p className="text-xs text-muted-foreground">Reasoned & Validated</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Multi-step reasoning with validation. Ideal for high-stakes exams and detailed feedback.
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="text-xs border-primary/30">Validated</Badge>
              <Badge variant="outline" className="text-xs border-primary/30">Thorough</Badge>
              <Badge variant="outline" className="text-xs border-primary/30">Traceable</Badge>
            </div>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="rounded-lg border border-border overflow-hidden">
          <div className="grid grid-cols-3 gap-4 p-3 bg-secondary/50 text-sm font-medium">
            <div className="text-muted-foreground">Metric</div>
            <div className="text-center flex items-center justify-center gap-1.5">
              <Brain className="h-4 w-4" />
              LLM
            </div>
            <div className="text-center flex items-center justify-center gap-1.5">
              <Bot className="h-4 w-4" />
              Agent
            </div>
          </div>
          
          {comparisonData.map((item, index) => (
            <div 
              key={item.metric} 
              className={`grid grid-cols-3 gap-4 p-3 text-sm ${
                index % 2 === 0 ? "bg-card" : "bg-secondary/20"
              }`}
            >
              <div className="flex items-center gap-2">
                <item.icon className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium text-foreground">{item.metric}</p>
                  <p className="text-xs text-muted-foreground hidden sm:block">{item.description}</p>
                </div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1.5">
                  {item.llm.score >= 4 ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : item.llm.score >= 3 ? (
                    <AlertCircle className="h-4 w-4 text-yellow-500" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="font-medium text-foreground">{item.llm.value}</span>
                </div>
                <p className="text-xs text-muted-foreground">{item.llm.label}</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1.5">
                  {item.agent.score >= 4 ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : item.agent.score >= 3 ? (
                    <AlertCircle className="h-4 w-4 text-yellow-500" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="font-medium text-foreground">{item.agent.value}</span>
                </div>
                <p className="text-xs text-muted-foreground">{item.agent.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="mt-4 p-3 rounded-lg bg-secondary/30 border border-border">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Recommendation:</strong> Use <strong className="text-blue-500">LLM Mode</strong> for quick practice sessions and <strong className="text-primary">Agent Mode</strong> for formal assessments where accuracy and detailed feedback matter most.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
