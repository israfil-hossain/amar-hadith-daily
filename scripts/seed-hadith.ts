import { supabase } from '../lib/supabase'
import { defaultAchievements } from '../lib/achievements'

// Sample hadith data - in production, this would come from authentic hadith databases
const sampleHadithData = [
  {
    hadith_number: '১',
    book_id: 'bukhari',
    category_id: 'faith',
    chapter_arabic: 'بدء الوحي',
    chapter_bangla: 'ওহীর সূচনা',
    chapter_english: 'Beginning of Revelation',
    text_arabic: 'إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى فَمَنْ كَانَتْ هِجْرَتُهُ إِلَى اللَّهِ وَرَسُولِهِ فَهِجْرَتُهُ إِلَى اللَّهِ وَرَسُولِهِ وَمَنْ كَانَتْ هِجْرَتُهُ لِدُنْيَا يُصِيبُهَا أَوْ امْرَأَةٍ يَنْكِحُهَا فَهِجْرَتُهُ إِلَى مَا هَاجَرَ إِلَيْهِ',
    text_bangla: 'নিশ্চয়ই সকল কাজ নিয়তের উপর নির্ভরশীল এবং প্রত্যেক ব্যক্তি তার নিয়ত অনুযায়ী ফল পাবে। যার হিজরত আল্লাহ ও তাঁর রাসূলের জন্য, তার হিজরত আল্লাহ ও তাঁর রাসূলের জন্যই গণ্য হবে। আর যার হিজরত দুনিয়া অর্জনের জন্য অথবা কোনো নারীকে বিয়ে করার জন্য, তার হিজরত সেই উদ্দেশ্যেই গণ্য হবে যার জন্য সে হিজরত করেছে।',
    text_english: 'Actions are but by intention and every man shall have but that which he intended. Therefore, he whose migration was for Allah and His Messenger, his migration was for Allah and His Messenger, and he whose migration was to achieve some worldly benefit or to take some woman in marriage, his migration was for that for which he migrated.',
    narrator: 'উমর ইবনুল খাত্তাব (রা.)',
    grade: 'সহীহ',
    reference: 'সহীহ বুখারী, হাদিস নং ১',
    explanation: 'এই হাদিসটি ইসলামের মৌলিক নীতিমালার একটি। যেকোনো কাজের সওয়াব বা গুনাহ নির্ভর করে নিয়তের উপর। নিয়ত সঠিক হলে সাধারণ কাজও ইবাদতে পরিণত হয়।',
    difficulty_level: 'beginner',
    status: 'verified',
    is_featured: true,
    is_daily_special: true
  },
  {
    hadith_number: '২',
    book_id: 'bukhari',
    category_id: 'faith',
    chapter_arabic: 'الإيمان',
    chapter_bangla: 'ঈমান',
    chapter_english: 'Faith',
    text_arabic: 'بُنِيَ الْإِسْلَامُ عَلَى خَمْسٍ شَهَادَةِ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَأَنَّ مُحَمَّدًا رَسُولُ اللَّهِ وَإِقَامِ الصَّلَاةِ وَإِيتَاءِ الزَّكَاةِ وَالْحَجِّ وَصَوْمِ رَمَضَانَ',
    text_bangla: 'ইসলাম পাঁচটি ভিত্তির উপর প্রতিষ্ঠিত: (১) এই সাক্ষ্য দেওয়া যে, আল্লাহ ছাড়া কোনো ইলাহ নেই এবং মুহাম্মাদ (সা.) আল্লাহর রাসূল, (২) নামাজ কায়েম করা, (৩) যাকাত প্রদান করা, (৪) হজ করা এবং (৫) রমজানের রোজা রাখা।',
    text_english: 'Islam is built upon five pillars: testifying that there is no deity worthy of worship except Allah and that Muhammad is the Messenger of Allah, establishing the prayer, paying the Zakat, making the pilgrimage to the House, and fasting in Ramadan.',
    narrator: 'আবদুল্লাহ ইবনে উমর (রা.)',
    grade: 'সহীহ',
    reference: 'সহীহ বুখারী, হাদিস নং ৮',
    explanation: 'এই হাদিসে ইসলামের পাঁচটি মূল স্তম্ভের কথা বলা হয়েছে। এগুলো প্রতিটি মুসলিমের জন্য অবশ্য পালনীয়।',
    difficulty_level: 'beginner',
    status: 'verified',
    is_featured: true,
    is_daily_special: true
  }
  // More hadith would be added here...
]

