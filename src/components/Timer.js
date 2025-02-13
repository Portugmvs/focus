import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Box, Typography, Button, Slider, IconButton } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

const alertSound = new Audio('/alert.mp3');

const Timer = ({ onStudyComplete }) => {
  const [studyTime, setStudyTime] = useState(25);
  const [breakTime, setBreakTime] = useState(5);
  const [minutes, setMinutes] = useState(studyTime);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('Estudo');
  const [startTime, setStartTime] = useState(null);
  const intervalRef = useRef();

  const calculateXP = useCallback((elapsedMinutes) => {
    const intervals = Math.floor(elapsedMinutes / 5);
    return intervals * 20;
  }, []);

  const startTimer = () => {
    if (!isActive) {
      setStartTime(Date.now());
    }
    setIsActive(true);
  };

  const stopTimer = () => {
    if (isActive && mode === 'Estudo' && startTime) {
      const endTime = Date.now();
      const elapsedMinutes = Math.floor((endTime - startTime) / 1000 / 60);
      onStudyComplete(calculateXP(elapsedMinutes));
    }
    setIsActive(false);
  };

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setSeconds(prevSeconds => {
          if (prevSeconds === 0) {
            if (minutes === 0) {
              clearInterval(intervalRef.current);
              alertSound.play();
              
              const endTime = Date.now();
              if (mode === 'Estudo' && startTime) {
                const elapsedMinutes = Math.floor((endTime - startTime) / 1000 / 60);
                onStudyComplete(calculateXP(elapsedMinutes));
              }

              const newMode = mode === 'Estudo' ? 'Pausa' : 'Estudo';
              setMode(newMode);
              setMinutes(newMode === 'Estudo' ? studyTime : breakTime);
              setStartTime(Date.now());
              setIsActive(true);
              return 0;
            }
            setMinutes(min => min - 1);
            return 59;
          }
          return prevSeconds - 1;
        });
      }, 1000);
    }

    return () => clearInterval(intervalRef.current);
  }, [isActive, minutes, seconds, mode, studyTime, breakTime, startTime, onStudyComplete, calculateXP]);

  const resetTimer = () => {
    clearInterval(intervalRef.current);
    setIsActive(false);
    setMode('Estudo');
    setMinutes(studyTime);
    setSeconds(0);
    setStartTime(null);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <AccessTimeIcon sx={{ fontSize: 32 }} />
        <Typography variant="h5" gutterBottom sx={{ flexGrow: 1 }}>
          Temporizador ({mode})
        </Typography>
        <IconButton 
          onClick={resetTimer}
          color="error"
          title="Reiniciar timer"
        >
          <RestartAltIcon />
        </IconButton>
      </Box>

      <Typography variant="h2" sx={{ mb: 2, fontFamily: 'monospace' }}>
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </Typography>

      <Button
        variant="contained"
        size="large"
        color={isActive ? 'error' : 'success'}
        onClick={isActive ? stopTimer : startTimer}
        fullWidth
      >
        {isActive ? '⏸️ Pausar' : '▶️ Começar'}
      </Button>

      <Box sx={{ mt: 3 }}>
        <Slider
          value={mode === 'Estudo' ? studyTime : breakTime}
          onChange={(e, newValue) => {
            if (mode === 'Estudo') {
              setStudyTime(newValue);
              if (!isActive) setMinutes(newValue);
            } else {
              setBreakTime(newValue);
              if (!isActive) setMinutes(newValue);
            }
          }}
          min={1}
          max={60}
          marks={[
            { value: 5, label: '5min' },
            { value: 10, label: '10min' },
            { value: 25, label: '25min' },
            { value: 50, label: '50min' }
          ]}
          valueLabelDisplay="auto"
          sx={{ mt: 2 }}
        />
        <Typography variant="body2">
          {mode === 'Estudo' ? 'Tempo de Estudo' : 'Tempo de Pausa'}
        </Typography>
      </Box>
    </Box>
  );
};

export default Timer;