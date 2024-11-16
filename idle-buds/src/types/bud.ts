// src/types/bud.ts

// Core Bud stats
export interface BudStats {
    level: number;
    experience: number;
    happiness: number;
    energy: number;
    loyalty: number;
  }
  
  // Work-related attributes
  export interface BudWorkEfficiency {
    [taskType: string]: number; // e.g., 'mining': 0.8, 'woodcutting': 1.2
  }
  
  // Combat-related attributes
  export interface BudCombatStats {
    attack: number;
    defense: number;
    health: number;
    speed: number;
    specialAttack: number; // ?
  }
  
  // Breeding-related attributes
  export interface BudBreedingInfo {
    parent1?: string;
    parent2?: string;
    inheritedTraits: string[];
    breedingPotential: number;
    generationNumber: number;
  }
  
  // Main Bud interface
  export interface CapturedBud {
    // Basic Info
    id: string;
    name: string;
    species: string;
    sex: 'male' | 'female' | 'parthenogen';
    level: number;
    experience: number;
    
    // Core Stats
    stats: BudStats;
    combatStats: BudCombatStats;
        
    // Abilities and Skills
    abilities: string[];
    passiveEffects: string[];
    learnedMoves: string[];
    
    // Work Related
    workEfficiency: BudWorkEfficiency;
    currentTask?: {
      type: string;
      startedAt: number;
      efficiency: number;
      assignedBuilding?: string;
    };
    
    // Status
    status: 'idle' | 'working' | 'resting' | 'combat' | 'breeding';
    happiness: number;
    energy: number;
    loyalty: number;
    hunger: number;
    
    // Preferences
    favoriteFood?: string;
    preferredWork?: string[];
    
    // History
    capturedAt: number;
    totalWorkTime: number;
    completedTasks: number;
    
    // Breeding
    breedingInfo?: BudBreedingInfo;
    
    // Equipment
    equipment?: {
      [slot: string]: {
        itemId: string;
        stats: { [stat: string]: number };
      };
    };
  }
  
  // Collection/Storage interfaces
  export interface BudStorage {
    activeBuds: CapturedBud[];
    storedBuds: CapturedBud[];
    maxActiveBuds: number;
    maxStorageBuds: number;
  }
  
  // Bud Team interface
  export interface BudTeam {
    id: string;
    name: string;
    buds: string[]; // Array of bud IDs
    leader?: string; // Bud ID
    totalLevel: number;
    specialization?: 'combat' | 'gathering' | 'utility';
  }
  
  // Breeding interfaces
  export interface BreedingPair {
    bud1Id: string;
    bud2Id: string;
    startTime: number;
    completionTime: number;
    resultSpecies?: string;
    compatibility: number;
  }
  
  export interface BreedingFacility {
    id: string;
    level: number;
    activePairs: BreedingPair[];
    maxPairs: number;
    speedMultiplier: number;
  }
  
  // Bud Collection Progress
  export interface BudCollection {
    discovered: {
      [species: string]: {
        firstDiscoveredAt: number;
        totalCaptured: number;
        highestLevel: number;
      };
    };
    totalSpeciesDiscovered: number;
    rarityCount: {
      common: number;
      uncommon: number;
      rare: number;
      legendary: number;
      mythical: number;
    };
  }