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

// Image Generation
router.post('/generate-image', async (req: Request, res: Response) => {
  try {
    const { prompt, userId } = req.body
    if (!prompt) return res.status(400).json({ error: 'Prompt is required' })

    const completion = await openai.chat.completions.create({
      model: 'openrouter/auto',
      messages: [
        { role: 'system', content: 'You are an image prompt generator. Generate a detailed prompt. Return ONLY the prompt text.' },
        { role: 'user', content: prompt }
      ]
    })

    const imagePrompt = completion.choices[0]?.message?.content || prompt
    await incrementUsage(userId || 'anonymous')

    res.json({ prompt: imagePrompt, image: `https://image.pollinations.ai/prompt/${encodeURIComponent(imagePrompt)}` })
  } catch (error: any) {
    console.error('Image generation error:', error)
    res.status(500).json({ error: error.message })
  }
})

// Code Generation
router.post('/generate-code', async (req: Request, res: Response) => {
  try {
    const { prompt, language, userId } = req.body
    if (!prompt) return res.status(400).json({ error: 'Prompt is required' })

    const completion = await openai.chat.completions.create({
      model: 'openrouter/auto',
      messages: [
        { role: 'system', content: `You are a code generator. Generate ${language || 'javascript'} code. Return ONLY the code, no explanations.` },
        { role: 'user', content: prompt }
      ]
    })

    await incrementUsage(userId || 'anonymous')
    res.json({ code: completion.choices[0]?.message?.content || '' })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// Website Generation
router.post('/generate-website', async (req: Request, res: Response) => {
  try {
    const { prompt, template, userId } = req.body
    if (!prompt) return res.status(400).json({ error: 'Prompt is required' })

    const completion = await openai.chat.completions.create({
      model: 'openrouter/auto',
      messages: [
        { role: 'system', content: `You are a web developer. Generate a complete HTML page with inline CSS/JS. Template: ${template || 'modern'}. Return ONLY valid HTML.` },
        { role: 'user', content: prompt }
      ]
    })

    await incrementUsage(userId || 'anonymous')
    res.json({ html: completion.choices[0]?.message?.content || '' })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// Email Generation
router.post('/generate-email', async (req: Request, res: Response) => {
  try {
    const { prompt, tone, userId } = req.body
    if (!prompt) return res.status(400).json({ error: 'Prompt is required' })

    const completion = await openai.chat.completions.create({
      model: 'openrouter/auto',
      messages: [
        { role: 'system', content: `You are an email writer. Return JSON: { "subject": "...", "body": "..." }. Tone: ${tone || 'professional'}` },
        { role: 'user', content: prompt }
      ]
    })

    await incrementUsage(userId || 'anonymous')
    try {
      const parsed = JSON.parse(completion.choices[0]?.message?.content || '{}')
      res.json(parsed)
    } catch {
      res.json({ subject: 'Re: Your Request', body: completion.choices[0]?.message?.content || '' })
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// Excel Query
router.post('/excel-query', async (req: Request, res: Response) => {
  try {
    const { query, data, userId } = req.body
    if (!query) return res.status(400).json({ error: 'Query is required' })

    const completion = await openai.chat.completions.create({
      model: 'openrouter/auto',
      messages: [
        { role: 'system', content: `You are a data analyst. Modify tabular data. Return ONLY the modified array of arrays. Current: ${JSON.stringify(data)}` },
        { role: 'user', content: query }
      ]
    })

    await incrementUsage(userId || 'anonymous')
    try {
      const modified = JSON.parse(completion.choices[0]?.message?.content || '[]')
      res.json({ data: modified })
    } catch {
      res.json({ data, note: 'Could not parse' })
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// Data Analysis
router.post('/analyze-data', async (req: Request, res: Response) => {
  try {
    const { query, userId } = req.body
    if (!query) return res.status(400).json({ error: 'Query is required' })

    const completion = await openai.chat.completions.create({
      model: 'openrouter/auto',
      messages: [
        { role: 'system', content: 'You are a data analyst. Provide clear analysis.' },
        { role: 'user', content: query }
      ]
    })

    await incrementUsage(userId || 'anonymous')
    res.json({ analysis: completion.choices[0]?.message?.content || 'Analysis complete.' })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

export { router as toolsRouter }
