import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { Accordion } from './index';
import { Text } from 'react-native';

jest.mock('@/app/hooks/use-color-scheme', () => ({
    useColorScheme: jest.fn(() => 'light'),
}));

jest.mock('lucide-react-native', () => {
    const { Text } = require('react-native');
    return {
        ChevronDown: () => <Text>chevron-down</Text>,
        ChevronUp: () => <Text>chevron-up</Text>,
    };
});

describe('Accordion', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('deve renderizar o título corretamente', () => {
        render(
            <Accordion title="Seção 1">
                <Text>Conteúdo</Text>
            </Accordion>
        );
        expect(screen.getByText('Seção 1')).toBeTruthy();
    });

    it('não deve exibir o conteúdo por padrão (initialMode=false)', () => {
        render(
            <Accordion title="Seção">
                <Text>Conteúdo oculto</Text>
            </Accordion>
        );
        expect(screen.queryByText('Conteúdo oculto')).toBeNull();
    });

    it('deve exibir o conteúdo quando initialMode é true', () => {
        render(
            <Accordion title="Seção" initialMode={true}>
                <Text>Conteúdo visível</Text>
            </Accordion>
        );
        expect(screen.getByText('Conteúdo visível')).toBeTruthy();
    });

    it('deve expandir ao pressionar o header', () => {
        render(
            <Accordion title="Seção">
                <Text>Conteúdo expandido</Text>
            </Accordion>
        );

        fireEvent.press(screen.getByText('Seção'));
        expect(screen.getByText('Conteúdo expandido')).toBeTruthy();
    });

    it('deve colapsar ao pressionar o header novamente', () => {
        render(
            <Accordion title="Seção" initialMode={true}>
                <Text>Conteúdo toggle</Text>
            </Accordion>
        );

        // Inicialmente visível
        expect(screen.getByText('Conteúdo toggle')).toBeTruthy();

        // Pressiona para colapsar
        fireEvent.press(screen.getByText('Seção'));
        expect(screen.queryByText('Conteúdo toggle')).toBeNull();
    });

    it('deve exibir ícone ChevronDown quando colapsado', () => {
        render(
            <Accordion title="Seção">
                <Text>Conteúdo</Text>
            </Accordion>
        );
        expect(screen.getByText('chevron-down')).toBeTruthy();
    });

    it('deve exibir ícone ChevronUp quando expandido', () => {
        render(
            <Accordion title="Seção" initialMode={true}>
                <Text>Conteúdo</Text>
            </Accordion>
        );
        expect(screen.getByText('chevron-up')).toBeTruthy();
    });
});
