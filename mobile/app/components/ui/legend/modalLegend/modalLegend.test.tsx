import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';
import { ModalLegend } from './index';

jest.mock('@/app/hooks/use-color-scheme', () => ({
    useColorScheme: jest.fn(() => 'light'),
}));

jest.mock('../../modal', () => {
    const { View } = require('react-native');
    return {
        Modal: (props: any) => (
            props.open ? <View testID="modal-wrapper">{props.children}</View> : null
        ),
    };
});

describe('ModalLegend', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('deve renderizar o título "Legenda" quando aberto', () => {
        render(
            <ModalLegend open={true} onClose={jest.fn()}>
                <Text>Conteúdo</Text>
            </ModalLegend>
        );

        expect(screen.getByText('Legenda')).toBeTruthy();
    });

    it('deve renderizar os children quando aberto', () => {
        render(
            <ModalLegend open={true} onClose={jest.fn()}>
                <Text>Conteúdo da legenda</Text>
            </ModalLegend>
        );

        expect(screen.getByText('Conteúdo da legenda')).toBeTruthy();
    });

    it('não deve renderizar quando fechado', () => {
        render(
            <ModalLegend open={false} onClose={jest.fn()}>
                <Text>Conteúdo escondido</Text>
            </ModalLegend>
        );

        expect(screen.queryByText('Legenda')).toBeNull();
    });
});
