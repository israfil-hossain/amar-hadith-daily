'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/providers/AuthProvider'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/components/ui/use-toast'
import { Loader2, User, Edit, Save, X, ArrowLeft, Trophy, BookOpen, Heart, Calendar, Target } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function ProfilePage() {
  const { user, profile, updateProfile } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState({
    totalRead: 0,
    currentStreak: 0,
    totalFavorites: 0,
    totalContributions: 0,
    level: 1,
    points: 0
  })
  
  const [formData, setFormData] = useState({
    full_name: '',
    username: '',
    bio: '',
    location: '',
    website: ''
  })

  useEffect(() => {
    if (!user) {
      router.push('/auth/login?redirectTo=/profile')
      return
    }

    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        username: profile.username || '',
        bio: profile.bio || '',
        location: profile.location || '',
        website: profile.website || ''
      })
      
      setStats({
        totalRead: profile.total_hadith_read,
        currentStreak: profile.streak_count,
        totalFavorites: 0, // Will be loaded separately
        totalContributions: profile.total_contributions,
        level: profile.level,
        points: profile.points
      })
      
      loadAdditionalStats()
    }
  }, [user?.id, profile?.id]) // Fixed: use user.id and profile.id instead of full objects

  const loadAdditionalStats = async () => {
    if (!user) return

    try {
      // Load favorites count
      const { count: favoritesCount } = await supabase
        .from('user_hadith_interactions')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('is_favorited', true)

      setStats(prev => ({
        ...prev,
        totalFavorites: favoritesCount || 0
      }))
    } catch (error) {
      console.error('Error loading additional stats:', error)
    }
  }

  const handleSave = async () => {
    if (!user) return

    setLoading(true)

    try {
      const { error } = await updateProfile(formData)
      
      if (error) {
        toast({
          title: 'ত্রুটি',
          description: 'প্রোফাইল আপডেট করতে সমস্যা হয়েছে',
          variant: 'destructive',
        })
        return
      }

      toast({
        title: 'সফল',
        description: 'আপনার প্রোফাইল আপডেট করা হয়েছে',
      })

      setEditing(false)
    } catch (error) {
      console.error('Error updating profile:', error)
      toast({
        title: 'ত্রুটি',
        description: 'আবার চেষ্টা করুন',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        username: profile.username || '',
        bio: profile.bio || '',
        location: profile.location || '',
        website: profile.website || ''
      })
    }
    setEditing(false)
  }

  const getLevelInfo = (level: number) => {
    const levels = [
      { name: 'নতুন শিক্ষার্থী', color: 'bg-gray-500', minPoints: 0 },
      { name: 'অনুসন্ধানী', color: 'bg-green-500', minPoints: 100 },
      { name: 'জ্ঞান অন্বেষী', color: 'bg-blue-500', minPoints: 500 },
      { name: 'হাদিস প্রেমী', color: 'bg-purple-500', minPoints: 1000 },
      { name: 'জ্ঞানী', color: 'bg-orange-500', minPoints: 2000 },
      { name: 'আলেম', color: 'bg-red-500', minPoints: 5000 },
    ]
    
    return levels[Math.min(level - 1, levels.length - 1)] || levels[0]
  }

  if (!user || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-warm-cream to-sage-green/20 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-islamic-green" />
          <p className="text-muted-foreground">লোড হচ্ছে...</p>
        </div>
      </div>
    )
  }

  const levelInfo = getLevelInfo(stats.level)

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
          {/* Profile Header */}
          <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm mb-8">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-islamic-green to-primary flex items-center justify-center">
                    <User className="w-10 h-10 text-primary-foreground" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl text-islamic-green">
                      {profile.full_name || 'ব্যবহারকারী'}
                    </CardTitle>
                    {profile.username && (
                      <p className="text-muted-foreground">@{profile.username}</p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <Badge className={`${levelInfo.color} text-white`}>
                        {levelInfo.name}
                      </Badge>
                      <Badge variant="outline">
                        লেভেল {stats.level}
                      </Badge>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={() => editing ? handleCancel() : setEditing(true)}
                  variant="outline"
                  size="sm"
                >
                  {editing ? (
                    <>
                      <X className="w-4 h-4 mr-2" />
                      বাতিল
                    </>
                  ) : (
                    <>
                      <Edit className="w-4 h-4 mr-2" />
                      সম্পাদনা
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Stats Cards */}
            <div className="lg:col-span-2 space-y-6">
              {/* Statistics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <BookOpen className="w-8 h-8 mx-auto mb-2 text-islamic-green" />
                    <p className="text-2xl font-bold">{stats.totalRead}</p>
                    <p className="text-sm text-muted-foreground">পঠিত হাদিস</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 text-center">
                    <Target className="w-8 h-8 mx-auto mb-2 text-orange-500" />
                    <p className="text-2xl font-bold">{stats.currentStreak}</p>
                    <p className="text-sm text-muted-foreground">দিনের ধারা</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 text-center">
                    <Heart className="w-8 h-8 mx-auto mb-2 text-red-500" />
                    <p className="text-2xl font-bold">{stats.totalFavorites}</p>
                    <p className="text-sm text-muted-foreground">পছন্দের হাদিস</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 text-center">
                    <Trophy className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
                    <p className="text-2xl font-bold">{stats.points}</p>
                    <p className="text-sm text-muted-foreground">পয়েন্ট</p>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>দ্রুত অ্যাক্সেস</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <Link href="/favorites">
                      <Button variant="outline" className="w-full">
                        <Heart className="w-4 h-4 mr-2" />
                        পছন্দের হাদিস
                      </Button>
                    </Link>
                    <Link href="/collections">
                      <Button variant="outline" className="w-full">
                        <BookOpen className="w-4 h-4 mr-2" />
                        আমার সংগ্রহ
                      </Button>
                    </Link>
                    <Link href="/progress">
                      <Button variant="outline" className="w-full">
                        <Calendar className="w-4 h-4 mr-2" />
                        অগ্রগতি দেখুন
                      </Button>
                    </Link>
                    <Link href="/contribute">
                      <Button variant="outline" className="w-full">
                        <Trophy className="w-4 h-4 mr-2" />
                        অবদান রাখুন
                      </Button>
                    </Link>
                    <Link href="/categories">
                      <Button variant="outline" className="w-full">
                        <BookOpen className="w-4 h-4 mr-2" />
                        বিষয়সমূহ
                      </Button>
                    </Link>
                    <Link href="/search">
                      <Button variant="outline" className="w-full">
                        <BookOpen className="w-4 h-4 mr-2" />
                        অনুসন্ধান
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Profile Details */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>ব্যক্তিগত তথ্য</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {editing ? (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="full_name">পূর্ণ নাম</Label>
                        <Input
                          id="full_name"
                          value={formData.full_name}
                          onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                          placeholder="আপনার পূর্ণ নাম"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="username">ব্যবহারকারীর নাম</Label>
                        <Input
                          id="username"
                          value={formData.username}
                          onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                          placeholder="ব্যবহারকারীর নাম"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bio">পরিচয়</Label>
                        <Textarea
                          id="bio"
                          value={formData.bio}
                          onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                          placeholder="আপনার সম্পর্কে কিছু লিখুন"
                          rows={3}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="location">অবস্থান</Label>
                        <Input
                          id="location"
                          value={formData.location}
                          onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                          placeholder="আপনার শহর/দেশ"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="website">ওয়েবসাইট</Label>
                        <Input
                          id="website"
                          value={formData.website}
                          onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                          placeholder="https://example.com"
                        />
                      </div>

                      <Button
                        onClick={handleSave}
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-islamic-green to-primary"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            সংরক্ষণ হচ্ছে...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4 mr-2" />
                            সংরক্ষণ করুন
                          </>
                        )}
                      </Button>
                    </>
                  ) : (
                    <>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">ইমেইল</Label>
                        <p className="mt-1">{profile.email}</p>
                      </div>

                      {profile.bio && (
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">পরিচয়</Label>
                          <p className="mt-1">{profile.bio}</p>
                        </div>
                      )}

                      {profile.location && (
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">অবস্থান</Label>
                          <p className="mt-1">{profile.location}</p>
                        </div>
                      )}

                      {profile.website && (
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">ওয়েবসাইট</Label>
                          <a 
                            href={profile.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="mt-1 text-islamic-green hover:underline block"
                          >
                            {profile.website}
                          </a>
                        </div>
                      )}

                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">যোগদানের তারিখ</Label>
                        <p className="mt-1">
                          {new Date(profile.created_at).toLocaleDateString('bn-BD')}
                        </p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
