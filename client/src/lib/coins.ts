const COINS_KEY = 'bitbyte-coins'
const ADS_KEY = 'bitbyte-ads-watched'
const STREAK_KEY = 'bitbyte-streak'
const SPIN_KEY = 'bitbyte-spin'
const REFERRAL_KEY = 'bitbyte-referral'
const REFERRAL_CODE_KEY = 'bitbyte-ref-code'

const COINS_EVENT = 'bitbyte-coins-changed'

export function notifyCoinsChanged() {
  window.dispatchEvent(new CustomEvent(COINS_EVENT))
}

export function getCoinBalance(): number {
  try { return parseInt(localStorage.getItem(COINS_KEY) || '0', 10) } catch { return 0 }
}

export function addCoins(amount: number): number {
  const total = getCoinBalance() + amount
  localStorage.setItem(COINS_KEY, String(total))
  notifyCoinsChanged()
  return total
}

export function spendCoins(amount: number): boolean {
  const current = getCoinBalance()
  if (current < amount) return false
  localStorage.setItem(COINS_KEY, String(current - amount))
  notifyCoinsChanged()
  return true
}

export function hasEnoughCoins(amount: number): boolean {
  return getCoinBalance() >= amount
}

/* ─── Ads ─── */
export function getAdsWatchedToday(): number {
  try {
    const raw = localStorage.getItem(ADS_KEY)
    if (!raw) return 0
    const d = JSON.parse(raw)
    if (d.date !== today()) return 0
    return d.count || 0
  } catch { return 0 }
}

const DAILY_AD_LIMIT = 20; const COINS_PER_AD = 2
export function canWatchAd(): boolean { return getAdsWatchedToday() < DAILY_AD_LIMIT }
export function getRemainingAds(): number { return Math.max(0, DAILY_AD_LIMIT - getAdsWatchedToday()) }
export function watchAd(): { earned: number; total: number; remaining: number } {
  if (getAdsWatchedToday() >= DAILY_AD_LIMIT) return { earned: 0, total: getCoinBalance(), remaining: 0 }
  localStorage.setItem(ADS_KEY, JSON.stringify({ date: today(), count: getAdsWatchedToday() + 1 }))
  const total = addCoins(COINS_PER_AD)
  return { earned: COINS_PER_AD, total, remaining: DAILY_AD_LIMIT - getAdsWatchedToday() }
}
export const DAILY_AD_LIMIT_EXPORT = DAILY_AD_LIMIT
export const COINS_PER_AD_EXPORT = COINS_PER_AD
export const COINS_PER_REQUEST = 1

function today() { return new Date().toISOString().slice(0, 10) }
function yesterday() { const d = new Date(); d.setDate(d.getDate() - 1); return d.toISOString().slice(0, 10) }

/* ─── Daily Streak ─── */
const STREAK_REWARDS = [0, 2, 3, 5, 7, 10, 15, 20]

export function getStreak(): { count: number; claimed: boolean; reward: number } {
  try {
    const raw = localStorage.getItem(STREAK_KEY)
    if (!raw) return { count: 0, claimed: false, reward: 0 }
    const d = JSON.parse(raw)
    if (d.date === today()) return { count: d.count, claimed: true, reward: d.reward || 0 }
    if (d.date === yesterday()) {
      const count = Math.min(d.count + 1, 7)
      return { count, claimed: false, reward: STREAK_REWARDS[count] || 0 }
    }
    return { count: 1, claimed: false, reward: STREAK_REWARDS[1] || 2 }
  } catch { return { count: 1, claimed: false, reward: 2 } }
}

export function claimStreak(): { count: number; earned: number; total: number } {
  const s = getStreak()
  if (s.claimed) return { count: s.count, earned: 0, total: getCoinBalance() }
  const earned = s.reward
  const total = addCoins(earned)
  localStorage.setItem(STREAK_KEY, JSON.stringify({ date: today(), count: s.count, reward: s.reward }))
  return { count: s.count, earned, total }
}

/* ─── Lucky Spin ─── */
const SPIN_REWARDS = [0, 1, 2, 3, 5, 8, 10, 15]

export function getSpinAvailable(): boolean {
  try {
    const raw = localStorage.getItem(SPIN_KEY)
    if (!raw) return true
    return JSON.parse(raw).date !== today()
  } catch { return true }
}

export function doSpin(): { reward: number; total: number } {
  const idx = Math.floor(Math.random() * SPIN_REWARDS.length)
  const reward = SPIN_REWARDS[idx]
  const total = addCoins(reward)
  localStorage.setItem(SPIN_KEY, JSON.stringify({ date: today(), reward }))
  return { reward, total }
}

/* ─── Referral ─── */
export function getReferralCode(): string {
  let code = localStorage.getItem(REFERRAL_CODE_KEY)
  if (!code) {
    code = 'BIT' + Math.random().toString(36).slice(2, 8).toUpperCase()
    localStorage.setItem(REFERRAL_CODE_KEY, code)
  }
  return code
}

export function getReferralEarnings(): number {
  try { return parseInt(localStorage.getItem(REFERRAL_KEY) || '0', 10) } catch { return 0 }
}

export function claimReferral(code: string): { success: boolean; earned: number; total: number } {
  if (!code || code.length < 4) return { success: false, earned: 0, total: getCoinBalance() }
  const already = localStorage.getItem('bitbyte-ref-claimed-' + code)
  if (already) return { success: false, earned: 0, total: getCoinBalance() }
  const earned = 10
  const total = addCoins(earned)
  localStorage.setItem('bitbyte-ref-claimed-' + code, '1')
  const prev = getReferralEarnings()
  localStorage.setItem(REFERRAL_KEY, String(prev + earned))
  return { success: true, earned, total }
}

export function getUsageStats(): { today: number; yesterday: number; total: number } {
  try {
    const raw = localStorage.getItem('usage-stats')
    if (!raw) return { today: 0, yesterday: 0, total: 0 }
    const d = JSON.parse(raw)
    return {
      today: d.date === today() ? d.count : 0,
      yesterday: d.date === today() ? d.yesterday : (d.date === yesterday() ? d.count : 0),
      total: d.total || 0
    }
  } catch { return { today: 0, yesterday: 0, total: 0 } }
}

export function trackUsage() {
  const raw = localStorage.getItem('usage-stats')
  const todayStr = today()
  const yesterdayStr = yesterday()
  if (!raw) {
    localStorage.setItem('usage-stats', JSON.stringify({ date: todayStr, count: 1, yesterday: 0, total: 1 }))
    return
  }
  try {
    const d = JSON.parse(raw)
    if (d.date === todayStr) {
      d.count = (d.count || 0) + 1
      d.total = (d.total || 0) + 1
    } else {
      d.yesterday = d.date === yesterdayStr ? d.count : 0
      d.date = todayStr
      d.count = 1
      d.total = (d.total || 0) + 1
    }
    localStorage.setItem('usage-stats', JSON.stringify(d))
  } catch {}
}
