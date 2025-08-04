-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE user_role AS ENUM ('user', 'moderator', 'admin', 'scholar');
CREATE TYPE hadith_status AS ENUM ('pending', 'verified', 'rejected');
CREATE TYPE contribution_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE difficulty_level AS ENUM ('beginner', 'intermediate', 'advanced');

-- Create profiles table (extends auth.users)
CREATE TABLE profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT NOT NULL,
    full_name TEXT,
    username TEXT UNIQUE,
    avatar_url TEXT,
    role user_role DEFAULT 'user',
    bio TEXT,
    location TEXT,
    website TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    streak_count INTEGER DEFAULT 0,
    total_hadith_read INTEGER DEFAULT 0,
    total_contributions INTEGER DEFAULT 0,
    points INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    preferred_language TEXT DEFAULT 'bn',
    notification_settings JSONB DEFAULT '{"email": true, "push": true, "prayer_reminders": true}',
    privacy_settings JSONB DEFAULT '{"profile_public": true, "progress_public": true}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create hadith_books table
CREATE TABLE hadith_books (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name_arabic TEXT,
    name_bangla TEXT NOT NULL,
    name_english TEXT,
    name_urdu TEXT,
    author_arabic TEXT,
    author_bangla TEXT,
    author_english TEXT,
    description TEXT,
    total_hadith INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create hadith_categories table
CREATE TABLE hadith_categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name_arabic TEXT,
    name_bangla TEXT NOT NULL,
    name_english TEXT,
    name_urdu TEXT,
    description TEXT,
    icon TEXT,
    color TEXT,
    parent_id UUID REFERENCES hadith_categories(id),
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create hadith table
CREATE TABLE hadith (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    hadith_number TEXT,
    book_id UUID REFERENCES hadith_books(id),
    category_id UUID REFERENCES hadith_categories(id),
    chapter_arabic TEXT,
    chapter_bangla TEXT,
    chapter_english TEXT,
    text_arabic TEXT NOT NULL,
    text_bangla TEXT NOT NULL,
    text_english TEXT,
    text_urdu TEXT,
    narrator TEXT,
    grade TEXT,
    reference TEXT,
    explanation TEXT,
    keywords TEXT[],
    difficulty_level difficulty_level DEFAULT 'beginner',
    status hadith_status DEFAULT 'pending',
    audio_url TEXT,
    contributed_by UUID REFERENCES profiles(id),
    verified_by UUID REFERENCES profiles(id),
    verification_notes TEXT,
    view_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    share_count INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    is_daily_special BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_hadith_interactions table
CREATE TABLE user_hadith_interactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    hadith_id UUID REFERENCES hadith(id) ON DELETE CASCADE,
    is_read BOOLEAN DEFAULT FALSE,
    is_favorited BOOLEAN DEFAULT FALSE,
    is_memorized BOOLEAN DEFAULT FALSE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    notes TEXT,
    read_at TIMESTAMP WITH TIME ZONE,
    favorited_at TIMESTAMP WITH TIME ZONE,
    memorized_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, hadith_id)
);

-- Create hadith_contributions table
CREATE TABLE hadith_contributions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    contributor_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    hadith_data JSONB NOT NULL,
    status contribution_status DEFAULT 'pending',
    reviewer_id UUID REFERENCES profiles(id),
    review_notes TEXT,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create hadith_ratings table
CREATE TABLE hadith_ratings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    hadith_id UUID REFERENCES hadith(id) ON DELETE CASCADE,
    translation_quality INTEGER CHECK (translation_quality >= 1 AND translation_quality <= 5),
    explanation_quality INTEGER CHECK (explanation_quality >= 1 AND explanation_quality <= 5),
    overall_rating INTEGER CHECK (overall_rating >= 1 AND overall_rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, hadith_id)
);

