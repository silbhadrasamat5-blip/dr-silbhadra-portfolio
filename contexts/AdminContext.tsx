'use client'
import { createContext, useContext, useState, ReactNode } from 'react'
import { ADMIN_PIN } from '@/lib/config'

interface AdminCtx {
  isAdmin:         boolean
  showLogin:       boolean
  setShowLogin:    (v: boolean) => void
  login:           (pin: string) => boolean
  logout:          () => void
}

const Ctx = createContext<AdminCtx>({} as AdminCtx)

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAdmin,   setAdmin]   = useState(false)
  const [showLogin, setShowLogin] = useState(false)

  const login = (pin: string) => {
    if (pin === ADMIN_PIN) { setAdmin(true); setShowLogin(false); return true }
    return false
  }
  const logout = () => setAdmin(false)

  return (
    <Ctx.Provider value={{ isAdmin, showLogin, setShowLogin, login, logout }}>
      {children}
    </Ctx.Provider>
  )
}

export const useAdmin = () => useContext(Ctx)
