// File: /src/App.js
import React from 'react';
import { Container, Grid, CssBaseline, Paper, IconButton, Box, Typography, AppBar, Toolbar } from '@mui/material';
import { ThemeProvider, createTheme, styled } from '@mui/material/styles';
import { Brightness4, Brightness7, School } from '@mui/icons-material';
import { useLocalStorage } from './hooks/useLocalStorage';
import { HistoryProvider } from './contexts/HistoryContext';
import TaskList from './components/TaskList/TaskList';
import PomodoroTimer from './components/PomodoroTimer/PomodoroTimer';
import XPSystem from './components/XPSystem/XPSystem';
import TaskGenerator from './components/TaskList/TaskGenerator';
import { v4 as uuidv4 } from 'uuid';

// Componente Container estilizado para o fundo com gradiente escuro
const BackgroundContainer = styled(Container)(({ theme }) => ({
  minHeight: '100vh',
  paddingTop: theme.spacing(0),
  paddingBottom: theme.spacing(0),
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(315deg, #0b0b0b 0%, #1a2a6c 74%)'
    : 'linear-gradient(135deg, #f8f9fa, #ffffff)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
}));

// Paper estilizado para os boxes dos elementos
const ElementBox = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.7)',
  backdropFilter: 'blur(5px)',
  marginBottom: theme.spacing(2),
}));

// AppBar estilizada para o cabeçalho superior fixo
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(25, 25, 25, 0.9)' : 'rgba(245, 245, 245, 0.95)',
  backdropFilter: 'blur(10px)',
  position: 'fixed',
  width: '100%',
  zIndex: theme.zIndex.appBar + 1,
}));

// Toolbar estilizada
const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingLeft: theme.spacing(1),
  paddingRight: theme.spacing(1),
}));


// Tema MUI com tons escuros e layout com boxes
const themeCreator = (mode) => ({
  palette: {
    mode,
    primary: { main: mode === 'dark' ? '#64ffda' : '#3d5afe' },
    secondary: { main: mode === 'dark' ? '#ffab40' : '#ff9100' },
    background: {
      default: mode === 'dark' ? '#0b0b0b' : '#f0f0f0',
      paper: mode === 'dark' ? 'rgba(30, 30, 30, 0.8)' : '#ffffff'
    },
    text: {
      primary: mode === 'dark' ? '#fff' : '#333',
      secondary: mode === 'dark' ? '#b2b2b2' : '#666'
    },
  },
  typography: {
    fontFamily: "'Roboto Mono', monospace",
    h4: { fontWeight: 600, fontSize: '1.6rem' },
    h6: { fontWeight: 500, fontSize: '1rem' }
  },
  shape: {
    borderRadius: 8
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        colorPrimary: ({ theme, mode }) => ({
          backgroundColor: mode === 'dark' ? 'rgba(25, 25, 25, 0.9)' : 'rgba(245, 245, 245, 0.95)',
          backdropFilter: 'blur(10px)'
        })
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: ({ theme, mode }) => ({
          backgroundColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(5px)'
        })
      }
    },
    MuiButton: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: 4,
          fontWeight: 500,
          fontSize: '0.85rem'
        }),
        contained: ({ theme }) => ({
          boxShadow: theme.shadows[1],
          '&:hover': ({ theme }) => ({
            boxShadow: theme.shadows[3]
          })
        }),
        outlined: ({ theme, mode }) => ({
          borderColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.23)' : 'rgba(0, 0, 0, 0.23)',
          '&:hover': ({ theme, mode }) => ({
            backgroundColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)'
          })
        })
      }
    },
    MuiIconButton: {
      styleOverrides: {
        root: ({ theme, mode }) => ({
          borderRadius: 4,
          padding: theme.spacing(0.75),
          '&:hover': ({ theme, mode }) => ({
            backgroundColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)'
          })
        })
      }
    },
    MuiSlider: {
      styleOverrides: {
        root: ({ theme }) => ({
          color: theme.palette.primary.main,
          height: 5,
          '& .MuiSlider-thumb': ({ theme }) => ({
            width: 10,
            height: 10,
            color: theme.palette.background.paper,
            '&:before': {
              fontSize: '0.7rem'
            },
            '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': ({ theme }) => ({
              boxShadow: `0 2px 1px rgba(0,0,0,0.1),0 3px 6px rgba(0,0,0,0.18),0 0 0 1px ${theme.palette.primary.main}`,
            }),
          }),
          '& .MuiSlider-valueLabel': ({ theme }) => ({
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
            fontSize: '0.7rem',
            fontWeight: 'normal',
            padding: '2px 5px'
          }),
          '& .MuiSlider-track': {
            height: 5,
          },
          '& .MuiSlider-rail': {
            height: 5,
            opacity: 0.5
          }
        })
      }
    },
    MuiCircularProgress: {
      styleOverrides: {
        root: ({ theme }) => ({
          color: theme.palette.primary.main,
          size: '28px',
          thickness: 3
        })
      }
    },
    MuiTypography: {
      styleOverrides: {
        root: ({ theme }) => ({
          fontSize: '0.85rem'
        }),
        body1: ({ theme }) => ({
          fontSize: '0.95rem'
        }),
        body2: ({ theme }) => ({
          fontSize: '0.85rem'
        }),
        subtitle1: ({ theme }) => ({
          fontSize: '0.85rem'
        }),
        subtitle2: ({ theme }) => ({
          fontSize: '0.75rem'
        }),
        caption: ({ theme }) => ({
          fontSize: '0.65rem'
        })
      }
    },
    MuiList: {
      styleOverrides: {
        root: ({ theme }) => ({
          paddingTop: 0,
          paddingBottom: 0
        })
      }
    },
    MuiListItem: {
      styleOverrides: {
        root: ({ theme }) => ({
          paddingTop: theme.spacing(0.5),
          paddingBottom: theme.spacing(0.5),
          marginBottom: theme.spacing(0.25)
        })
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: ({ theme }) => ({
          fontSize: '0.85rem'
        })
      }
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: ({ theme }) => ({
          paddingBottom: theme.spacing(1)
        })
      }
    },
    MuiDialogContent: {
      styleOverrides: {
        root: ({ theme }) => ({
          padding: theme.spacing(2)
        })
      }
    },
    MuiDialogActions: {
      styleOverrides: {
        root: ({ theme }) => ({
          padding: theme.spacing(1)
        })
      }
    }
  }
});


