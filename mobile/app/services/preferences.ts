import firestore from "@react-native-firebase/firestore";
import { getPreferencesDocRef } from "./firestorePaths";


export type PreferencesFlags = Record<string, boolean>;

export async function savePreferences(
  preferences: PreferencesFlags
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

export async function getPreferences(): Promise<PreferencesFlags | null> {
  const docRef = getPreferencesDocRef();
  const snapshot = await docRef.get();

  if (!snapshot.exists) {
    return null;
  }

  const data = snapshot.data();
  if (!data) return null;

  const { createdAt, updatedAt, ...flags } = data;
  return flags as PreferencesFlags;
}
