type Listener = () => void;

const listeners: Record<string, Listener[]> = {};

export const eventBus = {
  on(event: string, callback: Listener) {
    if (!listeners[event]) listeners[event] = [];
    listeners[event].push(callback);
    return () => {
      listeners[event] = listeners[event].filter((l) => l !== callback);
    };
  },
  emit(event: string) {
    listeners[event]?.forEach((l) => l());
  },
};

export const PREFERENCES_UPDATED = "preferences-updated";
