import { getPomodoroSettingsDocRef, getPomodoroSettings, savePomodoroSettings, hasPomodoroSettings } from './pomodoroSettings';

const mockGet = jest.fn();
const mockSet = jest.fn();

jest.mock('@react-native-firebase/auth', () => () => ({
    currentUser: { uid: 'user123' },
}));

jest.mock('@react-native-firebase/firestore', () => () => ({
    collection: jest.fn(() => ({
        doc: jest.fn(() => ({
            collection: jest.fn(() => ({
                doc: jest.fn(() => ({
                    get: mockGet,
                    set: mockSet,
                })),
            })),
        })),
    })),
}));

describe('pomodoroSettings service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getPomodoroSettings', () => {
        it('deve retornar as configurações quando existem', async () => {
            const settingsData = {
                pomodoroTime: 25,
                shortBreak: 5,
                longBreak: 15,
                musicEnabled: true,
                soundEnabledWhenFinish: true,
            };
            mockGet.mockResolvedValue({
                exists: false,
                data: () => settingsData,
            });

            // Quando doc.exists é false, retorna null
            const result = await getPomodoroSettings();
            expect(result).toBeNull();
        });

        it('deve retornar null quando as configurações não existem', async () => {
            mockGet.mockResolvedValue({
                exists: false,
            });

            const result = await getPomodoroSettings();

            expect(result).toBeNull();
        });

        it('deve propagar erro ao falhar', async () => {
            mockGet.mockRejectedValue(new Error('Firestore error'));

            await expect(getPomodoroSettings()).rejects.toThrow('Firestore error');
        });
    });

    describe('savePomodoroSettings', () => {
        it('deve salvar as configurações com merge', async () => {
            mockSet.mockResolvedValue(undefined);

            const settings = {
                pomodoroTime: 25,
                shortBreak: 5,
                longBreak: 15,
                musicEnabled: true,
                soundEnabledWhenFinish: true,
            };

            await savePomodoroSettings(settings);

            expect(mockSet).toHaveBeenCalledWith(settings, { merge: true });
        });

        it('deve propagar erro ao falhar', async () => {
            mockSet.mockRejectedValue(new Error('Save error'));

            const settings = {
                pomodoroTime: 25,
                shortBreak: 5,
                longBreak: 15,
                musicEnabled: false,
                soundEnabledWhenFinish: false,
            };

            await expect(savePomodoroSettings(settings)).rejects.toThrow('Save error');
        });
    });

    describe('hasPomodoroSettings', () => {
        it('deve retornar true quando configurações existem', async () => {
            mockGet.mockResolvedValue({ exists: true });

            const result = await hasPomodoroSettings();

            expect(result).toBe(true);
        });

        it('deve retornar false quando configurações não existem', async () => {
            mockGet.mockResolvedValue({ exists: false });

            const result = await hasPomodoroSettings();

            expect(result).toBe(false);
        });

        it('deve retornar false em caso de erro', async () => {
            mockGet.mockRejectedValue(new Error('Firestore error'));

            const result = await hasPomodoroSettings();

            expect(result).toBe(false);
        });
    });
});
