-- Create missing database tables for Amar Hadith Daily

-- 1. Daily Hadith Schedule Table
CREATE TABLE IF NOT EXISTS daily_hadith_schedule (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    date DATE NOT NULL UNIQUE,
    hadith_ids TEXT[] NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. User Hadith Interactions Table
CREATE TABLE IF NOT EXISTS user_hadith_interactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    hadith_id TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    is_favorited BOOLEAN DEFAULT FALSE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    read_at TIMESTAMP WITH TIME ZONE,
    favorited_at TIMESTAMP WITH TIME ZONE,
    rated_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, hadith_id)
);

-- 3. Hadith Books Table
CREATE TABLE IF NOT EXISTS hadith_books (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name_bangla TEXT NOT NULL,
    name_arabic TEXT,
    name_english TEXT,
    description TEXT,
    author_bangla TEXT,
    author_arabic TEXT,
    author_english TEXT,
    total_hadith INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Hadith Categories Table
CREATE TABLE IF NOT EXISTS hadith_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name_bangla TEXT NOT NULL,
    name_arabic TEXT,
    name_english TEXT,
    description TEXT,
    parent_id UUID REFERENCES hadith_categories(id),
    is_active BOOLEAN DEFAULT TRUE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Hadith Table
CREATE TABLE IF NOT EXISTS hadith (
    id TEXT PRIMARY KEY,
    hadith_number TEXT,
    text_bangla TEXT NOT NULL,
    text_arabic TEXT,
    text_english TEXT,
    narrator TEXT,
    explanation TEXT,
    book_id UUID REFERENCES hadith_books(id),
    category_id UUID REFERENCES hadith_categories(id),
    chapter_bangla TEXT,
    chapter_arabic TEXT,
    chapter_english TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected')),
    contributor_id UUID REFERENCES auth.users(id),
    verified_by UUID REFERENCES auth.users(id),
    verified_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. User Achievements Table
CREATE TABLE IF NOT EXISTS user_achievements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    achievement_type TEXT NOT NULL,
    achievement_name TEXT NOT NULL,
    description TEXT,
    points_earned INTEGER DEFAULT 0,
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, achievement_type)
);

-- 7. Hadith Contributions Table
CREATE TABLE IF NOT EXISTS hadith_contributions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    contributor_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    hadith_number TEXT,
    text_bangla TEXT NOT NULL,
    text_arabic TEXT,
    narrator TEXT,
    explanation TEXT,
    book_id UUID REFERENCES hadith_books(id),
    category_id UUID REFERENCES hadith_categories(id),
    chapter_bangla TEXT,
    chapter_arabic TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    moderator_notes TEXT,
    reviewed_by UUID REFERENCES auth.users(id),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Comments Table
CREATE TABLE IF NOT EXISTS comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    hadith_id TEXT NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    likes_count INTEGER DEFAULT 0,
    is_approved BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Comment Likes Table
CREATE TABLE IF NOT EXISTS comment_likes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(comment_id, user_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_daily_hadith_schedule_date ON daily_hadith_schedule(date);
CREATE INDEX IF NOT EXISTS idx_user_hadith_interactions_user_id ON user_hadith_interactions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_hadith_interactions_hadith_id ON user_hadith_interactions(hadith_id);
CREATE INDEX IF NOT EXISTS idx_hadith_book_id ON hadith(book_id);
CREATE INDEX IF NOT EXISTS idx_hadith_category_id ON hadith(category_id);
CREATE INDEX IF NOT EXISTS idx_hadith_status ON hadith(status);
CREATE INDEX IF NOT EXISTS idx_comments_hadith_id ON comments(hadith_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE daily_hadith_schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_hadith_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE hadith_books ENABLE ROW LEVEL SECURITY;
ALTER TABLE hadith_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE hadith ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE hadith_contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE comment_likes ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies

-- Daily Hadith Schedule - Read only for authenticated users
CREATE POLICY "Daily hadith schedule is viewable by authenticated users" ON daily_hadith_schedule
    FOR SELECT USING (auth.role() = 'authenticated');

-- User Hadith Interactions - Users can only access their own data
CREATE POLICY "Users can view own hadith interactions" ON user_hadith_interactions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own hadith interactions" ON user_hadith_interactions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own hadith interactions" ON user_hadith_interactions
    FOR UPDATE USING (auth.uid() = user_id);

-- Hadith Books - Read only for authenticated users
CREATE POLICY "Hadith books are viewable by authenticated users" ON hadith_books
    FOR SELECT USING (auth.role() = 'authenticated');

-- Hadith Categories - Read only for authenticated users
CREATE POLICY "Hadith categories are viewable by authenticated users" ON hadith_categories
    FOR SELECT USING (auth.role() = 'authenticated');

-- Hadith - Read verified hadith for authenticated users
CREATE POLICY "Verified hadith are viewable by authenticated users" ON hadith
    FOR SELECT USING (auth.role() = 'authenticated' AND status = 'verified');

-- User Achievements - Users can only access their own achievements
CREATE POLICY "Users can view own achievements" ON user_achievements
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own achievements" ON user_achievements
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Hadith Contributions - Users can access their own contributions
CREATE POLICY "Users can view own contributions" ON hadith_contributions
    FOR SELECT USING (auth.uid() = contributor_id);

CREATE POLICY "Users can insert own contributions" ON hadith_contributions
    FOR INSERT WITH CHECK (auth.uid() = contributor_id);

CREATE POLICY "Users can update own contributions" ON hadith_contributions
    FOR UPDATE USING (auth.uid() = contributor_id);

-- Comments - Authenticated users can read approved comments
CREATE POLICY "Approved comments are viewable by authenticated users" ON comments
    FOR SELECT USING (auth.role() = 'authenticated' AND is_approved = true);

CREATE POLICY "Users can insert own comments" ON comments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own comments" ON comments
    FOR UPDATE USING (auth.uid() = user_id);

-- Comment Likes - Users can manage their own likes
CREATE POLICY "Users can view comment likes" ON comment_likes
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can insert own comment likes" ON comment_likes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own comment likes" ON comment_likes
    FOR DELETE USING (auth.uid() = user_id);
