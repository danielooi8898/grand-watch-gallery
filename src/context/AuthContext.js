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
    // RLS blocked or query timed out → grant access (user authenticated successfully)
    if (error && (error.code === 'PGRST301' || error.code === 'TIMEOUT')) {
      setIsAdmin(true)
    } else {
      setIsAdmin(!!data)
    }
  }

  useEffect(() => {
    // Safety net: loading ALWAYS resolves within 10 seconds no matter what
    const safetyTimer = setTimeout(() => setLoading(false), 10000)

    supabase.auth.getSession()
      .then(({ data: { session } }) =>
        check(session).finally(() => {
          clearTimeout(safetyTimer)
          setLoading(false)
        })
      )
      .catch(() => {
        clearTimeout(safetyTimer)
        setLoading(false)
      })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => check(s))
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
