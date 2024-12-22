import { skillsConfig } from "../data/skills.data";
import { GameConfig } from "../core/constants/game-config";


export const calculateExperienceRequirement = (skillId: string, level: number): number => {
    const skillConfig = skillsConfig[skillId];
    if (!skillConfig) {
      throw new Error(`Skill configuration not found for skillId: ${skillId}`);
    }
  
    const { baseExperience, xpMultiplier } = skillConfig;
    return Math.floor(baseExperience * Math.pow(xpMultiplier, level - 1));
  };
  

const BASE_XP = GameConfig.EXPERIENCE.BASE_XP;
const XP_MULTIPLIER = GameConfig.EXPERIENCE.GROWTH_FACTOR;

export const calculateXpToNextLevel = (level: number): number => {
  // Return 0 if at max level to prevent further XP gains
  if (level >= GameConfig.EXPERIENCE.MAX_LEVEL) {
    return 0;
  }
  return Math.floor(BASE_XP * Math.pow(XP_MULTIPLIER, level - 1));
};

export const isMaxLevel = (level: number): boolean => {
  return level >= GameConfig.EXPERIENCE.MAX_LEVEL;
};

export const enforceMaxLevel = (level: number): number => {
  return Math.min(level, GameConfig.EXPERIENCE.MAX_LEVEL);
};