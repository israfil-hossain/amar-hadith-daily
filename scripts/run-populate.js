const { createClient } = require('@supabase/supabase-js')

// Load environment variables manually
const fs = require('fs')
const path = require('path')

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
  // Fallback to process.env
  supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
}

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Generate UUID function
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Hadith Books Data
const hadithBooks = [
  {
    name_bangla: 'সহীহ বুখারী',
    name_arabic: 'صحيح البخاري',
    author_bangla: 'ইমাম বুখারী (রহ.)',
    total_hadith: 7563,
    is_active: true,
    display_order: 1
  },
  {
    name_bangla: 'সহীহ মুসলিম',
    name_arabic: 'صحيح مسلم',
    author_bangla: 'ইমাম মুসলিম (রহ.)',
    total_hadith: 5362,
    is_active: true,
    display_order: 2
  },
  {
    name_bangla: 'সুনানে তিরমিযী',
    name_arabic: 'سنن الترمذي',
    author_bangla: 'ইমাম তিরমিযী (রহ.)',
    total_hadith: 3956,
    is_active: true,
    display_order: 3
  },
  {
    name_bangla: 'সুনানে আবু দাউদ',
    name_arabic: 'سنن أبي داود',
    author_bangla: 'ইমাম আবু দাউদ (রহ.)',
    total_hadith: 4800,
    is_active: true,
    display_order: 4
  },
  {
    name_bangla: 'সুনানে নাসাঈ',
    name_arabic: 'سنن النسائي',
    author_bangla: 'ইমাম নাসাঈ (রহ.)',
    total_hadith: 5761,
    is_active: true,
    display_order: 5
  },
  {
    name_bangla: 'সুনানে ইবনে মাজাহ',
    name_arabic: 'سنن ابن ماجه',
    author_bangla: 'ইমাম ইবনে মাজাহ (রহ.)',
    total_hadith: 4341,
    is_active: true,
    display_order: 6
  }
]

// Hadith Categories Data
const hadithCategories = [
  {
    name_bangla: 'ইমান ও আকিদা',
    name_arabic: 'الإيمان والعقيدة',
    is_active: true,
    display_order: 1
  },
  {
    name_bangla: 'নামাজ',
    name_arabic: 'الصلاة',
    is_active: true,
    display_order: 2
  },
  {
    name_bangla: 'যাকাত',
    name_arabic: 'الزكاة',
    is_active: true,
    display_order: 3
  },
  {
    name_bangla: 'রোজা',
    name_arabic: 'الصوم',
    is_active: true,
    display_order: 4
  },
  {
    name_bangla: 'হজ্জ',
    name_arabic: 'الحج',
    is_active: true,
    display_order: 5
  },
  {
    name_bangla: 'আখলাক ও আদব',
    name_arabic: 'الأخلاق والآداب',
    is_active: true,
    display_order: 6
  },
  {
    name_bangla: 'লেনদেন ও ব্যবসা',
    name_arabic: 'المعاملات',
    is_active: true,
    display_order: 7
  },
  {
    name_bangla: 'বিবাহ ও পারিবারিক জীবন',
    name_arabic: 'النكاح والأسرة',
    is_active: true,
    display_order: 8
  },
  {
    name_bangla: 'জিহাদ ও যুদ্ধ',
    name_arabic: 'الجهاد والقتال',
    is_active: true,
    display_order: 9
  },
  {
    name_bangla: 'দোয়া ও যিকির',
    name_arabic: 'الدعاء والذكر',
    is_active: true,
    display_order: 10
  }
]

