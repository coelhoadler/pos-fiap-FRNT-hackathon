import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { TasksNotFound } from './index';

jest.mock('@/app/hooks/use-color-scheme', () => ({
    useColorScheme: jest.fn(() => 'light'),
}));

jest.mock('lucide-react-native', () => {
    const { Text } = require('react-native');
    return {
        SearchX: () => <Text>search-x-icon</Text>,
    };
});

describe('TasksNotFound', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('deve renderizar a mensagem informada', () => {
        render(<TasksNotFound message="Nenhuma task encontrada" />);
        expect(screen.getByText('Nenhuma task encontrada')).toBeTruthy();
    });

    it('deve renderizar o ícone SearchX', () => {
        render(<TasksNotFound message="Sem resultados" />);
        expect(screen.getByText('search-x-icon')).toBeTruthy();
    });

    it('deve aceitar estilo customizado', () => {
        const { toJSON } = render(
            <TasksNotFound message="Vazio" style={{ marginTop: 20 }} />
        );
        expect(toJSON()).toBeTruthy();
    });
});
