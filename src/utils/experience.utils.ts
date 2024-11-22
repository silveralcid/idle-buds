import { GameConfig } from '../constants/game-config';

/**
 * Calculates the experience required for the next level using a quadratic progression
 * formula: baseXP * (level ^ growthFactor)
 */
export const calculateExperienceRequirement = (level: number): number => {
  const baseXP = GameConfig.EXPERIENCE.BASE_XP;
  const growthFactor = GameConfig.EXPERIENCE.GROWTH_FACTOR;
  return Math.floor(baseXP * Math.pow(level, growthFactor));
};

/**
 * Calculates the total experience required to reach a specific level
 */
export const calculateTotalExperienceToLevel = (targetLevel: number): number => {
  let totalXP = 0;
  for (let level = 1; level < targetLevel; level++) {
    totalXP += calculateExperienceRequirement(level);
  }
  return totalXP;
};

/**
 * Calculates the level based on total experience
 */
export const calculateLevelFromExperience = (totalExperience: number): {
  level: number;
  remainingExp: number;
  expToNextLevel: number;
} => {
  let level = 1;
  let remainingExp = totalExperience;
  
  while (remainingExp >= calculateExperienceRequirement(level)) {
    remainingExp -= calculateExperienceRequirement(level);
    level++;
  }
  
  return {
    level,
    remainingExp,
    expToNextLevel: calculateExperienceRequirement(level)
  };
};

/**
 * Calculates experience gain based on activity level and player/bud level
 */
export const calculateExperienceGain = (
  activityLevel: number,
  entityLevel: number,
  baseExperience: number
): number => {
  const levelDifference = activityLevel - entityLevel;
  const multiplier = levelDifference > 0 
    ? 1 + (levelDifference * GameConfig.EXPERIENCE.LEVEL_SCALING)
    : Math.max(0.1, 1 - (Math.abs(levelDifference) * GameConfig.EXPERIENCE.PENALTY_SCALING));
    
  return Math.floor(baseExperience * multiplier);
};
