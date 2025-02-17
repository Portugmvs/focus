// File: /src/components/PomodoroTimer/PomodoroTimer.js
import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Button, Slider, IconButton, CircularProgress } from '@mui/material';
import { PlayArrow, Pause, Replay } from '@mui/icons-material';

const PomodoroTimer = ({ onTimerComplete }) => {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('work');
  const [timeElapsed, setTimeElapsed] = useState(0);

  const formatTime = (time) => String(time).padStart(2, '0');
  
  const resetTimer = useCallback(() => {
    setIsActive(false);
    setMode('work');
    setMinutes(25);
    setSeconds(0);
    setTimeElapsed(0);
  }, []);

  useEffect(() => {
    let interval;
    if (isActive) {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
        setSeconds(prev => {
          if (prev === 0) {
            if (minutes === 0) {
              const totalMinutes = mode === 'work' ? 25 : 5;
              onTimerComplete(totalMinutes);
              resetTimer();
              return 0;
            }
            setMinutes(prevMin => prevMin - 1);
            return 59;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, minutes, seconds, mode, resetTimer, onTimerComplete]);

  const toggleMode = () => {
    setMode(prev => prev === 'work' ? 'break' : 'work');
    setMinutes(prev => prev === 25 ? 5 : 25);
    resetTimer();
  };

  return (
    <Box sx={{ textAlign: 'center' }}>
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        ⏱️ {mode === 'work' ? 'Tempo de Estudo' : 'Intervalo'}
      </Typography>
      
      <Box sx={{ position: 'relative', display: 'inline-flex', mb: 2 }}>
        <CircularProgress
          variant="determinate"
          value={(timeElapsed / (mode === 'work' ? 1500 : 300)) * 100}
          size={120}
          thickness={2}
          sx={{ color: mode === 'work' ? 'primary.main' : 'secondary.main' }}
        />
        
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
        }}>
          <Typography variant="h4" component="div">
            {formatTime(minutes)}:{formatTime(seconds)}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 3 }}>
        <Button
          variant="contained"
          color={mode === 'work' ? 'primary' : 'secondary'}
          onClick={toggleMode}
        >
          {mode === 'work' ? 'Intervalo Curto' : 'Modo Estudo'}
        </Button>
        
        <Button
          variant="contained"
          onClick={() => setIsActive(!isActive)}
          startIcon={isActive ? <Pause /> : <PlayArrow />}
        >
          {isActive ? 'Pausar' : 'Iniciar'}
        </Button>
        
        <IconButton onClick={resetTimer} aria-label="Reiniciar timer">
          <Replay />
        </IconButton>
      </Box>

      <Slider
        value={mode === 'work' ? 25 : 5}
        min={1}
        max={60}
        onChange={(e, value) => setMinutes(value)}
        sx={{ width: '80%', mx: 'auto' }}
      />
    </Box>
  );
};

PomodoroTimer.propTypes = {
  onTimerComplete: PropTypes.func.isRequired
};

export default PomodoroTimer;