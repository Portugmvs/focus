// File: /src/App.js
import React, { useMemo, useCallback, useState } from 'react';
import { Box, CssBaseline, Paper, IconButton, Typography, Button } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Brightness4, Brightness7, School, AutoAwesome } from '@mui/icons-material';
import { useLocalStorage } from './hooks/useLocalStorage';
import { HistoryProvider } from './contexts/HistoryContext';
import TaskList from './components/TaskList/TaskList';
import PomodoroTimer from './components/PomodoroTimer/PomodoroTimer';
import XPSystem from './components/XPSystem/XPSystem';
import TaskGenerator from './components/TaskList/TaskGenerator';
import { v4 as uuidv4 } from 'uuid';

const themeCreator = (mode) => ({
  palette: {
    mode,
    primary: {
      main: '#3291FF',
      light: '#66B8FF',
      dark: '#0066CC',
      contrastText: '#fff',
    },
    secondary: {
      main: '#FF0080',
      light: '#FF33A6',
      dark: '#CC0066',
      contrastText: '#fff',
    },
    success: {
      main: '#39DA8A',
      contrastText: '#000',
    },
    warning: {
      main: '#FFB84D',
      contrastText: '#000',
    },
    error: {
      main: '#F00',
      contrastText: '#fff',
    },
    background: {
      default: mode === 'dark' ? '#000' : '#fff',
      paper: mode === 'dark' ? '#111' : '#f9f9f9',
    },
    text: {
      primary: mode === 'dark' ? '#fff' : '#222',
      secondary: mode === 'dark' ? '#aaa' : '#777',
    },
    divider: mode === 'dark'
      ? 'rgba(255,255,255,0.12)'
      : 'rgba(0,0,0,0.12)',
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
    h4: {
      fontWeight: 800,
      fontSize: '2.75rem',
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
    },
    h5: {
      fontWeight: 700,
      fontSize: '2rem',
      lineHeight: 1.3,
      letterSpacing: '-0.02em',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.4,
      letterSpacing: '-0.02em',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    button: {
      fontWeight: 600,
      textTransform: 'initial',
    },
  },
  shape: { borderRadius: 8 },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: 'transparent',
          padding: 16,
          borderRadius: 12,
          border: mode === 'dark'
            ? '1px solid rgba(255,255,255,0.1)'
            : '1px solid rgba(0,0,0,0.08)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
          padding: '8px 20px',
        },
        containedPrimary: {
          color: '#fff',
          backgroundColor: '#3291FF',
          boxShadow: '0px 2px 4px rgba(0,0,0,0.2)',
          '&:hover': {
            backgroundColor: '#66B8FF',
            boxShadow: '0px 4px 8px rgba(0,0,0,0.3)',
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: mode === 'dark' ? '#fff' : '#222',
          borderRadius: 8,
          '&:hover': {
            backgroundColor: mode === 'dark' ? '#333' : '#eee',
          },
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          color: mode === 'dark' ? '#fff' : '#222',
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: mode === 'dark' ? '#000' : '#fff',
          margin: 0,
          padding: 0,
          overflow: 'hidden',
          '*::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
          },
          '*::-webkit-scrollbar-thumb': {
            backgroundColor: mode === 'dark' ? '#555' : '#aaa',
            borderRadius: '4px',
          },
          '*::-webkit-scrollbar-track': {
            backgroundColor: mode === 'dark' ? '#333' : '#eee',
          },
        },
      },
    },
  },
});

function App() {
  const [themeMode, setThemeMode] = useLocalStorage('theme', 'dark');
  const [tasks, setTasks] = useLocalStorage('tasks', []);
  const [xpData, setXPData] = useLocalStorage('xpData', {
    currentXP: 0,
    totalXP: 0,
    level: 1,
  });
  const [showTaskGenerator, setShowTaskGenerator] = useState(false);

  const handleXPChange = useCallback((amount) => {
    setXPData(prev => {
      const novoTotal = prev.totalXP + amount;
      const novoNivel = Math.floor(novoTotal / 1000) + 1;
      return {
        currentXP: prev.currentXP + amount,
        totalXP: novoTotal,
        level: novoNivel,
      };
    });
  }, [setXPData]);

  const handleAddGeneratedTasks = useCallback((generatedTasks) => {
    const novasTarefas = generatedTasks.map(tarefa => ({
      id: uuidv4(),
      text: tarefa,
      completed: false,
      createdAt: new Date().toISOString(),
    }));
    setTasks(prev => [...prev, ...novasTarefas]);
    setShowTaskGenerator(false);
  }, [setTasks]);

  const theme = useMemo(() => createTheme(themeCreator(themeMode)), [themeMode]);

  return (
    <HistoryProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {/* Layout geral: sem scroll externo, ocupando 100% da ecrã */}
        <Box display="flex" flexDirection="column" height="100vh" width="100vw">
          {/* Cabeçalho */}
          <Box display="flex" justifyContent="space-between" alignItems="center" p={2} borderBottom={`1px solid ${theme.palette.divider}`}>
            <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center' }}>
              <School sx={{ mr: 1, fontSize: 36, color: theme.palette.primary.main }} />
              Pomodoro App
            </Typography>
            <IconButton onClick={() => setThemeMode(themeMode === 'dark' ? 'light' : 'dark')} color="inherit">
              {themeMode === 'dark' ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
          </Box>

          {/* Conteúdo Principal */}
          <Box display="flex" flex={1}>
            {/* Coluna Esquerda: Pomodoro e XP */}
            <Box flex={1} display="flex" flexDirection="column" justifyContent="center" alignItems="center" p={2}>
              <Paper elevation={0} sx={{ mb: 2, p: 3, width: '90%', border: '1px solid', borderColor: theme.palette.divider, borderRadius: '12px' }}>
                <XPSystem xpData={xpData} />
              </Paper>
              <Paper elevation={0} sx={{ p: 3, width: '90%', border: '1px solid', borderColor: theme.palette.divider, borderRadius: '12px' }}>
                <PomodoroTimer onTimerComplete={(minutos) => handleXPChange(minutos * 10)} />
              </Paper>
            </Box>

            {/* Coluna Direita: Tarefas (com botão de IA integrado) */}
            <Box flex={1} display="flex" flexDirection="column" p={2}>
              {/* Cabeçalho da aba de tarefas */}
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h5">Tarefas</Typography>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AutoAwesome />}
                  onClick={() => setShowTaskGenerator(prev => !prev)}
                >
                  {showTaskGenerator ? 'Ocultar IA' : 'Gerar Tarefas com IA'}
                </Button>
              </Box>
              {/* Se ativado, mostra o gerador de tarefas com IA */}
              {showTaskGenerator && (
                <Paper elevation={0} sx={{ mb: 2, p: 3, border: '1px solid', borderColor: theme.palette.divider, borderRadius: '12px' }}>
                  <TaskGenerator onAddTasks={handleAddGeneratedTasks} />
                </Paper>
              )}
              {/* Lista de Tarefas */}
              <Paper elevation={0} sx={{ flex: 1, p: 3, border: '1px solid', borderColor: theme.palette.divider, borderRadius: '12px', overflow: 'auto' }}>
                <TaskList tasks={tasks} setTasks={setTasks} onTaskComplete={() => handleXPChange(50)} />
              </Paper>
            </Box>
          </Box>
        </Box>
      </ThemeProvider>
    </HistoryProvider>
  );
}

export default App;
