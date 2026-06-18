import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppStateProvider, useAppState } from './hooks/useAppState';
import { Sidebar } from './components/Sidebar';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { CourseCatalog } from './pages/CourseCatalog';
import { CourseDetail } from './pages/CourseDetail';
import { LessonView } from './pages/LessonView';
import { AdaptiveQuiz } from './pages/AdaptiveQuiz';
import { Profile } from './pages/Profile';
import { HistoryPage } from './pages/History';
import { Leaderboard } from './pages/Leaderboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { CourseManager } from './pages/CourseManager';
import { UserManager } from './pages/UserManager';

function AppContent() {
  const { currentUser } = useAppState();

  // If user is not logged in, only allow login or register pages
  if (!currentUser) {
    return (
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Login />} />
      </Routes>
    );
  }

  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-layout">
        <Routes>
          {/* Student Routes */}
          {currentUser.role === 'student' ? (
            <>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/catalog" element={<CourseCatalog />} />
              <Route path="/course/:courseId" element={<CourseDetail />} />
              <Route path="/lesson/:courseId/:chapterId" element={<LessonView />} />
              <Route path="/quiz/:courseId/:chapterId" element={<AdaptiveQuiz />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              {/* Fallback to student dashboard */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </>
          ) : (
            <>
              {/* Admin Routes */}
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/courses" element={<CourseManager />} />
              <Route path="/admin/users" element={<UserManager />} />
              <Route path="/admin/analytics" element={<AdminDashboard />} />
              {/* Fallback to admin console */}
              <Route path="*" element={<Navigate to="/admin" replace />} />
            </>
          )}
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <AppStateProvider>
      <HashRouter>
        <AppContent />
      </HashRouter>
    </AppStateProvider>
  );
}

export default App;
