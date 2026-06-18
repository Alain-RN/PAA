export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string; // Nom de l'icône Lucide (ex: 'Award', 'Zap') ou émoji
  earnedAt?: string;
  category: 'level' | 'streak' | 'course' | 'quiz' | 'special';
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'admin';
  level: number;
  xp: number;
  xpNextLevel: number;
  streak: number;
  lastActiveDate?: string;
  badges: Badge[];
  completedChapters: string[]; // liste des IDs de chapitres terminés
  completedCourses: string[]; // liste des IDs de cours terminés
  weakChapters: string[]; // chapitres où l'élève a des difficultés (pour les recommandations)
  dateJoined: string;
}

export interface Chapter {
  id: string;
  courseId: string;
  title: string;
  content: string;
  summaryByAI: string;
  order: number;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  category: string; // ex: 'Base de données', 'Frontend', 'Algorithmes'
  difficulty: 'Débutant' | 'Intermédiaire' | 'Avancé';
  xpReward: number;
  chapters: Chapter[];
  isRecommended?: boolean; // Recommandé par l'IA
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface Quiz {
  id: string;
  chapterId: string;
  title: string;
  questions: Question[]; // Contient des questions de différents niveaux de difficulté
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  chapterTitle: string;
  courseTitle: string;
  date: string;
  score: number; // en pourcentage (ex: 80)
  difficultyBefore: 'easy' | 'medium' | 'hard';
  difficultyAfter: 'easy' | 'medium' | 'hard';
  xpGained: number;
}

export interface HistoryLog {
  id: string;
  date: string;
  action: string;
  xpGained: number;
  type: 'quiz' | 'chapter' | 'badge' | 'login' | 'streak';
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  level: number;
  xp: number;
  primaryBadge: string;
  isCurrentUser?: boolean;
}

export interface GlobalAnalytics {
  totalUsers: number;
  activeUsersToday: number;
  averageTimeSpent: number; // en minutes
  averageSuccessRate: number; // en pourcentage
  popularCourses: { name: string; studentsCount: number; color: string }[];
  dailyRegistrations: { date: string; count: number }[];
  categoryPerformance: { category: string; averageScore: number }[];
}
