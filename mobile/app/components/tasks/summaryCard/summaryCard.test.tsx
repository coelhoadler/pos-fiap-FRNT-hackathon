import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { SummaryCard } from './index';

jest.mock('@/app/hooks/use-color-scheme', () => ({
    useColorScheme: jest.fn(() => 'light'),
}));

jest.mock('../taskTimer/task-timer-context', () => ({
    useTaskTimer: jest.fn(() => ({ isRunning: false })),
}));

jest.mock('lucide-react-native', () => {
    const { Text } = require('react-native');
    return {
        Calendar: () => <Text>calendar-icon</Text>,
        Eye: () => <Text>eye-icon</Text>,
        Pencil: () => <Text>pencil-icon</Text>,
        Play: () => <Text>play-icon</Text>,
        Timer: () => <Text>timer-icon</Text>,
        Trash2: () => <Text>trash-icon</Text>,
        User: () => <Text>user-icon</Text>,
    };
});

describe('SummaryCard', () => {
    const defaultProps = {
        title: 'Minha Task',
        description: 'Descrição da task',
        author: 'João',
        date: '07/03/2026',
        onPressView: jest.fn(),
        onPressDelete: jest.fn(),
        onPressEdit: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('deve renderizar o título', () => {
        render(<SummaryCard {...defaultProps} />);
        expect(screen.getByText('Minha Task')).toBeTruthy();
    });

    it('deve renderizar a descrição', () => {
        render(<SummaryCard {...defaultProps} />);
        expect(screen.getByText('Descrição da task')).toBeTruthy();
    });

    it('deve renderizar o autor', () => {
        render(<SummaryCard {...defaultProps} />);
        expect(screen.getByText('João')).toBeTruthy();
    });

    it('deve renderizar a data', () => {
        render(<SummaryCard {...defaultProps} />);
        expect(screen.getByText('07/03/2026')).toBeTruthy();
    });

    it('deve renderizar o tempo quando fornecido', () => {
        render(<SummaryCard {...defaultProps} time="2h" />);
        expect(screen.getByText('2h')).toBeTruthy();
    });

    it('deve chamar onPressDelete ao pressionar o ícone de deletar', () => {
        const onPressDelete = jest.fn();
        render(<SummaryCard {...defaultProps} onPressDelete={onPressDelete} />);
        fireEvent.press(screen.getByText('trash-icon'));
        expect(onPressDelete).toHaveBeenCalledTimes(1);
    });

    it('deve chamar onPressEdit ao pressionar o ícone de editar', () => {
        const onPressEdit = jest.fn();
        render(<SummaryCard {...defaultProps} onPressEdit={onPressEdit} />);
        fireEvent.press(screen.getByText('pencil-icon'));
        expect(onPressEdit).toHaveBeenCalledTimes(1);
    });

    it('deve chamar onPressView ao pressionar o ícone de visualizar', () => {
        const onPressView = jest.fn();
        render(<SummaryCard {...defaultProps} onPressView={onPressView} />);
        fireEvent.press(screen.getByText('eye-icon'));
        expect(onPressView).toHaveBeenCalledTimes(1);
    });

    it('deve renderizar botão play quando onPressPlay é fornecido e isRunning é false', () => {
        render(<SummaryCard {...defaultProps} onPressPlay={() => {}} />);
        expect(screen.getByText('play-icon')).toBeTruthy();
    });

    it('não deve renderizar descrição/body quando summaryMode é true', () => {
        render(<SummaryCard {...defaultProps} summaryMode />);
        expect(screen.queryByText('Descrição da task')).toBeNull();
    });
});
