'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { RefreshCw, Home } from 'lucide-react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global error:', error)
  }, [error])

  return (
    <html>
      <body>
        <div className="min-h-screen bg-gradient-to-br from-background via-warm-cream to-sage-green/20 flex items-center justify-center p-4">
          <Card className="w-full max-w-md text-center">
            <CardHeader>
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                <span className="text-3xl">⚠️</span>
              </div>
              <CardTitle className="text-2xl text-red-600">
                কিছু সমস্যা হয়েছে
              </CardTitle>
              <CardDescription className="text-base">
                অ্যাপ্লিকেশনে একটি অপ্রত্যাশিত ত্রুটি ঘটেছে।
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                দয়া করে পৃষ্ঠাটি রিফ্রেশ করুন বা পরে আবার চেষ্টা করুন।
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button 
                  onClick={reset}
                  variant="outline" 
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  আবার চেষ্টা করুন
                </Button>
                <Button 
                  onClick={() => window.location.href = '/'}
                  className="bg-islamic-green hover:bg-islamic-green/90 flex items-center gap-2"
                >
                  <Home className="w-4 h-4" />
                  হোম পেজ
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </body>
    </html>
  )
}
