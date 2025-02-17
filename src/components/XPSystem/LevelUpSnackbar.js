// File: /src/components/XPSystem/LevelUpSnackbar.js
import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import Slide from '@mui/material/Slide';
import { Box, Typography } from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import PropTypes from 'prop-types'; // Import PropTypes

function SlideTransition(props) {
  return <Slide {...props} direction="down" />;
}

const LevelUpSnackbar = ({ open, setOpen, levelUpLevel }) => {
  const handleCloseSnackbar = () => {
    setOpen(false);
  };

  if (!open) return null; // Se não estiver aberto, não renderiza nada

  return (
    <Snackbar
      open={open}
      autoHideDuration={3000} // 3 segundos
      onClose={handleCloseSnackbar}
      TransitionComponent={SlideTransition}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      sx={{ mt: { xs: '70px', md: '90px' } }} // Ajuste para evitar sobreposição com header fixo (se existir)
    >
      <Box
        bgcolor="secondary.main"
        color="white"
        p={2}
        borderRadius={1}
        display="flex"
        alignItems="center"
      >
        <EmojiEventsIcon sx={{ mr: 1, color: 'white', fontSize: 30 }} />
        <Typography variant="h6">
          Nível Up! Alcançou o nível {levelUpLevel} 🎉
        </Typography>
      </Box>
    </Snackbar>
  );
};

LevelUpSnackbar.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  levelUpLevel: PropTypes.number,
};

export default LevelUpSnackbar;