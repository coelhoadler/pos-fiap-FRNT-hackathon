export const playSound = () => {
  const audio = new Audio(
    'https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg'
  );
  audio.play();
};
