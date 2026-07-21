const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY || ''
export const BASE = 'https://openrouter.ai/api/v1'

const headers = () => ({
  'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
  'Content-Type': 'application/json',
  'HTTP-Referer': window.location.origin,
  'X-Title': 'AI Workspace'
})

export async function openRouterChat(messages: { role: string; content: string }[], model = 'openrouter/auto') {
  const res = await fetch(`${BASE}/chat/completions`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ model, messages, max_tokens: 4096 })
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
