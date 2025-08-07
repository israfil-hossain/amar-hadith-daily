import { Loader2 } from 'lucide-react'

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-warm-cream to-sage-green/20 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-islamic-green to-primary flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-primary-foreground animate-spin" />
        </div>
        <h2 className="text-xl font-semibold text-islamic-green mb-2">
          লোড হচ্ছে...
        </h2>
        <p className="text-sm text-muted-foreground">
          অনুগ্রহ করে অপেক্ষা করুন
        </p>
      </div>
    </div>
  )
}
