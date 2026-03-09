import { useEffect, useState } from 'react';
import { playSound } from '../Sound';
import { formatTime } from '../utils/utilsTime';

interface Props {
  breakTime: number; // minutos
  onClose: () => void;
  soundEnabled: boolean;
}

export default function BreakModal({
  breakTime,
  onClose,
  soundEnabled,
}: Props) {
  const [timeLeft, setTimeLeft] = useState(breakTime);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        const next = prev - 1 / 60;

        if (next <= 0) {
          clearInterval(interval);
          if (soundEnabled) playSound();
          onClose();
          return 0;
        }

        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-xl text-center shadow-xl w-96">
        <h2 className="text-xl font-bold mb-4">Descanso</h2>
        <div className="text-5xl font-mono mb-6">{formatTime(timeLeft)}</div>
        <button
          onClick={onClose}
          className="bg-red-500 text-white px-4 py-2 rounded cursor-pointer"
        >
          Fechar
        </button>
      </div>
    </div>
  );
}
