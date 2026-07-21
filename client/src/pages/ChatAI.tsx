import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Bot, Send, User, Loader2, Plus, AlertTriangle, Info, Sparkles, ChevronDown, Search } from 'lucide-react'
import { openRouterChat, getCachedModels } from '../lib/openrouter'
import { getRemaining, isLimitReached } from '../lib/usage'

interface Message { role: 'user' | 'assistant'; content: string }

export default function ChatAI() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hello! I'm your AI assistant. I was created by **Swampod Sarkar**. Free models only. How can I help you today?" }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [model, setModel] = useState('')
  const [freeModels, setFreeModels] = useState<string[]>([])
  const [remaining, setRemaining] = useState(getRemaining())
  const [modelOpen, setModelOpen] = useState(false)
  const [search, setSearch] = useState('')
  const menuRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  useEffect(() => {
    const f = (e: MouseEvent) => { if (menuRef.current && !menuRef.current.contains(e.target as Node)) { setModelOpen(false); setSearch('') } }
    document.addEventListener('mousedown', f)
    return () => document.removeEventListener('mousedown', f)
  }, [])

  useEffect(() => {
    getCachedModels().then(models => {
      if (!models) return
      const ids = models.map((m: any) => m.id)
      setFreeModels(ids)
      if (ids.length > 0 && !model) setModel(ids[0])
    }).catch(() => {})
  }, [])

  const sendMessage = async () => {
    if (!input.trim() || loading) return
    if (isLimitReached()) {
      setMessages(prev => [...prev, { role: 'assistant', content: "⚠️ **Daily free limit reached!** You've used all 50 requests for today. [Upgrade to Pro](/pricing) for unlimited access." }])
      return
    }
    const userMsg = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMsg }])
    setLoading(true)

    try {
      const allMsgs = [...messages.map(m => ({ role: m.role, content: m.content })), { role: 'user' as const, content: userMsg }]
      const data = await openRouterChat(allMsgs, model)
      setMessages(prev => [...prev, { role: 'assistant', content: data.choices?.[0]?.message?.content || 'No response' }])
      setRemaining(getRemaining())
    } catch (err: any) {
      if (err.message === 'LIMIT_REACHED') {
        setMessages(prev => [...prev, { role: 'assistant', content: "⚠️ **Daily free limit reached!** Upgrade for unlimited access." }])
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: `**Error:** ${err.message}` }])
      }
    }
    setLoading(false)
  }

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)] max-w-4xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center shadow-lg shadow-primary-500/20">
            <Bot size={18} className="text-white" />
          </div>
          <h1 className="text-lg font-semibold">Chat AI</h1>
          <span className={`badge flex items-center gap-1 ${
            remaining <= 5 ? 'badge-red' : 'badge-green'
          }`}>
            <Info size={10} /> {remaining}/{50}
          </span>
        </div>
        <button className="btn-secondary p-2 h-9 w-9 flex items-center justify-center !rounded-lg" onClick={() => setMessages([{ role: 'assistant', content: "Hello! I'm your AI assistant. Free models only. How can I help you today?" }])}>
          <Plus size={15} />
        </button>
      </div>

      {/* Warning banners */}
      {remaining <= 5 && remaining > 0 && (
        <div className="flex items-center gap-2 text-sm bg-yellow-500/10 border border-yellow-500/20 rounded-xl px-4 py-2.5 mb-3 text-yellow-400 animate-fade-in">
          <AlertTriangle size={15} />
          Only <strong className="mx-1">{remaining}</strong> free requests left today.{' '}
          <Link to="/pricing" className="underline font-semibold ml-auto whitespace-nowrap">Upgrade</Link>
        </div>
      )}
      {isLimitReached() && (
        <div className="flex items-center gap-2 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2.5 mb-3 text-red-400 animate-fade-in">
          <AlertTriangle size={15} />
          Daily limit reached.{' '}
          <Link to="/pricing" className="underline font-semibold ml-auto whitespace-nowrap">Upgrade for unlimited</Link>
        </div>
      )}

      {/* Free tier notice */}
      <div className="mb-3 text-xs text-dark-500 text-center bg-dark-800/30 border border-dark-700/40 rounded-xl py-2 px-4 flex items-center justify-center gap-1.5">
        <Sparkles size={11} className="text-yellow-400" />
        Free tier — {freeModels.length || 16}+ free AI models &bull; 50 requests/day
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : ''} animate-fade-in`}>
            {m.role === 'assistant' && (
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-md">
                <Bot size={16} className="text-white" />
              </div>
            )}
            <div className={`max-w-[78%] p-3.5 rounded-2xl text-sm leading-relaxed ${
              m.role === 'user'
                ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-tr-sm shadow-md shadow-primary-600/20'
                : 'bg-dark-800/70 border border-dark-700/50 rounded-tl-sm text-dark-200'
            }`}>
              <div className="whitespace-pre-wrap">{m.content}</div>
            </div>
            {m.role === 'user' && (
              <div className="w-8 h-8 rounded-xl bg-dark-700 border border-dark-600 flex items-center justify-center flex-shrink-0">
                <User size={15} className="text-dark-300" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 animate-fade-in">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-md">
              <Bot size={16} className="text-white" />
            </div>
            <div className="bg-dark-800/70 border border-dark-700/50 rounded-2xl rounded-tl-sm p-4">
              <div className="flex gap-1.5">
                {[0, 150, 300].map(d => (
                  <div key={d} className="w-2 h-2 rounded-full bg-primary-400/60 animate-pulse" style={{ animationDelay: `${d}ms` }} />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="mt-4 space-y-2">
        <div className="flex gap-2">
          <input className="input" value={input} onChange={e => setInput(e.target.value)}
            placeholder={remaining > 0 ? 'Type your message...' : 'Limit reached. Upgrade to continue.'}
            disabled={isLimitReached()}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendMessage())} />
          <button className="btn-primary p-3 h-11 w-11 flex items-center justify-center !rounded-xl flex-shrink-0" onClick={sendMessage} disabled={loading || !input.trim() || isLimitReached()}>
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
          </button>
        </div>
        {/* Model selector */}
        <div className="flex items-center justify-between">
          <div className="relative" ref={menuRef}>
            <button onClick={() => setModelOpen(!modelOpen)}
              className="flex items-center gap-2 bg-dark-800/80 border border-dark-700/60 hover:border-dark-500/80 rounded-lg px-3 py-1.5 text-xs transition-all duration-200 group">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-dark-200 font-medium truncate max-w-[120px]">{model.split('/').pop()?.replace(/:free/g, '').replace(/-/g, ' ') || 'Select model'}</span>
              <ChevronDown size={12} className={`text-dark-400 transition-transform duration-200 ${modelOpen ? 'rotate-180' : ''}`} />
            </button>
            {modelOpen && (
              <div className="absolute bottom-full left-0 mb-2 w-64 bg-dark-800 border border-dark-700/80 rounded-xl shadow-2xl shadow-black/40 overflow-hidden z-50 animate-fade-in">
                <div className="p-2 border-b border-dark-700/60">
                  <div className="relative">
                    <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-dark-400" />
                    <input className="w-full bg-dark-900/80 border border-dark-700 rounded-lg pl-7 pr-2.5 py-1.5 text-xs text-white placeholder-dark-500 focus:outline-none focus:border-primary-500/50"
                      placeholder="Search models..." value={search} onChange={e => setSearch(e.target.value)} autoFocus />
                  </div>
                </div>
                <div className="max-h-52 overflow-y-auto p-1 space-y-0.5">
                  {freeModels
                    .filter(id => !search || id.toLowerCase().includes(search.toLowerCase()))
                    .map(id => {
                      const name = id.split('/').pop()?.replace(/:free/g, '').replace(/-/g, ' ') || id
                      const provider = id.split('/')[0]
                      const isActive = model === id
                      return (
                        <button key={id} onClick={() => { setModel(id); setModelOpen(false); setSearch('') }}
                          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-all text-left ${
                            isActive
                              ? 'bg-primary-600/15 text-primary-400 border border-primary-500/25'
                              : 'text-dark-300 hover:bg-dark-700/70 hover:text-white border border-transparent'
                          }`}>
                          <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${isActive ? 'bg-primary-400' : 'bg-dark-500'}`} />
                          <div className="flex-1 min-w-0">
                            <p className="truncate font-medium">{name}</p>
                            <p className="text-[10px] text-dark-500 truncate">{provider}</p>
                          </div>
                          {isActive && <div className="w-1.5 h-1.5 rounded-full bg-primary-400" />}
                        </button>
                      )
                    })}
                  {freeModels.filter(id => !search || id.toLowerCase().includes(search.toLowerCase())).length === 0 && (
                    <p className="text-xs text-dark-500 text-center py-3">No models found</p>
                  )}
                </div>
                <div className="p-2 border-t border-dark-700/60 flex items-center justify-between">
                  <span className="text-[10px] text-dark-500">{freeModels.length} free models</span>
                  <span className="text-[10px] text-green-400/70 flex items-center gap-1"><div className="w-1 h-1 rounded-full bg-green-400" /> All free</span>
                </div>
              </div>
            )}
          </div>
          <span className="text-[11px] text-dark-500">{freeModels.length || 16} free models</span>
        </div>
      </div>
    </div>
  )
}
