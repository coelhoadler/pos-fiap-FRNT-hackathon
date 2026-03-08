import React from 'react';
import { render, screen } from '@testing-library/react-native';

// O jest-expo resolve a versão iOS do componente.
// Mockamos expo-symbols para testar o componente iOS.
jest.mock('expo-symbols', () => {
    const { View } = require('react-native');
    return {
        SymbolView: (props: any) => <View testID="symbol-view" />,
    };
});

import { IconSymbol } from './icon-symbol';

describe('IconSymbol', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('deve renderizar o ícone corretamente', () => {
        render(<IconSymbol name="house.fill" size={24} color="#000" />);

        expect(screen.getByTestId('symbol-view')).toBeTruthy();
    });

    it('deve renderizar sem erros com diferentes nomes de ícone', () => {
        render(<IconSymbol name="line.3.horizontal" size={28} color="#333" />);

        expect(screen.getByTestId('symbol-view')).toBeTruthy();
    });

    it('deve renderizar com tamanho padrão', () => {
        render(<IconSymbol name="gearshape.fill" color="#000" />);

        expect(screen.getByTestId('symbol-view')).toBeTruthy();
    });
});
