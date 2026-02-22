-- Unicorn Global DNA Database Schema 🧬

-- 1. Profiles Table (Extends Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  ubc_level INTEGER DEFAULT 1, -- 1: Foundation, 2: Specialist, 3: Strategic, 4: Master
  points INTEGER DEFAULT 0,
  dna_score INTEGER DEFAULT 0,
  avatar_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- 2. Missions Table
CREATE TABLE IF NOT EXISTS public.missions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ubc_level INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT CHECK (category IN ('MINDSET', 'SKILLSET', 'TOOLSET')),
  reward_points INTEGER DEFAULT 100,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. User Missions Tracking
CREATE TABLE IF NOT EXISTS public.user_missions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  mission_id UUID REFERENCES public.missions(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'IN_PROGRESS' CHECK (status IN ('IN_PROGRESS', 'COMPLETED', 'VERIFIED')),
  completed_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, mission_id)
);

-- RLS for User Missions
ALTER TABLE public.user_missions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own missions" ON public.user_missions
  FOR ALL USING (auth.uid() = user_id);

-- 4. Initial Seed Data
INSERT INTO public.missions (ubc_level, title, description, category, reward_points) VALUES
(1, 'Digital Identity', 'ตั้งค่าโปรไฟล์และ Digital Name Card', 'TOOLSET', 500),
(1, 'ABCD Mastery', 'ซ้อมพูด Mindset ABCD กับ AI Coach', 'MINDSET', 300),
(2, 'TikTok Specialist', 'สร้างคลิปรีวิวสินค้า และเชื่อม One Link', 'SKILLSET', 1000);
