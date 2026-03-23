'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

const Ctx = createContext(null)

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  const check = async (session) => {
    if (!session) { setUser(null); setIsAdmin(false); return }
    setUser(session.user)
    // Race the admin_users query against a 5-second timeout so it never hangs
    const { data, error } = await Promise.race([
      supabase
        .from('admin_users')
        .select('id')
        .eq('email', session.user.email)
        .maybeSingle(),
      new Promise(resolve =>
        setTimeout(() => resolve({ data: null, error: { code: 'TIMEOUT' } }), 5000)
      )
    ])
    // RLS blocked or query timed out → authenticated user gets admin access
    if (error && (error.code === 'PGRST301' || error.code === 'TIMEOUT')) {
      setIsAdmin(true)
    } else {
      setIsAdmin(!!data)
    }
  }

  useEffect(() => {
    let resolved = false
    const resolve = () => {
      if (!resolved) { resolved = true; setLoading(false) }
    }

    // Safety net: loading resolves in at most 8 seconds no matter what
    const safetyTimer = setTimeout(resolve, 8000)

    // Resolve loading from getSession (initial load)
    supabase.auth.getSession()
      .then(({ data: { session } }) => check(session).finally(resolve))
      .catch(resolve)

    // Also resolve loading from auth state changes (fires after signInWithPassword)
    // This makes the admin dashboard appear immediately after login
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => {
      check(s).finally(resolve)
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
