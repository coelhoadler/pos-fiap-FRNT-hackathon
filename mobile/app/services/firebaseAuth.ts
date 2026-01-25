import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";

export function isAuthenticated(): boolean {
    return auth().currentUser !== null; // TODO: ajustar isso depois do login
}

export function signIn(email: string, password: string): Promise<FirebaseAuthTypes.UserCredential> {
    return auth().signInWithEmailAndPassword(email, password);
}

export function signUp(email: string, password: string): Promise<FirebaseAuthTypes.UserCredential> {
    return auth().createUserWithEmailAndPassword(email, password);
}

export default function getCurrentUser(): FirebaseAuthTypes.User | null {
    return auth().currentUser;
}

export function signOut(): Promise<void> {
    return auth().signOut();
}

export function getAuth(): FirebaseAuthTypes.Module {
    return auth();
}

export async function updateUserProfile(updates: { displayName?: string; photoURL?: string }): Promise<void> {
    const user = auth().currentUser;
    if (!user) {
        throw new Error("Nenhum usuário autenticado");
    }
    return user.updateProfile(updates);
}