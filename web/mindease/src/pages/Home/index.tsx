import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { FolderKanbanIcon, ClockIcon, InfoIcon } from '../../components/Icon';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <Box className="w-full p-8 bg-custom-sand min-h-screen">      
      <Box className="mb-6">
        <Typography
          variant="h4"
          sx={{ color: '#4A6572', fontWeight: 700, mb: 1 }}
        >
          Bem vinda(o) de volta!
        </Typography>
      </Box>

      <Box className="flex flex-col gap-4">
        <Box
          className="bg-custom-cream rounded-lg p-6 shadow-sm"
          sx={{
            border: '1px solid #0BA7B5',
          }}
        >
          <Box className="flex items-start gap-3">
            <Box
              className="flex items-center justify-center rounded-full"
              sx={{
                width: 40,
                height: 40,
                backgroundColor: '#0BA7B5',
              }}
            >
              <FolderKanbanIcon size={22} className="text-white" />
            </Box>
            <Box className="flex-1">
              <Typography
                variant="h6"
                sx={{ color: '#0BA7B5', fontWeight: 700, mb: 1 }}
              >
                Tarefas
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: '#4A6572', mb: 2 }}
              >
                Dentro de cada projeto, você pode adicionar Tarefas passo a passo
                para não se perder e saber o que precisa ser feito.
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate('/projects')}
                sx={{
                  mt: 1,
                  backgroundColor: '#0BA7B5',
                  '&:hover': { backgroundColor: '#088492' },
                }}
              >
                Saiba mais
              </Button>
            </Box>
          </Box>
        </Box>

        <Box
          className="bg-custom-cream rounded-lg p-6 shadow-sm"
          sx={{
            border: '1px solid #0BA7B5',
          }}
        >
          <Box className="flex items-start gap-3">
            <Box
              className="flex items-center justify-center rounded-full"
              sx={{
                width: 40,
                height: 40,
                backgroundColor: '#0BA7B5',
              }}
            >
              <ClockIcon size={22} className="text-white" />
            </Box>
            <Box className="flex-1">
              <Typography
                variant="h6"
                sx={{ color: '#0BA7B5', fontWeight: 700, mb: 1 }}
              >
                Modo Foco (Pomodoro)
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: '#4A6572', mb: 2 }}
              >
                Use a ferramenta de Foco para se concentrar em uma tarefa de
                cada vez. Ela possui pausas automáticas para você descansar a
                mente.
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate('/tasks')}
                sx={{
                  mt: 1,
                  backgroundColor: '#0BA7B5',
                  '&:hover': { backgroundColor: '#088492' },
                }}
              >
                Saiba mais
              </Button>
            </Box>
          </Box>
        </Box>

        <Box
          className="bg-custom-cream rounded-lg p-6 shadow-sm"
          sx={{
            border: '1px solid #0BA7B5',
          }}
        >
          <Box className="flex items-start gap-3">
            <Box
              className="flex items-center justify-center rounded-full"
              sx={{
                width: 40,
                height: 40,
                backgroundColor: '#0BA7B5',
              }}
            >
              <InfoIcon size={22} className="text-white" />
            </Box>
            <Box className="flex-1">
              <Typography
                variant="h6"
                sx={{ color: '#0BA7B5', fontWeight: 700, mb: 1 }}
              >
                Preferências
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: '#4A6572', mb: 2 }}
              >
                Ajuste o aplicativo do seu jeito. Na página de Preferências, você
                pode escolher opções visuais para tornar o uso mais confortável.
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate('/preferences')}
                sx={{
                  mt: 1,
                  backgroundColor: '#0BA7B5',
                  '&:hover': { backgroundColor: '#088492' },
                }}
              >
                Saiba mais
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default HomePage;
