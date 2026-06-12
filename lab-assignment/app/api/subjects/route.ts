import { NextResponse } from "next/server"
import { listSubjects } from "@/lib/question-service"

export function GET() {
  return NextResponse.json({ subjects: listSubjects() })
}
