import { NavLink } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Icons } from '../lib/icons'
import { getRemaining, isLimitReached } from '../lib/usage'
import { getCoinBalance } from '../lib/coins'

const navItems = [
  { to: '/', icon: Icons.LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/pdf', icon: Icons.FileText, label: 'PDF Tools' },
  { to: '/documents', icon: Icons.PenSquare, label: 'Document Editor' },
  { to: '/image', icon: Icons.Image, label: 'Image Generator' },
  { to: '/excel', icon: Icons.Table, label: 'Excel AI' },
  { to: '/code', icon: Icons.Code, label: 'Code AI' },
  { to: '/website', icon: Icons.Globe, label: 'Website Builder' },
  { to: '/email', icon: Icons.Mail, label: 'Email Writer' },
  { to: '/analysis', icon: Icons.BarChart3, label: 'Data Analysis' },
  { to: '/storage', icon: Icons.Cloud, label: 'Cloud Storage' },
  { to: '/earn', icon: Icons.Coins, label: 'Earn Coins' },
  { to: '/spin', icon: Icons.RefreshCw, label: 'Lucky Spin' },
  { to: '/meme', icon: Icons.Image, label: 'Meme Generator' },
  { to: '/referral', icon: Icons.Share2, label: 'Referral' },
]

interface SidebarProps { mobileOpen?: boolean; onClose?: () => void }

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const [coinBalance, setCoinBalance] = useState(getCoinBalance())

  useEffect(() => {
    const handler = () => setCoinBalance(getCoinBalance())
    window.addEventListener('bitbyte-coins-changed', handler)
    return () => window.removeEventListener('bitbyte-coins-changed', handler)
  }, [])

  const baseLink = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 ${
      isActive
        ? 'bg-primary-600/15 text-primary-400 border border-primary-500/25 shadow-sm shadow-primary-500/10 font-medium'
        : 'text-dark-300 hover:bg-dark-700/70 hover:text-white border border-transparent'
    }`

  return (
    <>
      <div className="p-5 border-b border-dark-700/60">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center shadow-lg shadow-primary-500/20">
            <Icons.Sparkles size={16} className="text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold bg-gradient-to-r from-primary-400 to-purple-400 bg-clip-text text-transparent">Bit-Byte</h1>
            <p className="text-[10px] text-dark-500 font-medium tracking-wide uppercase">AI-Powered Workspace</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
        {navItems.map(item => (
          <NavLink key={item.to} to={item.to} end={item.end} className={baseLink} onClick={onClose}>
            <item.icon size={17} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-dark-700/60">
        <div className="bg-dark-800/60 border border-dark-700/50 rounded-xl p-3.5">
          <div className="flex items-center gap-2 mb-1.5">
            <Icons.Sparkles size={12} className="text-yellow-400" />
            <span className="text-xs font-semibold text-yellow-400">Free Tier</span>
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-dark-400">Requests left</span>
              <span className={`font-semibold ${isLimitReached() ? 'text-red-400' : 'text-green-400'}`}>
                {getRemaining()}/{50}
              </span>
            </div>
            <div className="w-full h-1.5 bg-dark-700 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${isLimitReached() ? 'bg-red-500' : 'bg-gradient-to-r from-primary-500 to-primary-400'}`}
                style={{ width: `${(getRemaining() / 50) * 100}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-xs pt-1.5 border-t border-dark-700/40 mt-1.5">
              <span className="text-dark-400 flex items-center gap-1"><Icons.Coins size={10} /> Coins</span>
              <span className="font-semibold text-yellow-400">{coinBalance}</span>
            </div>
            <NavLink to="/earn" onClick={onClose} className="mt-1.5 block text-center text-[10px] text-yellow-400 hover:text-yellow-300 bg-yellow-500/10 hover:bg-yellow-500/20 rounded-lg py-1.5 transition-colors font-medium">
              + Earn Free Coins
            </NavLink>
            <NavLink to="/pricing" onClick={onClose} className="mt-1.5 block text-center text-xs text-primary-400 hover:text-primary-300 bg-primary-500/10 hover:bg-primary-500/20 rounded-lg py-1.5 transition-colors font-medium">
              Upgrade to Pro →
            </NavLink>
          </div>
        </div>
      </div>
    </>
  )
}

export default function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  return (
    <>
      <aside className="hidden md:flex flex-col w-64 bg-dark-800/95 border-r border-dark-700/60 flex-shrink-0">
        <SidebarContent />
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
          <aside className="relative w-72 h-full bg-dark-800 flex flex-col animate-slide-in shadow-2xl shadow-black/50">
            <div className="flex items-center justify-between p-3 pr-4 border-b border-dark-700/60">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center shadow-lg shadow-primary-500/20">
                  <Icons.Sparkles size={16} className="text-white" />
                </div>
                <h1 className="text-base font-bold bg-gradient-to-r from-primary-400 to-purple-400 bg-clip-text text-transparent">Bit-Byte</h1>
              </div>
              <button onClick={onClose} className="text-dark-400 hover:text-white p-1.5 rounded-lg hover:bg-dark-700 transition-colors">
                <Icons.X size={18} />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
              {navItems.map(item => (
                <NavLink key={item.to} to={item.to} end={item.end} onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                      isActive
                        ? 'bg-primary-600/15 text-primary-400 border border-primary-500/25 shadow-sm shadow-primary-500/10 font-medium'
                        : 'text-dark-300 hover:bg-dark-700/70 hover:text-white border border-transparent'
                    }`}>
                  <item.icon size={17} />
                  {item.label}
                </NavLink>
              ))}
            </nav>
            <div className="p-3 border-t border-dark-700/60">
              <div className="bg-dark-800/60 border border-dark-700/50 rounded-xl p-3.5">
                <div className="flex items-center gap-2 mb-1.5">
                  <Icons.Sparkles size={12} className="text-yellow-400" />
                  <span className="text-xs font-semibold text-yellow-400">Free Tier</span>
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-dark-400">Requests left</span>
                    <span className={`font-semibold ${isLimitReached() ? 'text-red-400' : 'text-green-400'}`}>{getRemaining()}/{50}</span>
                  </div>
                  <div className="w-full h-1.5 bg-dark-700 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-500 ${isLimitReached() ? 'bg-red-500' : 'bg-gradient-to-r from-primary-500 to-primary-400'}`}
                      style={{ width: `${(getRemaining() / 50) * 100}%` }} />
                  </div>
                  <div className="flex items-center justify-between text-xs pt-1.5 border-t border-dark-700/40 mt-1.5">
                    <span className="text-dark-400 flex items-center gap-1"><Icons.Coins size={10} /> Coins</span>
                    <span className="font-semibold text-yellow-400">{getCoinBalance()}</span>
                  </div>
                  <NavLink to="/earn" onClick={onClose} className="mt-1.5 block text-center text-[10px] text-yellow-400 hover:text-yellow-300 bg-yellow-500/10 hover:bg-yellow-500/20 rounded-lg py-1.5 transition-colors font-medium">
                    + Earn Free Coins
                  </NavLink>
                  <NavLink to="/pricing" onClick={onClose} className="mt-1.5 block text-center text-xs text-primary-400 hover:text-primary-300 bg-primary-500/10 hover:bg-primary-500/20 rounded-lg py-1.5 transition-colors font-medium">
                    Upgrade to Pro →
                  </NavLink>
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  )
}
