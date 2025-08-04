import { supabase } from './supabase'
import { Profile, Achievement, UserAchievement } from '@/types/database'

export interface AchievementCriteria {
  hadith_read?: number
  streak_days?: number
  contributions?: number
  favorites?: number
  shares?: number
  total_hadith?: number
}

export const checkAndUnlockAchievements = async (userId: string, profile: Profile) => {
  try {
    // Get all active achievements
    const { data: achievements, error: achievementsError } = await supabase
      .from('achievements')
      .select('*')
      .eq('is_active', true)

    if (achievementsError || !achievements) {
      console.error('Error fetching achievements:', achievementsError)
      return []
    }

    // Get user's current achievements
    const { data: userAchievements, error: userAchievementsError } = await supabase
      .from('user_achievements')
      .select('achievement_id')
      .eq('user_id', userId)

    if (userAchievementsError) {
      console.error('Error fetching user achievements:', userAchievementsError)
      return []
    }

    const unlockedAchievementIds = new Set(userAchievements?.map(ua => ua.achievement_id) || [])
    const newlyUnlocked: Achievement[] = []

    // Check each achievement
    for (const achievement of achievements) {
      // Skip if already unlocked
      if (unlockedAchievementIds.has(achievement.id)) {
        continue
      }

      const criteria = achievement.criteria as AchievementCriteria
      let isUnlocked = false

      // Check different criteria types
      if (criteria.hadith_read && profile.total_hadith_read >= criteria.hadith_read) {
        isUnlocked = true
      } else if (criteria.streak_days && profile.streak_count >= criteria.streak_days) {
        isUnlocked = true
      } else if (criteria.contributions && profile.total_contributions >= criteria.contributions) {
        isUnlocked = true
      } else if (criteria.total_hadith && profile.total_hadith_read >= criteria.total_hadith) {
        isUnlocked = true
      }

      // For favorites and shares, we need to query the database
      if (!isUnlocked && (criteria.favorites || criteria.shares)) {
        if (criteria.favorites) {
          const { count } = await supabase
            .from('user_hadith_interactions')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId)
            .eq('is_favorited', true)

          if (count && count >= criteria.favorites) {
            isUnlocked = true
          }
        }

        if (criteria.shares) {
          // This would require tracking shares in the database
          // For now, we'll skip this criteria
        }
      }

      // Unlock the achievement if criteria is met
      if (isUnlocked) {
        const { error: unlockError } = await supabase
          .from('user_achievements')
          .insert({
            user_id: userId,
            achievement_id: achievement.id,
            earned_at: new Date().toISOString()
          })

        if (!unlockError) {
          newlyUnlocked.push(achievement)

          // Update user points
          await supabase
            .from('profiles')
            .update({
              points: (profile.points || 0) + achievement.points_reward
            })
            .eq('id', userId)
        }
      }
    }

    return newlyUnlocked
  } catch (error) {
    console.error('Error checking achievements:', error)
    return []
  }
}

export const getAchievementProgress = (achievement: Achievement, profile: Profile) => {
  const criteria = achievement.criteria as AchievementCriteria
  
  if (criteria.hadith_read) {
    return {
      current: profile.total_hadith_read,
      target: criteria.hadith_read,
      percentage: Math.min((profile.total_hadith_read / criteria.hadith_read) * 100, 100)
    }
  }
  
  if (criteria.streak_days) {
    return {
      current: profile.streak_count,
      target: criteria.streak_days,
      percentage: Math.min((profile.streak_count / criteria.streak_days) * 100, 100)
    }
  }
  
  if (criteria.contributions) {
    return {
      current: profile.total_contributions,
      target: criteria.contributions,
      percentage: Math.min((profile.total_contributions / criteria.contributions) * 100, 100)
    }
  }

  return {
    current: 0,
    target: 100,
    percentage: 0
  }
}

