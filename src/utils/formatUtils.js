// utils/formatUtils.js

/**
 * Formata o tempo em segundos para o formato MM:SS.
 *
 * @param {number} seconds - O tempo em segundos.
 * @returns {string} Tempo formatado como MM:SS.
 */
export const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };