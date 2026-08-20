import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, Course, HistoryLog, LeaderboardEntry, Badge, Question, GlobalAnalytics } from '../types';
import { backendAPI } from '../services/apiService';

interface AppStateContextType {
  currentUser: User | null;
  courses: Course[];
  historyLogs: HistoryLog[];
  leaderboard: LeaderboardEntry[];
  analytics: GlobalAnalytics;
  login: (email: string, role: 'student' | 'admin') => Promise<boolean>;
  register: (name: string, email: string) => void;
  logout: () => void;
  completeChapter: (courseId: string, chapterId: string) => void;
  saveQuizAttempt: (
    quizId: string, 
    chapterId: string, 
    score: number, 
    difficultyBefore: 'easy' | 'medium' | 'hard', 
    difficultyAfter: 'easy' | 'medium' | 'hard',
    xpGained: number
  ) => void;
  addXP: (amount: number, reason: string) => void;
  addWeakChapter: (chapterId: string) => void;
  removeWeakChapter: (chapterId: string) => void;
  updateCourseProgress: (courseId: string) => void;
  // Admin functions
  addCourse: (course: Course) => void;
  updateCourse: (course: Course) => void;
  deleteCourse: (courseId: string) => void;
  addQuestionsForChapter: (chapterId: string, questions: Question[]) => void;
  usersList: User[];
  updateUserRole: (userId: string, role: 'student' | 'admin') => void;
}

const AppStateContext = createContext<AppStateContextType | undefined>(undefined);

// Initial Badges definition
const ALL_BADGES: Badge[] = [
  { id: 'b1', name: 'Premier Pas', description: 'Création de votre compte sur la plateforme', icon: 'UserCheck', category: 'special' },
  { id: 'b2', name: 'Série de Feu', description: 'Maintenir une série d\'apprentissage de 5 jours', icon: 'Flame', category: 'streak' },
  { id: 'b3', name: 'Maître des Requêtes', description: 'Terminer tous les chapitres SQL', icon: 'Database', category: 'course' },
  { id: 'b4', name: 'Pionnier de l\'IA', description: 'Compléter le cours IA Locale Ollama', icon: 'Cpu', category: 'course' },
  { id: 'b5', name: 'Esprit Flexible', description: 'Réussir une transition de difficulté de Facile à Moyen en quiz', icon: 'TrendingUp', category: 'quiz' },
  { id: 'b6', name: 'Perfectionniste', description: 'Obtenir 100% de réussite sur un quiz adaptatif', icon: 'Award', category: 'quiz' },
];

// Questions pool for AI-generated quiz content (runtime only, not static)
let QUESTIONS_POOL: Record<string, Question[]> = {};

