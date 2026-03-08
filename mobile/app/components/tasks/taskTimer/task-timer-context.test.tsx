import React from 'react';
import { render, screen, act } from '@testing-library/react-native';
import { Text } from 'react-native';
import { TaskTimerProvider, useTaskTimer, ActiveTask } from './task-timer-context';

jest.mock('@/app/services/soundService', () => ({
    playDoneSound: jest.fn(),
}));

const { playDoneSound } = require('@/app/services/soundService');

function TestConsumer() {
    const {
        activeTask,
        timeLeftSeconds,
        totalSeconds,
        isRunning,
        startTimer,
        pauseTimer,
        resumeTimer,
        stopTimer,
    } = useTaskTimer();

    return (
        <>
            <Text testID="active-task">{activeTask?.nome ?? 'nenhuma'}</Text>
            <Text testID="time-left">{timeLeftSeconds}</Text>
            <Text testID="total">{totalSeconds}</Text>
            <Text testID="running">{isRunning ? 'sim' : 'não'}</Text>
            <Text
                testID="start"
                onPress={() =>
                    startTimer({ id: '1', nome: 'Tarefa Teste', tempoExecucao: '0h 5min' })
                }
            />
            <Text testID="pause" onPress={pauseTimer} />
            <Text testID="resume" onPress={resumeTimer} />
            <Text testID="stop" onPress={stopTimer} />
            <Text
                testID="start-hours"
                onPress={() =>
                    startTimer({ id: '2', nome: 'Tarefa Longa', tempoExecucao: '2h 30min' })
                }
            />
            <Text
                testID="start-number"
                onPress={() =>
                    startTimer({ id: '3', nome: 'Tarefa Num', tempoExecucao: '10' })
                }
            />
        </>
    );
}

function renderWithProvider() {
    return render(
        <TaskTimerProvider>
            <TestConsumer />
        </TaskTimerProvider>
    );
}

describe('TaskTimerContext', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('deve iniciar sem tarefa ativa', () => {
        renderWithProvider();
        expect(screen.getByTestId('active-task').props.children).toBe('nenhuma');
        expect(screen.getByTestId('running').props.children).toBe('não');
        expect(screen.getByTestId('time-left').props.children).toBe(0);
    });

    it('deve iniciar timer com tarefa em minutos', () => {
        renderWithProvider();
        act(() => {
            screen.getByTestId('start').props.onPress();
        });
        expect(screen.getByTestId('active-task').props.children).toBe('Tarefa Teste');
        expect(screen.getByTestId('total').props.children).toBe(300); // 5min = 300s
        expect(screen.getByTestId('time-left').props.children).toBe(300);
        expect(screen.getByTestId('running').props.children).toBe('sim');
    });

    it('deve iniciar timer com tarefa em horas e minutos', () => {
        renderWithProvider();
        act(() => {
            screen.getByTestId('start-hours').props.onPress();
        });
        expect(screen.getByTestId('total').props.children).toBe(9000); // 2h30min = 9000s
    });

    it('deve parsear número puro como minutos', () => {
        renderWithProvider();
        act(() => {
            screen.getByTestId('start-number').props.onPress();
        });
        expect(screen.getByTestId('total').props.children).toBe(600); // 10min = 600s
    });

    it('deve decrementar o tempo a cada segundo', () => {
        renderWithProvider();
        act(() => {
            screen.getByTestId('start').props.onPress();
        });
        act(() => {
            jest.advanceTimersByTime(3000);
        });
        expect(screen.getByTestId('time-left').props.children).toBe(297);
    });

    it('deve pausar o timer', () => {
        renderWithProvider();
        act(() => {
            screen.getByTestId('start').props.onPress();
        });
        act(() => {
            jest.advanceTimersByTime(2000);
        });
        act(() => {
            screen.getByTestId('pause').props.onPress();
        });
        expect(screen.getByTestId('running').props.children).toBe('não');

        const timeAfterPause = screen.getByTestId('time-left').props.children;
        act(() => {
            jest.advanceTimersByTime(5000);
        });
        expect(screen.getByTestId('time-left').props.children).toBe(timeAfterPause);
    });

    it('deve retomar o timer após pausar', () => {
        renderWithProvider();
        act(() => {
            screen.getByTestId('start').props.onPress();
        });
        act(() => {
            jest.advanceTimersByTime(2000);
        });
        act(() => {
            screen.getByTestId('pause').props.onPress();
        });
        act(() => {
            screen.getByTestId('resume').props.onPress();
        });
        expect(screen.getByTestId('running').props.children).toBe('sim');
    });

    it('deve parar o timer e limpar dados', () => {
        renderWithProvider();
        act(() => {
            screen.getByTestId('start').props.onPress();
        });
        act(() => {
            screen.getByTestId('stop').props.onPress();
        });
        expect(screen.getByTestId('active-task').props.children).toBe('nenhuma');
        expect(screen.getByTestId('time-left').props.children).toBe(0);
        expect(screen.getByTestId('total').props.children).toBe(0);
        expect(screen.getByTestId('running').props.children).toBe('não');
    });

    it('deve tocar som quando o timer chega a zero', () => {
        renderWithProvider();
        // Start a 2-second timer by using a short time
        act(() => {
            screen.getByTestId('start').props.onPress();
        });
        // Advance all 300 seconds
        act(() => {
            jest.advanceTimersByTime(300000);
        });
        expect(playDoneSound).toHaveBeenCalled();
        expect(screen.getByTestId('time-left').props.children).toBe(0);
        expect(screen.getByTestId('running').props.children).toBe('não');
    });

    it('não deve retomar se não houver tarefa ativa', () => {
        renderWithProvider();
        act(() => {
            screen.getByTestId('resume').props.onPress();
        });
        expect(screen.getByTestId('running').props.children).toBe('não');
    });
});
