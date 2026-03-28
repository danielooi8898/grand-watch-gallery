'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

const Ctx = createContext(null)

const OWNER_EMAIL = 'ooimunhong8898@gmail.com'

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isOwner, setIsOwner] = useState(false)
  const [loading, setLoading] = useState(true)

  const check = (session) => {
    if (!session) {
      setUser(null)
      setIsAdmin(false)
      setIsOwner(false)
    } else {
      setUser(session.user)
      setIsAdmin(true)
      setIsOwner(session.user?.email === OWNER_EMAIL)
    }
  }

  useEffect(() => {
    let resolved = false
    const resolve = () => {
      if (!resolved) { resolved = true; setLoading(false) }
    }

    const safetyTimer = setTimeout(resolve, 5000)

    supabase.auth.getSession()
      .then(({ data: { session } }) => { check(session); resolve() })
      .catch(resolve)

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => {
      check(s)
      resolve()
    })

    return () => {
      clearTimeout(safetyTimer)
      subscription.unsubscribe()
    }
  }, [])

  const signIn  = (email, pw) => supabase.auth.signInWithPassword({ email, password: pw })
  const signOut = () => supabase.auth.signOut()

  return (
    <Ctx.Provider value={{ user, isAdmin, isOwner, loading, signIn, signOut }}>
      {children}
    </Ctx.Provider>
  )
}

export const useAuth = () => useContext(Ctx)
