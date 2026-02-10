import { getPomodoroHistoryCollectionRef } from "./firestorePaths";
import { IPomodoroHistory } from "@/app/interface/pomodoro";

export async function savePomodoroHistory(history: IPomodoroHistory): Promise<void> {
    try {
        const historyRef = getPomodoroHistoryCollectionRef();
        await historyRef.add({
            ...history,
            timestamp: new Date(),
        });
    } catch (error) {
        console.error("Erro ao salvar histórico do Pomodoro:", error);
        throw error;
    }
}

export async function getPomodoroHistory(limit: number = 50): Promise<IPomodoroHistory[]> {
    try {
        const historyRef = getPomodoroHistoryCollectionRef();
        const snapshot = await historyRef
            .orderBy("timestamp", "desc")
            .limit(limit)
            .get();

        return snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                ...data,
                timestamp: data.timestamp?.toDate(),
            } as IPomodoroHistory;
        });
    } catch (error) {
        console.error("Erro ao buscar histórico do Pomodoro:", error);
        throw error;
    }
}
