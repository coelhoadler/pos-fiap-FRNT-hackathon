import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { TextArea } from './index';

jest.mock('react-native/Libraries/Utilities/useColorScheme', () => ({
    __esModule: true,
    default: jest.fn(() => 'light'),
}));

describe('TextArea', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('deve renderizar o label corretamente', () => {
        render(<TextArea text="Descrição" value="" onChangeText={() => { }} />);
        expect(screen.getByText('Descrição')).toBeTruthy();
    });

    it('deve renderizar o valor no textarea', () => {
        render(<TextArea text="Obs" value="Conteúdo texto" onChangeText={() => { }} />);
        expect(screen.getByDisplayValue('Conteúdo texto')).toBeTruthy();
    });

    it('deve chamar onChangeText ao digitar', () => {
        const onChangeText = jest.fn();
        render(<TextArea text="Descrição" value="" onChangeText={onChangeText} placeholder="Digite aqui" />);
        fireEvent.changeText(screen.getByPlaceholderText('Digite aqui'), 'Novo texto');
        expect(onChangeText).toHaveBeenCalledWith('Novo texto');
    });

    it('deve ser multiline', () => {
        render(<TextArea text="Notas" value="" placeholder="Escreva" onChangeText={() => { }} />);
        const input = screen.getByPlaceholderText('Escreva');
        expect(input.props.multiline).toBe(true);
    });

    it('deve usar numberOfLines padrão de 4', () => {
        render(<TextArea text="Notas" value="" placeholder="Escreva" onChangeText={() => { }} />);
        const input = screen.getByPlaceholderText('Escreva');
        expect(input.props.numberOfLines).toBe(4);
    });

    it('deve usar numberOfLines customizado', () => {
        render(<TextArea text="Notas" value="" numberOfLines={8} placeholder="Escreva" onChangeText={() => { }} />);
        const input = screen.getByPlaceholderText('Escreva');
        expect(input.props.numberOfLines).toBe(8);
    });
});
