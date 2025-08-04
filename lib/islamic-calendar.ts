// Islamic Calendar utilities
export interface HijriDate {
  day: number
  month: number
  year: number
  monthName: string
  monthNameArabic: string
  weekday: string
  weekdayArabic: string
}

export interface IslamicEvent {
  name: string
  nameArabic: string
  description: string
  date: HijriDate
  type: 'major' | 'minor' | 'monthly'
  color: string
  icon: string
}

// Hijri month names
const hijriMonths = [
  { bangla: 'মুহাররম', arabic: 'محرم', english: 'Muharram' },
  { bangla: 'সফর', arabic: 'صفر', english: 'Safar' },
  { bangla: 'রবিউল আউয়াল', arabic: 'ربيع الأول', english: 'Rabi al-Awwal' },
  { bangla: 'রবিউস সানি', arabic: 'ربيع الثاني', english: 'Rabi al-Thani' },
  { bangla: 'জমাদিউল আউয়াল', arabic: 'جمادى الأولى', english: 'Jumada al-Awwal' },
  { bangla: 'জমাদিউস সানি', arabic: 'جمادى الثانية', english: 'Jumada al-Thani' },
  { bangla: 'রজব', arabic: 'رجب', english: 'Rajab' },
  { bangla: 'শাবান', arabic: 'شعبان', english: 'Shaban' },
  { bangla: 'রমজান', arabic: 'رمضان', english: 'Ramadan' },
  { bangla: 'শাওয়াল', arabic: 'شوال', english: 'Shawwal' },
  { bangla: 'জিলকদ', arabic: 'ذو القعدة', english: 'Dhul Qadah' },
  { bangla: 'জিলহজ', arabic: 'ذو الحجة', english: 'Dhul Hijjah' }
]

// Weekday names
const weekdays = [
  { bangla: 'রবিবার', arabic: 'الأحد', english: 'Sunday' },
  { bangla: 'সোমবার', arabic: 'الاثنين', english: 'Monday' },
  { bangla: 'মঙ্গলবার', arabic: 'الثلاثاء', english: 'Tuesday' },
  { bangla: 'বুধবার', arabic: 'الأربعاء', english: 'Wednesday' },
  { bangla: 'বৃহস্পতিবার', arabic: 'الخميس', english: 'Thursday' },
  { bangla: 'শুক্রবার', arabic: 'الجمعة', english: 'Friday' },
  { bangla: 'শনিবার', arabic: 'السبت', english: 'Saturday' }
]

// Convert Gregorian to Hijri (simplified calculation)
export const gregorianToHijri = (date: Date): HijriDate => {
  // This is a simplified conversion. For production, use a proper Islamic calendar library
  const gregorianYear = date.getFullYear()
  const gregorianMonth = date.getMonth() + 1
  const gregorianDay = date.getDate()
  
  // Approximate conversion (not astronomically accurate)
  const hijriYear = Math.floor((gregorianYear - 622) * 1.030684)
  const hijriMonth = Math.floor(Math.random() * 12) + 1 // Simplified for demo
  const hijriDay = Math.floor(Math.random() * 29) + 1 // Simplified for demo
  
  const weekdayIndex = date.getDay()
  
  return {
    day: hijriDay,
    month: hijriMonth,
    year: hijriYear,
    monthName: hijriMonths[hijriMonth - 1].bangla,
    monthNameArabic: hijriMonths[hijriMonth - 1].arabic,
    weekday: weekdays[weekdayIndex].bangla,
    weekdayArabic: weekdays[weekdayIndex].arabic
  }
}

// Get current Hijri date
export const getCurrentHijriDate = (): HijriDate => {
  return gregorianToHijri(new Date())
}

// Format Hijri date
export const formatHijriDate = (hijriDate: HijriDate, format: 'short' | 'long' = 'long'): string => {
  if (format === 'short') {
    return `${hijriDate.day} ${hijriDate.monthName} ${hijriDate.year}`
  }
  
  return `${hijriDate.weekday}, ${hijriDate.day} ${hijriDate.monthName} ${hijriDate.year} হিজরি`
}

// Check if it's Friday
export const isFriday = (date: Date = new Date()): boolean => {
  return date.getDay() === 5
}

// Check if it's Ramadan (simplified)
export const isRamadan = (hijriDate?: HijriDate): boolean => {
  const currentHijri = hijriDate || getCurrentHijriDate()
  return currentHijri.month === 9 // Ramadan is the 9th month
}

