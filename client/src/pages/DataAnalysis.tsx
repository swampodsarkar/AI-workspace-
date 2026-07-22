import { useState } from 'react'
import { getToolConfig } from '../lib/autoModel'
import { openRouterChat } from '../lib/openrouter'
import { isLimitReached, getRemaining, deductCredits } from '../lib/usage'
import { Icons } from '../lib/icons'

const cfg = getToolConfig('analysis')
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const chartData = [40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 100]
const stats = [
  { label: 'Revenue', value: '$128.5K', change: '+12.5%', up: true },
  { label: 'Users', value: '24,893', change: '+8.2%', up: true },
  { label: 'Bounce Rate', value: '32.1%', change: '-3.4%', up: false },
]

export default function DataAnalysis() {
  const [query, setQuery] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  const analyze = async () => {
    if (!query.trim() || loading) return
    if (isLimitReached()) { setResult('Daily usage limit reached.'); return }
    const { allowed } = deductCredits(cfg.credits)
    if (!allowed) { setResult('Insufficient credits.'); return }
    setLoading(true)
    try {
      const d = await openRouterChat([
        { role: 'system', content: cfg.systemPrompt },
        { role: 'user', content: query }
      ], cfg.model)
      setResult(d.choices?.[0]?.message?.content || 'Analysis complete.')
    } catch { setResult('Analysis failed.') }
    setLoading(false)
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary-500/10 text-primary-400"><Icons.BarChart3 size={20} /></div>
          <div>
            <h1 className="text-xl font-semibold">Data Analysis</h1>
            <p className="text-xs text-dark-400">AI-powered business intelligence</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-xs text-dark-400 bg-dark-800 px-3 py-1.5 rounded-full border border-dark-700">
          <Icons.Coins size={12} /> <span>{getRemaining()} / 50 remaining</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <div className="card overflow-hidden">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold">Revenue Overview</h3>
              <span className="text-green-400 flex items-center gap-1 text-sm font-medium"><Icons.TrendingUp size={14} /> +12.5%</span>
            </div>
            <div className="h-52 flex items-end gap-2.5 px-1">
              {chartData.map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1.5 group">
                  <span className="text-[10px] text-dark-500 opacity-0 group-hover:opacity-100 transition-opacity">{h}%</span>
                  <div
                    className="w-full rounded-sm bg-gradient-to-t from-primary-600 to-primary-400 transition-all duration-300 hover:opacity-80 cursor-pointer"
                    style={{ height: `${h}%` }}
                  />
                  <span className="text-[11px] text-dark-500">{months[i]}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Icons.Sparkles size={14} className="text-primary-400" />
              AI Analysis
            </h3>
            {result && (
              <div className="bg-dark-800/80 rounded-lg p-4 text-sm leading-relaxed border border-dark-700 mb-4 whitespace-pre-wrap">
                {result}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="card">
            <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
              <Icons.MessageSquare size={14} className="text-primary-400" />
              Ask AI
            </h3>
            <div className="space-y-3">
              <textarea
                className="input min-h-[90px] resize-none text-sm"
                placeholder="Ask about your data..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && analyze()}
              />
              <button
                className="btn-primary w-full flex items-center justify-center gap-2"
                onClick={analyze}
                disabled={loading || !query.trim()}
              >
                {loading ? (
                  <Icons.Loader2 size={14} className="animate-spin" />
                ) : (
                  <Icons.Send size={14} />
                )}
                {loading ? 'Analyzing...' : 'Ask AI'}
              </button>
            </div>
          </div>

          <div className="card">
            <h3 className="font-semibold text-sm mb-3">Quick Stats</h3>
            <div className="space-y-1">
              {stats.map((s, i) => (
                <div key={i} className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-dark-700/50 transition-colors -mx-1">
                  <div>
                    <p className="text-xs text-dark-400">{s.label}</p>
                    <p className="font-semibold text-sm">{s.value}</p>
                  </div>
                  <span className={`text-xs flex items-center gap-1 font-medium ${s.up ? 'text-green-400' : 'text-red-400'}`}>
                    {s.up ? <Icons.TrendingUp size={12} /> : <Icons.TrendingDown size={12} />}
                    {s.change}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <button className="btn-secondary w-full flex items-center justify-center gap-2 text-sm py-2.5">
            <Icons.Upload size={14} /> Import Data
          </button>
        </div>
      </div>
    </div>
  )
}
