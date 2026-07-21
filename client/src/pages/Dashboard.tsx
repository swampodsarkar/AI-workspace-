import { Link } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'
import { Bot, FileText, PenSquare, Image, Table, Code, Globe, Mail, BarChart3, Cloud, Sparkles, MessageSquare, Zap, Shield, TrendingUp } from 'lucide-react'
import { useEffect, useState } from 'react'
import { getRemaining, isLimitReached } from '../lib/usage'

const tools = [
  { to: '/chat', icon: Bot, label: 'Chat AI', desc: 'Smart AI conversations', color: 'from-blue-500 to-cyan-500', gradient: 'from-blue-600/20 to-cyan-600/20' },
  { to: '/pdf', icon: FileText, label: 'PDF Tools', desc: 'Merge, split, compress', color: 'from-red-500 to-orange-500', gradient: 'from-red-600/20 to-orange-600/20' },
  { to: '/documents', icon: PenSquare, label: 'Document Editor', desc: 'Write with AI assistance', color: 'from-purple-500 to-pink-500', gradient: 'from-purple-600/20 to-pink-600/20' },
  { to: '/image', icon: Image, label: 'Image Generator', desc: 'Create stunning images', color: 'from-green-500 to-emerald-500', gradient: 'from-green-600/20 to-emerald-600/20' },
  { to: '/excel', icon: Table, label: 'Excel AI', desc: 'Smart spreadsheets', color: 'from-green-600 to-teal-500', gradient: 'from-green-600/20 to-teal-600/20' },
  { to: '/code', icon: Code, label: 'Code AI', desc: 'Write & debug code', color: 'from-yellow-500 to-orange-500', gradient: 'from-yellow-600/20 to-orange-600/20' },
  { to: '/website', icon: Globe, label: 'Website Builder', desc: 'Build sites with AI', color: 'from-indigo-500 to-purple-500', gradient: 'from-indigo-600/20 to-purple-600/20' },
  { to: '/email', icon: Mail, label: 'Email Writer', desc: 'Professional emails', color: 'from-blue-600 to-blue-400', gradient: 'from-blue-600/20 to-blue-400/20' },
  { to: '/analysis', icon: BarChart3, label: 'Data Analysis', desc: 'Visualize & analyze', color: 'from-rose-500 to-red-500', gradient: 'from-rose-600/20 to-red-600/20' },
  { to: '/storage', icon: Cloud, label: 'Cloud Storage', desc: 'Store & share files', color: 'from-sky-500 to-blue-500', gradient: 'from-sky-600/20 to-blue-600/20' },
]

const stats = [
  { icon: MessageSquare, label: 'Daily Requests', value: `${getRemaining()}`, suffix: '/ 50 free', color: 'text-blue-400', bg: 'bg-blue-500/10' },
  { icon: Zap, label: 'AI Models', value: '16+', suffix: 'free models', color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
  { icon: Shield, label: 'Tier', value: 'Free', suffix: 'no card needed', color: 'text-green-400', bg: 'bg-green-500/10' },
  { icon: TrendingUp, label: 'Status', value: isLimitReached() ? 'Limit Reached' : 'Active', suffix: isLimitReached() ? 'Upgrade now' : 'All systems go', color: isLimitReached() ? 'text-red-400' : 'text-emerald-400', bg: isLimitReached() ? 'bg-red-500/10' : 'bg-emerald-500/10' },
]

export default function Dashboard() {
  const { user } = useAuth()
  const [greeting, setGreeting] = useState('Good Morning')

  useEffect(() => {
    const h = new Date().getHours()
    setGreeting(h < 12 ? 'Good Morning' : h < 18 ? 'Good Afternoon' : 'Good Evening')
  }, [])

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
              <Sparkles size={20} className="text-white" />
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold">
              {greeting}, <span className="gradient-text">{user?.displayName || user?.email?.split('@')[0] || 'User'}</span>
            </h1>
          </div>
          <p className="text-dark-300 text-base lg:text-lg max-w-2xl">Your all-in-one AI workspace. Chat, create, code, analyze — all powered by advanced AI models.</p>
          <div className="flex flex-wrap items-center gap-3 mt-4">
            <span className="badge-primary flex items-center gap-1.5"><Zap size={11} /> Free Tier: {getRemaining()} requests remaining</span>
            <span className="badge-green flex items-center gap-1.5"><Shield size={11} /> No credit card needed</span>
            {isLimitReached() && (
              <Link to="/pricing" className="badge-red flex items-center gap-1.5 hover:bg-red-500/20 transition-colors">
                Limit reached — Upgrade
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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
