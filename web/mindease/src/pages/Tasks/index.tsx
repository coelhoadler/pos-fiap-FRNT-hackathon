import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  IconButton, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField, 
  Button, 
  Menu, 
  MenuItem, 
  Alert, 
  CircularProgress, 
  Snackbar,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import {
  PencilIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  CalendarIcon,
  ClockIcon,
  PlusIcon,
  InfoIcon,
  TrashIcon,
  MoreVerticalIcon
} from '../../components/Icon';
import { 
  getProjects, 
  createTask, 
  getTasks, 
  updateTask, 
  deleteTask, 
  onTasksSnapshot,
  type ITask,
  type TaskStatus 
} from '../../api';
import type { TaskColumn } from './interfaces';

const STATUS_COLUMNS: { id: TaskStatus; title: string; headerColor: string }[] = [
  { id: 'pendentes', title: 'Pendentes', headerColor: '#A3BACF' },
  { id: 'em-andamento', title: 'Em andamento', headerColor: '#4A6572' },
  { id: 'concluidas', title: 'Concluídas', headerColor: '#E0EADD' },
];

const TasksPage = () => {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('projectId');
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [columns, setColumns] = useState<TaskColumn[]>([]);
  const [projectName, setProjectName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Dialogs
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openLegendDialog, setOpenLegendDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  
  // Form states
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskStartDate, setTaskStartDate] = useState('');
  const [taskDuration, setTaskDuration] = useState('30 min');
  const [taskStatus, setTaskStatus] = useState<TaskStatus>('pendentes');
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  
  // Menu
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  
  // Messages
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Buscar nome do projeto quando projectId estiver presente
  useEffect(() => {
    const fetchProjectName = async () => {
      if (projectId) {
        try {
          const response = await getProjects();
          if (response.success && response.projects) {
            const project = response.projects.find(p => p.id === projectId);
            if (project) {
              setProjectName(project.name);
            }
          }
        } catch (error) {
          console.error('Erro ao buscar projeto:', error);
        }
      } else {
        setProjectName(null);
      }
    };

    fetchProjectName();
  }, [projectId]);

  // Organizar tarefas em colunas por status
  useEffect(() => {
    const organizedColumns: TaskColumn[] = STATUS_COLUMNS.map(statusCol => ({
      id: statusCol.id,
      title: statusCol.title,
      headerColor: statusCol.headerColor,
      expanded: true,
      tasks: tasks
        .filter(task => task.status === statusCol.id)
        .map(task => ({
          id: task.id,
          title: task.title,
          description: task.description,
          startDate: task.startDate,
          duration: task.duration,
          project: projectName || task.projectName || 'Sem projeto',
          author: task.author,
        })),
    }));
    setColumns(organizedColumns);
  }, [tasks, projectName]);

  // Load tasks from Firebase with real-time updates
  useEffect(() => {
    setLoading(true);
    
    const loadInitialTasks = async () => {
      try {
        const response = await getTasks(projectId || undefined);
        if (response.success && response.tasks) {
          setTasks(response.tasks);
        } else if (response.error) {
          console.error('Erro ao carregar tarefas:', response.error);
        }
        setLoading(false);
      } catch (err) {
        console.error('Erro ao carregar tarefas iniciais:', err);
        setLoading(false);
      }
    };

    loadInitialTasks();

    const unsubscribe = onTasksSnapshot(
      (tasksList) => {
        console.log('Tarefas atualizadas via listener:', tasksList.length, 'tarefas');
        console.log('ProjectId filtrado:', projectId);
        console.log('Tarefas recebidas:', tasksList.map(t => ({ id: t.id, title: t.title, projectId: t.projectId, status: t.status })));
        setTasks(tasksList);
        setLoading(false);
      },
      (error) => {
        console.error('Erro no listener:', error);
        // Se o listener falhar, tentar buscar manualmente
        loadInitialTasks();
      },
      projectId || undefined
    );

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [projectId]);

  const toggleColumn = (columnId: string) => {
    setColumns(prev => 
      prev.map(col => 
        col.id === columnId ? { ...col, expanded: !col.expanded } : col
      )
    );
  };

  const handleCreateTask = async () => {
    if (!taskTitle.trim()) {
      setError('O título da tarefa é obrigatório');
      return;
    }

    if (!projectId || !projectId.trim()) {
      setError('É necessário estar vinculado a um projeto');
      return;
    }

    setActionLoading(true);
    setError('');

    console.log('Criando tarefa com projectId:', projectId);
    const response = await createTask({
      title: taskTitle,
      description: taskDescription,
      startDate: taskStartDate || new Date().toLocaleDateString('pt-BR'),
      duration: taskDuration,
      projectId: projectId,
      status: taskStatus,
    });

    console.log('Resposta da criação:', response);

    if (response.success) {
      setTaskTitle('');
      setTaskDescription('');
      setTaskStartDate('');
      setTaskDuration('30 min');
      setTaskStatus('pendentes');
      setOpenCreateDialog(false);
      setError('');
      setSuccessMessage('Tarefa criada com sucesso!');
      setSnackbarOpen(true);
      
      // Forçar refresh das tarefas após criar (múltiplas tentativas)
      const refreshTasks = async (attempts = 3) => {
        for (let i = 0; i < attempts; i++) {
          await new Promise(resolve => setTimeout(resolve, 500 * (i + 1)));
          try {
            console.log(`Tentativa ${i + 1} de refresh das tarefas...`);
            const refreshResponse = await getTasks(projectId);
            if (refreshResponse.success && refreshResponse.tasks) {
              console.log('Tarefas atualizadas:', refreshResponse.tasks.length);
              setTasks(refreshResponse.tasks);
              break;
            }
          } catch (err) {
            console.error(`Erro ao atualizar tarefas (tentativa ${i + 1}):`, err);
          }
        }
      };
      
      refreshTasks();
    } else {
      setError(response.error || 'Erro ao criar tarefa');
    }

    setActionLoading(false);
  };

  const handleEditTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      setEditingTaskId(taskId);
      setTaskTitle(task.title);
      setTaskDescription(task.description);
      setTaskStartDate(task.startDate);
      setTaskDuration(task.duration);
      setTaskStatus(task.status);
      setOpenEditDialog(true);
    }
    handleCloseMenu();
  };

  const handleUpdateTask = async () => {
    if (!taskTitle.trim()) {
      setError('O título da tarefa é obrigatório');
      return;
    }

    if (!editingTaskId) {
      setError('ID da tarefa não encontrado');
      return;
    }

    setActionLoading(true);
    setError('');

    const response = await updateTask(editingTaskId, {
      title: taskTitle,
      description: taskDescription,
      startDate: taskStartDate,
      duration: taskDuration,
      status: taskStatus,
    });

    if (response.success) {
      setTaskTitle('');
      setTaskDescription('');
      setTaskStartDate('');
      setTaskDuration('30 min');
      setTaskStatus('pendentes');
      setEditingTaskId(null);
      setOpenEditDialog(false);
      setError('');
      setSuccessMessage('Tarefa atualizada com sucesso!');
      setSnackbarOpen(true);
    } else {
      setError(response.error || 'Erro ao atualizar tarefa');
    }

    setActionLoading(false);
  };

  const handleDeleteClick = (taskId: string) => {
    setTaskToDelete(taskId);
    setOpenDeleteDialog(true);
    handleCloseMenu();
  };

  const handleDeleteTask = async () => {
    if (!taskToDelete) return;

    setActionLoading(true);
    setOpenDeleteDialog(false);

    const response = await deleteTask(taskToDelete);

    if (response.success) {
      setSuccessMessage('Tarefa excluída com sucesso!');
      setSnackbarOpen(true);
      setTaskToDelete(null);
    } else {
      setError(response.error || 'Erro ao excluir tarefa');
    }

    setActionLoading(false);
  };

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>, taskId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedTaskId(taskId);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedTaskId(null);
  };

  const handleMoveTask = async (newStatus: TaskStatus) => {
    if (!selectedTaskId) return;

    setActionLoading(true);
    handleCloseMenu();

    const response = await updateTask(selectedTaskId, { status: newStatus });

    if (response.success) {
      setSuccessMessage('Status da tarefa atualizado!');
      setSnackbarOpen(true);
    } else {
      setError(response.error || 'Erro ao atualizar status da tarefa');
    }

    setActionLoading(false);
  };

  const resetForm = () => {
    setTaskTitle('');
    setTaskDescription('');
    setTaskStartDate('');
    setTaskDuration('30 min');
    setTaskStatus('pendentes');
    setError('');
  };

  return (
    <Box className="w-full p-8 bg-custom-sand min-h-screen">
      {/* Header */}
      <Box className="flex items-center justify-between mb-8">
        <Box>
          <Typography 
            variant="h4" 
            sx={{ color: '#4A6572', fontWeight: 700 }}
          >
            Tarefas
          </Typography>
          {projectName && (
            <Typography 
              variant="subtitle1" 
              sx={{ color: '#A3BACF', fontWeight: 500, mt: 0.5 }}
            >
              Projeto: {projectName}
            </Typography>
          )}
        </Box>
        <Box className="flex gap-2">
          {projectId && (
            <IconButton 
              onClick={() => setOpenCreateDialog(true)}
              sx={{ 
                color: '#4A6572',
                backgroundColor: '#E0EADD',
                '&:hover': { backgroundColor: '#A3BACF' }
              }}
            >
              <PlusIcon size={20} />
            </IconButton>
          )}
          <IconButton 
            onClick={() => setOpenLegendDialog(true)}
            sx={{ 
              color: '#4A6572',
              backgroundColor: '#E0EADD',
              '&:hover': { backgroundColor: '#A3BACF' }
            }}
          >
            <InfoIcon size={20} />
          </IconButton>
        </Box>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" onClose={() => setError('')} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Loading */}
      {loading ? (
        <Box className="flex justify-center items-center p-8">
          <CircularProgress sx={{ color: '#4A6572' }} />
        </Box>
      ) : (
        <>
          {/* Kanban Columns */}
          <Box className="flex gap-6 overflow-x-auto">
            {columns.map((column) => (
              <Box key={column.id} className="flex-1 min-w-[300px]">
                {/* Column Header */}
                <Box 
                  className="flex items-center justify-between p-4 rounded-t-lg"
                  sx={{ backgroundColor: column.headerColor }}
                >
                  <Typography 
                    sx={{ 
                      color: '#FFFFFF', 
                      fontWeight: 700,
                      fontSize: '1rem'
                    }}
                  >
                    {column.title} ({column.tasks.length})
                  </Typography>
                  <IconButton 
                    size="small" 
                    sx={{ color: '#FFFFFF' }}
                    onClick={() => toggleColumn(column.id)}
                  >
                    {column.expanded ? (
                      <ChevronUpIcon size={20} />
                    ) : (
                      <ChevronDownIcon size={20} />
                    )}
                  </IconButton>
                </Box>

                {/* Tasks */}
                {column.expanded && (
                  <Box className="bg-custom-cream rounded-b-lg p-4 space-y-4">
                    {column.tasks.length === 0 ? (
                      <Typography sx={{ color: '#A3BACF', textAlign: 'center', py: 2 }}>
                        Nenhuma tarefa
                      </Typography>
                    ) : (
                      column.tasks.map((task) => (
                        <Box
                          key={task.id}
                          className="bg-white rounded-lg p-4 shadow-sm border border-gray-200"
                        >
                          {/* Task Header */}
                          <Box className="flex items-start justify-between mb-2">
                            <Typography 
                              sx={{ 
                                color: '#4A6572', 
                                fontWeight: 600,
                                fontSize: '1rem'
                              }}
                            >
                              {task.title}
                            </Typography>
                            <IconButton 
                              size="small" 
                              sx={{ color: '#4A6572' }}
                              onClick={(e) => handleOpenMenu(e, task.id)}
                            >
                              <MoreVerticalIcon size={16} />
                            </IconButton>
                          </Box>

                          {/* Description */}
                          <Typography 
                            sx={{ 
                              color: '#4A6572', 
                              fontSize: '0.875rem',
                              mb: 2
                            }}
                          >
                            {task.description || 'Sem descrição'}
                          </Typography>

                          {/* Dates and Duration */}
                          <Box className="flex items-center gap-4 mb-3">
                            <Box className="flex items-center gap-1">
                              <CalendarIcon size={14} className="text-custom-slate" />
                              <Typography 
                                sx={{ 
                                  color: '#4A6572', 
                                  fontSize: '0.75rem'
                                }}
                              >
                                {task.startDate}
                              </Typography>
                            </Box>
                            <Box className="flex items-center gap-1">
                              <ClockIcon size={14} className="text-custom-slate" />
                              <Typography 
                                sx={{ 
                                  color: '#4A6572', 
                                  fontSize: '0.75rem'
                                }}
                              >
                                {task.duration}
                              </Typography>
                            </Box>
                          </Box>

                          {/* Project and Author */}
                          <Box className="flex items-center gap-3">
                            <Box className="flex items-center gap-1">
                              <Typography 
                                sx={{ 
                                  color: '#4A6572', 
                                  fontSize: '0.75rem'
                                }}
                              >
                                Projeto:
                              </Typography>
                              <Box 
                                className="px-2 py-0.5 rounded"
                                sx={{ backgroundColor: '#FFE5E5' }}
                              >
                                <Typography 
                                  sx={{ 
                                    color: '#4A6572', 
                                    fontSize: '0.75rem',
                                    fontWeight: 600
                                  }}
                                >
                                  {task.project}
                                </Typography>
                              </Box>
                            </Box>
                            <Box className="flex items-center gap-1">
                              <Typography 
                                sx={{ 
                                  color: '#4A6572', 
                                  fontSize: '0.75rem'
                                }}
                              >
                                Autor:
                              </Typography>
                              <Box 
                                className="px-2 py-0.5 rounded"
                                sx={{ backgroundColor: '#E0EADD' }}
                              >
                                <Typography 
                                  sx={{ 
                                    color: '#4A6572', 
                                    fontSize: '0.75rem',
                                    fontWeight: 600
                                  }}
                                >
                                  {task.author}
                                </Typography>
                              </Box>
                            </Box>
                          </Box>
                        </Box>
                      ))
                    )}
                  </Box>
                )}
              </Box>
            ))}
          </Box>
        </>
      )}

      {/* Create Task Dialog */}
      <Dialog 
        open={openCreateDialog} 
        onClose={() => {
          setOpenCreateDialog(false);
          resetForm();
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ color: '#4A6572', fontWeight: 600 }}>
          Nova Tarefa
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Título da Tarefa"
            type="text"
            fullWidth
            variant="outlined"
            value={taskTitle}
            onChange={(e) => {
              setTaskTitle(e.target.value);
              setError('');
            }}
            sx={{ mt: 2 }}
          />
          <TextField
            margin="dense"
            label="Descrição"
            type="text"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            sx={{ mt: 2 }}
          />
          <Box className="flex gap-2 mt-2">
            <TextField
              margin="dense"
              label="Data de Início"
              type="text"
              placeholder="DD/MM/AAAA"
              variant="outlined"
              value={taskStartDate}
              onChange={(e) => setTaskStartDate(e.target.value)}
              sx={{ flex: 1 }}
            />
            <TextField
              margin="dense"
              label="Duração"
              type="text"
              variant="outlined"
              value={taskDuration}
              onChange={(e) => setTaskDuration(e.target.value)}
              sx={{ flex: 1 }}
            />
          </Box>
          <FormControl fullWidth margin="dense" sx={{ mt: 2 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={taskStatus}
              label="Status"
              onChange={(e) => setTaskStatus(e.target.value as TaskStatus)}
            >
              <MenuItem value="pendentes">Pendentes</MenuItem>
              <MenuItem value="em-andamento">Em andamento</MenuItem>
              <MenuItem value="concluidas">Concluídas</MenuItem>
            </Select>
          </FormControl>
          {error && (
            <Typography sx={{ color: 'error.main', mt: 1, fontSize: '0.875rem' }}>
              {error}
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => {
              setOpenCreateDialog(false);
              resetForm();
            }}
            sx={{ color: '#A3BACF' }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleCreateTask}
            variant="contained"
            disabled={actionLoading}
            sx={{
              backgroundColor: '#4A6572',
              '&:hover': { backgroundColor: '#3a5260' },
              '&:disabled': { backgroundColor: '#A3BACF' }
            }}
          >
            {actionLoading ? <CircularProgress size={20} sx={{ color: '#FFFFFF' }} /> : 'Criar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Task Dialog */}
      <Dialog 
        open={openEditDialog} 
        onClose={() => {
          setOpenEditDialog(false);
          resetForm();
          setEditingTaskId(null);
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ color: '#4A6572', fontWeight: 600 }}>
          Editar Tarefa
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Título da Tarefa"
            type="text"
            fullWidth
            variant="outlined"
            value={taskTitle}
            onChange={(e) => {
              setTaskTitle(e.target.value);
              setError('');
            }}
            sx={{ mt: 2 }}
          />
          <TextField
            margin="dense"
            label="Descrição"
            type="text"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            sx={{ mt: 2 }}
          />
          <Box className="flex gap-2 mt-2">
            <TextField
              margin="dense"
              label="Data de Início"
              type="text"
              placeholder="DD/MM/AAAA"
              variant="outlined"
              value={taskStartDate}
              onChange={(e) => setTaskStartDate(e.target.value)}
              sx={{ flex: 1 }}
            />
            <TextField
              margin="dense"
              label="Duração"
              type="text"
              variant="outlined"
              value={taskDuration}
              onChange={(e) => setTaskDuration(e.target.value)}
              sx={{ flex: 1 }}
            />
          </Box>
          <FormControl fullWidth margin="dense" sx={{ mt: 2 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={taskStatus}
              label="Status"
              onChange={(e) => setTaskStatus(e.target.value as TaskStatus)}
            >
              <MenuItem value="pendentes">Pendentes</MenuItem>
              <MenuItem value="em-andamento">Em andamento</MenuItem>
              <MenuItem value="concluidas">Concluídas</MenuItem>
            </Select>
          </FormControl>
          {error && (
            <Typography sx={{ color: 'error.main', mt: 1, fontSize: '0.875rem' }}>
              {error}
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => {
              setOpenEditDialog(false);
              resetForm();
              setEditingTaskId(null);
            }}
            disabled={actionLoading}
            sx={{ color: '#A3BACF' }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleUpdateTask}
            variant="contained"
            disabled={actionLoading}
            sx={{
              backgroundColor: '#4A6572',
              '&:hover': { backgroundColor: '#3a5260' },
              '&:disabled': { backgroundColor: '#A3BACF' }
            }}
          >
            {actionLoading ? <CircularProgress size={20} sx={{ color: '#FFFFFF' }} /> : 'Salvar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Legend Dialog */}
      <Dialog 
        open={openLegendDialog} 
        onClose={() => setOpenLegendDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ color: '#4A6572', fontWeight: 600, textAlign: 'center' }}>
          Legenda
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: '#A3BACF', mb: 3 }}>
            Aqui vamos explicar o que significa cada ícone.
          </Typography>
          <Box className="flex flex-col gap-3">
            <Box className="flex items-center gap-3">
              <PlusIcon size={24} className="text-[#4A6572]" />
              <Typography sx={{ color: '#4A6572' }}>
                Criar uma nova tarefa para o projeto
              </Typography>
            </Box>
            <Box className="flex items-center gap-3">
              <PencilIcon size={24} className="text-[#4A6572]" />
              <Typography sx={{ color: '#4A6572' }}>
                Editar informações da tarefa
              </Typography>
            </Box>
            <Box className="flex items-center gap-3">
              <TrashIcon size={24} className="text-[#4A6572]" />
              <Typography sx={{ color: '#4A6572' }}>
                Excluir a tarefa permanentemente
              </Typography>
            </Box>
            <Box className="flex items-center gap-3">
              <MoreVerticalIcon size={24} className="text-[#4A6572]" />
              <Typography sx={{ color: '#4A6572' }}>
                Visualizar mais opções da tarefa
              </Typography>
            </Box>
            <Box className="flex items-center gap-3">
              <ChevronUpIcon size={24} className="text-[#4A6572]" />
              <Typography sx={{ color: '#4A6572' }}>
                Expandir/Recolher coluna de tarefas
              </Typography>
            </Box>
            <Box className="flex items-center gap-3">
              <CalendarIcon size={24} className="text-[#4A6572]" />
              <Typography sx={{ color: '#4A6572' }}>
                Data de início da tarefa
              </Typography>
            </Box>
            <Box className="flex items-center gap-3">
              <ClockIcon size={24} className="text-[#4A6572]" />
              <Typography sx={{ color: '#4A6572' }}>
                Duração estimada da tarefa
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, justifyContent: 'center' }}>
          <Button
            onClick={() => setOpenLegendDialog(false)}
            variant="contained"
            sx={{
              backgroundColor: '#4A6572',
              '&:hover': { backgroundColor: '#3a5260' }
            }}
          >
            Fechar
          </Button>
        </DialogActions>
      </Dialog>

      {/* More Options Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem 
          onClick={() => selectedTaskId && handleEditTask(selectedTaskId)}
          sx={{ color: '#4A6572' }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PencilIcon size={16} />
            <span>Editar tarefa</span>
          </Box>
        </MenuItem>
        <MenuItem 
          onClick={() => selectedTaskId && handleMoveTask('em-andamento')}
          sx={{ color: '#4A6572' }}
        >
          ▷ Mover para Em andamento
        </MenuItem>
        <MenuItem 
          onClick={() => selectedTaskId && handleMoveTask('pendentes')}
          sx={{ color: '#4A6572' }}
        >
          ⏸ Mover para Pendentes
        </MenuItem>
        <MenuItem 
          onClick={() => selectedTaskId && handleMoveTask('concluidas')}
          sx={{ color: '#4A6572' }}
        >
          ✓ Mover para Concluídas
        </MenuItem>
        <MenuItem 
          onClick={() => selectedTaskId && handleDeleteClick(selectedTaskId)}
          sx={{ color: '#d32f2f' }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TrashIcon size={16} />
            <span>Excluir tarefa</span>
          </Box>
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog 
        open={openDeleteDialog} 
        onClose={() => {
          setOpenDeleteDialog(false);
          setTaskToDelete(null);
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ color: '#4A6572', fontWeight: 600 }}>
          Confirmar Exclusão
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: '#4A6572', mb: 2 }}>
            Tem certeza que deseja excluir esta tarefa? Esta ação não pode ser desfeita.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => {
              setOpenDeleteDialog(false);
              setTaskToDelete(null);
            }}
            disabled={actionLoading}
            sx={{ color: '#A3BACF' }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleDeleteTask}
            variant="contained"
            disabled={actionLoading}
            sx={{
              backgroundColor: '#d32f2f',
              '&:hover': { backgroundColor: '#b71c1c' },
              '&:disabled': { backgroundColor: '#A3BACF' }
            }}
          >
            {actionLoading ? <CircularProgress size={20} sx={{ color: '#FFFFFF' }} /> : 'Excluir'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setSnackbarOpen(false)} 
          severity="success" 
          sx={{ 
            width: '100%',
            backgroundColor: '#E0EADD',
            color: '#4A6572',
            '& .MuiAlert-icon': {
              color: '#4A6572'
            }
          }}
        >
          {successMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default TasksPage;
