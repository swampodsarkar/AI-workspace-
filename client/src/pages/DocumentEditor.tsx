import { useState } from 'react'
import { PenSquare, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, List, Image, Save, Sparkles } from 'lucide-react'

export default function DocumentEditor() {
  const [content, setContent] = useState('Start writing with AI assistance...')
  const [title, setTitle] = useState('Untitled Document')

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <PenSquare className="text-primary-400" size={22} />
          <input className="bg-transparent text-xl font-semibold border-none outline-none" value={title} onChange={e => setTitle(e.target.value)} />
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-secondary text-sm py-1.5 px-3 flex items-center gap-1">
            <Sparkles size={14} /> AI Write
          </button>
          <button className="btn-primary text-sm py-1.5 px-3 flex items-center gap-1">
            <Save size={14} /> Save
          </button>
        </div>
      </div>

      <div className="card mb-4">
        <div className="flex items-center gap-1 flex-wrap border-b border-dark-700 pb-2 mb-3">
          {[Bold, Italic, Underline].map((Icon, i) => (
            <button key={i} className="p-2 rounded hover:bg-dark-700 text-dark-300 hover:text-white transition-colors">
              <Icon size={16} />
            </button>
          ))}
          <span className="w-px h-5 bg-dark-600 mx-1" />
          {[AlignLeft, AlignCenter, AlignRight].map((Icon, i) => (
            <button key={i} className="p-2 rounded hover:bg-dark-700 text-dark-300 hover:text-white transition-colors">
              <Icon size={16} />
            </button>
          ))}
          <span className="w-px h-5 bg-dark-600 mx-1" />
          <button className="p-2 rounded hover:bg-dark-700 text-dark-300 hover:text-white transition-colors">
            <List size={16} />
          </button>
          <button className="p-2 rounded hover:bg-dark-700 text-dark-300 hover:text-white transition-colors">
            <Image size={16} />
          </button>
        </div>
        <textarea className="w-full bg-transparent text-sm min-h-[400px] outline-none resize-none"
          value={content} onChange={e => setContent(e.target.value)} />
      </div>
    </div>
  )
}
