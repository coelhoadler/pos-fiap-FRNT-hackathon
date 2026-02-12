import { ThemedText } from "@/app/components/themed-text";
import { ThemedView } from "@/app/components/themed-view";
import { useState, useEffect } from "react";
import { StyleSheet, TouchableOpacity, View, Alert, ActivityIndicator, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ToggleItem } from "@/app/components/ui/toggleItem/toggleItem";
import { TabsRoutes } from "./tabsRouters";
import { savePomodoroSettings, getPomodoroSettings } from "@/app/services/pomodoroSettings";
import { IPomodoroSettings } from "@/app/interface/pomodoro";
import Toast from "react-native-toast-message";

export default function PomodoroSettings() {
    const router = useRouter();
    const [pomodoroTime, setPomodoroTime] = useState(5);
    const [shortBreak, setShortBreak] = useState(1);
    const [longBreak, setLongBreak] = useState(5);
    const [musicEnabled, setMusicEnabled] = useState(false);
    const [soundEnabledWhenFinish, setSoundEnabledWhenFinish] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Carregar configurações ao montar o componente

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            setIsLoading(true);
            const settings = await getPomodoroSettings();
            if (settings) {
                setPomodoroTime(settings.pomodoroTime);
                setShortBreak(settings.shortBreak);
                setLongBreak(settings.longBreak);
                setMusicEnabled(settings.musicEnabled);
                setSoundEnabledWhenFinish(settings.soundEnabledWhenFinish);
            }
        } catch (error) {
            console.error("Erro ao carregar configurações:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            setIsSaving(true);
            const settings: IPomodoroSettings = {
                pomodoroTime,
                shortBreak,
                longBreak,
                musicEnabled,
                soundEnabledWhenFinish,
            };
            await savePomodoroSettings(settings);
            Toast.show({
                type: 'success',
                text1: 'Sucesso',
                text2: 'Configurações salvas com sucesso!',
                text1Style: { fontSize: 18, fontWeight: 'bold' },
                text2Style: { fontSize: 16 },
            });
        } catch (error) {
            console.error("Erro ao salvar configurações:", error);
            Alert.alert("Erro", "Não foi possível salvar as configurações. Tente novamente.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <ThemedView style={styles.container}>
            <ScrollView contentContainerStyle={{ paddingBottom: 20 }} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.navigate(`/(screens)/home/(tabs)/${TabsRoutes.Focus}`)} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#4A90E2" />
                        <ThemedText style={styles.backText}>Voltar</ThemedText>
                    </TouchableOpacity>
                    <View style={styles.placeholder} />
                </View>

                <ThemedText style={styles.title}>DURAÇÕES</ThemedText>

                {/* Cards de configuração de tempo */}
                <View style={styles.timeCardsWrapper}>
                    <View style={styles.timeCardsContainer}>
                        <TouchableOpacity
                            style={styles.timeCard}
                            onPress={() => setPomodoroTime(Math.min(60, pomodoroTime + 1))}
                            onLongPress={() => setPomodoroTime(Math.max(1, pomodoroTime - 1))}
                            activeOpacity={0.7}
                        >
                            <ThemedText style={styles.timeNumber}>{pomodoroTime}</ThemedText>
                            <ThemedText style={styles.timeDescription}>POMODORO</ThemedText>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.timeCard}
                            onPress={() => setShortBreak(Math.min(30, shortBreak + 1))}
                            onLongPress={() => setShortBreak(Math.max(1, shortBreak - 1))}
                            activeOpacity={0.7}
                        >
                            <ThemedText style={styles.timeNumber}>{shortBreak}</ThemedText>
                            <ThemedText style={styles.timeDescription}>PAUSA</ThemedText>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.timeCard}
                            onPress={() => setLongBreak(Math.min(60, longBreak + 1))}
                            onLongPress={() => setLongBreak(Math.max(5, longBreak - 1))}
                            activeOpacity={0.7}
                        >
                            <ThemedText style={styles.timeNumber}>{longBreak}</ThemedText>
                            <ThemedText style={styles.timeDescription}>PAUSA LONGA</ThemedText>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Toggle Música */}
                <View style={styles.toggleContainer}>
                    <ThemedText style={styles.title}>Música durante pomodoro</ThemedText>
                    <View style={styles.toggleRow}>
                        <ThemedText style={styles.toggleLabel}>desativado</ThemedText>
                        <ToggleItem
                            id="music-toggle"
                            value={musicEnabled}
                            onChange={setMusicEnabled}
                            containerStyle={{ marginRight: 7 }}
                        />
                        <ThemedText style={styles.toggleLabel}>ativado</ThemedText>
                    </View>
                </View>

                {/* Toggle Som ao terminar */}
                <View style={styles.toggleContainer}>
                    <ThemedText style={styles.title}>Som ao terminar o ciclo</ThemedText>
                    <View style={styles.toggleRow}>
                        <ThemedText style={styles.toggleLabel}>desativado</ThemedText>
                        <ToggleItem
                            id="sound-toggle"
                            value={soundEnabledWhenFinish}
                            onChange={setSoundEnabledWhenFinish}
                            containerStyle={{ marginRight: 7 }}
                        />
                        <ThemedText style={styles.toggleLabel}>ativado</ThemedText>
                    </View>
                </View>

                {/* Botão Salvar */}
                <TouchableOpacity
                    style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
                    onPress={handleSave}
                    disabled={isSaving || isLoading}
                >
                    {isSaving ? (
                        <ActivityIndicator color="#FFFFFF" />
                    ) : (
                        <ThemedText style={styles.saveButtonText}>Salvar Configurações</ThemedText>
                    )}
                </TouchableOpacity>
                <Toast />
            </ScrollView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 30,
        paddingTop: 10,
    },
    backButton: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    backText: {
        color: "#4A90E2",
        fontSize: 16,
    },
    title: {
        fontSize: 16,
        fontWeight: "bold",
        textAlign: "center",
        textTransform: "uppercase",
        letterSpacing: 2,
        marginBottom: 16,
        color: "#AAAAAA",
    },
    placeholder: {
        width: 38,
    },
    timeCardsWrapper: {
        borderWidth: 2,
        borderColor: "#6B6B6B",
        borderRadius: 14,
        padding: 10,
        marginBottom: 40,
    },
    timeCardsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 10,
    },
    timeCard: {
        flex: 1,
        backgroundColor: "#6B6B6B",
        borderRadius: 10,
        paddingVertical: 18,
        paddingHorizontal: 8,
        alignItems: "center",
        justifyContent: "center",
    },
    timeNumber: {
        fontSize: 48,
        fontWeight: "bold",
        color: "#FFFFFF",
        lineHeight: 54,
    },
    timeDescription: {
        fontSize: 12,
        fontWeight: "bold",
        color: "#FFFFFF",
        textAlign: "center",
        textTransform: "uppercase",
        letterSpacing: 1,
        marginTop: 4,
    },
    toggleContainer: {
        marginBottom: 30,
    },
    toggleTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#000000",
        marginBottom: 15,
    },
    toggleRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 15,
    },
    toggleLabel: {
        fontSize: 14,
    },
    saveButton: {
        backgroundColor: "#4A90E2",
        paddingVertical: 16,
        paddingHorizontal: 40,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        minHeight: 56,
    },
    saveButtonDisabled: {
        backgroundColor: "#A0A0A0",
        opacity: 0.6,
    },
    saveButtonText: {
        color: "#FFFFFF",
        fontSize: 18,
        fontWeight: "bold",
    },
});
