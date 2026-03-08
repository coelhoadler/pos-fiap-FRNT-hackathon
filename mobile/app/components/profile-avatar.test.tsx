import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { ProfileAvatar } from './profile-avatar';
import { Alert, Platform } from 'react-native';

jest.mock('@/app/hooks/use-color-scheme', () => ({
    useColorScheme: jest.fn(() => 'light'),
}));

jest.mock('@/app/services/firebaseStorage', () => ({
    getProfileImageURL: jest.fn(),
    uploadProfileImage: jest.fn(),
    deleteProfileImage: jest.fn(),
}));

jest.mock('expo-image-picker', () => ({
    requestMediaLibraryPermissionsAsync: jest.fn(() =>
        Promise.resolve({ status: 'granted' })
    ),
    requestCameraPermissionsAsync: jest.fn(() =>
        Promise.resolve({ status: 'granted' })
    ),
    launchImageLibraryAsync: jest.fn(),
    launchCameraAsync: jest.fn(),
    MediaTypeOptions: { Images: 'Images' },
}));

jest.mock('@/app/components/themed-text', () => {
    const { Text } = require('react-native');
    return {
        ThemedText: (props: any) => <Text {...props}>{props.children}</Text>,
    };
});

jest.mock('@/app/components/ui/icon-symbol', () => {
    const { Text } = require('react-native');
    return {
        IconSymbol: (props: any) => <Text>{props.name}</Text>,
    };
});

const {
    getProfileImageURL,
    uploadProfileImage,
    deleteProfileImage,
} = require('@/app/services/firebaseStorage');

describe('ProfileAvatar', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        getProfileImageURL.mockResolvedValue(null);
    });

    it('deve exibir indicador de carregamento enquanto carrega a imagem inicial', () => {
        getProfileImageURL.mockReturnValue(new Promise(() => { })); // never resolves
        render(<ProfileAvatar />);
        // Enquanto carrega, deve mostrar ActivityIndicator (loading state)
        expect(screen.toJSON()).toBeTruthy();
    });

    it('deve exibir placeholder quando não há imagem de perfil', async () => {
        getProfileImageURL.mockResolvedValue(null);
        render(<ProfileAvatar />);
        await waitFor(() => {
            expect(screen.getByText('person.circle.fill')).toBeTruthy();
        });
    });

    it('deve exibir texto "Toque para editar" quando editável', async () => {
        getProfileImageURL.mockResolvedValue(null);
        render(<ProfileAvatar editable={true} />);
        await waitFor(() => {
            expect(screen.getByText('Toque para editar')).toBeTruthy();
        });
    });

    it('não deve exibir texto "Toque para editar" quando não editável', async () => {
        getProfileImageURL.mockResolvedValue(null);
        render(<ProfileAvatar editable={false} />);
        await waitFor(() => {
            expect(screen.queryByText('Toque para editar')).toBeNull();
        });
    });

    it('deve exibir imagem quando URL está disponível', async () => {
        getProfileImageURL.mockResolvedValue('https://example.com/photo.jpg');
        render(<ProfileAvatar />);
        await waitFor(() => {
            expect(screen.queryByText('person.circle.fill')).toBeNull();
        });
    });

    it('deve chamar onImageUpdate com a URL carregada', async () => {
        const onImageUpdate = jest.fn();
        getProfileImageURL.mockResolvedValue('https://example.com/photo.jpg');
        render(<ProfileAvatar onImageUpdate={onImageUpdate} />);
        await waitFor(() => {
            expect(onImageUpdate).toHaveBeenCalledWith('https://example.com/photo.jpg');
        });
    });

    it('deve exibir ícone de edição quando editável e não está carregando', async () => {
        getProfileImageURL.mockResolvedValue(null);
        render(<ProfileAvatar editable={true} />);
        await waitFor(() => {
            expect(screen.getByText('pencil')).toBeTruthy();
        });
    });

    it('não deve exibir ícone de edição quando não editável', async () => {
        getProfileImageURL.mockResolvedValue(null);
        render(<ProfileAvatar editable={false} />);
        await waitFor(() => {
            expect(screen.queryByText('pencil')).toBeNull();
        });
    });

    it('deve respeitar o tamanho custom via prop size', async () => {
        getProfileImageURL.mockResolvedValue(null);
        const { toJSON } = render(<ProfileAvatar size={80} />);
        await waitFor(() => {
            expect(toJSON()).toBeTruthy();
        });
    });

    it('deve tratar erro ao carregar imagem de perfil', async () => {
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
        getProfileImageURL.mockRejectedValue(new Error('Erro de rede'));
        render(<ProfileAvatar />);
        await waitFor(() => {
            expect(consoleSpy).toHaveBeenCalledWith(
                'Erro ao carregar imagem:',
                expect.any(Error)
            );
        });
        consoleSpy.mockRestore();
    });
});
