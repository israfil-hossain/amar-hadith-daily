-- Simple Database Setup for Amar Hadith Daily
-- Run this in Supabase SQL Editor

-- 1. Create Tables (if they don't exist)

-- Daily Hadith Schedule Table
CREATE TABLE IF NOT EXISTS daily_hadith_schedule (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    date DATE NOT NULL UNIQUE,
    hadith_ids TEXT[] NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Hadith Interactions Table
CREATE TABLE IF NOT EXISTS user_hadith_interactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    hadith_id TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    is_favorited BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP WITH TIME ZONE,
    favorited_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, hadith_id)
);

-- Hadith Books Table
CREATE TABLE IF NOT EXISTS hadith_books (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name_bangla TEXT NOT NULL,
    name_arabic TEXT,
    author_bangla TEXT,
    total_hadith INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Hadith Categories Table
CREATE TABLE IF NOT EXISTS hadith_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name_bangla TEXT NOT NULL,
    name_arabic TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Hadith Table (with TEXT id for fallback hadith)
CREATE TABLE IF NOT EXISTS hadith (
    id TEXT PRIMARY KEY,
    hadith_number TEXT,
    text_bangla TEXT NOT NULL,
    text_arabic TEXT,
    narrator TEXT,
    book_id UUID REFERENCES hadith_books(id),
    category_id UUID REFERENCES hadith_categories(id),
    chapter_bangla TEXT,
    status TEXT DEFAULT 'verified',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Enable RLS
ALTER TABLE daily_hadith_schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_hadith_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE hadith_books ENABLE ROW LEVEL SECURITY;
ALTER TABLE hadith_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE hadith ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS Policies
CREATE POLICY "Allow read access to daily_hadith_schedule" ON daily_hadith_schedule FOR SELECT USING (true);
CREATE POLICY "Allow read access to hadith_books" ON hadith_books FOR SELECT USING (true);
CREATE POLICY "Allow read access to hadith_categories" ON hadith_categories FOR SELECT USING (true);
CREATE POLICY "Allow read access to hadith" ON hadith FOR SELECT USING (true);

CREATE POLICY "Users can manage own interactions" ON user_hadith_interactions 
FOR ALL USING (auth.uid() = user_id);

-- 4. Insert Sample Data

-- Insert Books
INSERT INTO hadith_books (name_bangla, name_arabic, author_bangla, total_hadith, display_order) 
VALUES 
('সহীহ বুখারী', 'صحيح البخاري', 'ইমাম বুখারী', 7563, 1),
('সহীহ মুসলিম', 'صحيح مسلم', 'ইমাম মুসলিম', 7470, 2)
ON CONFLICT DO NOTHING;

-- Insert Categories
INSERT INTO hadith_categories (name_bangla, name_arabic, display_order) 
VALUES 
('ঈমান', 'الإيمان', 1),
('আখলাক', 'الأخلاق', 6)
ON CONFLICT DO NOTHING;

-- Insert Hadith (using variables for IDs)
DO $$
DECLARE
    bukhari_id UUID;
    faith_id UUID;
    morality_id UUID;
BEGIN
    -- Get book and category IDs
    SELECT id INTO bukhari_id FROM hadith_books WHERE name_bangla = 'সহীহ বুখারী' LIMIT 1;
    SELECT id INTO faith_id FROM hadith_categories WHERE name_bangla = 'ঈমান' LIMIT 1;
    SELECT id INTO morality_id FROM hadith_categories WHERE name_bangla = 'আখলাক' LIMIT 1;
    
    -- Insert hadith if IDs found
    IF bukhari_id IS NOT NULL AND faith_id IS NOT NULL AND morality_id IS NOT NULL THEN
        INSERT INTO hadith (id, hadith_number, text_bangla, text_arabic, narrator, book_id, category_id, chapter_bangla, status) 
        VALUES 
        ('fallback-1', '১', 'নিয়তের উপর আমল নির্ভরশীল। প্রত্যেক ব্যক্তি যা নিয়ত করে তাই পায়।', 'إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى', 'উমর ইবনুল খাত্তাব (রা.)', bukhari_id, faith_id, 'নিয়তের গুরুত্ব', 'verified'),
        ('fallback-2', '২', 'মুসলমান সে, যার হাত ও মুখ থেকে অন্য মুসলমান নিরাপদ থাকে।', 'الْمُسْلِمُ مَنْ سَلِمَ الْمُسْلِمُونَ مِنْ لِسَانِهِ وَيَدِهِ', 'আবদুল্লাহ ইবনে আমর (রা.)', bukhari_id, morality_id, 'মুসলমানের পরিচয়', 'verified'),
        ('fallback-3', '৩', 'যে ব্যক্তি আল্লাহ ও পরকালের প্রতি ঈমান রাখে, সে যেন ভালো কথা বলে অথবা চুপ থাকে।', 'مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الْآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ', 'আবু হুরায়রা (রা.)', bukhari_id, morality_id, 'কথাবার্তার আদব', 'verified')
        ON CONFLICT (id) DO NOTHING;
    END IF;
END $$;

-- Insert Daily Schedule for today
INSERT INTO daily_hadith_schedule (date, hadith_ids) 
VALUES (CURRENT_DATE, ARRAY['fallback-1', 'fallback-2', 'fallback-3'])
ON CONFLICT (date) DO UPDATE SET hadith_ids = EXCLUDED.hadith_ids;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_hadith_interactions_user_id ON user_hadith_interactions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_hadith_interactions_hadith_id ON user_hadith_interactions(hadith_id);
CREATE INDEX IF NOT EXISTS idx_daily_hadith_schedule_date ON daily_hadith_schedule(date);

-- Success message
SELECT 'Database setup completed successfully!' as message;
