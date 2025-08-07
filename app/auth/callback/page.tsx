'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Loader2, CheckCircle, XCircle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function AuthCallback() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log('Auth callback started...')

        // Check for error parameters first
        const error_code = searchParams?.get('error')
        const error_description = searchParams?.get('error_description')

        if (error_code) {
          console.error('OAuth error:', error_code, error_description)
          setError(error_description || `OAuth Error: ${error_code}`)
          setLoading(false)
          return
        }

        // Try to get session
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          console.error('Session error:', error)
          setError(error.message)
          setLoading(false)
          return
        }

        if (data.session) {
          console.log('Session found, user authenticated:', data.session.user.email)
          setSuccess(true)
          setLoading(false)

          // Redirect after showing success message
          setTimeout(() => {
            router.push('/')
          }, 2000)
        } else {
          console.log('No session found, checking for auth code...')

          // Try to handle auth code exchange
          const code = searchParams?.get('code')
          if (code) {
            console.log('Auth code found, exchanging for session...')
            const { data: sessionData, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

            if (exchangeError) {
              console.error('Code exchange error:', exchangeError)
              setError(exchangeError.message)
              setLoading(false)
              return
            }

            if (sessionData.session) {
              console.log('Session created successfully')
              setSuccess(true)
              setLoading(false)

              setTimeout(() => {
                router.push('/')
              }, 2000)
            } else {
              setError('Failed to create session')
              setLoading(false)
            }
          } else {
            setError('No authentication code received')
            setLoading(false)
          }
        }
      } catch (error) {
        console.error('Auth callback error:', error)
        setError('An unexpected error occurred')
        setLoading(false)
      }
    }

    handleAuthCallback()
  }, [router, searchParams])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-warm-cream to-sage-green/20 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-islamic-green to-primary flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-primary-foreground animate-spin" />
            </div>
            <CardTitle className="text-islamic-green">প্রবেশ করা হচ্ছে...</CardTitle>
            <CardDescription>
              আপনার অ্যাকাউন্ট যাচাই করা হচ্ছে
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-warm-cream to-sage-green/20 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-green-600">সফলভাবে প্রবেশ করেছেন!</CardTitle>
            <CardDescription>
              আপনাকে হোম পেজে নিয়ে যাওয়া হচ্ছে...
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-warm-cream to-sage-green/20 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
            <CardTitle className="text-red-600">প্রবেশে সমস্যা</CardTitle>
            <CardDescription className="text-red-500 text-sm">
              {error}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              দয়া করে আবার চেষ্টা করুন অথবা ইমেইল/পাসওয়ার্ড দিয়ে লগইন করুন
            </p>
            <div className="flex gap-2 justify-center">
              <Button asChild variant="outline">
                <Link href="/auth/login">
                  আবার চেষ্টা করুন
                </Link>
              </Button>
              <Button asChild className="bg-islamic-green hover:bg-islamic-green/90">
                <Link href="/">
                  হোমে যান
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return null
}
