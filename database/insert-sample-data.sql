-- Insert sample data for Amar Hadith Daily

-- Insert Hadith Books
INSERT INTO hadith_books (name_bangla, name_arabic, name_english, author_bangla, author_arabic, total_hadith, display_order) VALUES
('সহীহ বুখারী', 'صحيح البخاري', 'Sahih Bukhari', 'ইমাম বুখারী', 'الإمام البخاري', 7563, 1),
('সহীহ মুসলিম', 'صحيح مسلم', 'Sahih Muslim', 'ইমাম মুসলিম', 'الإمام مسلم', 7470, 2),
('সুনান আবু দাউদ', 'سنن أبي داود', 'Sunan Abu Dawud', 'ইমাম আবু দাউদ', 'الإمام أبو داود', 5274, 3),
('জামে তিরমিযী', 'جامع الترمذي', 'Jami Tirmidhi', 'ইমাম তিরমিযী', 'الإمام الترمذي', 3956, 4),
('সুনান নাসাঈ', 'سنن النسائي', 'Sunan Nasai', 'ইমাম নাসাঈ', 'الإمام النسائي', 5761, 5),
('সুনান ইবনে মাজাহ', 'سنن ابن ماجه', 'Sunan Ibn Majah', 'ইমাম ইবনে মাজাহ', 'الإمام ابن ماجه', 4341, 6);

-- Insert Hadith Categories
INSERT INTO hadith_categories (name_bangla, name_arabic, name_english, display_order) VALUES
('ঈমান', 'الإيمان', 'Faith', 1),
('নামাজ', 'الصلاة', 'Prayer', 2),
('যাকাত', 'الزكاة', 'Zakat', 3),
('রোজা', 'الصوم', 'Fasting', 4),
('হজ্জ', 'الحج', 'Hajj', 5),
('আখলাক', 'الأخلاق', 'Morality', 6),
('পারিবারিক জীবন', 'الحياة الأسرية', 'Family Life', 7),
('ব্যবসা-বাণিজ্য', 'التجارة', 'Business', 8),
('জ্ঞান অর্জন', 'طلب العلم', 'Seeking Knowledge', 9),
('দোয়া ও যিকির', 'الدعاء والذكر', 'Dua and Dhikr', 10);

-- Insert Sample Hadith (using subqueries to get book and category IDs)
INSERT INTO hadith (id, hadith_number, text_bangla, text_arabic, narrator, book_id, category_id, chapter_bangla, status)
SELECT
    'fallback-1',
    '১',
    'নিয়তের উপর আমল নির্ভরশীল। প্রত্যেক ব্যক্তি যা নিয়ত করে তাই পায়।',
    'إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى',
    'উমর ইবনুল খাত্তাব (রা.)',
    (SELECT id FROM hadith_books WHERE name_bangla = 'সহীহ বুখারী' LIMIT 1),
    (SELECT id FROM hadith_categories WHERE name_bangla = 'ঈমান' LIMIT 1),
    'নিয়তের গুরুত্ব',
    'verified'
WHERE NOT EXISTS (SELECT 1 FROM hadith WHERE id = 'fallback-1');

INSERT INTO hadith (id, hadith_number, text_bangla, text_arabic, narrator, book_id, category_id, chapter_bangla, status)
SELECT
    'fallback-2',
    '২',
    'মুসলমান সে, যার হাত ও মুখ থেকে অন্য মুসলমান নিরাপদ থাকে।',
    'الْمُسْلِمُ مَنْ سَلِمَ الْمُسْلِمُونَ مِنْ لِسَانِهِ وَيَدِهِ',
    'আবদুল্লাহ ইবনে আমর (রা.)',
    (SELECT id FROM hadith_books WHERE name_bangla = 'সহীহ বুখারী' LIMIT 1),
    (SELECT id FROM hadith_categories WHERE name_bangla = 'আখলাক' LIMIT 1),
    'মুসলমানের পরিচয়',
    'verified'
WHERE NOT EXISTS (SELECT 1 FROM hadith WHERE id = 'fallback-2');

INSERT INTO hadith (id, hadith_number, text_bangla, text_arabic, narrator, book_id, category_id, chapter_bangla, status)
SELECT
    'fallback-3',
    '৩',
    'যে ব্যক্তি আল্লাহ ও পরকালের প্রতি ঈমান রাখে, সে যেন ভালো কথা বলে অথবা চুপ থাকে।',
    'مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الْآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ',
    'আবু হুরায়রা (রা.)',
    (SELECT id FROM hadith_books WHERE name_bangla = 'সহীহ বুখারী' LIMIT 1),
    (SELECT id FROM hadith_categories WHERE name_bangla = 'আখলাক' LIMIT 1),
    'কথাবার্তার আদব',
    'verified'
WHERE NOT EXISTS (SELECT 1 FROM hadith WHERE id = 'fallback-3');

-- Insert Daily Hadith Schedule for today
INSERT INTO daily_hadith_schedule (date, hadith_ids) VALUES
(CURRENT_DATE, ARRAY['fallback-1', 'fallback-2', 'fallback-3'])
ON CONFLICT (date) DO UPDATE SET hadith_ids = EXCLUDED.hadith_ids;

-- Insert Daily Hadith Schedule for next few days
INSERT INTO daily_hadith_schedule (date, hadith_ids) VALUES
(CURRENT_DATE + INTERVAL '1 day', ARRAY['hadith-4', 'hadith-5', 'fallback-1']),
(CURRENT_DATE + INTERVAL '2 days', ARRAY['fallback-2', 'hadith-4', 'fallback-3']),
(CURRENT_DATE + INTERVAL '3 days', ARRAY['hadith-5', 'fallback-1', 'hadith-4'])
ON CONFLICT (date) DO UPDATE SET hadith_ids = EXCLUDED.hadith_ids;
