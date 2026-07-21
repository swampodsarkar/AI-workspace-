import { getRemaining, isLimitReached, incrementUsage } from './usage'

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY || ''
export const BASE = 'https://openrouter.ai/api/v1'

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

export async function openRouterChat(
  messages: { role: string; content: string }[],
  model = 'openrouter/auto'
): Promise<{ choices?: { message?: { content?: string } }[] }> {
  if (isLimitReached()) {
    throw new Error('LIMIT_REACHED')
  }

  const res = await fetch(`${BASE}/chat/completions`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({
      model,
      messages: [CREATOR_SYSTEM_PROMPT, ...messages.map(m => ({ role: m.role, content: m.content }))],
      max_tokens: 4096
    })
  })
  if (!res.ok) throw new Error((await res.json()).error?.message || `HTTP ${res.status}`)
  const data = await res.json()
  incrementUsage()
  return data
}

export async function openRouterChatNoLimit(
  messages: { role: string; content: string }[],
  model = 'openrouter/auto'
) {
  const res = await fetch(`${BASE}/chat/completions`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({
      model,
      messages: [CREATOR_SYSTEM_PROMPT, ...messages],
      max_tokens: 4096
    })
  })
  if (!res.ok) throw new Error((await res.json()).error?.message || `HTTP ${res.status}`)
  return res.json()
}

export async function fetchFreeModels() {
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
