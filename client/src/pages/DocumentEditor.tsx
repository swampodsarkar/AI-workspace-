import { useState } from 'react'
import { Icons } from '../lib/icons'
import { getToolConfig } from '../lib/autoModel'
import { openRouterChat } from '../lib/openrouter'
import { getRemaining, isLimitReached } from '../lib/usage'
import { getCoinBalance, spendCoins, hasEnoughCoins, COINS_PER_REQUEST } from '../lib/coins'

const cfg = getToolConfig('document')

export default function DocumentEditor() {
  const [content, setContent] = useState('Start writing with AI assistance...')
  const [title, setTitle] = useState('Untitled Document')
  const [prompt, setPrompt] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [remaining, setRemaining] = useState(getRemaining())

  const handleAiGenerate = async () => {
    if (!prompt.trim() || aiLoading) return
    if (isLimitReached()) {
      if (spendCoins(COINS_PER_REQUEST)) {
        setRemaining(0)
      } else {
        alert('Daily free limit reached! Use coins or upgrade.')
        return
      }
    }
    setAiLoading(true)
    try {
      const data = await openRouterChat([
        { role: 'system', content: `${cfg.systemPrompt}\n\nCurrent document content:\n${content}` },
        { role: 'user', content: prompt }
      ], cfg.model)
      const reply = data.choices?.[0]?.message?.content || 'No response'
      setContent(prev => prev + '\n\n---\n\n' + reply)
      setPrompt('')
      setRemaining(getRemaining())
    } catch (err: any) {
      alert(err.message)
    }
    setAiLoading(false)
  }

  return (
    <div className="max-w-6xl mx-auto animate-fade-in h-[calc(100vh-7rem)] -m-4 md:-m-6 flex gap-0">
      <div className="flex-1 flex flex-col min-w-0 p-4 md:p-6 overflow-y-auto">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center shadow-lg shadow-primary-500/20">
              <Icons.PenSquare size={20} className="text-white" />
            </div>
            <input className="bg-transparent text-lg font-semibold border-none outline-none text-white" value={title} onChange={e => setTitle(e.target.value)} />
          </div>
          <div className="flex items-center gap-2">
            <span className={`badge flex items-center gap-1 ${remaining <= 5 ? 'badge-red' : 'badge-green'}`}>
              <Icons.Zap size={10} /> {remaining}/{50}
            </span>
            <button className="btn-primary text-sm py-1.5 px-3 flex items-center gap-1.5">
              <Icons.Save size={14} /> Save
            </button>
          </div>
        </div>

        <div className="card flex-1 flex flex-col">
          <div className="flex items-center gap-1 flex-wrap border-b border-dark-700 pb-2 mb-3">
            {[Icons.Bold, Icons.Italic, Icons.Underline].map((Icon, i) => (
              <button key={i} className="p-2 rounded hover:bg-dark-700 text-dark-300 hover:text-white transition-colors">
                <Icon size={16} />
              </button>
            ))}
            <span className="w-px h-5 bg-dark-600 mx-1" />
            {[Icons.AlignLeft, Icons.AlignCenter, Icons.AlignRight].map((Icon, i) => (
              <button key={i} className="p-2 rounded hover:bg-dark-700 text-dark-300 hover:text-white transition-colors">
                <Icon size={16} />
              </button>
            ))}
            <span className="w-px h-5 bg-dark-600 mx-1" />
            <button className="p-2 rounded hover:bg-dark-700 text-dark-300 hover:text-white transition-colors">
              <Icons.List size={16} />
            </button>
            <button className="p-2 rounded hover:bg-dark-700 text-dark-300 hover:text-white transition-colors">
              <Icons.Image size={16} />
            </button>
          </div>
          <textarea className="w-full bg-transparent text-sm min-h-[400px] outline-none resize-none flex-1"
            value={content} onChange={e => setContent(e.target.value)} />
        </div>
      </div>

      <div className="w-80 lg:w-96 flex-shrink-0 border-l border-dark-700/50 bg-dark-800/30 p-4 md:p-5 flex flex-col overflow-y-auto">
        <div className="flex items-center gap-2 mb-4">
          <Icons.Sparkles size={16} className="text-primary-400" />
          <h3 className="font-semibold text-sm">AI Assistant</h3>
        </div>

        <div className="flex-1 space-y-3">
          <div className="bg-dark-800/60 border border-dark-700/50 rounded-xl p-3">
            <p className="text-xs text-dark-400 leading-relaxed">
              Ask the AI to write, improve, or edit your document content. The AI will append the result to your document.
            </p>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-dark-300">Prompt</label>
            <textarea
              className="input min-h-[100px] resize-none"
              placeholder="e.g. Write a professional introduction paragraph about cloud computing..."
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
            />
          </div>

          <button
            className="btn-primary w-full flex items-center justify-center gap-2 py-2.5"
            onClick={handleAiGenerate}
            disabled={aiLoading || !prompt.trim() || (isLimitReached() && !hasEnoughCoins(COINS_PER_REQUEST))}
          >
            {aiLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Icons.Sparkles size={16} />
            )}
            {aiLoading ? 'Generating...' : 'Generate with AI'}
          </button>

          {isLimitReached() && (
            <div className="flex items-center gap-2 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 text-red-400">
              <Icons.AlertTriangle size={13} />
              <span>Limit reached. You have {getCoinBalance()} coins.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
