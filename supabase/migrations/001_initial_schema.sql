-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create custom types
CREATE TYPE user_role AS ENUM ('user', 'moderator', 'admin', 'scholar');
CREATE TYPE hadith_status AS ENUM ('pending', 'verified', 'rejected');
CREATE TYPE contribution_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE difficulty_level AS ENUM ('beginner', 'intermediate', 'advanced');

-- Users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
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
    privacy_settings JSONB DEFAULT '{"profile_public": true, "progress_public": false}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Hadith books/sources
CREATE TABLE public.hadith_books (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name_arabic TEXT NOT NULL,
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

-- Hadith categories
CREATE TABLE public.hadith_categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name_arabic TEXT,
    name_bangla TEXT NOT NULL,
    name_english TEXT,
    name_urdu TEXT,
    description TEXT,
    icon TEXT,
    color TEXT,
    parent_id UUID REFERENCES public.hadith_categories(id),
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Main hadith table
CREATE TABLE public.hadith (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    hadith_number TEXT,
    book_id UUID REFERENCES public.hadith_books(id),
    category_id UUID REFERENCES public.hadith_categories(id),
    chapter_arabic TEXT,
    chapter_bangla TEXT,
    chapter_english TEXT,
    text_arabic TEXT NOT NULL,
    text_bangla TEXT NOT NULL,
    text_english TEXT,
    text_urdu TEXT,
    narrator TEXT,
    grade TEXT, -- Sahih, Hasan, Daif, etc.
    reference TEXT,
    explanation TEXT,
    keywords TEXT[],
    difficulty_level difficulty_level DEFAULT 'beginner',
    status hadith_status DEFAULT 'verified',
    audio_url TEXT,
    contributed_by UUID REFERENCES public.profiles(id),
    verified_by UUID REFERENCES public.profiles(id),
    verification_notes TEXT,
    view_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    share_count INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    is_daily_special BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User hadith interactions
CREATE TABLE public.user_hadith_interactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    hadith_id UUID REFERENCES public.hadith(id) ON DELETE CASCADE,
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

-- Hadith contributions
CREATE TABLE public.hadith_contributions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    contributor_id UUID REFERENCES public.profiles(id),
    hadith_data JSONB NOT NULL,
    status contribution_status DEFAULT 'pending',
    reviewer_id UUID REFERENCES public.profiles(id),
    review_notes TEXT,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Community ratings for hadith translations
CREATE TABLE public.hadith_ratings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    hadith_id UUID REFERENCES public.hadith(id) ON DELETE CASCADE,
    translation_quality INTEGER CHECK (translation_quality >= 1 AND translation_quality <= 5),
    explanation_quality INTEGER CHECK (explanation_quality >= 1 AND explanation_quality <= 5),
    overall_rating INTEGER CHECK (overall_rating >= 1 AND overall_rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, hadith_id)
);

-- Daily hadith schedule
CREATE TABLE public.daily_hadith_schedule (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    date DATE NOT NULL UNIQUE,
    hadith_ids UUID[] NOT NULL,
    theme TEXT,
    special_occasion TEXT,
    created_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User progress tracking
CREATE TABLE public.user_progress (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    hadith_read_count INTEGER DEFAULT 0,
    time_spent_minutes INTEGER DEFAULT 0,
    streak_maintained BOOLEAN DEFAULT FALSE,
    achievements_unlocked TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, date)
);

-- User achievements/badges
CREATE TABLE public.achievements (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name_bangla TEXT NOT NULL,
    name_english TEXT,
    description_bangla TEXT,
    description_english TEXT,
    icon TEXT,
    badge_color TEXT,
    criteria JSONB NOT NULL, -- Conditions to unlock
    points_reward INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User earned achievements
CREATE TABLE public.user_achievements (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    achievement_id UUID REFERENCES public.achievements(id),
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, achievement_id)
);

-- Prayer time reminders
CREATE TABLE public.prayer_reminders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    prayer_name TEXT NOT NULL, -- Fajr, Dhuhr, Asr, Maghrib, Isha
    reminder_time TIME NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    timezone TEXT DEFAULT 'Asia/Dhaka',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User collections (custom hadith lists)
CREATE TABLE public.user_collections (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    hadith_ids UUID[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Social features - Following system
CREATE TABLE public.user_follows (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    follower_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    following_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(follower_id, following_id),
    CHECK (follower_id != following_id)
);

-- Mosque/Community connections
CREATE TABLE public.mosques (
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

-- User mosque connections
CREATE TABLE public.user_mosque_connections (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    mosque_id UUID REFERENCES public.mosques(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'member', -- member, imam, admin
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, mosque_id)
);

-- Scholar Q&A system
CREATE TABLE public.scholar_questions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    scholar_id UUID REFERENCES public.profiles(id),
    question TEXT NOT NULL,
    answer TEXT,
    is_public BOOLEAN DEFAULT TRUE,
    status TEXT DEFAULT 'pending', -- pending, answered, closed
    answered_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notification system
CREATE TABLE public.notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- daily_hadith, achievement, reminder, etc.
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    data JSONB,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_profiles_username ON public.profiles(username);
CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_hadith_book_id ON public.hadith(book_id);
CREATE INDEX idx_hadith_category_id ON public.hadith(category_id);
CREATE INDEX idx_hadith_status ON public.hadith(status);
CREATE INDEX idx_hadith_difficulty ON public.hadith(difficulty_level);
CREATE INDEX idx_user_hadith_interactions_user_id ON public.user_hadith_interactions(user_id);
CREATE INDEX idx_user_hadith_interactions_hadith_id ON public.user_hadith_interactions(hadith_id);
CREATE INDEX idx_user_hadith_interactions_read ON public.user_hadith_interactions(is_read);
CREATE INDEX idx_user_progress_user_date ON public.user_progress(user_id, date);
CREATE INDEX idx_daily_hadith_schedule_date ON public.daily_hadith_schedule(date);
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_is_read ON public.notifications(is_read);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_hadith_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hadith_contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hadith_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prayer_reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_mosque_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scholar_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for user_hadith_interactions
CREATE POLICY "Users can view their own interactions" ON public.user_hadith_interactions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own interactions" ON public.user_hadith_interactions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own interactions" ON public.user_hadith_interactions
    FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for hadith_contributions
CREATE POLICY "Users can view their own contributions" ON public.hadith_contributions
    FOR SELECT USING (auth.uid() = contributor_id);

CREATE POLICY "Users can insert their own contributions" ON public.hadith_contributions
    FOR INSERT WITH CHECK (auth.uid() = contributor_id);

CREATE POLICY "Moderators can view all contributions" ON public.hadith_contributions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('moderator', 'admin', 'scholar')
        )
    );

-- RLS Policies for user_progress
CREATE POLICY "Users can view their own progress" ON public.user_progress
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress" ON public.user_progress
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress" ON public.user_progress
    FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for notifications
CREATE POLICY "Users can view their own notifications" ON public.notifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON public.notifications
    FOR UPDATE USING (auth.uid() = user_id);

-- Functions for automatic profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for automatic profile creation
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update user stats
CREATE OR REPLACE FUNCTION public.update_user_stats()
RETURNS TRIGGER AS $$
BEGIN
    -- Update total_hadith_read when a hadith is marked as read
    IF TG_OP = 'INSERT' AND NEW.is_read = true THEN
        UPDATE public.profiles
        SET total_hadith_read = total_hadith_read + 1
        WHERE id = NEW.user_id;
    ELSIF TG_OP = 'UPDATE' AND OLD.is_read = false AND NEW.is_read = true THEN
        UPDATE public.profiles
        SET total_hadith_read = total_hadith_read + 1
        WHERE id = NEW.user_id;
    ELSIF TG_OP = 'UPDATE' AND OLD.is_read = true AND NEW.is_read = false THEN
        UPDATE public.profiles
        SET total_hadith_read = total_hadith_read - 1
        WHERE id = NEW.user_id;
    END IF;

    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for updating user stats
CREATE TRIGGER on_hadith_interaction_change
    AFTER INSERT OR UPDATE ON public.user_hadith_interactions
    FOR EACH ROW EXECUTE FUNCTION public.update_user_stats();
