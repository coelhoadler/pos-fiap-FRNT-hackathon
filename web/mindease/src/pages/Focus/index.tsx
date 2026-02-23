import { useNavigate } from 'react-router-dom';
import PomodoroTimer from '../../components/Focus/PomodoroTimer';

export default function Focus() {
  const navigate = useNavigate();

  const settings = JSON.parse(localStorage.getItem('pomodoroSettings') || '{}');

  const defaultSettings = {
    pomodoro: settings.pomodoro || 25,
    break: settings.break || 5,
    sound: settings.sound ?? true,
  };

  return (
    <div className="min-h-150 flex items-center justify-center">
      <div
        className="bg-slate-300 rounded-xl shadow-xl p-10 
                      w-[20%] lg:w-[40%] text-center"
      >
        <div className="flex justify-between mb-6">
          <h1 className="text-2xl font-bold">Foco</h1>
          <button
            onClick={() => navigate('/focus/settings')}
            className="cursor-pointer"
          >
            Configurações
          </button>
        </div>

        <PomodoroTimer settings={defaultSettings} />
      </div>
    </div>
  );
}
