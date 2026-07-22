import { useState } from 'react'
import { Icons } from '../lib/icons'

const tools = [
  { icon: Icons.Merge, label: 'Merge PDF', desc: 'Combine multiple PDFs into one' },
  { icon: Icons.Scissors, label: 'Split PDF', desc: 'Split PDF into separate files' },
  { icon: Icons.FileUp, label: 'Compress PDF', desc: 'Reduce PDF file size' },
  { icon: Icons.FileText, label: 'PDF to Word', desc: 'Convert PDF to editable Word' },
  { icon: Icons.FileText, label: 'Word to PDF', desc: 'Convert Word to PDF' },
  { icon: Icons.Split, label: 'Extract Pages', desc: 'Extract specific pages' },
]

export default function PdfTools() {
  const [file, setFile] = useState<File | null>(null)

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center shadow-lg shadow-primary-500/20">
            <Icons.FileText size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold">PDF Tools</h1>
            <p className="text-sm text-dark-400">Professional document processing suite</p>
          </div>
        </div>
        
      </div>

      <div className="card mb-6">
        <div className="border-2 border-dashed border-dark-500 rounded-xl p-8 md:p-12 text-center hover:border-primary-500/60 transition-all duration-300 cursor-pointer group"
          onDragOver={e => e.preventDefault()}
          onDrop={e => { e.preventDefault(); setFile(e.dataTransfer.files[0]) }}
          onClick={() => document.getElementById('pdfInput')?.click()}>
          <div className="w-16 h-16 rounded-2xl bg-primary-600/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-600/20 transition-colors">
            <Icons.Upload size={32} className="text-primary-400" />
          </div>
          <p className="text-dark-200 font-medium">Drag & drop your PDF here, or click to browse</p>
          <p className="text-dark-500 text-sm mt-1">Supports PDF files up to 100MB</p>
          <input id="pdfInput" type="file" accept=".pdf" className="hidden" onChange={e => setFile(e.target.files?.[0] || null)} />
        </div>
        {file && (
          <div className="mt-4 flex items-center justify-between bg-dark-700/80 rounded-xl p-4 border border-dark-600/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary-600/20 flex items-center justify-center">
                <Icons.File size={18} className="text-primary-400" />
              </div>
              <div>
                <p className="text-sm font-medium truncate max-w-[300px]">{file.name}</p>
                <p className="text-xs text-dark-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
            <button className="btn-primary text-sm py-2 px-4 flex items-center gap-1.5">
              <Icons.Upload size={14} /> Upload
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tools.map((tool, i) => (
          <div key={i} className="card hover:border-primary-500/50 hover:shadow-lg hover:shadow-primary-500/5 transition-all cursor-pointer group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-600/20 to-purple-600/20 flex items-center justify-center mb-3 group-hover:from-primary-600/30 group-hover:to-purple-600/30 transition-all">
              <tool.icon size={20} className="text-primary-400" />
            </div>
            <h3 className="font-semibold text-sm mb-1">{tool.label}</h3>
            <p className="text-dark-400 text-xs leading-relaxed">{tool.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
