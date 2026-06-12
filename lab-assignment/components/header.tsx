"use client"

import { Brain, Bot, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface HeaderProps {
  activeMode: "llm" | "agent"
  onModeChange: (mode: "llm" | "agent") => void
}

export function Header({ activeMode, onModeChange }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 max-w-7xl">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-foreground">ExamForge AI</h1>
            <p className="text-xs text-muted-foreground">Grade 12 Exam Generator</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex rounded-lg bg-secondary p-1">
            <Button
              variant={activeMode === "llm" ? "default" : "ghost"}
              size="sm"
              onClick={() => onModeChange("llm")}
              className="gap-2"
            >
              <Brain className="h-4 w-4" />
              <span className="hidden sm:inline">LLM Mode</span>
              <span className="sm:hidden">LLM</span>
            </Button>
            <Button
              variant={activeMode === "agent" ? "default" : "ghost"}
              size="sm"
              onClick={() => onModeChange("agent")}
              className="gap-2"
            >
              <Bot className="h-4 w-4" />
              <span className="hidden sm:inline">Agent Mode</span>
              <span className="sm:hidden">Agent</span>
            </Button>
          </div>
          <Badge variant="outline" className="hidden md:flex">
            {activeMode === "llm" ? "Fast & Direct" : "Reasoned & Validated"}
          </Badge>
        </div>
      </div>
    </header>
  )
}
