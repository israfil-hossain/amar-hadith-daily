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

// Minimal hadith data that matches existing schema
const minimalHadith = [
  {
    text_arabic: 'إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى',
    text_bangla: 'নিশ্চয়ই সকল কাজ নিয়তের উপর নির্ভরশীল এবং প্রত্যেক ব্যক্তি তার নিয়ত অনুযায়ী ফল পাবে।',
    narrator: 'উমর ইবনুল খাত্তাব (রা.)',
    grade: 'সহীহ',
    explanation: 'এই হাদিসটি ইসলামের মৌলিক নীতিমালার একটি। যেকোনো কাজের সওয়াব বা গুনাহ নির্ভর করে নিয়তের উপর।'
  },
  {
    text_arabic: 'الْإِيمَانُ بِضْعٌ وَسَبْعُونَ شُعْبَةً',
    text_bangla: 'ইমানের সত্তরটিরও বেশি শাখা রয়েছে।',
    narrator: 'আবু হুরায়রা (রা.)',
    grade: 'সহীহ',
    explanation: 'এই হাদিসটি ইমানের ব্যাপকতা সম্পর্কে বলে। ইমান শুধু বিশ্বাস নয়, বরং কর্মের মাধ্যমেও প্রকাশ পায়।'
  },
  {
    text_arabic: 'الصَّلَاةُ عِمَادُ الدِّينِ',
    text_bangla: 'নামাজ দ্বীনের স্তম্ভ।',
    narrator: 'উমর ইবনুল খাত্তাব (রা.)',
    grade: 'হাসান',
    explanation: 'এই হাদিসটি নামাজের গুরুত্ব সম্পর্কে বলে। নামাজ ইসলামের পাঁচটি স্তম্ভের মধ্যে দ্বিতীয়।'
  }
]

async function populateMinimalData() {
  try {
    console.log('🚀 Starting minimal hadith data population...')

    // 1. Check existing table structure
    const { data: existingHadith, error: existingError } = await supabase
      .from('hadith')
      .select('*')
      .limit(1)

    console.log('📊 Existing hadith sample:', existingHadith?.[0] || 'No data')
    if (existingError) {
      console.log('📊 Existing error:', existingError)
    }

    // 2. Get books and categories
    const { data: books } = await supabase
      .from('hadith_books')
      .select('id, name_bangla')
      .limit(5)

    const { data: categories } = await supabase
      .from('hadith_categories')
      .select('id, name_bangla')
      .limit(5)

    if (!books || books.length === 0) {
      console.log('❌ No books found')
      return
    }

    if (!categories || categories.length === 0) {
      console.log('❌ No categories found')
      return
    }

    console.log(`📚 Found ${books.length} books and ${categories.length} categories`)

    // 3. Generate minimal hadith data
    const hadithData = []
    let counter = 1

    // Generate 50 hadith per book per category (total ~1250 hadith)
    for (const book of books) {
      for (const category of categories) {
        for (let i = 0; i < 50; i++) {
          const baseHadith = minimalHadith[i % minimalHadith.length]
          
          // Use only fields that exist in the current schema
          const hadithRecord = {
            hadith_number: counter.toString(),
            book_id: book.id,
            category_id: category.id,
            text_arabic: baseHadith.text_arabic,
            text_bangla: `${baseHadith.text_bangla} [${book.name_bangla} - ${category.name_bangla} - ${i + 1}]`,
            narrator: baseHadith.narrator,
            grade: baseHadith.grade,
            reference: `${book.name_bangla}, হাদিস নং ${counter}`,
            explanation: baseHadith.explanation,
            difficulty_level: ['beginner', 'intermediate', 'advanced'][i % 3],
            status: 'verified'
          }

          hadithData.push(hadithRecord)
          counter++
        }
      }
    }

    console.log(`📊 Generated ${hadithData.length} hadith records`)

    // 4. Insert in small batches
    const batchSize = 10 // Smaller batches to avoid issues
    let totalInserted = 0

    for (let i = 0; i < hadithData.length; i += batchSize) {
      const batch = hadithData.slice(i, i + batchSize)
      
      const { data: insertedData, error: insertError } = await supabase
        .from('hadith')
        .insert(batch)
        .select('id')

      if (insertError) {
        console.error(`❌ Error inserting batch ${Math.floor(i / batchSize) + 1}:`, insertError.message)
        
        // Try inserting one by one to identify problematic records
        for (const record of batch) {
          const { error: singleError } = await supabase
            .from('hadith')
            .insert([record])
            .select('id')
          
          if (singleError) {
            console.error('❌ Failed record:', record.hadith_number, singleError.message)
          } else {
            totalInserted++
          }
        }
        continue
      }

      totalInserted += insertedData?.length || 0
      console.log(`✅ Batch ${Math.floor(i / batchSize) + 1} inserted: ${insertedData?.length} hadith`)
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 50))
    }

    console.log(`🎉 Total hadith inserted: ${totalInserted}`)

    // 5. Create daily schedules
    if (totalInserted > 0) {
      console.log('📅 Creating daily schedules...')
      
      const { data: allHadith } = await supabase
        .from('hadith')
        .select('id')
        .limit(100)

      if (allHadith && allHadith.length > 0) {
        const schedules = []
        const today = new Date()
        
        for (let i = 0; i < 30; i++) {
          const date = new Date(today)
          date.setDate(date.getDate() + i)
          const dateString = date.toISOString().split('T')[0]
          
          // Select 3 random hadith IDs
          const shuffled = [...allHadith].sort(() => 0.5 - Math.random())
          const selectedHadith = shuffled.slice(0, 3).map(h => h.id)
          
          schedules.push({
            date: dateString,
            hadith_ids: selectedHadith
          })
        }

        const { error: scheduleError } = await supabase
          .from('daily_hadith_schedule')
          .upsert(schedules, { onConflict: 'date' })

        if (scheduleError) {
          console.error('❌ Error creating schedules:', scheduleError.message)
        } else {
          console.log(`✅ Created ${schedules.length} daily schedules`)
        }
      }
    }

    console.log('🎉 Minimal data population completed!')

  } catch (error) {
    console.error('❌ Error in populateMinimalData:', error)
  }
}

// Run the script
populateMinimalData()
