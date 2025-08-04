'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/providers/AuthProvider'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'
import { Loader2, Search, ArrowLeft, Filter } from 'lucide-react'
import { HadithCard } from '@/components/HadithCard'
import { searchHadith, getUserHadithInteractions, markHadithAsRead, toggleHadithFavorite } from '@/lib/supabase'
import { Hadith } from '@/types/database'

export default function SearchPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')
  const [hadithList, setHadithList] = useState<Hadith[]>([])
  const [hadithInteractions, setHadithInteractions] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all')
  const [languageFilter, setLanguageFilter] = useState<string>('all')

  useEffect(() => {
    const query = searchParams.get('q')
    if (query) {
      setSearchQuery(query)
      handleSearch(query)
    }
  }, [searchParams])

  useEffect(() => {
    if (user && hadithList.length > 0) {
      loadUserInteractions()
    }
  }, [user?.id, hadithList.length]) // Fixed: use user.id and hadithList.length instead of full objects

  const handleSearch = async (query?: string) => {
    const searchTerm = query || searchQuery
    if (!searchTerm.trim()) {
      toast({
        title: 'অনুসন্ধান শব্দ প্রয়োজন',
        description: 'অনুসন্ধানের জন্য কিছু লিখুন',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)
    setHasSearched(true)

    try {
      const { data, error } = await searchHadith(searchTerm, 50)
      
      if (error) {
        toast({
          title: 'ত্রুটি',
          description: 'অনুসন্ধানে সমস্যা হয়েছে',
          variant: 'destructive',
        })
        return
      }

      let filteredData = data || []

      // Apply filters
      if (difficultyFilter !== 'all') {
        filteredData = filteredData.filter(h => h.difficulty_level === difficultyFilter)
      }

      if (languageFilter === 'bangla') {
        filteredData = filteredData.filter(h => h.text_bangla)
      } else if (languageFilter === 'english') {
        filteredData = filteredData.filter(h => h.text_english)
      } else if (languageFilter === 'arabic') {
        filteredData = filteredData.filter(h => h.text_arabic)
      }

      setHadithList(filteredData)

      // Update URL
      const url = new URL(window.location.href)
      url.searchParams.set('q', searchTerm)
      router.replace(url.pathname + url.search)

    } catch (error) {
      console.error('Error searching hadith:', error)
      toast({
        title: 'ত্রুটি',
        description: 'আবার চেষ্টা করুন',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const loadUserInteractions = async () => {
    if (!user) return

    try {
      const hadithIds = hadithList.map(h => h.id)
      const { data } = await getUserHadithInteractions(user.id, hadithIds)
      setHadithInteractions(data || [])
    } catch (error) {
      console.error('Error loading user interactions:', error)
    }
  }

  const handleMarkAsRead = async (hadithId: string) => {
    if (!user) return

    try {
      const { error } = await markHadithAsRead(user.id, hadithId)
      
      if (error) {
        toast({
          title: 'ত্রুটি',
          description: 'হাদিস চিহ্নিত করতে সমস্যা হয়েছে',
          variant: 'destructive',
        })
        return
      }

      // Update local state
      setHadithInteractions(prev => {
        const existing = prev.find(i => i.hadith_id === hadithId)
        if (existing) {
          return prev.map(i => 
            i.hadith_id === hadithId 
              ? { ...i, is_read: true, read_at: new Date().toISOString() }
              : i
          )
        } else {
          return [...prev, {
            user_id: user.id,
            hadith_id: hadithId,
            is_read: true,
            read_at: new Date().toISOString()
          }]
        }
      })

      toast({
        title: 'হাদিস পঠিত হিসেবে চিহ্নিত',
        description: 'আল্লাহ আপনাকে উত্তম প্রতিদান দিন',
      })
    } catch (error) {
      console.error('Error marking hadith as read:', error)
    }
  }

  const handleToggleFavorite = async (hadithId: string) => {
    if (!user) return

    try {
      const currentInteraction = hadithInteractions.find(i => i.hadith_id === hadithId)
      const isFavorited = currentInteraction?.is_favorited || false
      
      const { error } = await toggleHadithFavorite(user.id, hadithId, !isFavorited)
      
      if (error) {
        toast({
          title: 'ত্রুটি',
          description: 'পছন্দের তালিকা আপডেট করতে সমস্যা হয়েছে',
          variant: 'destructive',
        })
        return
      }

      // Update local state
      setHadithInteractions(prev => {
        const existing = prev.find(i => i.hadith_id === hadithId)
        if (existing) {
          return prev.map(i => 
            i.hadith_id === hadithId 
              ? { ...i, is_favorited: !isFavorited, favorited_at: !isFavorited ? new Date().toISOString() : null }
              : i
          )
        } else {
          return [...prev, {
            user_id: user.id,
            hadith_id: hadithId,
            is_favorited: !isFavorited,
            favorited_at: !isFavorited ? new Date().toISOString() : null
          }]
        }
      })

      toast({
        title: !isFavorited ? 'পছন্দের তালিকায় যোগ করা হয়েছে' : 'পছন্দের তালিকা থেকে সরানো হয়েছে',
        description: !isFavorited ? 'হাদিসটি আপনার পছন্দের তালিকায় যোগ করা হয়েছে' : 'হাদিসটি পছন্দের তালিকা থেকে সরানো হয়েছে',
      })
    } catch (error) {
      console.error('Error toggling favorite:', error)
    }
  }

  // Merge hadith with user interactions
  const hadithWithInteractions = hadithList.map(hadith => {
    const interaction = hadithInteractions.find(i => i.hadith_id === hadith.id)
    return {
      ...hadith,
      isRead: interaction?.is_read || false,
      isFavorited: interaction?.is_favorited || false,
    }
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-warm-cream to-sage-green/20">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link 
            href="/"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            হোমে ফিরে যান
          </Link>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm mb-8">
            <CardHeader className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-islamic-green to-primary flex items-center justify-center">
                <Search className="w-8 h-8 text-primary-foreground" />
              </div>
              <CardTitle className="text-3xl font-bold text-islamic-green">
                হাদিস অনুসন্ধান
              </CardTitle>
              <CardDescription className="text-lg">
                আরবি, বাংলা বা ইংরেজিতে হাদিস খুঁজুন
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Search Form */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="হাদিস অনুসন্ধান করুন..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                      className="pl-10"
                    />
                  </div>
                  <Button 
                    onClick={() => handleSearch()}
                    disabled={loading}
                    className="bg-gradient-to-r from-islamic-green to-primary"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Search className="w-4 h-4" />
                    )}
                  </Button>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-4 items-center">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    <span className="text-sm font-medium">ফিল্টার:</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-sm">অসুবিধা:</span>
                    <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">সব</SelectItem>
                        <SelectItem value="beginner">নতুন</SelectItem>
                        <SelectItem value="intermediate">মধ্যম</SelectItem>
                        <SelectItem value="advanced">উন্নত</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-sm">ভাষা:</span>
                    <Select value={languageFilter} onValueChange={setLanguageFilter}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">সব</SelectItem>
                        <SelectItem value="bangla">বাংলা</SelectItem>
                        <SelectItem value="english">ইংরেজি</SelectItem>
                        <SelectItem value="arabic">আরবি</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {(difficultyFilter !== 'all' || languageFilter !== 'all') && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setDifficultyFilter('all')
                        setLanguageFilter('all')
                        if (searchQuery) handleSearch()
                      }}
                    >
                      ফিল্টার সাফ করুন
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          {loading && (
            <div className="text-center py-12">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-islamic-green" />
              <p className="text-muted-foreground">অনুসন্ধান করা হচ্ছে...</p>
            </div>
          )}

          {!loading && hasSearched && (
            <>
              {hadithWithInteractions.length > 0 ? (
                <>
                  <div className="mb-6">
                    <p className="text-muted-foreground">
                      "{searchQuery}" এর জন্য {hadithWithInteractions.length}টি ফলাফল পাওয়া গেছে
                    </p>
                  </div>
                  
                  <div className="space-y-6">
                    {hadithWithInteractions.map((hadith) => (
                      <HadithCard
                        key={hadith.id}
                        hadith={hadith}
                        onMarkAsRead={handleMarkAsRead}
                        onToggleFavorite={handleToggleFavorite}
                        showMarkAsRead={!!user}
                        showRating={true}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <Search className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-medium mb-2">কোনো ফলাফল পাওয়া যায়নি</h3>
                    <p className="text-muted-foreground mb-4">
                      "{searchQuery}" এর জন্য কোনো হাদিস পাওয়া যায়নি
                    </p>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>• অন্য শব্দ দিয়ে চেষ্টা করুন</p>
                      <p>• বানান ঠিক আছে কিনা দেখুন</p>
                      <p>• আরবি, বাংলা বা ইংরেজি যেকোনো ভাষায় অনুসন্ধান করতে পারেন</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}

          {!hasSearched && !loading && (
            <Card>
              <CardContent className="text-center py-12">
                <Search className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">হাদিস অনুসন্ধান করুন</h3>
                <p className="text-muted-foreground">
                  উপরের বক্সে আপনার পছন্দের বিষয় লিখে অনুসন্ধান করুন
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
