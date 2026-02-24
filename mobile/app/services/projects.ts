import firestore from "@react-native-firebase/firestore";
import { IProjectService } from "../interface/project";
import { getProjectsCollectionRef, getTasksCollectionRef } from "./firestorePaths";


export async function createProject(
  project: Omit<IProjectService, "id">
): Promise<void> {
  const collectionRef = getProjectsCollectionRef();
  await collectionRef.add({
    ...project,
    createdAt: firestore.FieldValue.serverTimestamp(),
    updatedAt: firestore.FieldValue.serverTimestamp(),
  });
}

export async function getProjects(): Promise<IProjectService[]> {
  const collectionRef = getProjectsCollectionRef();
  const snapshot = await collectionRef.orderBy("createdAt", "desc").get();
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as IProjectService[];
}

export async function updateProject(
  projectId: string,
  data: Partial<IProjectService>
): Promise<void> {
  const collectionRef = getProjectsCollectionRef();
  await collectionRef.doc(projectId).update({
    ...data,
    updatedAt: firestore.FieldValue.serverTimestamp(),
  });
}

/**
 * 🔥 DELETE COMPLETO
 * Remove todas as tasks do projeto e depois remove o projeto
 */
export async function deleteProject(projectId: string): Promise<void> {
  const collectionRef = getProjectsCollectionRef();
  const tasksCollectionRef = getTasksCollectionRef(projectId);

  const tasksSnapshot = await tasksCollectionRef.get();

  const batch = firestore().batch();

  // 🔥 Remove todas as tasks
  tasksSnapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });

  // 🔥 Remove o projeto
  batch.delete(collectionRef.doc(projectId));

  await batch.commit();
}

export async function getProjectById(
  projectId: string
): Promise<IProjectService | null> {
  const collectionRef = getProjectsCollectionRef();
  const doc = await collectionRef.doc(projectId).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() } as IProjectService;
}

export async function addColumnToProject(
  projectId: string,
  columnName: string
): Promise<void> {
  const collectionRef = getProjectsCollectionRef();
  const newColumn = {
    id: Math.random().toString(36).substr(2, 9),
    name: columnName,
    createdAt: new Date().toISOString(),
  };
  await collectionRef.doc(projectId).update({
    columns: firestore.FieldValue.arrayUnion(newColumn),
    updatedAt: firestore.FieldValue.serverTimestamp(),
  });
}

export async function updateColumnInProject(
  projectId: string,
  updatedColumns: any[]
): Promise<void> {
  const collectionRef = getProjectsCollectionRef();
  await collectionRef.doc(projectId).update({
    columns: updatedColumns,
    updatedAt: firestore.FieldValue.serverTimestamp(),
  });
}

export async function deleteColumnFromProject(
  projectId: string,
  column: any
): Promise<void> {
  const collectionRef = getProjectsCollectionRef();
  await collectionRef.doc(projectId).update({
    columns: firestore.FieldValue.arrayRemove(column),
    updatedAt: firestore.FieldValue.serverTimestamp(),
  });
}