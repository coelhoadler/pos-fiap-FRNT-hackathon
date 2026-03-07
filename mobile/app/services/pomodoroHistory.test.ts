import { savePomodoroHistory, getPomodoroHistory } from './pomodoroHistory';

const mockAdd = jest.fn();
const mockGet = jest.fn();
const mockOrderBy = jest.fn();
const mockLimit = jest.fn();

jest.mock('./firestorePaths', () => ({
    getPomodoroHistoryCollectionRef: jest.fn(() => ({
        add: mockAdd,
        orderBy: jest.fn((field: string, direction: string) => ({
            limit: jest.fn((n: number) => ({
                get: mockGet,
            })),
        })),
    })),
}));

describe('pomodoroHistory service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('savePomodoroHistory', () => {
        it('deve salvar o histórico do pomodoro com timestamp', async () => {
            mockAdd.mockResolvedValue({ id: 'history1' });

            const history = {
                timestamp: new Date(),
                completedCycles: 3,
                timeRemainingInSeconds: 0,
                action: 'complete' as const,
                pomodoroTimeInSeconds: 1500,
            };

            await savePomodoroHistory(history);

            expect(mockAdd).toHaveBeenCalledWith(
                expect.objectContaining({
                    completedCycles: 3,
                    action: 'complete',
                    pomodoroTimeInSeconds: 1500,
                    timestamp: expect.any(Date),
                })
            );
        });

        it('deve propagar erro ao falhar', async () => {
            mockAdd.mockRejectedValue(new Error('Save error'));

            const history = {
                timestamp: new Date(),
                completedCycles: 1,
                timeRemainingInSeconds: 500,
                action: 'pause' as const,
                pomodoroTimeInSeconds: 1500,
            };

            await expect(savePomodoroHistory(history)).rejects.toThrow('Save error');
        });
    });

    describe('getPomodoroHistory', () => {
        it('deve retornar o histórico ordenado por timestamp', async () => {
            const mockDate = new Date('2026-03-07T10:00:00');
            mockGet.mockResolvedValue({
                docs: [
                    {
                        data: () => ({
                            completedCycles: 3,
                            action: 'complete',
                            pomodoroTimeInSeconds: 1500,
                            timestamp: { toDate: () => mockDate },
                        }),
                    },
                ],
            });

            const result = await getPomodoroHistory(10);

            expect(result).toHaveLength(1);
            expect(result[0]).toEqual(expect.objectContaining({
                completedCycles: 3,
                action: 'complete',
                timestamp: mockDate,
            }));
        });

        it('deve propagar erro ao falhar', async () => {
            mockGet.mockRejectedValue(new Error('Fetch error'));

            await expect(getPomodoroHistory()).rejects.toThrow('Fetch error');
        });
    });
});
