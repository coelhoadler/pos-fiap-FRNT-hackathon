import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { ModalLegendProjects } from './index';
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

describe('ModalLegendProjects', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('deve renderizar quando open é true', () => {
        render(
            <ModalLegendProjects
                open={true}
                onClose={jest.fn()}
                legendContentItems={[
                    { description: 'Item 1' },
                    { description: 'Item 2' },
                ]}
            />
        );
        expect(screen.getByText('Legenda')).toBeTruthy();
    });

    it('deve renderizar os itens da legenda', () => {
        render(
            <ModalLegendProjects
                open={true}
                onClose={jest.fn()}
                legendContentItems={[
                    { description: 'Projeto ativo' },
                    { description: 'Projeto inativo' },
                ]}
            />
        );
        expect(screen.getByText('Projeto ativo')).toBeTruthy();
        expect(screen.getByText('Projeto inativo')).toBeTruthy();
    });

    it('deve renderizar subtítulo quando fornecido', () => {
        render(
            <ModalLegendProjects
                open={true}
                onClose={jest.fn()}
                legendContentItems={[{ description: 'Item' }]}
                subtitleContentItem="Status dos projetos"
            />
        );
        expect(screen.getByText('Status dos projetos')).toBeTruthy();
    });

    it('deve renderizar itens com ícones', () => {
        render(
            <ModalLegendProjects
                open={true}
                onClose={jest.fn()}
                legendContentItems={[
                    {
                        description: 'Com ícone',
                        icon: <Text>icon-test</Text>,
                    },
                ]}
            />
        );
        expect(screen.getByText('Com ícone')).toBeTruthy();
        expect(screen.getByText('icon-test')).toBeTruthy();
    });

    it('deve renderizar sem itens de legenda', () => {
        render(
            <ModalLegendProjects
                open={true}
                onClose={jest.fn()}
            />
        );
        expect(screen.getByText('Legenda')).toBeTruthy();
    });
});
