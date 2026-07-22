import { Link } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'
import { Icons } from '../lib/icons'
import { useEffect, useState } from 'react'
import { getRemaining, isLimitReached } from '../lib/usage'
import { getStreak, claimStreak, getUsageStats } from '../lib/coins'

const tools = [
  { to: '/chat', icon: Icons.Bot, label: 'Chat AI', desc: 'Smart AI conversations', color: 'from-blue-500 to-cyan-500', gradient: 'from-blue-600/20 to-cyan-600/20' },
  { to: '/pdf', icon: Icons.FileText, label: 'PDF Tools', desc: 'Merge, split, compress', color: 'from-red-500 to-orange-500', gradient: 'from-red-600/20 to-orange-600/20' },
  { to: '/documents', icon: Icons.PenSquare, label: 'Document Editor', desc: 'Write with AI assistance', color: 'from-purple-500 to-pink-500', gradient: 'from-purple-600/20 to-pink-600/20' },
  { to: '/image', icon: Icons.Image, label: 'Image Generator', desc: 'Create stunning images', color: 'from-green-500 to-emerald-500', gradient: 'from-green-600/20 to-emerald-600/20' },
  { to: '/excel', icon: Icons.Table, label: 'Excel AI', desc: 'Smart spreadsheets', color: 'from-green-600 to-teal-500', gradient: 'from-green-600/20 to-teal-600/20' },
  { to: '/code', icon: Icons.Code, label: 'Code AI', desc: 'Write & debug code', color: 'from-yellow-500 to-orange-500', gradient: 'from-yellow-600/20 to-orange-600/20' },
  { to: '/website', icon: Icons.Globe, label: 'Website Builder', desc: 'Build sites with AI', color: 'from-indigo-500 to-purple-500', gradient: 'from-indigo-600/20 to-purple-600/20' },
  { to: '/email', icon: Icons.Mail, label: 'Email Writer', desc: 'Professional emails', color: 'from-blue-600 to-blue-400', gradient: 'from-blue-600/20 to-blue-400/20' },
  { to: '/analysis', icon: Icons.BarChart3, label: 'Data Analysis', desc: 'Visualize & analyze', color: 'from-rose-500 to-red-500', gradient: 'from-rose-600/20 to-red-600/20' },
  { to: '/storage', icon: Icons.Cloud, label: 'Cloud Storage', desc: 'Store & share files', color: 'from-sky-500 to-blue-500', gradient: 'from-sky-600/20 to-blue-600/20' },
]

const us = getUsageStats()
const perc = us.yesterday > 0 ? Math.round(((us.today - us.yesterday) / us.yesterday) * 100) : 0

