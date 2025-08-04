'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/providers/AuthProvider'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { useToast } from '@/components/ui/use-toast'
import { 
  Calendar, 
  TrendingUp, 
  Target, 
  BookOpen, 
  Flame, 
  Trophy, 
  ChevronLeft, 
  ChevronRight,
  Loader2 
} from 'lucide-react'
import { getUserProgress, supabase } from '@/lib/supabase'
import { UserProgress } from '@/types/database'

interface WeeklySummaryProps {
  compact?: boolean
}

interface WeeklyStats {
  totalHadithRead: number
  averageDaily: number
  streakDays: number
  completedDays: number
  totalTimeSpent: number
  weekGoal: number
  weekProgress: number
  bestDay: { date: string; count: number } | null
  improvements: string[]
}

export function WeeklySummary({ compact = false }: WeeklySummaryProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  
  const [weeklyStats, setWeeklyStats] = useState<WeeklyStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(getWeekStart(new Date()))
  const [progressData, setProgressData] = useState<UserProgress[]>([])

  useEffect(() => {
    if (user) {
      loadWeeklySummary()
    } else {
      setLoading(false)
    }
  }, [user?.id, currentWeekStart]) // Fixed: use user.id instead of full user object

  function getWeekStart(date: Date): Date {
    const d = new Date(date)
    const day = d.getDay()
    const diff = d.getDate() - day + (day === 0 ? -6 : 1) // Adjust when day is Sunday
    return new Date(d.setDate(diff))
  }

  function getWeekEnd(weekStart: Date): Date {
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekStart.getDate() + 6)
    return weekEnd
  }

  const loadWeeklySummary = async () => {
    if (!user) return

    try {
      setLoading(true)

      const weekEnd = getWeekEnd(currentWeekStart)
      const startDate = currentWeekStart.toISOString().split('T')[0]
      const endDate = weekEnd.toISOString().split('T')[0]

      const { data, error } = await getUserProgress(user.id, startDate, endDate)
      
      if (error) {
        console.error('Error loading weekly summary:', error)
        return
      }

      setProgressData(data || [])
      calculateWeeklyStats(data || [])
      
    } catch (error) {
      console.error('Error loading weekly summary:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateWeeklyStats = (data: UserProgress[]) => {
    const totalHadithRead = data.reduce((sum, day) => sum + day.hadith_read_count, 0)
    const totalTimeSpent = data.reduce((sum, day) => sum + day.time_spent_minutes, 0)
    const completedDays = data.filter(day => day.hadith_read_count > 0).length
    const streakDays = data.filter(day => day.streak_maintained).length
    
    const averageDaily = completedDays > 0 ? totalHadithRead / completedDays : 0
    const weekGoal = 21 // 3 hadith per day * 7 days
    const weekProgress = Math.min((totalHadithRead / weekGoal) * 100, 100)

    // Find best day
    let bestDay: { date: string; count: number } | null = null
    for (const day of data) {
      if (!bestDay || day.hadith_read_count > bestDay.count) {
        bestDay = { date: day.date, count: day.hadith_read_count }
      }
    }

    // Generate improvements
    const improvements: string[] = []
    if (completedDays < 7) {
      improvements.push(`আরো ${7 - completedDays} দিন নিয়মিত পড়ুন`)
    }
    if (averageDaily < 3) {
      improvements.push('দৈনিক কমপক্ষে ৩টি হাদিস পড়ার চেষ্টা করুন')
    }
    if (streakDays < 3) {
      improvements.push('ধারাবাহিকতা বজায় রাখার চেষ্টা করুন')
    }
    if (improvements.length === 0) {
      improvements.push('চমৎকার! এভাবেই চালিয়ে যান')
    }

    setWeeklyStats({
      totalHadithRead,
      averageDaily: Math.round(averageDaily * 10) / 10,
      streakDays,
      completedDays,
      totalTimeSpent,
      weekGoal,
      weekProgress: Math.round(weekProgress),
      bestDay: bestDay?.count > 0 ? bestDay : null,
      improvements
    })
  }

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newWeekStart = new Date(currentWeekStart)
    newWeekStart.setDate(currentWeekStart.getDate() + (direction === 'next' ? 7 : -7))
    setCurrentWeekStart(newWeekStart)
  }

  const isCurrentWeek = () => {
    const thisWeekStart = getWeekStart(new Date())
    return currentWeekStart.getTime() === thisWeekStart.getTime()
  }

  if (!user) {
    return (
      <Card className={compact ? 'w-full' : ''}>
        <CardContent className="text-center p-6">
          <Calendar className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-muted-foreground">সাপ্তাহিক সামারি দেখতে লগইন করুন</p>
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <Card className={compact ? 'w-full' : ''}>
        <CardContent className="flex items-center justify-center p-6">
          <Loader2 className="w-6 h-6 animate-spin mr-2" />
          <span>সাপ্তাহিক সামারি লোড হচ্ছে...</span>
        </CardContent>
      </Card>
    )
  }

  if (!weeklyStats) {
    return (
      <Card className={compact ? 'w-full' : ''}>
        <CardContent className="text-center p-6">
          <Calendar className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-muted-foreground">এই সপ্তাহে কোনো কার্যকলাপ নেই</p>
        </CardContent>
      </Card>
    )
  }

  const weekEnd = getWeekEnd(currentWeekStart)
  const weekRange = `${currentWeekStart.toLocaleDateString('bn-BD', { day: 'numeric', month: 'short' })} - ${weekEnd.toLocaleDateString('bn-BD', { day: 'numeric', month: 'short' })}`

  if (compact) {
    return (
      <Card className="w-full">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-islamic-green" />
              <span className="font-medium">সাপ্তাহিক সামারি</span>
            </div>
            <Badge variant="secondary" className="text-xs">
              {weekRange}
            </Badge>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">সাপ্তাহিক লক্ষ্য</span>
              <span className="text-sm font-medium">{weeklyStats.totalHadithRead}/{weeklyStats.weekGoal}</span>
            </div>
            <Progress value={weeklyStats.weekProgress} className="h-2" />
            
            <div className="grid grid-cols-3 gap-2 text-xs text-center mt-3">
              <div>
                <p className="font-medium">{weeklyStats.completedDays}</p>
                <p className="text-muted-foreground">সক্রিয় দিন</p>
              </div>
              <div>
                <p className="font-medium">{weeklyStats.averageDaily}</p>
                <p className="text-muted-foreground">দৈনিক গড়</p>
              </div>
              <div>
                <p className="font-medium">{weeklyStats.streakDays}</p>
                <p className="text-muted-foreground">ধারা দিন</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-islamic-green" />
              সাপ্তাহিক সামারি
            </CardTitle>
            <CardDescription>{weekRange}</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateWeek('prev')}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateWeek('next')}
              disabled={isCurrentWeek()}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Weekly Goal Progress */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">সাপ্তাহিক লক্ষ্য</span>
            <span className="text-sm text-muted-foreground">
              {weeklyStats.totalHadithRead}/{weeklyStats.weekGoal} হাদিস
            </span>
          </div>
          <Progress value={weeklyStats.weekProgress} className="h-3" />
          <p className="text-xs text-muted-foreground mt-1">
            {weeklyStats.weekProgress}% সম্পন্ন
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <BookOpen className="w-6 h-6 mx-auto mb-1 text-islamic-green" />
            <p className="text-xl font-bold">{weeklyStats.totalHadithRead}</p>
            <p className="text-xs text-muted-foreground">মোট পঠিত</p>
          </div>

          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <Target className="w-6 h-6 mx-auto mb-1 text-blue-500" />
            <p className="text-xl font-bold">{weeklyStats.averageDaily}</p>
            <p className="text-xs text-muted-foreground">দৈনিক গড়</p>
          </div>

          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <Calendar className="w-6 h-6 mx-auto mb-1 text-purple-500" />
            <p className="text-xl font-bold">{weeklyStats.completedDays}/7</p>
            <p className="text-xs text-muted-foreground">সক্রিয় দিন</p>
          </div>

          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <Flame className="w-6 h-6 mx-auto mb-1 text-orange-500" />
            <p className="text-xl font-bold">{weeklyStats.streakDays}</p>
            <p className="text-xs text-muted-foreground">ধারা দিন</p>
          </div>
        </div>

        {/* Best Day */}
        {weeklyStats.bestDay && (
          <div className="p-4 bg-gradient-to-r from-islamic-green/10 to-primary/10 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <span className="font-medium">সেরা দিন</span>
            </div>
            <p className="text-lg font-bold">
              {new Date(weeklyStats.bestDay.date).toLocaleDateString('bn-BD', { 
                weekday: 'long', 
                day: 'numeric', 
                month: 'long' 
              })}
            </p>
            <p className="text-sm text-muted-foreground">
              {weeklyStats.bestDay.count} টি হাদিস পড়েছেন
            </p>
          </div>
        )}

        {/* Daily Breakdown */}
        <div>
          <h4 className="font-medium mb-3">দৈনিক বিবরণ</h4>
          <div className="space-y-2">
            {Array.from({ length: 7 }, (_, i) => {
              const date = new Date(currentWeekStart)
              date.setDate(currentWeekStart.getDate() + i)
              const dateString = date.toISOString().split('T')[0]
              const dayData = progressData.find(p => p.date === dateString)
              const dayName = date.toLocaleDateString('bn-BD', { weekday: 'short' })
              
              return (
                <div key={i} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                  <span className="text-sm font-medium">{dayName}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{dayData?.hadith_read_count || 0} হাদিস</span>
                    {dayData?.streak_maintained && (
                      <Flame className="w-3 h-3 text-orange-500" />
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Improvements */}
        <div>
          <h4 className="font-medium mb-3">পরামর্শ</h4>
          <div className="space-y-2">
            {weeklyStats.improvements.map((improvement, index) => (
              <div key={index} className="flex items-start gap-2 text-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-islamic-green mt-2 flex-shrink-0" />
                <span>{improvement}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
