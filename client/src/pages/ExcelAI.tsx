import { useState, useEffect, useRef } from 'react'
import { Icons } from '../lib/icons'
import { openRouterChat } from '../lib/openrouter'
import { getToolConfig } from '../lib/autoModel'
import { isLimitReached, getRemaining, deductCredits } from '../lib/usage'

const cfg = getToolConfig('excel')

const defaultData: string[][] = [
  ['Name', 'Age', 'City', 'Salary'],
  ['John Doe', '30', 'New York', '$75,000'],
  ['Jane Smith', '25', 'London', '$62,000'],
  ['Bob Johnson', '35', 'Tokyo', '$88,000']
]

const quickActions = [
  { label: 'Add Bonus Column', prompt: 'Add a 10% bonus column for each person based on their salary' },
  { label: 'Sort by Salary', prompt: 'Sort the table by Salary in descending order' },
  { label: 'Add Department', prompt: 'Add a Department column with realistic departments for each person' },
  { label: 'Calculate Average', prompt: 'Add a row at the bottom showing the average age and average salary' },
]

export default function ExcelAI() {
  const [data, setData] = useState<string[][]>(defaultData)
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [remaining, setRemaining] = useState(getRemaining)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setRemaining(getRemaining())
  }, [])

  const askAI = async (prompt?: string) => {
    const q = (prompt || query).trim()
    if (!q || loading) return
    if (isLimitReached()) {
      setError('Daily usage limit reached. Please try again tomorrow.')
      return
    }
    setLoading(true)
    setError('')
    const deduction = deductCredits(cfg.credits)
    if (!deduction.allowed) {
      setError('Not enough credits remaining.')
      setLoading(false)
      return
    }
    setRemaining(deduction.remaining)
    try {
      const d = await openRouterChat([
        { role: 'system', content: `${cfg.systemPrompt}\n\nCurrent data: ${JSON.stringify(data)}` },
        { role: 'user', content: q }
      ], cfg.model)
      const text = d.choices?.[0]?.message?.content || '[]'
      const cleaned = text.replace(/```json\s*/gi, '').replace(/```\s*$/g, '').trim()
      const parsed = JSON.parse(cleaned)
      if (Array.isArray(parsed) && parsed.length >= 1 && Array.isArray(parsed[0])) {
        setData(parsed)
        if (!prompt) setQuery('')
      } else {
        setError('AI returned invalid data format. Please try again.')
      }
    } catch (e: any) {
      setError(e?.message || 'Failed to process AI response.')
    }
    setLoading(false)
  }

  const exportCSV = () => {
    const csv = data.map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'spreadsheet.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  const importCSV = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.csv'
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return
      const text = await file.text()
      const rows = text.split('\n').filter(Boolean).map(line => line.split(',').map(cell => cell.replace(/^"|"$/g, '').replace(/""/g, '"')))
      if (rows.length >= 1) setData(rows)
    }
    input.click()
  }

  const copyTable = () => {
    const text = data.map(row => row.join('\t')).join('\n')
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const resetData = () => {
    setData(defaultData)
    setError('')
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between px-6 py-3 border-b border-dark-700 bg-dark-850">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Icons.Table className="text-primary-400" size={22} />
            <h1 className="text-lg font-semibold text-white">Excel AI</h1>
          </div>
          <span className="px-2 py-0.5 text-[11px] font-medium rounded-full bg-primary-500/10 text-primary-400 border border-primary-500/20">
            {cfg.label}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-dark-400 flex items-center gap-1.5">
            <Icons.Zap size={13} className="text-amber-400" />
            <span className="font-medium text-dark-300">{remaining}</span>
            <span className="text-dark-500">/ 50</span>
          </span>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex flex-col overflow-hidden border-r border-dark-700">
          <div className="flex items-center justify-between px-4 py-2 bg-dark-800/40 border-b border-dark-700">
            <div className="flex items-center gap-2 text-xs text-dark-400">
              <Icons.FileText size={13} />
              <span>Spreadsheet</span>
              <span className="text-dark-600">|</span>
              <span className="text-dark-500">{data.length - 1} rows</span>
              <span className="text-dark-600">|</span>
              <span className="text-dark-500">{data[0]?.length || 0} columns</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                className="p-1.5 rounded hover:bg-dark-700 text-dark-400 hover:text-white transition-colors"
                onClick={copyTable}
                title="Copy table"
              >
                {copied ? <Icons.Check size={14} /> : <Icons.Copy size={14} />}
              </button>
              <button
                className="p-1.5 rounded hover:bg-dark-700 text-dark-400 hover:text-white transition-colors"
                onClick={resetData}
                title="Reset data"
              >
                <Icons.RefreshCw size={14} />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-dark-800 sticky top-0 z-10">
                  <th className="w-10 text-center p-3 text-xs font-medium text-dark-500 bg-dark-800 border-b border-dark-600">#</th>
                  {data[0]?.map((h, i) => (
                    <th key={i} className="text-left p-3 font-semibold text-primary-400 bg-dark-800 border-b border-dark-600 whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.slice(1).map((row, i) => (
                  <tr key={i} className="border-b border-dark-700/50 hover:bg-dark-700/30 transition-colors">
                    <td className="text-center p-3 text-xs text-dark-500 font-mono">{i + 1}</td>
                    {row.map((cell, j) => (
                      <td key={j} className="p-3 text-gray-300 whitespace-nowrap">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            {data.length <= 1 && (
              <div className="flex items-center justify-center h-32 text-dark-500 text-sm">
                No data available
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 px-4 py-3 border-t border-dark-700 bg-dark-850">
            <button className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5" onClick={importCSV}>
              <Icons.Upload size={13} />
              Import CSV
            </button>
            <button className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5" onClick={exportCSV}>
              <Icons.Download size={13} />
              Export CSV
            </button>
            <div className="flex-1" />
            <span className="text-[11px] text-dark-500">
              {data.length - 1} record{data.length - 1 !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        <div className="w-[340px] flex-shrink-0 bg-dark-850 overflow-y-auto">
          <div className="p-4 space-y-4">
            <div>
              <label className="block text-xs font-medium text-dark-400 uppercase tracking-wider mb-2">
                Ask AI
              </label>
              <div className="relative">
                <input
                  ref={inputRef}
                  className="input w-full text-sm pr-10"
                  placeholder='e.g. "Add a Bonus column"...'
                  value={query}
                  onChange={e => { setQuery(e.target.value); setError('') }}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) askAI()
                    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); askAI() }
                  }}
                />
                {query.trim() && !loading && (
                  <button
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-primary-400 hover:text-primary-300 transition-colors"
                    onClick={() => askAI()}
                  >
                    <Icons.ArrowRight size={16} />
                  </button>
                )}
              </div>
              <p className="text-[11px] text-dark-500 mt-1.5">Press Enter to send, Ctrl+Enter for new line</p>
            </div>

            <div>
              <label className="block text-xs font-medium text-dark-400 uppercase tracking-wider mb-2">
                Quick Actions
              </label>
              <div className="space-y-1.5">
                {quickActions.map((action, i) => (
                  <button
                    key={i}
                    className="w-full text-left text-xs px-3 py-2 rounded-lg bg-dark-800/60 hover:bg-dark-700 border border-dark-700/50 hover:border-primary-500/30 text-dark-300 hover:text-white transition-all flex items-center gap-2"
                    onClick={() => { setQuery(action.prompt); askAI(action.prompt) }}
                    disabled={loading}
                  >
                    <Icons.Zap size={12} className="text-amber-400/70 flex-shrink-0" />
                    <span className="truncate">{action.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              className="btn-primary w-full flex items-center justify-center gap-2 py-2.5 text-sm font-medium"
              onClick={() => askAI()}
              disabled={loading || !query.trim()}
            >
              {loading ? (
                <Icons.Loader2 size={16} className="animate-spin" />
              ) : (
                <Icons.Sparkles size={16} />
              )}
              {loading ? 'Processing...' : 'Ask AI'}
            </button>

            {error && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-400">
                <Icons.AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="pt-2 border-t border-dark-700">
              <div className="flex items-center justify-between text-xs text-dark-500">
                <span>Model</span>
                <span className="text-dark-400">{cfg.model}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-dark-500 mt-1">
                <span>Cost per query</span>
                <span className="text-dark-400">{cfg.credits} credit{cfg.credits !== 1 ? 's' : ''}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-dark-500 mt-1">
                <span>Rows</span>
                <span className="text-dark-400">{data.length - 1}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
