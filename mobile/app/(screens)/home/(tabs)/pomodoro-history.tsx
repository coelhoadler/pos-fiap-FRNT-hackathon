import { ThemedText } from "@/app/components/themed-text";
import { ThemedView } from "@/app/components/themed-view";
import { useState, useCallback } from "react";
import {
    StyleSheet,
    TouchableOpacity,
    View,
    FlatList,
    ActivityIndicator,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { getPomodoroHistory } from "@/app/services/pomodoroHistory";
import { IPomodoroHistory } from "@/app/interface/pomodoro";
import { TabsRoutes } from "./tabsRouters";
import Toast from "react-native-toast-message";

const ACTION_LABELS: Record<IPomodoroHistory["action"], string> = {
    start: "Iniciado",
    pause: "Pausado",
    complete: "Concluído",
    reset: "Reiniciado",
};

const ACTION_COLORS: Record<IPomodoroHistory["action"], string> = {
    start: "#4CAF50",
    pause: "#FF9800",
    complete: "#4A90E2",
    reset: "#F44336",
};

const ACTION_ICONS: Record<IPomodoroHistory["action"], keyof typeof Ionicons.glyphMap> = {
    start: "play-circle",
    pause: "pause-circle",
    complete: "checkmark-circle",
    reset: "refresh-circle",
};

function formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

function formatTime(date: Date): string {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
}

function formatSeconds(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

interface GroupedHistory {
    date: string;
    entries: IPomodoroHistory[];
}

function groupByDate(history: IPomodoroHistory[]): GroupedHistory[] {
    const groups: Record<string, IPomodoroHistory[]> = {};

    history.forEach((entry) => {
        const dateKey = formatDate(entry.timestamp);
        if (!groups[dateKey]) {
            groups[dateKey] = [];
        }
        groups[dateKey].push(entry);
    });

    return Object.entries(groups).map(([date, entries]) => ({
        date,
        entries,
    }));
}

export default function PomodoroHistory() {
    const router = useRouter();
    const [history, setHistory] = useState<IPomodoroHistory[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useFocusEffect(
        useCallback(() => {
            loadHistory();
        }, [])
    );

    const loadHistory = async () => {
        try {
            setIsLoading(true);
            const data = await getPomodoroHistory(100);
            setHistory(data);
        } catch (error) {
            Toast.show({
                type: "error",
                text1: "Erro",
                text2: "Não foi possível carregar o histórico",
                text1Style: { fontSize: 16, fontWeight: "bold" },
                text2Style: { fontSize: 14 },
                swipeable: true,
            });
        } finally {
            setIsLoading(false);
        }
    };

    const groupedHistory = groupByDate(history);

    const renderHistoryItem = (entry: IPomodoroHistory, index: number) => {
        const actionColor = ACTION_COLORS[entry.action];
        const actionLabel = ACTION_LABELS[entry.action];
        const actionIcon = ACTION_ICONS[entry.action];

        return (
            <View key={index} style={styles.historyItem}>
                <View style={[styles.iconContainer, { backgroundColor: actionColor + "20" }]}>
                    <Ionicons name={actionIcon} size={28} color={actionColor} />
                </View>
                <View style={styles.itemContent}>
                    <View style={styles.itemHeader}>
                        <ThemedText style={[styles.actionLabel, { color: actionColor }]}>
                            {actionLabel}
                        </ThemedText>
                        <ThemedText style={styles.timeLabel}>
                            {formatTime(entry.timestamp)}
                        </ThemedText>
                    </View>
                    <View style={styles.itemDetails}>
                        <View style={styles.detailRow}>
                            <Ionicons name="timer-outline" size={14} color="#888" />
                            <ThemedText style={styles.detailText}>
                                Tempo total do Pomodoro: {formatSeconds(entry.pomodoroTimeInSeconds)}
                            </ThemedText>
                        </View>
                        <View style={styles.detailRow}>
                            <Ionicons name="ellipse" size={14} color="#888" />
                            <ThemedText style={styles.detailText}>
                                Ciclos concluídos: {entry.completedCycles}
                            </ThemedText>
                        </View>
                        {entry.action !== "complete" && entry.timeRemainingInSeconds > 0 && (
                            <View style={styles.detailRow}>
                                <Ionicons name="hourglass-outline" size={14} color="#888" />
                                <ThemedText style={styles.detailText}>
                                    Restante: {formatSeconds(entry.timeRemainingInSeconds)}
                                </ThemedText>
                            </View>
                        )}
                    </View>
                </View>
            </View>
        );
    };

    if (isLoading) {
        return (
            <ThemedView style={[styles.container, styles.centerContent]}>
                <ActivityIndicator size="large" color="#4A90E2" />
                <ThemedText style={styles.loadingText}>Carregando histórico...</ThemedText>
            </ThemedView>
        );
    }

    return (
        <ThemedView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.push(`/(screens)/home/(tabs)/${TabsRoutes.Focus}`)}
                >
                    <Ionicons name="arrow-back" size={24} color="#4A90E2" />
                    <ThemedText style={styles.backText}>Voltar</ThemedText>
                </TouchableOpacity>
                <View style={{ width: 80 }} />
            </View>

            {history.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Ionicons name="document-text-outline" size={64} color="#CCC" />
                    <ThemedText style={styles.emptyText}>
                        Nenhum registro encontrado
                    </ThemedText>
                    <ThemedText style={styles.emptySubText}>
                        Inicie um Pomodoro para começar a registrar seu histórico
                    </ThemedText>
                </View>
            ) : (
                <FlatList
                    data={groupedHistory}
                    keyExtractor={(item) => item.date}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.listContent}
                    renderItem={({ item: group }) => (
                        <View style={styles.dateGroup}>
                            <View style={styles.dateBadge}>
                                <Ionicons name="calendar-outline" size={16} color="#4A90E2" />
                                <ThemedText style={styles.dateLabel}>{group.date}</ThemedText>
                            </View>
                            {group.entries.map((entry, index) =>
                                renderHistoryItem(entry, index)
                            )}
                        </View>
                    )}
                />
            )}

            <Toast />
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    centerContent: {
        justifyContent: "center",
        alignItems: "center",
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 20,
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
        fontSize: 20,
        fontWeight: "bold",
    },
    listContent: {
        paddingBottom: 20,
    },
    dateGroup: {
        marginBottom: 20,
    },
    dateBadge: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        marginBottom: 12,
        paddingVertical: 6,
        paddingHorizontal: 12,
        backgroundColor: "#4A90E220",
        borderRadius: 20,
        alignSelf: "flex-start",
    },
    dateLabel: {
        fontSize: 14,
        fontWeight: "600",
        color: "#4A90E2",
    },
    historyItem: {
        flexDirection: "row",
        alignItems: "flex-start",
        padding: 14,
        marginBottom: 8,
        backgroundColor: "#F5F5F5",
        borderRadius: 12,
        gap: 12,
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: "center",
        alignItems: "center",
    },
    itemContent: {
        flex: 1,
    },
    itemHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 6,
    },
    actionLabel: {
        fontSize: 16,
        fontWeight: "bold",
    },
    timeLabel: {
        fontSize: 13,
        color: "#888",
    },
    itemDetails: {
        gap: 4,
    },
    detailRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    detailText: {
        fontSize: 13,
        color: "#888",
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 12,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: "600",
        color: "#999",
    },
    emptySubText: {
        fontSize: 14,
        color: "#BBB",
        textAlign: "center",
        paddingHorizontal: 40,
    },
});
