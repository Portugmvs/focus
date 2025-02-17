// File: /src/components/PomodoroTimer/PomodoroTimer.js
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Button, Slider, IconButton, CircularProgress } from '@mui/material';
import { PlayArrow, Pause, Replay } from '@mui/icons-material';

const PomodoroTimer = ({ onTimerComplete }) => {
  const [mode, setMode] = useState('work'); // 'work' para estudo, 'break' para intervalo
  const [originalStudyTime, setOriginalStudyTime] = useState(25); // tempo de estudo em minutos
  const [remainingTime, setRemainingTime] = useState(25 * 60); // tempo restante em segundos
  const [isActive, setIsActive] = useState(false);

  // Função para formatar o tempo (minutos e segundos)
  const formatTime = (time) => String(time).padStart(2, '0');

  // Função para tocar o som de notificação (certifica-te de que tens o ficheiro beep.mp3 na pasta public)
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
              // Quando acaba o estudo, chama o callback (se existir) e troca para intervalo
              if (onTimerComplete) {
                onTimerComplete(originalStudyTime);
              }
              const breakMinutes = Math.max(1, Math.round(originalStudyTime / 5));
              setMode('break');
              return breakMinutes * 60;
            } else {
              // Quando acaba o intervalo, volta para o modo estudo com o tempo original
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

  // Inicia ou pausa o timer
  const handleStartPause = () => {
    setIsActive(!isActive);
  };

  // Reinicia o timer conforme o modo actual
  const handleReset = () => {
    if (mode === 'work') {
      setRemainingTime(originalStudyTime * 60);
    } else {
      const breakMinutes = Math.max(1, Math.round(originalStudyTime / 5));
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

  // Converte o tempo restante em minutos e segundos
  const minutes = Math.floor(remainingTime / 60);
  const seconds = remainingTime % 60;

  // Define o total de segundos do ciclo actual
  const totalSeconds =
    mode === 'work'
      ? originalStudyTime * 60
      : Math.max(1, Math.round(originalStudyTime / 5)) * 60;
  const progress = ((totalSeconds - remainingTime) / totalSeconds) * 100;

  return (
    <Box sx={{ textAlign: 'center' }}>
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        ⏱️ {mode === 'work' ? 'Tempo de Estudo' : 'Intervalo'}
      </Typography>

      <Box sx={{ position: 'relative', display: 'inline-flex', mb: 2 }}>
        <CircularProgress
          variant="determinate"
          value={progress}
          size={120}
          thickness={2}
          sx={{
            color: mode === 'work' ? 'primary.main' : 'secondary.main',
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
          onClick={handleStartPause}
          startIcon={isActive ? <Pause /> : <PlayArrow />}
        >
          {isActive ? 'Pausar' : 'Iniciar'}
        </Button>

        <IconButton onClick={handleReset} aria-label="Reiniciar timer">
          <Replay />
        </IconButton>
      </Box>

      {mode === 'work' && (
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