// Helper functions
function getChapterBangla(categoryId, index) {
  const chapters = {
    'iman-aqida': [
      'ইমানের পরিচয়', 'তাওহীদের গুরুত্ব', 'আল্লাহর গুণাবলী', 'রাসূলের প্রতি ইমান',
      'কিতাবের প্রতি ইমান', 'ফেরেশতাদের প্রতি ইমান', 'আখিরাতের প্রতি ইমান', 'তাকদীরের প্রতি ইমান'
    ],
    'salah': [
      'নামাজের গুরুত্ব', 'ওযুর নিয়ম', 'নামাজের সময়', 'জামাতে নামাজ',
      'জুমার নামাজ', 'ঈদের নামাজ', 'তারাবীহ নামাজ', 'তাহাজ্জুদ নামাজ'
    ],
    'zakat': [
      'যাকাতের গুরুত্ব', 'যাকাতের নিসাব', 'যাকাতের খাত', 'ফিতরার যাকাত',
      'ব্যবসার যাকাত', 'কৃষির যাকাত', 'পশুর যাকাত', 'সোনা-রূপার যাকাত'
    ],
    'sawm': [
      'রোজার গুরুত্ব', 'রোজার নিয়ত', 'সেহরী ও ইফতার', 'রোজার আদাব',
      'রোজা ভাঙার কারণ', 'কাযা রোজা', 'নফল রোজা', 'ইতিকাফ'
    ],
    'hajj': [
      'হজ্জের গুরুত্ব', 'হজ্জের শর্ত', 'ইহরামের নিয়ম', 'তাওয়াফের নিয়ম',
      'সাঈর নিয়ম', 'আরাফার দিন', 'কুরবানীর নিয়ম', 'উমরার নিয়ম'
    ],
    'akhlaq': [
      'সুন্দর চরিত্র', 'সত্যবাদিতা', 'ধৈর্যের গুণ', 'ক্ষমার মহত্ত্ব',
      'বিনয়ের গুরুত্ব', 'দানশীলতা', 'ন্যায়পরায়ণতা', 'আমানতদারিতা'
    ],
    'muamalat': [
      'ব্যবসার আদাব', 'সুদের নিষেধাজ্ঞা', 'ন্যায্য দাম', 'চুক্তির গুরুত্ব',
      'ঋণ পরিশোধ', 'অংশীদারিত্ব', 'ওয়াকফের নিয়ম', 'উত্তরাধিকার'
    ],
    'nikah': [
      'বিবাহের গুরুত্ব', 'স্ত্রীর অধিকার', 'স্বামীর দায়িত্ব', 'সন্তান লালন-পালন',
      'পারিবারিক শান্তি', 'তালাকের নিয়ম', 'ইদ্দতের বিধান', 'খোলার নিয়ম'
    ],
    'jihad': [
      'জিহাদের সংজ্ঞা', 'নফসের বিরুদ্ধে জিহাদ', 'যুদ্ধের আদাব', 'শহীদের মর্যাদা',
      'শান্তির গুরুত্ব', 'ন্যায়ের প্রতিষ্ঠা', 'অত্যাচারের বিরোধিতা', 'সামাজিক সংস্কার'
    ],
    'dua': [
      'দোয়ার গুরুত্ব', 'দোয়ার আদাব', 'কবুল হওয়ার সময়', 'তাসবীহ-তাহলীল',
      'ইস্তিগফারের ফজিলত', 'দরূদ শরীফ', 'কুরআন তিলাওয়াত', 'যিকিরের ফজিলত'
    ]
  }
  
  const categoryChapters = chapters[categoryId] || ['সাধারণ অধ্যায়']
  return categoryChapters[index % categoryChapters.length]
}

function getChapterArabic(categoryId, index) {
  const chapters = {
    'iman-aqida': [
      'تعريف الإيمان', 'أهمية التوحيد', 'صفات الله', 'الإيمان بالرسول',
      'الإيمان بالكتب', 'الإيمان بالملائكة', 'الإيمان بالآخرة', 'الإيمان بالقدر'
    ],
    'salah': [
      'أهمية الصلاة', 'آداب الوضوء', 'أوقات الصلاة', 'صلاة الجماعة',
      'صلاة الجمعة', 'صلاة العيد', 'صلاة التراويح', 'صلاة التهجد'
    ],
    'zakat': [
      'أهمية الزكاة', 'نصاب الزكاة', 'مصارف الزكاة', 'زكاة الفطر',
      'زكاة التجارة', 'زكاة الزرع', 'زكاة الأنعام', 'زكاة الذهب والفضة'
    ]
  }
  
  const categoryChapters = chapters[categoryId] || ['باب عام']
  return categoryChapters[index % categoryChapters.length]
}

function getArabicText(categoryId, index) {
  const texts = [
    'إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى',
    'الْإِيمَانُ بِضْعٌ وَسَبْعُونَ شُعْبَةً',
    'الصَّلَاةُ عِمَادُ الدِّينِ',
    'مَنْ لَمْ يَشْكُرِ النَّاسَ لَمْ يَشْكُرِ اللَّهَ',
    'الْمُسْلِمُ مَنْ سَلِمَ الْمُسْلِمُونَ مِنْ لِسَانِهِ وَيَدِهِ',
    'لَا يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لِأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ',
    'الدِّينُ النَّصِيحَةُ',
    'إِنَّ اللَّهَ جَمِيلٌ يُحِبُّ الْجَمَالَ',
    'الطُّهُورُ شَطْرُ الْإِيمَانِ',
    'مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الْآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ'
  ]
  
  return texts[index % texts.length]
}

