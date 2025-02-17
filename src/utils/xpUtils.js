export const calculateLevel = (totalXP) => {
    const level = Math.floor(totalXP / 1000) + 1;
    const xpForNextLevel = level * 1000;
    const currentLevelXP = totalXP % 1000;
    
    return {
      level,
      xpForNextLevel,
      currentLevelXP,
      progressPercentage: (currentLevelXP / 1000) * 100
    };
  };
  
  export const getXPForLevel = (targetLevel) => (targetLevel - 1) * 1000;
  
  export const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };