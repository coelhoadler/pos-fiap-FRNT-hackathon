import { ThemedText } from "@/app/components/themed-text";
import { ThemedView } from "@/app/components/themed-view";
import { useState } from "react";
import { StyleSheet, TouchableOpacity, View, Switch } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function PomodoroSettings() {
    const router = useRouter();
    const [pomodoroTime, setPomodoroTime] = useState(25);
    const [shortBreak, setShortBreak] = useState(5);
    const [longBreak, setLongBreak] = useState(10);
    const [musicEnabled, setMusicEnabled] = useState(false);
    const [soundEnabled, setSoundEnabled] = useState(false);

    return (
        <ThemedView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.navigate("/(screens)/home/(tabs)/focus")} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={28} color="#5A5A5A" />
                </TouchableOpacity>
                <ThemedText style={styles.title}>Focar</ThemedText>
                <View style={styles.placeholder} />
            </View>

            {/* Cards de configuração de tempo */}
            <View style={styles.timeCardsContainer}>
                <View style={styles.timeCard}>
                    <ThemedText style={styles.timeNumber}>{pomodoroTime}</ThemedText>
                    <ThemedText style={styles.timeLabel}>minutos</ThemedText>
                    <ThemedText style={styles.timeDescription}>Pomodoro</ThemedText>
                </View>

                <View style={styles.timeCard}>
                    <ThemedText style={styles.timeNumber}>{shortBreak}</ThemedText>
                    <ThemedText style={styles.timeLabel}>minutos</ThemedText>
                    <ThemedText style={styles.timeDescription}>
                        pausa entre{"\n"}Pomodoros
                    </ThemedText>
                </View>

                <View style={styles.timeCard}>
                    <ThemedText style={styles.timeNumber}>{longBreak}</ThemedText>
                    <ThemedText style={styles.timeLabel}>minutos</ThemedText>
                    <ThemedText style={styles.timeDescription}>
                        pausa longa
                    </ThemedText>
                </View>
            </View>

            {/* Toggle Música */}
            <View style={styles.toggleContainer}>
                <ThemedText style={styles.toggleTitle}>Música durante pomodoro</ThemedText>
                <View style={styles.toggleRow}>
                    <ThemedText style={styles.toggleLabel}>desativado</ThemedText>
                    <Switch
                        value={musicEnabled}
                        onValueChange={setMusicEnabled}
                        trackColor={{ false: "#D1D1D1", true: "#4A90E2" }}
                        thumbColor="#FFFFFF"
                    />
                    <ThemedText style={styles.toggleLabel}>ativado</ThemedText>
                </View>
            </View>

            {/* Toggle Som ao terminar */}
            <View style={styles.toggleContainer}>
                <ThemedText style={styles.toggleTitle}>Som ao terminar o ciclo</ThemedText>
                <View style={styles.toggleRow}>
                    <ThemedText style={styles.toggleLabel}>desativado</ThemedText>
                    <Switch
                        value={soundEnabled}
                        onValueChange={setSoundEnabled}
                        trackColor={{ false: "#D1D1D1", true: "#4A90E2" }}
                        thumbColor="#FFFFFF"
                    />
                    <ThemedText style={styles.toggleLabel}>ativado</ThemedText>
                </View>
            </View>
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
        minHeight: 140,
        justifyContent: "center",
    },
    timeNumber: {
        fontSize: 56,
        fontWeight: "bold",
        color: "#000000",
        marginBottom: 5,
        lineHeight: 60,
    },
    timeLabel: {
        fontSize: 12,
        color: "#000000",
        marginBottom: 10,
    },
    timeDescription: {
        fontSize: 14,
        fontWeight: "600",
        color: "#000000",
        textAlign: "center",
        lineHeight: 18,
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
});