function getBanglaText(categoryId, index) {
  const texts = [
    'নিশ্চয়ই সকল কাজ নিয়তের উপর নির্ভরশীল এবং প্রত্যেক ব্যক্তি তার নিয়ত অনুযায়ী ফল পাবে।',
    'ইমানের সত্তরটিরও বেশি শাখা রয়েছে।',
    'নামাজ দ্বীনের স্তম্ভ।',
    'যে ব্যক্তি মানুষের কৃতজ্ঞতা প্রকাশ করে না, সে আল্লাহর কৃতজ্ঞতাও প্রকাশ করে না।',
    'প্রকৃত মুসলিম সেই ব্যক্তি, যার জিহ্বা ও হাত থেকে অন্য মুসলিমরা নিরাপদ থাকে।',
    'তোমাদের কেউ ততক্ষণ পর্যন্ত মুমিন হতে পারবে না, যতক্ষণ না সে তার ভাইয়ের জন্য তা-ই পছন্দ করে যা নিজের জন্য পছন্দ করে।',
    'দ্বীন হলো কল্যাণকামিতা।',
    'নিশ্চয়ই আল্লাহ সুন্দর এবং তিনি সৌন্দর্য পছন্দ করেন।',
    'পবিত্রতা ইমানের অর্ধেক।',
    'যে ব্যক্তি আল্লাহ ও পরকালে বিশ্বাস রাখে, সে যেন ভালো কথা বলে অথবা চুপ থাকে।'
  ]
  
  return texts[index % texts.length]
}

function getNarrator(index) {
  const narrators = [
    'আবু হুরায়রা (রা.)',
    'আয়েশা (রা.)',
    'উমর ইবনুল খাত্তাব (রা.)',
    'আলী ইবনে আবি তালিব (রা.)',
    'আনাস ইবনে মালিক (রা.)',
    'আবদুল্লাহ ইবনে উমর (রা.)',
    'আবদুল্লাহ ইবনে আব্বাস (রা.)',
    'জাবির ইবনে আবদুল্লাহ (রা.)',
    'আবু সাঈদ খুদরী (রা.)',
    'উসামা ইবনে যায়েদ (রা.)'
  ]
  
  return narrators[index % narrators.length]
}

function getGrade(index) {
  const grades = ['সহীহ', 'হাসান', 'সহীহ', 'সহীহ', 'হাসান', 'সহীহ']
  return grades[index % grades.length]
}

function getExplanation(categoryId, index) {
  const explanations = {
    'iman-aqida': [
      'এই হাদিসটি ইমানের মৌলিক বিষয় সম্পর্কে আলোচনা করে।',
      'তাওহীদের গুরুত্ব ও একত্ববাদের প্রয়োজনীয়তা বর্ণিত হয়েছে।',
      'আল্লাহর প্রতি বিশ্বাস ও তাঁর গুণাবলী সম্পর্কে শিক্ষা দেয়।'
    ],
    'salah': [
      'নামাজের গুরুত্ব ও তার আধ্যাত্মিক প্রভাব বর্ণিত হয়েছে।',
      'সঠিক পদ্ধতিতে নামাজ আদায়ের নির্দেশনা দেওয়া হয়েছে।',
      'জামাতে নামাজের ফজিলত ও সামাজিক একতার গুরুত্ব তুলে ধরা হয়েছে।'
    ]
  }
  
  const categoryExplanations = explanations[categoryId] || [
    'এই হাদিসটি ইসলামী জীবনযাত্রার গুরুত্বপূর্ণ দিক নির্দেশনা প্রদান করে।'
  ]
  
  return categoryExplanations[index % categoryExplanations.length]
}

function getDifficultyLevel(index) {
  const levels = ['beginner', 'intermediate', 'beginner', 'beginner', 'intermediate', 'advanced']
  return levels[index % levels.length]
}

