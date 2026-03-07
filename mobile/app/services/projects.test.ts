import { createProject, getProjects, updateProject, deleteProject, getProjectById, addColumnToProject, updateColumnInProject, deleteColumnFromProject } from './projects';

const mockAdd = jest.fn();
const mockGet = jest.fn();
const mockUpdate = jest.fn();
const mockDelete = jest.fn();
const mockDocGet = jest.fn();
const mockDocUpdate = jest.fn();
const mockDocDelete = jest.fn();
const mockOrderBy = jest.fn();
const mockBatchDelete = jest.fn();
const mockBatchCommit = jest.fn();

const mockDocFn = jest.fn((id?: string) => ({
    get: mockDocGet,
    update: mockDocUpdate,
    delete: mockDocDelete,
}));

const mockCollectionRef = {
    add: mockAdd,
    get: mockGet,
    orderBy: jest.fn(() => ({ get: mockGet })),
    doc: mockDocFn,
};

const mockTasksCollectionRef = {
    get: jest.fn(),
};

jest.mock('./firestorePaths', () => ({
    getProjectsCollectionRef: jest.fn(() => mockCollectionRef),
    getTasksCollectionRef: jest.fn(() => mockTasksCollectionRef),
}));

jest.mock('@react-native-firebase/firestore', () => {
    const firestoreFn = () => ({
        batch: () => ({
            delete: mockBatchDelete,
            commit: mockBatchCommit,
        }),
    });
    firestoreFn.FieldValue = {
        serverTimestamp: () => 'SERVER_TIMESTAMP',
        arrayUnion: (val: any) => ({ __arrayUnion: val }),
        arrayRemove: (val: any) => ({ __arrayRemove: val }),
    };
    return {
        __esModule: true,
        default: firestoreFn,
    };
});

describe('projects service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('createProject', () => {
        it('deve criar um projeto com timestamps', async () => {
            mockAdd.mockResolvedValue({ id: 'proj1' });

            await createProject({ name: 'Projeto Teste', columns: [] } as any);

            expect(mockAdd).toHaveBeenCalledWith(
                expect.objectContaining({
                    name: 'Projeto Teste',
                    createdAt: 'SERVER_TIMESTAMP',
                    updatedAt: 'SERVER_TIMESTAMP',
                })
            );
        });
    });

    describe('getProjects', () => {
        it('deve retornar lista de projetos', async () => {
            mockGet.mockResolvedValue({
                docs: [
                    { id: 'p1', data: () => ({ name: 'Projeto 1' }) },
                    { id: 'p2', data: () => ({ name: 'Projeto 2' }) },
                ],
            });

            const result = await getProjects();

            expect(result).toHaveLength(2);
            expect(result[0]).toEqual(expect.objectContaining({ id: 'p1', name: 'Projeto 1' }));
        });
    });

    describe('updateProject', () => {
        it('deve atualizar o projeto com timestamp', async () => {
            mockDocUpdate.mockResolvedValue(undefined);

            await updateProject('proj1', { name: 'Novo Nome' } as any);

            expect(mockDocFn).toHaveBeenCalledWith('proj1');
            expect(mockDocUpdate).toHaveBeenCalledWith(
                expect.objectContaining({
                    name: 'Novo Nome',
                    updatedAt: 'SERVER_TIMESTAMP',
                })
            );
        });
    });

    describe('deleteProject', () => {
        it('deve deletar todas as tasks e o projeto via batch', async () => {
            const mockRef1 = { id: 'ref1' };
            const mockRef2 = { id: 'ref2' };
            mockTasksCollectionRef.get.mockResolvedValue({
                docs: [{ ref: mockRef1 }, { ref: mockRef2 }],
            });
            mockBatchCommit.mockResolvedValue(undefined);

            await deleteProject('proj1');

            expect(mockBatchDelete).toHaveBeenCalledTimes(3); // 2 tasks + 1 project
            expect(mockBatchCommit).toHaveBeenCalledTimes(1);
        });
    });

    describe('getProjectById', () => {
        it('deve retornar o projeto quando existe', async () => {
            mockDocGet.mockResolvedValue({
                exists: true,
                id: 'proj1',
                data: () => ({ name: 'Projeto 1' }),
            });

            const result = await getProjectById('proj1');

            expect(result).toEqual(expect.objectContaining({ id: 'proj1', name: 'Projeto 1' }));
        });

        it('deve retornar null quando o projeto não existe', async () => {
            mockDocGet.mockResolvedValue({
                exists: false,
            });

            const result = await getProjectById('proj-inexistente');

            expect(result).toBeNull();
        });
    });

    describe('addColumnToProject', () => {
        it('deve adicionar uma coluna ao projeto', async () => {
            mockDocUpdate.mockResolvedValue(undefined);

            await addColumnToProject('proj1', 'Nova Coluna');

            expect(mockDocUpdate).toHaveBeenCalledWith(
                expect.objectContaining({
                    columns: expect.objectContaining({ __arrayUnion: expect.objectContaining({ name: 'Nova Coluna' }) }),
                    updatedAt: 'SERVER_TIMESTAMP',
                })
            );
        });
    });

    describe('updateColumnInProject', () => {
        it('deve atualizar as colunas do projeto', async () => {
            mockDocUpdate.mockResolvedValue(undefined);
            const updatedColumns = [{ id: '1', name: 'Col Atualizada' }];

            await updateColumnInProject('proj1', updatedColumns);

            expect(mockDocUpdate).toHaveBeenCalledWith(
                expect.objectContaining({
                    columns: updatedColumns,
                    updatedAt: 'SERVER_TIMESTAMP',
                })
            );
        });
    });

    describe('deleteColumnFromProject', () => {
        it('deve remover uma coluna do projeto', async () => {
            mockDocUpdate.mockResolvedValue(undefined);
            const column = { id: '1', name: 'Col Para Remover' };

            await deleteColumnFromProject('proj1', column);

            expect(mockDocUpdate).toHaveBeenCalledWith(
                expect.objectContaining({
                    columns: expect.objectContaining({ __arrayRemove: column }),
                    updatedAt: 'SERVER_TIMESTAMP',
                })
            );
        });
    });
});
