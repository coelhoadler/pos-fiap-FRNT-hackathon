import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { ActionsButtons } from './index';
import { Text } from 'react-native';

jest.mock('@/app/hooks/use-color-scheme', () => ({
    useColorScheme: jest.fn(() => 'light'),
}));

describe('ActionsButtons', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('deve renderizar os filhos corretamente', () => {
        render(
            <ActionsButtons>
                <Text>Botão Ação</Text>
            </ActionsButtons>
        );
        expect(screen.getByText('Botão Ação')).toBeTruthy();
    });

    it('deve renderizar sem filhos sem erros', () => {
        const { toJSON } = render(<ActionsButtons />);
        expect(toJSON()).toBeTruthy();
    });

    it('deve renderizar com tema dark', () => {
        const { useColorScheme } = require('@/app/hooks/use-color-scheme');
        useColorScheme.mockReturnValue('dark');

        const { toJSON } = render(
            <ActionsButtons>
                <Text>Botão Dark</Text>
            </ActionsButtons>
        );
        expect(toJSON()).toBeTruthy();
        expect(screen.getByText('Botão Dark')).toBeTruthy();
    });

    it('deve renderizar com tema null (fallback para dark)', () => {
        const { useColorScheme } = require('@/app/hooks/use-color-scheme');
        useColorScheme.mockReturnValue(null);

        const { toJSON } = render(
            <ActionsButtons>
                <Text>Botão Fallback</Text>
            </ActionsButtons>
        );
        expect(toJSON()).toBeTruthy();
    });
});
