import { Settings, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import BreakModal from '../PomodoroResources/BreakModal';
import { playSound } from '../PomodoroResources/Sound';
import { formatTime } from '../PomodoroResources/utils/utilsTime';
import PomodoroControls from '../PomodoroControls';
import SettingsWidget from '../SettingsWidget';

interface Props {
  defaultTime: number;
  onClose: () => void;
}

export default function PomodoroWidget({ defaultTime, onClose }: Props) {
  const settings = JSON.parse(localStorage.getItem('pomodoroSettings') || '{}');

  const breakTime = settings.break ?? 5;
  const sound = settings.sound ?? true;

  const [timeLeft, setTimeLeft] = useState(defaultTime);
  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);
  const [completed, setCompleted] = useState(0);
  const [showBreak, setShowBreak] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (running) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          const next = prev - 1 / 60;

          if (next <= 0) {
            clearInterval(interval);

            setRunning(false);
            setPaused(false);
            setCompleted((c) => c + 1);

            if (sound) playSound();

            return defaultTime;
          }

          return next;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [running]);

  return (
    <>
      {showBreak && (
        <BreakModal
          breakTime={breakTime}
          onClose={() => setShowBreak(false)}
          soundEnabled={sound}
        />
      )}

      {showSettings && (
        <SettingsWidget onClose={() => setShowSettings(false)} />
      )}

      <div className="fixed bottom-6 right-6 w-80 bg-white shadow-2xl rounded-xl p-8 z-50">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold">Pomodoro</h3>

          <div className="flex gap-2">
            <Settings
              size={18}
              className="cursor-pointer"
              onClick={() => setShowSettings((s) => !s)}
            />
            <X size={18} className="cursor-pointer" onClick={onClose} />
          </div>
        </div>

        <div className="text-4xl text-center font-mono mb-6">
          {formatTime(timeLeft)}
        </div>

        <PomodoroControls
          running={running}
          paused={paused}
          completed={completed}
          onStart={() => {
            setRunning(true);
            setPaused(false);
          }}
          onPause={() => {
            setRunning(false);
            setPaused(true);
          }}
          onContinue={() => {
            setRunning(true);
            setPaused(false);
          }}
          onRestart={() => {
            setRunning(false);
            setPaused(false);
            setTimeLeft(defaultTime);
          }}
          onBreak={() => setShowBreak(true)}
        />
      </div>
    </>
  );
}
