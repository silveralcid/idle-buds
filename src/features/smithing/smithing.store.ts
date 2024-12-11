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
  activateWorkbench: (workbenchId: string, recipeId: string) => void;
  updateWorkbenchProgress: (workbenchId: string, delta: number) => void;
  xpToNextLevel: () => number;
  isRecipeUnlocked: (recipeId: string) => boolean;
  canCraftRecipe: (recipe: Recipe) => boolean;
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

  activateWorkbench: (workbenchId: string, recipeId: string) =>
    set((state) => {
      const workbench = state.workbenches[workbenchId];
      const recipe = state.recipes.find((r) => r.id === recipeId);
      const bankStore = useBankStore.getState();

      if (!workbench || !recipe || !state.isRecipeUnlocked(recipeId)) return state;

      // Toggle off if already active with same recipe
      if (workbench.isActive && workbench.recipe?.id === recipeId) {
        return {
          workbenches: {
            ...state.workbenches,
            [workbenchId]: {
              ...workbench,
              isActive: false,
              recipe: null,
              progress: 0,
            },
          },
        };
      }

      // Check resources before starting
      const hasResources = recipe.inputs.every(input => {
        const hasAny = input.itemIds.some(itemId => 
          (bankStore.items[itemId] || 0) >= input.amount
        );
        return hasAny;
      });

      if (!hasResources) return state;

      // Activate workbench with new recipe
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

      // Check if crafting cycle is complete
      if (newProgress >= recipe.craftingTime) {
        // Verify resources are still available
        const hasResources = recipe.inputs.every(input => {
          const hasAny = input.itemIds.some(itemId => 
            (bankStore.items[itemId] || 0) >= input.amount
          );
          return hasAny;
        });

        if (!hasResources) {
          // Stop crafting if resources depleted
          return {
            workbenches: {
              ...state.workbenches,
              [workbenchId]: {
                ...workbench,
                isActive: false,
                recipe: null,
                progress: 0,
              },
            },
          };
        }

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

        // Award full XP only on completion
        const newXp = state.xp + recipe.experienceGain;
        const requiredXp = state.xpToNextLevel();

        // Handle potential level up
        if (newXp >= requiredXp) {
          const newLevel = state.level + 1;
          return {
            xp: newXp - requiredXp,
            level: newLevel,
            workbenches: {
              ...state.workbenches,
              [workbenchId]: {
                ...workbench,
                progress: 0, // Reset progress but keep crafting active
              },
            },
          };
        }

        // No level up, just add XP
        return {
          xp: newXp,
          workbenches: {
            ...state.workbenches,
            [workbenchId]: {
              ...workbench,
              progress: 0, // Reset progress but keep crafting active
            },
          },
        };
      }

      // Just update progress if not complete
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

  canCraftRecipe: (recipe: Recipe) => {
    const bankStore = useBankStore.getState();
    return recipe.inputs.every(input => {
      return input.itemIds.some(itemId => 
        (bankStore.items[itemId] || 0) >= input.amount
      );
    });
  },
}));
