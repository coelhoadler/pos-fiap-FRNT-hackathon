import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { ModalLegendTasks } from './index';
import { Text } from 'react-native';

jest.mock('@/app/hooks/use-color-scheme', () => ({
    useColorScheme: jest.fn(() => 'light'),
}));

jest.mock('@/app/hooks/use-theme-color', () => ({
    useThemeColor: jest.fn(() => '#FFFFFF'),
}));

jest.mock('react-native/Libraries/Utilities/useColorScheme', () => ({
    __esModule: true,
    default: jest.fn(() => 'light'),
}));

jest.mock('lucide-react-native', () => {
    const { Text } = require('react-native');
    return {
        X: (props: any) => <Text>X-icon</Text>,
    };
});

describe('ModalLegendTasks', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('deve renderizar quando open é true', () => {
        render(
            <ModalLegendTasks
                open={true}
                onClose={jest.fn()}
                legendContentItems={[
                    { description: 'Tarefa pendente' },
                ]}
            />
        );
        expect(screen.getByText('Legenda')).toBeTruthy();
    });

    it('deve renderizar os itens da legenda de tarefas', () => {
        render(
            <ModalLegendTasks
                open={true}
                onClose={jest.fn()}
                legendContentItems={[
                    { description: 'Pendente' },
                    { description: 'Em andamento' },
                    { description: 'Concluída' },
                ]}
            />
        );
        expect(screen.getByText('Pendente')).toBeTruthy();
        expect(screen.getByText('Em andamento')).toBeTruthy();
        expect(screen.getByText('Concluída')).toBeTruthy();
    });

    it('deve renderizar subtítulo quando fornecido', () => {
        render(
            <ModalLegendTasks
                open={true}
                onClose={jest.fn()}
                legendContentItems={[{ description: 'Item' }]}
                subtitleContentItem="Status das tarefas"
            />
        );
        expect(screen.getByText('Status das tarefas')).toBeTruthy();
    });

    it('deve renderizar itens com ícones', () => {
        render(
            <ModalLegendTasks
                open={true}
                onClose={jest.fn()}
                legendContentItems={[
                    {
                        description: 'Tarefa com ícone',
                        icon: <Text>task-icon</Text>,
                    },
                ]}
            />
        );
        expect(screen.getByText('Tarefa com ícone')).toBeTruthy();
        expect(screen.getByText('task-icon')).toBeTruthy();
    });

    it('deve renderizar sem itens de legenda', () => {
        render(
            <ModalLegendTasks
                open={true}
                onClose={jest.fn()}
            />
        );
        expect(screen.getByText('Legenda')).toBeTruthy();
    });
});
