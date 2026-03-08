import { getPreferencesDocRef, getProjectsCollectionRef, getTasksCollectionRef, getPomodoroHistoryCollectionRef } from './firestorePaths';

const mockCollection = jest.fn(() => ({
    doc: jest.fn(() => ({
        collection: jest.fn(() => ({
            doc: jest.fn(() => 'docRef'),
        })),
    })),
}));

jest.mock('@react-native-firebase/auth', () => {
    let currentUser: any = { uid: 'user123' };
    const authFn = () => ({
        get currentUser() { return currentUser; },
    });
    authFn.__setCurrentUser = (user: any) => { currentUser = user; };
    return {
        __esModule: true,
        default: authFn,
    };
});

jest.mock('@react-native-firebase/firestore', () => {
    return {
        __esModule: true,
        default: () => ({
            collection: jest.fn((path: string) => ({
                doc: jest.fn((id: string) => ({
                    collection: jest.fn((subPath: string) => ({
                        doc: jest.fn((subId: string) => ({
                            collection: jest.fn(() => 'collectionRef'),
                        })),
                    })),
                })),
            })),
        }),
    };
});

describe('firestorePaths', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        const auth = require('@react-native-firebase/auth');
        auth.default.__setCurrentUser({ uid: 'user123' });
    });

    describe('getPreferencesDocRef', () => {
        it('deve retornar referência quando usuário está autenticado', () => {
            const result = getPreferencesDocRef();
            expect(result).toBeTruthy();
        });

        it('deve lançar erro quando usuário não está autenticado', () => {
            const auth = require('@react-native-firebase/auth');
            auth.default.__setCurrentUser(null);

            expect(() => getPreferencesDocRef()).toThrow('Usuário não autenticado');
        });
    });

    describe('getProjectsCollectionRef', () => {
        it('deve retornar referência quando usuário está autenticado', () => {
            const result = getProjectsCollectionRef();
            expect(result).toBeTruthy();
        });

        it('deve lançar erro quando usuário não está autenticado', () => {
            const auth = require('@react-native-firebase/auth');
            auth.default.__setCurrentUser(null);

            expect(() => getProjectsCollectionRef()).toThrow('Usuário não autenticado');
        });
    });

    describe('getTasksCollectionRef', () => {
        it('deve retornar referência quando usuário está autenticado', () => {
            const result = getTasksCollectionRef('projectId');
            expect(result).toBeTruthy();
        });

        it('deve lançar erro quando usuário não está autenticado', () => {
            const auth = require('@react-native-firebase/auth');
            auth.default.__setCurrentUser(null);

            expect(() => getTasksCollectionRef('projectId')).toThrow('Usuário não autenticado');
        });
    });

    describe('getPomodoroHistoryCollectionRef', () => {
        it('deve retornar referência quando usuário está autenticado', () => {
            const result = getPomodoroHistoryCollectionRef();
            expect(result).toBeTruthy();
        });

        it('deve lançar erro quando usuário não está autenticado', () => {
            const auth = require('@react-native-firebase/auth');
            auth.default.__setCurrentUser(null);

            expect(() => getPomodoroHistoryCollectionRef()).toThrow('Usuário não autenticado');
        });
    });
});
