import React from 'react';
import { render, screen } from '@testing-library/react-native';
import ParallaxScrollView from './parallax-scroll-view';
import { Text } from 'react-native';

jest.mock('@/app/hooks/use-color-scheme', () => ({
    useColorScheme: jest.fn(() => 'light'),
}));

jest.mock('@/app/hooks/use-theme-color', () => ({
    useThemeColor: jest.fn(() => '#FFFFFF'),
}));

jest.mock('react-native-reanimated', () => {
    const RN = require('react-native');
    const ReactMock = require('react');
    const MockScrollView = ReactMock.forwardRef((props: any, ref: any) => (
        <RN.ScrollView ref={ref} {...props}>{props.children}</RN.ScrollView>
    ));
    const MockView = (props: any) => <RN.View {...props}>{props.children}</RN.View>;

    return {
        __esModule: true,
        default: { ScrollView: MockScrollView, View: MockView },
        interpolate: jest.fn(() => 0),
        useAnimatedRef: jest.fn(() => ({ current: null })),
        useAnimatedStyle: jest.fn(() => ({})),
        useScrollOffset: jest.fn(() => ({ value: 0 })),
    };
});

jest.mock('@/app/components/themed-view', () => {
    const { View } = require('react-native');
    return {
        ThemedView: (props: any) => <View {...props}>{props.children}</View>,
    };
});

describe('ParallaxScrollView', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('deve renderizar o conteúdo filho', () => {
        render(
            <ParallaxScrollView
                headerImage={<Text>Header Image</Text>}
                headerBackgroundColor={{ dark: '#000', light: '#FFF' }}
            >
                <Text>Conteúdo interno</Text>
            </ParallaxScrollView>
        );
        expect(screen.getByText('Conteúdo interno')).toBeTruthy();
    });

    it('deve renderizar a imagem do header', () => {
        render(
            <ParallaxScrollView
                headerImage={<Text>Imagem Header</Text>}
                headerBackgroundColor={{ dark: '#000', light: '#FFF' }}
            >
                <Text>Conteúdo</Text>
            </ParallaxScrollView>
        );
        expect(screen.getByText('Imagem Header')).toBeTruthy();
    });

    it('deve renderizar múltiplos filhos', () => {
        render(
            <ParallaxScrollView
                headerImage={<Text>Header</Text>}
                headerBackgroundColor={{ dark: '#000', light: '#FFF' }}
            >
                <Text>Filho 1</Text>
                <Text>Filho 2</Text>
                <Text>Filho 3</Text>
            </ParallaxScrollView>
        );
        expect(screen.getByText('Filho 1')).toBeTruthy();
        expect(screen.getByText('Filho 2')).toBeTruthy();
        expect(screen.getByText('Filho 3')).toBeTruthy();
    });

    it('deve renderizar sem erros com cores diferentes', () => {
        const { toJSON } = render(
            <ParallaxScrollView
                headerImage={<Text>Header</Text>}
                headerBackgroundColor={{ dark: '#1a1a2e', light: '#e8e8e8' }}
            >
                <Text>Conteúdo</Text>
            </ParallaxScrollView>
        );
        expect(toJSON()).toBeTruthy();
    });
});
