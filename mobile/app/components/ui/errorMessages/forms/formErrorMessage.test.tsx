import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { FormErrorMessage } from './index';

jest.mock('react-native/Libraries/Utilities/useColorScheme', () => ({
    __esModule: true,
    default: jest.fn(() => 'light'),
}));

describe('FormErrorMessage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('deve renderizar a mensagem de erro', () => {
        render(<FormErrorMessage message="Campo obrigatório" />);
        expect(screen.getByText('Campo obrigatório')).toBeTruthy();
    });

    it('deve renderizar mensagens diferentes', () => {
        render(<FormErrorMessage message="Email inválido" />);
        expect(screen.getByText('Email inválido')).toBeTruthy();
    });

    it('deve aceitar estilos customizados', () => {
        const { toJSON } = render(
            <FormErrorMessage message="Erro" style={{ marginTop: 10 }} />
        );
        expect(toJSON()).toBeTruthy();
    });
});
