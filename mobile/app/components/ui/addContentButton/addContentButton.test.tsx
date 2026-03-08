import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { AddContentButton } from './index';

jest.mock('react-native/Libraries/Utilities/useColorScheme', () => ({
    __esModule: true,
    default: jest.fn(() => 'light'),
}));

jest.mock('lucide-react-native', () => {
    const { Text } = require('react-native');
    return {
        CirclePlus: () => <Text>icon-add</Text>,
        Eye: () => <Text>icon-view</Text>,
    };
});

describe('AddContentButton', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('deve renderizar o texto do botão', () => {
        render(<AddContentButton text="Adicionar projeto" onPress={() => { }} />);
        expect(screen.getByText('Adicionar projeto')).toBeTruthy();
    });

    it('deve chamar onPress ao pressionar', () => {
        const onPress = jest.fn();
        render(<AddContentButton text="Adicionar" onPress={onPress} />);
        fireEvent.press(screen.getByText('Adicionar'));
        expect(onPress).toHaveBeenCalledTimes(1);
    });

    it('deve renderizar ícone de add por padrão', () => {
        render(<AddContentButton text="Adicionar" onPress={() => { }} />);
        expect(screen.getByText('icon-add')).toBeTruthy();
    });

    it('deve renderizar ícone de view quando typeIcon é "view"', () => {
        render(<AddContentButton text="Ver" typeIcon="view" onPress={() => { }} />);
        expect(screen.getByText('icon-view')).toBeTruthy();
    });

    it('não deve renderizar ícone quando noIcon é true', () => {
        render(<AddContentButton text="Sem ícone" noIcon onPress={() => { }} />);
        expect(screen.queryByText('icon-add')).toBeNull();
        expect(screen.queryByText('icon-view')).toBeNull();
    });

    it('deve renderizar children quando text não é fornecido', () => {
        render(
            <AddContentButton onPress={() => { }}>
                Conteúdo filho
            </AddContentButton>
        );
        expect(screen.getByText('Conteúdo filho')).toBeTruthy();
    });
});
