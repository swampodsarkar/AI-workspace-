import { useState } from 'react'
import { Mail, Send, Sparkles } from 'lucide-react'
import { openRouterChat } from '../lib/openrouter'

const tones = ['Professional', 'Friendly', 'Casual', 'Formal', 'Persuasive']
const emailTemplates = ['General Inquiry', 'Follow Up', 'Thank You', 'Introduction', 'Complaint', 'Meeting Request']

export default function EmailWriter() {
  const [to, setTo] = useState('')
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [tone, setTone] = useState('Professional')
  const [prompt, setPrompt] = useState('')

  const generate = async () => {
    if (!prompt.trim()) return
    try {
      const data = await openRouterChat([
        { role: 'system', content: `Write an email. Tone: ${tone}. Return JSON: { "subject": "...", "body": "..." }` },
        { role: 'user', content: prompt }
      ])
      const text = data.choices?.[0]?.message?.content || '{}'
      try { const p = JSON.parse(text); if (p.subject) setSubject(p.subject); if (p.body) setBody(p.body) }
      catch { setBody(text) }
    } catch { /* ignore */ }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-2 mb-6"><Mail className="text-primary-400" size={22} /><h1 className="text-xl font-semibold">Email Writer</h1></div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="card space-y-4">
            <input className="input" placeholder="To: recipient@email.com" value={to} onChange={e => setTo(e.target.value)} />
            <input className="input" placeholder="Subject line" value={subject} onChange={e => setSubject(e.target.value)} />
            <textarea className="input min-h-[300px] resize-none" placeholder="Write your email here..." value={body} onChange={e => setBody(e.target.value)} />
            <div className="flex justify-end"><button className="btn-primary flex items-center gap-2"><Send size={16} /> Send</button></div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="card">
            <h3 className="font-semibold text-sm mb-3">AI Writer</h3>
            <textarea className="input mb-3 h-20 resize-none text-sm" placeholder="Describe the email..." value={prompt} onChange={e => setPrompt(e.target.value)} />
            <div className="mb-3">
              <label className="text-xs text-dark-400 block mb-1">Tone</label>
              <div className="flex flex-wrap gap-1">{tones.map(t => (<button key={t} className={`text-xs px-2 py-1 rounded-full border ${tone === t ? 'bg-primary-600 border-primary-500' : 'border-dark-600 text-dark-300'}`} onClick={() => setTone(t)}>{t}</button>))}</div>
            </div>
            <button className="btn-primary w-full flex items-center justify-center gap-2 text-sm" onClick={generate}><Sparkles size={14} /> Generate</button>
          </div>
          <div className="card">
            <h3 className="font-semibold text-sm mb-2">Templates</h3>
            <div className="space-y-1">{emailTemplates.map(t => (<button key={t} className="w-full text-left text-sm px-3 py-2 rounded-lg hover:bg-dark-700 text-dark-300" onClick={() => setPrompt(`Write a ${t.toLowerCase()} email`)}>{t}</button>))}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
