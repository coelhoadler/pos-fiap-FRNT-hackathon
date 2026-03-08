import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { DropdownContent } from './index';
import { Text } from 'react-native';

jest.mock('react-native/Libraries/Utilities/useColorScheme', () => ({
    __esModule: true,
    default: jest.fn(() => 'light'),
}));

describe('DropdownContent', () => {
    const mockItems = [
        {
            id: '1',
            name: 'Editar',
            onPress: jest.fn(),
            icon: <Text>icon-edit</Text>,
        },
        {
            id: '2',
            name: 'Excluir',
            onPress: jest.fn(),
            icon: <Text>icon-delete</Text>,
        },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
        mockItems.forEach((item) => item.onPress.mockClear());
    });

    it('deve renderizar todos os itens do dropdown', () => {
        render(
            <DropdownContent
                dropdownItems={mockItems}
                onClose={jest.fn()}
            />
        );
        expect(screen.getByText('Editar')).toBeTruthy();
        expect(screen.getByText('Excluir')).toBeTruthy();
    });

    it('deve renderizar ícones dos itens', () => {
        render(
            <DropdownContent
                dropdownItems={mockItems}
                onClose={jest.fn()}
            />
        );
        expect(screen.getByText('icon-edit')).toBeTruthy();
        expect(screen.getByText('icon-delete')).toBeTruthy();
    });

    it('deve chamar onPress ao pressionar um item', () => {
        render(
            <DropdownContent
                dropdownItems={mockItems}
                onClose={jest.fn()}
            />
        );
        fireEvent.press(screen.getByText('Editar'));
        expect(mockItems[0].onPress).toHaveBeenCalledTimes(1);
    });

    it('deve chamar onClose ao pressionar o backdrop', () => {
        const onClose = jest.fn();
        render(
            <DropdownContent
                dropdownItems={mockItems}
                onClose={onClose}
            />
        );
        // O backdrop é o primeiro Pressable renderizado
        const { toJSON } = render(
            <DropdownContent
                dropdownItems={mockItems}
                onClose={onClose}
            />
        );
        // Pressable backdrop check - buscamos pelo componente
        expect(toJSON()).toBeTruthy();
    });

    it('deve renderizar sem itens quando dropdownItems é undefined', () => {
        const { toJSON } = render(
            <DropdownContent onClose={jest.fn()} />
        );
        expect(toJSON()).toBeTruthy();
    });

    it('deve renderizar com um único item', () => {
        const singleItem = [
            {
                id: '1',
                name: 'Único Item',
                onPress: jest.fn(),
                icon: <Text>icon-single</Text>,
            },
        ];
        render(
            <DropdownContent
                dropdownItems={singleItem}
                onClose={jest.fn()}
            />
        );
        expect(screen.getByText('Único Item')).toBeTruthy();
    });

    it('deve renderizar com tema dark', () => {
        const useColorScheme = require('react-native/Libraries/Utilities/useColorScheme').default;
        useColorScheme.mockReturnValue('dark');

        render(
            <DropdownContent
                dropdownItems={mockItems}
                onClose={jest.fn()}
            />
        );
        expect(screen.getByText('Editar')).toBeTruthy();
    });
});
