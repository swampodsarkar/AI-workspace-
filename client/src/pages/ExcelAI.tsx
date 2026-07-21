import { useState } from 'react'
import { Icons } from '../lib/icons'
import { openRouterChat } from '../lib/openrouter'

export default function ExcelAI() {
  const [data, setData] = useState<string[][]>([['Name', 'Age', 'City', 'Salary'], ['John Doe', '30', 'New York', '$75,000'], ['Jane Smith', '25', 'London', '$62,000'], ['Bob Johnson', '35', 'Tokyo', '$88,000']])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)

  const askAI = async () => {
    if (!query.trim() || loading) return
    setLoading(true)
    try {
      const d = await openRouterChat([
        { role: 'system', content: `Modify tabular data based on the query. Return ONLY a JSON array of arrays. Current data: ${JSON.stringify(data)}` },
        { role: 'user', content: query }
      ])
      const text = d.choices?.[0]?.message?.content || '[]'
      try { const parsed = JSON.parse(text); if (Array.isArray(parsed) && parsed.length) setData(parsed) }
      catch { /* keep original */ }
    } catch { /* ignore */ }
    setLoading(false)
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center gap-2 mb-6"><Icons.Table className="text-primary-400" size={22} /><h1 className="text-xl font-semibold">Excel AI</h1></div>
      <div className="flex gap-2 mb-4">
        <input className="input" placeholder='Ask AI (e.g., "Add a Bonus column")' value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && askAI()} />
        <button className="btn-primary flex items-center gap-2" onClick={askAI} disabled={loading}><Icons.Sparkles size={16} /> {loading ? '...' : 'Ask AI'}</button>
      </div>
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-dark-600">{data[0]?.map((h, i) => <th key={i} className="text-left p-3 font-semibold text-primary-400">{h}</th>)}</tr></thead>
          <tbody>{data.slice(1).map((row, i) => <tr key={i} className="border-b border-dark-700/50 hover:bg-dark-700/50">{row.map((cell, j) => <td key={j} className="p-3">{cell}</td>)}</tr>)}</tbody>
        </table>
      </div>
      <div className="flex gap-2 mt-4"><button className="btn-secondary flex items-center gap-2"><Icons.Upload size={16} /> Import</button><button className="btn-secondary flex items-center gap-2"><Icons.Download size={16} /> Export</button></div>
    </div>
  )
}
