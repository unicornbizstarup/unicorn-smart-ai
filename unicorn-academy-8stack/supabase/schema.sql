-- ═══════════════════════════════════════════════════════
-- UNICORN SMART AI — Full Database Schema v2
-- Run in Supabase SQL Editor (top to bottom)
-- ═══════════════════════════════════════════════════════

-- ── Extensions ──
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ═══════════════════════════════════════════════════════
-- SECTION 1: PROFILES
-- ═══════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS profiles (
  id                    UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name             TEXT NOT NULL DEFAULT '',
  display_name          TEXT,
  expertise             TEXT,
  quote                 TEXT,
  bio                   TEXT,
  avatar_url            TEXT,
  photo_urls            TEXT[]  DEFAULT '{}',
  photo_captions        TEXT[]  DEFAULT '{}',
  line_oa_url           TEXT,
  line_id               TEXT,
  facebook_url          TEXT,
  youtube_url           TEXT,
  instagram_url         TEXT,
  ai_bio                TEXT,
  ai_tags               TEXT[]  DEFAULT '{}',
  referral_slug         TEXT    UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(6), 'hex'),
  referred_by           UUID    REFERENCES profiles(id),
  referral_clicks       INTEGER DEFAULT 0,
  referral_conversions  INTEGER DEFAULT 0,
  ubc_level             SMALLINT DEFAULT 1 CHECK (ubc_level BETWEEN 1 AND 4),
  wealth_element        TEXT    DEFAULT 'FIRE' CHECK (wealth_element IN ('EARTH','WATER','AIR','FIRE')),
  business_points       INTEGER DEFAULT 0,
  is_verified           BOOLEAN DEFAULT FALSE,
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS profiles_slug_idx ON profiles(referral_slug);

