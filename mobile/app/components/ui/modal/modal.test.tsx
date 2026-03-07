import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { Modal } from './index';

jest.mock('react-native/Libraries/Utilities/useColorScheme', () => ({
    __esModule: true,
    default: jest.fn(() => 'light'),
}));

jest.mock('@/app/hooks/use-theme-color', () => ({
    useThemeColor: jest.fn(() => '#FFFFFF'),
}));

jest.mock('lucide-react-native', () => {
    const { Text } = require('react-native');
    return {
        X: (props: any) => <Text>X-icon</Text>,
    };
});

describe('Modal', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('deve renderizar o texto do modal quando open é true', () => {
        render(
            <Modal
                contentType="feedbackMessage"
                text="Operação realizada com sucesso"
                open={true}
                onClose={() => {}}
                onPress={() => {}}
            />
        );
        expect(screen.getByText('Operação realizada com sucesso')).toBeTruthy();
    });

    it('deve renderizar botão OK para feedbackMessage', () => {
        render(
            <Modal
                contentType="feedbackMessage"
                text="Mensagem"
                open={true}
                onClose={() => {}}
                onPress={() => {}}
            />
        );
        expect(screen.getByText('OK')).toBeTruthy();
    });

    it('deve renderizar botões Não e Sim para withActions', () => {
        render(
            <Modal
                contentType="withActions"
                text="Confirmar ação?"
                open={true}
                onClose={() => {}}
                onPressActionA={() => {}}
                onPressActionB={() => {}}
            />
        );
        expect(screen.getByText('Não')).toBeTruthy();
        expect(screen.getByText('Sim')).toBeTruthy();
    });

    it('deve chamar onPressActionA ao clicar em Não', () => {
        const onPressA = jest.fn();
        render(
            <Modal
                contentType="withActions"
                text="Confirmar?"
                open={true}
                onClose={() => {}}
                onPressActionA={onPressA}
                onPressActionB={() => {}}
            />
        );
        fireEvent.press(screen.getByText('Não'));
        expect(onPressA).toHaveBeenCalledTimes(1);
    });

    it('deve chamar onPressActionB ao clicar em Sim', () => {
        const onPressB = jest.fn();
        render(
            <Modal
                contentType="withActions"
                text="Confirmar?"
                open={true}
                onClose={() => {}}
                onPressActionA={() => {}}
                onPressActionB={onPressB}
            />
        );
        fireEvent.press(screen.getByText('Sim'));
        expect(onPressB).toHaveBeenCalledTimes(1);
    });

    it('deve renderizar loading quando contentType é "loading"', () => {
        render(
            <Modal
                contentType="loading"
                open={true}
                onClose={() => {}}
            />
        );
        expect(screen.getByText('Carregando...')).toBeTruthy();
    });

    it('deve renderizar texto de loading customizado', () => {
        render(
            <Modal
                contentType="loading"
                textLoading="Processando..."
                open={true}
                onClose={() => {}}
            />
        );
        expect(screen.getByText('Processando...')).toBeTruthy();
    });

    it('deve usar textos customizados nos botões de ação', () => {
        render(
            <Modal
                contentType="withActions"
                text="Ação"
                open={true}
                textButtonActionA="Cancelar"
                textButtonActionB="Confirmar"
                onClose={() => {}}
                onPressActionA={() => {}}
                onPressActionB={() => {}}
            />
        );
        expect(screen.getByText('Cancelar')).toBeTruthy();
        expect(screen.getByText('Confirmar')).toBeTruthy();
    });
});
