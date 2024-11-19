import { ProgressionTier } from "../enums/game.enums";
import { ResourceType } from "../enums/resource.enums";

export interface ResourceNode {
    id: string;
    resourceType: ResourceType;
    tier: ProgressionTier;
    region: string;
    requirements: {
      activityLevel: number;
      toolTier: ProgressionTier;
    };
    isUnlocked: boolean;
    respawnTime: number;
    lastTickProcessed: number;
    ticksUntilRespawn: number;
    resourcesPerTick: number;
    activeGatherers: {
      hunters: {
        [hunterId: string]: {
          startTime: number;
          lastTickProcessed: number;
          efficiency: number;  // Modified by tools and stats
        }
      };
      buds: {
        [budId: string]: {
          startTime: number;
          lastTickProcessed: number;
          efficiency: number;  // Modified by affinity and passion
        }
      };
    };
  }
  
  // Helper type for tracking gathering activities
  export interface GatheringActivity {
    nodeId: string;
    resourceType: ResourceType;
    startTime: number;
    lastTickProcessed: number;
    efficiency: number;
    accumulatedResources: number;
  }
  
  // Resource Collection Result
  export interface ResourceCollectionResult {
    nodeId: string;
    resourceId: string;
    quantity: number;
    ticksProcessed: number;
    efficiency: number;
    gathererType: 'HUNTER' | 'BUD';
    gathererId: string;
  }
  