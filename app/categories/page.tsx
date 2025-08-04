'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import { Loader2, Search, ArrowLeft, BookOpen } from 'lucide-react'
import { getHadithCategories, supabase } from '@/lib/supabase'
import { HadithCategory } from '@/types/database'

export default function CategoriesPage() {
  const { toast } = useToast()
  const [categories, setCategories] = useState<HadithCategory[]>([])
  const [filteredCategories, setFilteredCategories] = useState<HadithCategory[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({})

  useEffect(() => {
    loadCategories()
  }, [])

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredCategories(categories)
    } else {
      const filtered = categories.filter(category =>
        category.name_bangla.toLowerCase().includes(searchQuery.toLowerCase()) ||
        category.name_english?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        category.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredCategories(filtered)
    }
  }, [searchQuery, categories])

  const loadCategories = async () => {
    try {
      const { data, error } = await getHadithCategories()
      
      if (error) {
        toast({
          title: 'ত্রুটি',
          description: 'ক্যাটাগরি লোড করতে সমস্যা হয়েছে',
          variant: 'destructive',
        })
        return
      }

      if (data) {
        setCategories(data)
        setFilteredCategories(data)
        
        // Load hadith counts for each category
        const counts: Record<string, number> = {}
        for (const category of data) {
          const { count } = await supabase
            .from('hadith')
            .select('*', { count: 'exact', head: true })
            .eq('category_id', category.id)
            .eq('status', 'verified')
          
          counts[category.id] = count || 0
        }
        setCategoryCounts(counts)
      }
    } catch (error) {
      console.error('Error loading categories:', error)
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
                হাদিসের বিষয়সমূহ
              </CardTitle>
              <CardDescription className="text-lg">
                বিভিন্ন বিষয় অনুযায়ী হাদিস অধ্যয়ন করুন
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Search */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="বিষয় অনুসন্ধান করুন..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCategories.map((category) => (
              <Link key={category.id} href={`/categories/${category.id}`}>
                <Card className="h-full transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer group">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                          style={{ backgroundColor: category.color || '#10B981' }}
                        >
                          {category.icon || '📚'}
                        </div>
                        <div>
                          <h3 className="font-bold text-lg group-hover:text-islamic-green transition-colors">
                            {category.name_bangla}
                          </h3>
                          {category.name_english && (
                            <p className="text-sm text-muted-foreground">
                              {category.name_english}
                            </p>
                          )}
                        </div>
                      </div>
                      <Badge variant="secondary" className="bg-islamic-green/10 text-islamic-green">
                        {categoryCounts[category.id] || 0} টি
                      </Badge>
                    </div>
                    
                    {category.description && (
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {category.description}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {filteredCategories.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <Search className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">কোনো বিষয় পাওয়া যায়নি</h3>
                <p className="text-muted-foreground">
                  অন্য কিছু অনুসন্ধান করে দেখুন
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
