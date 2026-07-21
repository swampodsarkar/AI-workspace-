import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Sparkles, Mail, Lock, Eye, EyeOff, Github, AlertCircle, Zap, Star, Shield, Quote } from 'lucide-react'
import { useAuth } from '../lib/AuthContext'

const features = [
  { label: '50 Free Daily', desc: 'AI requests every day', icon: Zap, color: 'from-yellow-400 to-orange-500' },
  { label: '16+ AI Models', desc: 'Chat, code, image & more', icon: Star, color: 'from-primary-400 to-purple-500' },
  { label: 'No Credit Card', desc: 'Start free instantly', icon: Shield, color: 'from-green-400 to-emerald-500' },
]

const testimonials = [
  { text: 'Best free AI platform I have used. The chat and image generation are incredible!', name: 'Rahim K.', role: 'Developer' },
  { text: 'Game changer for my content creation workflow. And its free!', name: 'Sadia T.', role: 'Content Creator' },
]

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, loginWithGithub } = useAuth()
  const navigate = useNavigate()
  const [loaded, setLoaded] = useState(false)

  useEffect(() => { setLoaded(true) }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!email || !password) { setError('Please fill in all fields'); return }
    setLoading(true)
    try {
      await login(email, password)
      navigate('/', { replace: true })
    } catch (err: any) {
      setError(err.code === 'auth/invalid-credential' ? 'Invalid email or password' : err.code === 'auth/user-not-found' ? 'No account found with this email' : err.message)
    }
    setLoading(false)
  }

  const handleGithub = async () => {
    setError('')
    setLoading(true)
    try {
      await loginWithGithub()
      navigate('/', { replace: true })
    } catch (err: any) {
      setError(err.message)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex bg-dark-900 relative overflow-hidden">
      {/* Premium animated background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(99,102,241,0.12),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(168,85,247,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.06),transparent_50%)]" />
        <div className="absolute inset-0 dotted-bg opacity-[0.15]" />
        {/* Animated floating orbs */}
        <div className="absolute top-1/4 left-[15%] w-96 h-96 bg-primary-500/10 rounded-full blur-[120px] animate-float" />
        <div className="absolute bottom-1/4 right-[15%] w-80 h-80 bg-purple-500/10 rounded-full blur-[120px] animate-float" style={{ animationDelay: '-3s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[150px] animate-float" style={{ animationDelay: '-1.5s' }} />
        {/* Grid lines */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.03]">
          <defs><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" /></pattern></defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative z-10 w-full lg:flex">
        {/* Left — Premium Hero */}
        <div className="hidden lg:flex w-1/2 flex-col justify-center px-16 py-12">
          <div className={`max-w-lg transition-all duration-1000 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {/* Logo */}
            <div className="flex items-center gap-3 mb-12 group">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 via-purple-500 to-cyan-500 p-[2px] shadow-2xl shadow-primary-500/30 group-hover:shadow-primary-500/50 transition-shadow duration-500">
                <div className="w-full h-full rounded-2xl bg-dark-900 flex items-center justify-center">
                  <Sparkles size={26} className="text-white" />
                </div>
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-primary-200 via-purple-200 to-cyan-200 bg-clip-text text-transparent">AI Workspace</span>
                <p className="text-[10px] text-dark-500 uppercase tracking-[0.2em] font-semibold">All-in-One AI Platform</p>
              </div>
            </div>

            {/* Headline */}
            <h1 className="text-5xl font-bold leading-[1.1] mb-5">
              Your AI-Powered<br />
              <span className="bg-gradient-to-r from-primary-300 via-purple-300 to-cyan-300 bg-clip-text text-transparent">Creative Workspace</span>
            </h1>
            <p className="text-dark-300 text-lg leading-relaxed mb-8">
              Chat, create images, write code, analyze data, and more — all with AI. <strong className="text-white">50 free requests daily</strong>, no credit card needed.
            </p>

            {/* Feature pills */}
            <div className="flex flex-wrap gap-3 mb-12">
              {features.map((f, i) => (
                <div key={i} className="group flex items-center gap-2.5 bg-white/[0.03] border border-white/[0.06] hover:border-primary-500/20 rounded-xl px-4 py-3 transition-all duration-300 hover:bg-primary-500/5">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${f.color} flex items-center justify-center shadow-lg`}>
                    <f.icon size={15} className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{f.label}</p>
                    <p className="text-[11px] text-dark-500">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Testimonials */}
            <div className="space-y-3">
              <p className="text-xs text-dark-500 uppercase tracking-wider font-semibold mb-3">Loved by users</p>
              <div className="flex gap-3">
                {testimonials.map((t, i) => (
                  <div key={i} className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-4 flex-1 relative overflow-hidden">
                    <Quote size={14} className="text-primary-400/30 absolute top-3 right-3" />
                    <p className="text-xs text-dark-300 leading-relaxed mb-2">"{t.text}"</p>
                    <p className="text-xs font-semibold text-white">{t.name}</p>
                    <p className="text-[10px] text-dark-500">{t.role}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right — Premium Login Card */}
        <div className={`w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 lg:p-16 transition-all duration-1000 delay-200 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="w-full max-w-md">
            {/* Mobile logo */}
            <div className="text-center mb-8 lg:hidden">
              <div className="inline-flex items-center gap-2.5 mb-1">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center shadow-2xl">
                  <Sparkles size={20} className="text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-primary-300 to-purple-300 bg-clip-text text-transparent">AI Workspace</span>
              </div>
              <p className="text-dark-400 text-sm">50 free AI requests daily. No card needed.</p>
            </div>

            {/* Glass card */}
            <div className="relative bg-dark-800/40 backdrop-blur-2xl border border-white/[0.06] rounded-3xl p-8 sm:p-10 shadow-2xl shadow-black/30">
              {/* Gradient border glow */}
              <div className="absolute -inset-[1px] bg-gradient-to-br from-primary-500/20 via-purple-500/10 to-cyan-500/20 rounded-3xl -z-10 blur-sm" />

              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-1">Welcome back</h2>
                <p className="text-dark-400 text-sm">Sign in to continue your journey</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                {error && (
                  <div className="flex items-start gap-2.5 bg-red-500/10 border border-red-500/20 rounded-xl p-3.5 text-sm text-red-400 animate-fade-in">
                    <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div>
                  <label className="text-sm text-dark-300 block mb-1.5 font-medium">Email</label>
                  <div className="relative group">
                    <div className="absolute -inset-[1px] bg-gradient-to-r from-primary-500/20 via-purple-500/20 to-cyan-500/20 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />
                    <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-400 group-focus-within:text-primary-400 transition-colors z-10" />
                    <input className="input pl-10 relative z-10 bg-dark-800/80" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} autoFocus />
                  </div>
                </div>

                <div>
                  <label className="text-sm text-dark-300 block mb-1.5 font-medium">Password</label>
                  <div className="relative group">
                    <div className="absolute -inset-[1px] bg-gradient-to-r from-primary-500/20 via-purple-500/20 to-cyan-500/20 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />
                    <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-400 group-focus-within:text-primary-400 transition-colors z-10" />
                    <input className="input pl-10 pr-10 relative z-10 bg-dark-800/80" type={showPw ? 'text' : 'password'} placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)} />
                    <button type="button" className="absolute right-3.5 top-1/2 -translate-y-1/2 text-dark-400 hover:text-white transition-colors z-10" onClick={() => setShowPw(!showPw)}>
                      {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                <button type="submit" disabled={loading} className="w-full py-3 rounded-xl font-semibold text-sm relative group overflow-hidden transition-all duration-300 disabled:opacity-60">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-600 via-purple-600 to-primary-500 group-hover:from-primary-500 group-hover:via-purple-500 group-hover:to-primary-400 transition-all duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  <span className="relative z-10 flex items-center justify-center gap-2 text-white">
                    {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : null}
                    {loading ? 'Signing in...' : 'Sign In'}
                  </span>
                </button>
              </form>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/[0.06]" /></div>
                <div className="relative flex justify-center"><span className="bg-dark-800/40 backdrop-blur-xl px-4 text-xs text-dark-500">or continue with</span></div>
              </div>

              {/* GitHub button */}
              <button onClick={handleGithub} disabled={loading} className="w-full border border-white/[0.08] hover:border-white/[0.15] rounded-xl py-3 flex items-center justify-center gap-2.5 text-sm font-medium transition-all duration-200 hover:bg-white/[0.03] group">
                <Github size={18} className="group-hover:scale-110 transition-transform" />
                Continue with GitHub
              </button>

              {/* Signup link */}
              <p className="text-center text-sm text-dark-400 mt-6">
                Don't have an account?{' '}
                <Link to="/signup" className="text-primary-400 hover:text-primary-300 font-semibold bg-gradient-to-r from-primary-400 to-purple-400 bg-clip-text text-transparent hover:from-primary-300 hover:to-purple-300 transition-all">Create free account</Link>
              </p>
            </div>

            {/* Footer */}
            <p className="text-center text-[11px] text-dark-600 mt-4">Free tier: 50 AI requests daily &bull; No credit card required</p>
          </div>
        </div>
      </div>
    </div>
  )
}
