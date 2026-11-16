'use client'
import { useState } from 'react'
import { Lock, Eye, EyeOff } from 'lucide-react'
import { useAdmin } from '@/contexts/AdminContext'

export default function AdminLoginModal() {
  const { login, setShowLogin } = useAdmin()
  const [pin,     setPin]     = useState('')
  const [show,    setShow]    = useState(false)
  const [error,   setError]   = useState('')
  const [shaking, setShaking] = useState(false)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (login(pin)) return
    setError('Incorrect PIN. Please try again.')
    setPin('')
    setShaking(true)
    setTimeout(() => setShaking(false), 500)
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <div
        className={`glass-card w-full max-w-sm p-8 text-center transition-transform
          ${shaking ? 'animate-[shake_.4s_ease]' : ''}`}
        style={shaking ? { animation: 'shake .4s ease' } : {}}
      >
        {/* Lock icon */}
        <div className="w-16 h-16 rounded-full bg-amber-500/12 border border-amber-400/30 flex items-center justify-center mx-auto mb-6">
          <Lock size={28} className="text-amber-400" />
        </div>

        <h3 className="font-playfair text-2xl font-bold gold-text mb-1">Admin Access</h3>
        <p className="text-xs font-jakarta text-[#9A8878] mb-7 tracking-wide">
          Enter your PIN to unlock edit mode
        </p>

        <form onSubmit={submit} className="flex flex-col gap-4">
          <div className="relative">
            <input
              type={show ? 'text' : 'password'}
              value={pin}
              onChange={e => { setPin(e.target.value); setError('') }}
              placeholder="••••••"
              maxLength={8}
              autoFocus
              className="w-full bg-white/5 border border-amber-500/25 rounded-xl px-4 py-3
                text-center text-xl tracking-[0.4em] text-amber-300 outline-none
                focus:border-amber-400/60 font-jakarta transition-colors"
            />
            <button
              type="button"
              onClick={() => setShow(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9A8878] hover:text-amber-400 transition-colors"
            >
              {show ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {error && (
            <p className="text-red-400 text-xs font-jakarta">{error}</p>
          )}

          <button type="submit" className="btn-gold font-jakarta">
            Unlock
          </button>
          <button
            type="button"
            onClick={() => setShowLogin(false)}
            className="btn-outline-gold font-jakarta text-sm"
          >
            Cancel
          </button>
        </form>
      </div>

      <style>{`
        @keyframes shake {
          0%,100% { transform: translateX(0); }
          20%      { transform: translateX(-8px); }
          40%      { transform: translateX(8px); }
          60%      { transform: translateX(-6px); }
          80%      { transform: translateX(6px); }
        }
      `}</style>
    </div>
  )
}
