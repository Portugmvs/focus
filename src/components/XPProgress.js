import React, { useEffect } from 'react';
import { Box, LinearProgress, Typography, keyframes } from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
`;

const XPProgress = ({ xp }) => {
  const milestones = [500, 1000, 2000, 5000];
  const nextMilestone = milestones.find(m => m > xp) || 5000;

  useEffect(() => {
    if (xp > 0) {
      const xpElement = document.getElementById('xp-display');
      if (xpElement) {
        xpElement.style.animation = `${pulse} 0.5s ease`;
        setTimeout(() => xpElement.style.animation = '', 500);
      }
    }
  }, [xp]);

  

  return (
    <Box sx={{ mt: 4 }}>
      <Typography 
        variant="h5" 
        gutterBottom 
        id="xp-display"
        sx={{ display: 'flex', alignItems: 'center' }}
      >
        <EmojiEventsIcon sx={{ mr: 1, color: 'gold' }} /> 
        XP: {xp}
      </Typography>

      <LinearProgress
        variant="determinate"
        value={(xp / nextMilestone) * 100}
        sx={{ 
          height: 20, 
          borderRadius: 2,
          '& .MuiLinearProgress-bar': {
            transition: 'transform 0.5s ease-out'
          }
        }}
      />

      <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
        ⭐ Próximo nível em: {nextMilestone - xp} XP
      </Typography>
    </Box>
  );
};


export default XPProgress;