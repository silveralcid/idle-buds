export interface Resource {
    // Identification
    id: string;
    name: string;
    type: 'wood' | 'ore'; // Expanded types for more resource categories
    
  
    // Progression and Unlocking
    tier: number; // Tier level for progression
    levelRequired: number; // Level required to gather
    isUnlocked: boolean; // Whether the node is unlocked
    region: string; // Region where the resource is found
  
    // Gathering Mechanics
    gatherRate: number; // Resources per tick
    gatherEfficiency: number; // Efficiency modifier for gathering
    specialConditions?: string; // Special conditions for gathering
  
    // Node Health and Regeneration
    nodeHealth: number; // Current health of the node
    maxHealth: number; // Maximum health of the node
    regenRate: number; // Health regeneration rate per tick
    isRenewable: boolean; // Whether the resource regenerates
  
    // Rarity and Value
    rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'; // Rarity of the resource
    value: number; // Value of the resource, potentially for trading or crafting
  
    // Source Information
    sourceName: string; // Name of the source entity, e.g., "Oak Tree"
    description?: string; // Optional description for lore or additional context

    // Experience
    experienceGain: number; // Experience yield per tick
  }
