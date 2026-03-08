import { renderHook } from '@testing-library/react-native';
import { useThemeColor } from './use-theme-color';

jest.mock('./use-color-scheme', () => ({
    useColorScheme: jest.fn(() => 'light'),
}));

describe('useThemeColor', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('deve retornar cor do tema light quando colorScheme é light', () => {
        const { result } = renderHook(() =>
            useThemeColor({}, 'text')
        );

        expect(result.current).toBeTruthy();
        expect(typeof result.current).toBe('string');
    });

    it('deve retornar cor do tema dark quando colorScheme é dark', () => {
        const { useColorScheme } = require('./use-color-scheme');
        useColorScheme.mockReturnValue('dark');

        const { result } = renderHook(() =>
            useThemeColor({}, 'text')
        );

        expect(result.current).toBeTruthy();
    });

    it('deve retornar cor das props quando fornecida para o tema light', () => {
        const { useColorScheme } = require('./use-color-scheme');
        useColorScheme.mockReturnValue('light');

        const { result } = renderHook(() =>
            useThemeColor({ light: '#FF0000' }, 'text')
        );

        expect(result.current).toBe('#FF0000');
    });

    it('deve retornar cor das props quando fornecida para o tema dark', () => {
        const { useColorScheme } = require('./use-color-scheme');
        useColorScheme.mockReturnValue('dark');

        const { result } = renderHook(() =>
            useThemeColor({ dark: '#00FF00' }, 'text')
        );

        expect(result.current).toBe('#00FF00');
    });

    it('deve usar light como fallback quando colorScheme é null', () => {
        const { useColorScheme } = require('./use-color-scheme');
        useColorScheme.mockReturnValue(null);

        const { result } = renderHook(() =>
            useThemeColor({}, 'background')
        );

        expect(result.current).toBeTruthy();
    });

    it('deve retornar cor do tema quando props não tem cor para o tema atual', () => {
        const { useColorScheme } = require('./use-color-scheme');
        useColorScheme.mockReturnValue('light');

        const { result } = renderHook(() =>
            useThemeColor({ dark: '#00FF00' }, 'text')
        );

        // Não tem prop light, então usa Colors.light.text
        expect(result.current).not.toBe('#00FF00');
        expect(result.current).toBeTruthy();
    });
});
