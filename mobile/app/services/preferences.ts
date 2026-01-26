import { IPreferencesSettings } from "@/app/interface/preferences";
import firestore from "@react-native-firebase/firestore";
import { getPreferencesDocRef } from "./firestorePaths";


export async function savePreferences(
  preferences: Omit<IPreferencesSettings, "id" | "createdAt" | "updatedAt">
): Promise<void> {
  const docRef = getPreferencesDocRef();

  await docRef.set(
    {
      ...preferences,
      updatedAt: firestore.FieldValue.serverTimestamp(),
      createdAt: firestore.FieldValue.serverTimestamp(),
    },
    { merge: true }
  );
}

export async function getPreferences(): Promise<IPreferencesSettings | null> {
  const docRef = getPreferencesDocRef();
  const snapshot = await docRef.get();

  if (!snapshot.exists) {
    return null;
  }

  return {
    id: snapshot.id,
    ...(snapshot.data() as Omit<IPreferencesSettings, "id">),
  };
}

export async function updatePreferences(
  updates: Partial<Omit<IPreferencesSettings, "id" | "updatedAt">>
): Promise<void> {
  const docRef = getPreferencesDocRef();

  await docRef.update({
    ...updates,
    updatedAt: firestore.FieldValue.serverTimestamp(),
  });
}
