// File: /src/components/PomodoroTimer/PomodoroTimer.js
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Button, Slider, IconButton, CircularProgress } from '@mui/material';
import { PlayArrow, Pause, Replay } from '@mui/icons-material';
import { formatTime } from '../../utils/formatUtils'; // ✏️ Import formatTime do utils

const PomodoroTimer = ({ onTimerComplete }) => {
<<<<<<< HEAD
  const [mode, setMode] = useState('work');
  const [originalStudyTime, setOriginalStudyTime] = useState(25);
  const [remainingTime, setRemainingTime] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);

  // Função para tocar o som de notificação
  const playSound = () => {
    const audio = new Audio('/beep.mp3');
    audio.play();
  };

  useEffect(() => {
    let interval;
    if (isActive) {
      interval = setInterval(() => {
        setRemainingTime((prev) => {
          if (prev <= 1) {
            playSound();
            if (mode === 'work') {
              if (onTimerComplete) {
                onTimerComplete(originalStudyTime);
              }
              const breakMinutes = Math.max(1, Math.round(originalStudyTime / 5));
              setMode('break');
              return breakMinutes * 60;
            } else {
              setMode('work');
              return originalStudyTime * 60;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, mode, originalStudyTime, onTimerComplete]);

  const handleStartPause = () => {
    setIsActive(!isActive);
  };

  const handleReset = () => {
    if (mode === 'work') {
      setRemainingTime(originalStudyTime * 60);
    } else {
      const breakMinutes = Math.max(1, Math.round(originalStudyTime / 5));
      setRemainingTime(breakMinutes * 60);
    }
    setIsActive(false);
  };

  const handleSliderChange = (e, value) => {
    if (mode === 'work') {
      setOriginalStudyTime(value);
      setRemainingTime(value * 60);
      setIsActive(false);
    }
  };

  const minutes = Math.floor(remainingTime / 60);
  const seconds = remainingTime % 60;
  const totalSeconds =
    mode === 'work'
      ? originalStudyTime * 60
      : Math.max(1, Math.round(originalStudyTime / 5)) * 60;
  const progress = ((totalSeconds - remainingTime) / totalSeconds) * 100;
=======
  const [mode, setMode] = useState('work'); // 'work', 'shortBreak', 'longBreak'
  const [originalStudyTime, setOriginalStudyTime] = useState(25); // tempo de estudo em minutos
  const [shortBreakTime, setShortBreakTime] = useState(5); // tempo de pausa curta
  const [longBreakTime, setLongBreakTime] = useState(15); // tempo de pausa longa
  const [remainingTime, setRemainingTime] = useState(25 * 60); // tempo restante em segundos
  const [isActive, setIsActive] = useState(false);
  const [pomodoroCycle, setPomodoroCycle] = useState(1); // Controlo de ciclos pomodoro
  const [cyclesUntilLongBreak, setCyclesUntilLongBreak] = useState(4); // Ciclos até pausa longa

  const formatTime = (time) => String(time).padStart(2, '0');

  const playSound = () => {
    const audio = new Audio('/beep.mp3');
    audio.play();
  };

  useEffect(() => {
    let interval;
    if (isActive) {
      interval = setInterval(() => {
        setRemainingTime((prev) => {
          if (prev <= 1) {
            // O tempo acabou: toca o som e alterna o modo
            playSound();
            if (mode === 'work') {
              // Fim do estudo: callback, decide pausa (curta/longa) ou próximo ciclo de estudo
              if (onTimerComplete) {
                onTimerComplete(originalStudyTime);
              }

              if (pomodoroCycle % cyclesUntilLongBreak === 0) {
                // Pausa Longa
                setMode('longBreak');
                setPomodoroCycle(pomodoroCycle + 1);
                return longBreakTime * 60;
              } else {
                // Pausa Curta
                setMode('shortBreak');
                setPomodoroCycle(pomodoroCycle + 1);
                return shortBreakTime * 60;
              }
            } else {
              // Fim da pausa (curta ou longa): volta ao modo estudo
              setMode('work');
              return originalStudyTime * 60;
            }
          }
          return prev - 1;
        });
      }, 1000); // Atualiza a cada segundo
    }
    return () => clearInterval(interval);
  }, [isActive, mode, originalStudyTime, shortBreakTime, longBreakTime, cyclesUntilLongBreak, pomodoroCycle, onTimerComplete]);

  // Inicia ou pausa o timer
  const handleStartPause = () => {
    setIsActive(!isActive);
  };

  // Reinicia o timer conforme o modo actual
  const handleReset = () => {
    setIsActive(false); // Pausa o timer primeiro
    if (mode === 'work') {
      setRemainingTime(originalStudyTime * 60);
    } else if (mode === 'shortBreak') {
      const breakMinutes = shortBreakTime;
      setRemainingTime(breakMinutes * 60);
    } else if (mode === 'longBreak') {
      const breakMinutes = longBreakTime;
      setRemainingTime(breakMinutes * 60);
    }
    setIsActive(false);
  };

  // Atualiza o tempo de estudo quando o slider é alterado (apenas no modo estudo)
  const handleSliderChange = (e, value) => {
    if (mode === 'work') {
      setOriginalStudyTime(value);
      setRemainingTime(value * 60);
      setIsActive(false);
    }
  };

  const minutes = Math.floor(remainingTime / 60);
  const seconds = remainingTime % 60;
>>>>>>> a927fb649594659651e28ac2ff9dbef30f1ec777

  // Calcula o tempo total para o ciclo atual para a barra de progresso
  const getTotalSecondsForMode = () => {
    switch (mode) {
      case 'work':
        return originalStudyTime * 60;
      case 'shortBreak':
        return shortBreakTime * 60;
      case 'longBreak':
        return longBreakTime * 60;
      default:
        return 0;
    }
  };

  const totalSeconds = getTotalSecondsForMode();
  const progress = ((totalSeconds - remainingTime) / totalSeconds) * 100;

  // Define o texto do cabeçalho baseado no modo
  const getHeaderText = () => {
    switch (mode) {
      case 'work':
        return 'Tempo de Estudo';
      case 'shortBreak':
        return 'Pausa Curta';
      case 'longBreak':
        return 'Pausa Longa';
      default:
        return 'Pomodoro Timer';
    }
  };

  // Define a cor da barra de progresso baseada no modo
  const getProgressColor = () => {
    if (mode === 'work') return 'primary.main';
    if (mode === 'shortBreak') return 'secondary.main';
    if (mode === 'longBreak') return 'success.main'; // Cor diferente para pausa longa
    return 'primary.main'; // Cor padrão
  };

<<<<<<< HEAD
        <IconButton onClick={handleReset}>
          <Replay />
        </IconButton>
      </Box>
=======
  return (
    <Box sx={{ textAlign: 'center' }}>
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        ⏱️ {getHeaderText()}
      </Typography>
>>>>>>> a927fb649594659651e28ac2ff9dbef30f1ec777

      <Box sx={{ position: 'relative', display: 'inline-flex', mb: 2 }}>
        <CircularProgress
          variant="determinate"
          value={progress}
          size={120}
          thickness={2}
          sx={{
            color: getProgressColor(),
            '& .MuiCircularProgress-circle': {
              transition: 'stroke-dashoffset 1s linear'
            }
          }}
        />

        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
          }}
        >
          <Typography variant="h4" component="div">
            {formatTime(minutes)}:{formatTime(seconds)}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 3 }}>
        <Button
          variant="contained"
          color={mode === 'work' ? 'primary' : 'secondary'}
          onClick={handleStartPause} // Inicia e pausa o timer
          startIcon={isActive ? <Pause /> : <PlayArrow />}
        >
          {isActive ? 'Pausar' : 'Iniciar'}
        </Button>

        <IconButton onClick={handleReset} aria-label="Reiniciar timer">
          <Replay />
        </IconButton>
      </Box>

      {mode === 'work' && ( // Slider de tempo de estudo só aparece no modo 'work'
        <Slider
          value={originalStudyTime}
          min={1}
          max={60}
          onChange={handleSliderChange}
          sx={{ width: '80%', mx: 'auto' }}
        />
      )}
    </Box>
  );
};

PomodoroTimer.propTypes = {
  onTimerComplete: PropTypes.func
};

export default PomodoroTimer;