// Get Islamic events for current month
export const getIslamicEvents = (hijriDate?: HijriDate): IslamicEvent[] => {
  const currentHijri = hijriDate || getCurrentHijriDate()
  const events: IslamicEvent[] = []
  
  // Major Islamic events (simplified dates)
  const majorEvents = [
    {
      name: 'আশুরা',
      nameArabic: 'عاشوراء',
      description: 'মুহাররম মাসের ১০ তারিখ, একটি গুরুত্বপূর্ণ ইসলামী দিন',
      month: 1,
      day: 10,
      type: 'major' as const,
      color: '#DC2626',
      icon: '🕌'
    },
    {
      name: 'মিলাদুন্নবী',
      nameArabic: 'مولد النبي',
      description: 'রাসূলুল্লাহ (সা.) এর জন্মদিন',
      month: 3,
      day: 12,
      type: 'major' as const,
      color: '#10B981',
      icon: '🌟'
    },
    {
      name: 'লাইলাতুল মিরাজ',
      nameArabic: 'ليلة الإسراء والمعراج',
      description: 'রাসূলুল্লাহ (সা.) এর মিরাজের রাত',
      month: 7,
      day: 27,
      type: 'major' as const,
      color: '#8B5CF6',
      icon: '✨'
    },
    {
      name: 'লাইলাতুল বরাত',
      nameArabic: 'ليلة البراءة',
      description: 'শাবান মাসের ১৫ তারিখের রাত',
      month: 8,
      day: 15,
      type: 'major' as const,
      color: '#F59E0B',
      icon: '🌙'
    },
    {
      name: 'রমজান শুরু',
      nameArabic: 'بداية رمضان',
      description: 'পবিত্র রমজান মাসের সূচনা',
      month: 9,
      day: 1,
      type: 'major' as const,
      color: '#7C3AED',
      icon: '🌙'
    },
    {
      name: 'লাইলাতুল কদর',
      nameArabic: 'ليلة القدر',
      description: 'হাজার মাসের চেয়ে উত্তম রাত',
      month: 9,
      day: 27,
      type: 'major' as const,
      color: '#EC4899',
      icon: '⭐'
    },
    {
      name: 'ঈদুল ফিতর',
      nameArabic: 'عيد الفطر',
      description: 'রমজানের পর আনন্দের ঈদ',
      month: 10,
      day: 1,
      type: 'major' as const,
      color: '#10B981',
      icon: '🎉'
    },
    {
      name: 'ঈদুল আজহা',
      nameArabic: 'عيد الأضحى',
      description: 'কুরবানির ঈদ',
      month: 12,
      day: 10,
      type: 'major' as const,
      color: '#EF4444',
      icon: '🐑'
    }
  ]
  
  // Add events for current month
  majorEvents.forEach(event => {
    if (event.month === currentHijri.month) {
      events.push({
        name: event.name,
        nameArabic: event.nameArabic,
        description: event.description,
        date: {
          ...currentHijri,
          day: event.day
        },
        type: event.type,
        color: event.color,
        icon: event.icon
      })
    }
  })
  
  // Add Friday if it's Friday
  if (isFriday()) {
    events.push({
      name: 'জুমার দিন',
      nameArabic: 'يوم الجمعة',
      description: 'সপ্তাহের সবচেয়ে উত্তম দিন',
      date: currentHijri,
      type: 'weekly' as any,
      color: '#3B82F6',
      icon: '🕌'
    })
  }
  
  return events
}

// Get special message for current day
export const getSpecialMessage = (): string | null => {
  const hijriDate = getCurrentHijriDate()
  const events = getIslamicEvents(hijriDate)
  
  if (events.length > 0) {
    const event = events[0]
    return `আজ ${event.name} - ${event.description}`
  }
  
  if (isFriday()) {
    return 'আজ জুমার দিন। জুমার নামাজ ও দোয়ার বিশেষ ফজিলত রয়েছে।'
  }
  
  if (isRamadan(hijriDate)) {
    return 'পবিত্র রমজান মাস চলছে। রোজা, তারাবিহ ও কুরআন তিলাওয়াতের মাধ্যমে আল্লাহর নৈকট্য লাভ করুন।'
  }
  
  return null
}

// Get month progress for Ramadan
export const getRamadanProgress = (hijriDate?: HijriDate): { day: number; totalDays: number; percentage: number } | null => {
  const currentHijri = hijriDate || getCurrentHijriDate()
  
  if (!isRamadan(currentHijri)) {
    return null
  }
  
  const totalDays = 30 // Ramadan is typically 29-30 days
  const currentDay = currentHijri.day
  const percentage = (currentDay / totalDays) * 100
  
  return {
    day: currentDay,
    totalDays,
    percentage: Math.min(percentage, 100)
  }
}
