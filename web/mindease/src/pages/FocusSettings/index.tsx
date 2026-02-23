import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function FocusSettings() {
  const navigate = useNavigate();

  const stored = JSON.parse(localStorage.getItem('pomodoroSettings') || '{}');

  const [pomodoro, setPomodoro] = useState(stored.pomodoro || 25);
  const [breakTime, setBreakTime] = useState(stored.break || 5);
  const [sound, setSound] = useState(stored.sound ?? true);

  const save = () => {
    localStorage.setItem(
      'pomodoroSettings',
      JSON.stringify({ pomodoro, break: breakTime, sound })
    );
    navigate('/focus');
  };

  return (
    <div className="min-h-150 flex items-center justify-center">
      <div
        className="bg-slate-300 rounded-xl shadow-xl p-10 
                      w-[20%] lg:w-[40%]"
      >
        <div className="flex items-center gap-3 mb-6">
          <ArrowLeft
            className="cursor-pointer"
            onClick={() => navigate('/focus')}
          />
          <h1 className="text-xl font-bold">Configurações</h1>
        </div>

        <div className="mb-4">
          <label>Tempo Pomodoro (minutos)</label>
          <input
            type="number"
            value={pomodoro}
            onChange={(e) => setPomodoro(Number(e.target.value))}
            className="w-full border p-2 rounded"
          />
        </div>

        <div className="mb-4">
          <label>Tempo Descanso (minutos)</label>
          <input
            type="number"
            value={breakTime}
            onChange={(e) => setBreakTime(Number(e.target.value))}
            className="w-full border p-2 rounded"
          />
        </div>

        <div className="flex items-center gap-3 mb-6">
          <input
            type="checkbox"
            checked={sound}
            onChange={() => setSound(!sound)}
          />
          <label>Som ao terminar o ciclo</label>
        </div>

        <button
          onClick={save}
          className="bg-slate-600 text-white font-bold px-4 py-2 rounded w-full"
        >
          Salvar
        </button>
      </div>
    </div>
  );
}
