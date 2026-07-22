import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Icons } from '../lib/icons'
import { openRouterChat } from '../lib/openrouter'
import { getRemaining, isLimitReached } from '../lib/usage'

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
        { role: 'system', content: `You are a meme generator. Generate a funny short meme in "${style}" style about the given topic. Return ONLY the meme text (2-4 lines max). Use line breaks for punchline. Make it humorous and viral-worthy.` },
        { role: 'user', content: topic }
      ])
      const text = data.choices?.[0]?.message?.content || 'Could not generate meme.'
      setMemeText(text)
      setRemaining(getRemaining())
    } catch { /* ignore */ }
    setLoading(false)
  }

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <Link to="/" className="btn-ghost p-1.5 !rounded-lg">
            <Icons.ChevronLeft size={18} />
          </Link>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <Icons.Image size={18} className="text-white" />
          </div>
          <h1 className="text-lg font-semibold">Meme Generator</h1>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="card">
            {memeText ? (
              <div className="relative bg-dark-800/80 rounded-xl border-2 border-yellow-400/30 p-6 min-h-[300px] flex items-center justify-center overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500" />
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-400" />
                <div className="absolute top-3 right-3 text-yellow-400/10">
                  <Icons.Sparkles size={28} />
                </div>
                <div className="absolute bottom-3 left-3 text-pink-400/10">
                  <Icons.Sparkles size={20} />
                </div>
                <div className="text-center max-w-lg">
                  <p
                    className="text-xl md:text-2xl font-black text-white leading-relaxed uppercase tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
                    style={{ fontFamily: "'Impact', 'Arial Black', sans-serif" }}
                  >
                    {memeText.split('\n').map((line, i) => (
                      <span key={i}>{line}<br /></span>
                    ))}
                  </p>
                </div>
              </div>
            ) : (
              <div className="min-h-[300px] flex items-center justify-center">
                <div className="text-center text-dark-500 p-8">
                  <Icons.Image size={48} className="mx-auto mb-3 opacity-50" />
                  <p className="text-sm">Your meme will appear here</p>
                  <p className="text-xs text-dark-600 mt-1">Enter a topic and click generate</p>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="space-y-4">
          <div className="card space-y-4">
            <div>
              <h3 className="font-semibold text-sm mb-1.5">Topic</h3>
              <input
                className="input"
                placeholder="e.g. desh er chele, programmer, student life"
                value={topic}
                onChange={e => setTopic(e.target.value)}
              />
            </div>
            <div>
              <h3 className="font-semibold text-sm mb-2">Meme Style</h3>
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
              className="btn-primary w-full flex items-center justify-center gap-2"
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
            <p className="text-[11px] text-dark-500 text-center">
              You have <strong className="text-dark-400">{remaining}</strong> credits remaining
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
