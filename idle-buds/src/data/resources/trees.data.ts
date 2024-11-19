// src/data/trees.data.ts
import { ResourceType, WoodType } from '../../enums/resource.enums';
import { ProgressionTier } from '../../enums/game.enums';
import { TreeNode } from '../../types/tree.types';

export const treesData: Record<string, TreeNode> = {
  'basic-tree-1': {
    id: 'basic-tree-1',
    resourceType: ResourceType.LOGS,
    woodType: WoodType.TIER_1_WOOD,
    tier: ProgressionTier.TIER_1,
    region: 'starter-forest',
    treeHealth: {
      current: 100,
      max: 100
    },
    baseYield: 1,
    requirements: {
      activityLevel: 1,
      toolTier: ProgressionTier.TIER_1
    },
    isUnlocked: true,
    respawnTime: 20,
    lastTickProcessed: 0,
    ticksUntilRespawn: 0,
    resourcesPerTick: 0.5,
    activeGatherers: {
      hunters: {},
      buds: {}
    }
  },
  'dense-tree-2': {
    id: 'dense-tree-2',
    resourceType: ResourceType.LOGS,
    woodType: WoodType.TIER_2_WOOD,
    tier: ProgressionTier.TIER_2,
    region: 'dense-forest',
    treeHealth: {
      current: 150,
      max: 150
    },
    baseYield: 2,
    requirements: {
      activityLevel: 15,
      toolTier: ProgressionTier.TIER_2
    },
    isUnlocked: false,
    respawnTime: 25,
    lastTickProcessed: 0,
    ticksUntilRespawn: 0,
    resourcesPerTick: 0.75,
    activeGatherers: {
      hunters: {},
      buds: {}
    }
  },
  'mystic-tree-3': {
    id: 'mystic-tree-3',
    resourceType: ResourceType.LOGS,
    woodType: WoodType.TIER_3_WOOD,
    tier: ProgressionTier.TIER_3,
    region: 'mystic-grove',
    treeHealth: {
      current: 225,
      max: 225
    },
    baseYield: 3,
    requirements: {
      activityLevel: 30,
      toolTier: ProgressionTier.TIER_3
    },
    isUnlocked: false,
    respawnTime: 30,
    lastTickProcessed: 0,
    ticksUntilRespawn: 0,
    resourcesPerTick: 1,
    activeGatherers: {
      hunters: {},
      buds: {}
    }
  },
  'ancient-tree-4': {
    id: 'ancient-tree-4',
    resourceType: ResourceType.LOGS,
    woodType: WoodType.TIER_4_WOOD,
    tier: ProgressionTier.TIER_4,
    region: 'ancient-woods',
    treeHealth: {
      current: 350,
      max: 350
    },
    baseYield: 4,
    requirements: {
      activityLevel: 45,
      toolTier: ProgressionTier.TIER_4
    },
    isUnlocked: false,
    respawnTime: 35,
    lastTickProcessed: 0,
    ticksUntilRespawn: 0,
    resourcesPerTick: 1.25,
    activeGatherers: {
      hunters: {},
      buds: {}
    }
  },
  'shadow-tree-5': {
    id: 'shadow-tree-5',
    resourceType: ResourceType.LOGS,
    woodType: WoodType.TIER_5_WOOD,
    tier: ProgressionTier.TIER_5,
    region: 'shadow-realm',
    treeHealth: {
      current: 500,
      max: 500
    },
    baseYield: 5,
    requirements: {
      activityLevel: 60,
      toolTier: ProgressionTier.TIER_5
    },
    isUnlocked: false,
    respawnTime: 40,
    lastTickProcessed: 0,
    ticksUntilRespawn: 0,
    resourcesPerTick: 1.5,
    activeGatherers: {
      hunters: {},
      buds: {}
    }
  },
  'crystal-tree-6': {
    id: 'crystal-tree-6',
    resourceType: ResourceType.LOGS,
    woodType: WoodType.TIER_6_WOOD,
    tier: ProgressionTier.TIER_6,
    region: 'crystal-forest',
    treeHealth: {
      current: 700,
      max: 700
    },
    baseYield: 6,
    requirements: {
      activityLevel: 75,
      toolTier: ProgressionTier.TIER_6
    },
    isUnlocked: false,
    respawnTime: 45,
    lastTickProcessed: 0,
    ticksUntilRespawn: 0,
    resourcesPerTick: 1.75,
    activeGatherers: {
      hunters: {},
      buds: {}
    }
  },
  'dragon-tree-7': {
    id: 'dragon-tree-7',
    resourceType: ResourceType.LOGS,
    woodType: WoodType.TIER_7_WOOD,
    tier: ProgressionTier.TIER_7,
    region: 'dragon-grove',
    treeHealth: {
      current: 1000,
      max: 1000
    },
    baseYield: 7,
    requirements: {
      activityLevel: 85,
      toolTier: ProgressionTier.TIER_7
    },
    isUnlocked: false,
    respawnTime: 50,
    lastTickProcessed: 0,
    ticksUntilRespawn: 0,
    resourcesPerTick: 2,
    activeGatherers: {
      hunters: {},
      buds: {}
    }
  },
  'celestial-tree-8': {
    id: 'celestial-tree-8',
    resourceType: ResourceType.LOGS,
    woodType: WoodType.TIER_8_WOOD,
    tier: ProgressionTier.TIER_8,
    region: 'celestial-realm',
    treeHealth: {
      current: 1500,
      max: 1500
    },
    baseYield: 8,
    requirements: {
      activityLevel: 95,
      toolTier: ProgressionTier.TIER_8
    },
    isUnlocked: false,
    respawnTime: 60,
    lastTickProcessed: 0,
    ticksUntilRespawn: 0,
    resourcesPerTick: 2.5,
    activeGatherers: {
      hunters: {},
      buds: {}
    }
  }
};