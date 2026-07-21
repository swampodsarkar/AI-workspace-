import { useState } from 'react'
import { Table, Upload, Download, Sparkles } from 'lucide-react'

export default function ExcelAI() {
  const [data, setData] = useState<string[][]>([
    ['Name', 'Age', 'City', 'Salary'],
    ['John Doe', '30', 'New York', '$75,000'],
    ['Jane Smith', '25', 'London', '$62,000'],
    ['Bob Johnson', '35', 'Tokyo', '$88,000'],
  ])
  const [query, setQuery] = useState('')

  const askAI = async () => {
    if (!query.trim()) return
    try {
      const res = await fetch('/api/excel-query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, data })
      })
      const result = await res.json()
      if (result.data) setData(result.data)
    } catch { /* ignore */ }
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <Table className="text-primary-400" size={22} />
        <h1 className="text-xl font-semibold">Excel AI</h1>
      </div>

      <div className="flex gap-2 mb-4">
        <input className="input" placeholder="Ask AI to modify data (e.g., 'Add a new column for Bonus')" value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && askAI()} />
        <button className="btn-primary flex items-center gap-2" onClick={askAI}>
          <Sparkles size={16} /> Ask AI
        </button>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-dark-600">
              {data[0]?.map((h, i) => <th key={i} className="text-left p-3 font-semibold text-primary-400">{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {data.slice(1).map((row, i) => (
              <tr key={i} className="border-b border-dark-700/50 hover:bg-dark-700/50">
                {row.map((cell, j) => <td key={j} className="p-3">{cell}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex gap-2 mt-4">
        <button className="btn-secondary flex items-center gap-2"><Upload size={16} /> Import CSV</button>
        <button className="btn-secondary flex items-center gap-2"><Download size={16} /> Export CSV</button>
      </div>
    </div>
  )
}
