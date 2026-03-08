import {
    setupAudioMode,
    playDoneSound,
    playBackgroundMusic,
    pauseBackgroundMusic,
    stopBackgroundMusic,
    getBackgroundSound,
} from './soundService';

const mockSetAudioModeAsync = jest.fn();
const mockPlayAsync = jest.fn();
const mockPauseAsync = jest.fn();
const mockStopAsync = jest.fn();
const mockUnloadAsync = jest.fn();
const mockSetOnPlaybackStatusUpdate = jest.fn();

const mockSound = {
    playAsync: mockPlayAsync,
    pauseAsync: mockPauseAsync,
    stopAsync: mockStopAsync,
    unloadAsync: mockUnloadAsync,
    setOnPlaybackStatusUpdate: mockSetOnPlaybackStatusUpdate,
};

const mockCreateAsync = jest.fn();

jest.mock('expo-av', () => ({
    Audio: {
        setAudioModeAsync: (...args: any[]) => mockSetAudioModeAsync(...args),
        Sound: {
            createAsync: (...args: any[]) => mockCreateAsync(...args),
        },
    },
}));

describe('soundService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        // Resetar estado interno do módulo
        jest.resetModules();
    });

    describe('setupAudioMode', () => {
        it('deve configurar o modo de áudio corretamente', async () => {
            mockSetAudioModeAsync.mockResolvedValue(undefined);

            await setupAudioMode();

            expect(mockSetAudioModeAsync).toHaveBeenCalledWith({
                playsInSilentModeIOS: true,
                shouldDuckAndroid: true,
            });
        });

        it('deve tratar erro silenciosamente', async () => {
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
            mockSetAudioModeAsync.mockRejectedValue(new Error('audio-error'));

            await setupAudioMode();

            expect(consoleSpy).toHaveBeenCalledWith('Erro ao configurar áudio:', expect.any(Error));
            consoleSpy.mockRestore();
        });
    });

    describe('playDoneSound', () => {
        it('deve criar e tocar o som de conclusão', async () => {
            mockCreateAsync.mockResolvedValue({ sound: mockSound });

            await playDoneSound();

            expect(mockCreateAsync).toHaveBeenCalledWith(
                expect.anything(),
                { shouldPlay: true, volume: 0.3 }
            );
            expect(mockSetOnPlaybackStatusUpdate).toHaveBeenCalled();
        });

        it('deve descarregar som quando terminar de tocar', async () => {
            mockCreateAsync.mockResolvedValue({ sound: mockSound });

            await playDoneSound();

            const callback = mockSetOnPlaybackStatusUpdate.mock.calls[0][0];
            callback({ isLoaded: true, didJustFinish: true });

            expect(mockUnloadAsync).toHaveBeenCalled();
        });

        it('não deve descarregar som se não terminou de tocar', async () => {
            mockCreateAsync.mockResolvedValue({ sound: mockSound });

            await playDoneSound();

            const callback = mockSetOnPlaybackStatusUpdate.mock.calls[0][0];
            callback({ isLoaded: true, didJustFinish: false });

            expect(mockUnloadAsync).not.toHaveBeenCalled();
        });

        it('deve tratar erro silenciosamente', async () => {
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
            mockCreateAsync.mockRejectedValue(new Error('sound-error'));

            await playDoneSound();

            expect(consoleSpy).toHaveBeenCalledWith('Erro ao tocar som de conclusão:', expect.any(Error));
            consoleSpy.mockRestore();
        });
    });

    describe('playBackgroundMusic', () => {
        it('deve criar e tocar música de fundo com looping', async () => {
            mockCreateAsync.mockResolvedValue({ sound: mockSound });

            const result = await playBackgroundMusic();

            expect(mockCreateAsync).toHaveBeenCalledWith(
                expect.anything(),
                { shouldPlay: true, isLooping: true, volume: 0.3 }
            );
            expect(result).toBe(mockSound);
        });

        it('deve retornar null quando falha ao criar som pela primeira vez', async () => {
            const { playBackgroundMusic: freshPlay } = require('./soundService');
            // Parar qualquer som anterior para limpar estado
            await stopBackgroundMusic();

            const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
            mockCreateAsync.mockRejectedValue(new Error('music-error'));

            const result = await freshPlay();

            expect(result).toBeNull();
            consoleSpy.mockRestore();
        });
    });

    describe('stopBackgroundMusic', () => {
        it('não deve lançar erro quando não há música de fundo', async () => {
            await expect(stopBackgroundMusic()).resolves.not.toThrow();
        });
    });

    describe('pauseBackgroundMusic', () => {
        it('não deve lançar erro quando não há música de fundo', async () => {
            await expect(pauseBackgroundMusic()).resolves.not.toThrow();
        });
    });

    describe('getBackgroundSound', () => {
        it('deve retornar null inicialmente', () => {
            const result = getBackgroundSound();
            expect(result).toBeNull();
        });
    });
});
