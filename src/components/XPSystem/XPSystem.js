<<<<<<< HEAD
// File: /src/components/XPSystem/XPSystem.js
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Box, LinearProgress, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Button, DialogContentText } from '@mui/material'; // ✅ Importação de DialogContentText

const XPSystem = ({ xpData }) => {
  const [level, setLevel] = useState(xpData.level);
  const [currentXP, setCurrentXP] = useState(xpData.currentXP);
  const [xpToNextLevel, setXPToNextLevel] = useState(1000 - xpData.currentXP); // XP necessários para o próximo nível
  const [progress, setProgress] = useState(xpData.currentXP / 1000 * 100);
  const [rewardDialogOpen, setRewardDialogOpen] = useState(false); // Estado para controlar o dialog de recompensa
  const [rewardMessage, setRewardMessage] = useState(''); // Estado para a mensagem de recompensa

  // Mensagens de recompensa possíveis
  const rewardMessages = [
    "Parabéns! Subiste de nível!",
    "Novo nível alcançado, continue assim!",
    "Excelente! O teu esforço está a dar frutos!",
    "Nível Up! Mais um passo rumo ao sucesso!",
    "Fantástico! Mantém o ritmo!"
  ];

  useEffect(() => {
    setLevel(xpData.level);
    setCurrentXP(xpData.currentXP);
    setXPToNextLevel(1000 - xpData.currentXP);
    setProgress(xpData.currentXP / 1000 * 100);

    // Verificar se subiu de nível e mostrar recompensa
    if (xpData.level > level) {
      const randomMessage = rewardMessages[Math.floor(Math.random() * rewardMessages.length)];
      setRewardMessage(randomMessage);
      setRewardDialogOpen(true);
    }
  }, [xpData, level, rewardMessages]); // ✅ Adicionado rewardMessages como dependência

  const handleCloseRewardDialog = () => {
    setRewardDialogOpen(false);
  };

  return (
    <Box sx={{ width: '100%', marginBottom: 2, textAlign: 'center', padding: 2, backgroundColor: 'background.paper', borderRadius: 2 }}>
      <Typography variant="subtitle2" color="text.secondary">
        Nível {level}
      </Typography>
      <LinearProgress variant="determinate" value={progress} sx={{ mb: 1 }} />
      <Typography variant="body2">
        XP: {currentXP} / {level * 1000} (Faltam {xpToNextLevel} XP para o nível {level + 1})
      </Typography>

      {/* Dialog de Recompensa */}
      <Dialog
        open={rewardDialogOpen}
        onClose={handleCloseRewardDialog}
        aria-labelledby="recompensa-dialog-title"
        aria-describedby="recompensa-dialog-description"
      >
        <DialogTitle id="recompensa-dialog-title">
          Parabéns!
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="recompensa-dialog-description">  {/* ✅ DialogContentText agora reconhecido */}
            {rewardMessage} 🎉
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRewardDialog} color="primary" autoFocus>
            Fechar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

XPSystem.propTypes = {
  xpData: PropTypes.shape({
    currentXP: PropTypes.number.isRequired,
    totalXP: PropTypes.number.isRequired,
    level: PropTypes.number.isRequired
  }).isRequired,
};
=======
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
>>>>>>> a927fb649594659651e28ac2ff9dbef30f1ec777

export default XPSystem;