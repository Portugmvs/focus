// File: /src/App.js
import React, { useState } from 'react';
import { Container, Grid, CssBaseline, Paper, IconButton, Box, Typography, Drawer, Toolbar } from '@mui/material'; // Importa Drawer e Toolbar
import { ThemeProvider, createTheme, styled } from '@mui/material/styles';
import { Brightness4, Brightness7, Task, EmojiEvents } from '@mui/icons-material'; // Adicionado EmojiEvents para XP
import { useLocalStorage } from './hooks/useLocalStorage';
import { HistoryProvider } from './contexts/HistoryContext';
import TaskList from './components/TaskList/TaskList';
import PomodoroTimer from './components/PomodoroTimer/PomodoroTimer';
import LevelUpSnackbar from './components/XPSystem/LevelUpSnackbar';
import XPSystem from './components/XPSystem/XPSystem';
import TaskGenerator from './components/TaskList/TaskGenerator';
import { v4 as uuidv4 } from 'uuid';

const drawerWidth = 240; // Largura da barra lateral

const BackgroundContainer = styled(Container)(({ theme }) => ({
    minHeight: '100vh',
    paddingTop: theme.spacing(0), // Remove padding top/bottom para layout barra lateral
    paddingBottom: theme.spacing(0),
    backgroundColor: theme.palette.mode === 'dark' ?
        '#080808' // Preto absoluto para o fundo dark
        : '#f0f0f0', // Cinza claro para fundo light
}));

const MainContent = styled(Box)(({ theme }) => ({
    // marginLeft: drawerWidth, // Empurra o conteúdo principal para a direita
    padding: theme.spacing(3),
    // backgroundColor: 'inherit', // Cor de fundo transparente para MainContent
    // width: `calc(100% - ${drawerWidth}px)`,
}));


