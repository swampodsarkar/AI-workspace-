import express from 'express'
import cors from 'cors'
import OpenAI from 'openai'

const app = express()
app.use(cors({ origin: '*', credentials: true }))
app.use(express.json({ limit: '50mb' }))

// ===== OpenRouter Client =====
const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY || '',
  defaultHeaders: { 'HTTP-Referer': process.env.SITE_URL || 'https://ai-workspace.vercel.app', 'X-Title': 'AI Workspace' }
})

// ===== Usage Tracking (in-memory for Vercel) =====
const memStore: Record<string, { count: number; date: string }> = {}
const FREE_LIMIT = parseInt(process.env.FREE_DAILY_LIMIT || '50')

function getUserId(req: express.Request): string {
  return req.body?.userId || req.headers['x-user-id'] as string || 'anonymous'
}

function getUsage(userId: string) {
  const key = `${userId}_${new Date().toISOString().slice(0, 10)}`
  return memStore[key] || { count: 0, date: new Date().toISOString().slice(0, 10) }
}

function incrementUsage(userId: string) {
  const key = `${userId}_${new Date().toISOString().slice(0, 10)}`
  const entry = memStore[key] || { count: 0, date: new Date().toISOString().slice(0, 10) }
  entry.count++
  memStore[key] = entry
  return entry
}

// ===== Limit Middleware =====
function limitMw(req: express.Request, res: express.Response, next: express.NextFunction) {
  const uid = getUserId(req)
  const usage = getUsage(uid)
  if (usage.count >= FREE_LIMIT) {
    return res.status(429).json({ error: `Daily limit (${FREE_LIMIT}) reached. Upgrade to premium.`, limitExceeded: true, remaining: 0 })
  }
  next()
}

const protectedRoutes = ['/api/chat', '/api/generate-image', '/api/generate-code', '/api/generate-website', '/api/generate-email', '/api/excel-query', '/api/analyze-data']
protectedRoutes.forEach(p => app.use(p, limitMw))

// ===== API Routes =====

// 1. Chat
app.post('/api/chat', async (req, res) => {
  try {
    const { message, model, history } = req.body
    if (!message) return res.status(400).json({ error: 'Message is required' })
    const completion = await openai.chat.completions.create({
      model: model?.includes(':free') ? model : 'openrouter/auto',
      messages: [...(history || []), { role: 'user', content: message }],
      max_tokens: 4096,
    })
    incrementUsage(getUserId(req))
    res.json({ reply: completion.choices[0]?.message?.content || 'No response', model: completion.model })
  } catch (err: any) { res.status(500).json({ error: err.message }) }
})

// 2. Image Generation
app.post('/api/generate-image', async (req, res) => {
  try {
    const { prompt } = req.body
    if (!prompt) return res.status(400).json({ error: 'Prompt is required' })
    const completion = await openai.chat.completions.create({
      model: 'openrouter/auto',
      messages: [{ role: 'system', content: 'Generate a detailed image prompt. Return ONLY the prompt.' }, { role: 'user', content: prompt }]
    })
    const imgPrompt = completion.choices[0]?.message?.content || prompt
    incrementUsage(getUserId(req))
    res.json({ prompt: imgPrompt, image: `https://image.pollinations.ai/prompt/${encodeURIComponent(imgPrompt)}` })
  } catch (err: any) { res.status(500).json({ error: err.message }) }
})

// 4. Code Generation
app.post('/api/generate-code', async (req, res) => {
  try {
    const { prompt, language } = req.body
    if (!prompt) return res.status(400).json({ error: 'Prompt is required' })
    const completion = await openai.chat.completions.create({
      model: 'openrouter/auto',
      messages: [{ role: 'system', content: `Generate ${language || 'javascript'} code. Return ONLY code.` }, { role: 'user', content: prompt }]
    })
    incrementUsage(getUserId(req))
    res.json({ code: completion.choices[0]?.message?.content || '' })
  } catch (err: any) { res.status(500).json({ error: err.message }) }
})

// 5. Website Generation
app.post('/api/generate-website', async (req, res) => {
  try {
    const { prompt, template } = req.body
    if (!prompt) return res.status(400).json({ error: 'Prompt is required' })
    const completion = await openai.chat.completions.create({
      model: 'openrouter/auto',
      messages: [{ role: 'system', content: `Generate a complete HTML page. Template: ${template || 'modern'}. Return ONLY HTML.` }, { role: 'user', content: prompt }]
    })
    incrementUsage(getUserId(req))
    res.json({ html: completion.choices[0]?.message?.content || '' })
  } catch (err: any) { res.status(500).json({ error: err.message }) }
})

