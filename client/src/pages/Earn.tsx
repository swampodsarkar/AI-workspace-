import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Icons } from '../lib/icons'
import { getCoinBalance, canWatchAd, getRemainingAds, watchAd, DAILY_AD_LIMIT_EXPORT, COINS_PER_AD_EXPORT } from '../lib/coins'

const AD_LINKS = [
  'https://omg10.com/4/10947128',
  'https://omg10.com/4/11094432',
  'https://omg10.com/4/11094430',
  'https://omg10.com/4/11094429',
  'https://omg10.com/4/11060583',
  'https://omg10.com/4/11094427',
]

function getRandomAd(): string {
  return AD_LINKS[Math.floor(Math.random() * AD_LINKS.length)]
}

export default function Earn() {
  const [balance, setBalance] = useState(getCoinBalance())
  const [remaining, setRemaining] = useState(getRemainingAds())
  const [loading, setLoading] = useState(false)
  const [adTimer, setAdTimer] = useState(0)
  const [status, setStatus] = useState<'idle' | 'watching' | 'completed' | 'cancelled'>('idle')
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const cancelledRef = useRef(false)

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  // Visbility change: if user comes back before 30s, cancel reward
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'visible' && loading && adTimer > 0) {
        // User switched back early — cancel
        cancelAd()
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [loading, adTimer])

  const cancelAd = () => {
    cancelledRef.current = true
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setAdTimer(0)
    setLoading(false)
    setStatus('cancelled')
    setTimeout(() => setStatus('idle'), 2000)
  }

  const handleWatchAd = () => {
    if (!canWatchAd() || loading) return
    cancelledRef.current = false
    setLoading(true)
    setAdTimer(30)
    setStatus('watching')

    // Open ad in new tab
    const adUrl = getRandomAd()
    window.open(adUrl, '_blank')

    // Start countdown — only awards if user doesn't switch back
    intervalRef.current = setInterval(() => {
      setAdTimer(prev => {
        if (prev <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current)
          intervalRef.current = null

          // Check if user didn't switch back early
          if (!cancelledRef.current && document.visibilityState !== 'visible') {
            const result = watchAd()
            setBalance(result.total)
            setRemaining(result.remaining)
            setStatus('completed')
            setTimeout(() => setStatus('idle'), 2000)
          } else {
            setStatus('cancelled')
            setTimeout(() => setStatus('idle'), 2000)
          }
          setLoading(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const totalEarnedToday = (DAILY_AD_LIMIT_EXPORT - remaining) * COINS_PER_AD_EXPORT

  return (
    <div className="max-w-4xl mx-auto animate-fade-in space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2.5">
          <Link to="/" className="btn-ghost p-1.5 !rounded-lg">
            <Icons.ChevronLeft size={18} />
          </Link>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center shadow-lg">
            <Icons.Coins size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold">Earn Coins</h1>
            <p className="text-xs text-dark-500">Watch ads, get free AI requests</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-dark-800/80 border border-yellow-500/20 rounded-xl px-4 py-2">
          <Icons.Coins size={18} className="text-yellow-400" />
          <span className="text-lg font-bold text-yellow-400">{balance}</span>
          <span className="text-xs text-dark-500">coins</span>
        </div>
      </div>

      {/* Status alert */}
      {status === 'completed' && (
        <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3 text-sm text-green-400 animate-fade-in">
          <Icons.CheckCircle size={16} />
          Ad completed! +{COINS_PER_AD_EXPORT} coins earned
        </div>
      )}
      {status === 'cancelled' && (
        <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-400 animate-fade-in">
          <Icons.XCircle size={16} />
          Ad not completed — stay on the ad page for the full duration
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-dark-800/50 border border-dark-700/60 rounded-xl p-4 text-center">
          <Icons.Coins size={20} className="mx-auto text-yellow-400 mb-1" />
          <p className="text-lg font-bold">{balance}</p>
          <p className="text-xs text-dark-500">Total Coins</p>
        </div>
        <div className="bg-dark-800/50 border border-dark-700/60 rounded-xl p-4 text-center">
          <Icons.Eye size={20} className="mx-auto text-primary-400 mb-1" />
          <p className="text-lg font-bold">{DAILY_AD_LIMIT_EXPORT - remaining}</p>
          <p className="text-xs text-dark-500">Ads Today</p>
        </div>
        <div className="bg-dark-800/50 border border-dark-700/60 rounded-xl p-4 text-center">
          <Icons.TrendingUp size={20} className="mx-auto text-green-400 mb-1" />
          <p className="text-lg font-bold">{totalEarnedToday}</p>
          <p className="text-xs text-dark-500">Earned Today</p>
        </div>
      </div>

      {/* Ad watch card */}
      <div className={`relative bg-gradient-to-br from-dark-800 to-yellow-900/20 border rounded-2xl p-6 lg:p-8 overflow-hidden transition-all duration-500 ${
        status === 'watching' ? 'border-yellow-500/40 shadow-lg shadow-yellow-500/10' : 'border-yellow-500/20'
      }`}>
        <div className="absolute top-0 right-0 w-48 h-48 bg-yellow-500 rounded-full blur-[80px] opacity-10" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <Icons.Sparkles size={16} className="text-yellow-400" />
            <h2 className="text-lg font-semibold">Watch & Earn</h2>
          </div>
          <p className="text-dark-300 text-sm mb-2">
            Watch a short ad and earn <strong className="text-yellow-400">{COINS_PER_AD_EXPORT} coins</strong>. 
            <span className="text-red-400 ml-1">Do not switch back until finished!</span>
          </p>
          <div className="flex items-center gap-4 text-xs text-dark-500 mb-6 flex-wrap">
            <span className="flex items-center gap-1"><Icons.Timer size={11} /> 30 sec</span>
            <span className="flex items-center gap-1"><Icons.Coins size={11} /> +{COINS_PER_AD_EXPORT} coins</span>
            <span className="flex items-center gap-1"><Icons.RefreshCw size={11} /> {remaining} left today</span>
            <span className="flex items-center gap-1"><Icons.ExternalLink size={11} /> {AD_LINKS.length} ad partners</span>
          </div>

          <div className="flex items-center gap-4">
            {remaining > 0 ? (
              <button onClick={handleWatchAd} disabled={loading}
                className={`relative overflow-hidden bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 text-white px-8 py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 shadow-lg disabled:opacity-60 ${
                  loading ? 'shadow-yellow-500/20' : 'shadow-yellow-600/30 hover:shadow-yellow-500/40'
                }`}>
                {loading ? (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
                    <Icons.Timer size={16} className="animate-pulse" /> Stay on ad... {adTimer}s
                  </>
                ) : (
                  <><Icons.Eye size={16} /> Watch Ad</>
                )}
              </button>
            ) : (
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl px-4 py-3 text-sm text-yellow-400">
                Daily ad limit reached! Come back tomorrow.
              </div>
            )}
            {status === 'watching' && (
              <button onClick={cancelAd} className="text-xs text-dark-400 hover:text-white underline transition-colors">
                Cancel
              </button>
            )}
          </div>

          {/* Progress bar */}
          {status === 'watching' && (
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs text-dark-400 mb-1">
                <span>Ad in progress...</span>
                <span>{30 - adTimer}s / 30s</span>
              </div>
              <div className="w-full h-2 bg-dark-700 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full transition-all duration-1000"
                  style={{ width: `${((30 - adTimer) / 30) * 100}%` }} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Rules */}
      <div className="card">
        <h3 className="font-semibold mb-3 flex items-center gap-2"><Icons.AlertTriangle size={16} className="text-yellow-400" /> Rules</h3>
        <ul className="space-y-2 text-sm text-dark-300">
          <li className="flex items-start gap-2">• <span>Stay on the ad page for the full <strong>30 seconds</strong></span></li>
          <li className="flex items-start gap-2">• <span className="text-red-400">Do not switch back</span> to this tab until the timer finishes</li>
          <li className="flex items-start gap-2">• <span>If you switch back early, coins will <strong className="text-red-400">not</strong> be awarded</span></li>
          <li className="flex items-start gap-2">• <span>Max <strong>{DAILY_AD_LIMIT_EXPORT} ads</strong> per day, <strong>{COINS_PER_AD_EXPORT} coins</strong> each</span></li>
        </ul>
      </div>

      {/* How it works */}
      <div className="card">
        <h3 className="font-semibold mb-4">How It Works</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { step: '1', icon: Icons.Eye, title: 'Click Watch Ad', desc: 'Ad opens in a new tab', color: 'from-primary-500 to-purple-600' },
            { step: '2', icon: Icons.Timer, title: 'Wait 30 Seconds', desc: 'Stay on the ad page — do not switch back!', color: 'from-yellow-500 to-orange-600' },
            { step: '3', icon: Icons.Coins, title: 'Get Coins', desc: `+${COINS_PER_AD_EXPORT} coins auto-added`, color: 'from-green-500 to-emerald-600' },
          ].map((item, i) => (
            <div key={i} className="bg-dark-800/50 border border-dark-700/60 rounded-xl p-4 text-center hover:border-dark-600/80 transition-all">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mx-auto mb-3 shadow-lg`}>
                <item.icon size={18} className="text-white" />
              </div>
              <p className="font-semibold text-sm mb-1">{item.title}</p>
              <p className="text-xs text-dark-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
