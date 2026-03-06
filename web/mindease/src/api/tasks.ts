import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
  type DocumentData,
  type QuerySnapshot,
} from 'firebase/firestore';
import { db } from './firebase';
import { getCurrentUser, getUserInfo } from './auth';
import type { ICreateTaskData, ITask, ITaskData, ITaskResponse, ITasksResponse, IUpdateTaskData } from './interfaces';

const convertFirestoreTask = (doc: DocumentData): ITask => {
  const data = doc.data();
  return {
    id: doc.id,
    title: data.title,
    description: data.description,
    startDate: data.startDate,
    duration: data.duration,
    projectId: data.projectId,
    projectName: data.projectName,
    author: data.author,
    status: data.status || 'pendentes',
    userId: data.userId,
    createdAt: data.createdAt?.toDate() || new Date(),
    updatedAt: data.updatedAt?.toDate() || new Date(),
  };
};

export const createTask = async (data: ICreateTaskData): Promise<ITaskResponse> => {
  try {
    const user = getCurrentUser();
    if (!user) {
      return {
        success: false,
        error: 'Usuário não autenticado',
      };
    }

    const userInfo = getUserInfo();
    if (!userInfo) {
      return {
        success: false,
        error: 'Não foi possível obter informações do usuário',
      };
    }

    if (!data.title || !data.title.trim()) {
      return {
        success: false,
        error: 'O título da tarefa é obrigatório',
      };
    }

    if (!data.projectId) {
      return {
        success: false,
        error: 'O projeto é obrigatório',
      };
    }

    const taskData: ITaskData = {
      title: data.title.trim(),
      description: data.description?.trim() || '',
      startDate: data.startDate || new Date().toLocaleDateString('pt-BR'),
      duration: data.duration || '30 min',
      projectId: data.projectId,
      author: userInfo.displayName || userInfo.email || 'Usuário',
      status: data.status || 'pendentes',
      userId: user.uid,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const docRef = await addDoc(collection(db, 'tasks'), {
      ...taskData,
      createdAt: Timestamp.fromDate(taskData.createdAt),
      updatedAt: Timestamp.fromDate(taskData.updatedAt),
    });

    const newTask: ITask = {
      id: docRef.id,
      ...taskData,
    };

    return {
      success: true,
      task: newTask,
    };
  } catch (error: any) {
    console.error('Erro ao criar tarefa:', error);
    return {
      success: false,
      error: error.message || 'Erro ao criar tarefa. Tente novamente.',
    };
  }
};

export const getTasks = async (projectId?: string): Promise<ITasksResponse> => {
  try {
    const user = getCurrentUser();
    if (!user) {
      return {
        success: false,
        error: 'Usuário não autenticado',
      };
    }

    let q;
    let querySnapshot;
    
    if (projectId) {
      try {
        q = query(
          collection(db, 'tasks'),
          where('userId', '==', user.uid),
          where('projectId', '==', projectId),
          orderBy('createdAt', 'desc')
        );
        querySnapshot = await getDocs(q);
      } catch (orderByError: any) {
        if (orderByError?.code === 'failed-precondition' || orderByError?.code === 'unimplemented') {
          console.log('Índice não encontrado, buscando sem orderBy...');
          q = query(
            collection(db, 'tasks'),
            where('userId', '==', user.uid),
            where('projectId', '==', projectId)
          );
          querySnapshot = await getDocs(q);
        } else {
          throw orderByError;
        }
      }
    } else {
      try {
        q = query(
          collection(db, 'tasks'),
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );
        querySnapshot = await getDocs(q);
      } catch (orderByError: any) {
        if (orderByError?.code === 'failed-precondition' || orderByError?.code === 'unimplemented') {
          console.log('Índice não encontrado, buscando sem orderBy...');
          q = query(
            collection(db, 'tasks'),
            where('userId', '==', user.uid)
          );
          querySnapshot = await getDocs(q);
        } else {
          throw orderByError;
        }
      }
    }

    const tasks: ITask[] = querySnapshot.docs.map((doc) =>
      convertFirestoreTask(doc)
    );

    tasks.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    console.log(`getTasks: Encontradas ${tasks.length} tarefas${projectId ? ` para projeto ${projectId}` : ''}`);
    return {
      success: true,
      tasks,
    };
  } catch (error: any) {
    console.error('Erro ao buscar tarefas:', error);
    return {
      success: false,
      error: error.message || 'Erro ao buscar tarefas. Tente novamente.',
    };
  }
};

export const updateTask = async (
  taskId: string,
  data: IUpdateTaskData
): Promise<ITaskResponse> => {
  try {
    const user = getCurrentUser();
    if (!user) {
      return {
        success: false,
        error: 'Usuário não autenticado',
      };
    }

    const taskRef = doc(db, 'tasks', taskId);
    const updateData: any = {
      updatedAt: Timestamp.fromDate(new Date()),
    };

    if (data.title !== undefined) {
      if (!data.title.trim()) {
        return {
          success: false,
          error: 'O título da tarefa não pode estar vazio',
        };
      }
      updateData.title = data.title.trim();
    }

    if (data.description !== undefined) {
      updateData.description = data.description.trim();
    }

    if (data.startDate !== undefined) {
      updateData.startDate = data.startDate;
    }

    if (data.duration !== undefined) {
      updateData.duration = data.duration;
    }

    if (data.status !== undefined) {
      updateData.status = data.status;
    }

    await updateDoc(taskRef, updateData);

    const tasksResponse = await getTasks();
    if (tasksResponse.success && tasksResponse.tasks) {
      const updatedTask = tasksResponse.tasks.find((t) => t.id === taskId);
      if (updatedTask) {
        return {
          success: true,
          task: updatedTask,
        };
      }
    }

    return {
      success: true,
    };
  } catch (error: any) {
    console.error('Erro ao atualizar tarefa:', error);
    return {
      success: false,
      error: error.message || 'Erro ao atualizar tarefa. Tente novamente.',
    };
  }
};

export const deleteTask = async (taskId: string): Promise<ITaskResponse> => {
  try {
    const user = getCurrentUser();
    if (!user) {
      return {
        success: false,
        error: 'Usuário não autenticado',
      };
    }

    const taskRef = doc(db, 'tasks', taskId);
    await deleteDoc(taskRef);

    return {
      success: true,
    };
  } catch (error: any) {
    console.error('Erro ao deletar tarefa:', error);
    return {
      success: false,
      error: error.message || 'Erro ao deletar tarefa. Tente novamente.',
    };
  }
};

export const onTasksSnapshot = (
  callback: (tasks: ITask[]) => void,
  onError?: (error: any) => void,
  projectId?: string
): (() => void) => {
  const user = getCurrentUser();
  if (!user) {
    callback([]);
    return () => {};
  }

  const createQuery = (withOrderBy: boolean) => {
    if (projectId) {
      if (withOrderBy) {
        return query(
          collection(db, 'tasks'),
          where('userId', '==', user.uid),
          where('projectId', '==', projectId),
          orderBy('createdAt', 'desc')
        );
      } else {
        return query(
          collection(db, 'tasks'),
          where('userId', '==', user.uid),
          where('projectId', '==', projectId)
        );
      }
    } else {
      if (withOrderBy) {
        return query(
          collection(db, 'tasks'),
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );
      } else {
        return query(
          collection(db, 'tasks'),
          where('userId', '==', user.uid)
        );
      }
    }
  };

  let unsubscribe: (() => void) | null = null;

  try {
    const q = createQuery(true);
    unsubscribe = onSnapshot(
      q,
      (querySnapshot: QuerySnapshot<DocumentData>) => {
        const tasks: ITask[] = querySnapshot.docs.map((doc) =>
          convertFirestoreTask(doc)
        );
        tasks.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        console.log('Listener de tarefas atualizado:', tasks.length, 'tarefas');
        callback(tasks);
      },
      (error: any) => {
        console.error('Erro no listener de tarefas (com orderBy):', error);
        if (error?.code === 'failed-precondition' || error?.code === 'unimplemented') {
          console.log('Tentando listener sem orderBy...');
          try {
            const qWithoutOrderBy = createQuery(false);
            unsubscribe = onSnapshot(
              qWithoutOrderBy,
              (querySnapshot: QuerySnapshot<DocumentData>) => {
                const tasks: ITask[] = querySnapshot.docs.map((doc) =>
                  convertFirestoreTask(doc)
                );
                tasks.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
                console.log('Listener de tarefas atualizado (sem orderBy):', tasks.length, 'tarefas');
                callback(tasks);
              },
              (fallbackError: any) => {
                console.error('Erro no listener de tarefas (fallback):', fallbackError);
                callback([]);
                if (onError) onError(fallbackError);
              }
            );
          } catch (fallbackErr) {
            console.error('Erro ao configurar listener fallback:', fallbackErr);
            callback([]);
            if (onError) onError(fallbackErr);
          }
        } else {
          callback([]);
          if (onError) onError(error);
        }
      }
    );
  } catch (error: any) {
    console.error('Erro ao configurar listener de tarefas:', error);
    try {
      const qWithoutOrderBy = createQuery(false);
      unsubscribe = onSnapshot(
        qWithoutOrderBy,
        (querySnapshot: QuerySnapshot<DocumentData>) => {
          const tasks: ITask[] = querySnapshot.docs.map((doc) =>
            convertFirestoreTask(doc)
          );
          tasks.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
          console.log('Listener de tarefas atualizado (sem orderBy inicial):', tasks.length, 'tarefas');
          callback(tasks);
        },
        (fallbackError: any) => {
          console.error('Erro no listener de tarefas (fallback inicial):', fallbackError);
          callback([]);
          if (onError) onError(fallbackError);
        }
      );
    } catch (fallbackErr) {
      console.error('Erro ao configurar listener fallback inicial:', fallbackErr);
      callback([]);
      if (onError) onError(fallbackErr);
    }
  }

  return unsubscribe || (() => {});
};
