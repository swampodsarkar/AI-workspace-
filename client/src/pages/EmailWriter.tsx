import { useState } from 'react'
import { Icons } from '../lib/icons'
import { getToolConfig } from '../lib/autoModel'
import { openRouterChat } from '../lib/openrouter'
import { isLimitReached, getRemaining, deductCredits } from '../lib/usage'

const cfg = getToolConfig('email')

const tones = ['Professional', 'Friendly', 'Casual', 'Formal', 'Persuasive']
const emailTemplates = ['General Inquiry', 'Follow Up', 'Thank You', 'Introduction', 'Complaint', 'Meeting Request']

export default function EmailWriter() {
  const [to, setTo] = useState('')
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [tone, setTone] = useState('Professional')
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)

  const remaining = getRemaining()

  const generate = async () => {
    if (!prompt.trim() || loading) return
    if (isLimitReached()) return
    setLoading(true)
    try {
      const deduction = deductCredits(cfg.credits)
      if (!deduction.allowed) return
      const data = await openRouterChat([
        { role: 'system', content: `${cfg.systemPrompt} Tone: ${tone}. Return JSON with "subject" and "body" fields.` },
        { role: 'user', content: prompt }
      ], cfg.model)
      const text = data.choices?.[0]?.message?.content || '{}'
      try {
        const p = JSON.parse(text)
        if (p.subject) setSubject(p.subject)
        if (p.body) setBody(p.body)
      } catch {
        setBody(text)
      }
    } catch { /* ignore */ }
    setLoading(false)
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Icons.Mail className="text-primary-400" size={22} />
          <h1 className="text-xl font-semibold">Email Writer</h1>
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-primary-500/10 text-primary-400 border border-primary-500/20 ml-1">{cfg.label}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-dark-400">
          <Icons.Zap size={14} />
          <span>{remaining} / 50 remaining</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="card space-y-4">
            <div>
              <label className="text-xs text-dark-400 block mb-1">To</label>
              <input className="input" placeholder="recipient@email.com" value={to} onChange={e => setTo(e.target.value)} />
            </div>
            <div>
              <label className="text-xs text-dark-400 block mb-1">Subject</label>
              <input className="input" placeholder="Subject line" value={subject} onChange={e => setSubject(e.target.value)} />
            </div>
            <div>
              <label className="text-xs text-dark-400 block mb-1">Email Body</label>
              <textarea className="input min-h-[400px] resize-none" placeholder="Write your email here..." value={body} onChange={e => setBody(e.target.value)} />
            </div>
            <div className="flex justify-end">
              <button className="btn-primary flex items-center gap-2">
                <Icons.Send size={16} /> Send
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="card">
            <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
              <Icons.Sparkles size={14} className="text-primary-400" /> AI Writer
            </h3>
            <textarea
              className="input mb-3 h-24 resize-none text-sm"
              placeholder="Describe the email you want to write..."
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
            />
            <div className="mb-3">
              <label className="text-xs text-dark-400 block mb-1.5">Tone</label>
              <div className="flex flex-wrap gap-1.5">
                {tones.map(t => (
                  <button
                    key={t}
                    className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                      tone === t
                        ? 'bg-primary-600 border-primary-500 text-white'
                        : 'border-dark-600 text-dark-300 hover:border-dark-500'
                    }`}
                    onClick={() => setTone(t)}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <button
              className="btn-primary w-full flex items-center justify-center gap-2 text-sm"
              disabled={loading || !prompt.trim() || !remaining}
              onClick={generate}
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Icons.Sparkles size={14} />
              )}
              {loading ? 'Generating...' : 'Generate'}
            </button>
          </div>

          <div className="card">
            <h3 className="font-semibold text-sm mb-2">Templates</h3>
            <div className="space-y-1">
              {emailTemplates.map(t => (
                <button
                  key={t}
                  className="w-full text-left text-sm px-3 py-2 rounded-lg hover:bg-dark-700 text-dark-300 hover:text-white transition-colors"
                  onClick={() => setPrompt(`Write a ${t.toLowerCase()} email`)}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
