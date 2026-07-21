import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Coins, Eye, Timer, CheckCircle, RefreshCw, TrendingUp, Zap, Shield, Sparkles, ChevronLeft } from 'lucide-react'
import { getCoinBalance, canWatchAd, getRemainingAds, watchAd, DAILY_AD_LIMIT_EXPORT, COINS_PER_AD_EXPORT } from '../lib/coins'

export default function Earn() {
  const [balance, setBalance] = useState(getCoinBalance())
  const [remaining, setRemaining] = useState(getRemainingAds())
  const [earned, setEarned] = useState(0)
  const [loading, setLoading] = useState(false)
  const [adTimer, setAdTimer] = useState(0)

  useEffect(() => {
    const adsWatched = DAILY_AD_LIMIT_EXPORT - remaining
    setEarned(adsWatched * COINS_PER_AD_EXPORT)
  }, [remaining])

  const handleWatchAd = () => {
    if (!canWatchAd() || loading) return
    setLoading(true)
    setAdTimer(30)

    const interval = setInterval(() => {
      setAdTimer(prev => {
        if (prev <= 1) {
          clearInterval(interval)
          const result = watchAd()
          setBalance(result.total)
          setRemaining(result.remaining)
          setLoading(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    // Open Adsterra ad in new tab
    window.open('https://www.bit-byte.com/ads/1', '_blank')
  }

  return (
    <div className="max-w-4xl mx-auto animate-fade-in space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2.5">
          <Link to="/" className="btn-ghost p-1.5 !rounded-lg">
            <ChevronLeft size={18} />
          </Link>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center shadow-lg">
            <Coins size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold">Earn Coins</h1>
            <p className="text-xs text-dark-500">Watch ads, get free AI requests</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-dark-800/80 border border-yellow-500/20 rounded-xl px-4 py-2">
          <Coins size={18} className="text-yellow-400" />
          <span className="text-lg font-bold text-yellow-400">{balance}</span>
          <span className="text-xs text-dark-500">coins</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-dark-800/50 border border-dark-700/60 rounded-xl p-4 text-center">
          <Coins size={20} className="mx-auto text-yellow-400 mb-1" />
          <p className="text-lg font-bold">{balance}</p>
          <p className="text-xs text-dark-500">Total Coins</p>
        </div>
        <div className="bg-dark-800/50 border border-dark-700/60 rounded-xl p-4 text-center">
          <Eye size={20} className="mx-auto text-primary-400 mb-1" />
          <p className="text-lg font-bold">{DAILY_AD_LIMIT_EXPORT - remaining}</p>
          <p className="text-xs text-dark-500">Ads Watched</p>
        </div>
        <div className="bg-dark-800/50 border border-dark-700/60 rounded-xl p-4 text-center">
          <TrendingUp size={20} className="mx-auto text-green-400 mb-1" />
          <p className="text-lg font-bold">{COINS_PER_AD_EXPORT * (DAILY_AD_LIMIT_EXPORT - remaining)}</p>
          <p className="text-xs text-dark-500">Earned Today</p>
        </div>
      </div>

      {/* Ad watch card */}
      <div className="relative bg-gradient-to-br from-dark-800 to-yellow-900/20 border border-yellow-500/20 rounded-2xl p-6 lg:p-8 overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-yellow-500 rounded-full blur-[80px] opacity-10" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={16} className="text-yellow-400" />
            <h2 className="text-lg font-semibold">Watch & Earn</h2>
          </div>
          <p className="text-dark-300 text-sm mb-2">
            Watch a short ad and earn <strong className="text-yellow-400">{COINS_PER_AD_EXPORT} coins</strong>. Use coins when your daily free limit runs out.
          </p>
          <div className="flex items-center gap-4 text-xs text-dark-500 mb-6">
            <span className="flex items-center gap-1"><Timer size={11} /> ~30 sec</span>
            <span className="flex items-center gap-1"><Coins size={11} /> +{COINS_PER_AD_EXPORT} coins</span>
            <span className="flex items-center gap-1"><RefreshCw size={11} /> {remaining} left today</span>
          </div>

          {remaining > 0 ? (
            <button onClick={handleWatchAd} disabled={loading}
              className="w-full sm:w-auto bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 text-white px-8 py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-yellow-600/30 hover:shadow-yellow-500/40 disabled:opacity-60">
              {loading ? (
                <><Timer size={16} className="animate-pulse" /> Wait {adTimer}s...</>
              ) : (
                <><Eye size={16} /> Watch Ad</>
              )}
            </button>
          ) : (
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl px-4 py-3 text-sm text-yellow-400">
              Daily ad limit reached! Come back tomorrow for more coins.
            </div>
          )}
        </div>
      </div>

      {/* How it works */}
      <div className="card">
        <h3 className="font-semibold mb-4">How It Works</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { step: '1', icon: Eye, title: 'Watch Ad', desc: 'Click Watch Ad, view the ad for a few seconds', color: 'from-primary-500 to-purple-600' },
            { step: '2', icon: Coins, title: 'Earn Coins', desc: `Get ${COINS_PER_AD_EXPORT} coins per ad, up to ${DAILY_AD_LIMIT_EXPORT} ads daily`, color: 'from-yellow-500 to-orange-600' },
            { step: '3', icon: Zap, title: 'Use for AI', desc: 'Spend coins on AI requests when free limit runs out', color: 'from-green-500 to-emerald-600' },
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

      {/* Adsterra ad placement */}
      <div className="bg-dark-800/30 border border-dark-700/40 rounded-xl p-4 text-center">
        <p className="text-[10px] text-dark-600 mb-2">Sponsored</p>
        <div className="bg-dark-900/80 rounded-lg h-24 flex items-center justify-center text-dark-600 text-xs border border-dashed border-dark-700">
          Adsterra Banner Ad Space (728x90)
          <br />
          <span className="text-[10px]">Replace with your Adsterra banner code</span>
        </div>
      </div>
    </div>
  )
}
