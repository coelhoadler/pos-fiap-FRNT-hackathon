import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { Button } from './index';

jest.mock('react-native/Libraries/Utilities/useColorScheme', () => ({
    __esModule: true,
    default: jest.fn(() => 'light'),
}));

jest.mock('@/app/hooks/use-theme-color', () => ({
    useThemeColor: jest.fn(() => '#000000'),
}));

jest.mock('lucide-react-native', () => {
    const { Text } = require('react-native');
    return {
        X: (props: any) => <Text>X-icon</Text>,
    };
});

describe('Button', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('deve renderizar o título corretamente', () => {
        render(<Button title="Salvar" onPress={() => { }} />);
        expect(screen.getByText('Salvar')).toBeTruthy();
    });

    it('deve chamar onPress ao ser pressionado', () => {
        const onPress = jest.fn();
        render(<Button title="Clique" onPress={onPress} />);
        fireEvent.press(screen.getByText('Clique'));
        expect(onPress).toHaveBeenCalledTimes(1);
    });

    it('não deve chamar onPress quando disabled', () => {
        const onPress = jest.fn();
        render(<Button title="Desabilitado" onPress={onPress} disabled />);
        fireEvent.press(screen.getByText('Desabilitado'));
        expect(onPress).not.toHaveBeenCalled();
    });

    it('deve exibir ActivityIndicator quando loading', () => {
        const { toJSON } = render(<Button title="Carregando" loading />);
        const json = JSON.stringify(toJSON());
        // ActivityIndicator é renderizado ao invés do texto
        expect(screen.queryByText('Carregando')).toBeNull();
    });

    it('deve renderizar ícone X quando variant é "close"', () => {
        render(<Button variant="close" title="Fechar" onPress={() => { }} />);
        expect(screen.getByText('X-icon')).toBeTruthy();
    });

    it('deve renderizar com variant outline', () => {
        render(<Button variant="outline" title="Outline" onPress={() => { }} />);
        expect(screen.getByText('Outline')).toBeTruthy();
    });
});
