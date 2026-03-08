import { uploadProfileImage, getProfileImageURL, deleteProfileImage } from './firebaseStorage';

const mockPutFile = jest.fn();
const mockGetDownloadURL = jest.fn();
const mockDelete = jest.fn();
const mockRef = jest.fn(() => ({
    putFile: mockPutFile,
    getDownloadURL: mockGetDownloadURL,
    delete: mockDelete,
}));

jest.mock('@react-native-firebase/storage', () => {
    return {
        __esModule: true,
        default: () => ({
            ref: mockRef,
        }),
    };
});

jest.mock('./firebaseAuth', () => {
    let currentUser: any = { uid: 'user123' };
    const fn = () => currentUser;
    fn.__setCurrentUser = (user: any) => { currentUser = user; };
    return {
        __esModule: true,
        default: fn,
    };
});

describe('firebaseStorage service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        const auth = require('./firebaseAuth');
        auth.default.__setCurrentUser({ uid: 'user123' });
    });

    describe('uploadProfileImage', () => {
        it('deve fazer upload e retornar URL de download', async () => {
            mockPutFile.mockResolvedValue(undefined);
            mockGetDownloadURL.mockResolvedValue('https://storage.example.com/avatar.jpg');

            const result = await uploadProfileImage('/path/to/image.jpg');

            expect(mockRef).toHaveBeenCalledWith('avatars/profile-user123.jpg');
            expect(mockPutFile).toHaveBeenCalledWith('/path/to/image.jpg');
            expect(result).toBe('https://storage.example.com/avatar.jpg');
        });

        it('deve lançar erro quando usuário não está autenticado', async () => {
            const auth = require('./firebaseAuth');
            auth.default.__setCurrentUser(null);

            await expect(uploadProfileImage('/path/to/image.jpg')).rejects.toThrow('Usuário não autenticado');
        });

        it('deve propagar erro quando upload falha', async () => {
            mockPutFile.mockRejectedValue(new Error('upload-failed'));

            await expect(uploadProfileImage('/path/to/image.jpg')).rejects.toThrow('upload-failed');
        });
    });

    describe('getProfileImageURL', () => {
        it('deve retornar URL quando a imagem existe', async () => {
            mockGetDownloadURL.mockResolvedValue('https://storage.example.com/avatar.jpg');

            const result = await getProfileImageURL();

            expect(mockRef).toHaveBeenCalledWith('avatars/profile-user123.jpg');
            expect(result).toBe('https://storage.example.com/avatar.jpg');
        });

        it('deve retornar null quando usuário não está autenticado', async () => {
            const auth = require('./firebaseAuth');
            auth.default.__setCurrentUser(null);

            const result = await getProfileImageURL();

            expect(result).toBeNull();
        });

        it('deve retornar null quando a imagem não existe', async () => {
            mockGetDownloadURL.mockRejectedValue(new Error('storage/object-not-found'));

            const result = await getProfileImageURL();

            expect(result).toBeNull();
        });
    });

    describe('deleteProfileImage', () => {
        it('deve deletar a imagem de perfil', async () => {
            mockDelete.mockResolvedValue(undefined);

            await deleteProfileImage();

            expect(mockRef).toHaveBeenCalledWith('avatars/profile-user123.jpg');
            expect(mockDelete).toHaveBeenCalled();
        });

        it('deve lançar erro quando usuário não está autenticado', async () => {
            const auth = require('./firebaseAuth');
            auth.default.__setCurrentUser(null);

            await expect(deleteProfileImage()).rejects.toThrow('Usuário não autenticado');
        });

        it('deve propagar erro quando delete falha', async () => {
            mockDelete.mockRejectedValue(new Error('delete-failed'));

            await expect(deleteProfileImage()).rejects.toThrow('delete-failed');
        });
    });
});
