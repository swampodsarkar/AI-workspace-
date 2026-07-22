import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Icons } from '../lib/icons'
import { getToolConfig } from '../lib/autoModel'
import { openRouterChat } from '../lib/openrouter'
import { getRemaining, isLimitReached } from '../lib/usage'

const cfg = getToolConfig('meme')

const styles = ['Bengali Funny', 'Dark Humor', 'Relatable', 'Programming', 'Bollywood']

export default function MemeGenerator() {
  const [topic, setTopic] = useState('')
  const [style, setStyle] = useState('Bengali Funny')
  const [memeText, setMemeText] = useState('')
  const [loading, setLoading] = useState(false)
  const [remaining, setRemaining] = useState(getRemaining())

  const generate = async () => {
    if (!topic.trim() || loading) return
    if (isLimitReached()) return
    setLoading(true)
    try {
      const data = await openRouterChat([
        { role: 'system', content: `${cfg.systemPrompt}\nGenerate in "${style}" style.` },
        { role: 'user', content: topic }
      ], cfg.model)
      const text = data.choices?.[0]?.message?.content || 'Could not generate meme.'
      setMemeText(text)
      setRemaining(getRemaining())
    } catch { /* ignore */ }
    setLoading(false)
  }

  return (
    <div className="max-w-6xl mx-auto animate-fade-in h-[calc(100vh-7rem)] -m-4 md:-m-6 flex gap-0">
      <div className="flex-1 flex flex-col min-w-0 p-4 md:p-6 overflow-y-auto">
        <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <Link to="/" className="btn-ghost p-1.5 !rounded-lg">
              <Icons.ChevronLeft size={18} />
            </Link>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Icons.Image size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Meme Generator</h1>
              <p className="text-sm text-dark-400">AI-powered viral meme creator</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-dark-800/80 border border-dark-700/60 rounded-lg">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs text-dark-300 font-medium">{cfg.label}</span>
            </div>
            <span className={`badge flex items-center gap-1 ${remaining <= 0 ? 'badge-red' : 'badge-green'}`}>
              <Icons.Zap size={10} /> {remaining}/{50}
            </span>
          </div>
        </div>

        {isLimitReached() && (
          <div className="flex items-center gap-2 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2.5 mb-4 text-red-400">
            <Icons.AlertTriangle size={15} />
            Daily limit reached.
            <Link to="/earn" className="underline font-semibold ml-auto flex items-center gap-1">
              <Icons.Coins size={14} /> Earn more coins
            </Link>
          </div>
        )}

        <div className="card flex-1 flex items-center justify-center">
          {memeText ? (
            <div className="relative w-full max-w-2xl mx-auto bg-dark-800/80 rounded-2xl border-2 border-yellow-400/30 p-8 md:p-12 min-h-[400px] flex items-center justify-center overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500" />
              <div className="absolute bottom-0 left-0 w-full h-1.5 bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-400" />
              <div className="absolute top-4 right-4 text-yellow-400/10">
                <Icons.Sparkles size={32} />
              </div>
              <div className="absolute bottom-4 left-4 text-pink-400/10">
                <Icons.Sparkles size={24} />
              </div>
              <div className="text-center max-w-lg">
                <p
                  className="text-2xl md:text-3xl font-black text-white leading-relaxed uppercase tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
                  style={{ fontFamily: "'Impact', 'Arial Black', sans-serif" }}
                >
                  {memeText.split('\n').map((line, i) => (
                    <span key={i}>{line}<br /></span>
                  ))}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center text-dark-500 p-12">
              <div className="w-20 h-20 rounded-2xl bg-dark-800/80 border border-dark-700/50 flex items-center justify-center mx-auto mb-4">
                <Icons.Image size={36} className="opacity-50" />
              </div>
              <p className="text-base font-medium text-dark-300">Your meme will appear here</p>
              <p className="text-sm text-dark-500 mt-1">Enter a topic, choose a style, and generate</p>
            </div>
          )}
        </div>
      </div>

      <div className="w-80 lg:w-96 flex-shrink-0 border-l border-dark-700/50 bg-dark-800/30 p-4 md:p-5 flex flex-col overflow-y-auto">
        <div className="flex items-center gap-2 mb-4">
          <Icons.Sparkles size={16} className="text-purple-400" />
          <h3 className="font-semibold text-sm">Controls</h3>
        </div>

        <div className="flex-1 space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-dark-300">Topic</label>
            <input
              className="input"
              placeholder="e.g. desh er chele, programmer, student life"
              value={topic}
              onChange={e => setTopic(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-dark-300">Meme Style</label>
            <div className="flex flex-wrap gap-1.5">
              {styles.map(s => (
                <button
                  key={s}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-all ${style === s ? 'bg-primary-600 border-primary-500 text-white' : 'border-dark-600 text-dark-300 hover:border-dark-400 hover:text-white'}`}
                  onClick={() => setStyle(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <button
            className="btn-primary w-full flex items-center justify-center gap-2 py-2.5"
            onClick={generate}
            disabled={loading || !topic.trim() || isLimitReached()}
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Icons.Sparkles size={16} />
            )}
            {loading ? 'Generating...' : 'Generate Meme'}
          </button>

          <div className="bg-dark-800/60 border border-dark-700/50 rounded-xl p-3 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-dark-400">Credits remaining</span>
              <span className={`font-semibold ${remaining <= 0 ? 'text-red-400' : 'text-green-400'}`}>{remaining}</span>
            </div>
            <div className="w-full h-1.5 bg-dark-700 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${remaining <= 0 ? 'bg-red-500' : 'bg-gradient-to-r from-primary-500 to-primary-400'}`}
                style={{ width: `${(remaining / 50) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
