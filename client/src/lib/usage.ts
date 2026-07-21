const DAILY_LIMIT = 50
const STORAGE_KEY = 'ai-workspace-usage'

function getToday(): string {
  return new Date().toISOString().slice(0, 10)
}

interface UsageData {
  date: string
  count: number
}

function getUsage(): UsageData {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return { date: getToday(), count: 0 }
  try {
    const data = JSON.parse(raw) as UsageData
    if (data.date !== getToday()) return { date: getToday(), count: 0 }
    return data
  } catch {
    return { date: getToday(), count: 0 }
  }
}

function setUsage(count: number) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ date: getToday(), count }))
}

export function getRemaining(): number {
  const usage = getUsage()
  return Math.max(0, DAILY_LIMIT - usage.count)
}

export function isLimitReached(): boolean {
  return getRemaining() <= 0
}

export function incrementUsage(): { remaining: number; used: number; limit: number } {
  const usage = getUsage()
  const newCount = usage.count + 1
  setUsage(newCount)
  return {
    used: newCount,
    remaining: Math.max(0, DAILY_LIMIT - newCount),
    limit: DAILY_LIMIT
  }
}

export function useUsageTracker() {
  const checkAndIncrement = (): { allowed: boolean; remaining: number } => {
    const remaining = getRemaining()
    if (remaining <= 0) return { allowed: false, remaining: 0 }
    const result = incrementUsage()
    return { allowed: true, remaining: result.remaining }
  }

  return {
    remaining: getRemaining(),
    used: getUsage().count,
    limit: DAILY_LIMIT,
    checkAndIncrement
  }
}
