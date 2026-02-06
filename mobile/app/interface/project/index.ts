export interface IProjectServiceColumn {
  id: string;
  name: string;
}
export interface IProjectService {
  id?: string;
  name: string;
  description: string;
  userId: string;
  columns: IProjectServiceColumn[];
  createdAt?: any;
  updatedAt?: any;
}
