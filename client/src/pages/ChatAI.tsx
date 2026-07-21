import { useState, useRef, useEffect } from 'react'
import { Bot, Send, User, Loader2, Plus, AlertTriangle } from 'lucide-react'
import { openRouterChat, getCachedModels } from '../lib/openrouter'

interface Message { role: 'user' | 'assistant'; content: string }

export default function ChatAI() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hello! I\'m your AI assistant. Free models only. How can I help you today?' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [model, setModel] = useState('')
  const [freeModels, setFreeModels] = useState<string[]>([])
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  useEffect(() => {
    getCachedModels().then(models => {
      const ids = models.map((m: any) => m.id)
      setFreeModels(ids)
      if (ids.length > 0 && !model) setModel(ids[0])
    }).catch(() => {})
  }, [])

  const sendMessage = async () => {
    if (!input.trim() || loading) return
    const userMsg = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMsg }])
    setLoading(true)

    try {
      const allMsgs = [...messages.filter(m => m.role !== 'system'), { role: 'user', content: userMsg }]
      const data = await openRouterChat(allMsgs, model)
      setMessages(prev => [...prev, { role: 'assistant', content: data.choices?.[0]?.message?.content || 'No response' }])
    } catch (err: any) {
      setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${err.message}` }])
    }
    setLoading(false)
  }

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)] max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Bot className="text-primary-400" size={22} />
          <h1 className="text-xl font-semibold">Chat AI</h1>
          <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">{freeModels.length} free models</span>
        </div>
        <div className="flex items-center gap-2">
          <select className="input text-sm py-1.5 w-auto max-w-[200px]" value={model} onChange={e => setModel(e.target.value)}>
            {freeModels.map(id => (
              <option key={id} value={id}>{id.split('/').pop()}</option>
            ))}
          </select>
          <button className="btn-secondary p-2" onClick={() => setMessages([{ role: 'assistant', content: 'Hello! How can I help you today?' }])}>
            <Plus size={16} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : ''} animate-fade-in`}>
            {m.role === 'assistant' && (
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                <Bot size={16} className="text-white" />
              </div>
            )}
            <div className={`max-w-[75%] p-3 rounded-2xl ${m.role === 'user' ? 'bg-gradient-to-r from-primary-600 to-primary-500 rounded-br-sm' : 'bg-dark-700/80 rounded-bl-sm border border-dark-600/50'}`}>
              <p className="text-sm whitespace-pre-wrap leading-relaxed">{m.content}</p>
            </div>
            {m.role === 'user' && (
              <div className="w-8 h-8 rounded-lg bg-dark-600 flex items-center justify-center flex-shrink-0">
                <User size={16} className="text-dark-300" />
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex gap-3 animate-fade-in">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center flex-shrink-0"><Bot size={16} className="text-white" /></div>
            <div className="bg-dark-700/80 rounded-2xl rounded-bl-sm p-4 border border-dark-600/50">
              <div className="flex gap-1.5">
                <div className="w-2 h-2 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="mt-4 flex gap-2">
        <input className="input" value={input} onChange={e => setInput(e.target.value)}
          placeholder="Type your message..."
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendMessage())} />
        <button className="btn-primary p-3 !rounded-xl" onClick={sendMessage} disabled={loading || !input.trim()}>
          {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
        </button>
      </div>
    </div>
  )
}
