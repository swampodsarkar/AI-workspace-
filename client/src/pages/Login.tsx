import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Sparkles, Mail, Lock, Eye, EyeOff, Github, AlertCircle } from 'lucide-react'
import { useAuth } from '../lib/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, loginWithGithub } = useAuth()
  const navigate = useNavigate()

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
    <div className="min-h-screen flex bg-dark-900">
      {/* Left panel */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden flex-col justify-center px-16 bg-dark-900">
        <div className="absolute inset-0 dotted-bg opacity-40" />
        <div className="absolute top-20 left-10 w-80 h-80 bg-primary-500 rounded-full blur-[150px] opacity-20 animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500 rounded-full blur-[150px] opacity-20 animate-float" style={{ animationDelay: '-3s' }} />
        <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-cyan-500 rounded-full blur-[100px] opacity-10 animate-float" style={{ animationDelay: '-1.5s' }} />
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
          <h1 className="text-4xl font-bold leading-tight mb-4">Your All-in-One<br /><span className="gradient-text">AI Workspace</span></h1>
          <p className="text-dark-300 text-lg max-w-md leading-relaxed">
            Chat, create, code, analyze — all powered by AI. <strong className="text-white">50 free requests daily</strong>, no credit card required.
          </p>
          <div className="mt-12 grid grid-cols-2 gap-3">
            {[
              { label: 'AI Chat', desc: 'Smart conversations', color: 'from-blue-500 to-cyan-500' },
              { label: 'Image Gen', desc: 'Create visuals', color: 'from-green-500 to-emerald-500' },
              { label: 'Code AI', desc: 'Write & debug', color: 'from-yellow-500 to-orange-500' },
              { label: 'PDF Tools', desc: 'Edit documents', color: 'from-red-500 to-orange-500' },
            ].map(f => (
              <div key={f.label} className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4 backdrop-blur-sm hover:bg-white/[0.05] transition-colors">
                <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${f.color} flex items-center justify-center mb-2`}>
                  <Sparkles size={13} className="text-white" />
                </div>
                <p className="font-semibold text-sm">{f.label}</p>
                <p className="text-dark-500 text-xs">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
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
            <p className="text-dark-400 text-sm">Sign in to your account</p>
          </div>

          {/* Desktop title */}
          <div className="hidden lg:block text-center mb-8">
            <h2 className="text-2xl font-bold">Welcome back</h2>
            <p className="text-dark-400 mt-1">Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="flex items-start gap-2.5 bg-red-500/10 border border-red-500/20 rounded-xl p-3.5 text-sm text-red-400">
                <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="text-sm text-dark-300 block mb-1.5 font-medium">Email</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-400" />
                <input className="input pl-10" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} autoFocus />
              </div>
            </div>

            <div>
              <label className="text-sm text-dark-300 block mb-1.5 font-medium">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-400" />
                <input className="input pl-10 pr-10" type={showPw ? 'text' : 'password'} placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)} />
                <button type="button" className="absolute right-3.5 top-1/2 -translate-y-1/2 text-dark-400 hover:text-white transition-colors" onClick={() => setShowPw(!showPw)}>
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3 flex items-center justify-center gap-2 text-sm">
              {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : null}
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-dark-700/60" /></div>
            <div className="relative flex justify-center"><span className="bg-dark-900 px-4 text-xs text-dark-500">or continue with</span></div>
          </div>

          <button onClick={handleGithub} disabled={loading} className="w-full border border-dark-700 hover:border-dark-500 rounded-xl py-3 flex items-center justify-center gap-2.5 text-sm font-medium transition-all duration-200 hover:bg-dark-800/50">
            <Github size={18} />
            GitHub
          </button>

          <p className="text-center text-sm text-dark-400 mt-8">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary-400 hover:text-primary-300 font-semibold hover:underline">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
