-- Fix Profile RLS Policies
-- Run this in Supabase SQL Editor to fix profile creation issues

-- First, let's check current policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'profiles';

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Create more permissive policies for profile management
CREATE POLICY "Enable read access for all users" ON public.profiles
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users based on user_id" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable update for users based on user_id" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Create a function to handle profile creation with proper permissions
CREATE OR REPLACE FUNCTION public.create_profile_for_user(
    user_id UUID,
    user_email TEXT,
    user_full_name TEXT DEFAULT NULL
)
RETURNS public.profiles
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    new_profile public.profiles;
BEGIN
    -- Check if profile already exists
    SELECT * INTO new_profile FROM public.profiles WHERE id = user_id;
    
    IF new_profile.id IS NOT NULL THEN
        RETURN new_profile;
    END IF;
    
    -- Create new profile
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
        'user',
        false,
        0,
        0,
        0,
        0,
        1,
        'bn',
        '{"email": true, "push": true, "prayer_reminders": true}',
        '{"profile_public": true, "progress_public": false}'
    ) RETURNING * INTO new_profile;
    
    RETURN new_profile;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.create_profile_for_user TO authenticated;

-- Update the trigger function to use the new function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM public.create_profile_for_user(
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'full_name'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Test the function (replace with actual user ID and email)
-- SELECT public.create_profile_for_user(
--     'your-user-id-here'::UUID,
--     'test@example.com',
--     'Test User'
-- );
