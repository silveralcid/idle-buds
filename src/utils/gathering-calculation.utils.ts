import { GameConfig } from "../constants/gameConfig";

export const calculateResourceGain = (
  gatherRate: number, 
  ticks: number, 
  currentFraction: number
): { wholeAmount: number; newFraction: number } => {
  const gatherAmount = gatherRate * ticks * 
    GameConfig.BUD.ACTIVITY_MODIFIER * 
    GameConfig.BUD.GATHER_RATE_MODIFIER;
  const totalAmount = currentFraction + gatherAmount;
  const wholeAmount = Math.floor(totalAmount);
  const newFraction = totalAmount - wholeAmount;
  return { wholeAmount, newFraction };
};

export const calculateExperienceGain = (
  xpGainRate: number, 
  ticks: number, 
  currentXPFraction: number
): { wholeXP: number; newXPFraction: number } => {
  const xpGain = xpGainRate * ticks * GameConfig.EXPERIENCE.GATHER_RATE_MODIFIER;
  const totalXP = currentXPFraction + xpGain;
  const wholeXP = Math.floor(totalXP);
  const newXPFraction = totalXP - wholeXP;
  return { wholeXP, newXPFraction };
};