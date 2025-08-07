import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Helper functions for common operations
export const auth = supabase.auth

export const signUp = async (email: string, password: string, fullName: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      }
    }
  })
  return { data, error }
}

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser()
  return { user, error }
}

export const getProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  return { data, error }
}

export const updateProfile = async (userId: string, updates: Record<string, unknown>) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()
  return { data, error }
}

// Hadith related functions
export const getDailyHadith = async (date: string = new Date().toISOString().split('T')[0]) => {
  try {
    console.log('🔍 getDailyHadith called for date:', date)

    // Test database connection first
    const { data: testConnection, error: connectionError } = await supabase
      .from('hadith')
      .select('count')
      .limit(1)

    console.log('🔗 Database connection test:', { testConnection, connectionError })

    // First try to get scheduled hadith for the date
    const { data: schedule, error: scheduleError } = await supabase
      .from('daily_hadith_schedule')
      .select('hadith_ids')
      .eq('date', date)
      .maybeSingle() // Use maybeSingle instead of single to avoid 406 error

    console.log('📅 Schedule query result:', { schedule, scheduleError })

    if (schedule && schedule.hadith_ids && schedule.hadith_ids.length > 0) {
      console.log('📋 Found schedule with hadith IDs:', schedule.hadith_ids)

      const { data: hadithList, error: hadithError } = await supabase
        .from('hadith')
        .select(`
          *,
          book:hadith_books(*),
          category:hadith_categories(*)
        `)
        .in('id', schedule.hadith_ids)

      console.log('📖 Scheduled hadith query result:', { hadithList, hadithError })

      if (hadithList && hadithList.length > 0) {
        console.log('✅ Returning scheduled hadith:', hadithList.length)
        return { data: hadithList, error: hadithError }
      }
    }

    // Fallback: Get any 3 verified hadith if no schedule exists
    console.log('🔄 Trying fallback: any 3 verified hadith')
    const { data: fallbackHadith, error: fallbackError } = await supabase
      .from('hadith')
      .select(`
        *,
        book:hadith_books(*),
        category:hadith_categories(*)
      `)
      .eq('status', 'verified')
      .limit(3)

    console.log('📚 Fallback hadith query result:', { fallbackHadith, fallbackError })

    if (fallbackHadith && fallbackHadith.length > 0) {
      console.log('✅ Returning fallback hadith:', fallbackHadith.length)
      return { data: fallbackHadith, error: fallbackError }
    }

    // Try without status filter (in case status field doesn't exist or has different values)
    console.log('🔄 Trying without status filter')
    const { data: anyHadith, error: anyError } = await supabase
      .from('hadith')
      .select(`
        *,
        book:hadith_books(*),
        category:hadith_categories(*)
      `)
      .limit(3)

    console.log('📚 Any hadith query result:', { anyHadith, anyError })

    if (anyHadith && anyHadith.length > 0) {
      console.log('✅ Returning any hadith:', anyHadith.length)
      return { data: anyHadith, error: anyError }
    }

    // Try to create sample hadith data if database is empty
    console.log('🔄 Database seems empty, trying to create sample data')
    await createSampleHadithData()

    // Try again after creating sample data
    const { data: newHadith, error: newError } = await supabase
      .from('hadith')
      .select(`
        *,
        book:hadith_books(*),
        category:hadith_categories(*)
      `)
      .limit(3)

    if (newHadith && newHadith.length > 0) {
      console.log('✅ Returning newly created hadith:', newHadith.length)
      return { data: newHadith, error: newError }
    }

    // Final fallback: Use static data if database is empty
    console.log('🔄 Using static fallback data')
    const { fallbackDailyHadith } = await import('./fallback-data')
    console.log('✅ Returning static fallback data:', fallbackDailyHadith.length)
    return { data: fallbackDailyHadith, error: null }

  } catch (error) {
    console.error('❌ Error in getDailyHadith:', error)
    // Use static fallback data on any error
    const { fallbackDailyHadith } = await import('./fallback-data')
    console.log('✅ Returning static fallback data (error case):', fallbackDailyHadith.length)
    return { data: fallbackDailyHadith, error: null }
  }
}

export const getUserHadithInteractions = async (userId: string, hadithIds: string[]) => {
  const { data, error } = await supabase
    .from('user_hadith_interactions')
    .select('*')
    .eq('user_id', userId)
    .in('hadith_id', hadithIds)

  return { data, error }
}

export const markHadithAsRead = async (userId: string, hadithId: string) => {
  const { data, error } = await supabase
    .from('user_hadith_interactions')
    .upsert({
      user_id: userId,
      hadith_id: hadithId,
      is_read: true,
      read_at: new Date().toISOString()
    })
    .select()
    .single()

  return { data, error }
}

export const toggleHadithFavorite = async (userId: string, hadithId: string, isFavorited: boolean) => {
  const { data, error } = await supabase
    .from('user_hadith_interactions')
    .upsert({
      user_id: userId,
      hadith_id: hadithId,
      is_favorited: isFavorited,
      favorited_at: isFavorited ? new Date().toISOString() : null
    })
    .select()
    .single()

  return { data, error }
}

export const getHadithByCategory = async (categoryId: string, limit: number = 10, offset: number = 0) => {
  const { data, error } = await supabase
    .from('hadith')
    .select(`
      *,
      book:hadith_books(*),
      category:hadith_categories(*)
    `)
    .eq('category_id', categoryId)
    .eq('status', 'verified')
    .range(offset, offset + limit - 1)

  return { data, error }
}

