// File: /src/App.js
import React from 'react';
import { Container, Grid, CssBaseline, Paper, IconButton, Box, Typography } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Brightness4, Brightness7, School } from '@mui/icons-material';
import { useLocalStorage } from './hooks/useLocalStorage';
import { HistoryProvider } from './contexts/HistoryContext';
import TaskList from './components/TaskList/TaskList';
import PomodoroTimer from './components/PomodoroTimer/PomodoroTimer';
import XPSystem from './components/XPSystem/XPSystem';
import TaskGenerator from './components/TaskGenerator';
import { v4 as uuidv4 } from 'uuid';

const themeCreator = (mode) => ({
  palette: {
    mode,
    primary: { main: mode === 'dark' ? '#7c4dff' : '#3d5afe' },
    secondary: { main: mode === 'dark' ? '#ff6d00' : '#ff9100' },
    background: {
      default: mode === 'dark' ? '#121212' : '#f8f9fa',
      paper: mode === 'dark' ? '#1e1e1e' : '#ffffff'
    }
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
    h3: { fontWeight: 700 }
  },
  shape: { borderRadius: 12 }
});

function App() {
  const [themeMode, setThemeMode] = useLocalStorage('theme', 'dark');
  const [tasks, setTasks] = useLocalStorage('tasks', []);
  const [xpData, setXPData] = useLocalStorage('xpData', {
    currentXP: 0,
    totalXP: 0,
    level: 1
  });

  const handleXPChange = (amount) => {
    setXPData(prev => {
      const newTotal = prev.totalXP + amount;
      const newLevel = Math.floor(newTotal / 1000) + 1;
      return {
        currentXP: prev.currentXP + amount,
        totalXP: newTotal,
        level: newLevel
      };
    });
  };

  // Função para adicionar tarefas geradas
  const handleAddGeneratedTasks = (generatedTasks) => {
    const tasksToAdd = generatedTasks.map(taskText => ({
      id: uuidv4(),
      text: taskText,
      completed: false,
      createdAt: new Date().toISOString()
    }));
    setTasks([...tasks, ...tasksToAdd]);
  };

  const theme = createTheme(themeCreator(themeMode));

  return (
    <HistoryProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Container maxWidth="lg" sx={{ py: 3 }}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 4 }}>
            <Grid container spacing={2}>
              {/* Cabeçalho */}
              <Grid item xs={12}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h4" component="h1" sx={{ display: 'flex', alignItems: 'center' }}>
                    <School sx={{ mr: 1 }} />
                    Pomodoro App
                  </Typography>
                  <IconButton
                    onClick={() => setThemeMode(themeMode === 'dark' ? 'light' : 'dark')}
                    color="inherit"
                  >
                    {themeMode === 'dark' ? <Brightness7 /> : <Brightness4 />}
                  </IconButton>
                </Box>
              </Grid>

              {/* Sistema de XP */}
              <Grid item xs={12}>
                <XPSystem xpData={xpData} />
              </Grid>

              {/* Temporizador de Pomodoro */}
              <Grid item xs={12} md={6}>
                <PomodoroTimer onTimerComplete={(minutes) => handleXPChange(minutes * 10)} />
              </Grid>

              {/* Lista de Tarefas */}
              <Grid item xs={12} md={6}>
                <TaskList
                  tasks={tasks}
                  setTasks={setTasks}
                  onTaskComplete={() => handleXPChange(50)}
                />
              </Grid>

              {/* Componente para gerar tarefas automaticamente */}
              <Grid item xs={12}>
                <TaskGenerator onAddTasks={handleAddGeneratedTasks} />
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </ThemeProvider>
    </HistoryProvider>
  );
}

export default App;