// Default achievements to insert into database
export const defaultAchievements = [
  {
    name_bangla: 'প্রথম পদক্ষেপ',
    name_english: 'First Steps',
    description_bangla: 'প্রথম হাদিস পড়েছেন',
    description_english: 'Read your first hadith',
    icon: '🎯',
    badge_color: '#10B981',
    criteria: { hadith_read: 1 },
    points_reward: 10,
    is_active: true
  },
  {
    name_bangla: 'নিয়মিত পাঠক',
    name_english: 'Regular Reader',
    description_bangla: '৭ দিন ধারাবাহিক হাদিস পড়েছেন',
    description_english: 'Read hadith for 7 consecutive days',
    icon: '📚',
    badge_color: '#3B82F6',
    criteria: { streak_days: 7 },
    points_reward: 50,
    is_active: true
  },
  {
    name_bangla: 'জ্ঞান অন্বেষী',
    name_english: 'Knowledge Seeker',
    description_bangla: '৫০টি হাদিস পড়েছেন',
    description_english: 'Read 50 hadith',
    icon: '🔍',
    badge_color: '#8B5CF6',
    criteria: { hadith_read: 50 },
    points_reward: 100,
    is_active: true
  },
  {
    name_bangla: 'হাদিস প্রেমী',
    name_english: 'Hadith Lover',
    description_bangla: '১০০টি হাদিস পড়েছেন',
    description_english: 'Read 100 hadith',
    icon: '❤️',
    badge_color: '#EC4899',
    criteria: { hadith_read: 100 },
    points_reward: 200,
    is_active: true
  },
  {
    name_bangla: 'অবদানকারী',
    name_english: 'Contributor',
    description_bangla: 'প্রথম হাদিস অবদান রেখেছেন',
    description_english: 'Made your first hadith contribution',
    icon: '🤝',
    badge_color: '#F59E0B',
    criteria: { contributions: 1 },
    points_reward: 25,
    is_active: true
  },
  {
    name_bangla: 'মাসিক চ্যাম্পিয়ন',
    name_english: 'Monthly Champion',
    description_bangla: '৩০ দিন ধারাবাহিক হাদিস পড়েছেন',
    description_english: 'Read hadith for 30 consecutive days',
    icon: '🏆',
    badge_color: '#EF4444',
    criteria: { streak_days: 30 },
    points_reward: 300,
    is_active: true
  },
  {
    name_bangla: 'সংগ্রাহক',
    name_english: 'Collector',
    description_bangla: '২০টি হাদিস পছন্দের তালিকায় যোগ করেছেন',
    description_english: 'Added 20 hadith to favorites',
    icon: '⭐',
    badge_color: '#F97316',
    criteria: { favorites: 20 },
    points_reward: 75,
    is_active: true
  },
  {
    name_bangla: 'জ্ঞানের ভান্ডার',
    name_english: 'Knowledge Vault',
    description_bangla: '৫০০টি হাদিস পড়েছেন',
    description_english: 'Read 500 hadith',
    icon: '📖',
    badge_color: '#06B6D4',
    criteria: { hadith_read: 500 },
    points_reward: 500,
    is_active: true
  },
  {
    name_bangla: 'হাদিস মাস্টার',
    name_english: 'Hadith Master',
    description_bangla: '১০০০টি হাদিস পড়েছেন',
    description_english: 'Read 1000 hadith',
    icon: '👑',
    badge_color: '#7C3AED',
    criteria: { hadith_read: 1000 },
    points_reward: 1000,
    is_active: true
  },
  {
    name_bangla: 'বছরের সেরা',
    name_english: 'Year Champion',
    description_bangla: '৩৬৫ দিন ধারাবাহিক হাদিস পড়েছেন',
    description_english: 'Read hadith for 365 consecutive days',
    icon: '🌟',
    badge_color: '#DC2626',
    criteria: { streak_days: 365 },
    points_reward: 1000,
    is_active: true
  }
]
