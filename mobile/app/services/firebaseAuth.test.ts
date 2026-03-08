import { isAuthenticated, signIn, signUp, signOut, getAuth, updateUserProfile } from './firebaseAuth';
import getCurrentUser from './firebaseAuth';

const mockCurrentUser = {
    uid: 'user123',
    email: 'test@test.com',
    updateProfile: jest.fn(),
};

const mockSignInWithEmailAndPassword = jest.fn();
const mockCreateUserWithEmailAndPassword = jest.fn();
const mockSignOut = jest.fn();

jest.mock('@react-native-firebase/auth', () => {
    const authFn = () => ({
        get currentUser() {
            return authFn.__currentUser;
        },
        signInWithEmailAndPassword: mockSignInWithEmailAndPassword,
        createUserWithEmailAndPassword: mockCreateUserWithEmailAndPassword,
        signOut: mockSignOut,
    });
    authFn.__currentUser = mockCurrentUser as any;
    return {
        __esModule: true,
        default: authFn,
    };
});

describe('firebaseAuth service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        const auth = require('@react-native-firebase/auth');
        auth.default.__currentUser = mockCurrentUser;
    });

    describe('isAuthenticated', () => {
        it('deve retornar true quando o usuário está autenticado', () => {
            expect(isAuthenticated()).toBe(true);
        });

        it('deve retornar false quando o usuário não está autenticado', () => {
            const auth = require('@react-native-firebase/auth');
            auth.default.__currentUser = null;

            expect(isAuthenticated()).toBe(false);
        });
    });

    describe('signIn', () => {
        it('deve chamar signInWithEmailAndPassword com email e senha', async () => {
            const mockCredential = { user: mockCurrentUser };
            mockSignInWithEmailAndPassword.mockResolvedValue(mockCredential);

            const result = await signIn('test@test.com', 'password123');

            expect(mockSignInWithEmailAndPassword).toHaveBeenCalledWith('test@test.com', 'password123');
            expect(result).toEqual(mockCredential);
        });

        it('deve propagar erro quando signIn falha', async () => {
            mockSignInWithEmailAndPassword.mockRejectedValue(new Error('auth/wrong-password'));

            await expect(signIn('test@test.com', 'wrongpassword')).rejects.toThrow('auth/wrong-password');
        });
    });

    describe('signUp', () => {
        it('deve chamar createUserWithEmailAndPassword com email e senha', async () => {
            const mockCredential = { user: mockCurrentUser };
            mockCreateUserWithEmailAndPassword.mockResolvedValue(mockCredential);

            const result = await signUp('new@test.com', 'password123');

            expect(mockCreateUserWithEmailAndPassword).toHaveBeenCalledWith('new@test.com', 'password123');
            expect(result).toEqual(mockCredential);
        });

        it('deve propagar erro quando signUp falha', async () => {
            mockCreateUserWithEmailAndPassword.mockRejectedValue(new Error('auth/email-already-in-use'));

            await expect(signUp('existing@test.com', 'password123')).rejects.toThrow('auth/email-already-in-use');
        });
    });

    describe('getCurrentUser', () => {
        it('deve retornar o usuário atual quando autenticado', () => {
            const user = getCurrentUser();
            expect(user).toEqual(mockCurrentUser);
        });

        it('deve retornar null quando não há usuário autenticado', () => {
            const auth = require('@react-native-firebase/auth');
            auth.default.__currentUser = null;

            expect(getCurrentUser()).toBeNull();
        });
    });

    describe('signOut', () => {
        it('deve chamar signOut do Firebase', async () => {
            mockSignOut.mockResolvedValue(undefined);

            await signOut();

            expect(mockSignOut).toHaveBeenCalled();
        });
    });

    describe('getAuth', () => {
        it('deve retornar a instância do auth', () => {
            const authInstance = getAuth();
            expect(authInstance).toBeTruthy();
            expect(authInstance.currentUser).toEqual(mockCurrentUser);
        });
    });

    describe('updateUserProfile', () => {
        it('deve atualizar o perfil do usuário autenticado', async () => {
            mockCurrentUser.updateProfile.mockResolvedValue(undefined);

            await updateUserProfile({ displayName: 'Novo Nome' });

            expect(mockCurrentUser.updateProfile).toHaveBeenCalledWith({ displayName: 'Novo Nome' });
        });

        it('deve atualizar photoURL do perfil', async () => {
            mockCurrentUser.updateProfile.mockResolvedValue(undefined);

            await updateUserProfile({ photoURL: 'https://example.com/photo.jpg' });

            expect(mockCurrentUser.updateProfile).toHaveBeenCalledWith({ photoURL: 'https://example.com/photo.jpg' });
        });

        it('deve lançar erro quando não há usuário autenticado', async () => {
            const auth = require('@react-native-firebase/auth');
            auth.default.__currentUser = null;

            await expect(updateUserProfile({ displayName: 'Nome' })).rejects.toThrow('Nenhum usuário autenticado');
        });
    });
});
