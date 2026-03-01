import React from "react";
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Pause, Play, X } from "lucide-react-native";
import { useTaskTimer } from "./task-timer-context";

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  if (h > 0) {
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export function TaskTimerWidget() {
  const {
    activeTask,
    timeLeftSeconds,
    totalSeconds,
    isRunning,
    pauseTimer,
    resumeTimer,
    stopTimer,
  } = useTaskTimer();

  if (!activeTask) return null;

  const progress = totalSeconds > 0 ? (totalSeconds - timeLeftSeconds) / totalSeconds : 0;
  const isFinished = timeLeftSeconds === 0 && totalSeconds > 0;

  return (
    <View style={styles.container}>
      <View style={styles.widget}>
        {/* Barra de progresso no topo */}
        <View style={styles.progressBarBackground}>
          <View
            style={[
              styles.progressBarFill,
              {
                width: `${Math.min(progress * 100, 100)}%`,
                backgroundColor: isFinished ? "#4CAF50" : "#4A90E2",
              },
            ]}
          />
        </View>

        <View style={styles.content}>
          {/* Info da tarefa */}
          <View style={styles.taskInfo}>
            <Text style={styles.taskName} numberOfLines={1} ellipsizeMode="tail">
              {activeTask.nome}
            </Text>
            <Text style={[styles.timer, isFinished && styles.timerFinished]}>
              {isFinished ? "Concluído!" : formatTime(timeLeftSeconds)}
            </Text>
          </View>

          {/* Controles */}
          <View style={styles.controls}>
            {!isFinished && (
              <Pressable
                onPress={isRunning ? pauseTimer : resumeTimer}
                style={styles.controlButton}
              >
                {isRunning ? (
                  <Pause size={20} color="#FFFFFF" fill="#FFFFFF" />
                ) : (
                  <Play size={20} color="#FFFFFF" fill="#FFFFFF" />
                )}
              </Pressable>
            )}
            <Pressable onPress={stopTimer} style={styles.closeButton}>
              <X size={18} color="#FF6B6B" />
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 90,
    left: 16,
    right: 16,
    zIndex: 9999,
    elevation: 10,
  },
  widget: {
    backgroundColor: "#1E1E2E",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  progressBarBackground: {
    height: 3,
    backgroundColor: "#333",
    width: "100%",
  },
  progressBarFill: {
    height: 3,
    borderRadius: 2,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  taskInfo: {
    flex: 1,
    marginRight: 12,
  },
  taskName: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 2,
  },
  timer: {
    color: "#4A90E2",
    fontSize: 22,
    fontWeight: "bold",
    fontVariant: ["tabular-nums"],
  },
  timerFinished: {
    color: "#4CAF50",
    fontSize: 16,
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  controlButton: {
    backgroundColor: "#4A90E2",
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  closeButton: {
    backgroundColor: "rgba(255, 107, 107, 0.15)",
    borderRadius: 20,
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
});
