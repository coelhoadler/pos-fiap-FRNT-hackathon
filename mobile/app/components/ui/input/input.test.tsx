import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { Input } from './index';

jest.mock('react-native/Libraries/Utilities/useColorScheme', () => ({
    __esModule: true,
    default: jest.fn(() => 'light'),
}));

describe('Input', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('deve renderizar o label corretamente', () => {
        render(<Input text="Nome" value="" onChangeText={() => { }} />);
        expect(screen.getByText('Nome')).toBeTruthy();
    });

    it('deve renderizar o valor no input', () => {
        render(<Input text="Email" value="test@test.com" onChangeText={() => { }} />);
        expect(screen.getByDisplayValue('test@test.com')).toBeTruthy();
    });

    it('deve chamar onChangeText ao digitar', () => {
        const onChangeText = jest.fn();
        render(<Input text="Nome" value="" onChangeText={onChangeText} placeholder="Digite aqui" />);
        fireEvent.changeText(screen.getByPlaceholderText('Digite aqui'), 'Novo valor');
        expect(onChangeText).toHaveBeenCalledWith('Novo valor');
    });

    it('deve usar secureTextEntry quando type é "password"', () => {
        render(<Input text="Senha" value="" type="password" placeholder="Sua senha" onChangeText={() => { }} />);
        const input = screen.getByPlaceholderText('Sua senha');
        expect(input.props.secureTextEntry).toBe(true);
    });

    it('deve usar keyboardType numeric quando type é "numeric"', () => {
        render(<Input text="Idade" value="" type="numeric" placeholder="Sua idade" onChangeText={() => { }} />);
        const input = screen.getByPlaceholderText('Sua idade');
        expect(input.props.keyboardType).toBe('numeric');
    });

    it('deve usar keyboardType email-address quando type é "email"', () => {
        render(<Input text="Email" value="" type="email" placeholder="Seu email" onChangeText={() => { }} />);
        const input = screen.getByPlaceholderText('Seu email');
        expect(input.props.keyboardType).toBe('email-address');
    });

    it('deve usar keyboardType default quando type é "text"', () => {
        render(<Input text="Texto" value="" type="text" placeholder="Texto livre" onChangeText={() => { }} />);
        const input = screen.getByPlaceholderText('Texto livre');
        expect(input.props.keyboardType).toBe('default');
    });
});
