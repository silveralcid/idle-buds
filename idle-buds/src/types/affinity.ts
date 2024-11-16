// Base Affinity Type
export type Affinity = 
  | 'water' 
  | 'fire' 
  | 'grass' 
  | 'ground' 
  | 'electric' 
  | 'ice' 
  | 'dragon' 
  | 'dark' 
  | 'neutral';

// Affinity Relationships
export interface AffinityEffectiveness {
  strongAgainst: Affinity[];
  weakAgainst: Affinity[];
  resistantTo: Affinity[];
  vulnerableTo: Affinity[];
}

// Damage Multipliers
export const AFFINITY_MULTIPLIERS = {
  SUPER_EFFECTIVE: 2.0,
  NORMAL: 1.0,
  NOT_EFFECTIVE: 0.5,
  IMMUNE: 0,
};

// Affinity Effectiveness Chart
export const AFFINITY_CHART: Record<Affinity, AffinityEffectiveness> = {
  water: {
    strongAgainst: ['fire', 'ground'],
    weakAgainst: ['grass', 'dragon'],
    resistantTo: ['water', 'fire', 'ice'],
    vulnerableTo: ['electric', 'grass']
  },
  fire: {
    strongAgainst: ['grass', 'ice'],
    weakAgainst: ['water', 'dragon'],
    resistantTo: ['fire', 'grass'],
    vulnerableTo: ['water', 'ground']
  },
  // ... define for other affinities
};

// Affinity Stats Interface
export interface AffinityStats {
  primary: Affinity;
  secondary?: Affinity;
  bonuses: Partial<Record<Affinity, number>>;
}

// Utility Functions
export const calculateAffinityDamage = (
  attackerAffinity: Affinity,
  defenderAffinity: Affinity,
  baseDamage: number
): number => {
  const relationship = AFFINITY_CHART[attackerAffinity];
  
  if (relationship.strongAgainst.includes(defenderAffinity)) {
    return baseDamage * AFFINITY_MULTIPLIERS.SUPER_EFFECTIVE;
  }
  if (relationship.weakAgainst.includes(defenderAffinity)) {
    return baseDamage * AFFINITY_MULTIPLIERS.NOT_EFFECTIVE;
  }
  return baseDamage * AFFINITY_MULTIPLIERS.NORMAL;
};

// Dual Affinity Calculator
export const calculateDualAffinityDamage = (
  attacker: AffinityStats,
  defender: AffinityStats,
  baseDamage: number
): number => {
  let totalMultiplier = 1;
  
  // Calculate primary affinity damage
  totalMultiplier *= calculateAffinityDamage(
    attacker.primary,
    defender.primary,
    1
  );
  
  // If secondary affinities exist, include them
  if (attacker.secondary) {
    totalMultiplier *= calculateAffinityDamage(
      attacker.secondary,
      defender.primary,
      1
    ) * 0.5; // Secondary affinity deals 50% damage
  }
  
  return baseDamage * totalMultiplier;
};

// Affinity Bonus System
export interface AffinityBonus {
  affinity: Affinity;
  type: 'damage' | 'resistance' | 'recovery';
  value: number;
}

// Example usage in Bud interface:
interface BudAffinitySystem {
  primaryAffinity: Affinity;
  secondaryAffinity?: Affinity;
  affinityBonuses: AffinityBonus[];
  affinityExperience: Partial<Record<Affinity, number>>;
  
  // Affinity mastery levels
  affinityMastery: Partial<Record<Affinity, number>>;
}

// Affinity Move Interface
export interface AffinityMove {
  name: string;
  affinity: Affinity;
  power: number;
  accuracy: number;
  staminaCost: number;
  effects?: {
    type: 'buff' | 'debuff' | 'status';
    target: 'self' | 'enemy' | 'all';
    value: number;
    duration: number;
  }[];
}

// Utility functions for affinity management
export const affinityUtils = {
  // Check if a bud can learn a move of certain affinity
  canLearnAffinityMove: (bud: BudAffinitySystem, affinity: Affinity): boolean => {
    return bud.primaryAffinity === affinity || 
           bud.secondaryAffinity === affinity ||
           bud.affinityMastery[affinity] !== undefined;
  },

  // Calculate affinity mastery bonus
  getAffinityMasteryBonus: (bud: BudAffinitySystem, affinity: Affinity): number => {
    const masteryLevel = bud.affinityMastery[affinity] || 0;
    return masteryLevel * 0.05; // 5% bonus per mastery level
  },

  // Get affinity weakness multiplier
  getWeaknessMultiplier: (defending: Affinity, attacking: Affinity): number => {
    const relationship = AFFINITY_CHART[defending];
    if (relationship.vulnerableTo.includes(attacking)) {
      return AFFINITY_MULTIPLIERS.SUPER_EFFECTIVE;
    }
    if (relationship.resistantTo.includes(attacking)) {
      return AFFINITY_MULTIPLIERS.NOT_EFFECTIVE;
    }
    return AFFINITY_MULTIPLIERS.NORMAL;
  }
};
