import { useAuth } from './AuthContext'

const API_BASE = '/api'

export function useApi() {
  const { user } = useAuth()

  const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {}),
    }
    if (user) headers['X-User-Id'] = user.uid

    const body = options.body ? JSON.parse(options.body as string) : {}
    if (user) body.userId = user.uid

    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
      body: JSON.stringify(body),
    })
    return res
  }

  return { apiFetch }
}
