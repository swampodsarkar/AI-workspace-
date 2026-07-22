import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Icons } from '../lib/icons'
import { getCoinBalance, getReferralCode, getReferralEarnings, claimReferral } from '../lib/coins'

const REFERRAL_LINK = 'https://bit-byte.vercel.app/signup?ref='

export default function Referral() {
  const [balance, setBalance] = useState(getCoinBalance())
  const [code] = useState(getReferralCode())
  const [earnings, setEarnings] = useState(getReferralEarnings())
  const [inputCode, setInputCode] = useState('')
  const [copied, setCopied] = useState(false)
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null)
  const [claiming, setClaiming] = useState(false)

  useEffect(() => {
    setBalance(getCoinBalance())
    setEarnings(getReferralEarnings())
  }, [])

  const fullLink = REFERRAL_LINK + code

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setMessage({ ok: false, text: 'Failed to copy link' })
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join BitByte',
          text: 'Sign up with my referral link and get 10 coins free!',
          url: fullLink
        })
      } catch {
        // user cancelled
      }
    } else {
      handleCopy()
    }
  }

  const handleClaim = () => {
    const trimmed = inputCode.trim()
    if (!trimmed) {
      setMessage({ ok: false, text: 'Enter a referral code' })
      return
    }
    setClaiming(true)
    const result = claimReferral(trimmed)
    if (result.success) {
      setBalance(result.total)
      setEarnings(getReferralEarnings())
      setMessage({ ok: true, text: `Success! +${result.earned} coins claimed` })
      setInputCode('')
    } else {
      setMessage({ ok: false, text: 'Invalid or already used referral code' })
    }
    setClaiming(false)
  }

  return (
    <div className="max-w-4xl mx-auto animate-fade-in space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2.5">
          <Link to="/" className="btn-ghost p-1.5 !rounded-lg">
            <Icons.ChevronLeft size={18} />
          </Link>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
            <Icons.Share2 size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold">Referral</h1>
            <p className="text-xs text-dark-500">Invite friends, earn coins</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-dark-800/80 border border-yellow-500/20 rounded-xl px-4 py-2">
          <Icons.Coins size={18} className="text-yellow-400" />
          <span className="text-lg font-bold text-yellow-400">{balance}</span>
          <span className="text-xs text-dark-500">coins</span>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm animate-fade-in ${
          message.ok
            ? 'bg-green-500/10 border border-green-500/20 text-green-400'
            : 'bg-red-500/10 border border-red-500/20 text-red-400'
        }`}>
          {message.ok ? <Icons.CheckCircle size={16} /> : <Icons.AlertCircle size={16} />}
          {message.text}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-dark-800/50 border border-dark-700/60 rounded-xl p-4 text-center">
          <Icons.Coins size={20} className="mx-auto text-yellow-400 mb-1" />
          <p className="text-lg font-bold">{balance}</p>
          <p className="text-xs text-dark-500">Balance</p>
        </div>
        <div className="bg-dark-800/50 border border-dark-700/60 rounded-xl p-4 text-center">
          <Icons.User size={20} className="mx-auto text-primary-400 mb-1" />
          <p className="text-lg font-bold">{code}</p>
          <p className="text-xs text-dark-500">Your Code</p>
        </div>
        <div className="bg-dark-800/50 border border-dark-700/60 rounded-xl p-4 text-center">
          <Icons.Sparkles size={20} className="mx-auto text-green-400 mb-1" />
          <p className="text-lg font-bold">{earnings}</p>
          <p className="text-xs text-dark-500">Earnings</p>
        </div>
      </div>

      {/* Referral code card */}
      <div className="relative bg-gradient-to-br from-dark-800 to-emerald-900/20 border border-emerald-500/20 rounded-2xl p-6 lg:p-8 overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500 rounded-full blur-[80px] opacity-10" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <Icons.Share2 size={16} className="text-emerald-400" />
            <h2 className="text-lg font-semibold">Share Your Referral Link</h2>
          </div>
          <p className="text-dark-300 text-sm mb-2">
            Share your unique link with friends. When they sign up and use your code, you both get <strong className="text-emerald-400">10 coins</strong>.
          </p>

          {/* Code display */}
          <div className="bg-dark-900/60 border border-dark-700/60 rounded-xl px-5 py-3.5 mb-4 flex items-center justify-between gap-3">
            <span className="text-emerald-400 font-mono font-bold text-lg tracking-wider">{code}</span>
            <button onClick={handleCopy}
              className="flex items-center gap-1.5 text-xs bg-dark-700 hover:bg-dark-600 px-3 py-1.5 rounded-lg transition-colors">
              {copied ? <><Icons.Check size={14} className="text-green-400" /> Copied</> : <><Icons.Copy size={14} /> Copy</>}
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={handleCopy}
              className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 shadow-lg shadow-emerald-600/20">
              {copied ? <Icons.Check size={16} /> : <Icons.Copy size={16} />}
              Copy Link
            </button>
            <button onClick={handleShare}
              className="flex-1 flex items-center justify-center gap-2 bg-dark-700 hover:bg-dark-600 border border-dark-500/40 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300">
              <Icons.Share2 size={16} />
              Share
            </button>
          </div>
        </div>
      </div>

      {/* Claim referral code */}
      <div className="relative bg-gradient-to-br from-dark-800 to-blue-900/20 border border-blue-500/20 rounded-2xl p-6 lg:p-8 overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500 rounded-full blur-[80px] opacity-10" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <Icons.Sparkles size={16} className="text-blue-400" />
            <h2 className="text-lg font-semibold">Claim a Referral Code</h2>
          </div>
          <p className="text-dark-300 text-sm mb-2">
            Have a referral code from a friend? Enter it below to claim <strong className="text-blue-400">10 free coins</strong>.
          </p>
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={inputCode}
              onChange={e => setInputCode(e.target.value.toUpperCase())}
              placeholder="Enter referral code..."
              className="flex-1 bg-dark-900/60 border border-dark-700/60 rounded-xl px-4 py-3 text-sm text-white placeholder-dark-500 focus:outline-none focus:border-blue-500/50 transition-colors"
              onKeyDown={e => { if (e.key === 'Enter') handleClaim() }}
            />
            <button onClick={handleClaim} disabled={claiming}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 shadow-lg shadow-blue-600/20 disabled:opacity-60">
              {claiming ? <Icons.Loader2 size={16} className="animate-spin" /> : <Icons.Coins size={16} />}
              Claim
            </button>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="card">
        <h3 className="font-semibold mb-4">How It Works</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { step: '1', icon: Icons.Share2, title: 'Share Your Link', desc: 'Send your referral link to friends', color: 'from-emerald-500 to-teal-600' },
            { step: '2', icon: Icons.User, title: 'Friend Signs Up', desc: 'They enter your code during signup', color: 'from-primary-500 to-purple-600' },
            { step: '3', icon: Icons.Coins, title: 'Get 10 Coins', desc: 'You both receive 10 coins each', color: 'from-yellow-500 to-orange-600' },
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
