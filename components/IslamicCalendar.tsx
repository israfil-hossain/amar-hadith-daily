import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Calendar, Moon, Star, Clock } from 'lucide-react'
import { 
  getCurrentHijriDate, 
  formatHijriDate, 
  getIslamicEvents, 
  getSpecialMessage,
  getRamadanProgress,
  isFriday,
  isRamadan 
} from '@/lib/islamic-calendar'

interface IslamicCalendarProps {
  compact?: boolean
}

export const IslamicCalendar = ({ compact = false }: IslamicCalendarProps) => {
  const [hijriDate, setHijriDate] = useState(getCurrentHijriDate())
  const [events, setEvents] = useState(getIslamicEvents())
  const [specialMessage, setSpecialMessage] = useState<string | null>(null)
  const [ramadanProgress, setRamadanProgress] = useState(getRamadanProgress())

  useEffect(() => {
    const updateCalendar = () => {
      const currentHijri = getCurrentHijriDate()
      setHijriDate(currentHijri)
      setEvents(getIslamicEvents(currentHijri))
      setSpecialMessage(getSpecialMessage())
      setRamadanProgress(getRamadanProgress(currentHijri))
    }

    updateCalendar()
    
    // Update every hour
    const interval = setInterval(updateCalendar, 60 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const formatGregorianDate = () => {
    const now = new Date()
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }
    return now.toLocaleDateString('bn-BD', options)
  }

  return (
    <Card className={`${compact ? '' : 'shadow-lg'} ${isFriday() ? 'border-islamic-green/50 bg-gradient-to-br from-islamic-green/5 to-primary/5' : ''}`}>
      <CardHeader className={compact ? 'pb-3' : ''}>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-islamic-green" />
          ইসলামী ক্যালেন্ডার
        </CardTitle>
        {!compact && (
          <CardDescription>হিজরি তারিখ ও ইসলামী অনুষ্ঠান</CardDescription>
        )}
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Current Date */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Moon className="w-4 h-4 text-islamic-green" />
            <p className="text-lg font-semibold text-islamic-green">
              {formatHijriDate(hijriDate, compact ? 'short' : 'long')}
            </p>
          </div>
          
          {!compact && (
            <p className="text-sm text-muted-foreground">
              {formatGregorianDate()}
            </p>
          )}
        </div>

        {/* Special Message */}
        {specialMessage && (
          <div className={`p-3 rounded-lg ${
            isFriday() 
              ? 'bg-gradient-to-r from-islamic-green/10 to-primary/10 border border-islamic-green/20' 
              : 'bg-muted/50'
          }`}>
            <div className="flex items-start gap-2">
              <Star className="w-4 h-4 text-islamic-green mt-0.5 flex-shrink-0" />
              <p className="text-sm text-foreground leading-relaxed">
                {specialMessage}
              </p>
            </div>
          </div>
        )}

        {/* Ramadan Progress */}
        {ramadanProgress && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Moon className="w-4 h-4 text-purple-500" />
                <span className="font-medium text-purple-700">রমজান অগ্রগতি</span>
              </div>
              <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                {ramadanProgress.day}/{ramadanProgress.totalDays} দিন
              </Badge>
            </div>
            <Progress 
              value={ramadanProgress.percentage} 
              className="h-2"
            />
            <p className="text-xs text-muted-foreground text-center">
              {Math.round(ramadanProgress.percentage)}% সম্পূর্ণ
            </p>
          </div>
        )}

        {/* Upcoming Events */}
        {events.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-sm flex items-center gap-2">
              <Clock className="w-4 h-4 text-islamic-green" />
              {compact ? 'আজকের অনুষ্ঠান' : 'আসন্ন ইসলামী অনুষ্ঠান'}
            </h4>
            
            <div className="space-y-2">
              {events.slice(0, compact ? 1 : 3).map((event, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-3 p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
                    style={{ backgroundColor: `${event.color}20`, color: event.color }}
                  >
                    {event.icon}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">
                      {event.name}
                    </p>
                    {!compact && (
                      <p className="text-xs text-muted-foreground truncate">
                        {event.description}
                      </p>
                    )}
                  </div>
                  
                  <Badge 
                    variant="outline" 
                    className="text-xs"
                    style={{ borderColor: event.color, color: event.color }}
                  >
                    {event.date.day} {event.date.monthName}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Friday Special */}
        {isFriday() && (
          <div className="p-3 rounded-lg bg-gradient-to-r from-islamic-green/10 to-primary/10 border border-islamic-green/20">
            <div className="text-center space-y-2">
              <div className="w-8 h-8 mx-auto rounded-full bg-islamic-green/20 flex items-center justify-center">
                <span className="text-islamic-green">🕌</span>
              </div>
              <p className="font-medium text-islamic-green">জুমার মুবারক!</p>
              {!compact && (
                <p className="text-xs text-muted-foreground">
                  জুমার নামাজ ও দোয়ার বিশেষ ফজিলত রয়েছে
                </p>
              )}
            </div>
          </div>
        )}

        {/* Current Month Info */}
        {!compact && (
          <div className="pt-3 border-t border-border/50">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">বর্তমান মাস</span>
              <div className="text-right">
                <p className="font-medium">{hijriDate.monthName}</p>
                <p className="text-xs text-muted-foreground">{hijriDate.monthNameArabic}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
