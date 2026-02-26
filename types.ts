
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
  PROFILE = 'PROFILE'
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  createdAt: string;
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

export interface ChatMessage {
  id?: string;
  role: 'user' | 'model' | 'assistant';
  text: string;
  timestamp?: Date;
}

export interface FunctionEvent {
  period: 'DAY' | 'WEEK' | 'MONTH' | 'QUARTER';
  items: string[];
}

export interface LibraryItem {
  id: string;
  title: string;
  description: string;
  category: 'TEACHING' | 'DOCUMENTS' | 'MARKETING' | 'CLIPS' | 'GUIDELINES';
  type: 'PDF' | 'VIDEO' | 'IMAGE' | 'LINK';
  thumbnail?: string;
}

export interface UserProgress {
  userId: string;
  level: UBCLevel;
  points: number;
  completedMissions: string[];
  lastActive: Date;
  dnaScore: number; // Decoding Your Wealth DNA score
}

export interface Mission {
  id: string;
  level: UBCLevel;
  title: string;
  description: string;
  category: 'MINDSET' | 'SKILLSET' | 'TOOLSET';
  rewardPoints: number;
}
