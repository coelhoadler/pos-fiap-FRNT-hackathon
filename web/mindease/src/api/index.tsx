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

export type { IRegisterData, IRegisterResponse, ILoginData, ILoginResponse } from './interfaces';
export { auth, app, analytics, db } from './firebase';

export {
  createProject,
  getProjects,
  updateProject,
  deleteProject,
  onProjectsSnapshot,
} from './projects';

export {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  onTasksSnapshot,
} from './tasks';

export type {
  ITask,
  ITaskData,
  ICreateTaskData,
  IUpdateTaskData,
  ITaskResponse,
  ITasksResponse,
} from './interfaces';

export type { TaskStatus } from './types';
