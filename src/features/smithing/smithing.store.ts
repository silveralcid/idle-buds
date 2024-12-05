import { create } from "zustand";
import { calculateXpToNextLevel } from "../../utils/experience";
import { BaseSkill } from "../../types/base-skill.types";

export interface SmithingState extends BaseSkill {
    setXp: (xp: number) => void;
    setLevel: (level: number) => void;
    setProgress: (progress: number) => void;
    xpToNextLevel: () => number;
    reset: () => void;
}

export const useSmithingStore = create<SmithingState>((set, get) => ({
    id: "smithing",
    name: "Smithing",
    description: "Forge items from raw materials.",
    xp: 0,
    level: 1,
    progress: 0,
    isUnlocked: true,
    unlockRequirements: undefined,

    setXp: (xp: number) => set(() => ({ xp })),
    setLevel: (level: number) => set(() => ({ level })),
    setProgress: (progress: number) => set(() => ({ progress })),

    reset: () =>
        set(() => ({
            xp: 0,
            level: 1,
            progress: 0,
        })),

    xpToNextLevel: () => calculateXpToNextLevel(get().level),
}));
