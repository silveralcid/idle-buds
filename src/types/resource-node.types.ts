import { ResourceNodeType } from "../enums/resourceNodeType.enums";

export interface ResourceNode {
  // Identification
  id: string; // Unique identifier for the node
  name: string; // Name of the node (e.g., "Oak Tree", "Iron Vein")
  type: ResourceNodeType; // Type of node (e.g., "Tree", "Ore", "Herb")
  skillId: string; // Skill ID for gathering this resource
 // Category of resource node
  
  // Progression and Unlocking
  tier: number; // Tier level for progression
  levelRequired: number; // Level required to gather from this node
  isUnlocked: boolean; // Whether the node is unlocked
  region: string; // Region where the node is found
  
  // Gathering Mechanics
  gatherRate: number; // Resources per tick
  gatherEfficiency: number; // Efficiency modifier for gathering
  specialConditions?: string; // Special conditions for gathering
  
  // Node Health and Regeneration
  nodeHealth: number; // Current health of the node
  maxHealth: number; // Maximum health of the node
  regenRate: number; // Health regeneration rate per tick
  isRenewable: boolean; // Whether the node regenerates
  
  // Experience
  experienceGain: number; // Experience yield per tick

  // Yields
  resourceNodeYields: string[]; // List of resources/items this node can yield
  dropTableID?: string; // ID of the drop table for this node
}