-- Insert sample hadith books
INSERT INTO hadith_books (name_bangla, name_arabic, name_english, author_bangla, author_arabic, author_english, description, total_hadith) VALUES
('সহীহ বুখারী', 'صحيح البخاري', 'Sahih al-Bukhari', 'ইমাম বুখারী (রহ.)', 'الإمام البخاري', 'Imam al-Bukhari', 'হাদিসের সবচেয়ে নির্ভরযোগ্য সংকলন', 7563),
('সহীহ মুসলিম', 'صحيح مسلم', 'Sahih Muslim', 'ইমাম মুসলিম (রহ.)', 'الإمام مسلم', 'Imam Muslim', 'দ্বিতীয় সবচেয়ে নির্ভরযোগ্য হাদিস সংকলন', 7470),
('সুনানে আবু দাউদ', 'سنن أبي داود', 'Sunan Abu Dawood', 'ইমাম আবু দাউদ (রহ.)', 'الإمام أبو داود', 'Imam Abu Dawood', 'ফিকহী বিষয়ে গুরুত্বপূর্ণ হাদিস সংকলন', 5274),
('জামে তিরমিযী', 'جامع الترمذي', 'Jami at-Tirmidhi', 'ইমাম তিরমিযী (রহ.)', 'الإمام الترمذي', 'Imam at-Tirmidhi', 'হাদিসের মান নির্ণয়ে বিশেষ অবদান', 3956),
('সুনানে নাসাঈ', 'سنن النسائي', 'Sunan an-Nasai', 'ইমাম নাসাঈ (রহ.)', 'الإمام النسائي', 'Imam an-Nasai', 'নামাজ ও পবিত্রতার হাদিস সংকলন', 5761),
('সুনানে ইবনে মাজাহ', 'سنن ابن ماجه', 'Sunan Ibn Majah', 'ইমাম ইবনে মাজাহ (রহ.)', 'الإمام ابن ماجه', 'Imam Ibn Majah', 'ষষ্ঠ প্রধান হাদিস গ্রন্থ', 4341),
('মুসনাদে আহমাদ', 'مسند أحمد', 'Musnad Ahmad', 'ইমাম আহমাদ (রহ.)', 'الإمام أحمد', 'Imam Ahmad', 'সবচেয়ে বৃহৎ হাদিস সংকলন', 26363),
('মুয়াত্তা মালিক', 'موطأ مالك', 'Muwatta Malik', 'ইমাম মালিক (রহ.)', 'الإمام مالك', 'Imam Malik', 'প্রাচীনতম হাদিস সংকলনের একটি', 1720);

-- Insert sample hadith categories
INSERT INTO hadith_categories (name_bangla, name_arabic, name_english, description, icon, color, sort_order) VALUES
('ঈমান ও আকীদা', 'الإيمان والعقيدة', 'Faith and Belief', 'ইসলামী বিশ্বাস ও আকীদা সংক্রান্ত হাদিস', '🕌', '#10B981', 1),
('নামাজ', 'الصلاة', 'Prayer', 'নামাজ ও ইবাদত সংক্রান্ত হাদিস', '🤲', '#3B82F6', 2),
('যাকাত', 'الزكاة', 'Zakat', 'যাকাত ও দান-সদকা সংক্রান্ত হাদিস', '💰', '#F59E0B', 3),
('রোজা', 'الصيام', 'Fasting', 'রোজা ও সিয়াম সংক্রান্ত হাদিস', '🌙', '#8B5CF6', 4),
('হজ্জ', 'الحج', 'Hajj', 'হজ্জ ও উমরা সংক্রান্ত হাদিস', '🕋', '#EF4444', 5),
('আখলাক ও চরিত্র', 'الأخلاق والآداب', 'Morals and Ethics', 'নৈতিকতা ও চরিত্র গঠনের হাদিস', '❤️', '#EC4899', 6),
('পারিবারিক জীবন', 'الحياة الأسرية', 'Family Life', 'পরিবার ও বিবাহ সংক্রান্ত হাদিস', '👨‍👩‍👧‍👦', '#06B6D4', 7),
('ব্যবসা-বাণিজ্য', 'التجارة والمعاملات', 'Business and Trade', 'ব্যবসা ও লেনদেন সংক্রান্ত হাদিস', '💼', '#84CC16', 8),
('জ্ঞান অর্জন', 'طلب العلم', 'Seeking Knowledge', 'ইলম ও জ্ঞান অর্জনের হাদিস', '📚', '#F97316', 9),
('দোয়া ও যিকির', 'الدعاء والذكر', 'Dua and Dhikr', 'দোয়া ও আল্লাহর স্মরণের হাদিস', '🤲', '#A855F7', 10),
('সামাজিক জীবন', 'الحياة الاجتماعية', 'Social Life', 'সমাজ ও মানুষের সাথে আচরণের হাদিস', '🤝', '#14B8A6', 11),
('খাদ্য ও পানীয়', 'الطعام والشراب', 'Food and Drink', 'খাওয়া-দাওয়া ও আদবের হাদিস', '🍽️', '#F59E0B', 12);

