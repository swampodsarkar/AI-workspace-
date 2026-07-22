import { useState } from 'react'
import { Icons } from '../lib/icons'
import { openRouterChat } from '../lib/openrouter'
import { getToolConfig } from '../lib/autoModel'
import { isLimitReached, getRemaining, deductCredits } from '../lib/usage'

const templates = ['Blank', 'Business', 'Portfolio', 'Blog', 'Landing Page', 'E-commerce']
const defaultHtml = '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>My Site</title><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:system-ui,sans-serif;background:#0f172a;color:#e2e8f0}header{padding:2rem;text-align:center}h1{font-size:2.5rem;background:linear-gradient(135deg,#6366f1,#a855f7);-webkit-background-clip:text;-webkit-text-fill-color:transparent}main{max-width:800px;margin:0 auto;padding:2rem}.card{background:#1e293b;border-radius:1rem;padding:2rem;margin:1rem 0}</style></head><body><header><h1>My Site</h1><p>Built with Bit-Byte</p></header><main><div class="card"><h2>Welcome!</h2><p>AI-generated website.</p></div></main></body></html>'

export default function WebsiteBuilder() {
  const cfg = getToolConfig('website')
  const [html, setHtml] = useState(defaultHtml)
  const [template, setTemplate] = useState('Blank')
  const [view, setView] = useState<'code' | 'preview'>('preview')
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [remaining, setRemaining] = useState(getRemaining())

  const generate = async () => {
    if (!prompt.trim() || loading || isLimitReached()) return
    const deduction = deductCredits(cfg.credits)
    if (!deduction.allowed) return
    setRemaining(deduction.remaining)
    setLoading(true)
    try {
      const data = await openRouterChat([
        { role: 'system', content: `${cfg.systemPrompt}\n\nTemplate: ${template}.` },
        { role: 'user', content: prompt }
      ], cfg.model)
      if (data.choices?.[0]?.message?.content) setHtml(data.choices[0].message.content)
    } catch { /* ignore */ }
    setLoading(false)
  }

  return (
    <div className="flex gap-6 max-w-7xl mx-auto">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-4">
          <Icons.Globe className="text-primary-400" size={22} />
          <h1 className="text-xl font-semibold">Website Builder</h1>
          <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded bg-primary-600/15 text-primary-400 border border-primary-500/30">{cfg.label}</span>
        </div>
        <div className="card p-0 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 border-b border-dark-700 bg-dark-800/50">
            <div className="flex items-center gap-1">
              <button className={`p-1.5 rounded text-xs flex items-center gap-1 ${view === 'preview' ? 'bg-primary-600/20 text-primary-400' : 'text-dark-400'}`} onClick={() => setView('preview')}><Icons.Monitor size={14} /> Preview</button>
              <button className={`p-1.5 rounded text-xs flex items-center gap-1 ${view === 'code' ? 'bg-primary-600/20 text-primary-400' : 'text-dark-400'}`} onClick={() => setView('code')}><Icons.Code size={14} /> Code</button>
            </div>
          </div>
          {view === 'preview' ? <iframe srcDoc={html} className="w-full h-[500px] bg-white" title="Preview" /> : <textarea className="w-full bg-dark-900 p-4 text-sm font-mono outline-none resize-none min-h-[500px] text-green-400" value={html} onChange={e => setHtml(e.target.value)} spellCheck={false} />}
        </div>
      </div>
      <div className="w-72 shrink-0">
        <div className="card p-4 space-y-4">
          <h2 className="text-sm font-semibold text-dark-300 uppercase tracking-wider">Controls</h2>
          <div className="space-y-2">
            <label className="text-xs text-dark-400 block">Prompt</label>
            <textarea className="input w-full min-h-[100px] resize-none" placeholder="Describe the website..." value={prompt} onChange={e => setPrompt(e.target.value)} />
          </div>
          <div className="space-y-2">
            <label className="text-xs text-dark-400 block">Template</label>
            <select className="input w-full" value={template} onChange={e => setTemplate(e.target.value)}>{templates.map(t => <option key={t} value={t}>{t}</option>)}</select>
          </div>
          <button className="btn-primary w-full flex items-center justify-center gap-2" onClick={generate} disabled={loading || !prompt.trim() || isLimitReached()}>
            {loading ? <Icons.Loader2 className="animate-spin" size={16} /> : <Icons.Sparkles size={16} />}
            {loading ? 'Generating...' : 'Generate'}
          </button>
          <div className="flex items-center justify-between pt-2 border-t border-dark-700">
            <span className="text-xs text-dark-400">Usage</span>
            <span className="text-xs font-medium text-dark-300">{remaining} remaining</span>
          </div>
        </div>
      </div>
    </div>
  )
}
