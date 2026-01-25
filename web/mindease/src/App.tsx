import { BrowserRouter, Route, Routes } from 'react-router-dom';
// import IconBackground from './assets/background.png';
// import { TextField, Button, Link, Stack, Box } from '@mui/material';
import SideNav from './components/SideNav';
import HomePage from './pages/Home';
import NotFoundPage from './pages/NotFound';
import PreferencesPage from './pages/Preferences';
import ProductivityPage from './pages/Productivity';
import RegisterPage from './pages/Register';
import TasksPage from './pages/Tasks';

const App = () => {
  // return (
  //   <div
  //     style={{
  //       display: 'flex',
  //       flexDirection: 'row',
  //       width: '100vw',
  //       height: '100vh',
  //       margin: 0,
  //     }}
  //   >
  //     <div style={{ width: '60vw', height: '100vh' }}>
  //       <img
  //         src={IconBackground}
  //         alt="Background"
  //         style={{ width: '100%', height: '100%', objectFit: 'cover' }}
  //       />
  //     </div>
  //     <div
  //       style={{
  //         width: '40vw',
  //         height: '100vh',
  //         display: 'flex',
  //         alignItems: 'center',
  //         justifyContent: 'center',
  //       }}
  //     >
  //       <Box
  //         component="form"
  //         onSubmit={(e) => {
  //           e.preventDefault();
  //           console.log('Login submit');
  //         }}
  //         sx={{
  //           width: '80%',
  //           display: 'flex',
  //           flexDirection: 'column',
  //           gap: 2,
  //         }}
  //       >
  //         <TextField
  //           label="E-mail"
  //           type="email"
  //           variant="outlined"
  //           required
  //           fullWidth
  //         />
  //         <TextField
  //           label="Password"
  //           type="password"
  //           variant="outlined"
  //           required
  //           fullWidth
  //         />
  //         <Stack direction="row" spacing={2} justifyContent="space-between">
  //           <Button type="submit" variant="contained" color="primary">
  //             Login
  //           </Button>
  //           <Button variant="outlined" color="secondary">
  //             Register
  //           </Button>
  //         </Stack>
  //         <Link href="#" underline="hover" sx={{ textAlign: 'center' }}>
  //           Esqueci a senha
  //         </Link>
  //       </Box>
  //     </div>
  //   </div>
  // );

  return (
    <BrowserRouter>
      <SideNav />

      {/* Conteúdo principal */}
      <main className="ml-[10vw] p-8">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/productivity" element={<ProductivityPage />} />
          <Route path="/preferences" element={<PreferencesPage />} />
          <Route path="/notfound" element={<NotFoundPage />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
};

export default App;
