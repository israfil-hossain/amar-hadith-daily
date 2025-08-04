'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/providers/AuthProvider'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'
import { Loader2, Heart, ArrowLeft, Filter } from 'lucide-react'
import { HadithCard } from '@/components/HadithCard'
import { markHadithAsRead, toggleHadithFavorite, supabase } from '@/lib/supabase'
import { Hadith } from '@/types/database'

export default function FavoritesPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  
  const [favoriteHadith, setFavoriteHadith] = useState<(Hadith & { isRead: boolean; isFavorited: boolean })[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState<string>('favorited_at')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [categories, setCategories] = useState<any[]>([])

  useEffect(() => {
    if (!user) {
      router.push('/auth/login?redirectTo=/favorites')
      return
    }

    loadFavorites()
    loadCategories()
  }, [user?.id, sortBy, categoryFilter]) // Fixed: use user.id instead of full user object

  const loadCategories = async () => {
    try {
      const { data } = await supabase
        .from('hadith_categories')
        .select('id, name_bangla')
        .eq('is_active', true)
        .order('name_bangla')

      setCategories(data || [])
    } catch (error) {
      console.error('Error loading categories:', error)
    }
  }

  const loadFavorites = async () => {
    if (!user) return

    try {
      setLoading(true)

      let query = supabase
        .from('user_hadith_interactions')
        .select(`
          *,
          hadith:hadith!inner(
            *,
            book:hadith_books(*),
            category:hadith_categories(*)
          )
        `)
        .eq('user_id', user.id)
        .eq('is_favorited', true)

      if (categoryFilter !== 'all') {
        query = query.eq('hadith.category_id', categoryFilter)
      }

      if (sortBy === 'favorited_at') {
        query = query.order('favorited_at', { ascending: false })
      } else if (sortBy === 'hadith_created') {
        query = query.order('hadith(created_at)', { ascending: false })
      }

      const { data, error } = await query

      if (error) {
        toast({
          title: 'ত্রুটি',
          description: 'পছন্দের হাদিস লোড করতে সমস্যা হয়েছে',
          variant: 'destructive',
        })
        return
      }

      if (data) {
        const hadithWithInteractions = data.map(interaction => ({
          ...interaction.hadith,
          isRead: interaction.is_read || false,
          isFavorited: true,
        }))
        setFavoriteHadith(hadithWithInteractions)
      }
    } catch (error) {
      console.error('Error loading favorites:', error)
    } finally {
      setLoading(false)
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
      setFavoriteHadith(prev => 
        prev.map(hadith => 
          hadith.id === hadithId 
            ? { ...hadith, isRead: true }
            : hadith
        )
      )

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
      const { error } = await toggleHadithFavorite(user.id, hadithId, false)
      
      if (error) {
        toast({
          title: 'ত্রুটি',
          description: 'পছন্দের তালিকা আপডেট করতে সমস্যা হয়েছে',
          variant: 'destructive',
        })
        return
      }

      // Remove from local state
      setFavoriteHadith(prev => prev.filter(hadith => hadith.id !== hadithId))

      toast({
        title: 'পছন্দের তালিকা থেকে সরানো হয়েছে',
        description: 'হাদিসটি আপনার পছন্দের তালিকা থেকে সরানো হয়েছে',
      })
    } catch (error) {
      console.error('Error toggling favorite:', error)
    }
  }

  if (!user) {
    return null
  }

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
            href="/profile"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            প্রোফাইলে ফিরে যান
          </Link>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm mb-8">
            <CardHeader className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-3xl font-bold text-islamic-green">
                পছন্দের হাদিস
              </CardTitle>
              <CardDescription className="text-lg">
                আপনার সংরক্ষিত প্রিয় হাদিসগুলি ({favoriteHadith.length}টি)
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Filters */}
          {favoriteHadith.length > 0 && (
            <Card className="mb-8">
              <CardContent className="p-6">
                <div className="flex flex-wrap gap-4 items-center">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    <span className="text-sm font-medium">ফিল্টার:</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-sm">বিষয়:</span>
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">সব বিষয়</SelectItem>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name_bangla}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-sm">সাজান:</span>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="favorited_at">সর্বশেষ পছন্দ</SelectItem>
                        <SelectItem value="hadith_created">নতুন হাদিস</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Hadith List */}
          {favoriteHadith.length > 0 ? (
            <div className="space-y-6">
              {favoriteHadith.map((hadith) => (
                <HadithCard
                  key={hadith.id}
                  hadith={hadith}
                  onMarkAsRead={handleMarkAsRead}
                  onToggleFavorite={handleToggleFavorite}
                  showMarkAsRead={true}
                  showRating={true}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Heart className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-medium mb-2">কোনো পছন্দের হাদিস নেই</h3>
                <p className="text-muted-foreground mb-6">
                  আপনি এখনো কোনো হাদিস পছন্দের তালিকায় যোগ করেননি।<br />
                  হাদিস পড়ার সময় হার্ট আইকনে ক্লিক করে পছন্দের তালিকায় যোগ করুন।
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Link href="/categories">
                    <Button className="bg-gradient-to-r from-islamic-green to-primary">
                      বিষয়ভিত্তিক হাদিস দেখুন
                    </Button>
                  </Link>
                  <Link href="/search">
                    <Button variant="outline">
                      হাদিস অনুসন্ধান করুন
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
