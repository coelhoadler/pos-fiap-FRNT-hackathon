import { savePreferences, getPreferences } from './preferences';

const mockUpdate = jest.fn();
const mockSet = jest.fn();
const mockGet = jest.fn();

jest.mock('./firestorePaths', () => ({
    getPreferencesDocRef: jest.fn(() => ({
        update: mockUpdate,
        set: mockSet,
        get: mockGet,
    })),
}));

jest.mock('@react-native-firebase/firestore', () => {
    const firestoreFn = () => ({});
    firestoreFn.FieldValue = {
        serverTimestamp: () => 'SERVER_TIMESTAMP',
    };
    return {
        __esModule: true,
        default: firestoreFn,
    };
});

describe('preferences service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('savePreferences', () => {
        it('deve atualizar preferências existentes com timestamp', async () => {
            mockUpdate.mockResolvedValue(undefined);

            await savePreferences({ focusMode: true, darkMode: false });

            expect(mockUpdate).toHaveBeenCalledWith(
                expect.objectContaining({
                    focusMode: true,
                    darkMode: false,
                    updatedAt: 'SERVER_TIMESTAMP',
                })
            );
        });

        it('deve criar documento quando não existe (firestore/not-found)', async () => {
            const notFoundError = { code: 'firestore/not-found' };
            mockUpdate.mockRejectedValue(notFoundError);
            mockSet.mockResolvedValue(undefined);

            await savePreferences({ focusMode: true });

            expect(mockSet).toHaveBeenCalledWith(
                expect.objectContaining({
                    focusMode: true,
                    createdAt: 'SERVER_TIMESTAMP',
                    updatedAt: 'SERVER_TIMESTAMP',
                })
            );
        });

        it('deve propagar erro quando não é not-found', async () => {
            const otherError = { code: 'firestore/permission-denied' };
            mockUpdate.mockRejectedValue(otherError);

            await expect(savePreferences({ focusMode: true })).rejects.toEqual(otherError);
        });
    });

    describe('getPreferences', () => {
        it('deve retornar preferências quando o documento existe', async () => {
            mockGet.mockResolvedValue({
                exists: true,
                data: () => ({
                    focusMode: true,
                    darkMode: false,
                    createdAt: 'timestamp1',
                    updatedAt: 'timestamp2',
                }),
            });

            const result = await getPreferences();

            expect(result).toEqual({ focusMode: true, darkMode: false });
        });

        it('deve retornar null quando o documento não existe', async () => {
            mockGet.mockResolvedValue({
                exists: false,
            });

            const result = await getPreferences();

            expect(result).toBeNull();
        });

        it('deve retornar null quando data() retorna undefined', async () => {
            mockGet.mockResolvedValue({
                exists: true,
                data: () => undefined,
            });

            const result = await getPreferences();

            expect(result).toBeNull();
        });
    });
});
