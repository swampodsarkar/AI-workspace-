import { useState } from 'react'
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

  return (
    <div className="min-h-screen flex bg-dark-900">
      {/* Left */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden flex-col justify-center px-16 bg-dark-900">
        <div className="absolute inset-0 dotted-bg opacity-40" />
        <div className="absolute top-20 right-10 w-80 h-80 bg-purple-500 rounded-full blur-[150px] opacity-20 animate-float" style={{ animationDelay: '-1s' }} />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-primary-500 rounded-full blur-[150px] opacity-20 animate-float" style={{ animationDelay: '-3s' }} />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-cyan-500 rounded-full blur-[100px] opacity-10 animate-float" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center shadow-xl shadow-primary-500/30">
              <Sparkles size={24} className="text-white" />
            </div>
            <div>
              <span className="text-xl font-bold gradient-text-primary">AI Workspace</span>
              <p className="text-[11px] text-dark-500 uppercase tracking-wider font-medium">All-in-One Platform</p>
            </div>
          </div>
          <h1 className="text-4xl font-bold leading-tight mb-4">Start Creating<br />with <span className="gradient-text">AI Today</span></h1>
          <p className="text-dark-300 text-lg max-w-md leading-relaxed">
            Get <strong className="text-white">50 free requests daily</strong>. No credit card needed. Upgrade anytime for unlimited access.
          </p>
          <div className="mt-12 space-y-3">
            {[
              { icon: Zap, title: 'Free Tier', desc: '50 AI requests daily, completely free', color: 'text-yellow-400' },
              { icon: Shield, title: 'Premium', desc: 'Unlimited access from 499 BDT/mo', color: 'text-primary-400' },
              { icon: Github, title: 'GitHub Login', desc: 'One-click signup with GitHub', color: 'text-dark-200' },
            ].map(f => (
              <div key={f.title} className="flex items-start gap-3.5 bg-white/[0.02] border border-white/[0.05] rounded-2xl p-4 hover:bg-white/[0.04] transition-colors">
                <div className={`w-9 h-9 rounded-lg bg-dark-800 border border-dark-700 flex items-center justify-center flex-shrink-0 ${f.color}`}>
                  <f.icon size={16} />
                </div>
                <div>
                  <p className="font-semibold text-sm">{f.title}</p>
                  <p className="text-dark-500 text-xs">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative">
        <div className="absolute inset-0 dotted-bg opacity-20 lg:hidden" />
        <div className="w-full max-w-sm relative z-10">
          {/* Mobile logo */}
          <div className="text-center mb-8 lg:hidden">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center shadow-lg">
                <Sparkles size={18} className="text-white" />
              </div>
              <span className="text-lg font-bold gradient-text-primary">AI Workspace</span>
            </div>
            <p className="text-dark-400 text-sm">Create your account</p>
          </div>

          {/* Desktop title */}
          <div className="hidden lg:block text-center mb-8">
            <h2 className="text-2xl font-bold">Create account</h2>
            <p className="text-dark-400 mt-1">Get started with AI Workspace — it's free</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            {error && (
              <div className="flex items-start gap-2.5 bg-red-500/10 border border-red-500/20 rounded-xl p-3.5 text-sm text-red-400">
                <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="text-sm text-dark-300 block mb-1.5 font-medium">Username</label>
              <div className="relative">
                <UserIcon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-400" />
                <input className="input pl-10" placeholder="john_doe" value={username} onChange={e => setUsername(e.target.value)} autoFocus />
              </div>
            </div>

            <div>
              <label className="text-sm text-dark-300 block mb-1.5 font-medium">Email</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-400" />
                <input className="input pl-10" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
            </div>

            <div>
              <label className="text-sm text-dark-300 block mb-1.5 font-medium">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-400" />
                <input className="input pl-10 pr-10" type={showPw ? 'text' : 'password'} placeholder="Min 6 characters" value={password} onChange={e => setPassword(e.target.value)} />
                <button type="button" className="absolute right-3.5 top-1/2 -translate-y-1/2 text-dark-400 hover:text-white transition-colors" onClick={() => setShowPw(!showPw)}>
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3 flex items-center justify-center gap-2 text-sm">
              {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : null}
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-dark-700/60" /></div>
            <div className="relative flex justify-center"><span className="bg-dark-900 px-4 text-xs text-dark-500">or continue with</span></div>
          </div>

          <button onClick={handleGithub} disabled={loading} className="w-full border border-dark-700 hover:border-dark-500 rounded-xl py-3 flex items-center justify-center gap-2.5 text-sm font-medium transition-all duration-200 hover:bg-dark-800/50">
            <Github size={18} />
            Continue with GitHub
          </button>

          <p className="text-center text-sm text-dark-400 mt-8">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-400 hover:text-primary-300 font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
