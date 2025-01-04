import { budBase } from "../types/budBase.types";
import { budInstance } from "../types/budInstance.types";
import { v4 as uuidv4 } from 'uuid';

interface WildBudOptions {
  level?: number;
  difficultyMultiplier?: number;
  areaLevel?: number;
  isBoss?: boolean;
}

interface BudStats {
  health: number;
  intelligence: number;
  attack: number;
  defense: number;
  dexterity: number;
}

export function createWildBudInstance(base: budBase, options: WildBudOptions = {}): budInstance {
  const {
    level = 1,
    difficultyMultiplier = 1.0,
    areaLevel = 1,
    isBoss = false,
  } = options;

  // Calculate effective level based on area and difficulty
  const effectiveLevel = Math.min(100, Math.max(1, 
    Math.floor(level * difficultyMultiplier + (areaLevel - 1) * 2)
  ));

  // Calculate scaled stats based on effective level
  const scaledStats = calculateWildBudStats(base, effectiveLevel, difficultyMultiplier, isBoss);
  
  // Ensure proper health values
  const maxHealth = Math.max(10, scaledStats.health);

  const wildBud = {
    ...base,
    id: uuidv4(),
    level: effectiveLevel,
    experience: 0,
    experienceToNextLevel: 100,
    gender: 'none' as 'male' | 'female' | 'none',
    combatStats: scaledStats,
    currentHealth: maxHealth,
    maxHealth,
    isWild: true
  };

  console.log('Created Wild Bud:', wildBud);
  return wildBud;
}

function calculateWildBudStats(
  base: budBase, 
  level: number, 
  difficultyMultiplier: number, 
  isBoss: boolean
): BudStats {
  // Base stat calculation similar to regular buds
  const baseStats: BudStats = {
    health: base.baseStats.health + (base.statsPerLevel.health * (level - 1)),
    intelligence: base.baseStats.intelligence + (base.statsPerLevel.intelligence * (level - 1)),
    attack: base.baseStats.attack + (base.statsPerLevel.attack * (level - 1)),
    defense: base.baseStats.defense + (base.statsPerLevel.defense * (level - 1)),
    dexterity: base.baseStats.dexterity + (base.statsPerLevel.dexterity * (level - 1)),
  };

  // Apply difficulty multiplier
  const difficultyStats: BudStats = {
    health: Math.floor(baseStats.health * difficultyMultiplier),
    intelligence: Math.floor(baseStats.intelligence * difficultyMultiplier),
    attack: Math.floor(baseStats.attack * difficultyMultiplier),
    defense: Math.floor(baseStats.defense * difficultyMultiplier),
    dexterity: Math.floor(baseStats.dexterity * difficultyMultiplier),
  };

  // Apply boss multiplier if applicable
  if (isBoss) {
    return {
      health: Math.floor(difficultyStats.health * 2.5),
      intelligence: Math.floor(difficultyStats.intelligence * 1.5),
      attack: Math.floor(difficultyStats.attack * 1.5),
      defense: Math.floor(difficultyStats.defense * 1.5),
      dexterity: Math.floor(difficultyStats.dexterity * 1.5),
    };
  }

  return difficultyStats;
}

// Helper function to generate appropriate wild bud level range for an area
export function getWildBudLevelRange(areaLevel: number): { min: number; max: number } {
  return {
    min: Math.max(1, areaLevel - 2),
    max: areaLevel + 3
  };
}
