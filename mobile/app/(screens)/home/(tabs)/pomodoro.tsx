import { ThemedText } from "@/app/components/themed-text";
import { ThemedView } from "@/app/components/themed-view";
import { useState, useEffect, useCallback } from "react";
import { StyleSheet, TouchableOpacity, View, Text, ActivityIndicator } from "react-native";
import { Audio } from "expo-av";
import { useRouter, useFocusEffect } from "expo-router";
import { getPomodoroSettings } from "@/app/services/pomodoroSettings";
import { savePomodoroHistory } from "@/app/services/pomodoroHistory";
import { TabsRoutes } from "./tabsRouters";
import { IPomodoroSettings, IPomodoroHistory } from "@/app/interface/pomodoro";
import Toast from "react-native-toast-message";

const TOTAL_CYCLES = 5;

export default function TabTwoScreen() {
    const router = useRouter();
    const [isRunning, setIsRunning] = useState(false);
    const [timeLeft, setTimeLeft] = useState<number | undefined>(undefined);
    const [completedCycles, setCompletedCycles] = useState(0);
    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [soundToFinish, setSoundToFinish] = useState<boolean>(false);
    let [pomodoroTimer, setPomodoroTimer] = useState<number>(0);

    // Verificar se o usuário tem configurações do Pomodoro toda vez que entrar na página
    useFocusEffect(
        useCallback(() => {
            async function checkPomodoroSettings() {
                try {
                    setIsLoading(true);
                    const settings: IPomodoroSettings | null = await getPomodoroSettings();

                    if (!settings) {
                        router.replace(`/(screens)/home/(tabs)/${TabsRoutes.PomodoroSettings}`);
                        setIsLoading(false);

                    } else {
                        setIsLoading(false);
                        setPomodoroTimer(settings?.pomodoroTime);
                        setTimeLeft(settings?.pomodoroTime * 60);
                        setSoundToFinish(settings?.soundEnabledWhenFinish);
                    }
                } catch (error) {
                    Toast.show({
                        type: 'error',
                        text1: 'Erro',
                        text2: 'Erro ao verificar configurações do Pomodoro: ' + String(error),
                        text1Style: { fontSize: 16, fontWeight: 'bold' },
                        text2Style: { fontSize: 14 },
                        swipeable: true,
                    });

                    setIsLoading(false);
                }
            }

            checkPomodoroSettings();
        }, [])
    );

    // Configurar o modo de áudio ao montar o componente
    useEffect(() => {
        async function setupAudio() {
            try {
                await Audio.setAudioModeAsync({
                    playsInSilentModeIOS: true,
                    shouldDuckAndroid: true,
                });
            } catch (error) {
                console.error("Erro ao configurar áudio:", error);
            }
        }

        setupAudio();

        // Cleanup ao desmontar
        return () => {
            if (sound) {
                sound.unloadAsync();
            }
        };
    }, []);

    useEffect(() => {
        let interval: any = null;

        if (isRunning && timeLeft! > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev! - 1);
            }, 1000);
        } else if (timeLeft === 0 && completedCycles < TOTAL_CYCLES) {
            playDoneSound();

            // Salvar histórico de conclusão
            const saveCompletionHistory = async () => {
                try {
                    const historyEntry: IPomodoroHistory = {
                        timestamp: new Date(),
                        completedCycles: completedCycles + 1,
                        timeRemainingInSeconds: 0,
                        action: "complete",
                        pomodoroTimeInSeconds: pomodoroTimer * 60,
                    };
                    await savePomodoroHistory(historyEntry);
                } catch (error) {
                    console.error("Erro ao salvar histórico de conclusão:", error);
                }
            };

            saveCompletionHistory();

            setCompletedCycles((prev) => prev + 1);
            setTimeLeft(pomodoroTimer * 60);
            setIsRunning(false);
            sound?.stopAsync();
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isRunning, timeLeft, completedCycles]);

    const toggleTimer = async () => {
        const newIsRunning = !isRunning;
        setIsRunning(newIsRunning);

        // Salvar histórico no Firestore
        try {
            const historyEntry: IPomodoroHistory = {
                timestamp: new Date(),
                completedCycles: completedCycles,
                timeRemainingInSeconds: timeLeft || 0,
                action: newIsRunning ? "start" : "pause",
                pomodoroTimeInSeconds: pomodoroTimer * 60,
            };
            await savePomodoroHistory(historyEntry);
        } catch (error) {
            console.error("Erro ao salvar histórico:", error);
            Toast.show({
                type: 'error',
                text1: 'Erro',
                text2: 'Não foi possível salvar o histórico',
                text1Style: { fontSize: 16, fontWeight: 'bold' },
                text2Style: { fontSize: 14 },
                swipeable: true,
            });
        }

        if (newIsRunning) {
            // Iniciar a música
            await playSound();
        } else {
            // Pausar a música
            await pauseSound();
        }
    };

    const playSound = async () => {
        try {
            // Se já existe um som, apenas retomar
            if (sound) {
                await sound.playAsync();
            } else {
                // Criar e tocar um novo som
                // Você pode usar uma URL de música ou um arquivo local
                const { sound: newSound } = await Audio.Sound.createAsync(
                    require("../../../../assets/audios/pomodoro.m4a"),
                    { shouldPlay: true, isLooping: true, volume: 0.3 }
                );

                setSound(newSound);
            }
        } catch (error) {
            console.error("Erro ao tocar música:", error);
        }
    };

    const playDoneSound = async () => {
        try {
            if (!soundToFinish) return;

            const { sound: newSound } = await Audio.Sound.createAsync(
                require("../../../../assets/audios/pomodoro_done.mp3"),
                { shouldPlay: true, volume: 0.3 }
            );

            newSound.playAsync();
        } catch (error) {
            console.error("Erro ao tocar música:", error);
        }
    };

    const pauseSound = async () => {
        try {
            if (sound) {
                await sound.pauseAsync();
            }
        } catch (error) {
            console.error("Erro ao pausar música:", error);
        }
    };

    const resetTimer = async () => {
        setIsRunning(false);
        setTimeLeft(pomodoroTimer * 60);
        setCompletedCycles(0);

        // Parar e limpar a música
        if (sound) {
            await sound.stopAsync();
            await sound.unloadAsync();
            setSound(null);
        }

        try {
            const historyEntry: IPomodoroHistory = {
                timestamp: new Date(),
                completedCycles: completedCycles,
                timeRemainingInSeconds: timeLeft || 0,
                action: "reset",
                pomodoroTimeInSeconds: pomodoroTimer * 60,
            };
            await savePomodoroHistory(historyEntry);
        } catch (error) {
            console.error("Erro ao salvar histórico:", error);
            Toast.show({
                type: 'error',
                text1: 'Erro',
                text2: 'Não foi possível salvar o histórico',
                text1Style: { fontSize: 16, fontWeight: 'bold' },
                text2Style: { fontSize: 14 },
                swipeable: true,
            });
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    // Mostrar loading enquanto verifica as configurações
    if (isLoading) {
        return (
            <ThemedView style={[styles.container, styles.centerContent]}>
                <ActivityIndicator size="large" color="#4A90E2" />
                <ThemedText style={styles.loadingText}>Carregando...</ThemedText>
            </ThemedView>
        );
    }

    return (
        <ThemedView style={styles.container}>
            {/* Header com botões histórico e configurações */}
            {!isRunning && (
                <View style={styles.topButtons}>
                    <TouchableOpacity onPress={() => router.push("/(screens)/home/(tabs)/pomodoro-history")}>
                        <ThemedText style={styles.topButton}>Histórico</ThemedText>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => router.push("/(screens)/home/(tabs)/pomodoro-settings")}>
                        <ThemedText style={styles.topButton}>Configurações</ThemedText>
                    </TouchableOpacity>
                </View>
            )}

            {/* Botão Start/Pause */}
            <TouchableOpacity style={styles.startButton} onPress={toggleTimer}>
                <ThemedText style={styles.startButtonText}>
                    {isRunning ? "Pausar" : "Iniciar"}
                </ThemedText>
            </TouchableOpacity>

            {/* Conteúdo inferior */}
            <View style={styles.bottomContent}>
                {/* Label POMODORO */}
                <ThemedText style={styles.pomodoroLabel}>POMODORO</ThemedText>

                {/* Timer */}
                <ThemedText style={styles.timer}>{formatTime(timeLeft!)}</ThemedText>

                {/* Ciclos (bolinhas) */}
                <View style={styles.cyclesContainer}>
                    {Array.from({ length: TOTAL_CYCLES }).map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.cycle,
                                index < completedCycles && styles.cycleCompleted,
                            ]}
                        />
                    ))}
                </View>
                {(completedCycles > 0 || (timeLeft !== pomodoroTimer * 60)) && (
                    <TouchableOpacity style={styles.resetButton} onPress={resetTimer}>
                        <ThemedText style={styles.resetButtonText}>Reiniciar</ThemedText>
                    </TouchableOpacity>
                )}
            </View>
            <Toast />
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        alignItems: "center",
    },
    header: {
        width: "100%",
        alignItems: "center",
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
    },
    topButtons: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        marginBottom: 40,
    },
    topButton: {
        textDecorationLine: "underline",
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        fontSize: 14,
    },
    topButtonText: {
        color: "#FFFFFF",
        fontSize: 14,
    },
    startButton: {
        backgroundColor: "#E8E8E8",
        paddingHorizontal: 60,
        paddingVertical: 20,
        borderRadius: 10,
        marginBottom: 60,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    startButtonText: {
        fontSize: 32,
        fontWeight: "bold",
        color: "#000000",
    },
    bottomContent: {
        marginTop: "auto",
        alignItems: "center",
        marginBottom: 40,
    },
    pomodoroLabel: {
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 20,
        letterSpacing: 2,
    },
    timer: {
        fontSize: 48,
        fontWeight: "300",
        lineHeight: 56,
        marginBottom: 30,
    },
    cyclesContainer: {
        flexDirection: "row",
        gap: 15,
        marginBottom: 30,
    },
    cycle: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: "#FFFFFF",
        borderWidth: 2,
        borderColor: "#666666",
    },
    cycleCompleted: {
        backgroundColor: "#4A90E2",
        borderColor: "#4A90E2",
    },
    centerContent: {
        justifyContent: "center",
        alignItems: "center",
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
    },
    resetButton: {
        marginTop: 20,
    },
    resetButtonText: {
        fontSize: 16,
        opacity: 0.6,
    },
});
