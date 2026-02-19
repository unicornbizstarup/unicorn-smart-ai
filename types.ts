
export enum AppView {
  DASHBOARD = 'DASHBOARD',
  SYSTEM_456 = 'SYSTEM_456',
  START_UP = 'START_UP',
  FUNCTIONS = 'FUNCTIONS',
  AI_COACH = 'AI_COACH',
  LIBRARY = 'LIBRARY'
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
  role: 'user' | 'model';
  text: string;
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
