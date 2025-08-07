'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-warm-cream to-sage-green/20 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center p-8">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center">
          <AlertTriangle className="w-10 h-10 text-red-600" />
        </div>
        
        <h1 className="text-2xl font-bold text-foreground mb-4">
          কিছু সমস্যা হয়েছে
        </h1>
        
        <p className="text-muted-foreground mb-6">
          অ্যাপ্লিকেশনে একটি অপ্রত্যাশিত ত্রুটি ঘটেছে।
          <br />
          দয়া করে পৃষ্ঠাটি রিফ্রেশ করুন বা পরে আবার চেষ্টা করুন।
        </p>
        
        <div className="space-y-3">
          <Button 
            onClick={reset}
            className="w-full bg-islamic-green hover:bg-islamic-green/90"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            আবার চেষ্টা করুন
          </Button>
          
          <Button 
            variant="outline"
            onClick={() => window.location.href = '/'}
            className="w-full"
          >
            <Home className="w-4 h-4 mr-2" />
            হোম পেজে যান
          </Button>
        </div>
        
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-6 text-left">
            <summary className="cursor-pointer text-sm text-muted-foreground">
              Error Details (Development Only)
            </summary>
            <pre className="mt-2 text-xs bg-muted p-3 rounded overflow-auto">
              {error.message}
              {error.stack && (
                <>
                  <br />
                  <br />
                  {error.stack}
                </>
              )}
            </pre>
          </details>
        )}
      </div>
    </div>
  )
}
