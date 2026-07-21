import { useState } from 'react'
import { Globe, Monitor, Code as CodeIcon, Sparkles } from 'lucide-react'
import { openRouterChat } from '../lib/openrouter'

const templates = ['Blank', 'Business', 'Portfolio', 'Blog', 'Landing Page', 'E-commerce']
const defaultHtml = '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>My Site</title><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:system-ui,sans-serif;background:#0f172a;color:#e2e8f0}header{padding:2rem;text-align:center}h1{font-size:2.5rem;background:linear-gradient(135deg,#6366f1,#a855f7);-webkit-background-clip:text;-webkit-text-fill-color:transparent}main{max-width:800px;margin:0 auto;padding:2rem}.card{background:#1e293b;border-radius:1rem;padding:2rem;margin:1rem 0}</style></head><body><header><h1>My Site</h1><p>Built with AI Workspace</p></header><main><div class="card"><h2>Welcome!</h2><p>AI-generated website.</p></div></main></body></html>'

export default function WebsiteBuilder() {
  const [html, setHtml] = useState(defaultHtml)
  const [template, setTemplate] = useState('Blank')
  const [view, setView] = useState<'code' | 'preview'>('preview')
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)

  const generate = async () => {
    if (!prompt.trim() || loading) return
    setLoading(true)
    try {
      const data = await openRouterChat([
        { role: 'system', content: `Generate a complete HTML page with inline CSS/JS. Template: ${template}. Return ONLY valid HTML.` },
        { role: 'user', content: prompt }
      ])
      if (data.choices?.[0]?.message?.content) setHtml(data.choices[0].message.content)
    } catch { /* ignore */ }
    setLoading(false)
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center gap-2 mb-6"><Globe className="text-primary-400" size={22} /><h1 className="text-xl font-semibold">Website Builder</h1></div>
      <div className="flex gap-2 mb-4 flex-wrap">
        <input className="input flex-1 min-w-[200px]" placeholder="Describe the website..." value={prompt} onChange={e => setPrompt(e.target.value)} onKeyDown={e => e.key === 'Enter' && generate()} />
        <select className="input w-auto" value={template} onChange={e => setTemplate(e.target.value)}>{templates.map(t => <option key={t} value={t}>{t}</option>)}</select>
        <button className="btn-primary flex items-center gap-2" onClick={generate} disabled={loading}><Sparkles size={16} /> {loading ? '...' : 'Generate'}</button>
      </div>
      <div className="card p-0 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2 border-b border-dark-700 bg-dark-800/50">
          <div className="flex items-center gap-1">
            <button className={`p-1.5 rounded text-xs flex items-center gap-1 ${view === 'preview' ? 'bg-primary-600/20 text-primary-400' : 'text-dark-400'}`} onClick={() => setView('preview')}><Monitor size={14} /> Preview</button>
            <button className={`p-1.5 rounded text-xs flex items-center gap-1 ${view === 'code' ? 'bg-primary-600/20 text-primary-400' : 'text-dark-400'}`} onClick={() => setView('code')}><CodeIcon size={14} /> Code</button>
          </div>
        </div>
        {view === 'preview' ? <iframe srcDoc={html} className="w-full h-[500px] bg-white" title="Preview" /> : <textarea className="w-full bg-dark-900 p-4 text-sm font-mono outline-none resize-none min-h-[500px] text-green-400" value={html} onChange={e => setHtml(e.target.value)} spellCheck={false} />}
      </div>
    </div>
  )
}
