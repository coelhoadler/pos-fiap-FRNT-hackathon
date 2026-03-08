import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { ListItemProject } from './index';

jest.mock('@/app/hooks/use-color-scheme', () => ({
    useColorScheme: jest.fn(() => 'light'),
}));

jest.mock('lucide-react-native', () => {
    const { Text } = require('react-native');
    return {
        EllipsisVertical: (props: any) => <Text>ellipsis</Text>,
        Eye: (props: any) => <Text>eye</Text>,
        Pencil: (props: any) => <Text>pencil</Text>,
        Trash: (props: any) => <Text>trash</Text>,
    };
});

jest.mock('../../ui/iconButton', () => {
    const { TouchableOpacity, Text } = require('react-native');
    return {
        IconButton: (props: any) => (
            <TouchableOpacity onPress={props.onPress}>
                {props.icon}
            </TouchableOpacity>
        ),
    };
});

describe('ListItemProject', () => {
    const defaultProps = {
        id: 'proj1',
        nameProject: 'Meu Projeto',
        onPressEdit: jest.fn(),
        onPressDelete: jest.fn(),
        onPressView: jest.fn(),
        onPressMoreOptions: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('deve renderizar o nome do projeto', () => {
        render(<ListItemProject {...defaultProps} />);

        expect(screen.getByText('Meu Projeto')).toBeTruthy();
    });

    it('deve exibir botões de editar e deletar no modo padrão', () => {
        render(<ListItemProject {...defaultProps} />);

        expect(screen.getByText('pencil')).toBeTruthy();
        expect(screen.getByText('trash')).toBeTruthy();
    });

    it('deve ocultar botões de editar e deletar no summaryMode', () => {
        render(<ListItemProject {...defaultProps} summaryMode={true} />);

        expect(screen.queryByText('pencil')).toBeNull();
        expect(screen.queryByText('trash')).toBeNull();
    });

    it('deve exibir botão de visualizar sempre', () => {
        render(<ListItemProject {...defaultProps} />);

        expect(screen.getByText('eye')).toBeTruthy();
    });

    it('deve chamar onPressView ao clicar em visualizar', () => {
        render(<ListItemProject {...defaultProps} />);

        fireEvent.press(screen.getByText('eye'));

        expect(defaultProps.onPressView).toHaveBeenCalledTimes(1);
    });

    it('deve chamar onPressEdit ao clicar em editar', () => {
        render(<ListItemProject {...defaultProps} />);

        fireEvent.press(screen.getByText('pencil'));

        expect(defaultProps.onPressEdit).toHaveBeenCalledTimes(1);
    });

    it('deve chamar onPressDelete ao clicar em deletar', () => {
        render(<ListItemProject {...defaultProps} />);

        fireEvent.press(screen.getByText('trash'));

        expect(defaultProps.onPressDelete).toHaveBeenCalledTimes(1);
    });

    it('deve chamar onPressMoreOptions ao clicar em mais opções', () => {
        render(<ListItemProject {...defaultProps} />);

        fireEvent.press(screen.getByText('ellipsis'));

        expect(defaultProps.onPressMoreOptions).toHaveBeenCalledTimes(1);
    });
});
