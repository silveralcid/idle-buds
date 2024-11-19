// src/types/tree.types.ts
import { ProgressionTier } from "../enums/game.enums";
import { ResourceType, WoodType } from "../enums/resource.enums";
import { ResourceNode, ResourceCollectionResult } from "./resource.types";

export interface TreeNode extends ResourceNode {
  resourceType: ResourceType.LOGS;
  woodType: WoodType;
  treeHealth: {
    current: number;
    max: number;
  };
  baseYield: number;
  bonusYield?: {
    affinity?: number;    // Bonus for grass affinity
    passion?: number;     // Bonus for gathering passion
    tool?: number;        // Bonus from tool tier
  };
}

export interface TreeRequirements {
  activityLevel: number;  // Lumbering level required
  toolTier: ProgressionTier;
}

// Tree Data Structure
export interface TreeData {
  [WoodType.TIER_1_WOOD]: TreeProperties;
  [WoodType.TIER_2_WOOD]: TreeProperties;
  [WoodType.TIER_3_WOOD]: TreeProperties;
  [WoodType.TIER_4_WOOD]: TreeProperties;
  [WoodType.TIER_5_WOOD]: TreeProperties;
  [WoodType.TIER_6_WOOD]: TreeProperties;
  [WoodType.TIER_7_WOOD]: TreeProperties;
  [WoodType.TIER_8_WOOD]: TreeProperties;
}

export interface TreeProperties {
  name: string;
  tier: ProgressionTier;
  baseHealth: number;
  baseYield: number;
  respawnTicks: number;
  requirements: TreeRequirements;
  resourcesPerTick: number;
  xpPerResource: number;
  region: string;
}

// Tree Gathering Result
export interface TreeGatheringResult extends ResourceCollectionResult {
  woodType: WoodType;
  bonuses: {
    affinityBonus: number;
    passionBonus: number;
    toolBonus: number;
    totalEfficiency: number;
  };
}

// Active Tree Gathering Session
export interface TreeGatheringSession {
  treeId: string;
  woodType: WoodType;
  startTime: number;
  lastTickProcessed: number;
  gatherers: {
    hunters: {
      [hunterId: string]: TreeGathererInfo;
    };
    buds: {
      [budId: string]: TreeGathererInfo;
    };
  };
}

export interface TreeGathererInfo {
  startTime: number;
  lastTickProcessed: number;
  efficiency: number;
  bonuses: {
    tool?: number;
    affinity?: number;
    passion?: number;
  };
  totalResourcesGathered: number;
}
