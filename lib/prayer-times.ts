// Prayer times utility functions
export interface PrayerTimes {
  fajr: string
  dhuhr: string
  asr: string
  maghrib: string
  isha: string
  date: string
  location: string
}

export interface PrayerReminder {
  id: string
  prayer_name: string
  reminder_time: string
  is_active: boolean
  timezone: string
}

// Default prayer times for Dhaka, Bangladesh
const DEFAULT_PRAYER_TIMES: PrayerTimes = {
  fajr: '05:00',
  dhuhr: '12:00',
  asr: '15:30',
  maghrib: '18:00',
  isha: '19:30',
  date: new Date().toISOString().split('T')[0],
  location: 'Dhaka, Bangladesh'
}

// Get prayer times from API with fallback options
export async function getPrayerTimes(
  latitude: number = 23.8103,
  longitude: number = 90.4125,
  date?: string
): Promise<PrayerTimes> {
  const targetDate = date || new Date().toISOString().split('T')[0]

  // Try multiple APIs in order of preference
  const apis = [
    () => getFromAladhanAPI(latitude, longitude, targetDate),
    () => getFromPrayZoneAPI(latitude, longitude, targetDate),
    () => getFromMuslimSalatAPI(latitude, longitude, targetDate)
  ]

  for (const apiCall of apis) {
    try {
      const result = await apiCall()
      if (result) return result
    } catch (error) {
      console.error('API call failed:', error)
      continue
    }
  }

  // If all APIs fail, return default times
  console.warn('All prayer time APIs failed, using default times')
  return {
    ...DEFAULT_PRAYER_TIMES,
    date: targetDate
  }
}

// Aladhan API (Primary - Most reliable)
async function getFromAladhanAPI(latitude: number, longitude: number, date: string): Promise<PrayerTimes | null> {
  try {
    const response = await fetch(
      `https://api.aladhan.com/v1/timings/${date}?latitude=${latitude}&longitude=${longitude}&method=1`,
      { timeout: 5000 } as any
    )

    if (!response.ok) throw new Error('Aladhan API failed')

    const data = await response.json()

    if (data.code === 200 && data.data) {
      const timings = data.data.timings
      return {
        fajr: timings.Fajr,
        dhuhr: timings.Dhuhr,
        asr: timings.Asr,
        maghrib: timings.Maghrib,
        isha: timings.Isha,
        date,
        location: `${data.data.meta.latitude}, ${data.data.meta.longitude}`
      }
    }

    return null
  } catch (error) {
    console.error('Aladhan API error:', error)
    return null
  }
}

// Pray.zone API (Secondary)
async function getFromPrayZoneAPI(latitude: number, longitude: number, date: string): Promise<PrayerTimes | null> {
  try {
    const response = await fetch(
      `https://api.pray.zone/v2/times/today.json?latitude=${latitude}&longitude=${longitude}`,
      { timeout: 5000 } as any
    )

    if (!response.ok) throw new Error('Pray.zone API failed')

    const data = await response.json()

    if (data.results && data.results.datetime) {
      const timings = data.results.datetime[0].times
      return {
        fajr: timings.Fajr,
        dhuhr: timings.Dhuhr,
        asr: timings.Asr,
        maghrib: timings.Maghrib,
        isha: timings.Isha,
        date,
        location: `${latitude}, ${longitude}`
      }
    }

    return null
  } catch (error) {
    console.error('Pray.zone API error:', error)
    return null
  }
}

// MuslimSalat API (Tertiary - HTTP only)
async function getFromMuslimSalatAPI(latitude: number, longitude: number, date: string): Promise<PrayerTimes | null> {
  try {
    // Note: This API uses HTTP, not HTTPS
    const response = await fetch(
      `http://muslimsalat.com/${latitude},${longitude}/daily.json?key=YOUR_API_KEY`,
      { timeout: 5000 } as any
    )

    if (!response.ok) throw new Error('MuslimSalat API failed')

    const data = await response.json()

    if (data.items && data.items[0]) {
      const timings = data.items[0]
      return {
        fajr: timings.fajr,
        dhuhr: timings.dhuhr,
        asr: timings.asr,
        maghrib: timings.maghrib,
        isha: timings.isha,
        date,
        location: `${latitude}, ${longitude}`
      }
    }

    return null
  } catch (error) {
    console.error('MuslimSalat API error:', error)
    return null
  }
}

