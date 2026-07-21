import admin from 'firebase-admin'

let firebaseInitialized = false

function initFirebase() {
  if (firebaseInitialized) return true

  const projectId = process.env.FIREBASE_PROJECT_ID
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
  const privateKey = process.env.FIREBASE_PRIVATE_KEY

  if (!projectId || !clientEmail || !privateKey) {
    console.log('Firebase not configured — using in-memory fallback')
    return false
  }

  try {
    admin.initializeApp({
      credential: admin.credential.cert({ projectId, clientEmail, privateKey: privateKey.replace(/\\n/g, '\n') }),
      databaseURL: process.env.FIREBASE_DATABASE_URL || `https://${projectId}-default-rtdb.firebaseio.com`
    })
    firebaseInitialized = true
    console.log('Firebase initialized successfully')
    return true
  } catch (err) {
    console.error('Firebase init failed:', err)
    return false
  }
}

// In-memory fallback when Firebase is not configured
const memStore: Record<string, { count: number; date: string; premium?: boolean }> = {}

function getTodayKey(userId: string) {
  return `${userId}_${new Date().toISOString().slice(0, 10)}`
}

export async function getUsage(userId: string): Promise<{ count: number; premium: boolean }> {
  const dayKey = getTodayKey(userId)

  if (!initFirebase()) {
    const entry = memStore[dayKey] || { count: 0, date: new Date().toISOString().slice(0, 10) }
    return { count: entry.count, premium: entry.premium || false }
  }

  try {
    const db = admin.database()
    const snap = await db.ref(`usage/${dayKey}`).once('value')
    const data = snap.val() || {}
    return { count: data.count || 0, premium: data.premium || false }
  } catch {
    return { count: 0, premium: false }
  }
}

export async function incrementUsage(userId: string): Promise<{ count: number; remaining: number; premium: boolean }> {
  const FREE_LIMIT = parseInt(process.env.FREE_DAILY_LIMIT || '50')
  const dayKey = getTodayKey(userId)

  if (!initFirebase()) {
    const entry = memStore[dayKey] || { count: 0, date: new Date().toISOString().slice(0, 10) }
    entry.count++
    memStore[dayKey] = entry
    const remaining = entry.premium ? Infinity : Math.max(0, FREE_LIMIT - entry.count)
    return { count: entry.count, remaining, premium: entry.premium || false }
  }

  try {
    const db = admin.database()
    const ref = db.ref(`usage/${dayKey}`)
    const snap = await ref.once('value')
    const data = snap.val() || {}

    const newCount = (data.count || 0) + 1
    const premium = data.premium || false
    await ref.update({ count: newCount, premium })

    const remaining = premium ? Infinity : Math.max(0, FREE_LIMIT - newCount)
    return { count: newCount, remaining, premium }
  } catch {
    return { count: 0, remaining: FREE_LIMIT, premium: false }
  }
}

export async function setPremium(userId: string, isPremium: boolean) {
  const dayKey = getTodayKey(userId)

  if (!initFirebase()) {
    const entry = memStore[dayKey] || { count: 0, date: new Date().toISOString().slice(0, 10) }
    entry.premium = isPremium
    memStore[dayKey] = entry
    return
  }

  try {
    const db = admin.database()
    await db.ref(`usage/${dayKey}`).update({ premium: isPremium })
  } catch { /* silent */ }
}

export async function checkLimit(userId: string): Promise<{ allowed: boolean; remaining: number; premium: boolean; message?: string }> {
  const FREE_LIMIT = parseInt(process.env.FREE_DAILY_LIMIT || '50')
  const { count, premium } = await getUsage(userId)

  if (premium) return { allowed: true, remaining: Infinity, premium: true }
  if (count >= FREE_LIMIT) {
    return {
      allowed: false,
      remaining: 0,
      premium: false,
      message: `You've used all ${FREE_LIMIT} free requests today. Upgrade to premium for unlimited access.`
    }
  }
  return { allowed: true, remaining: FREE_LIMIT - count, premium: false }
}
