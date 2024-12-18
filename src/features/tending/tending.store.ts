import { create } from "zustand";
import { useBankStore } from "../bank/bank.store";
import { BaseSkill } from "../../types/base-skill.types";
import { calculateXpToNextLevel } from "../../utils/experience";

export interface TendingState extends BaseSkill {
    setXp: (xp: number) => void;
    setLevel: (level: number) => void;
    xpToNextLevel: () => number;
    reset: () => void;
}

export const useTendingStore = create<TendingState>((set, get) => ({
    id: "tending",
    name: "Tending",
    description: "Care for and nurture your Buds to help them grow stronger.",
    xp: 0,
    level: 1,
    progress: 0,
    isUnlocked: true,
    unlockRequirements: undefined,
    activeBud: null,
    buds: {},

    setXp: (xp: number) => set(() => ({ xp })),
    setLevel: (level: number) => set(() => ({ level })),

    reset: () =>
        set(() => ({
            xp: 0,
            level: 1,
            progress: 0,
            activeBud: null,
            buds: {},
        })),
    xpToNextLevel: () => calculateXpToNextLevel(get().level),
}));
