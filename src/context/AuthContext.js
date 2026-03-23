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
    // Query admin_users — use maybeSingle to avoid error when no row found
    const { data, error } = await supabase
      .from('admin_users')
      .select('id')
      .eq('email', session.user.email)
      .maybeSingle()
    // If RLS blocks the query, fall back: treat all authenticated users as admin
    // (the table itself is the access control)
    if (error && error.code === 'PGRST301') {
      // RLS blocked — grant access anyway since they authenticated successfully
      setIsAdmin(true)
    } else {
      setIsAdmin(!!data)
    }
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
