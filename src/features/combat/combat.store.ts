import { create } from "zustand";
import { BaseSkill } from "../../types/base-skill.types";
import { calculateXpToNextLevel } from "../../utils/experience";
import { useEquipmentStore } from "../equipment/equipment.store";

export interface CombatStats {
  health: number;      // Base health attribute
  intelligence: number;
  attack: number;
  defense: number;
  dexterity: number;
}

interface CombatState extends BaseSkill {
  // Combat specific stats
  stats: CombatStats;
  currentHealth: number;  // Active health tracking
  maxHealth: number;     // Calculated max health (base + equipment)
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

  // Add this new method
  addAvailablePoints: (amount: number) => void;

  // Add health management methods
  healPlayer: (amount: number) => void;
  damagePlayer: (amount: number) => void;
  restoreFullHealth: () => void;
  isDead: () => boolean;
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
  currentHealth: 10,
  maxHealth: 10,
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

    const newStats = {
      ...state.stats,
      [stat]: state.stats[stat] + 1
    };

    // If increasing health, recalculate maxHealth and heal to full
    if (stat === 'health') {
      const equipmentStore = useEquipmentStore.getState();
      const equipmentHealth = equipmentStore.getTotalStats().health;
      const newMaxHealth = newStats.health + equipmentHealth;

      return {
        stats: newStats,
        maxHealth: newMaxHealth,
        currentHealth: newMaxHealth,
        availableAttributePoints: state.availableAttributePoints - 1
      };
    }

    return {
      stats: newStats,
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
  })),

  // Add this new method
  addAvailablePoints: (amount: number) => set((state) => ({
    availableAttributePoints: state.availableAttributePoints + amount,
    totalAttributePoints: state.totalAttributePoints + amount
  })),

  healPlayer: (amount: number) => set((state) => ({
    currentHealth: Math.min(
      state.maxHealth,
      state.currentHealth + amount
    )
  })),

  damagePlayer: (amount: number) => set((state) => ({
    currentHealth: Math.max(0, state.currentHealth - amount)
  })),

  restoreFullHealth: () => set((state) => ({
    currentHealth: state.maxHealth
  })),

  isDead: () => {
    const state = get();
    return state.currentHealth <= 0;
  },
}));
