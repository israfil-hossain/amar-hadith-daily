const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Load environment variables manually
let supabaseUrl, supabaseKey

try {
  const envPath = path.join(__dirname, '..', '.env.local')
  const envContent = fs.readFileSync(envPath, 'utf8')
  
  envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=')
    if (key === 'NEXT_PUBLIC_SUPABASE_URL') {
      supabaseUrl = value
    }
    if (key === 'NEXT_PUBLIC_SUPABASE_ANON_KEY') {
      supabaseKey = value
    }
  })
} catch (error) {
  console.error('Error reading .env.local:', error.message)
  process.exit(1)
}

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Sample hadith data
const sampleHadith = [
  {
    hadith_number: '১',
    chapter_bangla: 'ওহীর সূচনা',
    chapter_arabic: 'بدء الوحي',
    text_arabic: 'إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى',
    text_bangla: 'নিশ্চয়ই সকল কাজ নিয়তের উপর নির্ভরশীল এবং প্রত্যেক ব্যক্তি তার নিয়ত অনুযায়ী ফল পাবে।',
    text_english: 'Actions are but by intention and every man shall have but that which he intended.',
    narrator: 'উমর ইবনুল খাত্তাব (রা.)',
    grade: 'সহীহ',
    explanation: 'এই হাদিসটি ইসলামের মৌলিক নীতিমালার একটি। যেকোনো কাজের সওয়াব বা গুনাহ নির্ভর করে নিয়তের উপর।'
  },
  {
    hadith_number: '২',
    chapter_bangla: 'ইমানের বিবরণ',
    chapter_arabic: 'بيان الإيمان',
    text_arabic: 'الْإِيمَانُ بِضْعٌ وَسَبْعُونَ شُعْبَةً',
    text_bangla: 'ইমানের সত্তরটিরও বেশি শাখা রয়েছে।',
    text_english: 'Faith has seventy-odd branches.',
    narrator: 'আবু হুরায়রা (রা.)',
    grade: 'সহীহ',
    explanation: 'এই হাদিসটি ইমানের ব্যাপকতা সম্পর্কে বলে। ইমান শুধু বিশ্বাস নয়, বরং কর্মের মাধ্যমেও প্রকাশ পায়।'
  },
  {
    hadith_number: '৩',
    chapter_bangla: 'নামাজের গুরুত্ব',
    chapter_arabic: 'أهمية الصلاة',
    text_arabic: 'الصَّلَاةُ عِمَادُ الدِّينِ',
    text_bangla: 'নামাজ দ্বীনের স্তম্ভ।',
    text_english: 'Prayer is the pillar of religion.',
    narrator: 'উমর ইবনুল খাত্তাব (রা.)',
    grade: 'হাসান',
    explanation: 'এই হাদিসটি নামাজের গুরুত্ব সম্পর্কে বলে। নামাজ ইসলামের পাঁচটি স্তম্ভের মধ্যে দ্বিতীয়।'
  }
]

async function populateBasicData() {
  try {
    console.log('🚀 Starting basic hadith data population...')

    // 1. Check if books exist
    const { data: existingBooks } = await supabase
      .from('hadith_books')
      .select('id, name_bangla')
      .limit(5)

    console.log('📚 Existing books:', existingBooks?.length || 0)

    // 2. Check if categories exist
    const { data: existingCategories } = await supabase
      .from('hadith_categories')
      .select('id, name_bangla')
      .limit(5)

    console.log('📂 Existing categories:', existingCategories?.length || 0)

    if (!existingBooks || existingBooks.length === 0) {
      console.log('❌ No books found. Please run the SQL schema script first.')
      console.log('📝 Go to Supabase SQL Editor and run: scripts/fix-database-schema.sql')
      return
    }

    if (!existingCategories || existingCategories.length === 0) {
      console.log('❌ No categories found. Please run the SQL schema script first.')
      return
    }

    // 3. Generate hadith data
    console.log('📖 Generating hadith data...')
    const hadithData = []
    let counter = 1

    // Generate 100 hadith per book per category (total ~6000 hadith)
    for (const book of existingBooks) {
      for (const category of existingCategories) {
        for (let i = 0; i < 100; i++) {
          const baseHadith = sampleHadith[i % sampleHadith.length]
          
          hadithData.push({
            hadith_number: counter.toString(),
            book_id: book.id,
            category_id: category.id,
            chapter_bangla: baseHadith.chapter_bangla + ` (${i + 1})`,
            chapter_arabic: baseHadith.chapter_arabic,
            text_arabic: baseHadith.text_arabic,
            text_bangla: baseHadith.text_bangla + ` [${book.name_bangla} - ${category.name_bangla}]`,
            text_english: baseHadith.text_english,
            narrator: baseHadith.narrator,
            grade: baseHadith.grade,
            reference: `${book.name_bangla}, হাদিস নং ${counter}`,
            explanation: baseHadith.explanation,
            difficulty_level: ['beginner', 'intermediate', 'advanced'][i % 3],
            status: 'verified',
            view_count: Math.floor(Math.random() * 1000),
            like_count: Math.floor(Math.random() * 100),
            share_count: Math.floor(Math.random() * 50),
            is_featured: Math.random() > 0.9,
            is_daily_special: Math.random() > 0.95
          })
          
          counter++
        }
      }
    }

    console.log(`📊 Generated ${hadithData.length} hadith records`)

    // 4. Insert in batches
    const batchSize = 50
    let totalInserted = 0

    for (let i = 0; i < hadithData.length; i += batchSize) {
      const batch = hadithData.slice(i, i + batchSize)
      
      const { data: insertedData, error: insertError } = await supabase
        .from('hadith')
        .insert(batch)
        .select('id')

      if (insertError) {
        console.error(`❌ Error inserting batch ${Math.floor(i / batchSize) + 1}:`, insertError)
        continue
      }

      totalInserted += insertedData?.length || 0
      console.log(`✅ Batch ${Math.floor(i / batchSize) + 1} inserted: ${insertedData?.length} hadith`)
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100))
    }

    console.log(`🎉 Total hadith inserted: ${totalInserted}`)

    // 5. Create daily schedules for next 30 days
    console.log('📅 Creating daily schedules...')
    const schedules = []
    const today = new Date()
    
    for (let i = 0; i < 30; i++) {
      const date = new Date(today)
      date.setDate(date.getDate() + i)
      const dateString = date.toISOString().split('T')[0]
      
      // Select 3 random hadith IDs
      const { data: randomHadith } = await supabase
        .from('hadith')
        .select('id')
        .limit(3)
        .order('created_at', { ascending: false })
      
      if (randomHadith && randomHadith.length > 0) {
        schedules.push({
          date: dateString,
          hadith_ids: randomHadith.map(h => h.id)
        })
      }
    }

    if (schedules.length > 0) {
      const { error: scheduleError } = await supabase
        .from('daily_hadith_schedule')
        .upsert(schedules, { onConflict: 'date' })

      if (scheduleError) {
        console.error('❌ Error creating schedules:', scheduleError)
      } else {
        console.log(`✅ Created ${schedules.length} daily schedules`)
      }
    }

    console.log('🎉 Data population completed successfully!')

  } catch (error) {
    console.error('❌ Error in populateBasicData:', error)
  }
}

// Run the script
populateBasicData()
