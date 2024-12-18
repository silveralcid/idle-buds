import { create } from "zustand";
import { BaseSkill } from "../../types/base-skill.types";
import { calculateXpToNextLevel } from "../../utils/experience";
import { EggHatchData } from "../../types/egg.types";

interface HatchingProcess {
  eggId: string;
  progress: number;
  totalTicks: number;
  startTime: number;
}

interface TendingState extends BaseSkill {
  activeHatching: HatchingProcess | null;
  setActiveHatching: (process: HatchingProcess | null) => void;
  updateHatchingProgress: (progress: number) => void;
  cancelHatching: () => void;
  setXp: (xp: number) => void;
  setLevel: (level: number) => void;
  xpToNextLevel: () => number;
}

export const useTendingStore = create<TendingState>((set, get) => ({
  id: "tending",
  name: "Tending",
  description: "Care for and nurture your Buds",
  xp: 0,
  level: 1,
  progress: 0,
  isUnlocked: true,
  activeHatching: null,

  setActiveHatching: (process) => set({ activeHatching: process }),
  
  updateHatchingProgress: (progress) => set((state) => ({
    activeHatching: state.activeHatching 
      ? { ...state.activeHatching, progress }
      : null
  })),

  cancelHatching: () => set({ activeHatching: null }),
  
  setXp: (xp) => set({ xp }),
  setLevel: (level) => set({ level }),
  xpToNextLevel: () => calculateXpToNextLevel(get().level)
}));
