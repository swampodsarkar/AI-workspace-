import { useState } from 'react'
import { BarChart3, Upload, TrendingUp, TrendingDown, Sparkles } from 'lucide-react'
import { openRouterChat } from '../lib/openrouter'

export default function DataAnalysis() {
  const [query, setQuery] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  const analyze = async () => {
    if (!query.trim() || loading) return
    setLoading(true)
    try {
      const d = await openRouterChat([
        { role: 'system', content: 'You are a data analyst. Provide clear, concise analysis.' },
        { role: 'user', content: query }
      ])
      setResult(d.choices?.[0]?.message?.content || 'Analysis complete.')
    } catch { setResult('Analysis failed.') }
    setLoading(false)
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center gap-2 mb-6"><BarChart3 className="text-primary-400" size={22} /><h1 className="text-xl font-semibold">Data Analysis</h1></div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="card">
            <div className="flex items-center justify-between mb-4"><h3 className="font-semibold">Revenue Overview</h3><span className="text-green-400 flex items-center gap-1 text-sm"><TrendingUp size={14} /> +12.5%</span></div>
            <div className="h-48 flex items-end gap-3">{[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 100].map((h, i) => (<div key={i} className="flex-1 flex flex-col items-center gap-1"><div className="w-full rounded-t-md bg-gradient-to-t from-primary-600 to-primary-400 transition-all hover:opacity-80" style={{ height: `${h}%` }} /><span className="text-xs text-dark-500">{['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][i]}</span></div>))}</div>
          </div>
          <div className="card">
            <h3 className="font-semibold mb-3">AI Analysis</h3>
            <div className="flex gap-2 mb-3">
              <input className="input" placeholder="Ask about data..." value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && analyze()} />
              <button className="btn-primary flex items-center gap-2" onClick={analyze} disabled={loading}><Sparkles size={14} /> {loading ? '...' : 'Analyze'}</button>
            </div>
            {result && <div className="bg-dark-700 rounded-lg p-4 text-sm"><p>{result}</p></div>}
          </div>
        </div>
        <div className="space-y-4">
          <div className="card">
            <h3 className="font-semibold text-sm mb-3">Quick Stats</h3>
            {[{ label: 'Revenue', value: '$128.5K', change: '+12.5%', up: true }, { label: 'Users', value: '24,893', change: '+8.2%', up: true }, { label: 'Bounce Rate', value: '32.1%', change: '-3.4%', up: false }].map((s, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-dark-700 last:border-0">
                <div><p className="text-xs text-dark-400">{s.label}</p><p className="font-semibold">{s.value}</p></div>
                <span className={`text-xs flex items-center gap-1 ${s.up ? 'text-green-400' : 'text-red-400'}`}>{s.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}{s.change}</span>
              </div>
            ))}
          </div>
          <div className="card"><button className="btn-secondary w-full flex items-center justify-center gap-2 text-sm"><Upload size={14} /> Import Data</button></div>
        </div>
      </div>
    </div>
  )
}
