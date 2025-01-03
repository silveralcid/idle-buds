import { create } from 'zustand';
import { budInstance } from '../../types/budInstance.types';
import { budBase } from '../../types/budBase.types';
import { createBudInstance } from '../../factories/budFactory';

interface PartyState {
  buds: Record<string, budInstance>;
  selectedBudId: string | null;
  addBud: (bud: budInstance) => boolean;
  removeBud: (budId: string) => void;
  getBud: (budId: string) => budInstance | undefined;
  getAllBuds: () => budInstance[];
  selectBud: (budId: string | null) => void;
  isPartyFull: () => boolean;
  getPartySize: () => number;
  MAX_PARTY_SIZE: number;
  adjustBudLevel: (budId: string, newLevel: number) => void;
  healBud: (budId: string, amount: number) => void;
  damageBud: (budId: string, amount: number) => void;
  restoreAllBudsHealth: () => void;
}

export const usePartyStore = create<PartyState>((set, get) => ({
  buds: {},
  selectedBudId: null,
  MAX_PARTY_SIZE: 6,

  addBud: (bud: budInstance) => {
    const state = get();
    if (Object.keys(state.buds).length >= state.MAX_PARTY_SIZE) {
      return false;
    }

    set((state) => ({
      buds: {
        ...state.buds,
        [bud.id]: {
          ...bud,
          assignment: "party"
        }
      }
    }));
    return true;
  },

  removeBud: (budId: string) =>
    set((state) => {
      const newBuds = { ...state.buds };
      delete newBuds[budId];
      return { buds: newBuds };
    }),

  getBud: (budId: string) => {
    const state = get();
    return state.buds[budId];
  },

  getAllBuds: () => {
    const state = get();
    return Object.values(state.buds);
  },

  selectBud: (budId: string | null) =>
    set(() => ({
      selectedBudId: budId
    })),

  isPartyFull: () => {
    const state = get();
    return Object.keys(state.buds).length >= state.MAX_PARTY_SIZE;
  },

  getPartySize: () => {
    const state = get();
    return Object.keys(state.buds).length;
  },

  adjustBudLevel: (budId: string, newLevel: number) =>
    set((state) => {
      const bud = state.buds[budId];
      if (!bud) return state;

      const clampedLevel = Math.min(Math.max(1, newLevel), 100);
      const newMaxHealth = bud.baseStats.health + (bud.statsPerLevel.health * (clampedLevel - 1));

      return {
        buds: {
          ...state.buds,
          [budId]: {
            ...bud,
            level: clampedLevel,
            maxHealth: newMaxHealth,
            currentHealth: newMaxHealth // Optionally heal to full when leveling
          }
        }
      };
    }),

  healBud: (budId: string, amount: number) =>
    set((state) => {
      const bud = state.buds[budId];
      if (!bud) return state;

      return {
        buds: {
          ...state.buds,
          [budId]: {
            ...bud,
            currentHealth: Math.min(bud.maxHealth, bud.currentHealth + amount)
          }
        }
      };
    }),

  damageBud: (budId: string, amount: number) =>
    set((state) => {
      const bud = state.buds[budId];
      if (!bud) return state;

      return {
        buds: {
          ...state.buds,
          [budId]: {
            ...bud,
            currentHealth: Math.max(0, bud.currentHealth - amount)
          }
        }
      };
    }),

  restoreAllBudsHealth: () =>
    set((state) => ({
      buds: Object.fromEntries(
        Object.entries(state.buds).map(([id, bud]) => [
          id,
          { ...bud, currentHealth: bud.maxHealth }
        ])
      )
    })),
}));