const themeCreator = (mode) => ({
    palette: {
        mode,
        primary: {
            main: mode === 'dark' ? '#00f2ea' : '#00bcd4', // Ciano Neon / Ciano Padrão
        },
        secondary: {
            main: mode === 'dark' ? '#ff6f5e' : '#ff9800', // Laranja Vibrante / Laranja Padrão
        },
        background: {
            default: mode === 'dark' ? '#080808' : '#f0f0f0', // Preto absoluto / Cinza claro
            paper: mode === 'dark' ? '#181818' : '#ffffff', // Cinza muito escuro / Branco
        },
        text: {
            primary: mode === 'dark' ? 'rgba(255, 255, 255, 0.95)' : 'rgba(0, 0, 0, 0.87)',
            secondary: mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
        },
    },
    typography: {
        fontFamily: "'Roboto Mono', monospace", // Fonte monoespaçada para um toque "cyberpunk"
        fontSize: 14,
        fontWeightRegular: 400,
        fontWeightMedium: 500,
        fontWeightBold: 700,
        h1: {
            fontWeight: 700,
            fontSize: '3rem', // Títulos ainda maiores
        },
        h2: {
            fontWeight: 700,
            fontSize: '2.5rem',
        },
        h3: {
            fontWeight: 600,
            fontSize: '2rem',
        },
        h4: {
            fontWeight: 600,
            fontSize: '1.75rem',
        },
        h5: {
            fontWeight: 500,
            fontSize: '1.5rem',
        },
        h6: {
            fontWeight: 500,
            fontSize: '1.25rem',
        },
        subtitle1: { // Subtítulo com fonte menor e itálico para o slogan
            fontSize: '1rem',
            fontStyle: 'italic',
            color: mode === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
        },
    },
    shape: {
        borderRadius: 4, // Bordas mais quadradas para um estilo mais "digital"
    },
    components: {
        MuiPaper: {
            styleOverrides: {
                elevation6: {
                    boxShadow: '0px 3px 5px rgba(0,0,0,0.15)', // Reintroduz uma sombra suave, mais consistente com o estilo cyberpunk
                    border: 'none', // Remove borda
                },
                root: {
                    backgroundColor: theme => theme.palette.background.paper,
                    // padding: theme.spacing(2), // Adiciona padding padrão aos Papers (removido para layout sidebar)
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                contained: {
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: '0px 2px 3px rgba(0,0,0,0.20)', // Sombra suave no hover
                    },
                },
            },
        },
        MuiIconButton: {
            styleOverrides: {
                root: {
                    color: mode => mode === 'dark' ? '#999' : '#555', // IconButtons mais discretos no tema dark
                    '&:hover': {
                        color: mode => mode === 'dark' ? '#fff' : '#000', // Hover mais destacado
                        backgroundColor: 'transparent', // Remove background color hover
                    },
                },
            },
        },
        MuiSlider: { // Mantém o estilo do Slider (pode ajustar se necessário)
            styleOverrides: {
                root: {
                    color: theme => theme.palette.primary.main,
                    '& .MuiSlider-thumb': {
                        color: theme => theme.palette.background.paper,
                        '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
                            boxShadow: '0 3px 1px rgba(0,0,0,0.12),0 4px 8px rgba(0,0,0,0.24),0 0 0 1px rgba(0,0,0,.08)',
                        },
                    },
                    '& .MuiSlider-track': {
                        color: theme => theme.palette.primary.main,
                    },
                    '& .MuiSlider-rail': {
                        color: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : '#d1d5db',
                    },
                },
            },
        },
        MuiCircularProgress: {
            styleOverrides: {
                root: {
                    '& .MuiCircularProgress-circle': {
                        strokeLinecap: 'round',
                    },
                },
            },
        },
        MuiDrawer: { // Estilo para a barra lateral (Drawer)
            styleOverrides: {
                paper: {
                    backgroundColor: theme => theme.palette.background.paper,
                    borderRight: 'none', // Remove a borda padrão do Drawer
                },
            },
        },
        MuiToolbar: { // Estilo para a Toolbar dentro do Drawer
            styleOverrides: {
                root: {
                    display: 'flex',
                    flexDirection: 'column', // Organiza os itens verticalmente
                    alignItems: 'flex-start', // Alinha os itens à esquerda
                    padding: theme => theme.spacing(2),
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

    const handleAddGeneratedTasks = (generatedTasks) => {
        const tasksToAdd = generatedTasks.map(taskText => ({
            id: uuidv4(),
            text: taskText,
            completed: false,
            createdAt: new Date().toISOString()
        }));
        setTasks([...tasks, ...tasksToAdd]);
    };

    const [levelUpSnackbarOpen, setLevelUpSnackbarOpen] = useState(false);
    const [levelUpLevel, setLevelUpLevel] = useState(null);

    const handleLevelUp = (level) => {
        setLevelUpLevel(level);
        setLevelUpSnackbarOpen(true);
    };

    const theme = createTheme(themeCreator(themeMode));

    return (
        <HistoryProvider>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Box sx={{ display: 'flex' }}> {/* Box pai para o layout horizontal */}
                    {/* Barra Lateral (Drawer) para o Sistema de XP */}
                    <Drawer
                        variant="permanent"
                        anchor="left"
                        PaperProps={{ elevation: 6 }} // Adiciona elevação ao Drawer Paper
                        sx={{
                            width: drawerWidth,
                            flexShrink: 0,
                            '& .MuiDrawer-paper': {
                                width: drawerWidth,
                                boxSizing: 'border-box',
                            },
                        }}
                    >
                        <Toolbar> {/* Toolbar para conter o conteúdo da barra lateral */}
                            <Box sx={{ mb: 3, textAlign: 'left', width: '100%' }}>
                                <Box display="flex" alignItems="center" mb={1}>
                                    <EmojiEvents sx={{ mr: 1, fontSize: 28, color: theme.palette.primary.main }} />
                                    <Typography variant="h6" component="h2" sx={{ fontWeight: 500 }}>
                                        XP System
                                    </Typography>
                                </Box>
                                <XPSystem xpData={xpData} onLevelUp={handleLevelUp} />
                            </Box>
                        </Toolbar>
                        <Box mt="auto" p={2} textAlign="left"> {/* Theme Toggle no rodapé da sidebar */}
                            <IconButton
                                onClick={() => setThemeMode(themeMode === 'dark' ? 'light' : 'dark')}
                                color="inherit"
                                aria-label={`Mudar para tema ${themeMode === 'dark' ? 'claro' : 'escuro'}`}
                                size="small"
                            >
                                {themeMode === 'dark' ? <Brightness7 /> : <Brightness4 />}
                            </IconButton>
                            <Typography variant="caption" component="p" ml={1}>
                                Tema {themeMode === 'dark' ? 'Dark' : 'Light'}
                            </Typography>
                        </Box>
                    </Drawer>


                    {/* Conteúdo Principal à Direita da Barra Lateral */}
                    <MainContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', minWidth: 0 }}> {/* flexGrow para ocupar o espaço restante */}
                        <BackgroundContainer maxWidth="xl"> {/* Container maxWidth xl para layout horizontal */}
                            <Paper elevation={6} sx={{ p: 4, mb: 4, maxWidth: '100%', width: '100%' }}> {/* Paper com largura máxima */}
                                {/* Cabeçalho - Mais minimalista e centralizado */}
                                <Box textAlign="center" mb={4}>
                                    <Box display="flex" justifyContent="center" alignItems="center" mb={2}>
                                        <Task sx={{ mr: 1, fontSize: 36, color: theme.palette.primary.main }} /> {/* Ícone de Task como logo */}
                                        <Typography variant="h5" component="h1" sx={{ fontWeight: 500 }}> {/* Título menor e mais leve */}
                                            Pomodoro App
                                        </Typography>
                                    </Box>
                                    <Typography variant="subtitle1" color="textSecondary">
                                        Foco Laser, Produtividade Imbatível.
                                    </Typography>
                                </Box>


                                <Grid container spacing={4} justifyContent="center"> {/* Justify content center para alinhar os items horizontalmente */}
                                    {/* Pomodoro Timer - Mais espaçoso */}
                                    <Grid item xs={12} md={6} lg={5}> {/* Ajusta md e lg para o tamanho desejado no layout horizontal */}
                                        <Box p={3} bgcolor="background.paper" borderRadius={theme.shape.borderRadius} textAlign="center" height="100%" display="flex" flexDirection="column"> {/* 100% height e flex para ocupar a altura */}
                                            <PomodoroTimer onTimerComplete={(minutes) => handleXPChange(minutes * 10)} />
                                        </Box>
                                    </Grid>

                                    {/* Task List - Lado a Lado com o Timer */}
                                    <Grid item xs={12} md={6} lg={5}> {/* Ajusta md e lg para o tamanho desejado no layout horizontal */}
                                        <Box p={3} bgcolor="background.paper" borderRadius={theme.shape.borderRadius} height="100%" display="flex" flexDirection="column"> {/* 100% height e flex para ocupar a altura */}
                                            <TaskList
                                                tasks={tasks}
                                                setTasks={setTasks}
                                                onTaskComplete={() => handleXPChange(50)}
                                            />
                                        </Box>
                                    </Grid>
                                </Grid>


                                {/* Task Generator - Mantém na largura total, alinhado com os outros, abaixo dos componentes lado a lado */}
                                <Grid container> {/* Container para TaskGenerator ocupar a largura total novamente */}
                                    <Grid item xs={12}>
                                        <Box mt={5} pt={3} borderTop={1} borderColor="divider" textAlign="center"> {/* Adiciona linha superior para separar */}
                                            <TaskGenerator onAddTasks={handleAddGeneratedTasks} />
                                        </Box>
                                    </Grid>
                                </Grid>


                            </Paper>
                        </BackgroundContainer>
                    </MainContent>


                    {/* Snackbar de Level Up - Sem alterações */}
                    <LevelUpSnackbar
                        open={levelUpSnackbarOpen} level={levelUpLevel} setOpen={setLevelUpSnackbarOpen} levelUpLevel={levelUpLevel}
                    />
                </Box>
            </ThemeProvider>
        </HistoryProvider>
    );
}

export default App;