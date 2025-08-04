'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/providers/AuthProvider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { Loader2, Mail, Lock, User, ArrowLeft } from 'lucide-react'

export default function SignupPage() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const { signUp, signInWithGoogle } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (password !== confirmPassword) {
      toast({
        title: 'পাসওয়ার্ড মিলছে না',
        description: 'পাসওয়ার্ড এবং নিশ্চিত পাসওয়ার্ড একই হতে হবে',
        variant: 'destructive',
      })
      return
    }

    if (password.length < 6) {
      toast({
        title: 'পাসওয়ার্ড খুব ছোট',
        description: 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)

    try {
      const { error } = await signUp(email, password, fullName)
      
      if (error) {
        toast({
          title: 'রেজিস্ট্রেশন ব্যর্থ',
          description: error.message === 'User already registered' 
            ? 'এই ইমেইল দিয়ে ইতিমধ্যে অ্যাকাউন্ট আছে' 
            : error.message,
          variant: 'destructive',
        })
        return
      }

      toast({
        title: 'স্বাগতম!',
        description: 'আপনার অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে।',
      })

      router.push('/')
    } catch (error) {
      toast({
        title: 'একটি ত্রুটি ঘটেছে',
        description: 'আবার চেষ্টা করুন',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignUp = async () => {
    setGoogleLoading(true)
    try {
      const { error } = await signInWithGoogle()

      if (error) {
        toast({
          title: 'Google রেজিস্ট্রেশন ব্যর্থ',
          description: 'আবার চেষ্টা করুন',
          variant: 'destructive',
        })
      }
      // Note: For OAuth, the redirect happens automatically
    } catch (error) {
      toast({
        title: 'একটি ত্রুটি ঘটেছে',
        description: 'আবার চেষ্টা করুন',
        variant: 'destructive',
      })
    } finally {
      setGoogleLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-warm-cream to-sage-green/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-6">
          <Link 
            href="/"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            হোমে ফিরে যান
          </Link>
        </div>

        <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-islamic-green to-primary flex items-center justify-center">
              <svg className="w-8 h-8 text-primary-foreground" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"/>
              </svg>
            </div>
            <CardTitle className="text-2xl font-bold text-islamic-green">
              নতুন অ্যাকাউন্ট তৈরি করুন
            </CardTitle>
            <CardDescription>
              আমার হাদিসে যোগ দিন এবং দৈনিক হাদিস অধ্যয়ন শুরু করুন
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">পূর্ণ নাম</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="আপনার পূর্ণ নাম লিখুন"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">ইমেইল</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="আপনার ইমেইল লিখুন"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">পাসওয়ার্ড</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="কমপক্ষে ৬ অক্ষরের পাসওয়ার্ড"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">পাসওয়ার্ড নিশ্চিত করুন</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="পাসওয়ার্ড আবার লিখুন"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-islamic-green to-primary hover:from-islamic-green/90 hover:to-primary/90"
                disabled={loading || googleLoading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    অ্যাকাউন্ট তৈরি হচ্ছে...
                  </>
                ) : (
                  'অ্যাকাউন্ট তৈরি করুন'
                )}
              </Button>
            </form>

            <div className="mt-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">অথবা</span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full mt-4"
                onClick={handleGoogleSignUp}
                disabled={loading || googleLoading}
              >
                {googleLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Google দিয়ে রেজিস্ট্রেশন হচ্ছে...
                  </>
                ) : (
                  <>
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Google দিয়ে রেজিস্ট্রেশন করুন
                  </>
                )}
              </Button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                ইতিমধ্যে অ্যাকাউন্ট আছে?{' '}
                <Link 
                  href="/auth/login" 
                  className="font-medium text-islamic-green hover:underline"
                >
                  লগইন করুন
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
