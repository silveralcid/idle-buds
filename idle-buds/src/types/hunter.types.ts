import { ActivityType } from "../enums/activity.enums";
import { EquipmentType } from "../enums/item.enums";
import { ProgressionTier } from "../enums/game.enums";
import { LevelInfo , BaseStats} from "./base.types";

  export interface Hunter {
    id: string;
    name: string;
    stats: HunterStats;
    equipment: HunterEquipment;
    activityLevels: ActivityLevels;
    currentActivity?: CurrentActivity;
    unlockedContent: UnlockedContent;
}
  
export interface CurrentActivity {
    type: ActivityType;
    startTime: number;
    lastActiveTime: number;    // Changed to lastTickProcessed
    lastTickProcessed: number; // Added this field
    isActive: boolean;
    nodeId?: string;
    workbenchId?: string;
  }

export interface HunterStats extends BaseStats {
    attributePoints: number;
}

  export interface ActivityLevels {
    combat: LevelInfo;
    watering: LevelInfo;
    planting: LevelInfo;
    fishing: LevelInfo;
    smithing: LevelInfo;
    smelting: LevelInfo;
    cooking: LevelInfo;
    lumbering: LevelInfo;   
    crafting: LevelInfo
    mining: LevelInfo;
    hatching: LevelInfo;
    offering: LevelInfo;
  }
  
  export interface HunterEquipment {
    weapon?: EquipmentType;
    armor?: EquipmentType;
    shield?: EquipmentType;
    tool?: EquipmentType;
    accessory?: EquipmentType;
  }
  
  export interface UnlockedContent {
    regions: string[];
    resourceNodes: {
      [key: string]: {     // nodeId as key
        type: ActivityType;
        tier: ProgressionTier;
        unlockTime: number;
      }
    };
    workbenches: {
      [key: string]: {     // workbenchId as key
        type: ActivityType;
        tier: ProgressionTier;
        unlockTime: number;
      }
    };
  }
  