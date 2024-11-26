const BASE_XP = 100; // Base XP required for level 1
const XP_MULTIPLIER = 1.5; // Multiplier for XP increase per level

export const calculateXpToNextLevel = (level: number): number => {
  return Math.floor(BASE_XP * Math.pow(XP_MULTIPLIER, level - 1));
};
