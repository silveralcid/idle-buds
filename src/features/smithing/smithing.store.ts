import { create } from "zustand";
import { calculateXpToNextLevel } from "../../utils/experience";
import { BaseSkill } from "../../types/base-skill.types";
import { Workbench } from "../../types/workbench.types";
import { Recipe } from "../../types/recipe.types";
import { recipeRegistry, getRecipesByWorkbench } from "../../data/recipe-registry";
import { useBankStore } from "../../features/bank/bank.store";

export interface ActiveWorkbench {
  id: string;
  type: string;
  recipe: Recipe | null;
  progress: number;
  isActive: boolean;
}

export interface SmithingState extends BaseSkill {
  workbenches: Record<string, ActiveWorkbench>;
  recipes: Recipe[];
  unlockedRecipes: string[];
  setXp: (xp: number) => void;
  setLevel: (level: number) => void;
  addWorkbench: (workbench: Workbench) => void;
  removeWorkbench: (workbenchId: string) => void;
  activateWorkbench: (workbenchId: string, recipeId: string) => void;
  updateWorkbenchProgress: (workbenchId: string, delta: number) => void;
  xpToNextLevel: () => number;
  isRecipeUnlocked: (recipeId: string) => boolean;
  reset: () => void;
}

export const useSmithingStore = create<SmithingState>((set, get) => ({
  id: "smithing",
  name: "Smithing",
  description: "Forge items from raw materials.",
  xp: 0,
  level: 5,
  progress: 0,
  isUnlocked: true,
  unlockRequirements: undefined,
  workbenches: {
    smithing_anvil: {
      id: "smithing_anvil",
      type: "smithing",
      recipe: null,
      progress: 0,
      isActive: false,
    },
    smelting_furnace: {
      id: "smelting_furnace",
      type: "smelting",
      recipe: null,
      progress: 0,
      isActive: false,
    },
  },
  recipes: recipeRegistry,
  unlockedRecipes: [],

  setXp: (xp: number) => set(() => ({ xp })),
  setLevel: (level: number) => set((state) => {
    const newUnlockedRecipes = state.recipes
      .filter(recipe => recipe.levelRequired <= level)
      .map(recipe => recipe.id);

    return { 
      level,
      unlockedRecipes: newUnlockedRecipes
    };
  }),
  xpToNextLevel: () => calculateXpToNextLevel(get().level),

  addWorkbench: (workbench: Workbench) =>
    set((state) => ({
      workbenches: {
        ...state.workbenches,
        [workbench.id]: {
          id: workbench.id,
          type: workbench.workbenchType,
          recipe: null,
          progress: 0,
          isActive: false,
        },
      },
    })),

  removeWorkbench: (workbenchId: string) =>
    set((state) => {
      const { [workbenchId]: _, ...remaining } = state.workbenches;
      return { workbenches: remaining };
    }),

  activateWorkbench: (workbenchId: string, recipeId: string) =>
    set((state) => {
      const workbench = state.workbenches[workbenchId];
      const recipe = state.recipes.find((r) => r.id === recipeId);
      const bankStore = useBankStore.getState();

      if (!workbench || !recipe || !state.isRecipeUnlocked(recipeId)) return state;

      const hasResources = recipe.inputs.every(input => {
        const hasAny = input.itemIds.some(itemId => 
          (bankStore.items[itemId] || 0) >= input.amount
        );
        return hasAny;
      });

      if (!hasResources) return state;

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
      const bankStore = useBankStore.getState();

      if (newProgress >= recipe.craftingTime) {
        // Consume inputs
        recipe.inputs.forEach(input => {
          const availableItemId = input.itemIds.find(id => 
            (bankStore.items[id] || 0) >= input.amount
          );
          if (availableItemId) {
            bankStore.removeItem(availableItemId, input.amount);
          }
        });

        // Add outputs
        recipe.outputs.forEach(output => {
          bankStore.addItem(output.itemId, output.amount);
        });

        // Add experience
        const newXp = state.xp + recipe.experienceGain;
        return {
          xp: newXp,
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
      workbenches: {
        smithing_anvil: {
          id: "smithing_anvil",
          type: "smithing",
          recipe: null,
          progress: 0,
          isActive: false,
        },
        smelting_furnace: {
          id: "smelting_furnace",
          type: "smelting",
          recipe: null,
          progress: 0,
          isActive: false,
        },
      },
      recipes: recipeRegistry,
    })),

  isRecipeUnlocked: (recipeId: string) => {
    const recipe = get().recipes.find(r => r.id === recipeId);
    return recipe ? get().level >= recipe.levelRequired : false;
  },
}));
