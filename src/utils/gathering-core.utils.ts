import { ResourceNode } from "../types/resourceNode.types";
import { calculateResourceGain, calculateExperienceGain } from "./gathering-calculation.utils";
import { GameConfig } from "../constants/game-config";

interface GatheringResult {
  wholeAmount: number;
  newFraction: number;
  wholeXP: number;
  newXPFraction: number;
}

export const calculateGathering = (
  resource: ResourceNode,
  deltaTime: number,
  currentFraction: number = 0,
  currentXPFraction: number = 0,
  efficiencyMultiplier: number = 1
): GatheringResult => {
  const ticks = deltaTime / GameConfig.TICK.DURATION;
  
  const { wholeAmount, newFraction } = calculateResourceGain(
    resource.gatherRate * efficiencyMultiplier,
    ticks,
    currentFraction
  );

  const { wholeXP, newXPFraction } = calculateExperienceGain(
    resource.experienceGain,
    ticks,
    currentXPFraction
  );

  return {
    wholeAmount,
    newFraction,
    wholeXP,
    newXPFraction
  };
};