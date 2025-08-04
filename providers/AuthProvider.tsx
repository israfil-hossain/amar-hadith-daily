/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-refresh/only-export-components */
'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { Profile } from '@/types/database'

interface AuthContextType {
  user: User | null
  profile: Profile | null
  session: Session | null
  loading: boolean
  signUp: (email: string, password: string, fullName: string) => Promise<any>
  signIn: (email: string, password: string) => Promise<any>
  signInWithGoogle: () => Promise<any>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<Profile>) => Promise<any>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [initialized, setInitialized] = useState(false)

  const createProfile = useCallback(async (userId: string, userEmail: string, fullName: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          email: userEmail,
          full_name: fullName || '',
          role: 'user',
          is_verified: false,
          streak_count: 0,
          total_hadith_read: 0,
          total_contributions: 0,
          points: 0,
          level: 1,
          preferred_language: 'bn',
          notification_settings: {
            email: true,
            push: true,
            prayer_reminders: true
          },
          privacy_settings: {
            profile_public: true,
            progress_public: true
          }
        })
        .select()
        .single()

      if (error) {
        console.error('Error creating profile:', error)
        return null
      }

      console.log('Profile created successfully:', data)
      setProfile(data)
      return data
    } catch (error) {
      console.error('Error creating profile:', error)
      return null
    }
  }, [])

  const fetchProfile = useCallback(async (userId: string) => {
    try {
      console.log('Fetching profile for user:', userId)

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle() 

      if (error) {
        console.error('Error fetching profile:', error)

        // If profile doesn't exist, create it
        if (error.code === 'PGRST116') {
          console.log('Profile not found, creating new profile...')
          const { data: { user } } = await supabase.auth.getUser()
          console.log('User data for profile creation:', user)
          if (user) {
            await createProfile(userId, user.email!, user.user_metadata?.full_name || '')
          }
          return
        }
        return
      }

      console.log('Profile fetched successfully:', data)
      setProfile(data)
    } catch (error) {
      console.error('Error fetching profile:', error)
    }
  }, [createProfile])

  useEffect(() => {
    // Get initial session with error handling
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()

        if (error) {
          console.error('Error getting session:', error)
          setLoading(false)
          return
        }

        setSession(session)
        setUser(session?.user ?? null)

        if (session?.user) {
          await fetchProfile(session.user.id)
        }

        setLoading(false)
        setInitialized(true)
      } catch (error) {
        console.error('Auth initialization error:', error)
        setLoading(false)
        setInitialized(true)
      }
    }

    // Add timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      if (!initialized) {
        console.warn('Auth initialization timeout, proceeding without auth')
        setLoading(false)
        setInitialized(true)
      }
    }, 5000) // 5 second timeout

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
    setSession(session)
    setUser(session?.user ?? null)

    if (session?.user) {
      await fetchProfile(session.user.id)
    } else {
      setProfile(null)
    }
  }
    )


    return () => {
      clearTimeout(timeoutId)
      subscription.unsubscribe()
    }
  }, [fetchProfile, initialized])

  const signUp = async (email: string, password: string, fullName: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
        emailRedirectTo: undefined // Disable email confirmation
      }
    })

    // Send welcome email
    if (data.user && !error) {
      try {
        await fetch('/api/email/welcome', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userEmail: email,
            userName: fullName
          })
        })
      } catch (emailError) {
        console.error('Failed to send welcome email:', emailError)
        // Don't fail the signup if email fails
      }
    }

    return { data, error }
  }

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  }

  const signInWithGoogle = async () => {
    try {
      console.log('Attempting Google OAuth...')
      console.log('Redirect URL:', `${window.location.origin}/auth/callback`)

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      })

      if (error) {
        console.error('Google OAuth Error:', error)
        throw error
      }

      console.log('Google OAuth initiated successfully:', data)
      return { data, error }
    } catch (error) {
      console.error('Google OAuth Exception:', error)
      return { data: null, error }
    }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Error signing out:', error)
    }
  }

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { data: null, error: 'No user logged in' }

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single()

    if (data) {
      setProfile(data)
    }

    return { data, error }
  }

  const value = {
    user,
    profile,
    session,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    updateProfile,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
