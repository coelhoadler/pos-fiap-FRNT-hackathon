import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { MenuProvider, useMenu } from './menu-context';
import { Text, TouchableOpacity } from 'react-native';

const TestConsumer: React.FC = () => {
    const { isMenuOpen, toggleMenu } = useMenu();
    return (
        <>
            <Text testID="menu-state">{isMenuOpen ? 'open' : 'closed'}</Text>
            <TouchableOpacity testID="toggle-btn" onPress={toggleMenu}>
                <Text>Toggle</Text>
            </TouchableOpacity>
        </>
    );
};

describe('MenuContext', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('MenuProvider', () => {
        it('deve renderizar children corretamente', () => {
            render(
                <MenuProvider>
                    <Text>Conteúdo filho</Text>
                </MenuProvider>
            );

            expect(screen.getByText('Conteúdo filho')).toBeTruthy();
        });

        it('deve iniciar com menu fechado', () => {
            render(
                <MenuProvider>
                    <TestConsumer />
                </MenuProvider>
            );

            expect(screen.getByTestId('menu-state')).toHaveTextContent('closed');
        });

        it('deve alternar estado do menu ao chamar toggleMenu', () => {
            render(
                <MenuProvider>
                    <TestConsumer />
                </MenuProvider>
            );

            expect(screen.getByTestId('menu-state')).toHaveTextContent('closed');

            fireEvent.press(screen.getByTestId('toggle-btn'));

            expect(screen.getByTestId('menu-state')).toHaveTextContent('open');

            fireEvent.press(screen.getByTestId('toggle-btn'));

            expect(screen.getByTestId('menu-state')).toHaveTextContent('closed');
        });
    });

    describe('useMenu', () => {
        it('deve lançar erro quando usado fora do MenuProvider', () => {
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

            expect(() => render(<TestConsumer />)).toThrow(
                'useMenu must be used within MenuProvider'
            );

            consoleSpy.mockRestore();
        });
    });
});
