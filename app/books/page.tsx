'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import { Loader2, Search, ArrowLeft, BookOpen } from 'lucide-react'
import { getHadithBooks, supabase } from '@/lib/supabase'
import { HadithBook } from '@/types/database'

export default function BooksPage() {
  const { toast } = useToast()
  const [books, setBooks] = useState<HadithBook[]>([])
  const [filteredBooks, setFilteredBooks] = useState<HadithBook[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [bookCounts, setBookCounts] = useState<Record<string, number>>({})

  useEffect(() => {
    loadBooks()
  }, [])

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredBooks(books)
    } else {
      const filtered = books.filter(book =>
        book.name_bangla.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.name_english?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.name_arabic?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author_bangla?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author_english?.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredBooks(filtered)
    }
  }, [searchQuery, books])

  const loadBooks = async () => {
    try {
      const { data, error } = await getHadithBooks()
      
      if (error) {
        toast({
          title: 'ত্রুটি',
          description: 'গ্রন্থের তালিকা লোড করতে সমস্যা হয়েছে',
          variant: 'destructive',
        })
        return
      }

      if (data) {
        setBooks(data)
        setFilteredBooks(data)
        
        // Load hadith counts for each book
        const counts: Record<string, number> = {}
        for (const book of data) {
          const { count } = await supabase
            .from('hadith')
            .select('*', { count: 'exact', head: true })
            .eq('book_id', book.id)
            .eq('status', 'verified')
          
          counts[book.id] = count || 0
        }
        setBookCounts(counts)
      }
    } catch (error) {
      console.error('Error loading books:', error)
    } finally {
      setLoading(false)
    }
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
            href="/"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            হোমে ফিরে যান
          </Link>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm mb-8">
            <CardHeader className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-islamic-green to-primary flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-primary-foreground" />
              </div>
              <CardTitle className="text-3xl font-bold text-islamic-green">
                হাদিস গ্রন্থসমূহ
              </CardTitle>
              <CardDescription className="text-lg">
                বিভিন্ন হাদিস গ্রন্থ অনুযায়ী হাদিস অধ্যয়ন করুন
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Search */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="গ্রন্থ বা লেখক অনুসন্ধান করুন..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Books Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBooks.map((book) => (
              <Link key={book.id} href={`/books/${book.id}`}>
                <Card className="h-full transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer group">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg group-hover:text-islamic-green transition-colors mb-2">
                          {book.name_bangla}
                        </h3>
                        {book.name_arabic && (
                          <p className="text-sm text-muted-foreground mb-1" dir="rtl">
                            {book.name_arabic}
                          </p>
                        )}
                        {book.name_english && (
                          <p className="text-sm text-muted-foreground mb-2">
                            {book.name_english}
                          </p>
                        )}
                      </div>
                      <Badge variant="secondary" className="bg-islamic-green/10 text-islamic-green">
                        {bookCounts[book.id] || 0} টি
                      </Badge>
                    </div>
                    
                    {/* Author Information */}
                    <div className="space-y-1 mb-4">
                      {book.author_bangla && (
                        <p className="text-sm">
                          <span className="font-medium">লেখক:</span> {book.author_bangla}
                        </p>
                      )}
                      {book.author_arabic && (
                        <p className="text-sm" dir="rtl">
                          <span className="font-medium">المؤلف:</span> {book.author_arabic}
                        </p>
                      )}
                      {book.author_english && (
                        <p className="text-sm">
                          <span className="font-medium">Author:</span> {book.author_english}
                        </p>
                      )}
                    </div>

                    {book.description && (
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {book.description}
                      </p>
                    )}

                    {/* Book Stats */}
                    <div className="mt-4 pt-4 border-t border-border/20">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>মোট হাদিস: {book.total_hadith || bookCounts[book.id] || 0}</span>
                        <span className={`px-2 py-1 rounded-full ${book.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {book.is_active ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {filteredBooks.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <Search className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">কোনো গ্রন্থ পাওয়া যায়নি</h3>
                <p className="text-muted-foreground">
                  অন্য কিছু অনুসন্ধান করে দেখুন
                </p>
              </CardContent>
            </Card>
          )}

          {/* Popular Books Section */}
          {searchQuery === '' && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-center mb-8 text-islamic-green">
                জনপ্রিয় হাদিস গ্রন্থ
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                  <CardContent className="p-6">
                    <h3 className="font-bold text-lg mb-2">সহীহ বুখারী ও মুসলিম</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      সবচেয়ে নির্ভরযোগ্য হাদিস গ্রন্থ দুটি। ইসলামী জ্ঞানের মূল ভিত্তি।
                    </p>
                    <div className="flex gap-2">
                      <Badge variant="secondary">সহীহ</Badge>
                      <Badge variant="secondary">নির্ভরযোগ্য</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
                  <CardContent className="p-6">
                    <h3 className="font-bold text-lg mb-2">সুনানে আরবাআ</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      তিরমিযী, আবু দাউদ, নাসাঈ ও ইবনে মাজাহ - চারটি গুরুত্বপূর্ণ সুনান গ্রন্থ।
                    </p>
                    <div className="flex gap-2">
                      <Badge variant="secondary">সুনান</Badge>
                      <Badge variant="secondary">ফিকহী</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
