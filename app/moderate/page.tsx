'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/providers/AuthProvider'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'
import { Loader2, CheckCircle, XCircle, Clock, ArrowLeft } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { HadithContribution } from '@/types/database'
import Link from 'next/link'

export default function ModeratePage() {
  const { user, profile } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  
  const [loading, setLoading] = useState(true)
  const [contributions, setContributions] = useState<HadithContribution[]>([])
  const [selectedContribution, setSelectedContribution] = useState<HadithContribution | null>(null)
  const [reviewNotes, setReviewNotes] = useState('')
  const [reviewing, setReviewing] = useState(false)

  useEffect(() => {
    if (!user) {
      router.push('/auth/login?redirectTo=/moderate')
      return
    }

    if (!profile || !['moderator', 'admin', 'scholar'].includes(profile.role)) {
      router.push('/')
      return
    }

    loadContributions()
  }, [user, profile, router])

  const loadContributions = async () => {
    try {
      const { data, error } = await supabase
        .from('hadith_contributions')
        .select(`
          *,
          contributor:profiles!contributor_id(full_name, email),
          reviewer:profiles!reviewer_id(full_name, email)
        `)
        .order('created_at', { ascending: false })

      if (error) {
        toast({
          title: 'ত্রুটি',
          description: 'অবদানগুলি লোড করতে সমস্যা হয়েছে',
          variant: 'destructive',
        })
        return
      }

      setContributions(data || [])
    } catch (error) {
      console.error('Error loading contributions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleReview = async (contributionId: string, status: 'approved' | 'rejected') => {
    if (!user || !selectedContribution) return

    setReviewing(true)

    try {
      // Update contribution status
      const { error: updateError } = await supabase
        .from('hadith_contributions')
        .update({
          status,
          reviewer_id: user.id,
          review_notes: reviewNotes,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', contributionId)

      if (updateError) {
        toast({
          title: 'ত্রুটি',
          description: 'পর্যালোচনা সংরক্ষণ করতে সমস্যা হয়েছে',
          variant: 'destructive',
        })
        return
      }

      // If approved, add to main hadith table
      if (status === 'approved') {
        const { error: insertError } = await supabase
          .from('hadith')
          .insert({
            ...selectedContribution.hadith_data,
            contributed_by: selectedContribution.contributor_id,
            verified_by: user.id,
            status: 'verified'
          })

        if (insertError) {
          toast({
            title: 'ত্রুটি',
            description: 'হাদিস প্রকাশ করতে সমস্যা হয়েছে',
            variant: 'destructive',
          })
          return
        }
      }

      toast({
        title: status === 'approved' ? 'অনুমোদিত' : 'প্রত্যাখ্যাত',
        description: status === 'approved' 
          ? 'হাদিসটি সফলভাবে অনুমোদিত ও প্রকাশিত হয়েছে'
          : 'হাদিসটি প্রত্যাখ্যাত হয়েছে',
      })

      setSelectedContribution(null)
      setReviewNotes('')
      loadContributions()

    } catch (error) {
      console.error('Error reviewing contribution:', error)
      toast({
        title: 'ত্রুটি',
        description: 'আবার চেষ্টা করুন',
        variant: 'destructive',
      })
    } finally {
      setReviewing(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />অপেক্ষমাণ</Badge>
      case 'approved':
        return <Badge variant="secondary" className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />অনুমোদিত</Badge>
      case 'rejected':
        return <Badge variant="secondary" className="bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" />প্রত্যাখ্যাত</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  if (!user || !profile || !['moderator', 'admin', 'scholar'].includes(profile.role)) {
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
            href="/"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            হোমে ফিরে যান
          </Link>
        </div>

        <div className="max-w-6xl mx-auto">
          <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm mb-6">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-islamic-green">
                হাদিস অবদান পর্যালোচনা
              </CardTitle>
              <CardDescription>
                কমিউনিটির অবদানগুলি যাচাই ও অনুমোদন করুন
              </CardDescription>
            </CardHeader>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Contributions List */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">অবদানের তালিকা</h3>
              {contributions.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <p className="text-muted-foreground">কোনো অবদান পাওয়া যায়নি</p>
                  </CardContent>
                </Card>
              ) : (
                contributions.map((contribution) => (
                  <Card 
                    key={contribution.id} 
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedContribution?.id === contribution.id ? 'ring-2 ring-islamic-green' : ''
                    }`}
                    onClick={() => setSelectedContribution(contribution)}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium">{contribution.hadith_data.chapter_bangla}</p>
                          <p className="text-sm text-muted-foreground">
                            অবদানকারী: {contribution.contributor?.full_name || 'অজানা'}
                          </p>
                        </div>
                        {getStatusBadge(contribution.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {new Date(contribution.created_at).toLocaleDateString('bn-BD')}
                      </p>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            {/* Review Panel */}
            <div>
              <h3 className="text-lg font-semibold mb-4">পর্যালোচনা প্যানেল</h3>
              {selectedContribution ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{selectedContribution.hadith_data.chapter_bangla}</CardTitle>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(selectedContribution.status)}
                      <span className="text-sm text-muted-foreground">
                        {selectedContribution.contributor?.full_name}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">আরবি পাঠ:</Label>
                      <p className="text-right mt-1 p-2 bg-muted rounded" dir="rtl">
                        {selectedContribution.hadith_data.text_arabic}
                      </p>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium">বাংলা অনুবাদ:</Label>
                      <p className="mt-1 p-2 bg-muted rounded">
                        {selectedContribution.hadith_data.text_bangla}
                      </p>
                    </div>

                    {selectedContribution.hadith_data.text_english && (
                      <div>
                        <Label className="text-sm font-medium">ইংরেজি অনুবাদ:</Label>
                        <p className="mt-1 p-2 bg-muted rounded">
                          {selectedContribution.hadith_data.text_english}
                        </p>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <Label>বর্ণনাকারী:</Label>
                        <p>{selectedContribution.hadith_data.narrator || 'উল্লেখ নেই'}</p>
                      </div>
                      <div>
                        <Label>হাদিসের মান:</Label>
                        <p>{selectedContribution.hadith_data.grade || 'উল্লেখ নেই'}</p>
                      </div>
                    </div>

                    {selectedContribution.status === 'pending' && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="reviewNotes">পর্যালোচনার মন্তব্য</Label>
                          <Textarea
                            id="reviewNotes"
                            value={reviewNotes}
                            onChange={(e) => setReviewNotes(e.target.value)}
                            placeholder="পর্যালোচনার মন্তব্য লিখুন..."
                            className="min-h-[80px]"
                          />
                        </div>

                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleReview(selectedContribution.id, 'approved')}
                            disabled={reviewing}
                            className="flex-1 bg-green-600 hover:bg-green-700"
                          >
                            {reviewing ? (
                              <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            ) : (
                              <CheckCircle className="w-4 h-4 mr-2" />
                            )}
                            অনুমোদন করুন
                          </Button>
                          <Button
                            onClick={() => handleReview(selectedContribution.id, 'rejected')}
                            disabled={reviewing}
                            variant="destructive"
                            className="flex-1"
                          >
                            {reviewing ? (
                              <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            ) : (
                              <XCircle className="w-4 h-4 mr-2" />
                            )}
                            প্রত্যাখ্যান করুন
                          </Button>
                        </div>
                      </>
                    )}

                    {selectedContribution.review_notes && (
                      <div>
                        <Label className="text-sm font-medium">পর্যালোচকের মন্তব্য:</Label>
                        <p className="mt-1 p-2 bg-muted rounded text-sm">
                          {selectedContribution.review_notes}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          পর্যালোচক: {selectedContribution.reviewer?.full_name} • 
                          {selectedContribution.reviewed_at && new Date(selectedContribution.reviewed_at).toLocaleDateString('bn-BD')}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="text-center py-8">
                    <p className="text-muted-foreground">পর্যালোচনার জন্য একটি অবদান নির্বাচন করুন</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