const stats = [
  { icon: Icons.MessageSquare, label: 'Daily Requests', value: `${getRemaining()}`, suffix: '/ 50 free', color: 'text-blue-400', bg: 'bg-blue-500/10' },
  { icon: Icons.BarChart3, label: 'Used Today', value: `${us.today}`, suffix: `requests`, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  { icon: Icons.Shield, label: 'Tier', value: 'Free', suffix: 'no card needed', color: 'text-green-400', bg: 'bg-green-500/10' },
  { icon: Icons.Clock, label: 'Total Usage', value: `${us.total}`, suffix: 'all time', color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
]

export default function Dashboard() {
  const { user } = useAuth()
  const [greeting, setGreeting] = useState('Good Morning')
  const [streak, setStreak] = useState(getStreak())
  const [streakMsg, setStreakMsg] = useState('')
  const us = getUsageStats()
  const perc = us.yesterday > 0 ? Math.round(((us.today - us.yesterday) / us.yesterday) * 100) : 0

  useEffect(() => {
    const h = new Date().getHours()
    setGreeting(h < 12 ? 'Good Morning' : h < 18 ? 'Good Afternoon' : 'Good Evening')
  }, [])

  const handleClaimStreak = () => {
    const result = claimStreak()
    if (result.earned > 0) {
      setStreak({ count: result.count, claimed: true, reward: result.earned })
      setStreakMsg(`+${result.earned} coins claimed!`)
      setTimeout(() => setStreakMsg(''), 3000)
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-900/30 via-dark-900 to-purple-900/30 border border-primary-500/10 p-5 sm:p-8 lg:p-10">
        <div className="absolute inset-0 dotted-bg opacity-60" />
        <div className="absolute top-0 right-0 w-72 h-72 bg-primary-500 rounded-full blur-[120px] opacity-20 animate-float" />
        <div className="absolute bottom-0 left-0 w-56 h-56 bg-purple-500 rounded-full blur-[100px] opacity-20 animate-float" style={{ animationDelay: '-3s' }} />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center shadow-lg shadow-primary-500/30">
              <Icons.Sparkles size={20} className="text-white" />
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold">
              {greeting}, <span className="gradient-text">{user?.displayName || user?.email?.split('@')[0] || 'User'}</span>
            </h1>
          </div>
          <p className="text-dark-300 text-base lg:text-lg max-w-2xl">Your all-in-one AI workspace. Chat, create, code, analyze — all powered by advanced AI models.</p>
          <div className="flex flex-wrap items-center gap-3 mt-4">
            <span className="badge-primary flex items-center gap-1.5"><Icons.Zap size={11} /> Free Tier: {getRemaining()} requests remaining</span>
            <span className="badge-green flex items-center gap-1.5"><Icons.Shield size={11} /> No credit card needed</span>
            {isLimitReached() && (
              <Link to="/pricing" className="badge-red flex items-center gap-1.5 hover:bg-red-500/20 transition-colors">
                Limit reached — Upgrade
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Streak + Stats row */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-900/20 to-red-900/20 border border-orange-500/20 p-5 lg:col-span-1 transition-all duration-300 hover:border-orange-500/40">
          <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500 rounded-full blur-[60px] opacity-10" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <Icons.Zap size={20} className="text-orange-400" />
              <span className="text-sm font-semibold text-orange-300">Daily Streak</span>
            </div>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-3xl font-bold text-white">{streak.count}</span>
              <span className="text-orange-400 text-sm font-medium">/ 7 days</span>
            </div>
            <p className="text-xs text-dark-300 mb-3">Day {streak.count} reward: <span className="text-yellow-400 font-semibold">{streak.reward} coins</span></p>
            {streak.claimed ? (
              <span className="inline-flex items-center gap-1 text-xs text-green-400 font-medium bg-green-500/10 px-3 py-1.5 rounded-lg border border-green-500/20">
                <Icons.CheckCircle size={12} /> Claimed
              </span>
            ) : (
              <button onClick={handleClaimStreak} className="w-full inline-flex items-center justify-center gap-1.5 text-xs text-white font-medium bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 px-3 py-2 rounded-lg transition-all duration-300 shadow-lg shadow-orange-600/30">
                <Icons.Coins size={12} /> Claim {streak.reward} Coins
              </button>
            )}
            {streakMsg && <p className="text-xs text-green-400 mt-2 animate-fade-in">{streakMsg}</p>}
          </div>
        </div>
        {stats.map((s, i) => (
          <div key={i} className={`${s.bg} border border-dark-700/60 rounded-xl p-4 hover:border-dark-600/80 transition-all duration-300 animate-fade-in-up`} style={{ animationDelay: `${i * 80}ms` }}>
            <div className="flex items-center gap-2 mb-2">
              <s.icon size={16} className={s.color} />
              <span className="text-dark-400 text-xs font-medium uppercase tracking-wider">{s.label}</span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className={`text-2xl font-bold ${s.color}`}>{s.value}</span>
              <span className="text-dark-500 text-xs">{s.suffix}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Usage Stats Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-900/20 to-cyan-900/20 border border-blue-500/20 p-4 sm:p-5">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full blur-[80px] opacity-10" />
        <div className="relative z-10 flex items-center gap-3 flex-wrap sm:flex-nowrap">
          <Icons.BarChart3 size={20} className="text-blue-400 flex-shrink-0" />
          <p className="text-sm text-blue-200">
            আপনি আজ <span className="font-bold text-white">{us.today}</span> টা request ব্যবহার করেছেন
            {us.yesterday > 0 && (
              <>, গতকালের চেয়ে <span className={`font-bold ${perc >= 0 ? 'text-green-400' : 'text-red-400'}`}>{perc >= 0 ? `${perc}% বেশি` : `${Math.abs(perc)}% কম`}</span></>
            )}
          </p>
        </div>
      </div>

      {/* Earn Coins Banner */}
      <Link to="/earn" className="block group">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-yellow-900/20 to-orange-900/20 border border-yellow-500/20 p-5 sm:p-6 transition-all duration-300 hover:border-yellow-500/40 hover:shadow-lg hover:shadow-yellow-500/10">
          <div className="absolute top-0 right-0 w-36 h-36 bg-yellow-500 rounded-full blur-[80px] opacity-10" />
          <div className="relative z-10 flex items-center gap-4 flex-wrap sm:flex-nowrap">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-yellow-500/20">
              <Icons.Coins size={24} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-yellow-300">Earn Free Coins</h3>
              <p className="text-sm text-dark-300">Watch short ads to earn coins and unlock more AI requests. No credit card needed.</p>
            </div>
            <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 shadow-lg shadow-yellow-600/30 whitespace-nowrap">
              Start Earning
              <Icons.ArrowRight size={15} />
            </span>
          </div>
        </div>
      </Link>

      {/* Tools grid */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold">All Tools</h2>
          <span className="text-xs text-dark-500">{tools.length} tools available</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {tools.map((tool, i) => (
            <Link key={tool.to} to={tool.to} className="group relative overflow-hidden rounded-xl bg-dark-800/50 border border-dark-700/60 p-5 card-hover animate-fade-in-up" style={{ animationDelay: `${i * 50}ms` }}>
              <div className={`absolute inset-0 bg-gradient-to-br ${tool.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/0 via-white/0 to-white/[0.02] rounded-full blur-xl group-hover:opacity-100 opacity-0 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center mb-3 shadow-lg shadow-black/30 group-hover:scale-110 transition-transform duration-300`}>
                  <tool.icon size={20} className="text-white" />
                </div>
                <h3 className="font-semibold text-sm mb-1 group-hover:text-primary-300 transition-colors">{tool.label}</h3>
                <p className="text-dark-400 text-xs">{tool.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
