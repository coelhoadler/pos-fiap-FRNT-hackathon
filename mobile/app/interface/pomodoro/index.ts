export interface IPomodoroSettings {
    pomodoroTime: number;
    shortBreak: number;
    longBreak: number;
    musicEnabled: boolean;
    soundEnabledWhenFinish: boolean;
}

export interface IPomodoroHistory {
    timestamp: Date;
    completedCycles: number;
    timeRemainingInSeconds: number;
    action: "start" | "pause" | "complete" | "reset";
    pomodoroTimeInSeconds: number;
}