-- ═══════════════════════════════════════════════════════
-- SECTION 2: PRODUCT CATEGORIES
-- ═══════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS product_categories (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL,
  slug       TEXT NOT NULL UNIQUE,
  banner_url TEXT,
  icon_url   TEXT,
  sort_order SMALLINT DEFAULT 0,
  is_active  BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO product_categories (name, slug, sort_order) VALUES
  ('Health Care',   'health-care',   1),
  ('Skin Care',     'skin-care',     2),
  ('Personal Care', 'personal-care', 3),
  ('Agriculture',   'agriculture',   4),
  ('Technology',    'technology',    5)
ON CONFLICT (slug) DO NOTHING;

-- ═══════════════════════════════════════════════════════
-- SECTION 3: PRODUCTS
-- ═══════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS products (
  id             UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id    UUID    REFERENCES product_categories(id),
  name           TEXT    NOT NULL,
  description    TEXT    NOT NULL DEFAULT '',
  member_price   NUMERIC(10,2) NOT NULL DEFAULT 0,
  retail_price   NUMERIC(10,2) NOT NULL DEFAULT 0,
  pv             NUMERIC(10,2) NOT NULL DEFAULT 0,
  image_url      TEXT,
  ingredients    TEXT[]  DEFAULT '{}',
  highlights     TEXT[]  DEFAULT '{}',
  selling_points TEXT[]  DEFAULT '{}',
  usage_guide    TEXT,
  package_size   TEXT,
  u_selling_msg  TEXT,
  is_active      BOOLEAN DEFAULT TRUE,
  is_featured    BOOLEAN DEFAULT FALSE,
  sort_order     SMALLINT DEFAULT 0,
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  updated_at     TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════
-- SECTION 4: MISSIONS
-- ═══════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS missions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  category    TEXT NOT NULL CHECK (category IN ('MINDSET','SKILLSET','TOOLSET')),
  points      INTEGER DEFAULT 100,
  sort_order  SMALLINT DEFAULT 0,
  is_active   BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_missions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id  UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  mission_id  UUID NOT NULL REFERENCES missions(id) ON DELETE CASCADE,
  status      TEXT NOT NULL DEFAULT 'IN_PROGRESS'
                CHECK (status IN ('IN_PROGRESS','COMPLETED','VERIFIED')),
  started_at  TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  UNIQUE (profile_id, mission_id)
);

-- ═══════════════════════════════════════════════════════
-- SECTION 5: AI COACH MESSAGES
-- ═══════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS ai_coach_messages (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role       TEXT NOT NULL CHECK (role IN ('user','model')),
  content    TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ai_messages_profile_idx ON ai_coach_messages(profile_id, created_at DESC);

-- ═══════════════════════════════════════════════════════
-- SECTION 6: RAG KNOWLEDGE BASE
-- ═══════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS knowledge_docs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT NOT NULL,
  category    TEXT NOT NULL DEFAULT 'general'
                CHECK (category IN ('products','reward_plan','promotion','sales_strategy','general')),
  source_type TEXT NOT NULL DEFAULT 'txt'
                CHECK (source_type IN ('pdf','txt','url','docx','youtube')),
  source_url  TEXT,
  file_size   INTEGER,
  status      TEXT NOT NULL DEFAULT 'pending'
                CHECK (status IN ('pending','processing','indexed','error')),
  chunk_count INTEGER DEFAULT 0,
  error_msg   TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS knowledge_chunks (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doc_id      UUID NOT NULL REFERENCES knowledge_docs(id) ON DELETE CASCADE,
  content     TEXT NOT NULL,
  embedding   VECTOR(768),
  metadata    JSONB DEFAULT '{}',
  chunk_index INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS knowledge_chunks_embed_idx
  ON knowledge_chunks USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);

CREATE INDEX IF NOT EXISTS knowledge_chunks_doc_idx ON knowledge_chunks(doc_id);

-- ═══════════════════════════════════════════════════════
-- SECTION 7: RLS POLICIES
-- ═══════════════════════════════════════════════════════

ALTER TABLE profiles          ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products           ENABLE ROW LEVEL SECURITY;
ALTER TABLE missions           ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_missions      ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_coach_messages  ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_docs     ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_chunks   ENABLE ROW LEVEL SECURITY;

-- profiles
CREATE POLICY "profiles_select_own"   ON profiles FOR SELECT USING (true);
CREATE POLICY "profiles_insert_own"   ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own"   ON profiles FOR UPDATE USING (auth.uid() = id);

-- product_categories (public read)
CREATE POLICY "categories_public_read" ON product_categories FOR SELECT USING (is_active = TRUE);
CREATE POLICY "categories_admin_all"   ON product_categories USING (auth.jwt()->>'role' = 'admin')
  WITH CHECK (auth.jwt()->>'role' = 'admin');

-- products (public read active, admin write)
CREATE POLICY "products_public_read"  ON products FOR SELECT USING (is_active = TRUE);
CREATE POLICY "products_admin_all"    ON products USING (auth.jwt()->>'role' = 'admin')
  WITH CHECK (auth.jwt()->>'role' = 'admin');

-- missions (public read)
CREATE POLICY "missions_public_read"  ON missions FOR SELECT USING (is_active = TRUE);
CREATE POLICY "missions_admin_all"    ON missions USING (auth.jwt()->>'role' = 'admin')
  WITH CHECK (auth.jwt()->>'role' = 'admin');

-- user_missions
CREATE POLICY "user_missions_own"  ON user_missions FOR ALL USING (auth.uid() = profile_id);

-- ai_coach_messages
CREATE POLICY "ai_messages_own"  ON ai_coach_messages FOR ALL USING (auth.uid() = profile_id);

-- knowledge (authenticated read indexed, admin write)
CREATE POLICY "knowledge_docs_auth_read"   ON knowledge_docs   FOR SELECT USING (auth.role() = 'authenticated' AND status = 'indexed');
CREATE POLICY "knowledge_chunks_auth_read" ON knowledge_chunks FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "knowledge_docs_admin_all"   ON knowledge_docs   USING (auth.jwt()->>'role' = 'admin') WITH CHECK (auth.jwt()->>'role' = 'admin');
CREATE POLICY "knowledge_chunks_admin_all" ON knowledge_chunks USING (auth.jwt()->>'role' = 'admin') WITH CHECK (auth.jwt()->>'role' = 'admin');

-- ═══════════════════════════════════════════════════════
-- SECTION 8: RPC FUNCTIONS
-- ═══════════════════════════════════════════════════════

-- Vector similarity search
CREATE OR REPLACE FUNCTION search_knowledge(
  query_embedding VECTOR(768),
  match_count     INTEGER DEFAULT 5,
  min_score       FLOAT   DEFAULT 0.65
)
RETURNS TABLE (
  id       UUID, doc_id UUID, content TEXT,
  metadata JSONB, score  FLOAT
)
LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  RETURN QUERY
  SELECT kc.id, kc.doc_id, kc.content, kc.metadata,
         (1 - (kc.embedding <=> query_embedding))::FLOAT AS score
  FROM knowledge_chunks kc
  JOIN knowledge_docs kd ON kd.id = kc.doc_id
  WHERE kd.status = 'indexed'
    AND (1 - (kc.embedding <=> query_embedding)) >= min_score
  ORDER BY kc.embedding <=> query_embedding
  LIMIT match_count;
END;$$;

-- Increment referral clicks
CREATE OR REPLACE FUNCTION increment_referral_clicks(profile_id UUID)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  UPDATE profiles SET referral_clicks = referral_clicks + 1 WHERE id = profile_id;
END;$$;

-- Increment referral conversions + add business points
CREATE OR REPLACE FUNCTION increment_referral_conversions(profile_id UUID)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  UPDATE profiles
  SET referral_conversions = referral_conversions + 1,
      business_points      = business_points + 100
  WHERE id = profile_id;
END;$$;

-- Auto-create profile on sign up
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  RETURN NEW;
END;$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
