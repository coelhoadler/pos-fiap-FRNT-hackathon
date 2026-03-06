import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';
import SideNav from './components/SideNav';
import { useAuth } from './hooks';
import HomePage from './pages/Home';
import { Login as LoginPage } from './pages/Login';
import NotFoundPage from './pages/NotFound';
import PreferencesPage from './pages/Preferences';
import { Register as RegisterPage } from './pages/Register';
import TasksPage from './pages/Tasks';
import ProjectsPage from './pages/Projects';

// Componente para proteger rotas que requerem autenticação
const ProtectedRoute = ({
  children,
  user,
  loading,
}: {
  children: React.ReactNode;
  user: any;
  loading: boolean;
}) => {
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
  const isAuthPage =
    location.pathname === '/' || location.pathname === '/register';

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
          // Rota catch-all para páginas não encontradas
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