-- Insert sample hadith (first get the book and category IDs)
-- Note: In real implementation, you'd replace these with actual UUIDs from the inserted records

-- Sample daily hadith schedule for current week
INSERT INTO daily_hadith_schedule (date, hadith_ids, theme, special_occasion) VALUES
(CURRENT_DATE, '{}', 'দৈনিক অনুপ্রেরণা', NULL),
(CURRENT_DATE + INTERVAL '1 day', '{}', 'নামাজের গুরুত্ব', NULL),
(CURRENT_DATE + INTERVAL '2 days', '{}', 'পারিবারিক বন্ধন', NULL),
(CURRENT_DATE + INTERVAL '3 days', '{}', 'সততা ও বিশ্বস্ততা', NULL),
(CURRENT_DATE + INTERVAL '4 days', '{}', 'জ্ঞান অর্জনের ফজিলত', 'জুমার দিন'),
(CURRENT_DATE + INTERVAL '5 days', '{}', 'দান ও সদকা', NULL),
(CURRENT_DATE + INTERVAL '6 days', '{}', 'আল্লাহর রহমত', NULL);

-- Insert sample achievements
INSERT INTO achievements (name_bangla, name_english, description_bangla, description_english, icon, badge_color, criteria, points_reward) VALUES
('প্রথম পদক্ষেপ', 'First Steps', 'প্রথম হাদিস পড়েছেন', 'Read your first hadith', '🎯', '#10B981', '{"hadith_read": 1}', 10),
('নিয়মিত পাঠক', 'Regular Reader', '৭ দিন ধারাবাহিক হাদিস পড়েছেন', 'Read hadith for 7 consecutive days', '📚', '#3B82F6', '{"streak_days": 7}', 50),
('জ্ঞান অন্বেষী', 'Knowledge Seeker', '৫০টি হাদিস পড়েছেন', 'Read 50 hadith', '🔍', '#8B5CF6', '{"total_hadith": 50}', 100),
('হাদিস প্রেমী', 'Hadith Lover', '১০০টি হাদিস পড়েছেন', 'Read 100 hadith', '❤️', '#EC4899', '{"total_hadith": 100}', 200),
('অবদানকারী', 'Contributor', 'প্রথম হাদিস অবদান রেখেছেন', 'Made your first hadith contribution', '🤝', '#F59E0B', '{"contributions": 1}', 25),
('মাসিক চ্যাম্পিয়ন', 'Monthly Champion', '৩০ দিন ধারাবাহিক হাদিস পড়েছেন', 'Read hadith for 30 consecutive days', '🏆', '#EF4444', '{"streak_days": 30}', 300),
('সংগ্রাহক', 'Collector', '২০টি হাদিস পছন্দের তালিকায় যোগ করেছেন', 'Added 20 hadith to favorites', '⭐', '#F97316', '{"favorites": 20}', 75),
('শিক্ষক', 'Teacher', '৫টি হাদিস শেয়ার করেছেন', 'Shared 5 hadith', '👨‍🏫', '#06B6D4', '{"shares": 5}', 40);

