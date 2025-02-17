// File: /src/components/PomodoroTimer/PomodoroTimer.js
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Button, Slider, IconButton, CircularProgress } from '@mui/material';
import { PlayArrow, Pause, Replay } from '@mui/icons-material';
import { formatTime } from '../../utils/formatUtils'; // ✏️ Import formatTime do utils

const PomodoroTimer = ({ onTimerComplete }) => {
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

        <IconButton onClick={handleReset}>
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