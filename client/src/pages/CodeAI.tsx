import { useState } from 'react'
import { Code, Play, Copy, Check, Download, Trash2 } from 'lucide-react'

const languages = ['javascript', 'typescript', 'python', 'java', 'cpp', 'go', 'rust', 'html', 'css', 'sql', 'bash']

const snippets: Record<string, string> = {
  javascript: '// JavaScript\nfunction greet(name) {\n  return `Hello, ${name}!`;\n}\n\nconsole.log(greet("World"));',
  python: '# Python\ndef greet(name):\n    return f"Hello, {name}!"\n\nprint(greet("World"))',
  typescript: '// TypeScript\nfunction greet(name: string): string {\n  return `Hello, ${name}!`;\n}\n\nconsole.log(greet("World"));',
}

export default function CodeAI() {
  const [lang, setLang] = useState('javascript')
  const [code, setCode] = useState(snippets.javascript)
  const [output, setOutput] = useState('')
  const [prompt, setPrompt] = useState('')
  const [copied, setCopied] = useState(false)

  const runCode = () => {
    if (lang === 'javascript' || lang === 'typescript') {
      try {
        const logs: string[] = []
        const mockConsole = { log: (...args: any[]) => logs.push(args.join(' ')) }
        const fn = new Function('console', code)
        fn(mockConsole)
        setOutput(logs.join('\n') || 'Code ran successfully (no output)')
      } catch (e: any) { setOutput(`Error: ${e.message}`) }
    } else {
      try { setOutput('Output simulation for ' + lang) }
      catch { setOutput('Error running code') }
    }
  }

  const copyCode = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const generateCode = async () => {
    if (!prompt.trim()) return
    try {
      const res = await fetch('/api/generate-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, language: lang })
      })
      const data = await res.json()
      if (data.code) setCode(data.code)
    } catch { /* ignore */ }
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <Code className="text-primary-400" size={22} />
        <h1 className="text-xl font-semibold">Code AI</h1>
      </div>

      <div className="flex gap-2 mb-4">
        <select className="input w-auto" value={lang} onChange={e => { setLang(e.target.value); setCode(snippets[e.target.value] || '') }}>
          {languages.map(l => <option key={l} value={l}>{l}</option>)}
        </select>
        <input className="input" placeholder="Describe code to generate..." value={prompt} onChange={e => setPrompt(e.target.value)} onKeyDown={e => e.key === 'Enter' && generateCode()} />
        <button className="btn-primary flex items-center gap-2" onClick={generateCode}>Generate</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card p-0 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 border-b border-dark-700 bg-dark-800/50">
            <span className="text-xs text-dark-400">{lang}</span>
            <div className="flex gap-1">
              <button className="p-1.5 rounded hover:bg-dark-700 text-dark-400 hover:text-white" onClick={copyCode}>{copied ? <Check size={14} /> : <Copy size={14} />}</button>
              <button className="p-1.5 rounded hover:bg-dark-700 text-dark-400 hover:text-white" onClick={() => setCode('')}><Trash2 size={14} /></button>
            </div>
          </div>
          <textarea className="w-full bg-transparent p-4 text-sm font-mono outline-none resize-none min-h-[300px]" value={code} onChange={e => setCode(e.target.value)} spellCheck={false} />
        </div>

        <div>
          <div className="card mb-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-sm">Output</h3>
              <button className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1" onClick={runCode}>
                <Play size={12} /> Run
              </button>
            </div>
            <pre className="bg-dark-900 rounded-lg p-3 text-sm font-mono min-h-[200px] text-green-400 overflow-auto">{output || 'Click Run to execute code'}</pre>
          </div>

          <div className="card">
            <h3 className="font-semibold text-sm mb-2">AI Suggestions</h3>
            <p className="text-dark-400 text-xs">Ask AI to write, review, or debug your code using the input above.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
