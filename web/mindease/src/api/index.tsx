export { 
  registerUser, 
  loginUser, 
  logoutUser,
  saveUserToSession,
  getUserFromSession,
  clearUserFromSession,
  isUserAuthenticated,
  getCurrentUser,
  getUserInfo
} from './auth';
export type { RegisterData, RegisterResponse, LoginData, LoginResponse } from './auth';
export { auth, app, analytics } from './firebase';
