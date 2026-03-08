import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { TaskTimerWidget } from './task-timer-widget';

const mockUseTaskTimer = jest.fn();

jest.mock('./task-timer-context', () => ({
    useTaskTimer: () => mockUseTaskTimer(),
}));

jest.mock('lucide-react-native', () => {
    const { Text } = require('react-native');
    return {
        Pause: (props: any) => <Text>pause-icon</Text>,
        Play: (props: any) => <Text>play-icon</Text>,
        X: (props: any) => <Text>x-icon</Text>,
    };
});

describe('TaskTimerWidget', () => {
    const defaultTimerState = {
        activeTask: { id: '1', nome: 'Minha Tarefa', tempoExecucao: '1h 0min' },
        timeLeftSeconds: 1800,
        totalSeconds: 3600,
        isRunning: true,
        pauseTimer: jest.fn(),
        resumeTimer: jest.fn(),
        stopTimer: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
        mockUseTaskTimer.mockReturnValue(defaultTimerState);
    });

    it('não deve renderizar quando não há tarefa ativa', () => {
        mockUseTaskTimer.mockReturnValue({
            ...defaultTimerState,
            activeTask: null,
        });
        const { toJSON } = render(<TaskTimerWidget />);
        expect(toJSON()).toBeNull();
    });

    it('deve renderizar o nome da tarefa', () => {
        render(<TaskTimerWidget />);
        expect(screen.getByText('Tarefa: Minha Tarefa')).toBeTruthy();
    });

    it('deve exibir o tempo formatado corretamente', () => {
        render(<TaskTimerWidget />);
        expect(screen.getByText('30:00')).toBeTruthy();
    });

    it('deve exibir tempo com horas quando necessário', () => {
        mockUseTaskTimer.mockReturnValue({
            ...defaultTimerState,
            timeLeftSeconds: 3661, // 1h 1min 1s
        });
        render(<TaskTimerWidget />);
        expect(screen.getByText('01:01:01')).toBeTruthy();
    });

    it('deve exibir ícone de pausa quando o timer está rodando', () => {
        render(<TaskTimerWidget />);
        expect(screen.getByText('pause-icon')).toBeTruthy();
    });

    it('deve exibir ícone de play quando o timer está pausado', () => {
        mockUseTaskTimer.mockReturnValue({
            ...defaultTimerState,
            isRunning: false,
            timeLeftSeconds: 1800,
        });
        render(<TaskTimerWidget />);
        expect(screen.getByText('play-icon')).toBeTruthy();
    });

    it('deve chamar pauseTimer ao pressionar pausa', () => {
        const pauseTimer = jest.fn();
        mockUseTaskTimer.mockReturnValue({
            ...defaultTimerState,
            pauseTimer,
        });
        render(<TaskTimerWidget />);
        fireEvent.press(screen.getByText('pause-icon'));
        expect(pauseTimer).toHaveBeenCalledTimes(1);
    });

    it('deve chamar resumeTimer ao pressionar play', () => {
        const resumeTimer = jest.fn();
        mockUseTaskTimer.mockReturnValue({
            ...defaultTimerState,
            isRunning: false,
            timeLeftSeconds: 1800,
            resumeTimer,
        });
        render(<TaskTimerWidget />);
        fireEvent.press(screen.getByText('play-icon'));
        expect(resumeTimer).toHaveBeenCalledTimes(1);
    });

    it('deve chamar stopTimer ao pressionar fechar', () => {
        const stopTimer = jest.fn();
        mockUseTaskTimer.mockReturnValue({
            ...defaultTimerState,
            stopTimer,
        });
        render(<TaskTimerWidget />);
        fireEvent.press(screen.getByText('x-icon'));
        expect(stopTimer).toHaveBeenCalledTimes(1);
    });

    it('deve exibir "Concluído!" quando o timer termina', () => {
        mockUseTaskTimer.mockReturnValue({
            ...defaultTimerState,
            timeLeftSeconds: 0,
            isRunning: false,
        });
        render(<TaskTimerWidget />);
        expect(screen.getByText('Concluído!')).toBeTruthy();
    });

    it('não deve exibir botão de play/pause quando concluído', () => {
        mockUseTaskTimer.mockReturnValue({
            ...defaultTimerState,
            timeLeftSeconds: 0,
            isRunning: false,
        });
        render(<TaskTimerWidget />);
        expect(screen.queryByText('pause-icon')).toBeNull();
        expect(screen.queryByText('play-icon')).toBeNull();
    });

    it('deve exibir botão fechar mesmo quando concluído', () => {
        mockUseTaskTimer.mockReturnValue({
            ...defaultTimerState,
            timeLeftSeconds: 0,
            isRunning: false,
        });
        render(<TaskTimerWidget />);
        expect(screen.getByText('x-icon')).toBeTruthy();
    });
});
