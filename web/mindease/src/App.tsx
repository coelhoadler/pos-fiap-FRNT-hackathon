import { BrowserRouter, Route, Routes, useLocation, Navigate } from 'react-router-dom';
import SideNav from './components/SideNav';
import HomePage from './pages/Home';
import NotFoundPage from './pages/NotFound';
import PreferencesPage from './pages/Preferences';
import ProductivityPage from './pages/Productivity';
import { Register as RegisterPage } from './pages/Register';
import TasksPage from './pages/Tasks';
import ProjectsPage from './pages/Projects';
import { Login as LoginPage } from './pages/Login';
import { useAuth } from './hooks';

const ProtectedRoute = ({ children, user, loading }: { children: React.ReactNode; user: any; loading: boolean }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-custom-sand">
        <div className="text-custom-slate">Carregando...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const AppContent = () => {
  const location = useLocation();
  const { user, loading } = useAuth();
  const isAuthPage = location.pathname === '/' || location.pathname === '/register';

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-custom-sand">
        <div className="text-custom-slate">Carregando...</div>
      </div>
    );
  }

  if (user && isAuthPage) {
    return <Navigate to="/home" replace />;
  }

  return (
    <>
      {!isAuthPage && <SideNav />}
      <main className={!isAuthPage ? 'ml-[10vw] p-8' : ''}>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route 
            path="/home" 
            element={
              <ProtectedRoute user={user} loading={loading}>
                <HomePage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/tasks" 
            element={
              <ProtectedRoute user={user} loading={loading}>
                <TasksPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/productivity" 
            element={
              <ProtectedRoute user={user} loading={loading}>
                <ProductivityPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/projects" 
            element={
              <ProtectedRoute user={user} loading={loading}>
                <ProjectsPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/preferences" 
            element={
              <ProtectedRoute user={user} loading={loading}>
                <PreferencesPage />
              </ProtectedRoute>
            } 
          />
          <Route path="/notfound" element={<NotFoundPage />} />
        </Routes>
      </main>
    </>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};

export default App;
