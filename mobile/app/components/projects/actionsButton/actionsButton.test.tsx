import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { ActionsButtonsProjects } from './index';

jest.mock('@/app/hooks/use-color-scheme', () => ({
    useColorScheme: jest.fn(() => 'light'),
}));

jest.mock('expo-router', () => ({
    router: {
        push: jest.fn(),
    },
}));

jest.mock('lucide-react-native', () => {
    const { Text } = require('react-native');
    return {
        CirclePlus: (props: any) => <Text>circle-plus</Text>,
        Info: (props: any) => <Text>info</Text>,
        Settings: (props: any) => <Text>settings</Text>,
    };
});

jest.mock('../../ui/actionsButton', () => {
    const { View } = require('react-native');
    return {
        ActionsButtons: (props: any) => <View testID="actions-wrapper">{props.children}</View>,
    };
});

jest.mock('../../ui/iconButton', () => {
    const { TouchableOpacity } = require('react-native');
    return {
        IconButton: (props: any) => (
            <TouchableOpacity onPress={props.onPress}>{props.icon}</TouchableOpacity>
        ),
    };
});

describe('ActionsButtonsProjects', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('deve renderizar todos os botões no modo padrão com pathAdd', () => {
        render(
            <ActionsButtonsProjects
                pathAdd="/add-project"
                openModal={jest.fn()}
            />
        );

        expect(screen.getByText('circle-plus')).toBeTruthy();
        expect(screen.getByText('info')).toBeTruthy();
    });

    it('deve renderizar apenas botão de informação no modo onlyInformationButton', () => {
        render(
            <ActionsButtonsProjects
                onlyInformationButton={true}
                openModal={jest.fn()}
            />
        );

        expect(screen.getByText('info')).toBeTruthy();
        expect(screen.queryByText('circle-plus')).toBeNull();
    });

    it('deve renderizar botão de settings quando hasSettingItem é true', () => {
        render(
            <ActionsButtonsProjects
                hasSettingItem={true}
                onPressSetting={jest.fn()}
                openModal={jest.fn()}
            />
        );

        expect(screen.getByText('settings')).toBeTruthy();
    });

    it('deve chamar openModal ao pressionar botão info', () => {
        const mockOpenModal = jest.fn();
        render(
            <ActionsButtonsProjects
                onlyInformationButton={true}
                openModal={mockOpenModal}
            />
        );

        fireEvent.press(screen.getByText('info'));

        expect(mockOpenModal).toHaveBeenCalledTimes(1);
    });

    it('deve navegar ao pressionar botão adicionar', () => {
        const { router } = require('expo-router');
        render(
            <ActionsButtonsProjects
                pathAdd="/projects/add"
                openModal={jest.fn()}
            />
        );

        fireEvent.press(screen.getByText('circle-plus'));

        expect(router.push).toHaveBeenCalledWith('/projects/add');
    });

    it('deve chamar onPressSetting ao pressionar botão settings', () => {
        const mockOnPressSetting = jest.fn();
        render(
            <ActionsButtonsProjects
                hasSettingItem={true}
                onPressSetting={mockOnPressSetting}
                openModal={jest.fn()}
            />
        );

        fireEvent.press(screen.getByText('settings'));

        expect(mockOnPressSetting).toHaveBeenCalledTimes(1);
    });
});
