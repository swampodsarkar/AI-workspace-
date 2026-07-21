import { Link } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'
import { Bot, FileText, PenSquare, Image, Table, Code, Globe, Mail, BarChart3, Cloud, Sparkles } from 'lucide-react'
import { useEffect, useState } from 'react'

const tools = [
  { to: '/chat', icon: Bot, label: 'Chat AI', desc: 'Smart AI conversations', color: 'from-blue-500 to-cyan-500', gradient: 'from-blue-600/20 to-cyan-600/20' },
  { to: '/pdf', icon: FileText, label: 'PDF Tools', desc: 'Merge, split, compress', color: 'from-red-500 to-orange-500', gradient: 'from-red-600/20 to-orange-600/20' },
  { to: '/documents', icon: PenSquare, label: 'Document Editor', desc: 'Write with AI assistance', color: 'from-purple-500 to-pink-500', gradient: 'from-purple-600/20 to-pink-600/20' },
  { to: '/image', icon: Image, label: 'Image Generator', desc: 'Create stunning images', color: 'from-green-500 to-emerald-500', gradient: 'from-green-600/20 to-emerald-600/20' },
  { to: '/excel', icon: Table, label: 'Excel AI', desc: 'Smart spreadsheets', color: 'from-green-600 to-teal-500', gradient: 'from-green-600/20 to-teal-600/20' },
  { to: '/code', icon: Code, label: 'Code AI', desc: 'Write & debug code', color: 'from-yellow-500 to-orange-500', gradient: 'from-yellow-600/20 to-orange-600/20' },
  { to: '/website', icon: Globe, label: 'Website Builder', desc: 'Build sites with AI', color: 'from-indigo-500 to-purple-500', gradient: 'from-indigo-600/20 to-purple-600/20' },
  { to: '/email', icon: Mail, label: 'Email Writer', desc: 'Professional emails', color: 'from-blue-600 to-blue-400', gradient: 'from-blue-600/20 to-blue-400/20' },
  { to: '/analysis', icon: BarChart3, label: 'Data Analysis', desc: 'Visualize & analyze', color: 'from-rose-500 to-red-500', gradient: 'from-rose-600/20 to-red-600/20' },
  { to: '/storage', icon: Cloud, label: 'Cloud Storage', desc: 'Store & share files', color: 'from-sky-500 to-blue-500', gradient: 'from-sky-600/20 to-blue-600/20' },
]

export default function Dashboard() {
  const { user } = useAuth()
  const [greeting, setGreeting] = useState('Good Morning')

  useEffect(() => {
    const h = new Date().getHours()
    setGreeting(h < 12 ? 'Good Morning' : h < 18 ? 'Good Afternoon' : 'Good Evening')
  }, [])

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-900/40 via-dark-800 to-purple-900/40 border border-primary-500/20 p-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500 rounded-full blur-[100px] opacity-20" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500 rounded-full blur-[80px] opacity-20" />
        <div className="relative">
          <h1 className="text-2xl lg:text-3xl font-bold">{greeting}, <span className="gradient-text">{user?.displayName || user?.email?.split('@')[0] || 'User'}</span></h1>
          <p className="text-dark-300 mt-2">What would you like to create today?</p>
          <p className="text-sm text-dark-400 mt-2">{user?.email}</p>
        </div>
      </div>
      <div>
        <h2 className="text-lg font-semibold mb-4">All Tools</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {tools.map(tool => (
            <Link key={tool.to} to={tool.to} className="group relative overflow-hidden rounded-xl bg-dark-800/60 border border-dark-700/80 p-5 card-hover">
              <div className={`absolute inset-0 bg-gradient-to-br ${tool.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              <div className="relative">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${tool.color} flex items-center justify-center mb-3 shadow-lg`}><tool.icon size={20} className="text-white" /></div>
                <h3 className="font-semibold mb-1 group-hover:text-primary-400 transition-colors">{tool.label}</h3>
                <p className="text-dark-400 text-sm">{tool.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
