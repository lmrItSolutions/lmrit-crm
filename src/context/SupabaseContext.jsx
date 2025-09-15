import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import supabaseAuth from '../services/supabaseAuth'

const SupabaseContext = createContext({})

export const useSupabase = () => {
  const context = useContext(SupabaseContext)
  if (!context) {
    throw new Error('useSupabase must be used within a SupabaseProvider')
  }
  return context
}

export const SupabaseProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState(null)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session?.user) {
        loadUserProfile(session.user)
      } else {
        setLoading(false)
      }
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        if (session?.user) {
          await loadUserProfile(session.user)
        } else {
          setUser(null)
          setLoading(false)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const loadUserProfile = async (authUser) => {
    try {
      const { success, data } = await supabaseAuth.getCurrentUser()
      if (success && data) {
        setUser(data.profile)
      }
    } catch (error) {
      console.error('Error loading user profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email, password) => {
    const result = await supabaseAuth.signIn(email, password)
    if (result.success) {
      setUser(result.data.profile)
    }
    return result
  }

  const signUp = async (userData) => {
    const result = await supabaseAuth.signUp(userData)
    return result
  }

  const signOut = async () => {
    const result = await supabaseAuth.signOut()
    if (result.success) {
      setUser(null)
    }
    return result
  }

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    supabase
  }

  return (
    <SupabaseContext.Provider value={value}>
      {children}
    </SupabaseContext.Provider>
  )
}

export default SupabaseContext
