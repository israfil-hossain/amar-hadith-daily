'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/providers/AuthProvider'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/components/ui/use-toast'
import { Loader2, ArrowLeft, BookOpen, Search, Filter, Eye, Heart, Check } from 'lucide-react'
import { HadithCard } from '@/components/HadithCard'
import { supabase } from '@/lib/supabase'
import { Hadith, HadithBook, HadithCategory } from '@/types/database'

export default function AllHadithPage() {
  const { user, profile } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  
  const [loading, setLoading] = useState(true)
  const [hadithList, setHadithList] = useState<Hadith[]>([])
  const [filteredHadith, setFilteredHadith] = useState<Hadith[]>([])
  const [books, setBooks] = useState<HadithBook[]>([])
  const [categories, setCategories] = useState<HadithCategory[]>([])
  const [userInteractions, setUserInteractions] = useState<any[]>([])
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedBook, setSelectedBook] = useState<string>('all')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [showReadOnly, setShowReadOnly] = useState(false)
  const [showUnreadOnly, setShowUnreadOnly] = useState(false)
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(20)

  useEffect(() => {
    if (!user) {
      router.push('/auth/login?redirectTo=/hadith')
      return
    }

    loadData()
  }, [user, router])

  useEffect(() => {
    filterHadith()
  }, [hadithList, searchTerm, selectedBook, selectedCategory, showReadOnly, showUnreadOnly, userInteractions])

  const loadData = async () => {
    try {
      setLoading(true)

      // Load hadith with books and categories
      const { data: hadithData, error: hadithError } = await supabase
        .from('hadith')
        .select(`
          *,
          book:hadith_books(*),
          category:hadith_categories(*)
        `)
        .eq('status', 'verified')
        .order('created_at', { ascending: false })

      if (hadithError) {
        toast({
          title: 'ত্রুটি',
          description: 'হাদিস লোড করতে সমস্যা হয়েছে',
          variant: 'destructive',
        })
        return
      }

      // Load books and categories for filters
      const [booksResult, categoriesResult] = await Promise.all([
        supabase.from('hadith_books').select('*').eq('is_active', true),
        supabase.from('hadith_categories').select('*').eq('is_active', true)
      ])

      // Load user interactions if authenticated
      if (user) {
        const { data: interactionsData } = await supabase
          .from('user_hadith_interactions')
          .select('*')
          .eq('user_id', user.id)

        setUserInteractions(interactionsData || [])
      }

      setHadithList(hadithData || [])
      setBooks(booksResult.data || [])
      setCategories(categoriesResult.data || [])

    } catch (error) {
      console.error('Error loading data:', error)
      toast({
        title: 'ত্রুটি',
        description: 'ডেটা লোড করতে সমস্যা হয়েছে',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const filterHadith = () => {
    let filtered = [...hadithList]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(hadith =>
        hadith.text_bangla?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hadith.text_arabic?.includes(searchTerm) ||
        hadith.narrator?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hadith.explanation?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Book filter
    if (selectedBook !== 'all') {
      filtered = filtered.filter(hadith => hadith.book_id === selectedBook)
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(hadith => hadith.category_id === selectedCategory)
    }

    // Read status filters
    if (showReadOnly) {
      filtered = filtered.filter(hadith =>
        userInteractions.some(interaction =>
          interaction.hadith_id === hadith.id && interaction.is_read
        )
      )
    }

    if (showUnreadOnly) {
      filtered = filtered.filter(hadith =>
        !userInteractions.some(interaction =>
          interaction.hadith_id === hadith.id && interaction.is_read
        )
      )
    }

    setFilteredHadith(filtered)
    setCurrentPage(1) // Reset to first page when filtering
  }

  const handleMarkAsRead = async (hadithId: string) => {
    if (!user) return

    try {
      const { error } = await supabase
        .from('user_hadith_interactions')
        .upsert({
          user_id: user.id,
          hadith_id: hadithId,
          is_read: true,
          read_at: new Date().toISOString()
        })

      if (error) {
        toast({
          title: 'ত্রুটি',
          description: 'পড়া হিসেবে চিহ্নিত করতে সমস্যা হয়েছে',
          variant: 'destructive',
        })
        return
      }

      // Update local state
      setUserInteractions(prev => {
        const existing = prev.find(i => i.hadith_id === hadithId)
        if (existing) {
          return prev.map(i =>
            i.hadith_id === hadithId ? { ...i, is_read: true } : i
          )
        } else {
          return [...prev, {
            user_id: user.id,
            hadith_id: hadithId,
            is_read: true,
            is_favorited: false
          }]
        }
      })

      toast({
        title: 'সফল',
        description: 'হাদিসটি পড়া হিসেবে চিহ্নিত করা হয়েছে',
      })
    } catch (error) {
      console.error('Error marking as read:', error)
    }
  }

  const handleToggleFavorite = async (hadithId: string) => {
    if (!user) return

    try {
      const existing = userInteractions.find(i => i.hadith_id === hadithId)
      const newFavoriteStatus = !existing?.is_favorited

      const { error } = await supabase
        .from('user_hadith_interactions')
        .upsert({
          user_id: user.id,
          hadith_id: hadithId,
          is_favorited: newFavoriteStatus,
          favorited_at: newFavoriteStatus ? new Date().toISOString() : null
        })

      if (error) {
        toast({
          title: 'ত্রুটি',
          description: 'পছন্দের তালিকায় যোগ করতে সমস্যা হয়েছে',
          variant: 'destructive',
        })
        return
      }

      // Update local state
      setUserInteractions(prev => {
        if (existing) {
          return prev.map(i =>
            i.hadith_id === hadithId ? { ...i, is_favorited: newFavoriteStatus } : i
          )
        } else {
          return [...prev, {
            user_id: user.id,
            hadith_id: hadithId,
            is_read: false,
            is_favorited: newFavoriteStatus
          }]
        }
      })

      toast({
        title: 'সফল',
        description: newFavoriteStatus ? 'পছন্দের তালিকায় যোগ করা হয়েছে' : 'পছন্দের তালিকা থেকে সরানো হয়েছে',
      })
    } catch (error) {
      console.error('Error toggling favorite:', error)
    }
  }

  // Pagination
  const totalPages = Math.ceil(filteredHadith.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentHadith = filteredHadith.slice(startIndex, endIndex)

  // Add interaction data to hadith
  const hadithWithInteractions = currentHadith.map(hadith => {
    const interaction = userInteractions.find(i => i.hadith_id === hadith.id)
    return {
      ...hadith,
      isRead: interaction?.is_read || false,
      isFavorited: interaction?.is_favorited || false
    }
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-warm-cream to-sage-green/20 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-islamic-green" />
          <p className="text-muted-foreground">হাদিস লোড হচ্ছে...</p>
        </div>
      </div>
    )
  }

  if (!user || !profile) {
    return null
  }

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

        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-islamic-green to-primary flex items-center justify-center">
              <BookOpen className="w-10 h-10 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold text-islamic-green mb-2">সকল হাদিস</h1>
            <p className="text-muted-foreground">আমাদের সংগ্রহের সব হাদিস এক জায়গায়</p>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-islamic-green" />
                ফিল্টার ও অনুসন্ধান
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">অনুসন্ধান</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="হাদিস খুঁজুন..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">গ্রন্থ</label>
                  <Select value={selectedBook} onValueChange={setSelectedBook}>
                    <SelectTrigger>
                      <SelectValue placeholder="গ্রন্থ নির্বাচন করুন" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">সব গ্রন্থ</SelectItem>
                      {books.map((book) => (
                        <SelectItem key={book.id} value={book.id}>
                          {book.name_bangla}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">বিষয়</label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="বিষয় নির্বাচন করুন" />
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

                <div className="space-y-2">
                  <label className="text-sm font-medium">পড়ার অবস্থা</label>
                  <div className="flex gap-2">
                    <Button
                      variant={showReadOnly ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        setShowReadOnly(!showReadOnly)
                        setShowUnreadOnly(false)
                      }}
                      className={showReadOnly ? "bg-islamic-green hover:bg-islamic-green/90" : ""}
                    >
                      <Check className="w-3 h-3 mr-1" />
                      পড়া
                    </Button>
                    <Button
                      variant={showUnreadOnly ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        setShowUnreadOnly(!showUnreadOnly)
                        setShowReadOnly(false)
                      }}
                      className={showUnreadOnly ? "bg-islamic-green hover:bg-islamic-green/90" : ""}
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      অপঠিত
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="text-sm text-muted-foreground">
                  মোট {filteredHadith.length}টি হাদিস পাওয়া গেছে
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchTerm('')
                    setSelectedBook('all')
                    setSelectedCategory('all')
                    setShowReadOnly(false)
                    setShowUnreadOnly(false)
                  }}
                >
                  ফিল্টার রিসেট করুন
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Hadith List */}
          <div className="space-y-6">
            {hadithWithInteractions.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                  <h3 className="text-lg font-semibold mb-2">কোনো হাদিস পাওয়া যায়নি</h3>
                  <p className="text-muted-foreground mb-4">
                    আপনার ফিল্টার অনুযায়ী কোনো হাদিস খুঁজে পাওয়া যায়নি
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchTerm('')
                      setSelectedBook('all')
                      setSelectedCategory('all')
                      setShowReadOnly(false)
                      setShowUnreadOnly(false)
                    }}
                  >
                    ফিল্টার রিসেট করুন
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <>
                {hadithWithInteractions.map((hadith) => (
                  <HadithCard
                    key={hadith.id}
                    hadith={hadith}
                    onMarkAsRead={handleMarkAsRead}
                    onToggleFavorite={handleToggleFavorite}
                    showMarkAsRead={true}
                    showRating={false}
                  />
                ))}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-8">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      পূর্ববর্তী
                    </Button>
                    
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const pageNum = currentPage <= 3 ? i + 1 : currentPage - 2 + i
                        if (pageNum > totalPages) return null
                        
                        return (
                          <Button
                            key={pageNum}
                            variant={currentPage === pageNum ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCurrentPage(pageNum)}
                            className={currentPage === pageNum ? "bg-islamic-green hover:bg-islamic-green/90" : ""}
                          >
                            {pageNum}
                          </Button>
                        )
                      })}
                    </div>
                    
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                    >
                      পরবর্তী
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
