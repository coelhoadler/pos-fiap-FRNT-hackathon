import { useEffect, useState } from 'react';
import BreakModal from '../BreakModal';
import FocusControls from '../FocusControls';
import { playSound } from '../Sound';
import { formatTime } from '../utils/utilsTime';

interface Settings {
  pomodoro: number; // minutos
  break: number; // minutos
  sound: boolean;
}

export default function PomodoroTimer({ settings }: { settings: Settings }) {
  const [timeLeft, setTimeLeft] = useState(settings.pomodoro);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [completed, setCompleted] = useState(0);
  const [showBreak, setShowBreak] = useState(false);

  useEffect(() => {
    setTimeLeft(settings.pomodoro);
  }, [settings.pomodoro]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          const next = prev - 1 / 60;

          if (next <= 0) {
            clearInterval(interval);
            setIsRunning(false);
            setIsPaused(false);
            setCompleted((c) => c + 1);
            if (settings.sound) playSound();
            return settings.pomodoro;
          }

          return next;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning]);

  return (
    <div className="text-center">
      <div className="text-6xl font-mono mb-8">{formatTime(timeLeft)}</div>

      <FocusControls
        isRunning={isRunning}
        isPaused={isPaused}
        completed={completed}
        onStart={() => {
          setIsRunning(true);
          setIsPaused(false);
        }}
        onPause={() => {
          setIsRunning(false);
          setIsPaused(true);
        }}
        onContinue={() => {
          setIsRunning(true);
          setIsPaused(false);
        }}
        onRestart={() => {
          setIsRunning(false);
          setIsPaused(false);
          setTimeLeft(settings.pomodoro);
        }}
        onBreak={() => setShowBreak(true)}
      />

      {showBreak && (
        <BreakModal
          breakTime={settings.break}
          onClose={() => setShowBreak(false)}
          soundEnabled={settings.sound}
        />
      )}
    </div>
  );
}
