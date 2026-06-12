"use client"

import { Brain, Lightbulb, Eye, CheckCircle2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { AgentTraceStep } from "@/lib/types"

interface AgentTraceProps {
  trace: AgentTraceStep[]
}

const stepIcons = {
  thought: Lightbulb,
  action: Brain,
  observation: Eye,
  validation: CheckCircle2,
}

const stepColors = {
  thought: "border-yellow-500/30 bg-yellow-500/10",
  action: "border-blue-500/30 bg-blue-500/10",
  observation: "border-purple-500/30 bg-purple-500/10",
  validation: "border-green-500/30 bg-green-500/10",
}

const stepTextColors = {
  thought: "text-yellow-600 dark:text-yellow-400",
  action: "text-blue-600 dark:text-blue-400",
  observation: "text-purple-600 dark:text-purple-400",
  validation: "text-green-600 dark:text-green-400",
}

export function AgentTrace({ trace }: AgentTraceProps) {
  return (
    <Card className="border-border sticky top-24">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Brain className="h-5 w-5 text-primary" />
          Agent Trace
        </CardTitle>
        <CardDescription>
          Thought-Action-Observation reasoning chain
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative space-y-3">
          {/* Vertical Line */}
          <div className="absolute left-4 top-2 bottom-2 w-px bg-border" />
          
          {trace.map((step, index) => {
            const Icon = stepIcons[step.type]
            
            return (
              <div key={index} className="relative flex gap-3 pl-1">
                {/* Icon */}
                <div className={`relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border ${stepColors[step.type]}`}>
                  <Icon className={`h-3.5 w-3.5 ${stepTextColors[step.type]}`} />
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0 pb-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge 
                      variant="outline" 
                      className={`text-xs capitalize ${stepColors[step.type]} ${stepTextColors[step.type]} border-0`}
                    >
                      {step.type}
                    </Badge>
                    {step.status && (
                      <Badge 
                        variant={step.status === "success" ? "default" : step.status === "warning" ? "secondary" : "destructive"}
                        className="text-xs"
                      >
                        {step.status}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">
                    {step.content}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {step.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
