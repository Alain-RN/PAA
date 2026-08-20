const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002/api';

export async function fetchFromBackend<T>(endpoint: string, options?: RequestInit): Promise<T | null> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout

    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {}),
      },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn(`[Backend API] ${endpoint} non joignable:`, err);
    return null;
  }
}

export const backendAPI = {
  // Authenticate user from PostgreSQL (no static fallback)
  login: async (email: string, role: 'student' | 'admin') => {
    return fetchFromBackend('/users/login', {
      method: 'POST',
      body: JSON.stringify({ email, role }),
    });
  },

  // Sync User Profile & XP with Postgres
  syncUser: async (user: any) => {
    return fetchFromBackend('/users/sync', {
      method: 'POST',
      body: JSON.stringify(user),
    });
  },

  // Save Quiz Attempt to Postgres
  saveQuizAttempt: async (attempt: {
    userId: string;
    chapterId: string;
    score: number;
    difficultyBefore: string;
    difficultyAfter: string;
    xpGained: number;
  }) => {
    return fetchFromBackend('/users/quiz-attempt', {
      method: 'POST',
      body: JSON.stringify(attempt),
    });
  },

  // Fetch Leaderboard from Postgres
  getLeaderboard: async () => {
    return fetchFromBackend('/users/leaderboard');
  },

  // Fetch Users from Postgres
  getUsers: async () => {
    return fetchFromBackend('/users');
  },

  // Fetch Courses from Postgres
  getCourses: async () => {
    return fetchFromBackend('/courses');
  },

  // Save Course to Postgres
  saveCourse: async (course: any) => {
    return fetchFromBackend('/courses', {
      method: 'POST',
      body: JSON.stringify(course),
    });
  },
};
