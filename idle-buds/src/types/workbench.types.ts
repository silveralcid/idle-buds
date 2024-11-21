export interface Workbench {
    // Identification
    id: string;
    name: string;
    type: 'crafting' | 'smelting' | 'smithing' | 'cooking'; // Expanded types for more resource categories
    
  
    // Progression and Unlocking
    tier: number; // Tier level for progression
    levelRequired: number; // Level required to gather
    isUnlocked: boolean; // Whether the node is unlocked
  }
