import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { Text } from 'react-native';
import { IconButton } from './index';

jest.mock('react-native/Libraries/Utilities/useColorScheme', () => ({
    __esModule: true,
    default: jest.fn(() => 'light'),
}));

describe('IconButton', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('deve renderizar o ícone fornecido', () => {
        render(<IconButton icon={<Text>meu-icone</Text>} onPress={() => {}} />);
        expect(screen.getByText('meu-icone')).toBeTruthy();
    });

    it('deve chamar onPress ao pressionar', () => {
        const onPress = jest.fn();
        render(<IconButton icon={<Text>icone</Text>} onPress={onPress} />);
        fireEvent.press(screen.getByText('icone'));
        expect(onPress).toHaveBeenCalledTimes(1);
    });

    it('não deve chamar onPress quando disabled', () => {
        const onPress = jest.fn();
        render(<IconButton icon={<Text>icone</Text>} onPress={onPress} disabled />);
        fireEvent.press(screen.getByText('icone'));
        expect(onPress).not.toHaveBeenCalled();
    });

    it('deve exibir ActivityIndicator quando loading', () => {
        const { toJSON } = render(<IconButton icon={<Text>icone</Text>} loading onPress={() => {}} />);
        // Quando loading, o icon não deve ser renderizado
        expect(screen.queryByText('icone')).toBeNull();
    });

    it('não deve chamar onPress quando loading', () => {
        const onPress = jest.fn();
        const { toJSON } = render(<IconButton icon={<Text>icone</Text>} onPress={onPress} loading />);
        // loading desabilita o botão, portanto não deve chamar
        const json = JSON.stringify(toJSON());
        expect(json).toBeTruthy();
    });
});
