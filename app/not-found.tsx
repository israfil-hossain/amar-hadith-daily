'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Home, Search, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-warm-cream to-sage-green/20 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center p-8">
        <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-islamic-green/10 flex items-center justify-center">
          <span className="text-6xl font-bold text-islamic-green">৪০৪</span>
        </div>
        
        <h1 className="text-3xl font-bold text-foreground mb-4">
          পৃষ্ঠা খুঁজে পাওয়া যায়নি
        </h1>
        
        <p className="text-muted-foreground mb-8">
          দুঃখিত, আপনি যে পৃষ্ঠাটি খুঁজছেন সেটি আর বিদ্যমান নেই বা সরানো হয়েছে।
        </p>
        
        <div className="space-y-3">
          <Link href="/">
            <Button className="w-full bg-islamic-green hover:bg-islamic-green/90">
              <Home className="w-4 h-4 mr-2" />
              হোম পেজে ফিরে যান
            </Button>
          </Link>
          
          <Link href="/search">
            <Button variant="outline" className="w-full">
              <Search className="w-4 h-4 mr-2" />
              হাদিস খুঁজুন
            </Button>
          </Link>
          
          <Button 
            variant="ghost" 
            onClick={() => window.history.back()}
            className="w-full"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            পূর্ববর্তী পৃষ্ঠায় ফিরে যান
          </Button>
        </div>
        
        <div className="mt-8 text-sm text-muted-foreground">
          <p>সাহায্যের প্রয়োজন হলে আমাদের সাথে যোগাযোগ করুন।</p>
        </div>
      </div>
    </div>
  )
}
