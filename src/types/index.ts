export interface WorkerProfile {
  id: string;
  name: string;
  avatar: string;
  serviceType: ServiceType;
  rating: number;
  description: string;
  monthlyIncome: number;
  weeklyHours: number;
  costs: number;
  benefits: string[];
}

export interface ServiceType {
  id: string;
  name: string;
  icon: string;
}

export interface TimelineEvent {
  id: string;
  title: string;
  period: string;
  description: string;
  icon: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface QuizCategory {
  id: string;
  title: string;
  description: string;
  icon: string;
  questions: QuizQuestion[];
}

export interface GlossaryTerm {
  id: string;
  term: string;
  definition: string;
}

export interface WorkSimulation {
  serviceType: ServiceType;
  hoursPerWeek: number;
  monthlyCosts: number;
}

export interface SimulationResult {
  grossIncome: number;
  costs: number;
  netIncome: number;
  message: string;
}

export interface User {
  id?: number;
  name: string;
  matricula: string;
  createdAt?: string;
}

export interface QuizResult {
  id?: number;
  userId: number;
  categoryId: string;
  categoryName: string;
  score: number;
  totalQuestions: number;
  completedAt: string;
  timeSpent?: number;
}

export interface RankingEntry {
  id: number;
  name: string;
  matricula: string;
  categoryName?: string;
  totalScore: number;
  totalQuizzes: number;
  averageScore: number;
  lastQuizDate: string;
  bestScore?: number;
  worstScore?: number;
  quizHistory?: QuizHistoryEntry[];
}

export interface QuizHistoryEntry {
  score: number;
  totalQuestions: number;
  completedAt: string;
  timeSpent?: number;
}

export interface RankingCategory {
  categoryId: string;
  categoryName: string;
  totalParticipants: number;
  totalQuizzes: number;
}
