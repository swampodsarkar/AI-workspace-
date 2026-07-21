import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import dotenv from 'dotenv'
import { chatRouter } from './routes/chat.js'
import { paymentRouter } from './routes/payment.js'
import { storageRouter } from './routes/storage.js'
import { toolsRouter } from './routes/tools.js'
import { checkLimit } from './db/firebase.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }))
app.use(express.json({ limit: '50mb' }))
app.use(morgan('dev'))

// Extract userId from header and default into body
app.use((req, _res, next) => {
  if (!req.body) req.body = {}
  if (req.headers['x-user-id'] && !req.body.userId) {
    req.body.userId = req.headers['x-user-id'] as string
  }
  next()
})

// Helper to apply usage limit middleware
function limitMiddleware(path: string) {
  app.use(path, async (req, res, next) => {
    const userId = req.body?.userId || 'anonymous'
    const result = await checkLimit(userId)
    if (!result.allowed) return res.status(429).json({ error: result.message, limitExceeded: true, remaining: 0 })
    next()
  })
}

limitMiddleware('/api/chat')
limitMiddleware('/api/generate-image')
limitMiddleware('/api/generate-code')
limitMiddleware('/api/generate-website')
limitMiddleware('/api/generate-email')
limitMiddleware('/api/excel-query')
limitMiddleware('/api/analyze-data')

app.use('/api/chat', chatRouter)
app.use('/api/payment', paymentRouter)
app.use('/api/storage', storageRouter)
app.use('/api', toolsRouter)

// Get free models from OpenRouter
app.get('/api/models', async (_req, res) => {
  try {
    const response = await fetch('https://openrouter.ai/api/v1/models', {
      headers: { Authorization: `Bearer ${process.env.OPENROUTER_API_KEY || ''}` }
    })
    const data = await response.json()
    const all = data.data || []

    const free = all.filter((m: any) =>
      m.pricing && parseFloat(m.pricing.prompt) === 0 && parseFloat(m.pricing.completion) === 0
    )

    res.json({
      total: all.length,
      freeCount: free.length,
      models: free.map((m: any) => ({
        id: m.id,
        name: m.name || m.id,
        provider: m.id.includes('/') ? m.id.split('/')[0] : 'unknown',
        pricing: m.pricing,
        context_length: m.context_length,
        top_provider: m.top_provider
      }))
    })
  } catch (err: any) {
    console.error('Failed to fetch models:', err.message)
    res.json({
      total: 28,
      freeCount: 28,
      models: [
        { id: 'deepseek/deepseek-r1:free', name: 'DeepSeek R1 (Free)', provider: 'deepseek', pricing: { prompt: '0', completion: '0' } },
        { id: 'deepseek/deepseek-chat:free', name: 'DeepSeek Chat (Free)', provider: 'deepseek', pricing: { prompt: '0', completion: '0' } },
        { id: 'meta-llama/llama-3.3-70b-instruct:free', name: 'Llama 3.3 70B (Free)', provider: 'meta-llama', pricing: { prompt: '0', completion: '0' } },
        { id: 'mistralai/mistral-7b-instruct:free', name: 'Mistral 7B (Free)', provider: 'mistralai', pricing: { prompt: '0', completion: '0' } },
        { id: 'google/gemini-2.0-flash:free', name: 'Gemini 2.0 Flash (Free)', provider: 'google', pricing: { prompt: '0', completion: '0' } },
        { id: 'qwen/qwen-2.5-7b-instruct:free', name: 'Qwen 2.5 7B (Free)', provider: 'qwen', pricing: { prompt: '0', completion: '0' } },
        { id: 'microsoft/phi-3-mini-4k-instruct:free', name: 'Phi-3 Mini (Free)', provider: 'microsoft', pricing: { prompt: '0', completion: '0' } },
      ]
    })
  }
})

// Get current usage status
app.get('/api/usage-status', async (req, res) => {
  const userId = (req.query.userId as string) || req.headers['x-user-id'] as string || 'anonymous'
  const { checkLimit: cl, getUsage } = await import('./db/firebase.js')
  const limit = await cl(userId)
  const usage = await getUsage(userId)
  res.json({
    used: usage.count,
    remaining: limit.remaining === Infinity ? 99999 : limit.remaining,
    premium: limit.premium,
    dailyLimit: parseInt(process.env.FREE_DAILY_LIMIT || '50')
  })
})

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