// Books data
const booksData = [
  {
    id: 'bukhari',
    name_arabic: 'صحيح البخاري',
    name_bangla: 'সহীহ বুখারী',
    name_english: 'Sahih al-Bukhari',
    author_bangla: 'ইমাম বুখারী (রহ.)',
    author_arabic: 'الإمام البخاري',
    author_english: 'Imam al-Bukhari',
    description: 'হাদিসের সবচেয়ে নির্ভরযোগ্য সংকলন',
    total_hadith: 7563,
    is_active: true
  },
  {
    id: 'muslim',
    name_arabic: 'صحيح مسلم',
    name_bangla: 'সহীহ মুসলিম',
    name_english: 'Sahih Muslim',
    author_bangla: 'ইমাম মুসলিম (রহ.)',
    author_arabic: 'الإمام مسلم',
    author_english: 'Imam Muslim',
    description: 'হাদিসের দ্বিতীয় সবচেয়ে নির্ভরযোগ্য সংকলন',
    total_hadith: 5362,
    is_active: true
  },
  {
    id: 'tirmidhi',
    name_arabic: 'سنن الترمذي',
    name_bangla: 'সুনানে তিরমিজি',
    name_english: 'Sunan at-Tirmidhi',
    author_bangla: 'ইমাম তিরমিজি (রহ.)',
    author_arabic: 'الإمام الترمذي',
    author_english: 'Imam at-Tirmidhi',
    description: 'সুনানে আরবাআর অন্যতম',
    total_hadith: 3956,
    is_active: true
  }
]

// Categories data
const categoriesData = [
  {
    id: 'faith',
    name_bangla: 'ঈমান ও আকীদা',
    name_arabic: 'الإيمان والعقيدة',
    name_english: 'Faith and Belief',
    description: 'ইসলামী বিশ্বাস ও আকীদা সংক্রান্ত হাদিস',
    icon: '🕌',
    color: '#10B981',
    sort_order: 1,
    is_active: true
  },
  {
    id: 'prayer',
    name_bangla: 'নামাজ',
    name_arabic: 'الصلاة',
    name_english: 'Prayer',
    description: 'নামাজ ও ইবাদত সংক্রান্ত হাদিস',
    icon: '🤲',
    color: '#3B82F6',
    sort_order: 2,
    is_active: true
  },
  {
    id: 'morals',
    name_bangla: 'আখলাক ও চরিত্র',
    name_arabic: 'الأخلاق والآداب',
    name_english: 'Morals and Ethics',
    description: 'নৈতিকতা ও চরিত্র গঠনের হাদিস',
    icon: '❤️',
    color: '#EC4899',
    sort_order: 3,
    is_active: true
  },
  {
    id: 'knowledge',
    name_bangla: 'জ্ঞান ও শিক্ষা',
    name_arabic: 'العلم والتعليم',
    name_english: 'Knowledge and Education',
    description: 'জ্ঞান অর্জন ও শিক্ষা সংক্রান্ত হাদিস',
    icon: '📚',
    color: '#8B5CF6',
    sort_order: 4,
    is_active: true
  },
  {
    id: 'family',
    name_bangla: 'পারিবারিক জীবন',
    name_arabic: 'الحياة الأسرية',
    name_english: 'Family Life',
    description: 'পারিবারিক সম্পর্ক ও দায়িত্ব সংক্রান্ত হাদিস',
    icon: '👨‍👩‍👧‍👦',
    color: '#F59E0B',
    sort_order: 5,
    is_active: true
  }
]