-- Create daily_hadith_schedule table
CREATE TABLE daily_hadith_schedule (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    date DATE NOT NULL UNIQUE,
    hadith_ids UUID[] NOT NULL,
    theme TEXT,
    special_occasion TEXT,
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_progress table
CREATE TABLE user_progress (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    hadith_read_count INTEGER DEFAULT 0,
    time_spent_minutes INTEGER DEFAULT 0,
    streak_maintained BOOLEAN DEFAULT FALSE,
    achievements_unlocked TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, date)
);

-- Create achievements table
CREATE TABLE achievements (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name_bangla TEXT NOT NULL,
    name_english TEXT,
    description_bangla TEXT,
    description_english TEXT,
    icon TEXT,
    badge_color TEXT,
    criteria JSONB NOT NULL,
    points_reward INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_achievements table
CREATE TABLE user_achievements (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE,
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, achievement_id)
);

-- Create prayer_reminders table
CREATE TABLE prayer_reminders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    prayer_name TEXT NOT NULL,
    reminder_time TIME NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    timezone TEXT DEFAULT 'Asia/Dhaka',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_collections table
CREATE TABLE user_collections (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    hadith_ids UUID[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_follows table
CREATE TABLE user_follows (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    follower_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    following_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(follower_id, following_id)
);

-- Create mosques table
CREATE TABLE mosques (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    address TEXT,
    city TEXT,
    country TEXT DEFAULT 'Bangladesh',
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    imam_name TEXT,
    contact_phone TEXT,
    contact_email TEXT,
    website TEXT,
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_mosque_connections table
CREATE TABLE user_mosque_connections (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    mosque_id UUID REFERENCES mosques(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'member',
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, mosque_id)
);

-- Create scholar_questions table
CREATE TABLE scholar_questions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    scholar_id UUID REFERENCES profiles(id),
    question TEXT NOT NULL,
    answer TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    status TEXT DEFAULT 'pending',
    answered_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    data JSONB,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_hadith_status ON hadith(status);
CREATE INDEX idx_hadith_category ON hadith(category_id);
CREATE INDEX idx_hadith_book ON hadith(book_id);
CREATE INDEX idx_hadith_featured ON hadith(is_featured);
CREATE INDEX idx_hadith_daily_special ON hadith(is_daily_special);
CREATE INDEX idx_user_interactions_user ON user_hadith_interactions(user_id);
CREATE INDEX idx_user_interactions_hadith ON user_hadith_interactions(hadith_id);
CREATE INDEX idx_user_progress_user_date ON user_progress(user_id, date);
CREATE INDEX idx_daily_schedule_date ON daily_hadith_schedule(date);
CREATE INDEX idx_notifications_user_read ON notifications(user_id, is_read);

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_hadith_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE hadith_contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE hadith_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE prayer_reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_mosque_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE scholar_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- User interactions policies
CREATE POLICY "Users can view own interactions" ON user_hadith_interactions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own interactions" ON user_hadith_interactions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own interactions" ON user_hadith_interactions
    FOR UPDATE USING (auth.uid() = user_id);

-- User progress policies
CREATE POLICY "Users can view own progress" ON user_progress
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress" ON user_progress
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON user_progress
    FOR UPDATE USING (auth.uid() = user_id);

-- Notifications policies
CREATE POLICY "Users can view own notifications" ON notifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON notifications
    FOR UPDATE USING (auth.uid() = user_id);

-- Public read access for reference tables
CREATE POLICY "Hadith books are viewable by everyone" ON hadith_books
    FOR SELECT USING (true);

CREATE POLICY "Hadith categories are viewable by everyone" ON hadith_categories
    FOR SELECT USING (true);

CREATE POLICY "Verified hadith are viewable by everyone" ON hadith
    FOR SELECT USING (status = 'verified');

CREATE POLICY "Achievements are viewable by everyone" ON achievements
    FOR SELECT USING (true);

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hadith_updated_at BEFORE UPDATE ON hadith
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_interactions_updated_at BEFORE UPDATE ON user_hadith_interactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_collections_updated_at BEFORE UPDATE ON user_collections
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
