import { ActivityType } from "../enums/activity.enums";
import { EquipmentType } from "../enums/item.enums";
import { ProgressionTier } from "../enums/game.enums";
import { LevelInfo , BaseStats} from "./base.types";

export interface Hunter {
    id: string;
    name: string;
    stats: BaseStats & { attributePoints: number };
    equipment: HunterEquipment;
    activityLevels: ActivityLevels;
    currentActivity?: {
      type: ActivityType;
      startTime: number;
      lastActiveTime: number;
      isActive: boolean;
      nodeId?: string;     // For gathering activities
      workbenchId?: string; // For crafting activities
    };
    unlockedContent: UnlockedContent;
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
  