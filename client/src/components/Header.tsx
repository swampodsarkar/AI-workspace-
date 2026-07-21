import { Menu, Search, User, Zap, LogOut, ChevronDown } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'
import Sidebar from './Sidebar'

export default function Header() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [usage, setUsage] = useState({ used: 0, remaining: 50, premium: false })
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch('/api/usage-status').then(r => r.json()).then(setUsage).catch(() => {})
    const interval = setInterval(() => {
      fetch('/api/usage-status').then(r => r.json()).then(setUsage).catch(() => {})
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const handleClick = (e: MouseEvent) => { if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false) }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleLogout = async () => { await logout(); navigate('/login') }

  const avatar = user?.photoURL
  const displayName = user?.displayName || user?.email?.split('@')[0] || 'User'

  return (
    <>
      <header className="h-16 glass border-b border-dark-700/50 flex items-center justify-between px-4 lg:px-6 flex-shrink-0">
        <div className="flex items-center gap-4">
          <button className="md:hidden text-dark-300 hover:text-white" onClick={() => setMobileSidebarOpen(true)}>
            <Menu size={20} />
          </button>
          <div className="relative hidden sm:block">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400" />
            <input className="input pl-9 w-48 lg:w-64" placeholder="Search tools..." />
          </div>
        </div>

        <div className="flex items-center gap-3">
          {usage.premium ? (
            <span className="text-xs bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 border border-green-500/30 px-3 py-1 rounded-full flex items-center gap-1">
              <Zap size={12} /> Premium
            </span>
          ) : (
            <Link to="/pricing" className="text-xs bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-400 border border-yellow-500/30 px-3 py-1 rounded-full flex items-center gap-1 hover:bg-yellow-500/30 transition-colors whitespace-nowrap">
              <Zap size={12} /> {usage.remaining} free
            </Link>
          )}

          <div className="relative" ref={menuRef}>
            <button onClick={() => setMenuOpen(!menuOpen)} className="flex items-center gap-2 hover:bg-dark-700 rounded-lg px-2 py-1.5 transition-colors">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center overflow-hidden flex-shrink-0">
                {avatar ? <img src={avatar} alt="" className="w-full h-full object-cover" /> : <User size={14} className="text-white" />}
              </div>
              <span className="text-sm text-dark-200 hidden lg:block max-w-[120px] truncate">{displayName}</span>
              <ChevronDown size={14} className="text-dark-400 hidden lg:block" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-dark-800 border border-dark-700 rounded-xl shadow-2xl shadow-black/50 overflow-hidden z-50">
                <div className="p-3 border-b border-dark-700">
                  <p className="text-sm font-medium truncate">{displayName}</p>
                  <p className="text-xs text-dark-400 truncate">{user?.email}</p>
                </div>
                <div className="p-1">
                  <Link to="/pricing" className="flex items-center gap-2 px-3 py-2 text-sm text-dark-200 hover:bg-dark-700 rounded-lg" onClick={() => setMenuOpen(false)}>
                    <Zap size={14} /> Upgrade Plan
                  </Link>
                  <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-dark-700 rounded-lg">
                    <LogOut size={14} /> Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
      {mobileSidebarOpen && <Sidebar mobileOpen onClose={() => setMobileSidebarOpen(false)} />}
    </>
  )
}
