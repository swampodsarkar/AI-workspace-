const COINS_KEY = 'bitbyte-coins'
const ADS_KEY = 'bitbyte-ads-watched'

export function getCoinBalance(): number {
  try {
    return parseInt(localStorage.getItem(COINS_KEY) || '0', 10)
  } catch { return 0 }
}

export function addCoins(amount: number): number {
  const current = getCoinBalance()
  const total = current + amount
  localStorage.setItem(COINS_KEY, String(total))
  return total
}

export function spendCoins(amount: number): boolean {
  const current = getCoinBalance()
  if (current < amount) return false
  localStorage.setItem(COINS_KEY, String(current - amount))
  return true
}

export function hasEnoughCoins(amount: number): boolean {
  return getCoinBalance() >= amount
}

export function getAdsWatchedToday(): number {
  try {
    const raw = localStorage.getItem(ADS_KEY)
    if (!raw) return 0
    const data = JSON.parse(raw)
    if (data.date !== new Date().toISOString().slice(0, 10)) return 0
    return data.count || 0
  } catch { return 0 }
}

const DAILY_AD_LIMIT = 20
const COINS_PER_AD = 2

export function canWatchAd(): boolean {
  return getAdsWatchedToday() < DAILY_AD_LIMIT
}

export function getRemainingAds(): number {
  return Math.max(0, DAILY_AD_LIMIT - getAdsWatchedToday())
}

export function watchAd(): { earned: number; total: number; remaining: number } {
  const adData = getAdsWatchedToday()
  if (adData >= DAILY_AD_LIMIT) return { earned: 0, total: getCoinBalance(), remaining: 0 }
  
  const newCount = adData + 1
  localStorage.setItem(ADS_KEY, JSON.stringify({
    date: new Date().toISOString().slice(0, 10),
    count: newCount
  }))
  
  const total = addCoins(COINS_PER_AD)
  return { earned: COINS_PER_AD, total, remaining: DAILY_AD_LIMIT - newCount }
}

export const COINS_PER_REQUEST = 1
export const DAILY_AD_LIMIT_EXPORT = DAILY_AD_LIMIT
export const COINS_PER_AD_EXPORT = COINS_PER_AD
