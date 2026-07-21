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
      setError(err.code === 'auth/invalid-credential' ? 'Invalid email or password' : err.code === 'auth/user-not-found' ? 'No account found' : err.message)
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
      {/* Left - decorative */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-gradient-to-br from-primary-900/40 via-dark-900 to-purple-900/40">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500 rounded-full blur-[128px]" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500 rounded-full blur-[128px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500 rounded-full blur-[100px]" />
        </div>
        <div className="relative z-10 flex flex-col justify-center px-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center">
              <Sparkles size={24} className="text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-purple-400 bg-clip-text text-transparent">AI Workspace</span>
          </div>
          <h1 className="text-4xl font-bold leading-tight mb-4">Your All-in-One<br />AI Workspace</h1>
          <p className="text-dark-300 text-lg max-w-md">
            Chat, create, code, analyze — all powered by AI. 16+ free models, no credit card required.
          </p>
          <div className="mt-12 grid grid-cols-2 gap-4">
            {[
              { label: 'AI Chat', desc: 'Smart conversations' },
              { label: 'Image Gen', desc: 'Create visuals' },
              { label: 'Code AI', desc: 'Write & debug' },
              { label: 'PDF Tools', desc: 'Edit documents' },
            ].map(f => (
              <div key={f.label} className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-sm">
                <p className="font-semibold text-sm">{f.label}</p>
                <p className="text-dark-400 text-xs">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right - form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8 lg:hidden">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles size={24} className="text-primary-400" />
              <span className="text-xl font-bold bg-gradient-to-r from-primary-400 to-purple-400 bg-clip-text text-transparent">AI Workspace</span>
            </div>
            <p className="text-dark-400 text-sm">Sign in to your account</p>
          </div>

          <div className="hidden lg:block text-center mb-8">
            <h2 className="text-2xl font-semibold">Welcome back</h2>
            <p className="text-dark-400 mt-1">Sign in to your account</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-sm text-red-400">
                <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="text-sm text-dark-300 block mb-1.5">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400" />
                <input className="input pl-10" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
            </div>

            <div>
              <label className="text-sm text-dark-300 block mb-1.5">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400" />
                <input className="input pl-10 pr-10" type={showPw ? 'text' : 'password'} placeholder="********" value={password} onChange={e => setPassword(e.target.value)} />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400 hover:text-white" onClick={() => setShowPw(!showPw)}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-2.5 flex items-center justify-center gap-2">
              {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : null}
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-dark-700" /></div>
            <div className="relative flex justify-center"><span className="bg-dark-900 px-3 text-xs text-dark-400">or continue with</span></div>
          </div>

          <button onClick={handleGithub} disabled={loading} className="w-full border border-dark-600 hover:border-dark-400 rounded-lg py-2.5 flex items-center justify-center gap-2 text-sm font-medium transition-colors">
            <Github size={18} />
            GitHub
          </button>

          <p className="text-center text-sm text-dark-400 mt-6">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary-400 hover:text-primary-300 font-medium">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