// Get next prayer time
export function getNextPrayer(prayerTimes: PrayerTimes): { name: string; time: string; remaining: string } {
  const now = new Date()
  const currentTime = now.getHours() * 60 + now.getMinutes()
  
  const prayers = [
    { name: 'ফজর', time: prayerTimes.fajr, key: 'fajr' },
    { name: 'যুহর', time: prayerTimes.dhuhr, key: 'dhuhr' },
    { name: 'আসর', time: prayerTimes.asr, key: 'asr' },
    { name: 'মাগরিব', time: prayerTimes.maghrib, key: 'maghrib' },
    { name: 'ইশা', time: prayerTimes.isha, key: 'isha' }
  ]
  
  for (const prayer of prayers) {
    const [hours, minutes] = prayer.time.split(':').map(Number)
    const prayerTime = hours * 60 + minutes
    
    if (prayerTime > currentTime) {
      const remainingMinutes = prayerTime - currentTime
      const remainingHours = Math.floor(remainingMinutes / 60)
      const remainingMins = remainingMinutes % 60
      
      return {
        name: prayer.name,
        time: prayer.time,
        remaining: `${remainingHours}ঘ ${remainingMins}মি`
      }
    }
  }
  
  // If no prayer left today, return tomorrow's Fajr
  const tomorrowFajr = prayers[0]
  const [hours, minutes] = tomorrowFajr.time.split(':').map(Number)
  const fajrTime = hours * 60 + minutes
  const remainingMinutes = (24 * 60) - currentTime + fajrTime
  const remainingHours = Math.floor(remainingMinutes / 60)
  const remainingMins = remainingMinutes % 60
  
  return {
    name: `আগামীকাল ${tomorrowFajr.name}`,
    time: tomorrowFajr.time,
    remaining: `${remainingHours}ঘ ${remainingMins}মি`
  }
}

// Check if it's time for a specific prayer
export function isPrayerTime(prayerTimes: PrayerTimes, prayerName: string, toleranceMinutes: number = 5): boolean {
  const now = new Date()
  const currentTime = now.getHours() * 60 + now.getMinutes()
  
  let prayerTime: string
  switch (prayerName.toLowerCase()) {
    case 'fajr':
    case 'ফজর':
      prayerTime = prayerTimes.fajr
      break
    case 'dhuhr':
    case 'যুহর':
      prayerTime = prayerTimes.dhuhr
      break
    case 'asr':
    case 'আসর':
      prayerTime = prayerTimes.asr
      break
    case 'maghrib':
    case 'মাগরিব':
      prayerTime = prayerTimes.maghrib
      break
    case 'isha':
    case 'ইশা':
      prayerTime = prayerTimes.isha
      break
    default:
      return false
  }
  
  const [hours, minutes] = prayerTime.split(':').map(Number)
  const prayerMinutes = hours * 60 + minutes
  
  return Math.abs(currentTime - prayerMinutes) <= toleranceMinutes
}

// Get user's location for prayer times
export async function getUserLocation(): Promise<{ latitude: number; longitude: number } | null> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(null)
      return
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        })
      },
      () => {
        resolve(null)
      },
      {
        timeout: 10000,
        enableHighAccuracy: false
      }
    )
  })
}

// Format time for display
export function formatTime(time: string): string {
  const [hours, minutes] = time.split(':').map(Number)
  const period = hours >= 12 ? 'PM' : 'AM'
  const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`
}

// Get Islamic date
export function getIslamicDate(): string {
  // This is a simplified version. In a real app, you'd use a proper Islamic calendar library
  const gregorianDate = new Date()
  const islamicMonths = [
    'মুহাররম', 'সফর', 'রবিউল আউয়াল', 'রবিউস সানি', 'জমাদিউল আউয়াল', 'জমাদিউস সানি',
    'রজব', 'শাবান', 'রমজান', 'শাওয়াল', 'জিলকদ', 'জিলহজ'
  ]
  
  // Approximate Islamic date calculation (not accurate, just for demo)
  const islamicYear = gregorianDate.getFullYear() - 579
  const islamicMonth = islamicMonths[gregorianDate.getMonth()]
  const islamicDay = gregorianDate.getDate()
  
  return `${islamicDay} ${islamicMonth}, ${islamicYear} হিজরি`
}

// Check if it's Friday
export function isFriday(): boolean {
  return new Date().getDay() === 5
}

// Check if it's Ramadan (approximate)
export function isRamadan(): boolean {
  // This is a simplified check. In a real app, you'd use proper Islamic calendar
  const now = new Date()
  const currentYear = now.getFullYear()
  
  // Approximate Ramadan dates (this would need to be updated yearly)
  const ramadanStart = new Date(currentYear, 2, 10) // Approximate
  const ramadanEnd = new Date(currentYear, 3, 10) // Approximate
  
  return now >= ramadanStart && now <= ramadanEnd
}

// Get special occasion message
export function getSpecialOccasion(): string | null {
  if (isFriday()) {
    return 'আজ জুমার দিন - জুমার নামাজ ও বিশেষ দোয়ার দিন'
  }
  
  if (isRamadan()) {
    return 'রমজান মুবারক - রোজা ও তারাবীর মাস'
  }
  
  const day = new Date().getDay()
  const dayNames = ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার']
  
  return `আজ ${dayNames[day]} - আল্লাহর রহমত ও বরকতের দিন`
}
