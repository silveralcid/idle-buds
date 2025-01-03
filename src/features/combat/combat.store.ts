import { create } from "zustand";
import { BaseSkill } from "../../types/base-skill.types";
import { calculateXpToNextLevel } from "../../utils/experience";

interface CombatStats {
  health: number;
  intelligence: number;
  attack: number;
  defense: number;
  dexterity: number;
}

interface CombatState extends BaseSkill {
  // Combat specific stats
  stats: CombatStats;
  availableAttributePoints: number;
  totalAttributePoints: number;

  // State setters
  setXp: (xp: number) => void;
  setLevel: (level: number) => void;
  
  // Attribute point management
  addAttributePoint: (stat: keyof CombatStats) => void;
  removeAttributePoint: (stat: keyof CombatStats) => void;
  resetAttributePoints: () => void;
  
  // Utility methods
  xpToNextLevel: () => number;
  reset: () => void;
}

export const useCombatStore = create<CombatState>((set, get) => ({
  // Base skill properties
  id: "combat",
  name: "Combat",
  description: "Train your combat abilities and grow stronger.",
  xp: 0,
  level: 1,
  progress: 0,
  isUnlocked: true,
  unlockRequirements: undefined,

  // Combat specific state
  stats: {
    health: 10,      // Base stats
    intelligence: 5,
    attack: 5,
    defense: 5,
    dexterity: 5,
  },
  availableAttributePoints: 0,
  totalAttributePoints: 0,

  setXp: (xp: number) => set((state) => {
    const requiredXp = get().xpToNextLevel();
    
    if (xp >= requiredXp) {
      const newLevel = state.level + 1;
      const newAttributePoints = state.availableAttributePoints + 5; // 5 points per level
      
      return {
        level: newLevel,
        xp: xp - requiredXp,
        availableAttributePoints: newAttributePoints,
        totalAttributePoints: state.totalAttributePoints + 5
      };
    }
    
    return { xp };
  }),

  setLevel: (level: number) => set((state) => {
    const levelDifference = level - state.level;
    const newAttributePoints = state.availableAttributePoints + (levelDifference * 5);
    
    return {
      level,
      availableAttributePoints: newAttributePoints,
      totalAttributePoints: state.totalAttributePoints + (levelDifference * 5)
    };
  }),

  addAttributePoint: (stat: keyof CombatStats) => set((state) => {
    if (state.availableAttributePoints <= 0) return state;

    return {
      stats: {
        ...state.stats,
        [stat]: state.stats[stat] + 1
      },
      availableAttributePoints: state.availableAttributePoints - 1
    };
  }),

  removeAttributePoint: (stat: keyof CombatStats) => set((state) => {
    const baseValue = stat === 'health' ? 10 : 5;
    const pointsSpentOnStat = state.stats[stat] - baseValue;
    
    if (pointsSpentOnStat <= 0) return state;

    return {
      stats: {
        ...state.stats,
        [stat]: state.stats[stat] - 1
      },
      availableAttributePoints: state.availableAttributePoints + 1
    };
  }),

  resetAttributePoints: () => set((state) => ({
    stats: {
      health: 10,
      intelligence: 5,
      attack: 5,
      defense: 5,
      dexterity: 5,
    },
    availableAttributePoints: state.totalAttributePoints
  })),

  xpToNextLevel: () => calculateXpToNextLevel(get().level),

  reset: () => set(() => ({
    xp: 0,
    level: 1,
    progress: 0,
    stats: {
      health: 10,
      intelligence: 5,
      attack: 5,
      defense: 5,
      dexterity: 5,
    },
    availableAttributePoints: 0,
    totalAttributePoints: 0
  }))
}));
