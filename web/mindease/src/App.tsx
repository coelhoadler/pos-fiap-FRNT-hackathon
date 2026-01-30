import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
// import IconBackground from './assets/background.png';
// import { TextField, Button, Link, Stack, Box } from '@mui/material';
import SideNav from './components/SideNav';
import HomePage from './pages/Home';
import NotFoundPage from './pages/NotFound';
import PreferencesPage from './pages/Preferences';
import ProductivityPage from './pages/Productivity';
import { Register as RegisterPage } from './pages/Register';
import TasksPage from './pages/Tasks';
import { Login as LoginPage } from './pages/Login';

const AppContent = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <>
      {!isAuthPage && <SideNav />}
      <main className={!isAuthPage ? 'ml-[10vw] p-8' : ''}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/productivity" element={<ProductivityPage />} />
          <Route path="/preferences" element={<PreferencesPage />} />
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
