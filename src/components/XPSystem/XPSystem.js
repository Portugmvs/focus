import React from 'react';
import PropTypes from 'prop-types';
import { Box, LinearProgress, Typography, keyframes, styled } from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
`;

const ProgressBar = styled(LinearProgress)(({ theme }) => ({
  height: 20,
  borderRadius: 10,
  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
  '& .MuiLinearProgress-bar': {
    borderRadius: 10,
    background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
  }
}));

const XPSystem = ({ xpData }) => {
  const currentLevel = xpData.level;
  const xpForNextLevel = currentLevel * 1000;
  const progress = (xpData.totalXP % 1000) / 10;

  return (
    <Box sx={{ mb: 4, p: 3, bgcolor: 'background.paper', borderRadius: 3, boxShadow: 1 }}>
      <Typography variant="h5" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <EmojiEventsIcon sx={{ color: 'gold' }} />
        Nível {currentLevel} | XP Total: {xpData.totalXP}
      </Typography>
      
      <ProgressBar
        variant="determinate"
        value={progress}
        sx={{
          '& .MuiLinearProgress-bar': {
            animation: `${pulse} 1s ease-in-out`,
          }
        }}
      />
      
      <Typography variant="body2" sx={{ mt: 1, textAlign: 'right' }}>
        Próximo nível em: {xpForNextLevel - (xpData.totalXP % xpForNextLevel)} XP
      </Typography>
    </Box>
  );
};

XPSystem.propTypes = {
  xpData: PropTypes.shape({
    currentXP: PropTypes.number,
    totalXP: PropTypes.number,
    level: PropTypes.number
  }).isRequired
};

export default XPSystem;