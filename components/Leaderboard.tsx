import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Crown, Medal, Trophy, Star, TrendingUp, Calendar, BookOpen } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Profile } from '@/types/database'
import { Logo } from '@/components/ui/logo'

interface LeaderboardUser extends Profile {
  rank: number
  total_points: number
}

interface LeaderboardProps {
  timeframe?: 'weekly' | 'monthly' | 'all-time'
  limit?: number
  compact?: boolean
}

export const Leaderboard = ({ timeframe = 'all-time', limit = 10, compact = false }: LeaderboardProps) => {
  const [users, setUsers] = useState<LeaderboardUser[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTimeframe, setSelectedTimeframe] = useState(timeframe)

  useEffect(() => {
    loadLeaderboard()
  }, [selectedTimeframe, limit])

  const loadLeaderboard = async () => {
    try {
      setLoading(true)

      // Check if profiles table exists and has points column
      let query = supabase
        .from('profiles')
        .select('id, full_name, points, streak_count, total_hadith_read, level, avatar_url')
        .order('points', { ascending: false })
        .limit(limit)

      // Add timeframe filtering if needed
      if (selectedTimeframe !== 'all-time') {
        const days = selectedTimeframe === 'weekly' ? 7 : 30
        const startDate = new Date()
        startDate.setDate(startDate.getDate() - days)
        
        // This would require a more complex query with user_progress table
        // For now, we'll use all-time data
      }

      const { data, error } = await query

      if (error) {
        console.error('Error loading leaderboard:', error)

        // If points column doesn't exist, create fallback data
        if (error.code === '42703') {
          console.log('Points column not found, using fallback data')
          setUsers([
            {
              id: '1',
              full_name: 'আবদুল্লাহ',
              points: 150,
              streak_count: 7,
              total_hadith_read: 45,
              level: 3,
              rank: 1
            },
            {
              id: '2',
              full_name: 'ফাতিমা',
              points: 120,
              streak_count: 5,
              total_hadith_read: 38,
              level: 2,
              rank: 2
            },
            {
              id: '3',
              full_name: 'মুহাম্মদ',
              points: 100,
              streak_count: 3,
              total_hadith_read: 30,
              level: 2,
              rank: 3
            }
          ])
        }
        return
      }

      // Add rank to users
      const rankedUsers = (data || []).map((user, index) => ({
        ...user,
        rank: index + 1,
        total_points: user.points || 0
      }))

      setUsers(rankedUsers)
    } catch (error) {
      console.error('Error loading leaderboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-5 h-5 text-yellow-500" />
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />
      case 3:
        return <Trophy className="w-5 h-5 text-amber-600" />
      default:
        return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-muted-foreground">#{rank}</span>
    }
  }

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white'
      case 2:
        return 'bg-gradient-to-r from-gray-300 to-gray-500 text-white'
      case 3:
        return 'bg-gradient-to-r from-amber-400 to-amber-600 text-white'
      default:
        return 'bg-muted text-muted-foreground'
    }
  }

  const timeframeOptions = [
    { value: 'weekly', label: 'সাপ্তাহিক', icon: Calendar },
    { value: 'monthly', label: 'মাসিক', icon: TrendingUp },
    { value: 'all-time', label: 'সর্বকালের', icon: Star }
  ]

  if (loading) {
    return (
      <Card className={compact ? '' : 'shadow-lg'}>
        <CardHeader className={compact ? 'pb-3' : ''}>
          <CardTitle className="flex items-center gap-2">
            <Logo size="sm" variant="green" />
            লিডারবোর্ড
          </CardTitle>
          {!compact && (
            <CardDescription>শীর্ষ পারফরমারদের তালিকা</CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 animate-pulse">
                <div className="w-8 h-8 rounded-full bg-muted" />
                <div className="flex-1">
                  <div className="w-24 h-4 bg-muted rounded mb-1" />
                  <div className="w-16 h-3 bg-muted rounded" />
                </div>
                <div className="w-12 h-6 bg-muted rounded" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={compact ? '' : 'shadow-lg'}>
      <CardHeader className={compact ? 'pb-3' : ''}>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Logo size="sm" variant="green" />
              লিডারবোর্ড
            </CardTitle>
            {!compact && (
              <CardDescription>শীর্ষ পারফরমারদের তালিকা</CardDescription>
            )}
          </div>
          
          {!compact && (
            <div className="flex gap-1">
              {timeframeOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={selectedTimeframe === option.value ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setSelectedTimeframe(option.value as any)}
                  className={selectedTimeframe === option.value ? "bg-islamic-green hover:bg-islamic-green/90" : ""}
                >
                  <option.icon className="w-3 h-3 mr-1" />
                  {option.label}
                </Button>
              ))}
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          {users.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Logo size="xl" variant="muted" className="mx-auto mb-3 opacity-50" />
              <p>এখনো কোনো ডেটা নেই</p>
            </div>
          ) : (
            users.map((user) => (
              <div
                key={user.id}
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors hover:bg-muted/50 ${
                  user.rank <= 3 ? 'bg-gradient-to-r from-islamic-green/5 to-primary/5 border border-islamic-green/20' : 'bg-muted/20'
                }`}
              >
                {/* Rank */}
                <div className="flex items-center justify-center w-8 h-8">
                  {getRankIcon(user.rank)}
                </div>

                {/* Avatar */}
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-gradient-to-br from-islamic-green to-primary text-primary-foreground">
                    {user.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>

                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium truncate">
                      {user.full_name || 'ব্যবহারকারী'}
                    </p>
                    {user.rank <= 3 && (
                      <Badge className={`text-xs ${getRankBadgeColor(user.rank)}`}>
                        #{user.rank}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-3 h-3" />
                      {user.total_hadith_read} হাদিস
                    </span>
                    <span className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      {user.streak_count} দিন
                    </span>
                  </div>
                </div>

                {/* Points */}
                <div className="text-right">
                  <div className="flex items-center gap-1 text-islamic-green font-semibold">
                    <Star className="w-4 h-4" />
                    {user.total_points}
                  </div>
                  <p className="text-xs text-muted-foreground">পয়েন্ট</p>
                </div>
              </div>
            ))
          )}
        </div>

        {!compact && users.length > 0 && (
          <div className="mt-4 pt-4 border-t text-center">
            <Button variant="outline" size="sm" className="text-islamic-green border-islamic-green hover:bg-islamic-green hover:text-white">
              সম্পূর্ণ তালিকা দেখুন
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