-- Insert some sample hadith content
-- Note: These are sample hadith for demonstration. In production, you'd have proper Arabic text and authentic sources.

-- First, let's create a function to get book and category IDs
DO $$
DECLARE
    bukhari_id UUID;
    muslim_id UUID;
    faith_category_id UUID;
    prayer_category_id UUID;
    morals_category_id UUID;
BEGIN
    -- Get book IDs
    SELECT id INTO bukhari_id FROM hadith_books WHERE name_bangla = 'সহীহ বুখারী' LIMIT 1;
    SELECT id INTO muslim_id FROM hadith_books WHERE name_bangla = 'সহীহ মুসলিম' LIMIT 1;
    
    -- Get category IDs
    SELECT id INTO faith_category_id FROM hadith_categories WHERE name_bangla = 'ঈমান ও আকীদা' LIMIT 1;
    SELECT id INTO prayer_category_id FROM hadith_categories WHERE name_bangla = 'নামাজ' LIMIT 1;
    SELECT id INTO morals_category_id FROM hadith_categories WHERE name_bangla = 'আখলাক ও চরিত্র' LIMIT 1;
    
    -- Insert sample hadith
    INSERT INTO hadith (
        hadith_number, book_id, category_id, chapter_bangla, chapter_arabic,
        text_arabic, text_bangla, text_english, narrator, grade, reference,
        explanation, difficulty_level, status, is_featured
    ) VALUES
    (
        '১',
        bukhari_id,
        faith_category_id,
        'ওহীর সূচনা',
        'بدء الوحي',
        'إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى',
        'নিশ্চয়ই সকল কাজ নিয়তের উপর নির্ভরশীল এবং প্রত্যেক ব্যক্তি তার নিয়ত অনুযায়ী ফল পাবে।',
        'Actions are but by intention and every man shall have but that which he intended.',
        'উমর ইবনুল খাত্তাব (রা.)',
        'সহীহ',
        'সহীহ বুখারী, হাদিস নং ১',
        'এই হাদিসটি ইসলামের মৌলিক নীতিমালার একটি। যেকোনো কাজের সওয়াব বা গুনাহ নির্ভর করে নিয়তের উপর।',
        'beginner',
        'verified',
        true
    ),
    (
        '২৩৩',
        muslim_id,
        prayer_category_id,
        'নামাজের ফজিলত',
        'فضل الصلاة',
        'الصَّلاَةُ عِمَادُ الدِّينِ',
        'নামাজ দ্বীনের স্তম্ভ।',
        'Prayer is the pillar of religion.',
        'আবু হুরায়রা (রা.)',
        'সহীহ',
        'সহীহ মুসলিম, হাদিস নং ২৩৩',
        'নামাজ ইসলামের পাঁচটি স্তম্ভের মধ্যে দ্বিতীয় এবং সবচেয়ে গুরুত্বপূর্ণ ইবাদত।',
        'beginner',
        'verified',
        true
    ),
    (
        '৬০১৮',
        bukhari_id,
        morals_category_id,
        'সুন্দর আচরণ',
        'حسن الخلق',
        'إِنَّ مِنْ أَحَبِّكُمْ إِلَيَّ وَأَقْرَبِكُمْ مِنِّي مَجْلِسًا يَوْمَ الْقِيَامَةِ أَحَاسِنَكُمْ أَخْلاَقًا',
        'তোমাদের মধ্যে যারা আমার নিকট সবচেয়ে প্রিয় এবং কিয়ামতের দিন আমার সবচেয়ে কাছে বসবে, তারা হল তোমাদের মধ্যে যারা সর্বোত্তম চরিত্রের অধিকারী।',
        'The most beloved of you to me and the nearest of you to me in the Hereafter are those who are the best in character.',
        'জাবির (রা.)',
        'হাসান',
        'সহীহ বুখারী, হাদিস নং ৬০১৮',
        'সুন্দর চরিত্র মানুষকে আল্লাহ ও রাসূলের নিকটবর্তী করে। এটি ইসলামের মূল শিক্ষা।',
        'intermediate',
        'verified',
        false
    );
END $$;
