import { create } from 'zustand';
import { ActivityLevels, HunterStats, CurrentActivity } from '../types/hunter.types';
import { ActivityType } from '../enums/activity.enums';
import { calculateNewLevel } from '../utils/level.utils';

interface HunterStore {
  activityLevels: ActivityLevels;
  stats: HunterStats;
  currentActivity?: {
    type: ActivityType;
    startTime: number;
    lastTickProcessed: number;
    isActive: boolean;
    nodeId?: string;
  };
  setCurrentActivity: (activity: CurrentActivity | undefined) => void;
  updateActivityLevel: (type: ActivityType, xp: number) => void;
}

export const useHunterStore = create<HunterStore>((set) => ({
  activityLevels: {
    lumbering: { level: 1, currentXp: 0, requiredXp: 100 },

    mining: { level: 1, currentXp: 0, requiredXp: 100 },
    fishing: { level: 1, currentXp: 0, requiredXp: 100 },
    combat: { level: 1, currentXp: 0, requiredXp: 100 },
    planting: { level: 1, currentXp: 0, requiredXp: 100 },
    watering: { level: 1, currentXp: 0, requiredXp: 100 },
    smithing: { level: 1, currentXp: 0, requiredXp: 100 },
    smelting: { level: 1, currentXp: 0, requiredXp: 100 },
    cooking: { level: 1, currentXp: 0, requiredXp: 100 },
    hatching: { level: 1, currentXp: 0, requiredXp: 100 },
    offering: { level: 1, currentXp: 0, requiredXp: 100 },
    crafting: { level: 1, currentXp: 0, requiredXp: 100 }
    // ... other activities
  },
  stats: {
    health: 10,
    wisdom: 10,
    attack: 10,
    defense: 10,
    dexterity: 10,
    attributePoints: 0
  },
  currentActivity: undefined,
  setCurrentActivity: (activity) => set({ currentActivity: activity }),
  updateActivityLevel: (type, xp) => 
    set((state) => ({
      activityLevels: {
        ...state.activityLevels,
        [type]: calculateNewLevel(state.activityLevels[type], xp)
      }
    }))
}));