import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { ToggleItem } from './toggleItem';

jest.mock('react-native/Libraries/Utilities/useColorScheme', () => ({
    __esModule: true,
    default: jest.fn(() => 'light'),
}));

describe('ToggleItem', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('deve renderizar corretamente', () => {
        render(<ToggleItem id="toggle1" value={false} onChange={() => { }} />);
        const switches = screen.getAllByRole('switch');
        expect(switches.length).toBeGreaterThanOrEqual(1);
    });

    it('deve chamar onChange com valor invertido ao pressionar', () => {
        const onChange = jest.fn();
        render(<ToggleItem id="toggle1" value={false} onChange={onChange} />);
        // Pressable é o primeiro elemento com role switch
        const switches = screen.getAllByRole('switch');
        fireEvent.press(switches[0]);
        expect(onChange).toHaveBeenCalledWith(true);
    });

    it('não deve chamar onChange quando disabled', () => {
        const onChange = jest.fn();
        render(<ToggleItem id="toggle2" value={false} onChange={onChange} disabled />);
        const switches = screen.getAllByRole('switch');
        fireEvent.press(switches[0]);
        expect(onChange).not.toHaveBeenCalled();
    });

    it('deve renderizar com valor true', () => {
        render(<ToggleItem id="toggle3" value={true} onChange={() => { }} />);
        const switches = screen.getAllByRole('switch');
        // O Pressable tem accessibilityState checked
        const checkedSwitch = switches.find(s => s.props.accessibilityState?.checked === true);
        expect(checkedSwitch).toBeTruthy();
    });
});
