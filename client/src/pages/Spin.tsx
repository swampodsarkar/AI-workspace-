import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Icons } from '../lib/icons'
import { getCoinBalance, getSpinAvailable, doSpin } from '../lib/coins'

const SEGMENTS = [
  { value: 0, color: '#ef4444' },
  { value: 1, color: '#f97316' },
  { value: 2, color: '#eab308' },
  { value: 3, color: '#22c55e' },
  { value: 5, color: '#06b6d4' },
  { value: 8, color: '#3b82f6' },
  { value: 10, color: '#8b5cf6' },
  { value: 15, color: '#ec4899' },
]

const SEGMENT_ANGLE = 360 / SEGMENTS.length

export default function Spin() {
  const [balance, setBalance] = useState(getCoinBalance())
  const [available, setAvailable] = useState(getSpinAvailable())
  const [rotation, setRotation] = useState(0)
  const [spinning, setSpinning] = useState(false)
  const [result, setResult] = useState<{ reward: number; total: number } | null>(null)
  const [showResult, setShowResult] = useState(false)

  useEffect(() => {
    setBalance(getCoinBalance())
    setAvailable(getSpinAvailable())
  }, [])

  const handleSpin = () => {
    if (!available || spinning) return

    setSpinning(true)
    setShowResult(false)
    setResult(null)

    const spinResult = doSpin()
    const targetIndex = SEGMENTS.findIndex(s => s.value === spinResult.reward)

    const targetDeg = targetIndex * SEGMENT_ANGLE + SEGMENT_ANGLE / 2
    const targetRemainder = (360 - targetDeg + 360) % 360

    const extraSpins = 5 + Math.floor(Math.random() * 3)
    const currentRemainder = rotation % 360
    const offset = (targetRemainder - currentRemainder + 360) % 360
    const additionalSpin = extraSpins * 360 + offset
    const newRotation = rotation + additionalSpin

    setRotation(newRotation)

    setTimeout(() => {
      setSpinning(false)
      setBalance(spinResult.total)
      setAvailable(getSpinAvailable())
      setResult(spinResult)
      setShowResult(true)
    }, 4000)
  }

  const conicGradient = `conic-gradient(from -22.5deg, ${SEGMENTS.map((s, i) => `${s.color} ${i * SEGMENT_ANGLE}deg ${(i + 1) * SEGMENT_ANGLE}deg`).join(', ')})`

  return (
    <div className="max-w-4xl mx-auto animate-fade-in space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2.5">
          <Link to="/" className="btn-ghost p-1.5 !rounded-lg">
            <Icons.ChevronLeft size={18} />
          </Link>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg">
            <Icons.Sparkles size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold">Lucky Spin</h1>
            <p className="text-xs text-dark-500">Spin the wheel, win coins</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-dark-800/80 border border-yellow-500/20 rounded-xl px-4 py-2">
          <Icons.Coins size={18} className="text-yellow-400" />
          <span className="text-lg font-bold text-yellow-400">{balance}</span>
          <span className="text-xs text-dark-500">coins</span>
        </div>
      </div>

      {!available && !spinning ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 rounded-full bg-dark-800/50 border border-dark-700/60 flex items-center justify-center mb-4">
            <Icons.Clock size={32} className="text-dark-400" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Come back tomorrow!</h2>
          <p className="text-dark-400 text-sm max-w-xs">
            You've already used your free spin today. New spins are available daily.
          </p>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-6">
          <div className="relative w-80 h-80 sm:w-96 sm:h-96">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500/20 via-pink-500/10 to-transparent blur-xl" />
            <div className="absolute inset-2 rounded-full border-4 border-dark-700/80" />

            <div
              className="absolute inset-4 rounded-full shadow-2xl overflow-hidden"
              style={{
                background: conicGradient,
                transform: `rotate(${rotation}deg)`,
                transition: spinning
                  ? 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)'
                  : 'none',
              }}
            >
              {SEGMENTS.map((seg, i) => {
                const angle = i * SEGMENT_ANGLE + SEGMENT_ANGLE / 2
                return (
                  <div
                    key={i}
                    className="absolute inset-0 flex items-start justify-center"
                    style={{ transform: `rotate(${angle}deg)` }}
                  >
                    <span
                      className="mt-5 sm:mt-6 text-xs sm:text-sm font-bold text-white drop-shadow-lg"
                      style={{ transform: `rotate(-${angle}deg)` }}
                    >
                      {seg.value}
                    </span>
                  </div>
                )
              })}
            </div>

            <div className="absolute inset-0 flex items-center justify-center">
              <button
                onClick={handleSpin}
                disabled={spinning || !available}
                className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-dark-800 to-dark-900 border-4 border-dark-600/80 shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {spinning ? (
                  <Icons.Loader2 size={24} className="text-white animate-spin" />
                ) : (
                  <span className="text-sm sm:text-base font-black text-white tracking-[0.15em]">
                    SPIN
                  </span>
                )}
              </button>
            </div>

            <div className="absolute -top-1 left-1/2 -translate-x-1/2 z-10">
              <div className="w-0 h-0 border-l-[14px] border-r-[14px] border-b-[24px] border-l-transparent border-r-transparent border-b-white drop-shadow-lg" />
            </div>
          </div>
        </div>
      )}

      {/* Result */}
      {showResult && result && (
        <div className="text-center animate-fade-in-up">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-2xl px-8 py-4">
            <Icons.Zap size={20} className="text-yellow-400" />
            <div>
              <p className="text-sm text-dark-400">You won</p>
              <p className="text-2xl font-bold text-yellow-400">+{result.reward} coins</p>
            </div>
          </div>
        </div>
      )}

      {/* Info */}
      <div className="card text-center">
        <p className="text-sm text-dark-400">
          <Icons.Sparkles size={14} className="inline mr-1 text-yellow-400" />
          One free spin every day. Come back tomorrow for another chance!
        </p>
      </div>
    </div>
  )
}
