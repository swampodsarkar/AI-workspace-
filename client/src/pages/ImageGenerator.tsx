import { useState } from 'react'
import { Image, Sparkles, Download, Loader2 } from 'lucide-react'

const styles = ['Realistic', 'Anime', 'Oil Painting', '3D Render', 'Watercolor', 'Pixel Art', 'Sketch', 'Cyberpunk']

export default function ImageGenerator() {
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [image, setImage] = useState('')
  const [style, setStyle] = useState('Realistic')

  const generate = async () => {
    if (!prompt.trim() || loading) return
    setLoading(true)
    try {
      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: `${prompt}, ${style} style` })
      })
      const data = await res.json()
      setImage(data.image || '')
    } catch { setImage('') }
    setLoading(false)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <Image className="text-primary-400" size={22} />
        <h1 className="text-xl font-semibold">Image Generator</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="card">
            <div className="aspect-square rounded-xl bg-dark-700 flex items-center justify-center mb-4 overflow-hidden">
              {image ? (
                <img src={image} alt="Generated" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center text-dark-500">
                  <Image size={48} className="mx-auto mb-2" />
                  <p className="text-sm">Your generated image will appear here</p>
                </div>
              )}
            </div>
            {image && (
              <button className="btn-secondary w-full flex items-center justify-center gap-2">
                <Download size={16} /> Download
              </button>
            )}
          </div>
        </div>

        <div>
          <div className="card">
            <h3 className="font-semibold mb-3">Prompt</h3>
            <textarea className="input mb-3 h-28 resize-none" placeholder="Describe the image you want..." value={prompt} onChange={e => setPrompt(e.target.value)} />
            
            <h3 className="font-semibold mb-2 text-sm">Style</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {styles.map(s => (
                <button key={s} className={`text-xs px-3 py-1.5 rounded-full border transition-all ${style === s ? 'bg-primary-600 border-primary-500' : 'border-dark-600 text-dark-300 hover:border-dark-400'}`} onClick={() => setStyle(s)}>
                  {s}
                </button>
              ))}
            </div>

            <button className="btn-primary w-full flex items-center justify-center gap-2" onClick={generate} disabled={loading || !prompt.trim()}>
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
              {loading ? 'Generating...' : 'Generate'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
