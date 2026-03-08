import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { Text } from 'react-native';
import { LegendContent } from './index';

jest.mock('@/app/hooks/use-color-scheme', () => ({
    useColorScheme: jest.fn(() => 'light'),
}));

describe('LegendContent', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('deve renderizar sem itens de legenda', () => {
        render(<LegendContent />);
    });

    it('deve renderizar o subtítulo quando fornecido', () => {
        render(<LegendContent subtitle="Subtítulo da legenda" />);

        expect(screen.getByText('Subtítulo da legenda')).toBeTruthy();
    });

    it('deve renderizar itens de legenda com descrição', () => {
        const items = [
            { description: 'Item 1' },
            { description: 'Item 2' },
        ];

        render(<LegendContent legendItems={items} />);

        expect(screen.getByText('Item 1')).toBeTruthy();
        expect(screen.getByText('Item 2')).toBeTruthy();
    });

    it('deve renderizar itens de legenda com ícone', () => {
        const items = [
            {
                description: 'Item com ícone',
                icon: <Text testID="test-icon">Icon</Text>,
            },
        ];

        render(<LegendContent legendItems={items} />);

        expect(screen.getByText('Item com ícone')).toBeTruthy();
        expect(screen.getByTestId('test-icon')).toBeTruthy();
    });

    it('deve renderizar subtítulo e itens juntos', () => {
        const items = [{ description: 'Descrição' }];

        render(
            <LegendContent subtitle="Meu Subtítulo" legendItems={items} />
        );

        expect(screen.getByText('Meu Subtítulo')).toBeTruthy();
        expect(screen.getByText('Descrição')).toBeTruthy();
    });
});
