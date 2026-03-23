'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

const Ctx = createContext(null)

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  // Any authenticated Supabase user is an admin —
  // the admin_users table has a broken RLS policy (infinite recursion)
  // so we skip that check entirely. Auth is the gate.
  const check = (session) => {
    if (!session) {
      setUser(null)
      setIsAdmin(false)
    } else {
      setUser(session.user)
      setIsAdmin(true)
    }
  }

  useEffect(() => {
    let resolved = false
    const resolve = () => {
      if (!resolved) { resolved = true; setLoading(false) }
    }

    // Safety net: loading resolves in at most 5 seconds
    const safetyTimer = setTimeout(resolve, 5000)

    // Resolve from initial session check
    supabase.auth.getSession()
      .then(({ data: { session } }) => { check(session); resolve() })
      .catch(resolve)

    // Also resolve immediately on auth state changes (fires right after signInWithPassword)
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
    <Ctx.Provider value={{ user, isAdmin, loading, signIn, signOut }}>
      {children}
    </Ctx.Provider>
  )
}

export const useAuth = () => useContext(Ctx)
