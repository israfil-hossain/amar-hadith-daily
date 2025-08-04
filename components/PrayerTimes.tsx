'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/components/ui/use-toast'
import { Clock, MapPin, Bell, BellOff, Loader2 } from 'lucide-react'
import { 
  getPrayerTimes, 
  getNextPrayer, 
  getUserLocation, 
  formatTime, 
  getIslamicDate,
  getSpecialOccasion,
  PrayerTimes as PrayerTimesType 
} from '@/lib/prayer-times'

interface PrayerTimesProps {
  compact?: boolean
}

export function PrayerTimes({ compact = false }: PrayerTimesProps) {
  const { toast } = useToast()
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimesType | null>(null)
  const [nextPrayer, setNextPrayer] = useState<{ name: string; time: string; remaining: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [location, setLocation] = useState<string>('Dhaka, Bangladesh')
  const [notificationsEnabled, setNotificationsEnabled] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    loadPrayerTimes()
    checkNotificationPermission()
    
    // Update current time every minute
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date())
      if (prayerTimes) {
        setNextPrayer(getNextPrayer(prayerTimes))
      }
    }, 60000)

    return () => clearInterval(timeInterval)
  }, [])

  useEffect(() => {
    if (prayerTimes) {
      setNextPrayer(getNextPrayer(prayerTimes))
    }
  }, [prayerTimes])

  const loadPrayerTimes = async () => {
    try {
      setLoading(true)
      
      // Try to get user's location
      const userLocation = await getUserLocation()
      
      let lat = 23.8103 // Default to Dhaka
      let lng = 90.4125
      let locationName = 'Dhaka, Bangladesh'
      
      if (userLocation) {
        lat = userLocation.latitude
        lng = userLocation.longitude
        locationName = `${lat.toFixed(2)}, ${lng.toFixed(2)}`
      }
      
      const times = await getPrayerTimes(lat, lng)
      setPrayerTimes(times)
      setLocation(locationName)
      
    } catch (error) {
      console.error('Error loading prayer times:', error)
      toast({
        title: 'ত্রুটি',
        description: 'নামাজের সময় লোড করতে সমস্যা হয়েছে',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const checkNotificationPermission = () => {
    if ('Notification' in window) {
      setNotificationsEnabled(Notification.permission === 'granted')
    }
  }

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission()
      setNotificationsEnabled(permission === 'granted')
      
      if (permission === 'granted') {
        toast({
          title: 'নোটিফিকেশন চালু',
          description: 'নামাজের সময় হলে আপনি নোটিফিকেশন পাবেন',
        })
      } else {
        toast({
          title: 'নোটিফিকেশন বন্ধ',
          description: 'নামাজের সময় নোটিফিকেশন পেতে অনুমতি দিন',
          variant: 'destructive',
        })
      }
    }
  }

  const toggleNotifications = () => {
    if (notificationsEnabled) {
      setNotificationsEnabled(false)
      toast({
        title: 'নোটিফিকেশন বন্ধ',
        description: 'নামাজের সময় নোটিফিকেশন বন্ধ করা হয়েছে',
      })
    } else {
      requestNotificationPermission()
    }
  }

  if (loading) {
    return (
      <Card className={compact ? 'w-full' : ''}>
        <CardContent className="flex items-center justify-center p-6">
          <Loader2 className="w-6 h-6 animate-spin mr-2" />
          <span>নামাজের সময় লোড হচ্ছে...</span>
        </CardContent>
      </Card>
    )
  }

  if (!prayerTimes) {
    return (
      <Card className={compact ? 'w-full' : ''}>
        <CardContent className="text-center p-6">
          <Clock className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-muted-foreground">নামাজের সময় লোড করতে পারেনি</p>
          <Button onClick={loadPrayerTimes} variant="outline" size="sm" className="mt-2">
            আবার চেষ্টা করুন
          </Button>
        </CardContent>
      </Card>
    )
  }

  const prayers = [
    { name: 'ফজর', time: prayerTimes.fajr, key: 'fajr' },
    { name: 'যুহর', time: prayerTimes.dhuhr, key: 'dhuhr' },
    { name: 'আসর', time: prayerTimes.asr, key: 'asr' },
    { name: 'মাগরিব', time: prayerTimes.maghrib, key: 'maghrib' },
    { name: 'ইশা', time: prayerTimes.isha, key: 'isha' }
  ]

  const specialOccasion = getSpecialOccasion()
  const islamicDate = getIslamicDate()

  if (compact) {
    return (
      <Card className="w-full">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-islamic-green" />
              <span className="font-medium">নামাজের সময়</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleNotifications}
              className="p-1"
            >
              {notificationsEnabled ? (
                <Bell className="w-4 h-4 text-islamic-green" />
              ) : (
                <BellOff className="w-4 h-4 text-muted-foreground" />
              )}
            </Button>
          </div>
          
          {nextPrayer && (
            <div className="mb-3 p-2 bg-islamic-green/10 rounded-lg">
              <p className="text-sm font-medium text-islamic-green">
                পরবর্তী: {nextPrayer.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatTime(nextPrayer.time)} • {nextPrayer.remaining} বাকি
              </p>
            </div>
          )}
          
          <div className="grid grid-cols-5 gap-2 text-xs">
            {prayers.map((prayer) => (
              <div key={prayer.key} className="text-center">
                <p className="font-medium">{prayer.name}</p>
                <p className="text-muted-foreground">{formatTime(prayer.time)}</p>
              </div>
            ))}
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
              <Clock className="w-5 h-5 text-islamic-green" />
              নামাজের সময়সূচী
            </CardTitle>
            <CardDescription className="flex items-center gap-1 mt-1">
              <MapPin className="w-3 h-3" />
              {location}
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={toggleNotifications}
            className="flex items-center gap-2"
          >
            {notificationsEnabled ? (
              <>
                <Bell className="w-4 h-4" />
                চালু
              </>
            ) : (
              <>
                <BellOff className="w-4 h-4" />
                বন্ধ
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Current Time & Islamic Date */}
        <div className="text-center p-4 bg-gradient-to-r from-islamic-green/10 to-primary/10 rounded-lg">
          <p className="text-2xl font-bold">
            {currentTime.toLocaleTimeString('bn-BD', { 
              hour: '2-digit', 
              minute: '2-digit',
              hour12: true 
            })}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {currentTime.toLocaleDateString('bn-BD', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
          <p className="text-xs text-muted-foreground">{islamicDate}</p>
        </div>

        {/* Special Occasion */}
        {specialOccasion && (
          <div className="text-center">
            <Badge variant="secondary" className="bg-islamic-green/10 text-islamic-green">
              {specialOccasion}
            </Badge>
          </div>
        )}

        {/* Next Prayer */}
        {nextPrayer && (
          <div className="p-4 bg-islamic-green/10 rounded-lg text-center">
            <p className="text-sm text-muted-foreground">পরবর্তী নামাজ</p>
            <p className="text-xl font-bold text-islamic-green">{nextPrayer.name}</p>
            <p className="text-lg">{formatTime(nextPrayer.time)}</p>
            <p className="text-sm text-muted-foreground">{nextPrayer.remaining} বাকি</p>
          </div>
        )}

        {/* Prayer Times Grid */}
        <div className="grid grid-cols-1 gap-3">
          {prayers.map((prayer) => (
            <div 
              key={prayer.key} 
              className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors"
            >
              <span className="font-medium">{prayer.name}</span>
              <span className="text-lg font-mono">{formatTime(prayer.time)}</span>
            </div>
          ))}
        </div>

        {/* Refresh Button */}
        <div className="text-center">
          <Button
            variant="outline"
            size="sm"
            onClick={loadPrayerTimes}
            className="text-xs"
          >
            <Clock className="w-3 h-3 mr-1" />
            আপডেট করুন
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
