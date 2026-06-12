export const appConfig = {
  name: process.env.NEXT_PUBLIC_APP_NAME || "ExamForge AI",
  description:
    process.env.NEXT_PUBLIC_APP_DESCRIPTION ||
    "AI-powered exam generation and grading for Grade 12 students.",
  environment: process.env.NODE_ENV || "development",
  version: process.env.NEXT_PUBLIC_APP_VERSION || "0.1.0",
  mockMode: process.env.NEXT_PUBLIC_MOCK_MODE !== "false",
  enableAnalytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === "true",
}

export function getPublicConfig() {
  return {
    name: appConfig.name,
    description: appConfig.description,
    environment: appConfig.environment,
    version: appConfig.version,
    mockMode: appConfig.mockMode,
  }
}