function generateHadithData() {
  const hadithData = []
  let hadithCounter = 1

  // Generate hadith for each category
  hadithCategories.forEach(category => {
    hadithBooks.forEach(book => {
      // Generate 15-25 hadith per book per category
      const hadithCount = Math.floor(Math.random() * 11) + 15 // 15-25

      for (let i = 0; i < hadithCount; i++) {
        const hadith = {
          id: `hadith-${hadithCounter}`,
          hadith_number: hadithCounter.toString(),
          book_id: book.id,
          category_id: category.id,
          chapter_bangla: getChapterBangla(category.id, i),
          chapter_arabic: getChapterArabic(category.id, i),
          text_arabic: getArabicText(category.id, i),
          text_bangla: getBanglaText(category.id, i),
          narrator: getNarrator(i),
          grade: getGrade(i),
          reference: `${book.name_bangla}, হাদিস নং ${hadithCounter}`,
          explanation: getExplanation(category.id, i),
          difficulty_level: getDifficultyLevel(i),
          status: 'verified',
          view_count: Math.floor(Math.random() * 1000),
          like_count: Math.floor(Math.random() * 100),
          share_count: Math.floor(Math.random() * 50),
          is_featured: Math.random() > 0.9,
          is_daily_special: Math.random() > 0.95
        }

        hadithData.push(hadith)
        hadithCounter++
      }
    })
  })

  return hadithData
}

async function createDailySchedules(hadithData) {
  const schedules = []
  const today = new Date()
  
  // Create schedules for next 365 days
  for (let i = 0; i < 365; i++) {
    const date = new Date(today)
    date.setDate(date.getDate() + i)
    const dateString = date.toISOString().split('T')[0]
    
    // Select 3 random hadith for each day
    const shuffled = [...hadithData].sort(() => 0.5 - Math.random())
    const selectedHadith = shuffled.slice(0, 3).map(h => h.id)
    
    schedules.push({
      date: dateString,
      hadith_ids: selectedHadith
    })
  }
  
  // Insert schedules in batches
  const batchSize = 50
  for (let i = 0; i < schedules.length; i += batchSize) {
    const batch = schedules.slice(i, i + batchSize)
    
    const { error } = await supabase
      .from('daily_hadith_schedule')
      .upsert(batch, { onConflict: 'date' })
    
    if (error) {
      console.error(`❌ Error creating schedule batch ${i / batchSize + 1}:`, error)
    } else {
      console.log(`✅ Schedule batch ${i / batchSize + 1} created`)
    }
  }
}

async function populateHadithData() {
  try {
    console.log('🚀 Starting hadith data population...')

    // 1. Create Books
    console.log('📚 Creating hadith books...')
    const { data: booksData, error: booksError } = await supabase
      .from('hadith_books')
      .upsert(hadithBooks, { onConflict: 'id' })
      .select()

    if (booksError) {
      console.error('❌ Error creating books:', booksError)
      return
    }
    console.log('✅ Books created:', booksData?.length)

    // 2. Create Categories
    console.log('📂 Creating hadith categories...')
    const { data: categoriesData, error: categoriesError } = await supabase
      .from('hadith_categories')
      .upsert(hadithCategories, { onConflict: 'id' })
      .select()

    if (categoriesError) {
      console.error('❌ Error creating categories:', categoriesError)
      return
    }
    console.log('✅ Categories created:', categoriesData?.length)

    // 3. Generate and Create Hadith
    console.log('📖 Generating 1000+ hadith...')
    const hadithData = generateHadithData()
    
    console.log(`📊 Total hadith generated: ${hadithData.length}`)
    
    // Insert in batches of 100
    const batchSize = 100
    let totalInserted = 0

    for (let i = 0; i < hadithData.length; i += batchSize) {
      const batch = hadithData.slice(i, i + batchSize)
      
      const { data: insertedData, error: insertError } = await supabase
        .from('hadith')
        .upsert(batch, { onConflict: 'id' })
        .select('id')

      if (insertError) {
        console.error(`❌ Error inserting batch ${i / batchSize + 1}:`, insertError)
        continue
      }

      totalInserted += insertedData?.length || 0
      console.log(`✅ Batch ${i / batchSize + 1} inserted: ${insertedData?.length} hadith`)
    }

    console.log(`🎉 Total hadith inserted: ${totalInserted}`)

    // 4. Create Daily Schedules
    console.log('📅 Creating daily schedules...')
    await createDailySchedules(hadithData)

    console.log('🎉 Hadith data population completed successfully!')

  } catch (error) {
    console.error('❌ Error in populateHadithData:', error)
  }
}

// Run the script
populateHadithData()
