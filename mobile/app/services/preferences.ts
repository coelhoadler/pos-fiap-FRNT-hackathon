import firestore from "@react-native-firebase/firestore";
import { getPreferencesDocRef } from "./firestorePaths";

export type PreferencesFlags = Record<string, boolean>;
export async function savePreferences(
  preferences: PreferencesFlags
): Promise<void> {
  const docRef = getPreferencesDocRef();

  try {
    await docRef.update({
      ...preferences,
      updatedAt: firestore.FieldValue.serverTimestamp(),
    });
  } catch (error: any) {
  
    if (error?.code === "firestore/not-found") {
      await docRef.set({
        ...preferences,
        createdAt: firestore.FieldValue.serverTimestamp(),
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });
    } else {
      throw error; 
    }
  }
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
