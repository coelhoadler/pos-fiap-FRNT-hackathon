import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { HapticTab } from './haptic-tab';

jest.mock('expo-haptics', () => ({
    impactAsync: jest.fn(),
    ImpactFeedbackStyle: { Light: 'Light' },
}));

jest.mock('@react-navigation/elements', () => {
    const { TouchableOpacity } = require('react-native');
    return {
        PlatformPressable: (props: any) => (
            <TouchableOpacity
                testID="pressable"
                onPress={props.onPress}
                onPressIn={props.onPressIn}
            >
                {props.children}
            </TouchableOpacity>
        ),
    };
});

describe('HapticTab', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('deve renderizar sem erros', () => {
        render(<HapticTab onPress={jest.fn()} accessibilityState={{}} />);

        expect(screen.getByTestId('pressable')).toBeTruthy();
    });

    it('deve chamar onPressIn quando pressionado', () => {
        const mockOnPressIn = jest.fn();
        render(<HapticTab onPress={jest.fn()} onPressIn={mockOnPressIn} accessibilityState={{}} />);

        fireEvent(screen.getByTestId('pressable'), 'pressIn');

        expect(mockOnPressIn).toHaveBeenCalled();
    });

    it('deve disparar haptic feedback no iOS ao pressionar', () => {
        const originalEnv = process.env.EXPO_OS;
        process.env.EXPO_OS = 'ios';

        render(<HapticTab onPress={jest.fn()} accessibilityState={{}} />);

        fireEvent(screen.getByTestId('pressable'), 'pressIn');

        const Haptics = require('expo-haptics');
        expect(Haptics.impactAsync).toHaveBeenCalledWith('Light');

        process.env.EXPO_OS = originalEnv;
    });
});
