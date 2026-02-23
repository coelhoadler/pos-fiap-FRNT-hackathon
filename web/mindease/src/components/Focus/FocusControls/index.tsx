interface Props {
  isRunning: boolean;
  isPaused: boolean;
  completed: number;
  onStart: () => void;
  onPause: () => void;
  onContinue: () => void;
  onRestart: () => void;
  onBreak: () => void;
}

export default function FocusControls({
  isRunning,
  isPaused,
  completed,
  onStart,
  onPause,
  onContinue,
  onRestart,
  onBreak,
}: Props) {
  return (
    <div className="flex gap-4 flex-wrap justify-center mt-6">
      {!isRunning && !isPaused && (
        <button onClick={onStart} className="btn-primary cursor-pointer">
          Iniciar
        </button>
      )}

      {isRunning && (
        <button onClick={onPause} className="btn-secondary cursor-pointer">
          Pausar
        </button>
      )}

      {isPaused && (
        <button onClick={onContinue} className="btn-primary cursor-pointer">
          Continuar
        </button>
      )}

      {isRunning && (
        <button onClick={onRestart} className="btn-danger cursor-pointer">
          Reiniciar
        </button>
      )}

      {!isRunning && completed > 0 && (
        <button onClick={onBreak} className="btn-primary cursor-pointer">
          Descanso
        </button>
      )}
    </div>
  );
}
