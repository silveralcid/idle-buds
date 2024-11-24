import { ResourceNode } from "../types/resourceNode.types";
import { GameConfig } from "../constants/game-config";

interface GatheringResult {
  resources: {
    amount: number;
    fraction: number;
  };
  experience: {
    amount: number;
    fraction: number;
  };
  ticksProcessed: number;
}

interface GatheringModifiers {
  efficiency?: number;
  budActivityMultiplier?: number;
  budGatherRateMultiplier?: number;
  experienceMultiplier?: number;
}

export class GatheringCalculator {
  private static readonly DEFAULT_MODIFIERS: Required<GatheringModifiers> = {
    efficiency: 1,
    budActivityMultiplier: GameConfig.BUD.ACTIVITY_MODIFIER,
    budGatherRateMultiplier: GameConfig.BUD.GATHER_RATE_MODIFIER,
    experienceMultiplier: GameConfig.EXPERIENCE.GATHER_RATE_MODIFIER
  };

  static calculate(
    resource: ResourceNode,
    deltaTime: number,
    currentState: {
      resourceFraction?: number;
      experienceFraction?: number;
    } = {},
    modifiers: GatheringModifiers = {}
  ): GatheringResult {
    const {
      efficiency,
      budActivityMultiplier,
      budGatherRateMultiplier,
      experienceMultiplier
    } = { ...this.DEFAULT_MODIFIERS, ...modifiers };

    const ticksProcessed = Math.floor(deltaTime / GameConfig.TICK.DURATION);
    
    const resources = this.calculateResourceGain({
      baseRate: resource.gatherRate,
      ticks: ticksProcessed,
      currentFraction: currentState.resourceFraction ?? 0,
      efficiency,
      activityMultiplier: budActivityMultiplier,
      gatherRateMultiplier: budGatherRateMultiplier
    });

    const experience = this.calculateExperienceGain({
      baseXP: resource.experienceGain,
      ticks: ticksProcessed,
      currentFraction: currentState.experienceFraction ?? 0,
      experienceMultiplier
    });

    return {
      resources,
      experience,
      ticksProcessed
    };
  }

  private static calculateResourceGain({
    baseRate,
    ticks,
    currentFraction,
    efficiency,
    activityMultiplier,
    gatherRateMultiplier
  }: {
    baseRate: number;
    ticks: number;
    currentFraction: number;
    efficiency: number;
    activityMultiplier: number;
    gatherRateMultiplier: number;
  }) {
    const gatherAmount = baseRate * 
      ticks * 
      efficiency * 
      activityMultiplier * 
      gatherRateMultiplier;

    const totalAmount = currentFraction + gatherAmount;
    
    return {
      amount: Math.floor(totalAmount),
      fraction: totalAmount % 1
    };
  }

  private static calculateExperienceGain({
    baseXP,
    ticks,
    currentFraction,
    experienceMultiplier
  }: {
    baseXP: number;
    ticks: number;
    currentFraction: number;
    experienceMultiplier: number;
  }) {
    const xpGain = baseXP * ticks * experienceMultiplier;
    const totalXP = currentFraction + xpGain;

    return {
      amount: Math.floor(totalXP),
      fraction: totalXP % 1
    };
  }
}