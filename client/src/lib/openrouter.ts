import { isLimitReached, incrementUsage } from './usage'
import { trackUsage } from './coins'

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY || ''
export const BASE = 'https://openrouter.ai/api/v1'

let lastRequestTime = 0
const MIN_INTERVAL = 1000

async function rateLimit() {
  const now = Date.now()
  const wait = Math.max(0, MIN_INTERVAL - (now - lastRequestTime))
  if (wait > 0) await new Promise(r => setTimeout(r, wait))
  lastRequestTime = Date.now()
}

const headers = () => ({
  'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
  'Content-Type': 'application/json',
  'HTTP-Referer': window.location.origin,
  'X-Title': 'Bit-Byte'
})

const CREATOR_SYSTEM_PROMPT = {
  role: 'system' as const,
  content: 'You are an AI assistant created by Swampod Sarkar. When someone asks "who made you" or "who created you" or similar questions about your creator, answer: "I was created by Swampod Sarkar." Keep other answers helpful and concise.'
}

async function parseError(res: Response): Promise<string> {
  try {
    const body = await res.json()
    return body.error?.message || body.message || `HTTP ${res.status}`
  } catch {
    try {
      const text = await res.text()
      return text.slice(0, 200) || `HTTP ${res.status}`
    } catch {
      return `HTTP ${res.status}`
    }
  }
}

export async function openRouterChat(
  messages: { role: string; content: string }[],
  model = 'openrouter/auto'
): Promise<{ choices?: { message?: { content?: string } }[] }> {
  if (isLimitReached()) {
    throw new Error('LIMIT_REACHED')
  }

  await rateLimit()

  const res = await fetch(`${BASE}/chat/completions`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({
      model,
      messages: [CREATOR_SYSTEM_PROMPT, ...messages.map(m => ({ role: m.role, content: m.content }))],
      max_tokens: 4096
    })
  })

  if (!res.ok) {
    const msg = await parseError(res)
    if (res.status === 429) throw new Error('429—Too many requests. Please wait a moment and try again.')
    if (res.status === 400) throw new Error(`400—${msg}`)
    throw new Error(msg)
  }

  const data = await res.json()
  incrementUsage()
  trackUsage()
  return data
}

export async function openRouterChatNoLimit(
  messages: { role: string; content: string }[],
  model = 'openrouter/auto'
) {
  await rateLimit()
  const res = await fetch(`${BASE}/chat/completions`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({
      model,
      messages: [CREATOR_SYSTEM_PROMPT, ...messages],
      max_tokens: 4096
    })
  })
  if (!res.ok) throw new Error(await parseError(res))
  return res.json()
}

export async function fetchFreeModels() {
  await rateLimit()
  const res = await fetch(`${BASE}/models`, { headers: headers() })
  const data = await res.json()
  const all = data.data || []
  return all.filter((m: any) => m.pricing && parseFloat(m.pricing.prompt) === 0 && parseFloat(m.pricing.completion) === 0)
}

let cachedModels: any[] | null = null
export async function getCachedModels() {
  if (cachedModels) return cachedModels
  cachedModels = await fetchFreeModels()
  return cachedModels
}
