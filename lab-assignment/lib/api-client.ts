export function apiHeaders() {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  }

  if (process.env.NEXT_PUBLIC_API_GATEWAY_KEY) {
    headers["x-api-key"] = process.env.NEXT_PUBLIC_API_GATEWAY_KEY
  }

  return headers
}
