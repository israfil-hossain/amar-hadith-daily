'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/providers/AuthProvider'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { Loader2, Plus, BookOpen, ArrowLeft, CheckCircle, AlertCircle, Info, Star } from 'lucide-react'
import { supabase, getHadithBooks, getHadithCategories } from '@/lib/supabase'
import { HadithBook, HadithCategory } from '@/types/database'
import { Logo } from '@/components/ui/logo'

export default function ContributePage() {
  const { user, profile } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  
  const [loading, setLoading] = useState(false)
  // Fallback data if database is empty
  const fallbackBooks: HadithBook[] = [
    {
      id: 'fallback-book-1',
      name_bangla: 'সহীহ বুখারী',
      name_arabic: 'صحيح البخاري',
      author_bangla: 'ইমাম বুখারী',
      total_hadith: 7563,
      is_active: true,
      display_order: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'fallback-book-2',
      name_bangla: 'সহীহ মুসলিম',
      name_arabic: 'صحيح مسلم',
      author_bangla: 'ইমাম মুসলিম',
      total_hadith: 5362,
      is_active: true,
      display_order: 2,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ]

  const fallbackCategories: HadithCategory[] = [
    {
      id: 'fallback-cat-1',
      name_bangla: 'ইমান ও আকিদা',
      name_arabic: 'الإيمان والعقيدة',
      is_active: true,
      display_order: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'fallback-cat-2',
      name_bangla: 'নামাজ',
      name_arabic: 'الصلاة',
      is_active: true,
      display_order: 2,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'fallback-cat-3',
      name_bangla: 'যাকাত',
      name_arabic: 'الزكاة',
      is_active: true,
      display_order: 3,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'fallback-cat-4',
      name_bangla: 'রোজা',
      name_arabic: 'الصوم',
      is_active: true,
      display_order: 4,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'fallback-cat-5',
      name_bangla: 'হজ্জ',
      name_arabic: 'الحج',
      is_active: true,
      display_order: 5,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'fallback-cat-6',
      name_bangla: 'আখলাক ও আদব',
      name_arabic: 'الأخلاق والآداب',
      is_active: true,
      display_order: 6,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ]

  const [books, setBooks] = useState<HadithBook[]>(fallbackBooks)
  const [categories, setCategories] = useState<HadithCategory[]>(fallbackCategories)
  
  const [formData, setFormData] = useState({
    hadith_number: '',
    book_id: '',
    category_id: '',
    chapter_bangla: '',
    chapter_arabic: '',
    text_arabic: '',
    text_bangla: '',
    text_english: '',
    narrator: '',
    grade: '',
    reference: '',
    explanation: '',
    difficulty_level: 'beginner' as const,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [step, setStep] = useState(1)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const totalSteps = 3

  useEffect(() => {
    if (!user) {
      router.push('/auth/login?redirectTo=/contribute')
      return
    }

    const loadData = async () => {
      try {
        console.log('Loading books and categories...')
        const [booksResult, categoriesResult] = await Promise.all([
          getHadithBooks(),
          getHadithCategories()
        ])

        console.log('Books result:', booksResult)
        console.log('Categories result:', categoriesResult)

        if (booksResult.data) {
          setBooks(booksResult.data)
          console.log('Books loaded:', booksResult.data.length)
        } else {
          console.error('No books data:', booksResult.error)
          // Try direct query
          const { data: directBooks, error: directBooksError } = await supabase
            .from('hadith_books')
            .select('*')
          console.log('Direct books query:', directBooks, directBooksError)
        }

        if (categoriesResult.data) {
          setCategories(categoriesResult.data)
          console.log('Categories loaded:', categoriesResult.data.length)
        } else {
          console.error('No categories data:', categoriesResult.error)
          // Try direct query
          const { data: directCategories, error: directCategoriesError } = await supabase
            .from('hadith_categories')
            .select('*')
          console.log('Direct categories query:', directCategories, directCategoriesError)

          // If no categories, try to create some sample data
          if (!directCategories || directCategories.length === 0) {
            await createSampleData()
          } else {
            setCategories(directCategories)
          }
        }
      } catch (error) {
        console.error('Error loading data:', error)
      }
    }

    const createSampleData = async () => {
      try {
        console.log('Creating sample books and categories...')

        // Create sample books
        const { data: booksData, error: booksError } = await supabase
          .from('hadith_books')
          .insert([
            {
              name_bangla: 'সহীহ বুখারী',
              name_arabic: 'صحيح البخاري',
              author_bangla: 'ইমাম বুখারী',
              total_hadith: 7563,
              is_active: true,
              display_order: 1
            },
            {
              name_bangla: 'সহীহ মুসলিম',
              name_arabic: 'صحيح مسلم',
              author_bangla: 'ইমাম মুসলিম',
              total_hadith: 5362,
              is_active: true,
              display_order: 2
            },
            {
              name_bangla: 'সুনানে তিরমিযী',
              name_arabic: 'سنن الترمذي',
              author_bangla: 'ইমাম তিরমিযী',
              total_hadith: 3956,
              is_active: true,
              display_order: 3
            }
          ])
          .select()

        // Create sample categories
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('hadith_categories')
          .insert([
            {
              name_bangla: 'ইমান ও আকিদা',
              name_arabic: 'الإيمان والعقيدة',
              is_active: true,
              display_order: 1
            },
            {
              name_bangla: 'নামাজ',
              name_arabic: 'الصلاة',
              is_active: true,
              display_order: 2
            },
            {
              name_bangla: 'যাকাত',
              name_arabic: 'الزكاة',
              is_active: true,
              display_order: 3
            },
            {
              name_bangla: 'রোজা',
              name_arabic: 'الصوم',
              is_active: true,
              display_order: 4
            },
            {
              name_bangla: 'হজ্জ',
              name_arabic: 'الحج',
              is_active: true,
              display_order: 5
            },
            {
              name_bangla: 'আখলাক ও আদব',
              name_arabic: 'الأخلاق والآداب',
              is_active: true,
              display_order: 6
            }
          ])
          .select()

        if (booksData) {
          setBooks(booksData)
          console.log('Sample books created:', booksData.length)
        }

        if (categoriesData) {
          setCategories(categoriesData)
          console.log('Sample categories created:', categoriesData.length)
        }

        if (booksError) console.error('Books creation error:', booksError)
        if (categoriesError) console.error('Categories creation error:', categoriesError)

      } catch (error) {
        console.error('Error creating sample data:', error)
      }
    }

    loadData()
  }, [user, router])

  const validateStep = (stepNumber: number): boolean => {
    const newErrors: Record<string, string> = {}

    if (stepNumber === 1) {
      if (!formData.hadith_number.trim()) {
        newErrors.hadith_number = 'হাদিস নম্বর আবশ্যক'
      }
      if (!formData.book_id) {
        newErrors.book_id = 'গ্রন্থ নির্বাচন আবশ্যক'
      }
      if (!formData.category_id) {
        newErrors.category_id = 'বিভাগ নির্বাচন আবশ্যক'
      }
      if (!formData.chapter_bangla.trim()) {
        newErrors.chapter_bangla = 'অধ্যায়ের বাংলা নাম আবশ্যক'
      }
    }

    if (stepNumber === 2) {
      if (!formData.text_arabic.trim()) {
        newErrors.text_arabic = 'আরবি হাদিস আবশ্যক'
      }
      if (!formData.text_bangla.trim()) {
        newErrors.text_bangla = 'বাংলা অনুবাদ আবশ্যক'
      }
      if (!formData.narrator.trim()) {
        newErrors.narrator = 'বর্ণনাকারী আবশ্যক'
      }
    }

    if (stepNumber === 3) {
      if (!formData.grade.trim()) {
        newErrors.grade = 'হাদিসের গ্রেড আবশ্যক'
      }
      if (!formData.reference.trim()) {
        newErrors.reference = 'রেফারেন্স আবশ্যক'
      }
      if (!formData.explanation.trim()) {
        newErrors.explanation = 'ব্যাখ্যা আবশ্যক'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(prev => Math.min(prev + 1, totalSteps))
    }
  }

  const prevStep = () => {
    setStep(prev => Math.max(prev - 1, 1))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) return

    // Validate all steps
    if (!validateStep(1) || !validateStep(2) || !validateStep(3)) {
      toast({
        title: 'ত্রুটি',
        description: 'সকল আবশ্যক ক্ষেত্র পূরণ করুন',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)

    try {
      const { error } = await supabase
        .from('hadith_contributions')
        .insert({
          contributor_id: user.id,
          hadith_data: formData,
          status: 'pending'
        })

      if (error) {
        toast({
          title: 'ত্রুটি',
          description: 'হাদিস জমা দিতে সমস্যা হয়েছে',
          variant: 'destructive',
        })
        return
      }

      // Update user contribution count
      await supabase
        .from('profiles')
        .update({ total_contributions: (profile?.total_contributions || 0) + 1 })
        .eq('id', user.id)

      toast({
        title: 'সফলভাবে জমা দেওয়া হয়েছে',
        description: 'আপনার হাদিস অবদান যাচাইয়ের জন্য পাঠানো হয়েছে',
      })

      // Show success state
      setIsSubmitted(true)

    } catch (error) {
      console.error('Error submitting contribution:', error)
      toast({
        title: 'ত্রুটি',
        description: 'আবার চেষ্টা করুন',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-warm-cream to-sage-green/20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">লগইন প্রয়োজন</h2>
          <p className="text-muted-foreground mb-6">হাদিস অবদান করতে অনুগ্রহ করে লগইন করুন</p>
          <Button asChild>
            <Link href="/auth/login">লগইন করুন</Link>
          </Button>
        </div>
      </div>
    )
  }

  // Success state
  if (isSubmitted) {
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

          <div className="max-w-2xl mx-auto">
            <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm text-center">
              <CardHeader>
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                  <CheckCircle className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-green-600">
                  অবদান সফলভাবে জমা দেওয়া হয়েছে!
                </CardTitle>
                <CardDescription className="text-base">
                  জাজাকাল্লাহু খাইরান! আপনার হাদিস অবদান আমাদের কাছে পৌঁছেছে।
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h3 className="font-semibold text-green-800 mb-2">পরবর্তী ধাপ:</h3>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• আমাদের বিশেষজ্ঞ দল আপনার অবদান যাচাই করবেন</li>
                    <li>• যাচাই সম্পন্ন হলে আপনাকে জানানো হবে</li>
                    <li>• অনুমোদিত হলে হাদিসটি সাইটে প্রকাশিত হবে</li>
                  </ul>
                </div>

                <div className="flex gap-4 justify-center">
                  <Button
                    onClick={() => {
                      setIsSubmitted(false)
                      setFormData({
                        hadith_number: '',
                        book_id: '',
                        category_id: '',
                        chapter_bangla: '',
                        chapter_arabic: '',
                        text_arabic: '',
                        text_bangla: '',
                        text_english: '',
                        narrator: '',
                        grade: '',
                        reference: '',
                        explanation: '',
                        difficulty_level: 'beginner',
                      })
                      setStep(1)
                      setErrors({})
                    }}
                    variant="outline"
                  >
                    আরেকটি হাদিস যোগ করুন
                  </Button>
                  <Button asChild className="bg-islamic-green hover:bg-islamic-green/90">
                    <Link href="/">হোমে ফিরে যান</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
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

        <div className="max-w-4xl mx-auto">
          <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-islamic-green to-primary flex items-center justify-center">
                <Logo size="lg" variant="white" />
              </div>
              <CardTitle className="text-2xl font-bold text-islamic-green">
                হাদিস অবদান করুন
              </CardTitle>
              <CardDescription>
                কমিউনিটির জন্য নতুন হাদিস যোগ করুন। আপনার অবদান যাচাই করার পর প্রকাশিত হবে।
              </CardDescription>

              {/* Guidelines */}
              <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start gap-2">
                  <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-2">অবদানের নির্দেশনা:</p>
                    <ul className="space-y-1 text-xs">
                      <li>• শুধুমাত্র সহীহ ও বিশ্বস্ত সূত্র থেকে হাদিস জমা দিন</li>
                      <li>• আরবি টেক্সট সঠিক ও নির্ভুল হতে হবে</li>
                      <li>• বাংলা অনুবাদ সহজ ও বোধগম্য হতে হবে</li>
                      <li>• রেফারেন্স অবশ্যই উল্লেখ করুন</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Progress Indicator */}
              <div className="mt-6">
                <div className="flex items-center justify-center space-x-4">
                  {[1, 2, 3].map((stepNumber) => (
                    <div key={stepNumber} className="flex items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                        step >= stepNumber
                          ? 'bg-islamic-green text-white'
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {step > stepNumber ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : (
                          stepNumber
                        )}
                      </div>
                      {stepNumber < 3 && (
                        <div className={`w-16 h-1 mx-2 ${
                          step > stepNumber ? 'bg-islamic-green' : 'bg-muted'
                        }`} />
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex justify-center mt-4">
                  <div className="text-center">
                    <p className="text-sm font-medium text-islamic-green">
                      ধাপ {step} / {totalSteps}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {step === 1 && 'মৌলিক তথ্য'}
                      {step === 2 && 'হাদিসের মূল বিষয়বস্তু'}
                      {step === 3 && 'অতিরিক্ত তথ্য ও ব্যাখ্যা'}
                    </p>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Step 1: Basic Information */}
                {step === 1 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Info className="w-5 h-5 text-islamic-green" />
                      <h3 className="text-lg font-semibold text-islamic-green">মৌলিক তথ্য</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="book_id">হাদিস গ্রন্থ * ({books.length} টি উপলব্ধ)</Label>
                        <Select value={formData.book_id} onValueChange={(value) => setFormData(prev => ({ ...prev, book_id: value }))}>
                          <SelectTrigger className={errors.book_id ? 'border-red-500' : ''}>
                            <SelectValue placeholder={books.length > 0 ? "গ্রন্থ নির্বাচন করুন" : "গ্রন্থ লোড হচ্ছে..."} />
                          </SelectTrigger>
                          <SelectContent>
                            {books.length === 0 ? (
                              <SelectItem value="loading" disabled>
                                গ্রন্থ লোড হচ্ছে...
                              </SelectItem>
                            ) : (
                              books.map((book) => (
                                <SelectItem key={book.id} value={book.id}>
                                  {book.name_bangla}
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                        {errors.book_id && (
                          <p className="text-sm text-red-500 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {errors.book_id}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="category_id">বিষয় * ({categories.length} টি উপলব্ধ)</Label>
                        <Select value={formData.category_id} onValueChange={(value) => setFormData(prev => ({ ...prev, category_id: value }))}>
                          <SelectTrigger className={errors.category_id ? 'border-red-500' : ''}>
                            <SelectValue placeholder={categories.length > 0 ? "বিষয় নির্বাচন করুন" : "বিষয় লোড হচ্ছে..."} />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.length === 0 ? (
                              <SelectItem value="loading" disabled>
                                বিষয় লোড হচ্ছে...
                              </SelectItem>
                            ) : (
                              categories.map((category) => (
                                <SelectItem key={category.id} value={category.id}>
                                  {category.name_bangla}
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                        {errors.category_id && (
                          <p className="text-sm text-red-500 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {errors.category_id}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="hadith_number">হাদিস নম্বর *</Label>
                        <Input
                          id="hadith_number"
                          value={formData.hadith_number}
                          onChange={(e) => setFormData(prev => ({ ...prev, hadith_number: e.target.value }))}
                          placeholder="যেমন: ১, ২৫০৮"
                          className={errors.hadith_number ? 'border-red-500' : ''}
                        />
                        {errors.hadith_number && (
                          <p className="text-sm text-red-500 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {errors.hadith_number}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="chapter_bangla">অধ্যায় (বাংলা) *</Label>
                        <Input
                          id="chapter_bangla"
                          value={formData.chapter_bangla}
                          onChange={(e) => setFormData(prev => ({ ...prev, chapter_bangla: e.target.value }))}
                          placeholder="যেমন: ঈমান, নামাজ"
                          className={errors.chapter_bangla ? 'border-red-500' : ''}
                        />
                        {errors.chapter_bangla && (
                          <p className="text-sm text-red-500 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {errors.chapter_bangla}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="chapter_arabic">অধ্যায় (আরবি)</Label>
                      <Input
                        id="chapter_arabic"
                        value={formData.chapter_arabic}
                        onChange={(e) => setFormData(prev => ({ ...prev, chapter_arabic: e.target.value }))}
                        placeholder="باب الإيمان"
                        dir="rtl"
                      />
                    </div>

                    <div className="flex justify-end">
                      <Button type="button" onClick={nextStep} className="bg-islamic-green hover:bg-islamic-green/90">
                        পরবর্তী ধাপ
                      </Button>
                    </div>
                  </div>
                )}

                {/* Step 2: Hadith Content */}
                {step === 2 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-4">
                      <BookOpen className="w-5 h-5 text-islamic-green" />
                      <h3 className="text-lg font-semibold text-islamic-green">হাদিসের মূল বিষয়বস্তু</h3>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="text_arabic">হাদিস (আরবি) *</Label>
                      <Textarea
                        id="text_arabic"
                        value={formData.text_arabic}
                        onChange={(e) => setFormData(prev => ({ ...prev, text_arabic: e.target.value }))}
                        placeholder="আরবি হাদিসের মূল টেক্সট লিখুন"
                        dir="rtl"
                        rows={4}
                        className={errors.text_arabic ? 'border-destructive' : ''}
                      />
                      {errors.text_arabic && (
                        <p className="text-sm text-destructive">{errors.text_arabic}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="text_bangla">হাদিস (বাংলা) *</Label>
                      <Textarea
                        id="text_bangla"
                        value={formData.text_bangla}
                        onChange={(e) => setFormData(prev => ({ ...prev, text_bangla: e.target.value }))}
                        placeholder="বাংলা অনুবাদ লিখুন"
                        rows={4}
                        className={errors.text_bangla ? 'border-destructive' : ''}
                      />
                      {errors.text_bangla && (
                        <p className="text-sm text-destructive">{errors.text_bangla}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="text_english">হাদিস (ইংরেজি)</Label>
                      <Textarea
                        id="text_english"
                        value={formData.text_english}
                        onChange={(e) => setFormData(prev => ({ ...prev, text_english: e.target.value }))}
                        placeholder="English translation (optional)"
                        rows={4}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="narrator">বর্ণনাকারী *</Label>
                      <Input
                        id="narrator"
                        value={formData.narrator}
                        onChange={(e) => setFormData(prev => ({ ...prev, narrator: e.target.value }))}
                        placeholder="যেমন: আবু হুরায়রা (রা.)"
                        className={errors.narrator ? 'border-destructive' : ''}
                      />
                      {errors.narrator && (
                        <p className="text-sm text-destructive">{errors.narrator}</p>
                      )}
                    </div>

                    <div className="flex justify-between">
                      <Button type="button" variant="outline" onClick={prevStep}>
                        পূর্ববর্তী ধাপ
                      </Button>
                      <Button type="button" onClick={nextStep} className="bg-islamic-green hover:bg-islamic-green/90">
                        পরবর্তী ধাপ
                      </Button>
                    </div>
                  </div>
                )}

                {/* Step 3: Additional Information */}
                {step === 3 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Info className="w-5 h-5 text-islamic-green" />
                      <h3 className="text-lg font-semibold text-islamic-green">অতিরিক্ত তথ্য ও ব্যাখ্যা</h3>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="grade">হাদিসের গ্রেড *</Label>
                      <Select value={formData.grade} onValueChange={(value) => setFormData(prev => ({ ...prev, grade: value }))}>
                        <SelectTrigger className={errors.grade ? 'border-destructive' : ''}>
                          <SelectValue placeholder="হাদিসের গ্রেড নির্বাচন করুন" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sahih">সহীহ</SelectItem>
                          <SelectItem value="hasan">হাসান</SelectItem>
                          <SelectItem value="daif">দুর্বল</SelectItem>
                          <SelectItem value="maudu">জাল</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.grade && (
                        <p className="text-sm text-destructive">{errors.grade}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="reference">রেফারেন্স *</Label>
                      <Input
                        id="reference"
                        value={formData.reference}
                        onChange={(e) => setFormData(prev => ({ ...prev, reference: e.target.value }))}
                        placeholder="যেমন: সহীহ বুখারী, হাদিস নং ১"
                        className={errors.reference ? 'border-destructive' : ''}
                      />
                      {errors.reference && (
                        <p className="text-sm text-destructive">{errors.reference}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="explanation">ব্যাখ্যা *</Label>
                      <Textarea
                        id="explanation"
                        value={formData.explanation}
                        onChange={(e) => setFormData(prev => ({ ...prev, explanation: e.target.value }))}
                        placeholder="হাদিসের সংক্ষিপ্ত ব্যাখ্যা লিখুন"
                        rows={4}
                        className={errors.explanation ? 'border-destructive' : ''}
                      />
                      {errors.explanation && (
                        <p className="text-sm text-destructive">{errors.explanation}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="difficulty_level">অসুবিধা স্তর</Label>
                      <Select value={formData.difficulty_level} onValueChange={(value: any) => setFormData(prev => ({ ...prev, difficulty_level: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">নতুন</SelectItem>
                          <SelectItem value="intermediate">মধ্যম</SelectItem>
                          <SelectItem value="advanced">উন্নত</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex justify-between">
                      <Button type="button" variant="outline" onClick={prevStep}>
                        পূর্ববর্তী ধাপ
                      </Button>
                    </div>
                  </div>
                )}

                {/* Submit Button - Only show on step 3 */}
                {step === 3 && (
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-islamic-green to-primary hover:from-islamic-green/90 hover:to-primary/90"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        জমা দেওয়া হচ্ছে...
                      </>
                    ) : (
                      <>
                        <BookOpen className="mr-2 h-4 w-4" />
                        হাদিস জমা দিন
                      </>
                    )}
                  </Button>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
