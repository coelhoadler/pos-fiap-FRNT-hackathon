import { eventBus, PREFERENCES_UPDATED } from './eventBus';

describe('eventBus', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('deve registrar e emitir um evento', () => {
        const callback = jest.fn();
        eventBus.on('test-event', callback);

        eventBus.emit('test-event');

        expect(callback).toHaveBeenCalledTimes(1);
    });

    it('deve registrar múltiplos listeners para o mesmo evento', () => {
        const callback1 = jest.fn();
        const callback2 = jest.fn();

        eventBus.on('multi-event', callback1);
        eventBus.on('multi-event', callback2);

        eventBus.emit('multi-event');

        expect(callback1).toHaveBeenCalledTimes(1);
        expect(callback2).toHaveBeenCalledTimes(1);
    });

    it('deve remover listener ao chamar a função de unsubscribe', () => {
        const callback = jest.fn();
        const unsubscribe = eventBus.on('unsub-event', callback);

        unsubscribe();
        eventBus.emit('unsub-event');

        expect(callback).not.toHaveBeenCalled();
    });

    it('não deve falhar ao emitir evento sem listeners', () => {
        expect(() => eventBus.emit('evento-inexistente')).not.toThrow();
    });

    it('deve exportar a constante PREFERENCES_UPDATED', () => {
        expect(PREFERENCES_UPDATED).toBe('preferences-updated');
    });

    it('deve remover apenas o listener correto quando há múltiplos', () => {
        const callback1 = jest.fn();
        const callback2 = jest.fn();

        const unsubscribe1 = eventBus.on('partial-event', callback1);
        eventBus.on('partial-event', callback2);

        unsubscribe1();
        eventBus.emit('partial-event');

        expect(callback1).not.toHaveBeenCalled();
        expect(callback2).toHaveBeenCalledTimes(1);
    });
});
