-- Create missing tables and fix schema issues
-- Run this in Supabase SQL Editor

-- 1. Create profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT NOT NULL,
    full_name TEXT,
    username TEXT UNIQUE,
    avatar_url TEXT,
    role TEXT DEFAULT 'user',
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

-- 2. Create user_progress table if it doesn't exist
CREATE TABLE IF NOT EXISTS user_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    hadith_read_count INTEGER DEFAULT 0,
    time_spent_minutes INTEGER DEFAULT 0,
    streak_maintained BOOLEAN DEFAULT FALSE,
    achievements_unlocked TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, date)
);

-- 3. Create hadith_contributions table if it doesn't exist
CREATE TABLE IF NOT EXISTS hadith_contributions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    contributor_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    hadith_data JSONB NOT NULL,
    status TEXT DEFAULT 'pending',
    reviewer_id UUID REFERENCES profiles(id),
    review_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Add missing columns to existing tables (if they don't exist)
DO $$ 
BEGIN
    -- Add full_name to profiles if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'full_name') THEN
        ALTER TABLE profiles ADD COLUMN full_name TEXT;
    END IF;

    -- Add points to profiles if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'points') THEN
        ALTER TABLE profiles ADD COLUMN points INTEGER DEFAULT 0;
    END IF;

    -- Add streak_count to profiles if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'streak_count') THEN
        ALTER TABLE profiles ADD COLUMN streak_count INTEGER DEFAULT 0;
    END IF;

    -- Add total_hadith_read to profiles if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'total_hadith_read') THEN
        ALTER TABLE profiles ADD COLUMN total_hadith_read INTEGER DEFAULT 0;
    END IF;

    -- Add total_contributions to profiles if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'total_contributions') THEN
        ALTER TABLE profiles ADD COLUMN total_contributions INTEGER DEFAULT 0;
    END IF;

    -- Add level to profiles if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'level') THEN
        ALTER TABLE profiles ADD COLUMN level INTEGER DEFAULT 1;
    END IF;

    -- Add preferred_language to profiles if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'preferred_language') THEN
        ALTER TABLE profiles ADD COLUMN preferred_language TEXT DEFAULT 'bn';
    END IF;

    -- Add notification_settings to profiles if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'notification_settings') THEN
        ALTER TABLE profiles ADD COLUMN notification_settings JSONB DEFAULT '{"email": true, "push": true, "prayer_reminders": true}';
    END IF;

    -- Add privacy_settings to profiles if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'privacy_settings') THEN
        ALTER TABLE profiles ADD COLUMN privacy_settings JSONB DEFAULT '{"profile_public": true, "progress_public": true}';
    END IF;

    -- Add role to profiles if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'role') THEN
        ALTER TABLE profiles ADD COLUMN role TEXT DEFAULT 'user';
    END IF;

    -- Add is_verified to profiles if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'is_verified') THEN
        ALTER TABLE profiles ADD COLUMN is_verified BOOLEAN DEFAULT FALSE;
    END IF;

    -- Add updated_at to profiles if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'updated_at') THEN
        ALTER TABLE profiles ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;

END $$;

-- 5. Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE hadith_contributions ENABLE ROW LEVEL SECURITY;

-- 6. Create RLS Policies
-- Profiles policies
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- User progress policies
DROP POLICY IF EXISTS "Users can view own progress" ON user_progress;
CREATE POLICY "Users can view own progress" ON user_progress
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own progress" ON user_progress;
CREATE POLICY "Users can insert own progress" ON user_progress
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own progress" ON user_progress;
CREATE POLICY "Users can update own progress" ON user_progress
    FOR UPDATE USING (auth.uid() = user_id);

-- Hadith contributions policies
DROP POLICY IF EXISTS "Users can view own contributions" ON hadith_contributions;
CREATE POLICY "Users can view own contributions" ON hadith_contributions
    FOR SELECT USING (auth.uid() = contributor_id);

DROP POLICY IF EXISTS "Users can insert own contributions" ON hadith_contributions;
CREATE POLICY "Users can insert own contributions" ON hadith_contributions
    FOR INSERT WITH CHECK (auth.uid() = contributor_id);

-- 7. Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Create trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 9. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_date ON user_progress(user_id, date);
CREATE INDEX IF NOT EXISTS idx_hadith_contributions_contributor ON hadith_contributions(contributor_id);
CREATE INDEX IF NOT EXISTS idx_hadith_contributions_status ON hadith_contributions(status);

-- 10. Insert sample data if tables are empty
INSERT INTO profiles (id, email, full_name, points, streak_count, total_hadith_read, level)
SELECT 
    gen_random_uuid(),
    'sample@example.com',
    'Sample User',
    100,
    5,
    25,
    2
WHERE NOT EXISTS (SELECT 1 FROM profiles LIMIT 1);

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'Database schema setup completed successfully!';
END $$;
