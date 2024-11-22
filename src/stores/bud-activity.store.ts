import { create } from "zustand";
import { updateBudResources } from "../utils/bank-update.utils";
import { processCrafting } from '../utils/bud-crafting.utils';

interface BudActivityState {
  activities: Record<string, {
    type: 'gathering' | 'crafting' | null;
    nodeId: string | null;
    recipeId: string | null;
  }>;
  fractionalProgress: Record<string, {
    items: Record<string, number>;
    xp: Record<string, number>;
  }>;
  startActivity: (budId: string, type: 'gathering' | 'crafting', nodeId: string, recipeId?: string | null) => void;
  stopActivity: (budId: string) => void;
  updateProgress: (deltaTime: number) => void;
}

export const useBudActivityStore = create<BudActivityState>((set, get) => ({
  activities: {},
  fractionalProgress: {},
  startActivity: (budId, type, nodeId, recipeId = null) => set((state) => ({
    activities: {
      ...state.activities,
      [budId]: { type, nodeId, recipeId }
    }
  })),
  stopActivity: (budId) => set((state) => {
    const newActivities = { ...state.activities };
    delete newActivities[budId];
    return { activities: newActivities };
  }),
  updateProgress: (deltaTime) => set((state) => {
    const newState = { ...state };
    
    Object.entries(state.activities).forEach(([budId, activity]) => {
      if (activity.type === 'gathering') {
        updateBudResources(newState, deltaTime, budId);
      } else if (activity.type === 'crafting') {
        processCrafting(newState, deltaTime, budId);
      }
    });
    
    return newState;
  })
})); 