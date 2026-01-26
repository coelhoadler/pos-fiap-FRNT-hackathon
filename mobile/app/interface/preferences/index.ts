import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
export interface IPreferencesItem {
    title:string,
    description?:string,
    id:string
}
export interface IPreferencesItems {
    preferencesItems: IPreferencesItem[];
}

export interface IPreferencesSettings {
  id?: string;
  createdAt?: FirebaseFirestoreTypes.Timestamp;
  updatedAt?: FirebaseFirestoreTypes.Timestamp;
}
