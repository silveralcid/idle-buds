// src/types/bud.ts
import type { 
    Affinity, 
    AffinityBonus, 
    AffinityMove, 
    AffinityStats 
  } from './affinity';
  
  // Core Bud stats with Affinity integration
  export interface BudStats {
    level: number;
    experience: number;
    happiness: number;
    energy: number;
    loyalty: number;
    
    // Affinity-related stats
    affinityStats: AffinityStats;
    affinityMastery: {
      [key in Affinity]?: {
        level: number;
        experience: number;
      };
    };
  }
  
  // Combat-related attributes with Affinity
  export interface BudCombatStats {
    attack: number;
    defense: number;
    health: number;
    speed: number;
    specialAttack: number;
    
    // Affinity-based modifiers
    affinityBonuses: AffinityBonus[];
    moveSet: AffinityMove[];
    
    // Combat effectiveness per affinity
    affinityEffectiveness: {
      [key in Affinity]?: {
        damageDealt: number;
        damageReceived: number;
        resistanceBonus: number;
      };
    };
  }
  
  // Main Bud interface
  export interface CapturedBud {
    // Basic Info
    id: string;
    name: string;
    species: string;
    rarity: 'common' | 'uncommon' | 'rare' | 'legendary' | 'mythical';
    
    // Primary/Secondary Affinity
    primaryAffinity: Affinity;
    secondaryAffinity?: Affinity;
    
    // Core Stats
    level: number;
    experience: number;
    stats: BudStats;
    combatStats: BudCombatStats;
    
    // Abilities and Moves
    abilities: string[];
    passiveEffects: string[];
    learnedMoves: AffinityMove[];
    
    // Affinity Experience and Mastery
    affinityExperience: {
      [key in Affinity]?: number;
    };
    affinityMastery: {
      [key in Affinity]?: number;
    };
    
    // Work Related
    workEfficiency: {
      [taskType: string]: number;
      // Add affinity-based work bonuses
      affinityWorkBonus: {
        [key in Affinity]?: number;
      };
    };
    
    currentTask?: {
      type: string;
      startedAt: number;
      efficiency: number;
      assignedBuilding?: string;
      affinityBonus?: number;
    };
    
    // Status
    status: 'idle' | 'working' | 'resting' | 'training' | 'breeding';
    happiness: number;
    energy: number;
    loyalty: number;
    hunger: number;
    
    // Breeding with Affinity consideration
    breedingInfo?: {
      parent1?: {
        id: string;
        primaryAffinity: Affinity;
        secondaryAffinity?: Affinity;
      };
      parent2?: {
        id: string;
        primaryAffinity: Affinity;
        secondaryAffinity?: Affinity;
      };
      inheritedTraits: string[];
      affinityInheritance: {
        primary: Affinity;
        secondary?: Affinity;
        bonuses: AffinityBonus[];
      };
      breedingPotential: number;
      generationNumber: number;
    };
    
    // Equipment with Affinity bonuses
    equipment?: {
      [slot: string]: {
        itemId: string;
        stats: { [stat: string]: number };
        affinityBonus?: AffinityBonus[];
      };
    };
  }
  
  // Collection/Storage interfaces
  export interface BudStorage {
    activeBuds: CapturedBud[];
    storedBuds: CapturedBud[];
    maxActiveBuds: number;
    maxStorageBuds: number;
    
    // Affinity-based organization
    affinityGroups: {
      [key in Affinity]?: string[]; // Array of bud IDs
    };
  }
  
  // Bud Team interface with Affinity synergy
  export interface BudTeam {
    id: string;
    name: string;
    buds: string[]; // Array of bud IDs
    leader?: string; // Bud ID
    totalLevel: number;
    specialization?: 'combat' | 'gathering' | 'utility';
    
    // Team Affinity bonuses
    teamAffinities: Affinity[];
    affinitySynergy: {
      [key in Affinity]?: number;
    };
    teamBonuses: AffinityBonus[];
  }
  
  // Utility functions for Bud Affinity management
  export const budAffinityUtils = {
    // Calculate team affinity synergy
    calculateTeamSynergy: (buds: CapturedBud[]): AffinityBonus[] => {
      // Implementation here
      return [];
    },
  
    // Check if a bud can learn a move
    canLearnMove: (bud: CapturedBud, move: AffinityMove): boolean => {
      return bud.primaryAffinity === move.affinity || 
             bud.secondaryAffinity === move.affinity ||
             bud.affinityMastery[move.affinity] !== undefined;
    },
  
    // Calculate breeding affinity compatibility
    calculateBreedingCompatibility: (
      bud1: CapturedBud,
      bud2: CapturedBud
    ): number => {
      // Implementation here
      return 0;
    },
  
    // Get work efficiency bonus based on affinity
    getWorkEfficiencyBonus: (
      bud: CapturedBud,
      taskType: string
    ): number => {
      // Implementation here
      return 0;
    }
  };
  