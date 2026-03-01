import React, { createContext, useContext, useState, useRef, useCallback, useEffect } from "react";

export interface ActiveTask {
  id: string | undefined;
  nome: string | undefined;
  tempoExecucao: string | undefined; // ex: "2h 30min"
}

interface TaskTimerContextData {
  activeTask: ActiveTask | null;
  timeLeftSeconds: number;
  totalSeconds: number;
  isRunning: boolean;
  startTimer: (task: ActiveTask) => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  stopTimer: () => void;
}

const TaskTimerContext = createContext<TaskTimerContextData>({} as TaskTimerContextData);

/**
 * Converte string "Xh Ymin" para segundos.
 * Suporta formatos: "2h 30min", "1h", "45min", "0h 5min"
 */
function parseTempoExecucao(tempo: string): number {
  let totalSeconds = 0;

  const hoursMatch = tempo.match(/(\d+)\s*h/i);
  const minutesMatch = tempo.match(/(\d+)\s*min/i);

  if (hoursMatch) {
    totalSeconds += parseInt(hoursMatch[1], 10) * 3600;
  }
  if (minutesMatch) {
    totalSeconds += parseInt(minutesMatch[1], 10) * 60;
  }

  // Fallback: se não encontrou nada, tenta parsear como número de minutos
  if (!hoursMatch && !minutesMatch) {
    const num = parseInt(tempo, 10);
    if (!isNaN(num)) {
      totalSeconds = num * 60;
    }
  }

  return totalSeconds;
}

export function TaskTimerProvider({ children }: { children: React.ReactNode }) {
  const [activeTask, setActiveTask] = useState<ActiveTask | null>(null);
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(0);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startTimer = useCallback((task: ActiveTask) => {
    clearTimer();
    const seconds = parseTempoExecucao(task.tempoExecucao || "0h 0min");
    setActiveTask(task);
    setTotalSeconds(seconds);
    setTimeLeftSeconds(seconds);
    setIsRunning(true);
  }, [clearTimer]);

  const pauseTimer = useCallback(() => {
    setIsRunning(false);
    clearTimer();
  }, [clearTimer]);

  const resumeTimer = useCallback(() => {
    if (activeTask && timeLeftSeconds > 0) {
      setIsRunning(true);
    }
  }, [activeTask, timeLeftSeconds]);

  const stopTimer = useCallback(() => {
    clearTimer();
    setActiveTask(null);
    setTimeLeftSeconds(0);
    setTotalSeconds(0);
    setIsRunning(false);
  }, [clearTimer]);

  useEffect(() => {
    if (isRunning && timeLeftSeconds > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeftSeconds((prev) => {
          if (prev <= 1) {
            clearTimer();
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearTimer();
    }

    return () => clearTimer();
  }, [isRunning, timeLeftSeconds > 0]);

  return (
    <TaskTimerContext.Provider
      value={{
        activeTask,
        timeLeftSeconds,
        totalSeconds,
        isRunning,
        startTimer,
        pauseTimer,
        resumeTimer,
        stopTimer,
      }}
    >
      {children}
    </TaskTimerContext.Provider>
  );
}

export function useTaskTimer() {
  return useContext(TaskTimerContext);
}
