import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Achievement } from '@/types/database'
import { CheckCircle, Lock, Star } from 'lucide-react'

interface AchievementCardProps {
  achievement: Achievement
  isUnlocked: boolean
  progress?: number
  maxProgress?: number
}

export const AchievementCard = ({ 
  achievement, 
  isUnlocked, 
  progress = 0, 
  maxProgress = 100 
}: AchievementCardProps) => {
  const progressPercentage = maxProgress > 0 ? (progress / maxProgress) * 100 : 0

  return (
    <Card className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg ${
      isUnlocked 
        ? 'bg-gradient-to-br from-islamic-green/10 to-primary/10 border-islamic-green/30' 
        : 'bg-muted/50 border-muted'
    }`}>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          {/* Achievement Icon */}
          <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl ${
            isUnlocked 
              ? 'bg-gradient-to-br from-islamic-green to-primary text-primary-foreground' 
              : 'bg-muted text-muted-foreground'
          }`}>
            {isUnlocked ? (
              <span>{achievement.icon || '🏆'}</span>
            ) : (
              <Lock className="w-6 h-6" />
            )}
          </div>

          {/* Achievement Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h3 className={`font-semibold text-lg ${
                isUnlocked ? 'text-islamic-green' : 'text-muted-foreground'
              }`}>
                {achievement.name_bangla}
              </h3>
              {isUnlocked && (
                <CheckCircle className="w-5 h-5 text-islamic-green" />
              )}
            </div>

            <p className={`text-sm mb-3 ${
              isUnlocked ? 'text-foreground' : 'text-muted-foreground'
            }`}>
              {achievement.description_bangla}
            </p>

            {/* Progress Bar (if not unlocked) */}
            {!isUnlocked && maxProgress > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>অগ্রগতি</span>
                  <span>{progress}/{maxProgress}</span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
              </div>
            )}

            {/* Points Badge */}
            <div className="flex items-center justify-between mt-3">
              <Badge variant={isUnlocked ? "default" : "secondary"} className={
                isUnlocked 
                  ? "bg-islamic-gold/20 text-islamic-green border-islamic-gold/30" 
                  : ""
              }>
                <Star className="w-3 h-3 mr-1" />
                {achievement.points_reward} পয়েন্ট
              </Badge>

              {achievement.badge_color && isUnlocked && (
                <div 
                  className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                  style={{ backgroundColor: achievement.badge_color }}
                />
              )}
            </div>
          </div>
        </div>

        {/* Unlock Effect */}
        {isUnlocked && (
          <div className="absolute top-2 right-2">
            <div className="w-8 h-8 rounded-full bg-islamic-green/20 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-islamic-green" />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
