import { useState, useEffect } from 'react';
import { Switch, FormControlLabel, Box, Typography, Stack } from '@mui/material';

interface PreferencesState {
  modoFoco: boolean;
  modoResumo: boolean;
  modoSimplificado: boolean;
}

const PREFERENCES_STORAGE_KEY = 'mindease_preferences';

const PreferencesPage = () => {
  const [preferences, setPreferences] = useState<PreferencesState>({
    modoFoco: false,
    modoResumo: false,
    modoSimplificado: false,
  });


  useEffect(() => {
    const savedPreferences = sessionStorage.getItem(PREFERENCES_STORAGE_KEY);
    if (savedPreferences) {
      try {
        const parsed = JSON.parse(savedPreferences);
        setPreferences(parsed);
      } catch (error) {
        console.error('Erro ao carregar preferências:', error);
      }
    }
  }, []);


  useEffect(() => {
    sessionStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(preferences));
  }, [preferences]);

  const handleToggle = (key: keyof PreferencesState) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <Box className="w-full max-w-4xl mx-auto p-8 bg-custom-sand min-h-screen">
      <Typography 
        variant="h4" 
        sx={{ color: '#4A6572', fontWeight: 700 }}
        className="mb-8"
      >
        Preferências
      </Typography>

      <Stack spacing={4}>
        {/* Modo Foco */}
        <Box className="bg-custom-cream rounded-lg p-6 shadow-sm border border-custom-fog">
          <Box className="flex items-center justify-between mb-2">
            <Typography 
              variant="h6" 
              sx={{ color: '#4A6572', fontWeight: 600 }}
              className="font-semibold"
            >
              Modo foco
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={preferences.modoFoco}
                  onChange={() => handleToggle('modoFoco')}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: '#E0EADD',
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: '#E0EADD',
                    },
                    '& .MuiSwitch-switchBase': {
                      color: '#A3BACF',
                    },
                    '& .MuiSwitch-track': {
                      backgroundColor: '#A3BACF',
                    },
                  }}
                />
              }
              label={
                <Typography 
                  sx={{ 
                    fontSize: '0.875rem',
                    color: preferences.modoFoco ? '#4A6572' : '#A3BACF'
                  }}
                >
                  {preferences.modoFoco ? 'Ativado' : 'Desativado'}
                </Typography>
              }
              labelPlacement="end"
            />
          </Box>
          <Typography 
            variant="body2" 
            sx={{ color: '#A3BACF' }}
          >
            Descrição modo foco
          </Typography>
        </Box>

        {/* Modo Resumo */}
        <Box className="bg-custom-cream rounded-lg p-6 shadow-sm border border-custom-fog">
          <Box className="flex items-center justify-between mb-2">
            <Typography 
              variant="h6" 
              sx={{ color: '#4A6572', fontWeight: 600 }}
              className="font-semibold"
            >
              Modo resumo
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={preferences.modoResumo}
                  onChange={() => handleToggle('modoResumo')}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: '#E0EADD',
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: '#E0EADD',
                    },
                    '& .MuiSwitch-switchBase': {
                      color: '#A3BACF',
                    },
                    '& .MuiSwitch-track': {
                      backgroundColor: '#A3BACF',
                    },
                  }}
                />
              }
              label={
                <Typography 
                  sx={{ 
                    fontSize: '0.875rem',
                    color: preferences.modoResumo ? '#4A6572' : '#A3BACF'
                  }}
                >
                  {preferences.modoResumo ? 'Ativado' : 'Desativado'}
                </Typography>
              }
              labelPlacement="end"
            />
          </Box>
          <Typography 
            variant="body2" 
            sx={{ color: '#A3BACF' }}
          >
            Descrição modo resumo
          </Typography>
        </Box>

        {/* Modo Simplificado */}
        <Box className="bg-custom-cream rounded-lg p-6 shadow-sm border border-custom-fog">
          <Box className="flex items-center justify-between mb-2">
            <Typography 
              variant="h6" 
              sx={{ color: '#4A6572', fontWeight: 600 }}
              className="font-semibold"
            >
              Modo simplificado
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={preferences.modoSimplificado}
                  onChange={() => handleToggle('modoSimplificado')}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: '#E0EADD',
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: '#E0EADD',
                    },
                    '& .MuiSwitch-switchBase': {
                      color: '#A3BACF',
                    },
                    '& .MuiSwitch-track': {
                      backgroundColor: '#A3BACF',
                    },
                  }}
                />
              }
              label={
                <Typography 
                  sx={{ 
                    fontSize: '0.875rem',
                    color: preferences.modoSimplificado ? '#4A6572' : '#A3BACF'
                  }}
                >
                  {preferences.modoSimplificado ? 'Ativado' : 'Desativado'}
                </Typography>
              }
              labelPlacement="end"
            />
          </Box>
          <Typography 
            variant="body2" 
            sx={{ color: '#A3BACF' }}
          >
            Descrição modo simplificado
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
};

export default PreferencesPage;
