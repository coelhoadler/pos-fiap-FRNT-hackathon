import { ThemedText } from "@/app/components/themed-text";
import { ThemedView } from "@/app/components/themed-view";
import { useState, useEffect } from "react";
import { StyleSheet, TouchableOpacity, View, Alert, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ToggleItem } from "@/app/components/ui/toggleItem/toggleItem";
import { TabsRoutes } from "./tabsRouters";
import { savePomodoroSettings, getPomodoroSettings } from "@/app/services/pomodoroSettings";
import { IPomodoroSettings } from "@/app/interface/pomodoro";

export default function PomodoroSettings() {
    const router = useRouter();
    const [pomodoroTime, setPomodoroTime] = useState(25);
    const [shortBreak, setShortBreak] = useState(5);
    const [longBreak, setLongBreak] = useState(10);
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
            Alert.alert("Sucesso", "Configurações salvas com sucesso!", [
                {
                    text: "OK",
                    onPress: () => router.navigate(`/(screens)/home/(tabs)/${TabsRoutes.Focus}`),
                },
            ]);
        } catch (error) {
            console.error("Erro ao salvar configurações:", error);
            Alert.alert("Erro", "Não foi possível salvar as configurações. Tente novamente.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <ThemedView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.navigate(`/(screens)/home/(tabs)/${TabsRoutes.Focus}`)} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={28} color="#5A5A5A" />
                </TouchableOpacity>
                <View style={styles.placeholder} />
            </View>

            {/* Cards de configuração de tempo */}
            <View style={styles.timeCardsContainer}>
                <View style={styles.timeCard}>
                    <ThemedText style={styles.timeDescription}>Pomodoro</ThemedText>
                    <View style={styles.rangeControls}>
                        <TouchableOpacity
                            style={styles.rangeButton}
                            onPress={() => setPomodoroTime(Math.max(1, pomodoroTime - 1))}
                        >
                            <Ionicons name="remove" size={24} color="#4A90E2" />
                        </TouchableOpacity>
                        <View style={styles.rangeValue}>
                            <ThemedText style={styles.timeNumber}>{pomodoroTime}</ThemedText>
                            <ThemedText style={styles.timeLabel}>minutos</ThemedText>
                        </View>
                        <TouchableOpacity
                            style={styles.rangeButton}
                            onPress={() => setPomodoroTime(Math.min(60, pomodoroTime + 1))}
                        >
                            <Ionicons name="add" size={24} color="#4A90E2" />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.timeCard}>
                    <ThemedText style={styles.timeDescription}>
                        pausa entre{"\n"}Pomodoros
                    </ThemedText>
                    <View style={styles.rangeControls}>
                        <TouchableOpacity
                            style={styles.rangeButton}
                            onPress={() => setShortBreak(Math.max(1, shortBreak - 1))}
                        >
                            <Ionicons name="remove" size={24} color="#4A90E2" />
                        </TouchableOpacity>
                        <View style={styles.rangeValue}>
                            <ThemedText style={styles.timeNumber}>{shortBreak}</ThemedText>
                            <ThemedText style={styles.timeLabel}>minutos</ThemedText>
                        </View>
                        <TouchableOpacity
                            style={styles.rangeButton}
                            onPress={() => setShortBreak(Math.min(30, shortBreak + 1))}
                        >
                            <Ionicons name="add" size={24} color="#4A90E2" />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.timeCard}>
                    <ThemedText style={styles.timeDescription}>
                        pausa longa
                    </ThemedText>
                    <View style={styles.rangeControls}>
                        <TouchableOpacity
                            style={styles.rangeButton}
                            onPress={() => setLongBreak(Math.max(5, longBreak - 1))}
                        >
                            <Ionicons name="remove" size={24} color="#4A90E2" />
                        </TouchableOpacity>
                        <View style={styles.rangeValue}>
                            <ThemedText style={styles.timeNumber}>{longBreak}</ThemedText>
                            <ThemedText style={styles.timeLabel}>minutos</ThemedText>
                        </View>
                        <TouchableOpacity
                            style={styles.rangeButton}
                            onPress={() => setLongBreak(Math.min(60, longBreak + 1))}
                        >
                            <Ionicons name="add" size={24} color="#4A90E2" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {/* Toggle Música */}
            <View style={styles.toggleContainer}>
                <ThemedText style={styles.toggleTitle}>Música durante pomodoro</ThemedText>
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
                <ThemedText style={styles.toggleTitle}>Som ao terminar o ciclo</ThemedText>
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
        padding: 5,
    },
    title: {
        fontSize: 24,
        fontWeight: "600",
        color: "#5A5A5A",
    },
    placeholder: {
        width: 38,
    },
    timeCardsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 40,
        gap: 10,
    },
    timeCard: {
        flex: 1,
        backgroundColor: "#E8E8E8",
        borderRadius: 10,
        padding: 20,
        alignItems: "center",
        minHeight: 160,
        justifyContent: "center",
    },
    rangeControls: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        marginTop: 15,
    },
    rangeButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#FFFFFF",
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    rangeValue: {
        alignItems: "center",
        justifyContent: "center",
    },
    timeNumber: {
        fontSize: 36,
        fontWeight: "bold",
        color: "#000000",
        lineHeight: 40,
    },
    timeLabel: {
        fontSize: 11,
        color: "#000000",
    },
    timeDescription: {
        fontSize: 14,
        fontWeight: "600",
        color: "#000000",
        textAlign: "center",
        lineHeight: 18,
        marginBottom: 10,
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
        color: "#5A5A5A",
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
