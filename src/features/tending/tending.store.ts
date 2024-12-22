import { create } from "zustand";
import { BaseSkill } from "../../types/base-skill.types";
import { calculateXpToNextLevel } from "../../utils/experience";
import { EggHatchData } from "../../types/egg.types";
import { GameConfig } from "../../core/constants/game-config";

interface HatchingProcess {
  eggId: string;
  progress: number;
  totalTicks: number;
  startTime: number;
  lastProcessedTime: number;
}

interface TendingState extends BaseSkill {
  activeHatching: HatchingProcess | null;
  setActiveHatching: (process: HatchingProcess | null) => void;
  updateHatchingProgress: (progress: number, currentTime?: number) => void;
  cancelHatching: () => void;
  setXp: (xp: number) => void;
  setLevel: (level: number) => void;
  xpToNextLevel: () => number;
  reset: () => void;
}

export const useTendingStore = create<TendingState>((set, get) => ({
  id: "tending",
  name: "Tending",
  description: "Care for and nurture your Buds",
  xp: 0,
  level: 1,
  progress: 0,
  isUnlocked: true,
  unlockRequirements: undefined,
  activeHatching: null,
  
  setActiveHatching: (process) => {
    if (process) {
      const currentTime = Date.now();
      set({ 
        activeHatching: {
          ...process,
          lastProcessedTime: process.lastProcessedTime || currentTime
        }
      });
    } else {
      set({ activeHatching: null });
    }
  },
  
  updateHatchingProgress: (progress: number, currentTime: number = Date.now()) => set((state) => ({
    activeHatching: state.activeHatching 
      ? { 
          ...state.activeHatching, 
          progress,
          lastProcessedTime: currentTime
        }
      : null
  })),

  cancelHatching: () => set({ activeHatching: null }),
  
  setXp: (xp) => set((state) => {
    // Don't process XP if already at max level
    if (state.level >= GameConfig.EXPERIENCE.MAX_LEVEL) {
      return { xp: 0 };
    }

    const requiredXp = get().xpToNextLevel();
    
    // Handle potential level up
    if (xp >= requiredXp) {
      const newLevel = Math.min(state.level + 1, GameConfig.EXPERIENCE.MAX_LEVEL);
      return {
        level: newLevel,
        xp: newLevel === GameConfig.EXPERIENCE.MAX_LEVEL ? 0 : xp - requiredXp
      };
    }
    
    return { xp };
  }),

  setLevel: (level) => set({ 
    level: Math.min(level, GameConfig.EXPERIENCE.MAX_LEVEL),
    xp: level >= GameConfig.EXPERIENCE.MAX_LEVEL ? 0 : get().xp
  }),
  
  xpToNextLevel: () => calculateXpToNextLevel(get().level),

  reset: () => set({
    xp: 0,
    level: 1,
    progress: 0,
    activeHatching: null,
    isUnlocked: true,
    unlockRequirements: undefined
  })
}));
