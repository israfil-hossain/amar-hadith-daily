-- Simple Profile Fix - Run this in Supabase SQL Editor
-- This temporarily disables RLS to allow profile creation, then re-enables with proper policies

-- Temporarily disable RLS on profiles table
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- Create a simple function to create profiles
CREATE OR REPLACE FUNCTION public.create_user_profile(
    user_id UUID,
    user_email TEXT,
    user_full_name TEXT DEFAULT NULL
)
RETURNS public.profiles
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    new_profile public.profiles;
BEGIN
    -- Check if profile already exists
    SELECT * INTO new_profile FROM public.profiles WHERE id = user_id;
    
    IF new_profile.id IS NOT NULL THEN
        RETURN new_profile;
    END IF;
    
    -- Create new profile with all required fields
    INSERT INTO public.profiles (
        id,
        email,
        full_name,
        role,
        is_verified,
        streak_count,
        total_hadith_read,
        total_contributions,
        points,
        level,
        preferred_language,
        notification_settings,
        privacy_settings
    ) VALUES (
        user_id,
        user_email,
        COALESCE(user_full_name, split_part(user_email, '@', 1), 'User'),
        'user'::user_role,
        false,
        0,
        0,
        0,
        0,
        1,
        'bn',
        '{"email": true, "push": true, "prayer_reminders": true}'::jsonb,
        '{"profile_public": true, "progress_public": false}'::jsonb
    ) RETURNING * INTO new_profile;
    
    RETURN new_profile;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.create_user_profile TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_user_profile TO anon;

-- Update trigger function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM public.create_user_profile(
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'full_name'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Re-enable RLS with proper policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users based on user_id" ON public.profiles;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON public.profiles;

-- Create simple, working policies
CREATE POLICY "Allow all to read profiles" ON public.profiles
    FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to insert their own profile" ON public.profiles
    FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

CREATE POLICY "Allow users to update their own profile" ON public.profiles
    FOR UPDATE TO authenticated USING (auth.uid() = id);
