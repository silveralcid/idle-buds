import { create } from "zustand";
import { calculateXpToNextLevel } from "../../utils/experience";
import { BaseSkill } from "../../types/base-skill.types";
import { Workbench } from "../../types/workbench.types";
import { Recipe } from "../../types/recipe.types";

export interface ActiveWorkbench {
  id: string;
  recipe: Recipe | null;
  progress: number;
  isActive: boolean;
}

export interface SmithingState extends BaseSkill {
  workbenches: Record<string, ActiveWorkbench>;
  recipes: Recipe[]; // Available recipes for smithing
  setXp: (xp: number) => void;
  setLevel: (level: number) => void;
  setProgress: (progress: number) => void;
  xpToNextLevel: () => number;
  addWorkbench: (workbench: Workbench) => void;
  activateWorkbench: (workbenchId: string, recipeId: string) => void;
  updateWorkbenchProgress: (workbenchId: string, delta: number) => void;
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
  workbenches: {}, // Initially no workbenches
  recipes: [], // Initialize recipes

  setXp: (xp: number) => set(() => ({ xp })),
  setLevel: (level: number) => set(() => ({ level })),
  setProgress: (progress: number) => set(() => ({ progress })),
  xpToNextLevel: () => calculateXpToNextLevel(get().level),

  addWorkbench: (workbench: Workbench) =>
    set((state) => ({
      workbenches: {
        ...state.workbenches,
        [workbench.id]: {
          id: workbench.id,
          recipe: null,
          progress: 0,
          isActive: false,
        },
      },
    })),

  activateWorkbench: (workbenchId: string, recipeId: string) =>
    set((state) => {
      const workbench = state.workbenches[workbenchId];
      const recipe = state.recipes.find((r) => r.id === recipeId);

      if (!workbench || !recipe || state.level < recipe.levelRequired) return state;

      return {
        workbenches: {
          ...state.workbenches,
          [workbenchId]: {
            ...workbench,
            recipe,
            isActive: true,
            progress: 0,
          },
        },
      };
    }),

  updateWorkbenchProgress: (workbenchId: string, delta: number) =>
    set((state) => {
      const workbench = state.workbenches[workbenchId];
      if (!workbench || !workbench.isActive || !workbench.recipe) return state;

      const newProgress = workbench.progress + delta;
      const recipe = workbench.recipe;

      if (newProgress >= recipe.craftingTime) {
        // Add outputs to the bank/store and reset progress
        // Bank handling logic goes here
        console.log(`Crafting complete for ${recipe.name}`);
        return {
          workbenches: {
            ...state.workbenches,
            [workbenchId]: {
              ...workbench,
              isActive: false,
              progress: 0,
            },
          },
        };
      }

      return {
        workbenches: {
          ...state.workbenches,
          [workbenchId]: {
            ...workbench,
            progress: newProgress,
          },
        },
      };
    }),

  reset: () =>
    set(() => ({
      xp: 0,
      level: 1,
      progress: 0,
      workbenches: {},
      recipes: [],
    })),
}));
