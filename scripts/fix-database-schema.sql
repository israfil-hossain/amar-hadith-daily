-- Fix Database Schema and RLS Policies
-- Run this in Supabase SQL Editor

-- 1. Disable RLS temporarily for data insertion
ALTER TABLE hadith_books DISABLE ROW LEVEL SECURITY;
ALTER TABLE hadith_categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE hadith DISABLE ROW LEVEL SECURITY;
ALTER TABLE daily_hadith_schedule DISABLE ROW LEVEL SECURITY;

-- 2. Create hadith_books table if not exists
CREATE TABLE IF NOT EXISTS hadith_books (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name_bangla TEXT NOT NULL,
    name_arabic TEXT,
    author_bangla TEXT,
    author_arabic TEXT,
    total_hadith INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    display_order INTEGER DEFAULT 0,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create hadith_categories table if not exists
CREATE TABLE IF NOT EXISTS hadith_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name_bangla TEXT NOT NULL,
    name_arabic TEXT,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create hadith table if not exists
CREATE TABLE IF NOT EXISTS hadith (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    hadith_number TEXT,
    book_id UUID REFERENCES hadith_books(id),
    category_id UUID REFERENCES hadith_categories(id),
    chapter_bangla TEXT,
    chapter_arabic TEXT,
    text_arabic TEXT NOT NULL,
    text_bangla TEXT NOT NULL,
    text_english TEXT,
    narrator TEXT,
    grade TEXT,
    reference TEXT,
    explanation TEXT,
    difficulty_level TEXT DEFAULT 'beginner',
    status TEXT DEFAULT 'verified',
    view_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    share_count INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    is_daily_special BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Create daily_hadith_schedule table if not exists
CREATE TABLE IF NOT EXISTS daily_hadith_schedule (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    date DATE NOT NULL UNIQUE,
    hadith_ids UUID[] NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Insert sample books
INSERT INTO hadith_books (name_bangla, name_arabic, author_bangla, total_hadith, is_active, display_order) VALUES
('সহীহ বুখারী', 'صحيح البخاري', 'ইমাম বুখারী (রহ.)', 7563, true, 1),
('সহীহ মুসলিম', 'صحيح مسلم', 'ইমাম মুসলিম (রহ.)', 5362, true, 2),
('সুনানে তিরমিযী', 'سنن الترمذي', 'ইমাম তিরমিযী (রহ.)', 3956, true, 3),
('সুনানে আবু দাউদ', 'سنن أبي داود', 'ইমাম আবু দাউদ (রহ.)', 4800, true, 4),
('সুনানে নাসাঈ', 'سنن النسائي', 'ইমাম নাসাঈ (রহ.)', 5761, true, 5),
('সুনানে ইবনে মাজাহ', 'سنن ابن ماجه', 'ইমাম ইবনে মাজাহ (রহ.)', 4341, true, 6)
ON CONFLICT DO NOTHING;

-- 7. Insert sample categories
INSERT INTO hadith_categories (name_bangla, name_arabic, is_active, display_order) VALUES
('ইমান ও আকিদা', 'الإيمان والعقيدة', true, 1),
('নামাজ', 'الصلاة', true, 2),
('যাকাত', 'الزكاة', true, 3),
('রোজা', 'الصوم', true, 4),
('হজ্জ', 'الحج', true, 5),
('আখলাক ও আদব', 'الأخلاق والآداب', true, 6),
('লেনদেন ও ব্যবসা', 'المعاملات', true, 7),
('বিবাহ ও পারিবারিক জীবন', 'النكاح والأسرة', true, 8),
('জিহাদ ও যুদ্ধ', 'الجهاد والقتال', true, 9),
('দোয়া ও যিকির', 'الدعاء والذكر', true, 10)
ON CONFLICT DO NOTHING;

-- 8. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_hadith_book_id ON hadith(book_id);
CREATE INDEX IF NOT EXISTS idx_hadith_category_id ON hadith(category_id);
CREATE INDEX IF NOT EXISTS idx_hadith_status ON hadith(status);
CREATE INDEX IF NOT EXISTS idx_daily_schedule_date ON daily_hadith_schedule(date);

-- 9. Enable RLS back with proper policies
ALTER TABLE hadith_books ENABLE ROW LEVEL SECURITY;
ALTER TABLE hadith_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE hadith ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_hadith_schedule ENABLE ROW LEVEL SECURITY;

-- 10. Create public read policies
DROP POLICY IF EXISTS "Public read access for hadith_books" ON hadith_books;
CREATE POLICY "Public read access for hadith_books" ON hadith_books
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read access for hadith_categories" ON hadith_categories;
CREATE POLICY "Public read access for hadith_categories" ON hadith_categories
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read access for hadith" ON hadith;
CREATE POLICY "Public read access for hadith" ON hadith
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read access for daily_hadith_schedule" ON daily_hadith_schedule;
CREATE POLICY "Public read access for daily_hadith_schedule" ON daily_hadith_schedule
    FOR SELECT USING (true);

-- 11. Create admin insert policies (for service role)
DROP POLICY IF EXISTS "Service role can insert hadith_books" ON hadith_books;
CREATE POLICY "Service role can insert hadith_books" ON hadith_books
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Service role can insert hadith_categories" ON hadith_categories;
CREATE POLICY "Service role can insert hadith_categories" ON hadith_categories
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Service role can insert hadith" ON hadith;
CREATE POLICY "Service role can insert hadith" ON hadith
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Service role can insert daily_hadith_schedule" ON daily_hadith_schedule;
CREATE POLICY "Service role can insert daily_hadith_schedule" ON daily_hadith_schedule
    FOR INSERT WITH CHECK (true);

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'Database schema fixed successfully! You can now run the population script.';
END $$;
