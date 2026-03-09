export interface Task {
    id: string;
    title: string;
    description: string;
    startDate: string;
    duration: string;
    project: string;
    author: string;
  }
  
  export interface TaskColumn {
    id: string;
    title: string;
    headerColor: string;
    tasks: Task[];
    expanded: boolean;
  }

  