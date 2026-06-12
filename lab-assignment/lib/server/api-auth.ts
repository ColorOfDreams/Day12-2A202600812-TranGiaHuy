import { createHmac, timingSafeEqual } from "crypto"
import { NextResponse } from "next/server"

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left)
  const rightBuffer = Buffer.from(right)

  if (leftBuffer.length !== rightBuffer.length) return false
  return timingSafeEqual(leftBuffer, rightBuffer)
}

function base64UrlDecode(value: string) {
  return Buffer.from(value.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf8")
}

function verifyJwt(token: string, secret: string) {
  const [encodedHeader, encodedPayload, signature] = token.split(".")
  if (!encodedHeader || !encodedPayload || !signature) return false

  const expectedSignature = createHmac("sha256", secret)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest("base64url")

  if (!safeEqual(signature, expectedSignature)) return false

  const payload = JSON.parse(base64UrlDecode(encodedPayload)) as { exp?: number }
  if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return false

  return true
}

function isSameOrigin(request: Request) {
  const origin = request.headers.get("origin")
  const host = request.headers.get("host")
  if (!origin || !host) return false

  try {
    return new URL(origin).host === host
  } catch {
    return false
  }
}

export function requireApiAccess(request: Request) {
  if (process.env.API_GATEWAY_ENABLED === "false") return null

  const allowSameOrigin = process.env.API_GATEWAY_ALLOW_SAME_ORIGIN !== "false"
  if (allowSameOrigin && isSameOrigin(request)) return null

  const configuredApiKey = process.env.API_GATEWAY_KEY || process.env.APP_API_KEY
  const requestApiKey = request.headers.get("x-api-key")

  if (configuredApiKey && requestApiKey && safeEqual(requestApiKey, configuredApiKey)) {
    return null
  }

  const jwtSecret = process.env.JWT_SECRET
  const authorization = request.headers.get("authorization")
  const token = authorization?.startsWith("Bearer ") ? authorization.slice("Bearer ".length) : null

  if (jwtSecret && token && verifyJwt(token, jwtSecret)) {
    return null
  }

  return NextResponse.json(
    {
      error: "Unauthorized",
      message: "Provide a valid x-api-key or Bearer JWT.",
    },
    { status: 401 },
  )
}