// 6. Email Generation
app.post('/api/generate-email', async (req, res) => {
  try {
    const { prompt, tone } = req.body
    if (!prompt) return res.status(400).json({ error: 'Prompt is required' })
    const completion = await openai.chat.completions.create({
      model: 'openrouter/auto',
      messages: [{ role: 'system', content: `Write an email. Tone: ${tone || 'professional'}. Return JSON: { "subject": "...", "body": "..." }` }, { role: 'user', content: prompt }]
    })
    incrementUsage(getUserId(req))
    try { const p = JSON.parse(completion.choices[0]?.message?.content || '{}'); res.json(p) }
    catch { res.json({ subject: 'Re: Your Request', body: completion.choices[0]?.message?.content }) }
  } catch (err: any) { res.status(500).json({ error: err.message }) }
})

// 7. Excel Query
app.post('/api/excel-query', async (req, res) => {
  try {
    const { query, data } = req.body
    if (!query) return res.status(400).json({ error: 'Query is required' })
    const completion = await openai.chat.completions.create({
      model: 'openrouter/auto',
      messages: [{ role: 'system', content: `Modify tabular data. Return ONLY array of arrays. Current: ${JSON.stringify(data || [])}` }, { role: 'user', content: query }]
    })
    incrementUsage(getUserId(req))
    try { res.json({ data: JSON.parse(completion.choices[0]?.message?.content || '[]') }) }
    catch { res.json({ data }) }
  } catch (err: any) { res.status(500).json({ error: err.message }) }
})

// 8. Data Analysis
app.post('/api/analyze-data', async (req, res) => {
  try {
    const { query } = req.body
    if (!query) return res.status(400).json({ error: 'Query is required' })
    const completion = await openai.chat.completions.create({
      model: 'openrouter/auto',
      messages: [{ role: 'system', content: 'You are a data analyst. Provide clear analysis.' }, { role: 'user', content: query }]
    })
    incrementUsage(getUserId(req))
    res.json({ analysis: completion.choices[0]?.message?.content || 'Analysis complete.' })
  } catch (err: any) { res.status(500).json({ error: err.message }) }
})

// 9. Models
app.get('/api/models', async (_req, res) => {
  try {
    const response = await fetch('https://openrouter.ai/api/v1/models', {
      headers: { Authorization: `Bearer ${process.env.OPENROUTER_API_KEY || ''}` }
    })
    const d = await response.json()
    const all = d.data || []
    const free = all.filter((m: any) => m.pricing && parseFloat(m.pricing.prompt) === 0 && parseFloat(m.pricing.completion) === 0)
    res.json({
      total: all.length, freeCount: free.length,
      models: free.map((m: any) => ({ id: m.id, name: m.name || m.id, provider: m.id.includes('/') ? m.id.split('/')[0] : 'unknown', pricing: m.pricing, context_length: m.context_length }))
    })
  } catch { res.json({ total: 28, freeCount: 28, models: [] }) }
})

// 10. Usage Status
app.get('/api/usage-status', (req, res) => {
  const uid = getUserId(req)
  const usage = getUsage(uid)
  res.json({ used: usage.count, remaining: Math.max(0, FREE_LIMIT - usage.count), premium: false, dailyLimit: FREE_LIMIT })
})

// 11. Health
app.get('/api/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString(), platform: 'vercel' }))

// ===== Storage (multer upload not supported on Vercel edge, return mock) =====
app.post('/api/storage/upload', (req, res) => res.json({ url: 'mock://upload', name: 'file', size: 0, note: 'Dev mode on Vercel' }))
app.get('/api/storage/files', (_req, res) => res.json({ files: [], note: 'Dev mode on Vercel' }))
app.delete('/api/storage/delete', (_req, res) => res.json({ success: true, note: 'Dev mode on Vercel' }))

// ===== Payment (mock) =====
app.post('/api/payment/create-checkout-session', (req, res) => res.json({ url: '/pricing?upgrade=true' }))
app.post('/api/payment/bkash', (req, res) => res.json({ success: true, transactionId: `BK-${Date.now()}` }))
app.post('/api/payment/nagad', (req, res) => res.json({ success: true, transactionId: `NG-${Date.now()}` }))

export default app
