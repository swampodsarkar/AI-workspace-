import { useState, useRef, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Icons } from '../lib/icons'
import { openRouterChat, getCachedModels } from '../lib/openrouter'
import { getRemaining, isLimitReached } from '../lib/usage'
import { getChatHistory, saveChatHistory, createSession, generateTitle } from '../lib/chatHistory'
import type { ChatSession } from '../lib/chatHistory'
import { getCoinBalance, spendCoins, hasEnoughCoins, COINS_PER_REQUEST } from '../lib/coins'

interface Message { role: 'user' | 'assistant'; content: string }

export default function ChatAI() {
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [model, setModel] = useState('')
  const [freeModels, setFreeModels] = useState<string[]>([])
  const [remaining, setRemaining] = useState(getRemaining())
  const [modelOpen, setModelOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [showHistory, setShowHistory] = useState(true)
  const menuRef = useRef<HTMLDivElement>(null)
  const historyRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  const activeSession = sessions.find(s => s.id === activeId)

  // Load history on mount
  useEffect(() => {
    const { sessions: saved, activeId: savedId } = getChatHistory()
    setSessions(saved)
    if (savedId) {
      setActiveId(savedId)
      const s = saved.find(x => x.id === savedId)
      if (s) { setMessages(s.messages); if (s.model) setModel(s.model) }
    }
  }, [])

  // Click outside handlers
  useEffect(() => {
    const f = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) { setModelOpen(false); setSearch('') }
    }
    document.addEventListener('mousedown', f)
    return () => document.removeEventListener('mousedown', f)
  }, [])

  // Scroll to bottom
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  // Load models
  useEffect(() => {
    getCachedModels().then(models => {
      if (!models) return
      const ids = models.map((m: any) => m.id)
      setFreeModels(ids)
      if (ids.length > 0 && !model) setModel(ids[0])
    }).catch(() => {})
  }, [])

  // Persist sessions
  const persist = useCallback((updated: ChatSession[], id: string | null) => {
    setSessions(updated)
    saveChatHistory(updated, id)
  }, [])

  const switchSession = (id: string) => {
    const s = sessions.find(x => x.id === id)
    if (!s) return
    setActiveId(id)
    setMessages(s.messages)
    if (s.model) setModel(s.model)
    setActiveId(id)
    persist(sessions, id)
  }

  const newSession = () => {
    const s = createSession(model)
    const updated = [s, ...sessions]
    setActiveId(s.id)
    setMessages(s.messages)
    persist(updated, s.id)
  }

  const deleteSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const updated = sessions.filter(s => s.id !== id)
    if (activeId === id) {
      if (updated.length > 0) {
        const next = updated[0]
        setActiveId(next.id)
        setMessages(next.messages)
        if (next.model) setModel(next.model)
        persist(updated, next.id)
      } else {
        const fresh = createSession(model)
        const withFresh = [fresh]
        setActiveId(fresh.id)
        setMessages(fresh.messages)
        persist(withFresh, fresh.id)
      }
    } else {
      persist(updated, activeId)
    }
  }

  const formatDate = (ts: number) => {
    const d = new Date(ts)
    const now = new Date()
    const diff = now.getTime() - d.getTime()
    if (diff < 60000) return 'Just now'
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
    return d.toLocaleDateString()
  }

  const sendMessage = async () => {
    if (!input.trim() || loading) return
    if (isLimitReached()) {
      if (spendCoins(COINS_PER_REQUEST)) {
        setRemaining(0)
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: `⚠️ **Daily free limit reached!** You have ${getCoinBalance()} coins. [Earn more coins](/earn) or [Upgrade to Pro](/pricing) for unlimited access.` }])
        return
      }
    }
    const userMsg = input.trim()
    setInput('')
    const updated = [...messages, { role: 'user' as const, content: userMsg }]
    setMessages(updated)
    setLoading(true)

    let newSessions = [...sessions]
    if (activeId) {
      newSessions = newSessions.map(s => s.id === activeId ? { ...s, messages: updated, updatedAt: Date.now(), title: generateTitle(updated) } : s)
      persist(newSessions, activeId)
    }

    try {
      const allMsgs = updated.map(m => ({ role: m.role, content: m.content }))
      const data = await openRouterChat(allMsgs, model || 'openrouter/auto')
      const replyContent = data.choices?.[0]?.message?.content || 'No response'
      const withReply = [...updated, { role: 'assistant' as const, content: replyContent }]
      setMessages(withReply)
      setRemaining(getRemaining())
      if (activeId) {
        const final = newSessions.map(s => s.id === activeId ? { ...s, messages: withReply, updatedAt: Date.now(), title: generateTitle(withReply) } : s)
        persist(final, activeId)
      }
    } catch (err: any) {
      const errMsg = err.message === 'LIMIT_REACHED'
        ? "⚠️ **Daily free limit reached!** Upgrade for unlimited access."
        : `**Error:** ${err.message}`
      const withErr = [...updated, { role: 'assistant' as const, content: errMsg }]
      setMessages(withErr)
      if (activeId) {
        const final = newSessions.map(s => s.id === activeId ? { ...s, messages: withErr, updatedAt: Date.now() } : s)
        persist(final, activeId)
      }
    }
    setLoading(false)
  }

  const clearActive = () => {
    const fresh = createSession(model)
    const updated = [fresh, ...sessions]
    setActiveId(fresh.id)
    setMessages(fresh.messages)
    persist(updated, fresh.id)
  }

  return (
    <div className="flex h-[calc(100vh-7rem)] -m-4 md:-m-6 gap-0">
      {/* History sidebar */}
      <div ref={historyRef} className={`${showHistory ? 'w-60 lg:w-72' : 'w-0'} flex-shrink-0 transition-all duration-300 overflow-hidden border-r border-dark-700/50 bg-dark-800/30`}>
        <div className="flex flex-col h-full min-w-60 lg:min-w-72">
          <div className="p-3 border-b border-dark-700/50 flex items-center justify-between">
            <span className="text-xs font-semibold text-dark-300 flex items-center gap-1.5"><Icons.Clock size={13} /> History</span>
            <button onClick={newSession} className="btn-secondary p-1.5 h-7 w-7 flex items-center justify-center !rounded-lg" title="New chat">
              <Icons.Plus size={13} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {sessions.length === 0 ? (
              <div className="text-center py-8">
                <Icons.MessageSquare size={28} className="mx-auto text-dark-600 mb-2" />
                <p className="text-xs text-dark-500">No chat history yet</p>
              </div>
            ) : sessions.map(s => (
              <button key={s.id} onClick={() => switchSession(s.id)}
                className={`w-full flex items-start gap-2.5 p-2.5 rounded-lg text-xs transition-all text-left group ${
                  s.id === activeId
                    ? 'bg-primary-600/10 border border-primary-500/20'
                    : 'hover:bg-dark-700/50 border border-transparent'
                }`}>
                <Icons.MessageSquare size={13} className={`mt-0.5 flex-shrink-0 ${s.id === activeId ? 'text-primary-400' : 'text-dark-500'}`} />
                <div className="flex-1 min-w-0">
                  <p className={`truncate font-medium ${s.id === activeId ? 'text-primary-300' : 'text-dark-200'}`}>{s.title}</p>
                  <p className="text-[10px] text-dark-500 mt-0.5">{formatDate(s.updatedAt)} &bull; {s.messages.length} msgs</p>
                </div>
                <button onClick={(e) => deleteSession(s.id, e)}
                  className="opacity-0 group-hover:opacity-100 text-dark-500 hover:text-red-400 p-0.5 transition-all flex-shrink-0">
                  <Icons.Trash2 size={12} />
                </button>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col min-w-0 p-4 md:p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <button onClick={() => setShowHistory(!showHistory)} className="btn-ghost p-1.5 !rounded-lg text-dark-400 hover:text-white" title={showHistory ? 'Hide history' : 'Show history'}>
              {showHistory ? <Icons.PanelLeftClose size={16} /> : <Icons.PanelLeft size={16} />}
            </button>
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center shadow-lg shadow-primary-500/20">
              <Icons.Bot size={16} className="text-white" />
            </div>
            <div>
              <h1 className="text-base font-semibold">Chat AI</h1>
              {activeSession && <p className="text-[10px] text-dark-500 truncate max-w-[200px]">{activeSession.title}</p>}
            </div>
            <span className={`badge flex items-center gap-1 ${remaining <= 5 ? 'badge-red' : 'badge-green'}`}>
              <Icons.Info size={10} /> {remaining}/{50}
            </span>
          </div>
          <button className="btn-secondary p-1.5 h-7 flex items-center gap-1.5 !rounded-lg text-xs" onClick={clearActive}>
            <Icons.Plus size={12} /> New
          </button>
        </div>

        {/* Warning banners */}
        {remaining <= 5 && remaining > 0 && (
          <div className="flex items-center gap-2 text-sm bg-yellow-500/10 border border-yellow-500/20 rounded-xl px-4 py-2 mb-3 text-yellow-400 animate-fade-in">
            <Icons.AlertTriangle size={15} />
            Only <strong className="mx-1">{remaining}</strong> free requests left today.{' '}
            <Link to="/pricing" className="underline font-semibold ml-auto whitespace-nowrap">Upgrade</Link>
          </div>
        )}
        {isLimitReached() && (
          <div className="flex items-center gap-2 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2 mb-3 text-red-400 animate-fade-in">
            <Icons.AlertTriangle size={15} />
            Daily limit reached.{' '}
            <Link to="/earn" className="underline font-semibold ml-auto whitespace-nowrap">Earn coins ({getCoinBalance()})</Link>
            <Link to="/pricing" className="underline font-semibold whitespace-nowrap ml-2">Upgrade</Link>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : ''} animate-fade-in`}>
              {m.role === 'assistant' && (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-md">
                  <Icons.Bot size={16} className="text-white" />
                </div>
              )}
              <div className={`max-w-[82%] md:max-w-[78%] p-3.5 rounded-2xl text-sm leading-relaxed ${
                m.role === 'user'
                  ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-tr-sm shadow-md shadow-primary-600/20'
                  : 'bg-dark-800/70 border border-dark-700/50 rounded-tl-sm text-dark-200'
              }`}>
                <div className="whitespace-pre-wrap">{m.content}</div>
              </div>
              {m.role === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-dark-700 border border-dark-600 flex items-center justify-center flex-shrink-0">
                  <Icons.User size={15} className="text-dark-300" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 animate-fade-in">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-md">
                <Icons.Bot size={16} className="text-white" />
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
              placeholder={remaining > 0 ? 'Type your message...' : isLimitReached() && !hasEnoughCoins(COINS_PER_REQUEST) ? 'Limit reached. Earn coins or upgrade.' : 'Type your message (using coins)...'}
              disabled={isLimitReached() && !hasEnoughCoins(COINS_PER_REQUEST)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendMessage())} />
            <button className="btn-primary p-3 h-11 w-11 flex items-center justify-center !rounded-xl flex-shrink-0" onClick={sendMessage} disabled={loading || !input.trim() || (isLimitReached() && !hasEnoughCoins(COINS_PER_REQUEST))}>
              {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Icons.Send size={16} />}
            </button>
          </div>
          {/* Model selector */}
          <div className="flex items-center justify-between">
            <div className="relative" ref={menuRef}>
              <button onClick={() => setModelOpen(!modelOpen)}
                className="flex items-center gap-2 bg-dark-800/80 border border-dark-700/60 hover:border-dark-500/80 rounded-lg px-3 py-1.5 text-xs transition-all duration-200 group">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-dark-200 font-medium truncate max-w-[120px]">{model.split('/').pop()?.replace(/:free/g, '').replace(/-/g, ' ') || 'Select model'}</span>
                <Icons.ChevronDown size={12} className={`text-dark-400 transition-transform duration-200 ${modelOpen ? 'rotate-180' : ''}`} />
              </button>
              {modelOpen && (
                <div className="absolute bottom-full left-0 mb-2 w-64 bg-dark-800 border border-dark-700/80 rounded-xl shadow-2xl shadow-black/40 overflow-hidden z-50 animate-fade-in">
                  <div className="p-2 border-b border-dark-700/60">
                    <div className="relative">
                      <Icons.Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-dark-400" />
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
                <div className="p-2 border-t border-dark-700/60">
                  <span className="text-[10px] text-dark-500">{freeModels.length} models</span>
                </div>
                </div>
              )}
            </div>
            <span className="text-[11px] text-dark-500">{freeModels.length} models</span>
          </div>
        </div>
      </div>
    </div>
  )
}