function App() {
  // Hooks
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
      return { currentXP: prev.currentXP + amount, totalXP: newTotal, level: newLevel };
    });
  };

  const handleAddGeneratedTasks = (generatedTasks) => {
    const tasksToAdd = generatedTasks.map(taskText => ({ id: uuidv4(), text: taskText, completed: false, createdAt: new Date().toISOString() }));
    setTasks([...tasks, ...tasksToAdd]);
  };

  // Tema MUI
  const theme = createTheme(themeCreator(themeMode));

  return (
    <HistoryProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BackgroundContainer maxWidth="xl">

          <StyledAppBar position="static" color="transparent" elevation={0}>
            <StyledToolbar>
              <Typography variant="h4" component="h1" sx={{ display: 'flex', alignItems: 'center', color: 'text.primary' }}>
                <School sx={{ mr: 1, fontSize: 24 }} />
                Pomodoro App
              </Typography>
              <IconButton onClick={() => setThemeMode(themeMode === 'dark' ? 'light' : 'dark')} color="inherit">
                {themeMode === 'dark' ? <Brightness7 sx={{ fontSize: 18 }} /> : <Brightness4 sx={{ fontSize: 18 }} />}
              </IconButton>
            </StyledToolbar>
          </StyledAppBar>

          <Box sx={{ paddingTop: 6, paddingX: 2, display: 'flex', flexDirection: 'column', alignItems: 'stretch', height: 'calc(100vh - 64px)' }}>

            <ElementBox>
              <XPSystem xpData={xpData} />
            </ElementBox>

            <Grid container spacing={2} sx={{ flexGrow: 1 }}>

              <Grid item xs={12} md={6}>
                <ElementBox sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="h6" gutterBottom>Tempo de Estudo</Typography>
                  <PomodoroTimer onTimerComplete={(minutes) => handleXPChange(minutes * 10)} />
                </ElementBox>
              </Grid>

              <Grid item xs={12} md={6}>
                <ElementBox sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="h6" gutterBottom>Tarefas ({tasks.filter(t => !t.completed).length} pendentes)</Typography>
                  <TaskList tasks={tasks} setTasks={setTasks} onTaskComplete={() => handleXPChange(50)} sx={{ flexGrow: 1, overflow: 'auto' }} />
                  <TaskGenerator onAddTasks={handleAddGeneratedTasks} sx={{ mt: 2 }} />
                </ElementBox>
              </Grid>

            </Grid>

            <Typography variant="caption" color="textSecondary" align="center" sx={{ mt: 2, pb: 2 }}>
              Desenvolvido com ❤️ por um Humano em Aprendizagem Contínua.
            </Typography>
          </Box>

        </BackgroundContainer>
      </ThemeProvider>
    </HistoryProvider>
  );
}

export default App;