export const searchHadith = async (query: string, limit: number = 10) => {
  const { data, error } = await supabase
    .from('hadith')
    .select(`
      *,
      book:hadith_books(*),
      category:hadith_categories(*)
    `)
    .or(`text_bangla.ilike.%${query}%, text_arabic.ilike.%${query}%, text_english.ilike.%${query}%`)
    .eq('status', 'verified')
    .limit(limit)

  return { data, error }
}

export const getHadithCategories = async () => {
  const { data, error } = await supabase
    .from('hadith_categories')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true })

  return { data, error }
}

export const getHadithBooks = async () => {
  const { data, error } = await supabase
    .from('hadith_books')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true })

  return { data, error }
}

// Create sample hadith data if database is empty
export const createSampleHadithData = async () => {
  try {
    console.log('🔧 Creating sample hadith data...')

    // First ensure we have books and categories
    const { data: existingBooks } = await supabase.from('hadith_books').select('id').limit(1)
    const { data: existingCategories } = await supabase.from('hadith_categories').select('id').limit(1)

    let bookId = existingBooks?.[0]?.id
    let categoryId = existingCategories?.[0]?.id

    // Create sample book if none exists
    if (!bookId) {
      const { data: newBook } = await supabase
        .from('hadith_books')
        .insert({
          name_bangla: 'সহীহ বুখারী',
          name_arabic: 'صحيح البخاري',
          author_bangla: 'ইমাম বুখারী',
          is_active: true,
          display_order: 1
        })
        .select('id')
        .single()

      bookId = newBook?.id
    }

    // Create sample category if none exists
    if (!categoryId) {
      const { data: newCategory } = await supabase
        .from('hadith_categories')
        .insert({
          name_bangla: 'ইমান ও আকিদা',
          name_arabic: 'الإيمان والعقيدة',
          is_active: true,
          display_order: 1
        })
        .select('id')
        .single()

      categoryId = newCategory?.id
    }

    // Create sample hadith
    if (bookId && categoryId) {
      const { data: hadithData, error: hadithError } = await supabase
        .from('hadith')
        .insert([
          {
            id: 'sample-hadith-1',
            hadith_number: '১',
            book_id: bookId,
            category_id: categoryId,
            chapter_bangla: 'ওহীর সূচনা',
            chapter_arabic: 'بدء الوحي',
            text_arabic: 'إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى',
            text_bangla: 'নিশ্চয়ই সকল কাজ নিয়তের উপর নির্ভরশীল এবং প্রত্যেক ব্যক্তি তার নিয়ত অনুযায়ী ফল পাবে।',
            narrator: 'উমর ইবনুল খাত্তাব (রা.)',
            grade: 'সহীহ',
            reference: 'সহীহ বুখারী, হাদিস নং ১',
            explanation: 'এই হাদিসটি ইসলামের মৌলিক নীতিমালার একটি। এটি বলে যে আমাদের সকল কাজের ফলাফল আমাদের নিয়তের উপর নির্ভর করে।',
            status: 'verified'
          },
          {
            id: 'sample-hadith-2',
            hadith_number: '২',
            book_id: bookId,
            category_id: categoryId,
            chapter_bangla: 'ইমানের বিবরণ',
            chapter_arabic: 'بيان الإيمان',
            text_arabic: 'الْإِيمَانُ بِضْعٌ وَسَبْعُونَ شُعْبَةً',
            text_bangla: 'ইমানের সত্তরটিরও বেশি শাখা রয়েছে।',
            narrator: 'আবু হুরায়রা (রা.)',
            grade: 'সহীহ',
            reference: 'সহীহ মুসলিম',
            explanation: 'এই হাদিসটি ইমানের ব্যাপকতা সম্পর্কে বলে। ইমান শুধু বিশ্বাস নয়, বরং কর্মের মাধ্যমেও প্রকাশ পায়।',
            status: 'verified'
          },
          {
            id: 'sample-hadith-3',
            hadith_number: '৩',
            book_id: bookId,
            category_id: categoryId,
            chapter_bangla: 'নামাজের গুরুত্ব',
            chapter_arabic: 'أهمية الصلاة',
            text_arabic: 'الصَّلَاةُ عِمَادُ الدِّينِ',
            text_bangla: 'নামাজ দ্বীনের স্তম্ভ।',
            narrator: 'উমর ইবনুল খাত্তাব (রা.)',
            grade: 'হাসান',
            reference: 'সুনানে তিরমিযী',
            explanation: 'এই হাদিসটি নামাজের গুরুত্ব সম্পর্কে বলে। নামাজ ইসলামের পাঁচটি স্তম্ভের মধ্যে দ্বিতীয়।',
            status: 'verified'
          }
        ])

      console.log('✅ Sample hadith created:', hadithData?.length || 0)

      // Also create daily schedule for today
      const today = new Date().toISOString().split('T')[0]
      await supabase
        .from('daily_hadith_schedule')
        .upsert({
          date: today,
          hadith_ids: ['sample-hadith-1', 'sample-hadith-2', 'sample-hadith-3']
        })

      console.log('✅ Daily schedule created for:', today)
    }

  } catch (error) {
    console.error('❌ Error creating sample hadith data:', error)
  }
}

export const getUserProgress = async (userId: string, startDate?: string, endDate?: string) => {
  let query = supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false })

  if (startDate) {
    query = query.gte('date', startDate)
  }
  if (endDate) {
    query = query.lte('date', endDate)
  }

  const { data, error } = await query
  return { data, error }
}

export const updateUserProgress = async (userId: string, date: string, progressData: any) => {
  const { data, error } = await supabase
    .from('user_progress')
    .upsert({
      user_id: userId,
      date,
      ...progressData
    })
    .select()
    .single()

  return { data, error }
}
