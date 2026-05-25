-- ═══════════════════════════════════════════════════════
-- Unicorn Academy — Supabase Schema (Next.js 8-Stack)
-- ═══════════════════════════════════════════════════════

-- 1. PROFILES (extends auth.users)
create table if not exists public.profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  full_name     text not null default '',
  ubc_level     smallint not null default 1 check (ubc_level between 1 and 4),
  points        integer not null default 0,
  dna_score     integer,
  avatar_url    text,
  bio           text,
  specialization text,
  contact_link  text,
  wealth_element text check (wealth_element in ('EARTH','WATER','AIR','FIRE')),
  line_id       text,
  line_oa       text,
  youtube_url   text,
  referral_slug text unique,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "profiles: owner read/write"
  on public.profiles for all
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "profiles: public read referral"
  on public.profiles for select
  using (true);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, full_name, referral_slug)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    lower(replace(coalesce(new.raw_user_meta_data->>'full_name', new.id::text), ' ', '-'))
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 2. MISSIONS
create table if not exists public.missions (
  id            uuid primary key default gen_random_uuid(),
  ubc_level     smallint not null check (ubc_level between 1 and 4),
  title         text not null,
  description   text not null default '',
  category      text not null check (category in ('MINDSET','SKILLSET','TOOLSET')),
  reward_points integer not null default 10,
  created_at    timestamptz default now()
);

alter table public.missions enable row level security;

create policy "missions: public read"
  on public.missions for select using (true);

-- 3. USER_MISSIONS
create table if not exists public.user_missions (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references public.profiles(id) on delete cascade,
  mission_id   uuid not null references public.missions(id) on delete cascade,
  status       text not null default 'IN_PROGRESS' check (status in ('IN_PROGRESS','COMPLETED','VERIFIED')),
  completed_at timestamptz,
  created_at   timestamptz default now(),
  unique (user_id, mission_id)
);

alter table public.user_missions enable row level security;

create policy "user_missions: owner read/write"
  on public.user_missions for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- updated_at trigger
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();
