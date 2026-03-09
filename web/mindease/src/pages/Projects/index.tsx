import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Alert, CircularProgress, Snackbar } from '@mui/material';
import {
  PlusIcon,
  InfoIcon,
  EyeIcon,
  TrashIcon,
  PencilIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from '../../components/Icon';
import { createProject, getProjects, updateProject, deleteProject, onProjectsSnapshot, getTasks, type ITask } from '../../api';
import type { IProject } from '../../api/interfaces';

const ProjectsPage = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<IProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openLegendDialog, setOpenLegendDialog] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [editProjectName, setEditProjectName] = useState('');
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set());
  const [projectTasks, setProjectTasks] = useState<Record<string, ITask[]>>({});
  const [loadingTasks, setLoadingTasks] = useState<Record<string, boolean>>({});
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    
    const loadInitialProjects = async () => {
      try {
        const response = await getProjects();
        if (response.success && response.projects) {
          setProjects(response.projects);
        } else if (response.error) {
          console.error('Erro ao carregar projetos:', response.error);
        }
        setLoading(false);
      } catch (err) {
        console.error('Erro ao carregar projetos iniciais:', err);
        setLoading(false);
      }
    };

    loadInitialProjects();

    // Configurar listener em tempo real
    let intervalId: ReturnType<typeof setInterval> | null = null;
    
    const unsubscribe = onProjectsSnapshot(
      (projectsList) => {
        console.log('Projetos atualizados via listener:', projectsList.length);
        setProjects(projectsList);
        setLoading(false);
        // Limpar intervalo se o listener estiver funcionando
        if (intervalId) {
          clearInterval(intervalId);
          intervalId = null;
        }
      },
      (error) => {
        console.error('Erro no listener:', error);
        // Se o listener falhar, tentar buscar manualmente periodicamente
        if (!intervalId) {
          intervalId = setInterval(() => {
            loadInitialProjects();
          }, 5000); // Buscar a cada 5 segundos se o listener falhar
        }
      }
    );

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, []);

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) {
      setError('O nome do projeto é obrigatório');
      return;
    }

    setActionLoading(true);
    setError('');

    const response = await createProject({ name: newProjectName });

    if (response.success) {
      setNewProjectName('');
      setOpenCreateDialog(false);
      setError('');
      setSuccessMessage('Projeto criado com sucesso!');
      setSnackbarOpen(true);
    } else {
      setError(response.error || 'Erro ao criar projeto');
    }

    setActionLoading(false);
  };

  const handleUpdateProject = async () => {
    if (!editProjectName.trim()) {
      setError('O nome do projeto é obrigatório');
      return;
    }

    if (!editingProjectId) {
      setError('ID do projeto não encontrado');
      return;
    }

    setActionLoading(true);
    setError('');

    const response = await updateProject(editingProjectId, { name: editProjectName });

    if (response.success) {
      setEditProjectName('');
      setEditingProjectId(null);
      setOpenEditDialog(false);
      setError('');
      setSuccessMessage('Projeto atualizado com sucesso!');
      setSnackbarOpen(true);
    } else {
      setError(response.error || 'Erro ao atualizar projeto');
    }

    setActionLoading(false);
  };

  const handleDeleteClick = (projectId: string) => {
    setProjectToDelete(projectId);
    setOpenDeleteDialog(true);
  };

  const handleDeleteProject = async () => {
    if (!projectToDelete) return;

    setActionLoading(true);
    setOpenDeleteDialog(false);

    const response = await deleteProject(projectToDelete);

    if (response.success) {
      setSuccessMessage('Projeto excluído com sucesso!');
      setSnackbarOpen(true);
      setProjectToDelete(null);
    } else {
      setError(response.error || 'Erro ao excluir projeto');
    }

    setActionLoading(false);
  };

  const toggleProjectTasks = async (projectId: string) => {
    const isExpanded = expandedProjects.has(projectId);
    
    if (isExpanded) {
      // Recolher: remover do Set
      setExpandedProjects(prev => {
        const newSet = new Set(prev);
        newSet.delete(projectId);
        return newSet;
      });
    } else {
      // Expandir: adicionar ao Set e buscar tarefas
      setExpandedProjects(prev => new Set(prev).add(projectId));
      
      // Se ainda não carregou as tarefas, buscar
      if (!projectTasks[projectId]) {
        setLoadingTasks(prev => ({ ...prev, [projectId]: true }));
        try {
          const response = await getTasks(projectId);
          if (response.success && response.tasks) {
            setProjectTasks(prev => ({ ...prev, [projectId]: response.tasks || [] }));
          }
        } catch (err) {
          console.error('Erro ao carregar tarefas do projeto:', err);
        } finally {
          setLoadingTasks(prev => ({ ...prev, [projectId]: false }));
        }
      }
    }
  };

  const handleViewProject = (projectId: string) => {
    // Navegar para a tela de tarefas com o ID do projeto
    navigate(`/tasks?projectId=${projectId}`);
  };

  const handleEditProject = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
      setEditingProjectId(projectId);
      setEditProjectName(project.name);
      setOpenEditDialog(true);
    }
  };

  return (
    <Box className="w-full p-8 bg-custom-sand min-h-screen">
      {/* Header */}
      <Box className="flex items-center justify-between mb-8">
        <Typography 
          variant="h4" 
          sx={{ color: '#4A6572', fontWeight: 700 }}
        >
          Projetos
        </Typography>
        <Box className="flex gap-2">
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

      {/* Projects List */}
      <Box className="mb-6">
        <Typography 
          variant="h6" 
          sx={{ color: '#4A6572', fontWeight: 600, mb: 3 }}
        >
          Meus Projetos
        </Typography>

        {loading ? (
          <Box className="flex justify-center items-center p-8">
            <CircularProgress sx={{ color: '#4A6572' }} />
          </Box>
        ) : projects.length === 0 ? (
          <Box 
            className="p-8 rounded-lg text-center"
            sx={{ backgroundColor: '#E0EADD' }}
          >
            <Typography sx={{ color: '#A3BACF' }}>
              Nenhum projeto cadastrado. Clique no botão + para criar um novo projeto.
            </Typography>
          </Box>
        ) : (
          <Box className="flex flex-col gap-3">
            {projects.map((project) => {
              const isExpanded = expandedProjects.has(project.id);
              const tasks = projectTasks[project.id] || [];
              const isLoadingTasks = loadingTasks[project.id] || false;
              
              return (
                <Box key={project.id}>
                  <Box
                    className="flex items-center justify-between p-4 rounded-lg"
                    sx={{ 
                      backgroundColor: '#4A6572',
                      color: '#FFFFFF'
                    }}
                  >
                    <Typography 
                      sx={{ 
                        color: '#FFFFFF',
                        fontWeight: 500,
                        fontSize: '1.1rem'
                      }}
                    >
                      {project.name}
                    </Typography>
                    <Box className="flex items-center gap-2">
                      <IconButton
                        onClick={() => handleViewProject(project.id)}
                        sx={{ color: '#FFFFFF', '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' } }}
                      >
                        <EyeIcon size={20} />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDeleteClick(project.id)}
                        sx={{ color: '#FFFFFF', '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' } }}
                      >
                        <TrashIcon size={20} />
                      </IconButton>
                      <IconButton
                        onClick={() => handleEditProject(project.id)}
                        sx={{ color: '#FFFFFF', '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' } }}
                      >
                        <PencilIcon size={20} />
                      </IconButton>
                      <IconButton
                        onClick={() => toggleProjectTasks(project.id)}
                        sx={{ color: '#FFFFFF', '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' } }}
                      >
                        {isExpanded ? (
                          <ChevronUpIcon size={20} />
                        ) : (
                          <ChevronDownIcon size={20} />
                        )}
                      </IconButton>
                    </Box>
                  </Box>
                  
                  {/* Resumo das Tarefas */}
                  {isExpanded && (
                    <Box 
                      className="mt-2 p-4 rounded-lg"
                      sx={{ 
                        backgroundColor: '#E0EADD',
                        border: '1px solid #A3BACF'
                      }}
                    >
                      {isLoadingTasks ? (
                        <Box className="flex justify-center items-center py-4">
                          <CircularProgress size={24} sx={{ color: '#4A6572' }} />
                        </Box>
                      ) : tasks.length === 0 ? (
                        <Typography sx={{ color: '#A3BACF', textAlign: 'center', py: 2 }}>
                          Nenhuma tarefa cadastrada neste projeto
                        </Typography>
                      ) : (
                        <Box className="flex flex-col gap-2">
                          {tasks.map((task) => (
                            <Box
                              key={task.id}
                              className="flex items-center justify-between p-3 rounded bg-white"
                              sx={{ border: '1px solid #A3BACF' }}
                            >
                              <Box className="flex-1">
                                <Typography 
                                  sx={{ 
                                    color: '#4A6572', 
                                    fontWeight: 600,
                                    fontSize: '0.9rem',
                                    mb: 0.5
                                  }}
                                >
                                  {task.title}
                                </Typography>
                                <Box className="flex items-center gap-3">
                                  <Typography 
                                    sx={{ 
                                      color: '#A3BACF', 
                                      fontSize: '0.75rem'
                                    }}
                                  >
                                    {task.startDate}
                                  </Typography>
                                  <Typography 
                                    sx={{ 
                                      color: '#A3BACF', 
                                      fontSize: '0.75rem'
                                    }}
                                  >
                                    {task.author}
                                  </Typography>
                                </Box>
                              </Box>
                            </Box>
                          ))}
                        </Box>
                      )}
                    </Box>
                  )}
                </Box>
              );
            })}
          </Box>
        )}
      </Box>

      {/* Create Project Dialog */}
      <Dialog 
        open={openCreateDialog} 
        onClose={() => {
          setOpenCreateDialog(false);
          setNewProjectName('');
          setError('');
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ color: '#4A6572', fontWeight: 600 }}>
          Novo Projeto
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nome do Projeto"
            type="text"
            fullWidth
            variant="outlined"
            value={newProjectName}
            onChange={(e) => {
              setNewProjectName(e.target.value);
              setError('');
            }}
            sx={{
              mt: 2,
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                  borderColor: '#4A6572',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#4A6572',
                },
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: '#4A6572',
              },
            }}
          />
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
              setNewProjectName('');
              setError('');
            }}
            sx={{ color: '#A3BACF' }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleCreateProject}
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

      {/* Edit Project Dialog */}
      <Dialog 
        open={openEditDialog} 
        onClose={() => {
          setOpenEditDialog(false);
          setEditProjectName('');
          setEditingProjectId(null);
          setError('');
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ color: '#4A6572', fontWeight: 600 }}>
          Editar Projeto
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nome do Projeto"
            type="text"
            fullWidth
            variant="outlined"
            value={editProjectName}
            onChange={(e) => {
              setEditProjectName(e.target.value);
              setError('');
            }}
            sx={{
              mt: 2,
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                  borderColor: '#4A6572',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#4A6572',
                },
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: '#4A6572',
              },
            }}
          />
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
              setEditProjectName('');
              setEditingProjectId(null);
              setError('');
            }}
            disabled={actionLoading}
            sx={{ color: '#A3BACF' }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleUpdateProject}
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
              <EyeIcon size={24} className="text-[#4A6572]" />
              <Typography sx={{ color: '#4A6572' }}>
                Visualizar o projeto e suas tarefas
              </Typography>
            </Box>
            <Box className="flex items-center gap-3">
              <TrashIcon size={24} className="text-[#4A6572]" />
              <Typography sx={{ color: '#4A6572' }}>
                Excluir o projeto e todas as suas tarefas.
              </Typography>
            </Box>
            <Box className="flex items-center gap-3">
              <PencilIcon size={24} className="text-[#4A6572]" />
              <Typography sx={{ color: '#4A6572' }}>
                Editar nome e configurações básicas do projeto.
              </Typography>
            </Box>
            <Box className="flex items-center gap-3">
              <ChevronUpIcon size={24} className="text-[#4A6572]" />
              <Typography sx={{ color: '#4A6572' }}>
                Expandir/Recolher resumo de tarefas do projeto.
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

      {/* Delete Confirmation Dialog */}
      <Dialog 
        open={openDeleteDialog} 
        onClose={() => {
          setOpenDeleteDialog(false);
          setProjectToDelete(null);
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ color: '#4A6572', fontWeight: 600 }}>
          Confirmar Exclusão
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: '#4A6572', mb: 2 }}>
            Tem certeza que deseja excluir este projeto? Esta ação não pode ser desfeita e todas as tarefas vinculadas também serão excluídas.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => {
              setOpenDeleteDialog(false);
              setProjectToDelete(null);
            }}
            disabled={actionLoading}
            sx={{ color: '#A3BACF' }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleDeleteProject}
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

export default ProjectsPage;
