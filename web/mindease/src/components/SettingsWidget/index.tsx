import { useState } from 'react';

interface Props {
  onClose: () => void;
}

export default function SettingsWidget({ onClose }: Props) {
  const stored = JSON.parse(localStorage.getItem('pomodoroSettings') || '{}');

  const [breakTime, setBreakTime] = useState(stored.break ?? 5);
  const [sound, setSound] = useState(stored.sound ?? true);

  const save = () => {
    localStorage.setItem(
      'pomodoroSettings',
      JSON.stringify({ break: breakTime, sound })
    );

    onClose();
  };

  return (
    <div className="fixed bottom-6 right-[360px] w-72 bg-white shadow-xl rounded-xl p-4 z-50">
      <div className="mb-3">
        <label>Tempo descanso (min)</label>

        <input
          type="number"
          value={breakTime}
          onChange={(e) => setBreakTime(Number(e.target.value))}
          className="w-full border p-2 rounded"
        />
      </div>

      <div className="flex items-center gap-2 mb-4">
        <input
          type="checkbox"
          checked={sound}
          onChange={() => setSound(!sound)}
        />

        <label>Som ao terminar ciclo</label>
      </div>

      <button
        onClick={save}
        className="w-full bg-slate-600 text-white p-2 rounded"
      >
        Salvar
      </button>
    </div>
  );
}