export const AppStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // currentUser is still persisted in localStorage for session persistence (page refresh)
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('elearning_user');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });

  const [courses, setCourses] = useState<Course[]>([]);
  const [historyLogs, setHistoryLogs] = useState<HistoryLog[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [usersList, setUsersList] = useState<User[]>([]);

  // Persist currentUser session in localStorage only
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('elearning_user', JSON.stringify(currentUser));
      setUsersList(prev => {
        const exists = prev.some(u => u.id === currentUser.id);
        return exists ? prev.map(u => u.id === currentUser.id ? currentUser : u) : [...prev, currentUser];
      });
      // Update leaderboard entry for currentUser
      if (currentUser.role === 'student') {
        setLeaderboard(prev => {
          const exists = prev.some(e => e.isCurrentUser);
          const entry = {
            rank: 0,
            name: currentUser.name,
            level: currentUser.level,
            xp: currentUser.xp,
            primaryBadge: currentUser.badges[0]?.icon === 'Flame' ? '🔥' : '🚩',
            isCurrentUser: true,
          };
          const updated = exists
            ? prev.map(e => e.isCurrentUser ? { ...entry, rank: e.rank } : e)
            : [...prev, entry];
          return updated.sort((a, b) => b.xp - a.xp).map((e, i) => ({ ...e, rank: i + 1 }));
        });
      }
    } else {
      localStorage.removeItem('elearning_user');
    }
  }, [currentUser]);

  // Login implementation — authenticates against PostgreSQL backend
  const login = async (email: string, role: 'student' | 'admin'): Promise<boolean> => {
    const user: any = await backendAPI.login(email, role);
    if (user && user.id) {
      setCurrentUser(user);
      const newLog: HistoryLog = {
        id: 'log_' + Date.now(),
        date: new Date().toISOString(),
        action: `Connexion réussie (${role === 'admin' ? 'Administration' : 'Étudiant'})`,
        xpGained: role === 'student' ? 10 : 0,
        type: 'login',
      };
      setHistoryLogs(prev => [newLog, ...prev]);
      return true;
    }
    return false;
  };

  // Register implementation
  const register = (name: string, email: string) => {
    const newStudent: User = {
      id: 'u_' + Date.now(),
      name,
      email,
      role: 'student',
      level: 1,
      xp: 0,
      xpNextLevel: 500,
      streak: 1,
      badges: [ALL_BADGES[0]], // Premier Pas
      completedChapters: [],
      completedCourses: [],
      weakChapters: [],
      dateJoined: new Date().toLocaleDateString('fr-FR'),
    };

    setUsersList(prev => [...prev, newStudent]);
    setCurrentUser(newStudent);
    // Persist new user to PostgreSQL database
    backendAPI.syncUser(newStudent);

    // Initial log
    const newLog: HistoryLog = {
      id: 'log_' + Date.now(),
      date: new Date().toISOString(),
      action: 'Création du compte étudiant',
      xpGained: 50,
      type: 'login',
    };
    setHistoryLogs(prev => [newLog, ...prev]);
  };

  const logout = () => {
    setCurrentUser(null);
  };

  // Add XP
  const addXP = (amount: number, reason: string) => {
    if (!currentUser || currentUser.role !== 'student') return;

    setCurrentUser(prev => {
      if (!prev) return null;
      let newXp = prev.xp + amount;
      let newLevel = prev.level;
      let nextLevelXp = prev.xpNextLevel;

      let levelUp = false;
      if (newXp >= nextLevelXp) {
        newLevel += 1;
        newXp = newXp - nextLevelXp;
        nextLevelXp = Math.round(nextLevelXp * 1.5);
        levelUp = true;
      }

      // Check level badges
      let currentBadges = [...prev.badges];
      if (levelUp && newLevel === 5 && !currentBadges.some(b => b.id === 'b_lvl5')) {
        const lvlBadge: Badge = {
          id: 'b_lvl5',
          name: 'Ascension',
          description: 'Atteindre le niveau 5 de compétences',
          icon: 'TrendingUp',
          earnedAt: new Date().toLocaleDateString('fr-FR'),
          category: 'level'
        };
        currentBadges.push(lvlBadge);
        
        // Log badge unlock
        setTimeout(() => {
          setHistoryLogs(l => [
            {
              id: 'log_badge_' + Date.now(),
              date: new Date().toISOString(),
              action: 'Badge débloqué : Ascension (Niveau 5)',
              xpGained: 100,
              type: 'badge'
            },
            ...l
          ]);
        }, 100);
      }

      return {
        ...prev,
        xp: newXp,
        level: newLevel,
        xpNextLevel: nextLevelXp,
        badges: currentBadges,
      };
    });

    const newLog: HistoryLog = {
      id: 'log_' + Date.now(),
      date: new Date().toISOString(),
      action: reason,
      xpGained: amount,
      type: reason.includes('Quiz') ? 'quiz' : reason.includes('Chapitre') ? 'chapter' : 'streak',
    };
    setHistoryLogs(prev => [newLog, ...prev]);
  };

  // Mark Chapter Completed
  const completeChapter = (courseId: string, chapterId: string) => {
    if (!currentUser || currentUser.role !== 'student') return;

    if (currentUser.completedChapters.includes(chapterId)) return;

    setCurrentUser(prev => {
      if (!prev) return null;
      const updatedChapters = [...prev.completedChapters, chapterId];
      return {
        ...prev,
        completedChapters: updatedChapters,
      };
    });

    addXP(30, `Chapitre complété : ${getChapterTitle(chapterId)}`);
    updateCourseProgress(courseId);
  };

  // Helper helper
  const getChapterTitle = (id: string) => {
    for (const c of courses) {
      const ch = c.chapters.find(item => item.id === id);
      if (ch) return ch.title;
    }
    return 'Chapitre';
  };

  // Recalculate Course progress & check course badge
  const updateCourseProgress = (courseId: string) => {
    if (!currentUser) return;
    const course = courses.find(c => c.id === courseId);
    if (!course) return;

    setTimeout(() => {
      setCurrentUser(prev => {
        if (!prev) return null;
        
        const courseChapterIds = course.chapters.map(ch => ch.id);
        const completedCourseChapters = courseChapterIds.filter(id => prev.completedChapters.includes(id));
        const allCompleted = completedCourseChapters.length === courseChapterIds.length;

        let completedCourses = [...prev.completedCourses];
        let currentBadges = [...prev.badges];

        if (allCompleted && !completedCourses.includes(courseId)) {
          completedCourses.push(courseId);

          // Give a badge based on course
          if (courseId === 'c1' && !currentBadges.some(b => b.id === 'b3')) {
            currentBadges.push({ ...ALL_BADGES[2], earnedAt: new Date().toLocaleDateString('fr-FR') });
          } else if (courseId === 'c3' && !currentBadges.some(b => b.id === 'b4')) {
            currentBadges.push({ ...ALL_BADGES[3], earnedAt: new Date().toLocaleDateString('fr-FR') });
          }
        }

        return {
          ...prev,
          completedCourses,
          badges: currentBadges,
        };
      });
    }, 200);
  };

  // Save Quiz Attempt & Trigger Adaptive changes
  const saveQuizAttempt = (
    _quizId: string,
    chapterId: string,
    score: number,
    difficultyBefore: 'easy' | 'medium' | 'hard',
    difficultyAfter: 'easy' | 'medium' | 'hard',
    xpGained: number
  ) => {
    if (!currentUser) return;

    // Save as log
    addXP(xpGained, `Quiz complété : ${getChapterTitle(chapterId)} (${score}%, ${difficultyBefore} -> ${difficultyAfter})`);

    // Sync quiz attempt to PostgreSQL database
    backendAPI.saveQuizAttempt({
      userId: currentUser.id,
      chapterId,
      score,
      difficultyBefore,
      difficultyAfter,
      xpGained,
    });

    // Handle adaptive logic consequences
    if (score < 50) {
      addWeakChapter(chapterId);
    } else if (score >= 80) {
      removeWeakChapter(chapterId);
      // Automatically complete chapter on great quiz score
      completeChapter(getCourseIdByChapterId(chapterId), chapterId);

      // Give special badges
      setCurrentUser(prev => {
        if (!prev) return null;
        let currentBadges = [...prev.badges];
        
        // Perfectionist badge
        if (score === 100 && !currentBadges.some(b => b.id === 'b6')) {
          currentBadges.push({ ...ALL_BADGES[5], earnedAt: new Date().toLocaleDateString('fr-FR') });
        }
        
        // Flexible Mind badge (difficulty increase)
        if (difficultyBefore === 'easy' && difficultyAfter === 'medium' && !currentBadges.some(b => b.id === 'b5')) {
          currentBadges.push({ ...ALL_BADGES[4], earnedAt: new Date().toLocaleDateString('fr-FR') });
        }

        return {
          ...prev,
          badges: currentBadges
        };
      });
    }
  };

  const getCourseIdByChapterId = (chId: string) => {
    for (const c of courses) {
      if (c.chapters.some(ch => ch.id === chId)) return c.id;
    }
    return '';
  };

  // Weak chapters logic (triggers IA recommendations)
  const addWeakChapter = (chapterId: string) => {
    setCurrentUser(prev => {
      if (!prev) return null;
      if (prev.weakChapters.includes(chapterId)) return prev;
      return {
        ...prev,
        weakChapters: [...prev.weakChapters, chapterId],
      };
    });
  };

  const removeWeakChapter = (chapterId: string) => {
    setCurrentUser(prev => {
      if (!prev) return null;
      return {
        ...prev,
        weakChapters: prev.weakChapters.filter(id => id !== chapterId),
      };
    });
  };

  // Sync all dynamic backend data on startup from PostgreSQL
  useEffect(() => {
    async function syncAllBackendData() {
      // 1. Sync Courses
      const dbCourses: any = await backendAPI.getCourses();
      if (dbCourses && Array.isArray(dbCourses) && dbCourses.length > 0) {
        const mapped: Course[] = dbCourses.map((c: any) => ({
          id: c.id,
          title: c.title,
          description: c.description,
          category: c.category,
          difficulty: c.difficulty,
          xpReward: c.xp_reward ?? c.xpReward ?? 300,
          isRecommended: c.is_recommended ?? c.isRecommended ?? false,
          chapters: typeof c.chapters === 'string' ? JSON.parse(c.chapters) : (c.chapters || []),
        }));
        setCourses(mapped);
      }

      // 2. Sync Leaderboard
      const dbLeaderboard: any = await backendAPI.getLeaderboard();
      if (dbLeaderboard && Array.isArray(dbLeaderboard) && dbLeaderboard.length > 0) {
        setLeaderboard(dbLeaderboard);
      }

      // 3. Sync Users
      const dbUsers: any = await backendAPI.getUsers();
      if (dbUsers && Array.isArray(dbUsers) && dbUsers.length > 0) {
        const mappedUsers: User[] = dbUsers.map((u: any) => ({
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role || 'student',
          level: u.level || 1,
          xp: u.xp || 0,
          xpNextLevel: u.xp_next_level || 500,
          streak: u.streak || 0,
          badges: typeof u.badges === 'string' ? JSON.parse(u.badges) : (u.badges || []),
          completedChapters: typeof u.completed_chapters === 'string' ? JSON.parse(u.completed_chapters) : (u.completed_chapters || []),
          completedCourses: [],
          weakChapters: typeof u.weak_chapters === 'string' ? JSON.parse(u.weak_chapters) : (u.weak_chapters || []),
          dateJoined: u.created_at ? new Date(u.created_at).toLocaleDateString('fr-FR') : new Date().toLocaleDateString('fr-FR'),
        }));
        setUsersList(mappedUsers);
      }
    }
    syncAllBackendData();
  }, []);

  // ADMIN CRUD FUNCTIONS & BACKEND PERSISTENCE
  const addCourse = (course: Course) => {
    setCourses(prev => [...prev, course]);
    backendAPI.saveCourse(course);
  };

  const updateCourse = (course: Course) => {
    setCourses(prev => prev.map(c => c.id === course.id ? course : c));
    backendAPI.saveCourse(course);
  };

  const deleteCourse = (courseId: string) => {
    setCourses(prev => prev.filter(c => c.id !== courseId));
  };

  // Inject AI-generated questions into the runtime pool
  const addQuestionsForChapter = (chapterId: string, questions: Question[]) => {
    QUESTIONS_POOL = { ...QUESTIONS_POOL, [chapterId]: questions };
  };

  const updateUserRole = (userId: string, role: 'student' | 'admin') => {
    setUsersList(prev => prev.map(u => u.id === userId ? { ...u, role } : u));
    if (currentUser && currentUser.id === userId) {
      setCurrentUser(prev => prev ? { ...prev, role } : null);
    }
  };

  // Calculate Admin Analytics mock data
  const getAnalytics = (): GlobalAnalytics => {
    const totalStudents = usersList.filter(u => u.role === 'student').length;
    // const averageXp = usersList.filter(u => u.role === 'student').reduce((acc, u) => acc + u.xp, 0) / (totalStudents || 1);

    return {
      totalUsers: usersList.length,
      activeUsersToday: Math.round(totalStudents * 0.7) || 1,
      averageTimeSpent: 34, // Simulated static average time spent
      averageSuccessRate: 76,
      popularCourses: courses.map((c, idx) => ({
        name: c.title,
        studentsCount: Math.round(totalStudents * (0.8 - idx * 0.2)) || 1,
        color: idx === 0 ? '#6366f1' : idx === 1 ? '#10b981' : '#f59e0b',
      })),
      dailyRegistrations: [
        { date: '12/06', count: 1 },
        { date: '13/06', count: 3 },
        { date: '14/06', count: 2 },
        { date: '15/06', count: 5 },
        { date: '16/06', count: 4 },
        { date: '17/06', count: totalStudents },
      ],
      categoryPerformance: [
        { category: 'Bases de données', averageScore: 82 },
        { category: 'Frontend', averageScore: 74 },
        { category: 'Intelligence Artificielle', averageScore: 68 },
      ],
    };
  };

  return (
    <AppStateContext.Provider
      value={{
        currentUser,
        courses,
        historyLogs,
        leaderboard,
        analytics: getAnalytics(),
        login,
        register,
        logout,
        completeChapter,
        saveQuizAttempt,
        addXP,
        addWeakChapter,
        removeWeakChapter,
        updateCourseProgress,
        addCourse,
        updateCourse,
        deleteCourse,
        addQuestionsForChapter,
        usersList,
        updateUserRole,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
};

// Expose questions list
export const getQuestionsForChapter = (chapterId: string): Question[] => {
  return QUESTIONS_POOL[chapterId] || QUESTIONS_POOL['c1_ch1']; // fallback
};
