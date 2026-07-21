import { NavLink } from 'react-router-dom'
import { Bot, FileText, PenSquare, Image as ImageIcon, Table, Code, Globe, Mail, BarChart3, Cloud, LayoutDashboard, X, Sparkles } from 'lucide-react'
import { getRemaining } from '../lib/usage'

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/chat', icon: Bot, label: 'Chat AI' },
  { to: '/pdf', icon: FileText, label: 'PDF Tools' },
  { to: '/documents', icon: PenSquare, label: 'Document Editor' },
  { to: '/image', icon: ImageIcon, label: 'Image Generator' },
  { to: '/excel', icon: Table, label: 'Excel AI' },
  { to: '/code', icon: Code, label: 'Code AI' },
  { to: '/website', icon: Globe, label: 'Website Builder' },
  { to: '/email', icon: Mail, label: 'Email Writer' },
  { to: '/analysis', icon: BarChart3, label: 'Data Analysis' },
  { to: '/storage', icon: Cloud, label: 'Cloud Storage' },
]

interface SidebarProps { mobileOpen?: boolean; onClose?: () => void }

export default function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  return (
    <>
      <aside className="hidden md:flex flex-col w-64 bg-dark-800 border-r border-dark-700 flex-shrink-0">
        <div className="p-5 border-b border-dark-700">
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary-400 to-purple-400 bg-clip-text text-transparent">AI Workspace</h1>
          <p className="text-xs text-dark-400 mt-1">Your All-in-One AI Platform</p>
        </div>
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">{navItems.map(item => (
          <NavLink key={item.to} to={item.to} end={item.end}
            className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${isActive ? 'bg-primary-600/20 text-primary-400 border border-primary-500/30' : 'text-dark-300 hover:bg-dark-700 hover:text-white'}`}>
            <item.icon size={18} />
            {item.label}
          </NavLink>
        ))}</nav>
        <div className="p-3 border-t border-dark-700">
          <div className="bg-dark-800/80 border border-dark-600/50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1.5">
              <Sparkles size={12} className="text-yellow-400" />
              <span className="text-xs font-medium text-yellow-400">Free Tier</span>
            </div>
            <p className="text-xs text-dark-400">{getRemaining()}/50 requests left today</p>
            <NavLink to="/pricing" className="mt-2 text-xs text-primary-400 hover:text-primary-300 underline inline-block">Upgrade →</NavLink>
          </div>
        </div>
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={onClose} />
          <aside className="relative w-72 h-full bg-dark-800 flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-dark-700">
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary-400 to-purple-400 bg-clip-text text-transparent">AI Workspace</h1>
              <button onClick={onClose} className="text-dark-400 hover:text-white"><X size={20} /></button>
            </div>
            <nav className="flex-1 overflow-y-auto p-3 space-y-1">{navItems.map(item => (
              <NavLink key={item.to} to={item.to} end={item.end} onClick={onClose}
                className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${isActive ? 'bg-primary-600/20 text-primary-400 border border-primary-500/30' : 'text-dark-300 hover:bg-dark-700 hover:text-white'}`}>
                <item.icon size={18} />
                {item.label}
              </NavLink>
            ))}</nav>
          </aside>
        </div>
      )}
    </>
  )
}
