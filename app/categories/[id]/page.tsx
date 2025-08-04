'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/providers/AuthProvider'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'
import { Loader2, ArrowLeft, Filter, BookOpen } from 'lucide-react'
import { HadithCard } from '@/components/HadithCard'
import { getHadithByCategory, getUserHadithInteractions, markHadithAsRead, toggleHadithFavorite, supabase } from '@/lib/supabase'
import { Hadith, HadithCategory } from '@/types/database'

export default function CategoryPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  
  const categoryId = params.id as string
  const [category, setCategory] = useState<HadithCategory | null>(null)
  const [hadithList, setHadithList] = useState<Hadith[]>([])
  const [hadithInteractions, setHadithInteractions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(0)
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('created_at')

  const ITEMS_PER_PAGE = 10

  useEffect(() => {
    loadCategory()
    loadHadith(true)
  }, [categoryId, difficultyFilter, sortBy])

  useEffect(() => {
    if (user && hadithList.length > 0) {
      loadUserInteractions()
    }
  }, [user?.id, hadithList.length]) // Fixed: use user.id and hadithList.length instead of full objects

  const loadCategory = async () => {
    try {
      const { data, error } = await supabase
        .from('hadith_categories')
        .select('*')
        .eq('id', categoryId)
        .single()

      if (error || !data) {
        toast({
          title: 'ত্রুটি',
          description: 'বিষয়টি পাওয়া যায়নি',
          variant: 'destructive',
        })
        router.push('/categories')
        return
      }

      setCategory(data)
    } catch (error) {
      console.error('Error loading category:', error)
    }
  }

  const loadHadith = async (reset = false) => {
    try {
      if (reset) {
        setLoading(true)
        setPage(0)
      } else {
        setLoadingMore(true)
      }

      const currentPage = reset ? 0 : page
      const offset = currentPage * ITEMS_PER_PAGE

      let query = supabase
        .from('hadith')
        .select(`
          *,
          book:hadith_books(*),
          category:hadith_categories(*)
        `)
        .eq('category_id', categoryId)
        .eq('status', 'verified')
        .range(offset, offset + ITEMS_PER_PAGE - 1)

      if (difficultyFilter !== 'all') {
        query = query.eq('difficulty_level', difficultyFilter)
      }

      if (sortBy === 'created_at') {
        query = query.order('created_at', { ascending: false })
      } else if (sortBy === 'view_count') {
        query = query.order('view_count', { ascending: false })
      } else if (sortBy === 'like_count') {
        query = query.order('like_count', { ascending: false })
      }

      const { data, error } = await query

      if (error) {
        toast({
          title: 'ত্রুটি',
          description: 'হাদিস লোড করতে সমস্যা হয়েছে',
          variant: 'destructive',
        })
        return
      }

      if (data) {
        if (reset) {
          setHadithList(data)
        } else {
          setHadithList(prev => [...prev, ...data])
        }
        
        setHasMore(data.length === ITEMS_PER_PAGE)
        setPage(currentPage + 1)
      }
    } catch (error) {
      console.error('Error loading hadith:', error)
    } finally {
      setLoading(false)
      setLoadingMore(false)
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-warm-cream to-sage-green/20 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-islamic-green" />
          <p className="text-muted-foreground">লোড হচ্ছে...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-warm-cream to-sage-green/20">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link 
            href="/categories"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            বিষয়সমূহে ফিরে যান
          </Link>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Category Header */}
          {category && (
            <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm mb-8">
              <CardHeader className="text-center">
                <div className="flex items-center justify-center gap-4 mb-4">
                  <div 
                    className="w-16 h-16 rounded-full flex items-center justify-center text-3xl"
                    style={{ backgroundColor: category.color || '#10B981' }}
                  >
                    {category.icon || '📚'}
                  </div>
                  <div>
                    <CardTitle className="text-3xl font-bold text-islamic-green">
                      {category.name_bangla}
                    </CardTitle>
                    {category.name_english && (
                      <p className="text-lg text-muted-foreground">
                        {category.name_english}
                      </p>
                    )}
                  </div>
                </div>
                {category.description && (
                  <CardDescription className="text-lg">
                    {category.description}
                  </CardDescription>
                )}
              </CardHeader>
            </Card>
          )}

          {/* Filters */}
          <Card className="mb-8">
            <CardContent className="p-6">
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
                  <span className="text-sm">সাজান:</span>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="created_at">নতুন</SelectItem>
                      <SelectItem value="view_count">জনপ্রিয়</SelectItem>
                      <SelectItem value="like_count">পছন্দের</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Hadith List */}
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

          {/* Load More */}
          {hasMore && (
            <div className="text-center mt-8">
              <Button
                onClick={() => loadHadith(false)}
                disabled={loadingMore}
                variant="outline"
                className="px-8"
              >
                {loadingMore ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    লোড হচ্ছে...
                  </>
                ) : (
                  'আরো দেখুন'
                )}
              </Button>
            </div>
          )}

          {hadithWithInteractions.length === 0 && !loading && (
            <Card>
              <CardContent className="text-center py-12">
                <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">কোনো হাদিস পাওয়া যায়নি</h3>
                <p className="text-muted-foreground">
                  এই বিষয়ে এখনো কোনো হাদিস যোগ করা হয়নি
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
