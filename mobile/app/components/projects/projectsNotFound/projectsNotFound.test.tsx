import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { ProjectsNotFound } from './index';

jest.mock('@/app/hooks/use-color-scheme', () => ({
    useColorScheme: jest.fn(() => 'light'),
}));

jest.mock('lucide-react-native', () => {
    const { Text } = require('react-native');
    return {
        SearchX: () => <Text>search-x-icon</Text>,
        CirclePlus: () => <Text>circle-plus-icon</Text>,
    };
});

describe('ProjectsNotFound', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('deve renderizar a mensagem informada', () => {
        render(
            <ProjectsNotFound
                message="Nenhum projeto encontrado"
                text="Criar projeto"
                onPress={() => {}}
            />
        );
        expect(screen.getByText('Nenhum projeto encontrado')).toBeTruthy();
    });

    it('deve renderizar o texto do botão de adicionar', () => {
        render(
            <ProjectsNotFound
                message="Sem projetos"
                text="Novo projeto"
                onPress={() => {}}
            />
        );
        expect(screen.getByText('Novo projeto')).toBeTruthy();
    });

    it('deve chamar onPress ao pressionar o botão de adicionar', () => {
        const onPress = jest.fn();
        render(
            <ProjectsNotFound
                message="Sem projetos"
                text="Criar projeto"
                onPress={onPress}
            />
        );
        fireEvent.press(screen.getByText('Criar projeto'));
        expect(onPress).toHaveBeenCalledTimes(1);
    });

    it('deve renderizar os ícones', () => {
        render(
            <ProjectsNotFound
                message="Vazio"
                text="Adicionar"
                onPress={() => {}}
            />
        );
        expect(screen.getByText('search-x-icon')).toBeTruthy();
        expect(screen.getByText('circle-plus-icon')).toBeTruthy();
    });
});
