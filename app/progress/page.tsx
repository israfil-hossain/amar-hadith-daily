'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/providers/AuthProvider'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'
import { Loader2, TrendingUp, ArrowLeft, Calendar, Target, BookOpen, Trophy, Flame } from 'lucide-react'
import { getUserProgress, supabase } from '@/lib/supabase'
import { UserProgress } from '@/types/database'
import { Logo } from '@/components/ui/logo'

export default function ProgressPage() {
  const { user, profile } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  
  const [progressData, setProgressData] = useState<UserProgress[]>([])
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<string>('30') // days
  const [stats, setStats] = useState({
    totalDays: 0,
    averageDaily: 0,
    bestStreak: 0,
    currentStreak: 0,
    totalHadithRead: 0,
    totalTimeSpent: 0
  })

  useEffect(() => {
    if (!user) {
      return // Don't redirect immediately, let auth loading finish
    }

    loadProgress()
  }, [user?.id, timeRange]) // Fixed: use user.id instead of full user object

  const loadProgress = async () => {
    if (!user) return

    try {
      setLoading(true)

      const endDate = new Date().toISOString().split('T')[0]
      const startDate = new Date(Date.now() - parseInt(timeRange) * 24 * 60 * 60 * 1000)
        .toISOString().split('T')[0]

      const { data, error } = await getUserProgress(user.id, startDate, endDate)
      
      if (error) {
        toast({
          title: 'ত্রুটি',
          description: 'অগ্রগতির তথ্য লোড করতে সমস্যা হয়েছে',
          variant: 'destructive',
        })
        return
      }

      if (data) {
        setProgressData(data)
        calculateStats(data)
      }
    } catch (error) {
      console.error('Error loading progress:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (data: UserProgress[]) => {
    if (data.length === 0) {
      setStats({
        totalDays: 0,
        averageDaily: 0,
        bestStreak: 0,
        currentStreak: profile?.streak_count || 0,
        totalHadithRead: 0,
        totalTimeSpent: 0
      })
      return
    }

    const totalHadithRead = data.reduce((sum, day) => sum + day.hadith_read_count, 0)
    const totalTimeSpent = data.reduce((sum, day) => sum + day.time_spent_minutes, 0)
    const activeDays = data.filter(day => day.hadith_read_count > 0).length
    const averageDaily = activeDays > 0 ? totalHadithRead / activeDays : 0

    // Calculate best streak
    let bestStreak = 0
    let currentStreakInData = 0
    
    // Sort by date ascending
    const sortedData = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    
    for (const day of sortedData) {
      if (day.streak_maintained) {
        currentStreakInData++
        bestStreak = Math.max(bestStreak, currentStreakInData)
      } else {
        currentStreakInData = 0
      }
    }

    setStats({
      totalDays: data.length,
      averageDaily: Math.round(averageDaily * 10) / 10,
      bestStreak,
      currentStreak: profile?.streak_count || 0,
      totalHadithRead,
      totalTimeSpent
    })
  }

  const getProgressColor = (count: number) => {
    if (count === 0) return 'bg-gray-100'
    if (count <= 2) return 'bg-green-200'
    if (count <= 5) return 'bg-green-400'
    return 'bg-green-600'
  }

  const generateCalendarData = () => {
    const days = parseInt(timeRange)
    const calendar = []
    const today = new Date()
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateString = date.toISOString().split('T')[0]
      
      const dayData = progressData.find(p => p.date === dateString)
      calendar.push({
        date: dateString,
        day: date.getDate(),
        hadithCount: dayData?.hadith_read_count || 0,
        timeSpent: dayData?.time_spent_minutes || 0,
        streakMaintained: dayData?.streak_maintained || false
      })
    }
    
    return calendar
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-warm-cream to-sage-green/20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">লগইন প্রয়োজন</h2>
          <p className="text-muted-foreground mb-6">আপনার অগ্রগতি দেখতে অনুগ্রহ করে লগইন করুন</p>
          <Button asChild>
            <Link href="/auth/login?redirectTo=/progress">লগইন করুন</Link>
          </Button>
        </div>
      </div>
    )
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

  const calendarData = generateCalendarData()

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

        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm mb-8">
            <CardHeader className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                <Logo size="lg" variant="white" />
              </div>
              <CardTitle className="text-3xl font-bold text-islamic-green">
                আমার অগ্রগতি
              </CardTitle>
              <CardDescription className="text-lg">
                আপনার হাদিস অধ্যয়নের অগ্রগতি ও পরিসংখ্যান
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Time Range Selector */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">সময়কাল:</span>
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">গত ৭ দিন</SelectItem>
                    <SelectItem value="30">গত ৩০ দিন</SelectItem>
                    <SelectItem value="90">গত ৯০ দিন</SelectItem>
                    <SelectItem value="365">গত ১ বছর</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Statistics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
            <Card>
              <CardContent className="p-4 text-center">
                <BookOpen className="w-8 h-8 mx-auto mb-2 text-islamic-green" />
                <p className="text-2xl font-bold">{stats.totalHadithRead}</p>
                <p className="text-sm text-muted-foreground">মোট পঠিত</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <Target className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                <p className="text-2xl font-bold">{stats.averageDaily}</p>
                <p className="text-sm text-muted-foreground">দৈনিক গড়</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <Flame className="w-8 h-8 mx-auto mb-2 text-orange-500" />
                <p className="text-2xl font-bold">{stats.currentStreak}</p>
                <p className="text-sm text-muted-foreground">বর্তমান ধারা</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <Trophy className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
                <p className="text-2xl font-bold">{stats.bestStreak}</p>
                <p className="text-sm text-muted-foreground">সেরা ধারা</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <Calendar className="w-8 h-8 mx-auto mb-2 text-purple-500" />
                <p className="text-2xl font-bold">{progressData.filter(d => d.hadith_read_count > 0).length}</p>
                <p className="text-sm text-muted-foreground">সক্রিয় দিন</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <TrendingUp className="w-8 h-8 mx-auto mb-2 text-green-500" />
                <p className="text-2xl font-bold">{Math.round(stats.totalTimeSpent / 60)}</p>
                <p className="text-sm text-muted-foreground">ঘন্টা ব্যয়িত</p>
              </CardContent>
            </Card>
          </div>

          {/* Activity Calendar */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>দৈনিক কার্যকলাপ</CardTitle>
              <CardDescription>
                প্রতিদিনের হাদিস পড়ার পরিমাণ (গাঢ় রং = বেশি হাদিস)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2 mb-4">
                {['রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহ', 'শুক্র', 'শনি'].map(day => (
                  <div key={day} className="text-center text-xs font-medium text-muted-foreground p-2">
                    {day}
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-7 gap-2">
                {calendarData.map((day, index) => (
                  <div
                    key={day.date}
                    className={`
                      aspect-square rounded-md border-2 flex items-center justify-center text-xs font-medium
                      ${getProgressColor(day.hadithCount)}
                      ${day.streakMaintained ? 'border-orange-400' : 'border-gray-200'}
                      hover:scale-110 transition-transform cursor-pointer
                    `}
                    title={`${day.date}: ${day.hadithCount} হাদিস, ${day.timeSpent} মিনিট`}
                  >
                    {day.day}
                  </div>
                ))}
              </div>
              
              <div className="flex items-center justify-between mt-4 text-xs text-muted-foreground">
                <span>কম</span>
                <div className="flex gap-1">
                  <div className="w-3 h-3 rounded bg-gray-100"></div>
                  <div className="w-3 h-3 rounded bg-green-200"></div>
                  <div className="w-3 h-3 rounded bg-green-400"></div>
                  <div className="w-3 h-3 rounded bg-green-600"></div>
                </div>
                <span>বেশি</span>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>সাম্প্রতিক কার্যকলাপ</CardTitle>
            </CardHeader>
            <CardContent>
              {progressData.length > 0 ? (
                <div className="space-y-4">
                  {progressData.slice(0, 10).map((day) => (
                    <div key={day.date} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">
                            {new Date(day.date).toLocaleDateString('bn-BD', { 
                              weekday: 'long', 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {day.hadith_read_count} হাদিস পড়েছেন • {day.time_spent_minutes} মিনিট ব্যয় করেছেন
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {day.streak_maintained && (
                          <div className="flex items-center gap-1 text-orange-500">
                            <Flame className="w-4 h-4" />
                            <span className="text-xs">ধারা</span>
                          </div>
                        )}
                        {day.achievements_unlocked && day.achievements_unlocked.length > 0 && (
                          <div className="flex items-center gap-1 text-yellow-500">
                            <Trophy className="w-4 h-4" />
                            <span className="text-xs">{day.achievements_unlocked.length}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">কোনো কার্যকলাপ নেই</h3>
                  <p className="text-muted-foreground mb-4">
                    এই সময়কালে আপনার কোনো হাদিস পড়ার রেকর্ড নেই
                  </p>
                  <Link href="/">
                    <Button className="bg-gradient-to-r from-islamic-green to-primary">
                      আজই শুরু করুন
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
