'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/providers/AuthProvider'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/components/ui/use-toast'
import { Loader2, ArrowLeft, Trophy, Star, Target, Award } from 'lucide-react'
import { AchievementCard } from '@/components/AchievementCard'
import { supabase } from '@/lib/supabase'
import { Achievement, UserAchievement } from '@/types/database'

export default function AchievementsPage() {
  const { user, profile } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  
  const [loading, setLoading] = useState(true)
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([])
  const [stats, setStats] = useState({
    totalAchievements: 0,
    unlockedAchievements: 0,
    totalPoints: 0,
    earnedPoints: 0
  })

  useEffect(() => {
    if (!user) {
      router.push('/auth/login?redirectTo=/achievements')
      return
    }

    loadAchievements()
  }, [user, router])

  const loadAchievements = async () => {
    try {
      setLoading(true)

      // Load all achievements
      const { data: achievementsData, error: achievementsError } = await supabase
        .from('achievements')
        .select('*')
        .eq('is_active', true)
        .order('points_reward', { ascending: true })

      if (achievementsError) {
        toast({
          title: 'ত্রুটি',
          description: 'অর্জনসমূহ লোড করতে সমস্যা হয়েছে',
          variant: 'destructive',
        })
        return
      }

      // Load user achievements
      const { data: userAchievementsData, error: userAchievementsError } = await supabase
        .from('user_achievements')
        .select(`
          *,
          achievement:achievements(*)
        `)
        .eq('user_id', user!.id)

      if (userAchievementsError) {
        console.error('Error loading user achievements:', userAchievementsError)
      }

      setAchievements(achievementsData || [])
      setUserAchievements(userAchievementsData || [])

      // Calculate stats
      const totalAchievements = achievementsData?.length || 0
      const unlockedAchievements = userAchievementsData?.length || 0
      const totalPoints = achievementsData?.reduce((sum, a) => sum + a.points_reward, 0) || 0
      const earnedPoints = userAchievementsData?.reduce((sum, ua) => sum + (ua.achievement?.points_reward || 0), 0) || 0

      setStats({
        totalAchievements,
        unlockedAchievements,
        totalPoints,
        earnedPoints
      })

    } catch (error) {
      console.error('Error loading achievements:', error)
    } finally {
      setLoading(false)
    }
  }

  const isAchievementUnlocked = (achievementId: string) => {
    return userAchievements.some(ua => ua.achievement_id === achievementId)
  }

  const getAchievementProgress = (achievement: Achievement) => {
    if (!profile) return { progress: 0, maxProgress: 100 }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const criteria = achievement.criteria as any
    
    if (criteria.hadith_read) {
      return {
        progress: profile.total_hadith_read,
        maxProgress: criteria.hadith_read
      }
    }
    
    if (criteria.streak_days) {
      return {
        progress: profile.streak_count,
        maxProgress: criteria.streak_days
      }
    }
    
    if (criteria.contributions) {
      return {
        progress: profile.total_contributions,
        maxProgress: criteria.contributions
      }
    }

    return { progress: 0, maxProgress: 100 }
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
              <Trophy className="w-10 h-10 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold text-islamic-green mb-2">অর্জনসমূহ</h1>
            <p className="text-muted-foreground">আপনার ইসলামী জ্ঞান অর্জনের যাত্রায় সাফল্যের চিহ্ন</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4 text-center">
                <Award className="w-8 h-8 mx-auto mb-2 text-islamic-green" />
                <p className="text-2xl font-bold">{stats.unlockedAchievements}</p>
                <p className="text-sm text-muted-foreground">অর্জিত</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <Target className="w-8 h-8 mx-auto mb-2 text-orange-500" />
                <p className="text-2xl font-bold">{stats.totalAchievements}</p>
                <p className="text-sm text-muted-foreground">মোট</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <Star className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
                <p className="text-2xl font-bold">{stats.earnedPoints}</p>
                <p className="text-sm text-muted-foreground">অর্জিত পয়েন্ট</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <Trophy className="w-8 h-8 mx-auto mb-2 text-purple-500" />
                <p className="text-2xl font-bold">{Math.round((stats.unlockedAchievements / stats.totalAchievements) * 100)}%</p>
                <p className="text-sm text-muted-foreground">সম্পূর্ণতা</p>
              </CardContent>
            </Card>
          </div>

          {/* Achievements Grid */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-islamic-green">সকল অর্জন</h2>
              <Badge variant="secondary" className="bg-islamic-gold/20 text-islamic-green border-islamic-gold/30">
                {stats.unlockedAchievements}/{stats.totalAchievements} সম্পূর্ণ
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {achievements.map((achievement) => {
                const isUnlocked = isAchievementUnlocked(achievement.id)
                const { progress, maxProgress } = getAchievementProgress(achievement)
                
                return (
                  <AchievementCard
                    key={achievement.id}
                    achievement={achievement}
                    isUnlocked={isUnlocked}
                    progress={progress}
                    maxProgress={maxProgress}
                  />
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
