import { WorkbenchType } from "../enums/workbenchType.enum";

export interface Workbench {
    // Identification
    id: string;
    name: string;
    description: string;
    workbenchType: WorkbenchType;
    variantId?: string; // Optional identifier for item variants (e.g., "iron_sword+1")


    // Progression and Unlocking
    tier?: number; // Tier level for progression
    levelRequired: number; // Level required to gather
    isUnlocked: boolean; // Whether the node is unlocked
    specialRequirements?: string[]; // Optional field for any special conditions (e.g., "Requires specific tool")

  }
