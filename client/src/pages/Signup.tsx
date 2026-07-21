import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Sparkles, Mail, Lock, User as UserIcon, Eye, EyeOff, Github, AlertCircle } from 'lucide-react'
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
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-gradient-to-br from-purple-900/40 via-dark-900 to-primary-900/40">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 right-10 w-72 h-72 bg-purple-500 rounded-full blur-[128px]" />
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-primary-500 rounded-full blur-[128px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500 rounded-full blur-[100px]" />
        </div>
        <div className="relative z-10 flex flex-col justify-center px-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center">
              <Sparkles size={24} className="text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-purple-400 bg-clip-text text-transparent">AI Workspace</span>
          </div>
          <h1 className="text-4xl font-bold leading-tight mb-4">Start Creating<br />with AI Today</h1>
          <p className="text-dark-300 text-lg max-w-md">
            Get 50 free requests daily. No credit card needed. Upgrade anytime for unlimited access.
          </p>
          <div className="mt-12 space-y-4">
            {[
              { title: 'Free Tier', desc: '50 AI requests daily, no cost' },
              { title: 'Premium', desc: 'Unlimited access from 499 BDT/mo' },
              { title: 'GitHub Login', desc: 'One-click signup with GitHub' },
            ].map(f => (
              <div key={f.title} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-green-400" />
                </div>
                <div><p className="font-medium text-sm">{f.title}</p><p className="text-dark-400 text-xs">{f.desc}</p></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8 lg:hidden">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles size={24} className="text-primary-400" />
              <span className="text-xl font-bold bg-gradient-to-r from-primary-400 to-purple-400 bg-clip-text text-transparent">AI Workspace</span>
            </div>
            <p className="text-dark-400 text-sm">Create your account</p>
          </div>

          <div className="hidden lg:block text-center mb-8">
            <h2 className="text-2xl font-semibold">Create account</h2>
            <p className="text-dark-400 mt-1">Get started with AI Workspace</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            {error && (
              <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-sm text-red-400">
                <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="text-sm text-dark-300 block mb-1.5">Username</label>
              <div className="relative">
                <UserIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400" />
                <input className="input pl-10" placeholder="john_doe" value={username} onChange={e => setUsername(e.target.value)} />
              </div>
            </div>

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
                <input className="input pl-10 pr-10" type={showPw ? 'text' : 'password'} placeholder="Min 6 characters" value={password} onChange={e => setPassword(e.target.value)} />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400 hover:text-white" onClick={() => setShowPw(!showPw)}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-2.5 flex items-center justify-center gap-2">
              {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : null}
              {loading ? 'Creating account...' : 'Create Account'}
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
            Already have an account?{' '}
            <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
