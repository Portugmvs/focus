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

export default XPSystem;