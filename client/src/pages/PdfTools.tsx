import { useState } from 'react'
import { FileText, Upload, Download, Merge, Split, Scissors, FileUp } from 'lucide-react'

const tools = [
  { icon: Merge, label: 'Merge PDF', desc: 'Combine multiple PDFs into one' },
  { icon: Scissors, label: 'Split PDF', desc: 'Split PDF into separate files' },
  { icon: FileUp, label: 'Compress PDF', desc: 'Reduce PDF file size' },
  { icon: FileText, label: 'PDF to Word', desc: 'Convert PDF to editable Word' },
  { icon: FileText, label: 'Word to PDF', desc: 'Convert Word to PDF' },
  { icon: Split, label: 'Extract Pages', desc: 'Extract specific pages' },
]

export default function PdfTools() {
  const [file, setFile] = useState<File | null>(null)

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <FileText className="text-primary-400" size={22} />
        <h1 className="text-xl font-semibold">PDF Tools</h1>
      </div>

      <div className="card mb-6 text-center">
        <div className="border-2 border-dashed border-dark-500 rounded-xl p-8 hover:border-primary-500 transition-colors cursor-pointer"
          onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); setFile(e.dataTransfer.files[0]) }}
          onClick={() => document.getElementById('pdfInput')?.click()}>
          <Upload size={40} className="mx-auto text-dark-400 mb-3" />
          <p className="text-dark-300">Drag & drop your PDF here, or click to browse</p>
          <p className="text-dark-500 text-sm mt-1">Max file size: 100MB</p>
          <input id="pdfInput" type="file" accept=".pdf" className="hidden" onChange={e => setFile(e.target.files?.[0] || null)} />
        </div>
        {file && (
          <div className="mt-3 flex items-center justify-between bg-dark-700 rounded-lg p-3">
            <span className="text-sm truncate">{file.name}</span>
            <button className="btn-primary text-sm py-1 px-3">Upload</button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tools.map((tool, i) => (
          <div key={i} className="card hover:border-primary-500/50 transition-all cursor-pointer group">
            <div className="w-10 h-10 rounded-lg bg-primary-600/20 flex items-center justify-center mb-3 group-hover:bg-primary-600/40 transition-colors">
              <tool.icon size={20} className="text-primary-400" />
            </div>
            <h3 className="font-semibold mb-1">{tool.label}</h3>
            <p className="text-dark-400 text-sm">{tool.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
