import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Sparkles, Mail, Lock, User as UserIcon, Eye, EyeOff, Github, AlertCircle, Zap, Shield, TrendingUp } from 'lucide-react'
import { useAuth } from '../lib/AuthContext'

export default function Signup() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signup, loginWithGithub } = useAuth()
  const navigate = useNavigate()
  const [loaded, setLoaded] = useState(false)

  useEffect(() => { setLoaded(true) }, [])

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!username || !email || !password) { setError('Please fill in all fields'); return }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return }
    setLoading(true)
    try {
      await signup(email, password, username)
      navigate('/', { replace: true })
    } catch (err: any) {
      setError(err.code === 'auth/email-already-in-use' ? 'Email already in use' : err.message)
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

  const benefits = [
    { icon: Zap, label: '50 Free Daily Requests', desc: 'Chat, code, create images' },
    { icon: Shield, label: 'No Credit Card', desc: 'Start free, upgrade anytime' },
    { icon: TrendingUp, label: 'Premium Features', desc: 'From just 499 BDT/month' },
  ]

  return (
    <div className="min-h-screen flex bg-dark-900 relative overflow-hidden">
      {/* Premium animated background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(168,85,247,0.12),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(99,102,241,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.06),transparent_50%)]" />
        <div className="absolute inset-0 dotted-bg opacity-[0.15]" />
        <div className="absolute top-1/3 left-[20%] w-80 h-80 bg-purple-500/10 rounded-full blur-[120px] animate-float" style={{ animationDelay: '-2s' }} />
        <div className="absolute bottom-1/3 right-[20%] w-96 h-96 bg-primary-500/10 rounded-full blur-[120px] animate-float" style={{ animationDelay: '-4s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[150px] animate-float" style={{ animationDelay: '-1s' }} />
        <svg className="absolute inset-0 w-full h-full opacity-[0.03]">
          <defs><pattern id="grid2" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" /></pattern></defs>
          <rect width="100%" height="100%" fill="url(#grid2)" />
        </svg>
      </div>

      <div className="relative z-10 w-full lg:flex">
        {/* Left — Benefits */}
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
                <span className="text-2xl font-bold bg-gradient-to-r from-primary-200 via-purple-200 to-cyan-200 bg-clip-text text-transparent">Bit-Byte</span>
                <p className="text-[10px] text-dark-500 uppercase tracking-[0.2em] font-semibold">AI-Powered Workspace</p>
              </div>
            </div>

            {/* Headline */}
            <h1 className="text-5xl font-bold leading-[1.1] mb-5">
              Start Your AI<br />
              <span className="bg-gradient-to-r from-primary-300 via-purple-300 to-cyan-300 bg-clip-text text-transparent">Journey Today</span>
            </h1>
            <p className="text-dark-300 text-lg leading-relaxed mb-10">
              Join thousands of creators and developers using Bit-Byte. <strong className="text-white">Get 50 free requests daily</strong> — no credit card required.
            </p>

            {/* Benefits */}
            <div className="space-y-4">
              {benefits.map((b, i) => (
                <div key={i} className="flex items-center gap-4 bg-white/[0.02] border border-white/[0.06] hover:border-primary-500/20 rounded-xl p-4 transition-all duration-300 hover:bg-primary-500/5 group">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <b.icon size={18} className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{b.label}</p>
                    <p className="text-xs text-dark-500">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Live counter */}
            <div className="mt-10 bg-white/[0.02] border border-white/[0.06] rounded-xl px-5 py-4 inline-flex items-center gap-3">
              <div className="flex -space-x-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className={`w-7 h-7 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 border-2 border-dark-900 flex items-center justify-center text-[9px] font-bold text-white`}>
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
              </div>
              <div>
                <p className="text-sm font-semibold"><span className="text-primary-400">1,200+</span> active users today</p>
                <p className="text-xs text-dark-500">Join them — it's free</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right — Signup Card */}
        <div className={`w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 lg:p-16 transition-all duration-1000 delay-200 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="w-full max-w-md">
            {/* Mobile logo */}
            <div className="text-center mb-8 lg:hidden">
              <div className="inline-flex items-center gap-2.5 mb-1">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center shadow-2xl">
                  <Sparkles size={20} className="text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-primary-300 to-purple-300 bg-clip-text text-transparent">Bit-Byte</span>
              </div>
              <p className="text-dark-400 text-sm">Create your free account</p>
            </div>

            {/* Glass card */}
            <div className="relative bg-dark-800/40 backdrop-blur-2xl border border-white/[0.06] rounded-3xl p-8 sm:p-10 shadow-2xl shadow-black/30">
              <div className="absolute -inset-[1px] bg-gradient-to-br from-purple-500/20 via-primary-500/10 to-cyan-500/20 rounded-3xl -z-10 blur-sm" />

              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-1">Create account</h2>
                <p className="text-dark-400 text-sm">Start with 50 free daily requests</p>
              </div>

              <form onSubmit={handleSignup} className="space-y-4">
                {error && (
                  <div className="flex items-start gap-2.5 bg-red-500/10 border border-red-500/20 rounded-xl p-3.5 text-sm text-red-400 animate-fade-in">
                    <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div>
                  <label className="text-sm text-dark-300 block mb-1.5 font-medium">Username</label>
                  <div className="relative group">
                    <div className="absolute -inset-[1px] bg-gradient-to-r from-primary-500/20 via-purple-500/20 to-cyan-500/20 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />
                    <UserIcon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-400 group-focus-within:text-primary-400 transition-colors z-10" />
                    <input className="input pl-10 relative z-10 bg-dark-800/80" placeholder="john_doe" value={username} onChange={e => setUsername(e.target.value)} autoFocus />
                  </div>
                </div>

                <div>
                  <label className="text-sm text-dark-300 block mb-1.5 font-medium">Email</label>
                  <div className="relative group">
                    <div className="absolute -inset-[1px] bg-gradient-to-r from-primary-500/20 via-purple-500/20 to-cyan-500/20 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />
                    <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-400 group-focus-within:text-primary-400 transition-colors z-10" />
                    <input className="input pl-10 relative z-10 bg-dark-800/80" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
                  </div>
                </div>

                <div>
                  <label className="text-sm text-dark-300 block mb-1.5 font-medium">Password</label>
                  <div className="relative group">
                    <div className="absolute -inset-[1px] bg-gradient-to-r from-primary-500/20 via-purple-500/20 to-cyan-500/20 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />
                    <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-400 group-focus-within:text-primary-400 transition-colors z-10" />
                    <input className="input pl-10 pr-10 relative z-10 bg-dark-800/80" type={showPw ? 'text' : 'password'} placeholder="Min 6 characters" value={password} onChange={e => setPassword(e.target.value)} />
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
                    {loading ? 'Creating account...' : 'Create Free Account'}
                  </span>
                </button>
              </form>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/[0.06]" /></div>
                <div className="relative flex justify-center"><span className="bg-dark-800/40 backdrop-blur-xl px-4 text-xs text-dark-500">or continue with</span></div>
              </div>

              <button onClick={handleGithub} disabled={loading} className="w-full border border-white/[0.08] hover:border-white/[0.15] rounded-xl py-3 flex items-center justify-center gap-2.5 text-sm font-medium transition-all duration-200 hover:bg-white/[0.03] group">
                <Github size={18} className="group-hover:scale-110 transition-transform" />
                Continue with GitHub
              </button>

              <p className="text-center text-sm text-dark-400 mt-6">
                Already have an account?{' '}
                <Link to="/login" className="bg-gradient-to-r from-primary-400 to-purple-400 bg-clip-text text-transparent font-semibold hover:from-primary-300 hover:to-purple-300 transition-all">Sign in</Link>
              </p>
            </div>

            <p className="text-center text-[11px] text-dark-600 mt-4">Free tier: 50 AI requests daily &bull; No credit card required</p>
          </div>
        </div>
      </div>
    </div>
  )
}
