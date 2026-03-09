interface Props {
  running: boolean;
  paused: boolean;
  completed: number;

  onStart: () => void;
  onPause: () => void;
  onContinue: () => void;
  onRestart: () => void;
  onBreak: () => void;
}

export default function PomodoroControls(props: Props) {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {!props.running && !props.paused && (
        <button onClick={props.onStart} className="btn-primary cursor-pointer">
          Iniciar
        </button>
      )}

      {props.running && (
        <button
          onClick={props.onPause}
          className="btn-secondary cursor-pointer"
        >
          Pausar
        </button>
      )}

      {props.paused && (
        <button
          onClick={props.onContinue}
          className="btn-primary cursor-pointer"
        >
          Continuar
        </button>
      )}

      <button onClick={props.onRestart} className="btn-danger cursor-pointer">
        Reiniciar
      </button>

      {!props.running && props.completed > 0 && (
        <button onClick={props.onBreak} className="btn-primary cursor-pointer">
          Descanso
        </button>
      )}
    </div>
  );
}
