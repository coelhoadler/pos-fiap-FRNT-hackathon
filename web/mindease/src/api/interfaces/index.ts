
import type { TaskStatus } from "../types";

//Auth
export interface IRegisterData {
  nome: string;
  email: string;
  senha: string;
  confirmarSenha: string;
}

export interface IRegisterResponse {
  success: boolean;
  user?: any;
  error?: string;
}

export interface ILoginData {
  email: string;
  senha: string;
}

export interface ILoginResponse {
  success: boolean;
  user?: any;
  error?: string;
}

//Tasks
export interface ITask {
  id: string;
  title: string;
  description: string;
  startDate: string;
  duration: string;
  projectId: string;
  projectName?: string;
  author: string;
  status: TaskStatus;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITaskData {
  title: string;
  description: string;
  startDate: string;
  duration: string;
  projectId: string;
  projectName?: string;
  author: string;
  status: TaskStatus;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateTaskData {
  title: string;
  description: string;
  startDate: string;
  duration: string;
  projectId: string;
  status?: TaskStatus;
}

export interface IUpdateTaskData {
  title?: string;
  description?: string;
  startDate?: string;
  duration?: string;
  status?: TaskStatus;
}

export interface ITaskResponse {
  success: boolean;
  task?: ITask;
  error?: string;
}

export interface ITasksResponse {
  success: boolean;
  tasks?: ITask[];
  error?: string;
}


//Projetos
export interface IProject {
  id: string;
  name: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IProjectData {
  name: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateProjectData {
  name: string;
}

export interface IUpdateProjectData {
  name?: string;
}

export interface IProjectResponse {
  success: boolean;
  project?: IProject;
  error?: string;
}

export interface IProjectsResponse {
  success: boolean;
  projects?: IProject[];
  error?: string;
}