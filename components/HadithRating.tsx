'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/providers/AuthProvider'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'
import { Star, MessageSquare, Users } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { HadithRating as HadithRatingType } from '@/types/database'

interface HadithRatingProps {
  hadithId: string
  onRatingUpdate?: () => void
}

export function HadithRating({ hadithId, onRatingUpdate }: HadithRatingProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  
  const [userRating, setUserRating] = useState<HadithRatingType | null>(null)
  const [averageRatings, setAverageRatings] = useState({
    translation_quality: 0,
    explanation_quality: 0,
    overall_rating: 0,
    total_ratings: 0
  })
  const [comment, setComment] = useState('')
  const [ratings, setRatings] = useState({
    translation_quality: 0,
    explanation_quality: 0,
    overall_rating: 0
  })
  const [loading, setLoading] = useState(false)
  const [showRatingForm, setShowRatingForm] = useState(false)

  useEffect(() => {
    loadRatings()
    if (user) {
      loadUserRating()
    }
  }, [hadithId, user])

  const loadRatings = async () => {
    try {
      const { data, error } = await supabase
        .from('hadith_ratings')
        .select('translation_quality, explanation_quality, overall_rating')
        .eq('hadith_id', hadithId)

      if (error) {
        console.error('Error loading ratings:', error)
        return
      }

      if (data && data.length > 0) {
        const avgTranslation = data.reduce((sum, r) => sum + (r.translation_quality || 0), 0) / data.length
        const avgExplanation = data.reduce((sum, r) => sum + (r.explanation_quality || 0), 0) / data.length
        const avgOverall = data.reduce((sum, r) => sum + (r.overall_rating || 0), 0) / data.length

        setAverageRatings({
          translation_quality: avgTranslation,
          explanation_quality: avgExplanation,
          overall_rating: avgOverall,
          total_ratings: data.length
        })
      }
    } catch (error) {
      console.error('Error loading ratings:', error)
    }
  }

  const loadUserRating = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('hadith_ratings')
        .select('*')
        .eq('hadith_id', hadithId)
        .eq('user_id', user.id)
        .single()

      if (data) {
        setUserRating(data)
        setRatings({
          translation_quality: data.translation_quality || 0,
          explanation_quality: data.explanation_quality || 0,
          overall_rating: data.overall_rating || 0
        })
        setComment(data.comment || '')
      }
    } catch (error) {
      // User hasn't rated yet, which is fine
    }
  }

  const handleSubmitRating = async () => {
    if (!user) {
      toast({
        title: 'লগইন প্রয়োজন',
        description: 'রেটিং দিতে লগইন করুন',
        variant: 'destructive',
      })
      return
    }

    if (ratings.overall_rating === 0) {
      toast({
        title: 'রেটিং প্রয়োজন',
        description: 'অন্তত সামগ্রিক রেটিং দিন',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)

    try {
      const { error } = await supabase
        .from('hadith_ratings')
        .upsert({
          user_id: user.id,
          hadith_id: hadithId,
          translation_quality: ratings.translation_quality || null,
          explanation_quality: ratings.explanation_quality || null,
          overall_rating: ratings.overall_rating,
          comment: comment.trim() || null
        })

      if (error) {
        toast({
          title: 'ত্রুটি',
          description: 'রেটিং সংরক্ষণ করতে সমস্যা হয়েছে',
          variant: 'destructive',
        })
        return
      }

      toast({
        title: 'ধন্যবাদ!',
        description: 'আপনার রেটিং সংরক্ষণ করা হয়েছে',
      })

      setShowRatingForm(false)
      loadRatings()
      loadUserRating()
      onRatingUpdate?.()

    } catch (error) {
      console.error('Error submitting rating:', error)
      toast({
        title: 'ত্রুটি',
        description: 'আবার চেষ্টা করুন',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const renderStars = (rating: number, onRate?: (rating: number) => void, readonly = false) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${
              star <= rating 
                ? 'fill-yellow-400 text-yellow-400' 
                : 'text-gray-300'
            } ${!readonly && onRate ? 'cursor-pointer hover:text-yellow-400' : ''}`}
            onClick={() => !readonly && onRate?.(star)}
          />
        ))}
      </div>
    )
  }

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Users className="w-5 h-5" />
          কমিউনিটি রেটিং
        </CardTitle>
        <CardDescription>
          এই হাদিসের অনুবাদ ও ব্যাখ্যার মান সম্পর্কে আপনার মতামত দিন
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Average Ratings Display */}
        {averageRatings.total_ratings > 0 && (
          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-medium mb-3">গড় রেটিং ({averageRatings.total_ratings} জন)</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">অনুবাদের মান:</span>
                <div className="flex items-center gap-2">
                  {renderStars(averageRatings.translation_quality, undefined, true)}
                  <span className="text-sm text-muted-foreground">
                    {averageRatings.translation_quality.toFixed(1)}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">ব্যাখ্যার মান:</span>
                <div className="flex items-center gap-2">
                  {renderStars(averageRatings.explanation_quality, undefined, true)}
                  <span className="text-sm text-muted-foreground">
                    {averageRatings.explanation_quality.toFixed(1)}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">সামগ্রিক:</span>
                <div className="flex items-center gap-2">
                  {renderStars(averageRatings.overall_rating, undefined, true)}
                  <span className="text-sm font-medium">
                    {averageRatings.overall_rating.toFixed(1)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* User Rating Section */}
        {user && (
          <div>
            {userRating && !showRatingForm ? (
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-green-800">আপনার রেটিং</h4>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowRatingForm(true)}
                  >
                    সম্পাদনা করুন
                  </Button>
                </div>
                <div className="space-y-1">
                  {userRating.translation_quality && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm">অনুবাদের মান:</span>
                      {renderStars(userRating.translation_quality, undefined, true)}
                    </div>
                  )}
                  {userRating.explanation_quality && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm">ব্যাখ্যার মান:</span>
                      {renderStars(userRating.explanation_quality, undefined, true)}
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">সামগ্রিক:</span>
                    {renderStars(userRating.overall_rating, undefined, true)}
                  </div>
                  {userRating.comment && (
                    <div className="mt-2">
                      <span className="text-sm font-medium">মন্তব্য:</span>
                      <p className="text-sm text-muted-foreground mt-1">{userRating.comment}</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <>
                {!showRatingForm ? (
                  <Button
                    onClick={() => setShowRatingForm(true)}
                    className="w-full"
                    variant="outline"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    রেটিং দিন
                  </Button>
                ) : (
                  <div className="space-y-4 border p-4 rounded-lg">
                    <div>
                      <Label className="text-sm font-medium">অনুবাদের মান (ঐচ্ছিক)</Label>
                      <div className="mt-1">
                        {renderStars(ratings.translation_quality, (rating) => 
                          setRatings(prev => ({ ...prev, translation_quality: rating }))
                        )}
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium">ব্যাখ্যার মান (ঐচ্ছিক)</Label>
                      <div className="mt-1">
                        {renderStars(ratings.explanation_quality, (rating) => 
                          setRatings(prev => ({ ...prev, explanation_quality: rating }))
                        )}
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium">সামগ্রিক রেটিং *</Label>
                      <div className="mt-1">
                        {renderStars(ratings.overall_rating, (rating) => 
                          setRatings(prev => ({ ...prev, overall_rating: rating }))
                        )}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="comment" className="text-sm font-medium">মন্তব্য (ঐচ্ছিক)</Label>
                      <Textarea
                        id="comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="আপনার মতামত লিখুন..."
                        className="mt-1"
                        rows={3}
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={handleSubmitRating}
                        disabled={loading}
                        className="flex-1"
                      >
                        {loading ? 'সংরক্ষণ হচ্ছে...' : 'রেটিং জমা দিন'}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setShowRatingForm(false)
                          if (userRating) {
                            setRatings({
                              translation_quality: userRating.translation_quality || 0,
                              explanation_quality: userRating.explanation_quality || 0,
                              overall_rating: userRating.overall_rating || 0
                            })
                            setComment(userRating.comment || '')
                          }
                        }}
                      >
                        বাতিল
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {!user && (
          <div className="text-center py-4">
            <p className="text-muted-foreground text-sm">
              রেটিং দিতে <a href="/auth/login" className="text-islamic-green hover:underline">লগইন করুন</a>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
