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