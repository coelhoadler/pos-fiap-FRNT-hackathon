import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { ThemedView } from './themed-view';
import { Text } from 'react-native';

jest.mock('@/app/hooks/use-theme-color', () => ({
    useThemeColor: jest.fn(() => '#FFFFFF'),
}));

describe('ThemedView', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('deve renderizar os filhos corretamente', () => {
        render(
            <ThemedView>
                <Text>Conteúdo filho</Text>
            </ThemedView>
        );
        expect(screen.getByText('Conteúdo filho')).toBeTruthy();
    });

    it('deve aplicar backgroundColor do tema', () => {
        const { toJSON } = render(<ThemedView testID="view" />);
        const json = toJSON() as any;
        const flatStyle = Array.isArray(json.props.style)
            ? Object.assign({}, ...json.props.style)
            : json.props.style;
        expect(flatStyle.backgroundColor).toBe('#FFFFFF');
    });

    it('deve aceitar estilos customizados via prop style', () => {
        const { toJSON } = render(<ThemedView style={{ padding: 20 }} testID="view" />);
        const json = toJSON() as any;
        const styles = json.props.style;
        expect(styles).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ padding: 20 }),
            ])
        );
    });
});
