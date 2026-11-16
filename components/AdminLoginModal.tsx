'use client'

import { useState } from 'react'
import { Eye, EyeOff, Lock } from 'lucide-react'
import { useAdmin } from '@/contexts/AdminContext'

export default function AdminLoginModal() {
  const { login, setShowLogin } = useAdmin()
  const [pin,       setPin]     = useState('')
  const [showPin,   setShowPin] = useState(false)
  const [error,     setError]   = useState(false)
  const [shake,     setShake]   = useState(false)

  const tryLogin = () => {
    if (login(pin)) {
      setShowLogin(false)
    } else {
      setError(true)
      setShake(true)
      setPin('')
      setTimeout(() => setShake(false), 450)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4">
      <div className={`glass-card rounded-2xl p-8 w-full max-w-sm shadow-2xl ${shake ? 'shake' : ''}`}>

        {/* Icon */}
        <div className="w-14 h-14 rounded-2xl bg-gradient-aqua flex items-center justify-center mx-auto mb-5">
          <Lock size={24} className="text-white" />
        </div>

        <h2 className="font-playfair text-2xl font-bold text-[#0F172A] text-center mb-1">
          Admin Access
        </h2>
        <p className="text-sm text-[#64748B] font-jakarta text-center mb-6">
          Enter your PIN to enable edit mode
        </p>

        {/* PIN input */}
        <div className="relative mb-2">
          <input
            type={showPin ? 'text' : 'password'}
            placeholder="Enter PIN"
            value={pin}
            onChange={e => { setPin(e.target.value); setError(false) }}
            onKeyDown={e => e.key === 'Enter' && tryLogin()}
            className={`input-field pr-12 text-center tracking-[0.3em] text-lg ${
              error ? 'border-red-400 focus:border-red-400 focus:shadow-none' : ''
            }`}
            autoFocus
          />
          <button
            type="button"
            onClick={() => setShowPin(!showPin)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-teal-600 transition-colors"
          >
            {showPin ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {error && (
          <p className="text-sm text-red-500 text-center font-jakarta mb-3">
            Incorrect PIN. Please try again.
          </p>
        )}

        <div className="flex gap-3 mt-5">
          <button onClick={tryLogin} className="btn-primary flex-1 justify-center">
            Unlock
          </button>
          <button onClick={() => setShowLogin(false)} className="btn-outline flex-1 justify-center">
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
