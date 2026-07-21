const CHAT_HISTORY_KEY = 'bitbyte-chat-history'
const ACTIVE_KEY = 'bitbyte-active-chat'

export interface Message { role: 'user' | 'assistant'; content: string }

export interface ChatSession {
  id: string
  title: string
  messages: Message[]
  model: string
  updatedAt: number
  createdAt: number
}

function getUserId(): string {
  return localStorage.getItem('bitbyte-user-id') || 'default'
}

function getStorageKey(): string {
  return `${CHAT_HISTORY_KEY}-${getUserId()}`
}

export function loadSessions(): ChatSession[] {
  try {
    const raw = localStorage.getItem(getStorageKey())
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

export function saveSessions(sessions: ChatSession[]) {
  localStorage.setItem(getStorageKey(), JSON.stringify(sessions))
}

export function getActiveSessionId(): string | null {
  return localStorage.getItem(`${ACTIVE_KEY}-${getUserId()}`)
}

export function setActiveSessionId(id: string | null) {
  if (id) localStorage.setItem(`${ACTIVE_KEY}-${getUserId()}`, id)
  else localStorage.removeItem(`${ACTIVE_KEY}-${getUserId()}`)
}

export function createSession(model: string): ChatSession {
  return {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    title: 'New Chat',
    messages: [{ role: 'assistant', content: "Hello! I'm your AI assistant. I was created by **Swampod Sarkar**. Free models only. How can I help you today?" }],
    model,
    createdAt: Date.now(),
    updatedAt: Date.now()
  }
}

export function generateTitle(messages: Message[]): string {
  const firstUserMsg = messages.find(m => m.role === 'user')
  if (!firstUserMsg) return 'New Chat'
  const text = firstUserMsg.content.slice(0, 40)
  return text.length < firstUserMsg.content.length ? text + '...' : text
}

export function getChatHistory(): { sessions: ChatSession[]; activeId: string | null } {
  const sessions = loadSessions()
  let activeId = getActiveSessionId()
  if (!activeId || !sessions.find(s => s.id === activeId)) {
    activeId = null
  }
  return { sessions, activeId }
}

export function saveChatHistory(sessions: ChatSession[], activeId: string | null) {
  saveSessions(sessions)
  setActiveSessionId(activeId)
}
