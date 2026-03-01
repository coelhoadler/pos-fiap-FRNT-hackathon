import auth from "@react-native-firebase/auth";
import firestore, {
  addDoc,
  deleteDoc,
  doc,
  limit as firestoreLimit,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
  writeBatch,
} from "@react-native-firebase/firestore";
import { ITaskService } from "../interface/tasks";
import { getTasksCollectionRef } from "./firestorePaths";

const db = firestore();

export async function createTask(
  projectId: string,
  task: Omit<ITaskService, "id" | "createdAt" | "updatedAt">
): Promise<void> {
  const collectionRef = getTasksCollectionRef(projectId);
  const user = auth().currentUser;

  const authorName = user?.displayName || user?.email || "Usuário sem nome";

  await addDoc(collectionRef, {
    ...task,
    author: authorName,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}


export async function getTaskById(
  projectId: string,
  taskId: string
): Promise<ITaskService | null> {
  const collectionRef = getTasksCollectionRef(projectId);
  const taskDocRef = doc(db, collectionRef.path, taskId);
  const snapshot = await getDoc(taskDocRef);

  if (snapshot.exists()) {
    return {
      id: snapshot.id,
      ...(snapshot.data() as Omit<ITaskService, "id">),
    } as ITaskService;
  }

  return null;
}

export async function getTasksByColumn(
  projectId: string,
  columnId: string
): Promise<ITaskService[]> {
  const collectionRef = getTasksCollectionRef(projectId);
  
  const q = query(
    collectionRef,
    where("columnId", "==", columnId),
    orderBy("createdAt", "asc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<ITaskService, "id">),
  })) as ITaskService[];
}

export async function getLimitedTasksByColumn(
  projectId: string,
  columnId: string,
  limitNumber: number = 3
): Promise<ITaskService[]> {
  const collectionRef = getTasksCollectionRef(projectId);
  
  const q = query(
    collectionRef,
    where("columnId", "==", columnId),
    orderBy("createdAt", "desc"),
    firestoreLimit(limitNumber)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<ITaskService, "id">),
  })) as ITaskService[];
}

export async function updateTask(
  projectId: string,
  taskId: string,
  data: Partial<Omit<ITaskService, "id" | "createdAt">>
): Promise<void> {
  const collectionRef = getTasksCollectionRef(projectId);
  const taskDocRef = doc(db, collectionRef.path, taskId);
  
  await updateDoc(taskDocRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteTask(
  projectId: string,
  taskId: string
): Promise<void> {
  const collectionRef = getTasksCollectionRef(projectId);
  const taskDocRef = doc(db, collectionRef.path, taskId);
  
  await deleteDoc(taskDocRef);
}

export async function deleteTasksByColumn(
  projectId: string,
  columnId: string
): Promise<void> {
  const collectionRef = getTasksCollectionRef(projectId);
  const q = query(collectionRef, where("columnId", "==", columnId));
  const snapshot = await getDocs(q);

  const batch = writeBatch(db);
  snapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });

  await batch.commit();
}