// Enum for egg tiers matching bud rarity system
export type EggTier = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

// Interface for hatching requirements
export interface HatchingRequirement {
  items?: {
    itemId: string;
    amount: number;
  }[];
  affinity?: 'fire' | 'water' | 'ground' | 'electric' | 'grass' | 'ice' | 'dragon' | 'dark' | 'neutral';
  minHunterLevel?: number;
  environmentalConditions?: {
    region?: string;
    timeOfDay?: 'day' | 'night';
    weather?: string;
  };
}

// Main egg data interface
export interface EggHatchData {
  id: string;
  name: string;
  description: string;
  speciesId: string;  // References budBase speciesId
  hatchDuration: number;  // In game ticks
  levelRequired: number;
  experienceReward: number;
  tier: EggTier;
  requirements: HatchingRequirement;
  
  // Optional metadata
  discoveryLocation?: string;
  lore?: string;
  
  // Hatching boost modifiers
  affinityBoostMultiplier?: number;  // Multiplier when matching bud affinity helps
  incubatorBoostMultiplier?: number; // Multiplier from special incubators
}