
export enum AppView {
  LANDING = 'LANDING',
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER',
  DASHBOARD = 'DASHBOARD',
  SYSTEM_456 = 'SYSTEM_456',
  START_UP = 'START_UP',
  FUNCTIONS = 'FUNCTIONS',
  AI_COACH = 'AI_COACH',
  LIBRARY = 'LIBRARY',
  PROFILE = 'PROFILE',
  UBC_PROGRAM = 'UBC_PROGRAM',
  PRODUCT_CATALOG = 'PRODUCT_CATALOG',
  WEALTH_DNA = 'WEALTH_DNA',
  CONTACT = 'CONTACT',
  ABOUT = 'ABOUT',
  PRIVACY_POLICY = 'PRIVACY_POLICY',
  REFERRAL_PAGE = 'REFERRAL_PAGE'
}

export interface User {
  id: string;
  fullName: string;
  username: string; // Used for Referral Link
  email: string;
  phone?: string;
  avatarUrl?: string; // Profile Image
  createdAt: string;
  wealthElement?: string;
  ubcLevel?: UBCLevel;
  pvPersonal?: number;
  pvTeam?: number;
  personalPv?: number;
  teamPvLeft?: number;
  teamPvRight?: number;
  isAdmin?: boolean;
  referredBy?: string;
  bio?: string;
  youtubeUrl?: string;
  lineId?: string;
  lineOaUrl?: string;
  quote?: string;
  specialization?: string;
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    tiktok?: string;
    youtube?: string;
    website?: string;
  };
}

export enum UBCLevel {
  UBC1_FOUNDATION = 1,
  UBC2_SPECIALIST = 2,
  UBC3_STRATEGIC = 3,
  UBC4_MASTER = 4
}

export type MasteryLevel = 0 | 1 | 2 | 3 | 4; // 0: None, 1: รู้, 2: เข้าใจ, 3: พูดได้, 4: สอนเป็น

export interface TopicMastery {
  topicId: string;
  level: MasteryLevel;
  quizScore: number;
  aiScore: number;
  fieldWorkCount: number;
}
