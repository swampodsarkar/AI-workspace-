import { Menu, Search, User, LogOut, ChevronDown, Info, Sparkles } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'
import { getRemaining, isLimitReached } from '../lib/usage'
import Sidebar from './Sidebar'

export default function Header() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const f = (e: MouseEvent) => { if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false) }
    document.addEventListener('mousedown', f)
    return () => document.removeEventListener('mousedown', f)
  }, [])

  const handleLogout = async () => { await logout(); navigate('/login') }
  const displayName = user?.displayName || user?.email?.split('@')[0] || 'User'
  const avatar = user?.photoURL

  return (
    <>
      <header className="h-16 glass flex items-center justify-between px-4 lg:px-6 flex-shrink-0">
        <div className="flex items-center gap-4">
          <button className="md:hidden text-dark-300 hover:text-white transition-colors" onClick={() => setMobileSidebarOpen(true)}>
            <Menu size={20} />
          </button>
          <div className="relative hidden sm:block">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-400" />
            <input className="input pl-9 w-48 lg:w-72 h-9 text-xs" placeholder="Search tools..." />
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Usage badge */}
          <Link to="/pricing" className={`hidden md:flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-all duration-200 ${
            isLimitReached()
              ? 'bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20'
              : 'bg-primary-500/10 text-primary-400 border-primary-500/20 hover:bg-primary-500/20'
          }`}>
            <Sparkles size={11} />
            <span className="font-medium">{getRemaining()}</span>
            <span className="opacity-70">/ 50</span>
          </Link>

          {/* User menu */}
          <div className="relative" ref={menuRef}>
            <button onClick={() => setMenuOpen(!menuOpen)} className="flex items-center gap-2 hover:bg-dark-700 rounded-xl px-2.5 py-1.5 transition-all duration-200 border border-transparent hover:border-dark-600">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-sm">
                {avatar ? <img src={avatar} alt="" className="w-full h-full object-cover" /> : <User size={13} className="text-white" />}
              </div>
              <span className="text-sm text-dark-200 hidden lg:block max-w-[120px] truncate font-medium">{displayName}</span>
              <ChevronDown size={12} className={`text-dark-400 hidden lg:block transition-transform duration-200 ${menuOpen ? 'rotate-180' : ''}`} />
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-dark-800 border border-dark-700/80 rounded-xl shadow-2xl shadow-black/40 overflow-hidden z-50 animate-fade-in">
                <div className="p-4 border-b border-dark-700/60">
                  <p className="text-sm font-semibold truncate">{displayName}</p>
                  <p className="text-xs text-dark-400 truncate mt-0.5">{user?.email}</p>
                </div>
                <div className="p-1.5">
                  <Link to="/pricing" className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-dark-200 hover:bg-dark-700/80 rounded-lg w-full text-left transition-colors" onClick={() => setMenuOpen(false)}>
                    <Sparkles size={15} className="text-yellow-400" />
                    Upgrade Plan
                    <span className="ml-auto badge-green text-[10px]">Pro</span>
                  </Link>
                  <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-red-400 hover:bg-dark-700/80 rounded-lg transition-colors mt-0.5">
                    <LogOut size={15} />
                    Sign Out
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
