import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { HamburgerMenuButton } from './hamburger-menu-button';

const mockToggleMenu = jest.fn();

jest.mock('./menu-context', () => ({
    useMenu: () => ({
        isMenuOpen: false,
        toggleMenu: mockToggleMenu,
    }),
}));

jest.mock('@/app/hooks/use-color-scheme', () => ({
    useColorScheme: jest.fn(() => 'light'),
}));

jest.mock('@/app/components/ui/icon-symbol', () => {
    const { Text } = require('react-native');
    return {
        IconSymbol: (props: any) => <Text testID="icon">{props.name}</Text>,
    };
});

describe('HamburgerMenuButton', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('deve renderizar o ícone de menu', () => {
        render(<HamburgerMenuButton />);

        expect(screen.getByText('line.3.horizontal')).toBeTruthy();
    });

    it('deve chamar toggleMenu ao ser pressionado', () => {
        render(<HamburgerMenuButton />);

        fireEvent.press(screen.getByText('line.3.horizontal'));

        expect(mockToggleMenu).toHaveBeenCalledTimes(1);
    });
});
