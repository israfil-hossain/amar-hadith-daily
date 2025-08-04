-- Insert hadith books
INSERT INTO public.hadith_books (id, name_arabic, name_bangla, name_english, author_arabic, author_bangla, author_english) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'صحيح البخاري', 'সহীহ বুখারী', 'Sahih al-Bukhari', 'الإمام البخاري', 'ইমাম বুখারী', 'Imam Bukhari'),
('550e8400-e29b-41d4-a716-446655440002', 'صحيح مسلم', 'সহীহ মুসলিম', 'Sahih Muslim', 'الإمام مسلم', 'ইমাম মুসলিম', 'Imam Muslim'),
('550e8400-e29b-41d4-a716-446655440003', 'سنن الترمذي', 'সুনানে তিরমিযী', 'Jami at-Tirmidhi', 'الإمام الترمذي', 'ইমাম তিরমিযী', 'Imam Tirmidhi'),
('550e8400-e29b-41d4-a716-446655440004', 'سنن أبي داود', 'সুনানে আবু দাউদ', 'Sunan Abi Dawud', 'الإمام أبو داود', 'ইমাম আবু দাউদ', 'Imam Abu Dawud'),
('550e8400-e29b-41d4-a716-446655440005', 'سنن النسائي', 'সুনানে নাসাঈ', 'Sunan an-Nasai', 'الإمام النسائي', 'ইমাম নাসাঈ', 'Imam Nasai'),
('550e8400-e29b-41d4-a716-446655440006', 'سنن ابن ماجه', 'সুনানে ইবনে মাজাহ', 'Sunan Ibn Majah', 'الإمام ابن ماجه', 'ইমাম ইবনে মাজাহ', 'Imam Ibn Majah');

-- Insert hadith categories
INSERT INTO public.hadith_categories (id, name_bangla, name_english, name_arabic, icon, color) VALUES
('650e8400-e29b-41d4-a716-446655440001', 'ঈমান ও আকীদা', 'Faith and Belief', 'الإيمان والعقيدة', '🤲', '#10B981'),
('650e8400-e29b-41d4-a716-446655440002', 'নামাজ', 'Prayer', 'الصلاة', '🕌', '#3B82F6'),
('650e8400-e29b-41d4-a716-446655440003', 'রোজা', 'Fasting', 'الصيام', '🌙', '#8B5CF6'),
('650e8400-e29b-41d4-a716-446655440004', 'হজ', 'Pilgrimage', 'الحج', '🕋', '#F59E0B'),
('650e8400-e29b-41d4-a716-446655440005', 'যাকাত', 'Charity', 'الزكاة', '💰', '#EF4444'),
('650e8400-e29b-41d4-a716-446655440006', 'আদব ও আখলাক', 'Manners and Ethics', 'الآداب والأخلاق', '❤️', '#EC4899'),
('650e8400-e29b-41d4-a716-446655440007', 'দোয়া ও যিকির', 'Supplication and Remembrance', 'الدعاء والذكر', '🤲', '#06B6D4'),
('650e8400-e29b-41d4-a716-446655440008', 'পারিবারিক জীবন', 'Family Life', 'الحياة الأسرية', '👨‍👩‍👧‍👦', '#84CC16'),
('650e8400-e29b-41d4-a716-446655440009', 'ব্যবসা-বাণিজ্য', 'Business and Trade', 'التجارة والمعاملات', '💼', '#F97316'),
('650e8400-e29b-41d4-a716-446655440010', 'জ্ঞান অর্জন', 'Seeking Knowledge', 'طلب العلم', '📚', '#6366F1');

