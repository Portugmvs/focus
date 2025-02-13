import React, { useState, useEffect } from 'react';
import { Container, Grid, Typography, CssBaseline, Paper, IconButton, Box } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import TaskList from './components/TaskList';
import Timer from './components/Timer';
import XPProgress from './components/XPProgress';

// Hook para gerir a persistência no localStorage
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (err) {
      console.error('Erro ao ler do localStorage:', err);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      setStoredValue(value);
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.error('Erro ao guardar no localStorage:', err);
    }
  };

  return [storedValue, setValue];
}

const getDesignTokens = (mode) => ({
  palette: {
    mode,
    primary: {
      main: mode === 'dark' ? '#90caf9' : '#1976d2',
    },
    secondary: {
      main: mode === 'dark' ? '#f48fb1' : '#d81b60',
    },
    error: {
      main: '#ff1744',
    },
    background: {
      default: mode === 'dark' ? '#121212' : '#f5f5f5',
      paper: mode === 'dark' ? '#1e1e1e' : '#ffffff',
    },
    text: {
      primary: mode === 'dark' ? '#ffffff' : '#000000',
      secondary: mode === 'dark' ? '#b3b3b3' : '#4f4f4f',
    },
    action: {
      active: mode === 'dark' ? '#fff' : '#000',
      disabled: mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.26)',
    },
    divider: mode === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)',
  },
  components: {
    MuiIconButton: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: 'transparent',
          },
        },
      },
    },
  },
});

function App() {
  // Utilizamos o hook para gerir os dados de estudo, que incluem o xp_total e o histórico
  const [studyData, setStudyData] = useLocalStorage('studyData', { xp_total: 0, historico: [] });
  // O estado xp é derivado dos dados de estudo
  const [xp, setXP] = useState(studyData.xp_total);
  const [tasks, setTasks] = useState([]);
  const [themeMode, setThemeMode] = useState('dark');

  // Actualiza o estado xp sempre que o studyData mudar
  useEffect(() => {
    setXP(studyData.xp_total);
  }, [studyData]);

  useEffect(() => {
    // Carregar tasks guardadas, se existirem
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
    // Carregar o tema guardado
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme && ['dark', 'light'].includes(savedTheme)) {
      setThemeMode(savedTheme);
    }
  }, []);

  useEffect(() => {
    // Guardar tasks no localStorage sempre que mudarem
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const theme = createTheme(getDesignTokens(themeMode));

  const toggleTheme = () => {
    const newTheme = themeMode === 'dark' ? 'light' : 'dark';
    setThemeMode(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const handleStudyComplete = (elapsedMinutes) => {
    const xpGanho = Math.floor(elapsedMinutes / 5) * 20;
    if (xpGanho > 0) {
      // Cria uma cópia dos dados actuais e actualiza o xp_total e o histórico
      const newStudyData = { ...studyData };
      newStudyData.xp_total += xpGanho;
      newStudyData.historico = [
        ...newStudyData.historico,
        {
          data: new Date().toISOString(),
          descricao: `Estudo de ${elapsedMinutes} minutos`,
          xp: xpGanho
        }
      ];
      // Atualiza os dados de estudo, o que irá guardar automaticamente no localStorage
      setStudyData(newStudyData);
      setXP(newStudyData.xp_total);
    }
  };

  

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 4
          }}>
            <Typography variant="h3" color="primary">
              🚀 Study XP
            </Typography>
            <IconButton onClick={toggleTheme} color="inherit">
              {themeMode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TaskList tasks={tasks} setTasks={setTasks} xp={xp} setXP={setXP} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Timer onStudyComplete={handleStudyComplete} />
              <XPProgress xp={xp} />
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </ThemeProvider>
  );
}

export default App;
