import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";

export function isAuthenticated(): boolean {
    return auth().currentUser !== null;
}

export function signIn(email: string, password: string): Promise<FirebaseAuthTypes.UserCredential> {
    return auth().signInWithEmailAndPassword(email, password);
}

export function signUp(email: string, password: string): Promise<FirebaseAuthTypes.UserCredential> {
    return auth().createUserWithEmailAndPassword(email, password);
}

export function getCurrentUser(): FirebaseAuthTypes.User | null {
    return auth().currentUser;
}

export function signOut(): Promise<void> {
    return auth().signOut();
}
