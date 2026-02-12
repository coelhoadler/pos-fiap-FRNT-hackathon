import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { IPomodoroSettings } from "../interface/pomodoro";

export function getPomodoroSettingsDocRef(): any {
    const user = auth().currentUser;

    if (!user) {
        throw new Error("Usuário não autenticado");
    }

    return firestore()
        .collection("users")
        .doc(user.uid)
        .collection("pomodoro")
        .doc("settings");
}

export async function getPomodoroSettings(): Promise<IPomodoroSettings | null> {
    try {
        const docRef = getPomodoroSettingsDocRef();
        const doc = await docRef.get();

        if (!doc.exists) {
            return null;
        }

        return doc.data() as IPomodoroSettings;
    } catch (error) {
        console.error("Erro ao buscar configurações do Pomodoro:", error);
        throw error;
    }
}

export async function savePomodoroSettings(settings: IPomodoroSettings): Promise<void> {
    try {
        const docRef = getPomodoroSettingsDocRef();
        await docRef.set(settings, { merge: true });
    } catch (error) {
        console.error("Erro ao salvar configurações do Pomodoro:", error);
        throw error;
    }
}

export async function hasPomodoroSettings(): Promise<boolean> {
    try {
        const docRef = getPomodoroSettingsDocRef();
        const doc = await docRef.get();
        return doc.exists;
    } catch (error) {
        console.error("Erro ao verificar configurações do Pomodoro:", error);
        return false;
    }
}
