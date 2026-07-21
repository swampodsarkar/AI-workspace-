import { Router, Request, Response } from 'express'
import multer from 'multer'

const router = Router()
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 100 * 1024 * 1024 } })

function getSupabase() {
  try {
    const supabaseUrl = process.env.SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY
    if (supabaseUrl && supabaseKey && supabaseUrl !== 'https://your-project.supabase.co') {
      const { createClient } = require('@supabase/supabase-js')
      return createClient(supabaseUrl, supabaseKey).storage
    }
  } catch {}
  return null
}

router.post('/upload', upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' })

    const storage = getSupabase()
    if (!storage) {
      return res.json({
        url: `mock://${req.file.originalname}`,
        name: req.file.originalname,
        size: req.file.buffer.length,
        note: 'Dev mode - Supabase not configured'
      })
    }

    const { originalname, buffer, mimetype } = req.file
    const userId = req.body.userId || 'anonymous'
    const path = `${userId}/${Date.now()}-${originalname}`

    const { data, error } = await storage
      .from('ai-workspace')
      .upload(path, buffer, { contentType: mimetype, upsert: false })

    if (error) throw error
    res.json({ url: data?.path, name: originalname, size: buffer.length })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

router.get('/files', async (req: Request, res: Response) => {
  const storage = getSupabase()
  if (!storage) return res.json({ files: [], note: 'Dev mode - Supabase not configured' })

  try {
    const { userId } = req.query
    const { data, error } = await storage
      .from('ai-workspace')
      .list(userId as string || '')

    if (error) throw error
    res.json({ files: data })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

router.delete('/delete', async (req: Request, res: Response) => {
  const storage = getSupabase()
  if (!storage) return res.json({ success: true, note: 'Dev mode - Supabase not configured' })

  try {
    const { path } = req.body
    const { error } = await storage
      .from('ai-workspace')
      .remove([path])

    if (error) throw error
    res.json({ success: true })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

export { router as storageRouter }