// Function to generate more hadith data
const generateHadithData = (count: number) => {
  const hadithList = []
  const books = ['bukhari', 'muslim', 'tirmidhi']
  const categories = ['faith', 'prayer', 'morals', 'knowledge', 'family']
  const narrators = [
    'আবু হুরায়রা (রা.)',
    'আয়েশা (রা.)',
    'আবদুল্লাহ ইবনে উমর (রা.)',
    'আনাস ইবনে মালিক (রা.)',
    'জাবির ইবনে আবদুল্লাহ (রা.)',
    'আবু সাঈদ খুদরি (রা.)',
    'উসামা ইবনে যায়েদ (রা.)',
    'আবদুল্লাহ ইবনে আব্বাস (রা.)'
  ]

  // Start with the sample data
  hadithList.push(...sampleHadithData)

  // Generate additional hadith
  for (let i = hadithList.length + 1; i <= count; i++) {
    const bookId = books[Math.floor(Math.random() * books.length)]
    const categoryId = categories[Math.floor(Math.random() * categories.length)]
    const narrator = narrators[Math.floor(Math.random() * narrators.length)]

    hadithList.push({
      hadith_number: i.toString(),
      book_id: bookId,
      category_id: categoryId,
      chapter_arabic: 'باب في الأدب',
      chapter_bangla: 'আদব অধ্যায়',
      chapter_english: 'Chapter on Manners',
      text_arabic: `هذا نص الحديث رقم ${i} باللغة العربية`,
      text_bangla: `এটি ${i} নম্বর হাদিসের বাংলা অনুবাদ। এই হাদিসে গুরুত্বপূর্ণ ইসলামী শিক্ষা রয়েছে।`,
      text_english: `This is the English translation of hadith number ${i} containing important Islamic teachings.`,
      narrator: narrator,
      grade: 'সহীহ',
      reference: `${bookId === 'bukhari' ? 'সহীহ বুখারী' : bookId === 'muslim' ? 'সহীহ মুসলিম' : 'সুনানে তিরমিজি'}, হাদিস নং ${i}`,
      explanation: `এই হাদিসটি ${categoryId === 'faith' ? 'ঈমান' : categoryId === 'prayer' ? 'নামাজ' : categoryId === 'morals' ? 'আখলাক' : categoryId === 'knowledge' ? 'জ্ঞান' : 'পারিবারিক জীবন'} সম্পর্কে গুরুত্বপূর্ণ শিক্ষা প্রদান করে।`,
      difficulty_level: ['beginner', 'intermediate', 'advanced'][Math.floor(Math.random() * 3)],
      status: 'verified',
      is_featured: Math.random() > 0.9,
      is_daily_special: Math.random() > 0.95
    })
  }

  return hadithList
}

export const seedDatabase = async () => {
  try {
    console.log('Starting database seeding...')

    // Insert books
    console.log('Inserting books...')
    const { error: booksError } = await supabase
      .from('hadith_books')
      .upsert(booksData, { onConflict: 'id' })

    if (booksError) {
      console.error('Error inserting books:', booksError)
      return
    }

    // Insert categories
    console.log('Inserting categories...')
    const { error: categoriesError } = await supabase
      .from('hadith_categories')
      .upsert(categoriesData, { onConflict: 'id' })

    if (categoriesError) {
      console.error('Error inserting categories:', categoriesError)
      return
    }

    // Insert achievements
    console.log('Inserting achievements...')
    const { error: achievementsError } = await supabase
      .from('achievements')
      .upsert(defaultAchievements, { onConflict: 'name_bangla' })

    if (achievementsError) {
      console.error('Error inserting achievements:', achievementsError)
      return
    }

    // Generate and insert hadith data
    console.log('Generating 1000 hadith...')
    const hadithData = generateHadithData(1000)

    // Insert hadith in batches to avoid timeout
    const batchSize = 50
    for (let i = 0; i < hadithData.length; i += batchSize) {
      const batch = hadithData.slice(i, i + batchSize)
      console.log(`Inserting hadith batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(hadithData.length / batchSize)}...`)

      const { error: hadithError } = await supabase
        .from('hadith')
        .upsert(batch, { onConflict: 'hadith_number,book_id' })

      if (hadithError) {
        console.error('Error inserting hadith batch:', hadithError)
        return
      }

      // Small delay between batches
      await new Promise(resolve => setTimeout(resolve, 100))
    }

    console.log('Database seeding completed successfully!')
    console.log(`Inserted:`)
    console.log(`- ${booksData.length} books`)
    console.log(`- ${categoriesData.length} categories`)
    console.log(`- ${defaultAchievements.length} achievements`)
    console.log(`- ${hadithData.length} hadith`)

  } catch (error) {
    console.error('Error seeding database:', error)
  }
}

// Run the seeding if this file is executed directly
if (require.main === module) {
  seedDatabase()
}
