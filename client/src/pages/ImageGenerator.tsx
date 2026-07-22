import { useState, useRef } from 'react'
import { Icons } from '../lib/icons'
import { Link } from 'react-router-dom'
import { openRouterChat } from '../lib/openrouter'
import { isLimitReached, getRemaining, deductCredits } from '../lib/usage'
import { getToolConfig } from '../lib/autoModel'

const POLLINATIONS_BASE = 'https://image.pollinations.ai/prompt'
const styles = ['Realistic', 'Anime', 'Oil Painting', '3D Render', 'Watercolor', 'Pixel Art', 'Sketch', 'Cyberpunk']

export default function ImageGenerator() {
  const cfg = getToolConfig('image')
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [image, setImage] = useState('')
  const [imgError, setImgError] = useState(false)
  const [style, setStyle] = useState('Realistic')
  const [remaining, setRemaining] = useState(getRemaining())
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')
  const imgRef = useRef<HTMLImageElement>(null)

  const generate = async () => {
    if (!prompt.trim() || loading) return
    if (isLimitReached()) {
      setError('Daily limit reached.')
      return
    }
    setError('')
    setImgError(false)
    setImage('')
    setLoading(true)
    try {
      const data = await openRouterChat([
        { role: 'system', content: cfg.systemPrompt },
        { role: 'user', content: `${prompt}, ${style} style` }
      ], cfg.model)
      const imgPrompt = (data.choices?.[0]?.message?.content || prompt).slice(0, 500)
      const url = `${POLLINATIONS_BASE}/${encodeURIComponent(imgPrompt)}?width=1024&height=1024&nofeed=true`
      const result = deductCredits(cfg.credits)
      if (!result.allowed) { setLoading(false); setError('Not enough credits.'); return }
      setRemaining(result.remaining)
      setImage(url)
    } catch (e: any) {
      setError(e?.message || 'Generation failed. Try again.')
    }
    setLoading(false)
  }

  const handleCopy = async () => {
    if (!image) return
    try {
      await navigator.clipboard.writeText(image)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch { /* ignore */ }
  }

  const handleDownload = () => {
    if (!image) return
    const a = document.createElement('a')
    a.href = image
    a.download = `generated-${Date.now()}.png`
    a.click()
  }

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/20">
            <Icons.Image size={18} className="text-white" />
          </div>
          <h1 className="text-lg font-semibold">Image Generator</h1>
          <span className={`badge flex items-center gap-1 ${remaining < cfg.credits ? 'badge-red' : 'badge-green'}`}>
            <Icons.Info size={10} /> {remaining}/{50}
          </span>
        </div>
        <div className="flex items-center gap-1 text-xs text-dark-500 bg-dark-800/50 border border-dark-700/40 rounded-lg px-3 py-1.5">
          <Icons.Sparkles size={11} className="text-yellow-400" />
          1 image = {cfg.credits} credits
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2.5 mb-4 text-red-400">
          <Icons.AlertTriangle size={15} />
          {error}
        </div>
      )}
      {!error && remaining < cfg.credits && remaining > 0 && (
        <div className="flex items-center gap-2 text-sm bg-yellow-500/10 border border-yellow-500/20 rounded-xl px-4 py-2.5 mb-4 text-yellow-400">
          <Icons.AlertTriangle size={15} />
          Not enough credits (need {cfg.credits}, have {remaining}). <Link to="/pricing" className="underline font-semibold ml-auto">Upgrade</Link>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="card">
            <div className="aspect-square rounded-xl bg-dark-700/80 flex items-center justify-center mb-4 overflow-hidden border border-dark-700/50 relative">
              {loading && (
                <div className="absolute inset-0 bg-dark-900/60 flex flex-col items-center justify-center gap-3 z-10">
                  <div className="w-10 h-10 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
                  <p className="text-sm text-dark-300">Generating image...</p>
                </div>
              )}
              {image && !imgError ? (
                <img ref={imgRef} src={image} alt="Generated" className="w-full h-full object-cover" onError={() => setImgError(true)} />
              ) : image && imgError ? (
                <div className="text-center text-dark-500 p-8">
                  <Icons.AlertCircle size={48} className="mx-auto mb-3 opacity-50" />
                  <p className="text-sm">Image failed to load</p>
                  <p className="text-xs text-dark-600 mt-1">Try generating again</p>
                </div>
              ) : (
                <div className="text-center text-dark-500 p-8">
                  <Icons.Image size={48} className="mx-auto mb-3 opacity-50" />
                  <p className="text-sm">Your generated image will appear here</p>
                  <p className="text-xs text-dark-600 mt-1">Each generation costs {cfg.credits} credits</p>
                </div>
              )}
            </div>
            {image && !imgError && (
              <div className="flex gap-2">
                <button className="btn-secondary flex-1 flex items-center justify-center gap-2" onClick={handleDownload}>
                  <Icons.Download size={16} /> Download
                </button>
                <button className="btn-secondary flex items-center justify-center gap-2 px-4" onClick={handleCopy}>
                  {copied ? <Icons.Check size={16} className="text-green-400" /> : <Icons.Copy size={16} />}
                  {copied ? 'Copied' : 'Copy URL'}
                </button>
              </div>
            )}
          </div>
        </div>
        <div>
          <div className="card space-y-4">
            <div>
              <h3 className="font-semibold text-sm mb-1.5">Prompt</h3>
              <textarea className="input h-28 resize-none" placeholder="Describe the image..." value={prompt} onChange={e => setPrompt(e.target.value)} />
            </div>
            <div>
              <h3 className="font-semibold text-sm mb-2">Style</h3>
              <div className="flex flex-wrap gap-1.5">
                {styles.map(s => (
                  <button key={s} className={`text-xs px-3 py-1.5 rounded-full border transition-all ${style === s ? 'bg-primary-600 border-primary-500 text-white' : 'border-dark-600 text-dark-300 hover:border-dark-400 hover:text-white'}`} onClick={() => setStyle(s)}>{s}</button>
                ))}
              </div>
            </div>
            <button className="btn-primary w-full flex items-center justify-center gap-2" onClick={generate} disabled={loading || !prompt.trim()}>
              {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Icons.Sparkles size={16} />}
              {loading ? 'Generating...' : `Generate (${cfg.credits} credits)`}
            </button>
            <p className="text-[11px] text-dark-500 text-center">You have <strong className="text-dark-400">{remaining}</strong> credits remaining</p>
          </div>
        </div>
      </div>
    </div>
  )
}
