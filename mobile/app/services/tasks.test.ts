import { createTask, getTaskById, getTasksByColumn, getLimitedTasksByColumn, updateTask, deleteTask, deleteTasksByColumn } from './tasks';

const mockAddDoc = jest.fn();
const mockGetDoc = jest.fn();
const mockGetDocs = jest.fn();
const mockUpdateDoc = jest.fn();
const mockDeleteDoc = jest.fn();
const mockBatchDelete = jest.fn();
const mockBatchCommit = jest.fn();
const mockDoc = jest.fn();
const mockQuery = jest.fn();
const mockWhere = jest.fn();
const mockOrderBy = jest.fn();
const mockLimit = jest.fn();
const mockServerTimestamp = jest.fn(() => 'SERVER_TIMESTAMP');
const mockWriteBatch = jest.fn(() => ({
    delete: mockBatchDelete,
    commit: mockBatchCommit,
}));

jest.mock('@react-native-firebase/auth', () => () => ({
    currentUser: { uid: 'user123', displayName: 'Test User', email: 'test@test.com' },
}));

jest.mock('@react-native-firebase/firestore', () => {
    const firestoreFn = () => ({ __firestoreInstance: true });
    firestoreFn.addDoc = (...args: any[]) => mockAddDoc(...args);
    firestoreFn.getDoc = (...args: any[]) => mockGetDoc(...args);
    firestoreFn.getDocs = (...args: any[]) => mockGetDocs(...args);
    firestoreFn.updateDoc = (...args: any[]) => mockUpdateDoc(...args);
    firestoreFn.deleteDoc = (...args: any[]) => mockDeleteDoc(...args);
    firestoreFn.doc = (...args: any[]) => mockDoc(...args);
    firestoreFn.query = (...args: any[]) => mockQuery(...args);
    firestoreFn.where = (...args: any[]) => mockWhere(...args);
    firestoreFn.orderBy = (...args: any[]) => mockOrderBy(...args);
    firestoreFn.limit = (...args: any[]) => mockLimit(...args);
    firestoreFn.serverTimestamp = () => mockServerTimestamp();
    firestoreFn.writeBatch = (...args: any[]) => mockWriteBatch(...args);
    return {
        __esModule: true,
        default: firestoreFn,
        addDoc: (...args: any[]) => mockAddDoc(...args),
        getDoc: (...args: any[]) => mockGetDoc(...args),
        getDocs: (...args: any[]) => mockGetDocs(...args),
        updateDoc: (...args: any[]) => mockUpdateDoc(...args),
        deleteDoc: (...args: any[]) => mockDeleteDoc(...args),
        doc: (...args: any[]) => mockDoc(...args),
        query: (...args: any[]) => mockQuery(...args),
        where: (...args: any[]) => mockWhere(...args),
        orderBy: (...args: any[]) => mockOrderBy(...args),
        limit: (...args: any[]) => mockLimit(...args),
        serverTimestamp: () => mockServerTimestamp(),
        writeBatch: (...args: any[]) => mockWriteBatch(...args),
    };
});

jest.mock('./firestorePaths', () => ({
    getTasksCollectionRef: jest.fn(() => ({ path: 'users/user123/projects/proj1/tasks' })),
}));

describe('tasks service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('createTask', () => {
        it('deve criar uma task com os dados corretos', async () => {
            mockAddDoc.mockResolvedValue(undefined);

            const taskData = {
                nome: 'Nova Task',
                descricao: 'Descricao',
                tempoExecucao: '2h',
                dataFinalizar: '2026-03-10',
                status: 'não iniciada' as const,
                priority: 'alta' as const,
                columnId: 'col1',
                projectId: 'proj1',
            };

            await createTask('proj1', taskData);

            expect(mockAddDoc).toHaveBeenCalledTimes(1);
            expect(mockAddDoc).toHaveBeenCalledWith(
                expect.anything(),
                expect.objectContaining({
                    nome: 'Nova Task',
                    author: 'Test User',
                })
            );
        });
    });

    describe('getTaskById', () => {
        it('deve retornar a task quando ela existe', async () => {
            const mockDocRef = { id: 'task1' };
            mockDoc.mockReturnValue(mockDocRef);
            mockGetDoc.mockResolvedValue({
                exists: () => true,
                id: 'task1',
                data: () => ({ nome: 'Task 1', descricao: 'Desc' }),
            });

            const result = await getTaskById('proj1', 'task1');

            expect(result).toEqual(expect.objectContaining({
                id: 'task1',
                nome: 'Task 1',
            }));
        });

        it('deve retornar null quando a task não existe', async () => {
            mockDoc.mockReturnValue({});
            mockGetDoc.mockResolvedValue({
                exists: () => false,
            });

            const result = await getTaskById('proj1', 'task-inexistente');

            expect(result).toBeNull();
        });
    });

    describe('getTasksByColumn', () => {
        it('deve retornar as tasks de uma coluna ordenadas', async () => {
            mockQuery.mockReturnValue('queryRef');
            mockGetDocs.mockResolvedValue({
                docs: [
                    { id: 't1', data: () => ({ nome: 'Task 1', columnId: 'col1' }) },
                    { id: 't2', data: () => ({ nome: 'Task 2', columnId: 'col1' }) },
                ],
            });

            const result = await getTasksByColumn('proj1', 'col1');

            expect(result).toHaveLength(2);
            expect(result[0]).toEqual(expect.objectContaining({ id: 't1', nome: 'Task 1' }));
        });
    });

    describe('getLimitedTasksByColumn', () => {
        it('deve retornar tasks limitadas', async () => {
            mockQuery.mockReturnValue('queryRef');
            mockGetDocs.mockResolvedValue({
                docs: [
                    { id: 't1', data: () => ({ nome: 'Task 1' }) },
                ],
            });

            const result = await getLimitedTasksByColumn('proj1', 'col1', 1);

            expect(result).toHaveLength(1);
        });
    });

    describe('updateTask', () => {
        it('deve atualizar a task com timestamp', async () => {
            mockDoc.mockReturnValue('docRef');
            mockUpdateDoc.mockResolvedValue(undefined);

            await updateTask('proj1', 'task1', { nome: 'Task Atualizada' });

            expect(mockUpdateDoc).toHaveBeenCalledWith('docRef', expect.objectContaining({
                nome: 'Task Atualizada',
                updatedAt: 'SERVER_TIMESTAMP',
            }));
        });
    });

    describe('deleteTask', () => {
        it('deve deletar a task', async () => {
            mockDoc.mockReturnValue('docRef');
            mockDeleteDoc.mockResolvedValue(undefined);

            await deleteTask('proj1', 'task1');

            expect(mockDeleteDoc).toHaveBeenCalledWith('docRef');
        });
    });

    describe('deleteTasksByColumn', () => {
        it('deve deletar todas as tasks de uma coluna usando batch', async () => {
            mockQuery.mockReturnValue('queryRef');
            const mockRef1 = { id: 'ref1' };
            const mockRef2 = { id: 'ref2' };
            mockGetDocs.mockResolvedValue({
                docs: [
                    { ref: mockRef1 },
                    { ref: mockRef2 },
                ],
            });
            mockBatchCommit.mockResolvedValue(undefined);

            await deleteTasksByColumn('proj1', 'col1');

            expect(mockBatchDelete).toHaveBeenCalledTimes(2);
            expect(mockBatchCommit).toHaveBeenCalledTimes(1);
        });
    });
});
