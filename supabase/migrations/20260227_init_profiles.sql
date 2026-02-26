-- 🦄 Create Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    avatar_url TEXT,
    birth_date DATE,
    wealth_element TEXT CHECK (
        wealth_element IN ('FIRE', 'WATER', 'EARTH', 'AIR')
    ),
    ubc_level INTEGER DEFAULT 1,
    points INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
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