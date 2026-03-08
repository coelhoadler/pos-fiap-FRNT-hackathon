import { useColorScheme } from './use-color-scheme';
import { useColorScheme as RNUseColorScheme } from 'react-native';

describe('useColorScheme', () => {
    it('deve ser a mesma função que useColorScheme do react-native', () => {
        expect(useColorScheme).toBe(RNUseColorScheme);
    });
});
