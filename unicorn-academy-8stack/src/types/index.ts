export type UBCLevel = 1 | 2 | 3 | 4;
export type WealthElement = "EARTH" | "WATER" | "AIR" | "FIRE";
export type MissionCategory = "MINDSET" | "SKILLSET" | "TOOLSET";
export type MissionStatus = "IN_PROGRESS" | "COMPLETED" | "VERIFIED";

export interface Profile {
  id: string;
  full_name: string;
  ubc_level: UBCLevel;
  points: number;
  dna_score: number | null;
  avatar_url: string | null;
  bio: string | null;
  specialization: string | null;
  contact_link: string | null;
  wealth_element: WealthElement | null;
  line_id: string | null;
  line_oa: string | null;
  youtube_url: string | null;
  referral_slug: string;
  created_at: string;
  updated_at: string;
}

export interface Mission {
  id: string;
  ubc_level: UBCLevel;
  title: string;
  description: string;
  category: MissionCategory;
  reward_points: number;
}

export interface UserMission {
  id: string;
  user_id: string;
  mission_id: string;
  status: MissionStatus;
  completed_at: string | null;
  mission?: Mission;
}

export interface AICoachMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}
