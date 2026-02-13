import firestore from "@react-native-firebase/firestore";
import { IProjectService } from "../interface/project";
import { getProjectsCollectionRef } from "./firestorePaths";


// Criar novo projeto
export async function createProject(project: Omit<IProjectService, "id">): Promise<void> {
  const collectionRef = getProjectsCollectionRef();
  
  await collectionRef.add({
    ...project,
    createdAt: firestore.FieldValue.serverTimestamp(),
    updatedAt: firestore.FieldValue.serverTimestamp(),
  });
}

// Buscar todos os projetos do usuário
export async function getProjects(): Promise<IProjectService[]> {
  const collectionRef = getProjectsCollectionRef();
  const snapshot = await collectionRef.orderBy("createdAt", "desc").get();

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as IProjectService[];
}

// Atualizar projeto existente
export async function updateProject(projectId: string, data: Partial<IProjectService>): Promise<void> {
  const collectionRef = getProjectsCollectionRef();
  await collectionRef.doc(projectId).update({
    ...data,
    updatedAt: firestore.FieldValue.serverTimestamp(),
  });
}

// Excluir projeto
export async function deleteProject(projectId: string): Promise<void> {
  const collectionRef = getProjectsCollectionRef();
  await collectionRef.doc(projectId).delete();
}

// Buscar um único projeto pelo ID
export async function getProjectById(projectId: string): Promise<IProjectService | null> {
  const collectionRef = getProjectsCollectionRef();
  const doc = await collectionRef.doc(projectId).get();
  
  if (!doc.exists) return null;

  return { id: doc.id, ...doc.data() } as IProjectService;
}

// Adicionar uma coluna ao projeto (assumindo que 'columns' seja um array no documento)
export async function addColumnToProject(projectId: string, columnName: string): Promise<void> {
  const collectionRef = getProjectsCollectionRef();
  const newColumn = {
    id: Math.random().toString(36).substr(2, 9),
    title: columnName,
    createdAt: new Date().toISOString()
  };

  await collectionRef.doc(projectId).update({
    columns: firestore.FieldValue.arrayUnion(newColumn),
    updatedAt: firestore.FieldValue.serverTimestamp(),
  });
}