-- Insert sample hadith
INSERT INTO public.hadith (
    id, hadith_number, book_id, category_id, 
    chapter_bangla, text_arabic, text_bangla, text_english,
    narrator, grade, reference, difficulty_level, status
) VALUES
(
    '750e8400-e29b-41d4-a716-446655440001',
    '১',
    '550e8400-e29b-41d4-a716-446655440001',
    '650e8400-e29b-41d4-a716-446655440001',
    'ওহীর সূচনা',
    'إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى',
    'নিশ্চয়ই সকল কাজ নিয়তের উপর নির্ভরশীল এবং প্রত্যেক ব্যক্তি তার নিয়ত অনুযায়ী ফল পাবে।',
    'Verily, actions are but by intention and every man shall have only that which he intended.',
    'উমর ইবনুল খাত্তাব (রা.)',
    'সহীহ',
    'সহীহ বুখারী, হাদিস নং ১',
    'beginner',
    'verified'
),
(
    '750e8400-e29b-41d4-a716-446655440002',
    '৬০১৮',
    '550e8400-e29b-41d4-a716-446655440001',
    '650e8400-e29b-41d4-a716-446655440006',
    'আদব',
    'مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الْآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ',
    'যে ব্যক্তি আল্লাহ ও আখিরাতে বিশ্বাস রাখে, সে যেন ভালো কথা বলে অথবা চুপ থাকে।',
    'Whoever believes in Allah and the Last Day should speak good or keep silent.',
    'আবু হুরায়রা (রা.)',
    'সহীহ',
    'সহীহ বুখারী, হাদিস নং ৬০১৮',
    'beginner',
    'verified'
),
(
    '750e8400-e29b-41d4-a716-446655440003',
    '৪৮১',
    '550e8400-e29b-41d4-a716-446655440001',
    '650e8400-e29b-41d4-a716-446655440002',
    'সালাত',
    'الْمُؤْمِنُ لِلْمُؤْمِنِ كَالْبُنْيَانِ يَشُدُّ بَعْضُهُ بَعْضًا',
    'মুমিন মুমিনের জন্য প্রাচীরের মতো, যার এক অংশ অপর অংশকে মজবুত রাখে।',
    'The believer to another believer is like a building whose different parts enforce each other.',
    'আবু মুসা (রা.)',
    'সহীহ',
    'সহীহ বুখারী, হাদিস নং ৪৮১',
    'intermediate',
    'verified'
);

-- Insert achievements
INSERT INTO public.achievements (
    id, name_bangla, name_english, description_bangla, description_english,
    icon, badge_color, criteria, points_reward
) VALUES
(
    '850e8400-e29b-41d4-a716-446655440001',
    'প্রথম পদক্ষেপ',
    'First Step',
    'প্রথম হাদিস পড়ার জন্য অভিনন্দন!',
    'Congratulations on reading your first hadith!',
    '🎯',
    '#10B981',
    '{"hadith_read": 1}',
    10
),
(
    '850e8400-e29b-41d4-a716-446655440002',
    'নিয়মিত পাঠক',
    'Regular Reader',
    '৭ দিন ধারাবাহিক হাদিস পড়ার জন্য অভিনন্দন!',
    'Congratulations on reading hadith for 7 consecutive days!',
    '🔥',
    '#F59E0B',
    '{"streak_days": 7}',
    50
),
(
    '850e8400-e29b-41d4-a716-446655440003',
    'জ্ঞান অন্বেষী',
    'Knowledge Seeker',
    '১০০টি হাদিস পড়ার জন্য অভিনন্দন!',
    'Congratulations on reading 100 hadith!',
    '📚',
    '#3B82F6',
    '{"hadith_read": 100}',
    100
),
(
    '850e8400-e29b-41d4-a716-446655440004',
    'কমিউনিটি সদস্য',
    'Community Member',
    'প্রথম হাদিস অবদানের জন্য অভিনন্দন!',
    'Congratulations on your first hadith contribution!',
    '🤝',
    '#EC4899',
    '{"contributions": 1}',
    25
);

-- Insert sample daily hadith schedule for current month
INSERT INTO public.daily_hadith_schedule (date, hadith_ids, theme) VALUES
(CURRENT_DATE, ARRAY['750e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440002', '750e8400-e29b-41d4-a716-446655440003'], 'নিয়ত ও আদবের গুরুত্ব'),
(CURRENT_DATE + INTERVAL '1 day', ARRAY['750e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440002', '750e8400-e29b-41d4-a716-446655440003'], 'ইমান ও আমল'),
(CURRENT_DATE + INTERVAL '2 days', ARRAY['750e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440002', '750e8400-e29b-41d4-a716-446655440003'], 'সামাজিক বন্ধন');

-- Insert sample mosques
INSERT INTO public.mosques (id, name, address, city, country, imam_name) VALUES
('950e8400-e29b-41d4-a716-446655440001', 'বায়তুল মুকাররম জাতীয় মসজিদ', 'পল্টন, ঢাকা', 'ঢাকা', 'বাংলাদেশ', 'মাওলানা মুহাম্মদ সালাহউদ্দিন'),
('950e8400-e29b-41d4-a716-446655440002', 'ঢাকা বিশ্ববিদ্যালয় কেন্দ্রীয় মসজিদ', 'ঢাকা বিশ্ববিদ্যালয়', 'ঢাকা', 'বাংলাদেশ', 'প্রফেসর ড. মুহাম্মদ আব্দুর রহিম'),
('950e8400-e29b-41d4-a716-446655440003', 'গুলশান কেন্দ্রীয় মসজিদ', 'গুলশান-২, ঢাকা', 'ঢাকা', 'বাংলাদেশ', 'মাওলানা আব্দুল করিম');
