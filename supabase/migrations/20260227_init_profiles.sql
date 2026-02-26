-- 🦄 Create Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    avatar_url TEXT,
    wealth_element TEXT,
    ubc_level INTEGER DEFAULT 1,
    pv_personal INTEGER DEFAULT 0,
    pv_team INTEGER DEFAULT 0,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
-- 📅 Create Activities Table
CREATE TABLE IF NOT EXISTS public.activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    type TEXT NOT NULL CHECK (
        type IN (
            'DAILY',
            'WEEKLY',
            'MONTHLY',
            'QUARTERLY',
            'SPECIAL'
        )
    ),
    location TEXT,
    attendees TEXT,
    link TEXT,
    date TIMESTAMPTZ,
    author_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);
-- Enable RLS for activities
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
-- Activities Policies
CREATE POLICY "Activities are viewable by everyone" ON public.activities FOR
SELECT USING (true);
CREATE POLICY "Only admins can insert activities" ON public.activities FOR
INSERT WITH CHECK (
        EXISTS (
            SELECT 1
            FROM public.profiles
            WHERE id = auth.uid()
                AND is_admin = true
        )
    );
CREATE POLICY "Only admins can update activities" ON public.activities FOR
UPDATE USING (
        EXISTS (
            SELECT 1
            FROM public.profiles
            WHERE id = auth.uid()
                AND is_admin = true
        )
    );
CREATE POLICY "Only admins can delete activities" ON public.activities FOR DELETE USING (
    EXISTS (
        SELECT 1
        FROM public.profiles
        WHERE id = auth.uid()
            AND is_admin = true
    )
);
-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
-- Policies
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR
SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR
INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR
UPDATE USING (auth.uid() = id);
-- 📦 Create avatar storage bucket
-- Note: This is usually done via Supabase Dashboard or CLI, but adding SQL for completeness
-- INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);
-- Add updated_at trigger
CREATE OR REPLACE FUNCTION handle_updated_at() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = NOW();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER update_profiles_updated_at BEFORE
UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION handle_updated_at();