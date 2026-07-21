import { useState } from 'react'
import { Cloud, Upload, File, Folder, Download, Trash2, Share2, Search } from 'lucide-react'

const initialFiles = [
  { name: 'Project Report.pdf', size: '2.4 MB', type: 'pdf', date: '2 hours ago' },
  { name: 'Design Mockup.png', size: '1.8 MB', type: 'image', date: '5 hours ago' },
  { name: 'Budget 2026.xlsx', size: '856 KB', type: 'excel', date: '1 day ago' },
  { name: 'Meeting Notes.docx', size: '245 KB', type: 'doc', date: '2 days ago' },
  { name: 'Presentation.pptx', size: '5.2 MB', type: 'ppt', date: '3 days ago' },
]

const storageLimit = 1024 * 1024 * 1024 // 1GB
const usedStorage = 120 * 1024 * 1024 // 120MB

export default function CloudStorage() {
  const [files, setFiles] = useState(initialFiles)
  const [search, setSearch] = useState('')

  const filtered = files.filter(f => f.name.toLowerCase().includes(search.toLowerCase()))

  const usagePercent = (usedStorage / storageLimit) * 100
  const usedMB = (usedStorage / (1024 * 1024)).toFixed(0)
  const totalMB = (storageLimit / (1024 * 1024)).toFixed(0)

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Cloud className="text-primary-400" size={22} />
          <h1 className="text-xl font-semibold">Cloud Storage</h1>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Upload size={16} /> Upload File
        </button>
      </div>

      <div className="card mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-dark-400">Storage</span>
          <span className="text-sm text-dark-400">{usedMB} MB / {totalMB} MB</span>
        </div>
        <div className="h-2 bg-dark-700 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-primary-500 to-purple-500 rounded-full transition-all" style={{ width: `${usagePercent}%` }} />
        </div>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="p-4 border-b border-dark-700">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400" />
            <input className="input pl-9" placeholder="Search files..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-dark-700 bg-dark-800/50">
                <th className="text-left p-4 font-semibold text-dark-400">Name</th>
                <th className="text-left p-4 font-semibold text-dark-400 hidden sm:table-cell">Size</th>
                <th className="text-left p-4 font-semibold text-dark-400 hidden md:table-cell">Date</th>
                <th className="text-right p-4 font-semibold text-dark-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((file, i) => (
                <tr key={i} className="border-b border-dark-700/50 hover:bg-dark-700/50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary-600/20 flex items-center justify-center flex-shrink-0">
                        <File size={16} className="text-primary-400" />
                      </div>
                      <span className="truncate max-w-[200px]">{file.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-dark-400 hidden sm:table-cell">{file.size}</td>
                  <td className="p-4 text-dark-400 hidden md:table-cell">{file.date}</td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-2 rounded hover:bg-dark-700 text-dark-400 hover:text-white"><Download size={14} /></button>
                      <button className="p-2 rounded hover:bg-dark-700 text-dark-400 hover:text-white"><Share2 size={14} /></button>
                      <button className="p-2 rounded hover:bg-dark-700 text-red-400"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={4} className="p-8 text-center text-dark-400">No files found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
