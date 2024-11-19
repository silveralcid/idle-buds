import { LevelInfo } from '../types/base.types';

export const calculateNewLevel = (currentLevel: LevelInfo, xpGained: number): LevelInfo => {
  const newXp = currentLevel.currentXp + xpGained;
  let level = currentLevel.level;
  let requiredXp = currentLevel.requiredXp;

  // Calculate if level up occurred
  if (newXp >= requiredXp && level < 100) {
    level += 1;
    // Formula for next level XP requirement (can be adjusted)
    requiredXp = Math.floor(requiredXp * 1.1);
  }

  return {
    level,
    currentXp: newXp,
    requiredXp
  };
};
