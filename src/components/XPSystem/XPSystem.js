import React, { useEffect } from 'react'; // Importa useEffect
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

const XPSystem = ({ xpData, onLevelUp }) => { // Adiciona onLevelUp como prop
  const currentLevel = xpData.level;
  const previousLevel = currentLevel - 1;
  const xpForNextLevel = currentLevel * 1000;
  const progress = (xpData.totalXP % 1000) / 10;

  // Efeito para detetar level up
  useEffect(() => {
    if (xpData.level > previousLevel && previousLevel >= 1) { // Verifica se o nível aumentou e não é o nível inicial
      if (onLevelUp) {
        onLevelUp(xpData.level); // Chama a função onLevelUp e passa o novo nível
      }
    }
  }, [xpData.level, previousLevel, onLevelUp]);

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

// XPSystem.propTypes = { // PropTypes removidos para simplificar a demonstração
//   xpData: PropTypes.shape({...}).isRequired,
//   onLevelUp: PropTypes.func
// };

export default XPSystem;