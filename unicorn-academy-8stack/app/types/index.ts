// app/types/index.ts
// ═══════════════════════════════════════════════════════
// UNICORN SMART AI — Domain Types (v2)
// ═══════════════════════════════════════════════════════

export type UBCLevel      = 1 | 2 | 3 | 4;
export type WealthElement = "EARTH" | "WATER" | "AIR" | "FIRE";
export type MissionCategory = "MINDSET" | "SKILLSET" | "TOOLSET";
export type MissionStatus   = "IN_PROGRESS" | "COMPLETED" | "VERIFIED";
export type KnowledgeCategory = "products" | "reward_plan" | "promotion" | "sales_strategy" | "general";
export type KnowledgeSourceType = "pdf" | "txt" | "url" | "docx" | "youtube";
export type KnowledgeStatus = "pending" | "processing" | "indexed" | "error";

// ── Profile ──
export interface Profile {
  id:                   string;
  full_name:            string;
  display_name:         string | null;
  specialization:       string | null;
  quote:                string | null;
  bio:                  string | null;
  avatar_url:           string | null;
  photo_urls:           string[];
  photo_captions:       string[];
  line_oa_url:          string | null;
  line_id:              string | null;
  facebook_url:         string | null;
  youtube_url:          string | null;
  instagram_url:        string | null;
  ai_bio:               string | null;
  ai_tags:              string[];
  username:             string;
  referred_by:          string | null;
  referral_clicks:      number;
  referral_conversions: number;
  ubc_level:            UBCLevel;
  wealth_element:       WealthElement;
  business_points:      number;
  is_verified:          boolean;
  created_at:           string;
  updated_at:           string;
}

// ── Product Category ──
export interface ProductCategory {
  id:         string;
  name:       string;
  slug:       string;
  banner_url: string | null;
  icon_url:   string | null;
  sort_order: number;
  is_active:  boolean;
  created_at: string;
}

// ── Product ──
export interface Product {
  id:             string;
  category_id:    string | null;
  category?:      Pick<ProductCategory, "id" | "name" | "slug"> | null;
  name:           string;
  description:    string;
  member_price:   number;
  retail_price:   number;
  pv:             number;
  image_url:      string | null;
  ingredients:    string[];
  highlights:     string[];
  selling_points: string[];
  u_selling_msg:  string | null;
  usage_guide:    string | null;
  package_size:   string | null;
  is_active:      boolean;
  is_featured:    boolean;
  sort_order:     number;
  created_at:     string;
  updated_at:     string;
}

// ── Mission ──
export interface Mission {
  id:          string;
  title:       string;
  description: string;
  category:    MissionCategory;
  points:      number;
  sort_order:  number;
  is_active:   boolean;
  created_at:  string;
}

export interface UserMission {
  id:           string;
  profile_id:   string;
  mission_id:   string;
  mission?:     Mission;
  status:       MissionStatus;
  started_at:   string;
  completed_at: string | null;
}

// ── AI Coach ──
export interface AICoachMessage {
  id:         string;
  profile_id: string;
  role:       "user" | "model";
  content:    string;
  created_at: string;
}

// ── RAG Knowledge Base ──
export interface KnowledgeDoc {
  id:          string;
  title:       string;
  category:    KnowledgeCategory;
  source_type: KnowledgeSourceType;
  source_url:  string | null;
  file_size:   number | null;
  status:      KnowledgeStatus;
  chunk_count: number;
  error_msg:   string | null;
  created_at:  string;
  updated_at:  string;
}

export interface KnowledgeChunk {
  id:          string;
  doc_id:      string;
  content:     string;
  metadata:    Record<string, unknown>;
  chunk_index: number;
  created_at:  string;
}

// ── Referral ──
export interface ReferralCookiePayload {
  referrer_id: string;
  slug:        string;
  expires_at:  number;
  hmac:        string;
}

// ── Upload API ──
export interface UploadRequest {
  filename:    string;
  contentType: string;
  folder:      "products" | "profiles" | "photos" | "knowledge" | "categories";
}

export interface UploadResponse {
  uploadUrl:  string;
  publicUrl:  string;
  key:        string;
}

// ── RAG Search Result ──
export interface KnowledgeSearchResult {
  id:       string;
  doc_id:   string;
  content:  string;
  metadata: Record<string, unknown>;
  score:    number;
}
