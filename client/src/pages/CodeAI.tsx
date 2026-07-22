import { useState, useEffect, useRef } from 'react'
import { Icons } from '../lib/icons'
import { openRouterChat } from '../lib/openrouter'
import { getToolConfig } from '../lib/autoModel'
import { isLimitReached, getRemaining, deductCredits } from '../lib/usage'

const cfg = getToolConfig('code')

const languages = ['javascript', 'typescript', 'python', 'java', 'cpp', 'go', 'rust', 'html', 'css', 'sql', 'bash']
const snippets: Record<string, string> = {
  javascript: '// JavaScript\nfunction greet(name) {\n  return `Hello, ${name}!`;\n}\n\nconsole.log(greet("World"));',
  python: '# Python\ndef greet(name):\n    return f"Hello, {name}!"\n\nprint(greet("World"))'
}

export default function CodeAI() {
  const [lang, setLang] = useState('javascript')
  const [code, setCode] = useState(snippets.javascript)
  const [output, setOutput] = useState('')
  const [prompt, setPrompt] = useState('')
  const [context, setContext] = useState('')
  const [tone, setTone] = useState('clean')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [remaining, setRemaining] = useState(getRemaining)
  const [error, setError] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    setRemaining(getRemaining())
  }, [])

  const runCode = () => {
    if (lang === 'javascript') {
      try {
        const logs: string[] = []
        new Function('console', code)({ log: (...a: any[]) => logs.push(a.join(' ')) })
        setOutput(logs.join('\n') || 'OK')
      } catch (e: any) {
        setOutput(`Error: ${e.message}`)
      }
    } else setOutput('Run supported for JavaScript only')
  }

  const copyCode = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const generateCode = async () => {
    if (!prompt.trim() || loading) return
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
      const contextBlock = context.trim()
        ? `\n\nContext about the codebase:\n${context}`
        : ''
      const toneMap: Record<string, string> = {
        clean: 'Generate clean, readable, production-grade code with proper error handling.',
        concise: 'Generate minimal, terse code. No comments, no extra whitespace.',
        verbose: 'Generate well-commented code with detailed explanations for each section.',
        beginner: 'Generate simple, beginner-friendly code with lots of comments explaining each step.'
      }
      const toneInstruction = toneMap[tone] || toneMap.clean
      const data = await openRouterChat([
        { role: 'system', content: `${cfg.systemPrompt}\n\nTarget language: ${lang}.\n${toneInstruction}\n${contextBlock}` },
        { role: 'user', content: prompt }
      ], cfg.model)
      if (data.choices?.[0]?.message?.content) {
        setCode(data.choices[0].message.content)
      } else {
        setError('No response from the model. Please try again.')
      }
    } catch (e: any) {
      setError(e?.message || 'An unexpected error occurred.')
    }
    setLoading(false)
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between px-6 py-3 border-b border-dark-700 bg-dark-850">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Icons.Code className="text-primary-400" size={22} />
            <h1 className="text-lg font-semibold text-white">Code AI</h1>
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
              <Icons.File size={13} />
              <span>main.{lang}</span>
              <span className="text-dark-600">|</span>
              <span className="text-dark-500">{code.split('\n').length} lines</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                className="p-1.5 rounded hover:bg-dark-700 text-dark-400 hover:text-white transition-colors"
                onClick={copyCode}
                title="Copy code"
              >
                {copied ? <Icons.Check size={14} /> : <Icons.Copy size={14} />}
              </button>
            </div>
          </div>
          <textarea
            ref={textareaRef}
            className="flex-1 w-full bg-dark-900 p-5 text-sm font-mono text-gray-200 outline-none resize-none border-0 leading-relaxed"
            value={code}
            onChange={e => setCode(e.target.value)}
            spellCheck={false}
            placeholder="// Your code appears here..."
          />

          <div className="border-t border-dark-700 bg-dark-850">
            <div className="flex items-center justify-between px-4 py-2">
              <h3 className="text-xs font-semibold text-dark-400 uppercase tracking-wider flex items-center gap-1.5">
                <Icons.Code size={12} />
                Output
              </h3>
              <button
                className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1.5"
                onClick={runCode}
              >
                <Icons.Play size={12} />
                Run
              </button>
            </div>
            <pre className="bg-dark-950 px-4 py-3 text-sm font-mono text-green-400 overflow-auto max-h-[180px] min-h-[60px] border-t border-dark-800">
              {output || <span className="text-dark-500">Click Run to execute code</span>}
            </pre>
          </div>
        </div>

        <div className="w-[340px] flex-shrink-0 bg-dark-850 overflow-y-auto">
          <div className="p-4 space-y-4">
            <div>
              <label className="block text-xs font-medium text-dark-400 uppercase tracking-wider mb-2">
                Language
              </label>
              <select
                className="input w-full text-sm"
                value={lang}
                onChange={e => {
                  setLang(e.target.value)
                  setCode(snippets[e.target.value] || '')
                  setError('')
                }}
              >
                {languages.map(l => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-dark-400 uppercase tracking-wider mb-2">
                Prompt
              </label>
              <textarea
                className="input w-full text-sm resize-none"
                rows={4}
                placeholder="Describe the code you want to generate..."
                value={prompt}
                onChange={e => { setPrompt(e.target.value); setError('') }}
                onKeyDown={e => {
                  if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) generateCode()
                }}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-dark-400 uppercase tracking-wider mb-2">
                Context <span className="text-dark-600 font-normal normal-case">(optional)</span>
              </label>
              <textarea
                className="input w-full text-sm resize-none"
                rows={2}
                placeholder="Existing code or requirements..."
                value={context}
                onChange={e => setContext(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-dark-400 uppercase tracking-wider mb-2">
                Code Style
              </label>
              <select
                className="input w-full text-sm"
                value={tone}
                onChange={e => setTone(e.target.value)}
              >
                <option value="clean">Clean & Production</option>
                <option value="concise">Minimal & Terse</option>
                <option value="verbose">Verbose & Commented</option>
                <option value="beginner">Beginner Friendly</option>
              </select>
            </div>

            {error && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-400">
                <Icons.AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              className="btn-primary w-full flex items-center justify-center gap-2 py-2.5 text-sm font-medium"
              onClick={generateCode}
              disabled={loading || !prompt.trim()}
            >
              {loading ? (
                <Icons.Loader2 size={16} className="animate-spin" />
              ) : (
                <Icons.Sparkles size={16} />
              )}
              {loading ? 'Generating...' : 'Generate Code'}
            </button>

            <div className="pt-2 border-t border-dark-700">
              <div className="flex items-center justify-between text-xs text-dark-500">
                <span>Model</span>
                <span className="text-dark-400">{cfg.model}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-dark-500 mt-1">
                <span>Cost</span>
                <span className="text-dark-400">{cfg.credits} credit{cfg.credits !== 1 ? 's' : ''}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
