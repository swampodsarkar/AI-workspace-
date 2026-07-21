import { Router, Request, Response } from 'express'
import OpenAI from 'openai'
import { incrementUsage } from '../db/firebase.js'

const router = Router()

const openai = new OpenAI({
  baseURL: process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY || '',
  defaultHeaders: {
    'HTTP-Referer': process.env.SITE_URL || 'http://localhost:5173',
    'X-Title': 'AI Workspace'
  }
})

router.post('/', async (req: Request, res: Response) => {
  try {
    const { message, model, history, userId } = req.body
    if (!message) return res.status(400).json({ error: 'Message is required' })

    // Ensure model is a free model — strip non-free suffixes
    let safeModel = model || 'openrouter/auto'
    if (!safeModel.includes(':free') && safeModel !== 'openrouter/auto') {
      safeModel = safeModel.includes('/')
        ? `${safeModel.split('/')[0]}/${safeModel.split('/').slice(1).join('/')}:free`
        : `${safeModel}:free`
    }

    const messages = [
      ...(history || []),
      { role: 'user', content: message }
    ]

    const completion = await openai.chat.completions.create({
      model: safeModel,
      messages,
      max_tokens: 4096,
    })

    // Increment usage counter
    await incrementUsage(userId || 'anonymous')

    res.json({
      reply: completion.choices[0]?.message?.content || 'No response',
      model: completion.model || safeModel
    })
  } catch (error: any) {
    console.error('Chat error:', error)
    res.status(500).json({ error: error.message || 'Internal server error' })
  }
})

export { router as chatRouter }
