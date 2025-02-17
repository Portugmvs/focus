import React from 'react';
import { 
  Container, 
  Grid, 
  CssBaseline, 
  Paper, 
  IconButton, 
  Box, 
  Typography 
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Brightness4, Brightness7, School } from '@mui/icons-material';
import { useLocalStorage } from './hooks/useLocalStorage';
import { HistoryProvider } from './contexts/HistoryContext';
// Certifique-se que o import está exatamente assim:
import TaskList from './components/TaskList/TaskList';
import PomodoroTimer from './components/PomodoroTimer/PomodoroTimer';
import XPSystem from './components/XPSystem/XPSystem';


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
      const level = Math.floor(newTotal / 1000) + 1;
      return {
        currentXP: prev.currentXP + amount,
        totalXP: newTotal,
        level
      };
    });
  };

  return (
    <HistoryProvider>
      <ThemeProvider theme={createTheme(themeCreator(themeMode))}>
        <CssBaseline />
        <Container maxWidth="lg" sx={{ py: 3 }}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 4 }}>
            {/* Header e XPSystem */}
            {/* Componentes do Grid */}
          </Paper>
        </Container>
      </ThemeProvider>
    </HistoryProvider>
  );
}

export default App;