import { ThemedText } from "@/app/components/themed-text";
import { ThemedView } from "@/app/components/themed-view";
import { useState, useEffect } from "react";
import { StyleSheet, TouchableOpacity, View, Text } from "react-native";

const POMODORO_TIME = 3 * 60; // 25 minutos em segundos
const TOTAL_CYCLES = 5;

export default function TabTwoScreen() {
    const [isRunning, setIsRunning] = useState(false);
    const [timeLeft, setTimeLeft] = useState(POMODORO_TIME);
    const [completedCycles, setCompletedCycles] = useState(0);

    useEffect(() => {
        let interval: any = null;

        if (isRunning && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && completedCycles < TOTAL_CYCLES) {
            // Ciclo completo
            setCompletedCycles((prev) => prev + 1);
            setTimeLeft(POMODORO_TIME);
            setIsRunning(false);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isRunning, timeLeft, completedCycles]);

    const toggleTimer = () => {
        setIsRunning(!isRunning);
    };

    const resetTimer = () => {
        setIsRunning(false);
        setTimeLeft(POMODORO_TIME);
        setCompletedCycles(0);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    return (
        <ThemedView style={styles.container}>
            {/* Header com botões histórico e configurações */}
            <View style={styles.topButtons}>
                <Text style={styles.topButton}>histórico</Text>
                <Text style={styles.topButton}>configurações</Text>
            </View>

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
                <ThemedText style={styles.timer}>{formatTime(timeLeft)}</ThemedText>

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
            </View>

            {/* Botão de Reset (opcional) */}
            {/* <TouchableOpacity style={styles.resetButton} onPress={resetTimer}>
                <ThemedText style={styles.resetButtonText}>Reset</ThemedText>
            </TouchableOpacity> */}
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
        color: "#1619EB",
        textDecorationLine: "underline",
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
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
    resetButton: {
        marginTop: 20,
        paddingHorizontal: 30,
        paddingVertical: 10,
    },
    resetButtonText: {
        fontSize: 16,
        opacity: 0.6,
    },
});
