import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { ThemedText } from './themed-text';

jest.mock('@/app/hooks/use-theme-color', () => ({
    useThemeColor: jest.fn(() => '#000000'),
}));

describe('ThemedText', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('deve renderizar o texto corretamente', () => {
        render(<ThemedText>Olá Mundo</ThemedText>);
        expect(screen.getByText('Olá Mundo')).toBeTruthy();
    });

    it('deve aplicar estilo padrão quando type não é informado', () => {
        render(<ThemedText>Texto padrão</ThemedText>);
        const textElement = screen.getByText('Texto padrão');
        expect(textElement).toBeTruthy();
    });

    it('deve aplicar estilo de título quando type é "title"', () => {
        render(<ThemedText type="title">Título</ThemedText>);
        const textElement = screen.getByText('Título');
        expect(textElement.props.style).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ fontSize: 32, fontWeight: 'bold' }),
            ])
        );
    });

    it('deve aplicar estilo de subtitle quando type é "subtitle"', () => {
        render(<ThemedText type="subtitle">Subtítulo</ThemedText>);
        const textElement = screen.getByText('Subtítulo');
        expect(textElement.props.style).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ fontSize: 20, fontWeight: 'bold' }),
            ])
        );
    });

    it('deve aplicar estilo de link quando type é "link"', () => {
        render(<ThemedText type="link">Link</ThemedText>);
        const textElement = screen.getByText('Link');
        expect(textElement.props.style).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ color: '#0a7ea4' }),
            ])
        );
    });

    it('deve aceitar estilos customizados via prop style', () => {
        render(<ThemedText style={{ marginTop: 10 }}>Custom</ThemedText>);
        const textElement = screen.getByText('Custom');
        expect(textElement.props.style).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ marginTop: 10 }),
            ])
        );
    });
});
