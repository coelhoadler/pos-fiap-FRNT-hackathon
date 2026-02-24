import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";

export function getPreferencesDocRef() {
  const user = auth().currentUser;

  if (!user) {
    throw new Error("Usuário não autenticado");
  }

  return firestore()
    .collection("users")
    .doc(user.uid)
    .collection("preferences")
    .doc("settings");
}

export function getProjectsCollectionRef() {
  const user = auth().currentUser;

  if (!user) {
    throw new Error("Usuário não autenticado");
  }

  return firestore()
    .collection("users")
    .doc(user.uid)
    .collection("projects");
}

export function getTasksCollectionRef(projectId: string) {
  const user = auth().currentUser;
  
  if (!user) {
    throw new Error("Usuário não autenticado");
  }

  // SEMPRE usar o uid para o caminho do documento para manter a integridade
  return firestore()
    .collection("users")
    .doc(user.uid)
    .collection("projects")
    .doc(projectId)
    .collection("tasks");
}

export function getPomodoroHistoryCollectionRef() {
  const user = auth().currentUser;

  if (!user) {
    throw new Error("Usuário não autenticado");
  }

  return firestore()
    .collection("users")
    .doc(user.uid)
    .collection("pomodoro")
    .doc("data")
    .collection("history");
}