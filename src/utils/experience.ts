import { GameConfig } from "../core/constants/game-config";

// Types
export type ExperienceData = {
  currentXp: number;
  level: number;
};

// Constants
const {
  BASE_XP,
  GROWTH_FACTOR,
  MAX_LEVEL,
  LEVEL_SCALING,
  PENALTY_SCALING,
  EVOLUTION_LEVELS
} = GameConfig.EXPERIENCE;

/**
 * Calculate experience required for a specific level
 */
export const calculateRequiredExperience = (level: number): number => {
  if (level >= MAX_LEVEL) return 0;
  return Math.floor(BASE_XP * Math.pow(GROWTH_FACTOR, level - 1));
};

/**
 * Calculate total experience required up to a specific level
 */
export const calculateTotalExperienceToLevel = (targetLevel: number): number => {
  let total = 0;
  for (let level = 1; level < targetLevel; level++) {
    total += calculateRequiredExperience(level);
  }
  return total;
};

/**
 * Calculate level based on total experience
 */
export const calculateLevelFromExperience = (totalXp: number): number => {
  let level = 1;
  let xpRequired = calculateRequiredExperience(level);
  
  while (totalXp >= xpRequired && level < MAX_LEVEL) {
    totalXp -= xpRequired;
    level++;
    xpRequired = calculateRequiredExperience(level);
  }
  
  return level;
};

/**
 * Check if a level qualifies for evolution
 */
export const getEvolutionPhase = (level: number): keyof typeof EVOLUTION_LEVELS | null => {
  if (level >= EVOLUTION_LEVELS.ASCENDED) return 'ASCENDED';
  if (level >= EVOLUTION_LEVELS.THIRD) return 'THIRD';
  if (level >= EVOLUTION_LEVELS.SECOND) return 'SECOND';
  if (level >= EVOLUTION_LEVELS.FIRST) return 'FIRST';
  return null;
};

/**
 * Calculate experience penalty based on level difference
 */
export const calculateLevelPenalty = (actorLevel: number, targetLevel: number): number => {
  const levelDiff = targetLevel - actorLevel;
  if (levelDiff <= 0) return 1;
  return Math.max(0, 1 - (levelDiff * PENALTY_SCALING));
};

/**
 * Utility functions
 */
export const isMaxLevel = (level: number): boolean => level >= MAX_LEVEL;
export const enforceMaxLevel = (level: number): number => Math.min(level, MAX_LEVEL);
export const getProgressToNextLevel = (currentXp: number, level: number): number => {
  const requiredXp = calculateRequiredExperience(level);
  return requiredXp > 0 ? currentXp / requiredXp : 1;
};