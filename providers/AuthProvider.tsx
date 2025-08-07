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

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [initialized, setInitialized] = useState(false)
  const [mounted, setMounted] = useState(false)

  const createProfile = useCallback(async (userId: string, userEmail: string, fullName: string) => {
    try {
      // First check what columns exist in profiles table
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle()

      if (existingProfile) {
        console.log('Profile already exists:', existingProfile)
        setProfile(existingProfile)
        return existingProfile
      }

      // Try profile creation with all required fields to satisfy constraints
      const profileData = {
        id: userId,
        email: userEmail,
        full_name: fullName || userEmail?.split('@')[0] || 'User',
        role: 'user' as const,
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
          progress_public: false
        }
      }

      console.log('🔄 Creating profile with data:', profileData)

      // Try using the RPC function first (if available)
      try {
        const { data: rpcData, error: rpcError } = await supabase
          .rpc('create_user_profile', {
            user_id: userId,
            user_email: userEmail,
            user_full_name: fullName
          })

        if (rpcData && !rpcError) {
          console.log('✅ Profile created via RPC function:', rpcData)
          setProfile(rpcData)
          return rpcData
        }

        if (rpcError) {
          console.log('⚠️ RPC function failed, trying direct insert:', rpcError)
        }
      } catch (rpcError) {
        console.log('⚠️ RPC function not available, trying direct insert:', rpcError)
      }

      // Fallback to direct insert with minimal data
      const minimalProfileData = {
        id: userId,
        email: userEmail,
        full_name: fullName || userEmail?.split('@')[0] || 'User'
      }

      console.log('🔄 Creating profile with minimal data:', minimalProfileData)

      const { data, error } = await supabase
        .from('profiles')
        .upsert(minimalProfileData, {
          onConflict: 'id',
          ignoreDuplicates: false
        })
        .select()
        .single()

      if (error) {
        console.error('Error creating profile:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
          userId: userId,
          email: userEmail,
          fullName: fullName
        })

        // If RLS policy error, show helpful message and try to debug
        if (error.code === '42501') {
          console.error('🚨 RLS Policy Error: User not authorized to create profile')
          console.log('💡 Solution: Check if user is properly authenticated')

          // Debug current auth state
          const { data: { user }, error: authError } = await supabase.auth.getUser()
          console.log('🔍 Current auth user:', user)
          console.log('🔍 Auth error:', authError)
          console.log('🔍 User ID match:', user?.id === userId)
        }

        // If profile already exists, try to fetch it
        if (error.code === '23505') { // Unique constraint violation
          console.log('Profile already exists, fetching...')
          const { data: existingProfile, error: fetchError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .maybeSingle()

          if (fetchError) {
            console.error('Error fetching existing profile:', fetchError)
            return null
          }

          if (existingProfile) {
            console.log('Found existing profile:', existingProfile)
            setProfile(existingProfile)
            return existingProfile
          }
        }
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

  const fetchProfile = useCallback(async (userId: string): Promise<any> => {
    try {
      console.log('Fetching profile for user:', userId)

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle()

      if (error) {
        console.error('Error fetching profile:', error)
        return null
      }

      // If no profile data found, create one
      if (!data) {
        console.log('Profile not found, creating new profile...')
        const { data: { user } } = await supabase.auth.getUser()
        console.log('User data for profile creation:', user)
        if (user) {
          const newProfile = await createProfile(userId, user.email!, user.user_metadata?.full_name || user.email?.split('@')[0] || 'User')
          return newProfile
        }
        return null
      }

      console.log('Profile fetched successfully:', data)
      setProfile(data)
      return data
    } catch (error) {
      console.error('Error fetching profile:', error)
      return null
    }
  }, [createProfile])

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    // Get initial session with error handling
    const getInitialSession = async () => {
      try {
        console.log('🔄 Checking for existing session...')
        const { data: { session }, error } = await supabase.auth.getSession()

        if (error) {
          console.error('❌ Error getting session:', error)
          // Clear any stale session data
          await supabase.auth.signOut()
          setSession(null)
          setUser(null)
          setProfile(null)
          setLoading(false)
          setInitialized(true)
          return
        }

        if (session?.user) {
          console.log('✅ Found existing session for user:', session.user.id)
          setSession(session)
          setUser(session.user)

          // Fetch profile for existing session
          console.log('🔄 Loading profile for existing session...')
          const profile = await fetchProfile(session.user.id)
          if (profile) {
            console.log('✅ Profile loaded for existing session:', profile)
            setProfile(profile)
          }
        } else {
          console.log('ℹ️ No existing session found')
          setSession(null)
          setUser(null)
          setProfile(null)
        }

        setLoading(false)
        setInitialized(true)
      } catch (error) {
        console.error('❌ Auth initialization error:', error)
        // Clear any stale session data on error
        await supabase.auth.signOut()
        setSession(null)
        setUser(null)
        setProfile(null)
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
      async (event, session) => {
        console.log('🔄 Auth state changed:', event, session?.user?.id)

        setSession(session)
        setUser(session?.user ?? null)

        if (session?.user) {
          console.log('✅ User session active, loading profile...')
          const profile = await fetchProfile(session.user.id)
          if (profile) {
            setProfile(profile)
          }
        } else {
          console.log('ℹ️ No user session, clearing profile')
          setProfile(null)
        }

        // Ensure loading is false after auth state change
        setLoading(false)
      }
    )


    return () => {
      clearTimeout(timeoutId)
      subscription.unsubscribe()
    }
  }, [fetchProfile, initialized, mounted])

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      setLoading(true)

      // Clear any existing session first
      await supabase.auth.signOut()

      console.log('🔄 Starting signup process for:', email)

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          }
        }
      })

      if (error) {
        console.error('❌ Signup error:', error)
        throw error
      }

      console.log('✅ User created successfully:', data.user?.id)

      // Set user immediately after successful signup
      if (data.user) {
        console.log('✅ Setting user data...')
        setUser(data.user)
        setSession(data.session)

        // Try to create profile manually with multiple attempts
        console.log('🔄 Creating profile manually...')
        let profile = null

        // Attempt 1: Try createProfile function
        try {
          profile = await createProfile(data.user.id, email, fullName)
          if (profile) {
            console.log('✅ Profile created via createProfile:', profile)
            setProfile(profile)
          }
        } catch (profileError) {
          console.log('⚠️ createProfile failed:', profileError)
        }

        // Attempt 2: Direct insert if first attempt failed
        if (!profile) {
          try {
            console.log('🔄 Trying direct profile insert...')
            const { data: directProfile, error: directError } = await supabase
              .from('profiles')
              .insert({
                id: data.user.id,
                email: email,
                full_name: fullName || email.split('@')[0] || 'User'
              })
              .select()
              .single()

            if (directProfile && !directError) {
              console.log('✅ Profile created via direct insert:', directProfile)
              setProfile(directProfile)
              profile = directProfile
            } else {
              console.log('⚠️ Direct insert failed:', directError)
            }
          } catch (directError) {
            console.log('⚠️ Direct insert error:', directError)
          }
        }

        if (!profile) {
          console.log('⚠️ All profile creation attempts failed, but user signup successful')
        }
      }

      return { data, error: null }
    } catch (error) {
      console.error('Error signing up:', error)
      return { data: null, error }
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true)
      console.log('🔄 Starting sign-in process for:', email)

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error('❌ Sign-in error:', error)
        throw error
      }

      if (data.user && data.session) {
        console.log('✅ User signed in successfully:', data.user.id)
        setUser(data.user)
        setSession(data.session)

        // Fetch user profile
        console.log('🔄 Fetching user profile...')
        const profile = await fetchProfile(data.user.id)
        if (profile) {
          console.log('✅ Profile loaded:', profile)
          setProfile(profile)
        } else {
          console.log('⚠️ No profile found, but sign-in successful')
        }
      }

      return { data, error: null }
    } catch (error: any) {
      console.error('❌ Error signing in:', error)
      return { data: null, error }
    } finally {
      setLoading(false)
    }
  }

  const signInWithGoogle = async () => {
    try {
      console.log('Attempting Google OAuth...')

      // Use Supabase's default callback URL
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
    try {
      setLoading(true)
      console.log('🔄 Signing out user...')

      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('❌ Error signing out:', error)
        throw error
      }

      // Clear all state
      setUser(null)
      setProfile(null)
      setSession(null)

      // Clear any cached data
      localStorage.removeItem('supabase.auth.token')
      sessionStorage.clear()

      console.log('✅ User signed out successfully')
    } catch (error) {
      console.error('❌ Error during sign out:', error)
      // Force clear state even if signOut fails
      setUser(null)
      setProfile(null)
      setSession(null)
    } finally {
      setLoading(false)
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

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <AuthContext.Provider value={{
        user: null,
        profile: null,
        session: null,
        loading: true,
        signUp: async () => ({ data: null, error: null }),
        signIn: async () => ({ data: null, error: null }),
        signInWithGoogle: async () => ({ data: null, error: null }),
        signOut: async () => {},
        updateProfile: async () => ({ data: null, error: null })
      }}>
        {children}
      </AuthContext.Provider>
    )
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
