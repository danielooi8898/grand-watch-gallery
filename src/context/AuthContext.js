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
    const { data } = await supabase
      .from('admin_users')
      .select('id')
      .eq('email', session.user.email)
      .single()
    setIsAdmin(!!data)
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) =>
      check(session).finally(() => setLoading(false))
    )
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => check(s))
    return () => subscription.unsubscribe()
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
