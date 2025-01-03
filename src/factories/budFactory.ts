import { budBase } from "../types/budBase.types";
import { budInstance } from "../types/budInstance.types";
import { v4 as uuidv4 } from 'uuid';

export function createBudInstance(base: budBase): budInstance {
  // Calculate initial combat stats based on base stats
  const combatStats = {
    health: base.baseStats.health,
    intelligence: base.baseStats.intelligence,
    attack: base.baseStats.attack,
    defense: base.baseStats.defense,
    dexterity: base.baseStats.dexterity,
  };

  const maxHealth = base.baseStats.health;

  const bud = {
    ...base,
    id: uuidv4(),
    level: 1,
    experience: 0,
    experienceToNextLevel: 100,
    gender: Math.random() > 0.5 ? 'male' : 'female' as 'male' | 'female' | 'none',
    combatStats,
    currentHealth: maxHealth,
    maxHealth,
  };

  console.log('Created Bud:', bud);
  return bud;
}

// Helper function to calculate stats for a given level
export function calculateBudStats(base: budBase, level: number) {
  return {
    health: base.baseStats.health + (base.statsPerLevel.health * (level - 1)),
    intelligence: base.baseStats.intelligence + (base.statsPerLevel.intelligence * (level - 1)),
    attack: base.baseStats.attack + (base.statsPerLevel.attack * (level - 1)),
    defense: base.baseStats.defense + (base.statsPerLevel.defense * (level - 1)),
    dexterity: base.baseStats.dexterity + (base.statsPerLevel.dexterity * (level - 1)),
  };
}