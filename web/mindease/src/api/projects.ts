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
import { getCurrentUser } from './auth';
import type { ICreateProjectData, IProject, IProjectData, IProjectResponse, IProjectsResponse, IUpdateProjectData } from './interfaces';

const convertFirestoreProject = (doc: DocumentData): IProject => {
  const data = doc.data();
  return {
    id: doc.id,
    name: data.name,
    userId: data.userId,
    createdAt: data.createdAt?.toDate() || new Date(),
    updatedAt: data.updatedAt?.toDate() || new Date(),
  };
};


export const createProject = async (data: ICreateProjectData): Promise<IProjectResponse> => {
  try {
    const user = getCurrentUser();
    if (!user) {
      return {
        success: false,
        error: 'Usuário não autenticado',
      };
    }

    if (!data.name || !data.name.trim()) {
      return {
        success: false,
        error: 'O nome do projeto é obrigatório',
      };
    }

    const projectData: IProjectData = {
      name: data.name.trim(),
      userId: user.uid,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const docRef = await addDoc(collection(db, 'projects'), {
      ...projectData,
      createdAt: Timestamp.fromDate(projectData.createdAt),
      updatedAt: Timestamp.fromDate(projectData.updatedAt),
    });

    const newProject: IProject = {
      id: docRef.id,
      ...projectData,
    };

    return {
      success: true,
      project: newProject,
    };
  } catch (error: any) {
    console.error('Erro ao criar projeto:', error);
    return {
      success: false,
      error: error.message || 'Erro ao criar projeto. Tente novamente.',
    };
  }
};

export const getProjects = async (): Promise<IProjectsResponse> => {
  try {
    const user = getCurrentUser();
    if (!user) {
      return {
        success: false,
        error: 'Usuário não autenticado',
      };
    }

    try {
      const q = query(
        collection(db, 'projects'),
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const projects: IProject[] = querySnapshot.docs.map((doc) =>
        convertFirestoreProject(doc)
      );

      return {
        success: true,
        projects,
      };
    } catch (orderByError: any) {
      if (orderByError?.code === 'failed-precondition' || orderByError?.code === 'unimplemented') {
        console.log('Índice não encontrado, buscando sem orderBy...');
        const qWithoutOrderBy = query(
          collection(db, 'projects'),
          where('userId', '==', user.uid)
        );

        const querySnapshot = await getDocs(qWithoutOrderBy);
        const projects: IProject[] = querySnapshot.docs.map((doc) =>
          convertFirestoreProject(doc)
        );

        projects.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

        return {
          success: true,
          projects,
        };
      }
      throw orderByError;
    }
  } catch (error: any) {
    console.error('Erro ao buscar projetos:', error);
    return {
      success: false,
      error: error.message || 'Erro ao buscar projetos. Tente novamente.',
    };
  }
};

export const updateProject = async (
  projectId: string,
  data: IUpdateProjectData
): Promise<IProjectResponse> => {
  try {
    const user = getCurrentUser();
    if (!user) {
      return {
        success: false,
        error: 'Usuário não autenticado',
      };
    }

    const projectRef = doc(db, 'projects', projectId);
    const updateData: any = {
      updatedAt: Timestamp.fromDate(new Date()),
    };

    if (data.name !== undefined) {
      if (!data.name.trim()) {
        return {
          success: false,
          error: 'O nome do projeto não pode estar vazio',
        };
      }
      updateData.name = data.name.trim();
    }

    await updateDoc(projectRef, updateData);

    const projectsResponse = await getProjects();
    if (projectsResponse.success && projectsResponse.projects) {
      const updatedProject = projectsResponse.projects.find((p) => p.id === projectId);
      if (updatedProject) {
        return {
          success: true,
          project: updatedProject,
        };
      }
    }

    return {
      success: true,
    };
  } catch (error: any) {
    console.error('Erro ao atualizar projeto:', error);
    return {
      success: false,
      error: error.message || 'Erro ao atualizar projeto. Tente novamente.',
    };
  }
};

export const deleteProject = async (projectId: string): Promise<IProjectResponse> => {
  try {
    const user = getCurrentUser();
    if (!user) {
      return {
        success: false,
        error: 'Usuário não autenticado',
      };
    }

    const projectRef = doc(db, 'projects', projectId);
    await deleteDoc(projectRef);

    return {
      success: true,
    };
  } catch (error: any) {
    console.error('Erro ao deletar projeto:', error);
    return {
      success: false,
      error: error.message || 'Erro ao deletar projeto. Tente novamente.',
    };
  }
};

export const onProjectsSnapshot = (
  callback: (projects: IProject[]) => void,
  onError?: (error: any) => void
): (() => void) => {
  const user = getCurrentUser();
  if (!user) {
    callback([]);
    return () => {};
  }

  const qWithOrderBy = query(
    collection(db, 'projects'),
    where('userId', '==', user.uid),
    orderBy('createdAt', 'desc')
  );

  const qWithoutOrderBy = query(
    collection(db, 'projects'),
    where('userId', '==', user.uid)
  );

  let unsubscribe: (() => void) | null = null;

  try {
    unsubscribe = onSnapshot(
      qWithOrderBy,
      (querySnapshot: QuerySnapshot<DocumentData>) => {
        const projects: IProject[] = querySnapshot.docs.map((doc) =>
          convertFirestoreProject(doc)
        );
        projects.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        callback(projects);
      },
      (error: any) => {

        if (error?.code === 'failed-precondition' || error?.code === 'unimplemented') {
          console.log('Tentando listener sem orderBy...');
          try {
            unsubscribe = onSnapshot(
              qWithoutOrderBy,
              (querySnapshot: QuerySnapshot<DocumentData>) => {
                const projects: IProject[] = querySnapshot.docs.map((doc) =>
                  convertFirestoreProject(doc)
                );
                projects.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
                callback(projects);
              },
              (fallbackError: any) => {
                console.error('Erro no listener de projetos (sem orderBy):', fallbackError);
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
    console.error('Erro ao configurar listener:', error);
    try {
      unsubscribe = onSnapshot(
        qWithoutOrderBy,
        (querySnapshot: QuerySnapshot<DocumentData>) => {
          const projects: IProject[] = querySnapshot.docs.map((doc) =>
            convertFirestoreProject(doc)
          );
          projects.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
          callback(projects);
        },
        (fallbackError: any) => {
          callback([]);
          if (onError) onError(fallbackError);
        }
      );
    } catch (fallbackErr) {
      console.error('Erro ao configurar listener fallback:', fallbackErr);
      callback([]);
      if (onError) onError(fallbackErr);
    }
  }
  return unsubscribe || (() => {});
};
