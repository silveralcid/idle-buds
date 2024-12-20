import { useSmithingStore } from "./smithing.store";
import { GameConfig } from "../../core/constants/game-config";
import { useAssignmentStore } from "../assignment/assignment.store";
import { useBankStore } from "../bank/bank.store";

export const processSmithingTick = (deltaTime: number): void => {
  const smithingStore = useSmithingStore.getState();
  const { workbenches, updateWorkbenchProgress } = smithingStore;

  Object.entries(workbenches).forEach(([workbenchId, workbench]) => {
    if (!workbench.isActive || !workbench.recipe) return;

    const tickProgress = deltaTime * GameConfig.TICK.RATE.DEFAULT;
    updateWorkbenchProgress(workbenchId, tickProgress);
  });
};

export const startBudSmithing = (budId: string, workbenchId: string, recipeId: string): boolean => {
  console.group('Bud Smithing Operation');
  const { recipes, isRecipeUnlocked, canCraftRecipe } = useSmithingStore.getState();
  const assignmentStore = useAssignmentStore.getState();
  const bud = assignmentStore.getBud(budId);
  const recipe = recipes.find(r => r.id === recipeId);

  // Validation checks
  if (!recipe) {
    console.warn(`Recipe with ID "${recipeId}" does not exist.`);
    console.groupEnd();
    return false;
  }

  if (!bud) {
    console.warn(`Bud with ID "${budId}" does not exist.`);
    console.groupEnd();
    return false;
  }

  if (!isRecipeUnlocked(recipeId)) {
    console.warn(`Recipe "${recipe.name}" is locked.`);
    console.groupEnd();
    return false;
  }

  if (!canCraftRecipe(recipe)) {
    console.warn(`Missing resources for "${recipe.name}".`);
    console.groupEnd();
    return false;
  }

  useSmithingStore.getState().startBudCrafting(budId, workbenchId, recipeId);
  console.log(`Started bud smithing with "${bud.nickname || bud.name}" on "${recipe.name}".`);
  console.groupEnd();
  return true;
};

export const processBudSmithingTick = (deltaTime: number): void => {
  const smithingStore = useSmithingStore.getState();
  const assignmentStore = useAssignmentStore.getState();
  const bankStore = useBankStore.getState();

  // Get all buds assigned to smithing
  const smithingBuds = assignmentStore.getBudsByAssignment("smithing");

  smithingBuds.forEach((budId) => {
    const craftingStatus = smithingStore.getBudCraftingStatus(budId);
    if (!craftingStatus) return;

    const recipe = smithingStore.recipes.find(r => r.id === craftingStatus.recipeId);
    const bud = assignmentStore.getBud(budId);
    if (!recipe || !bud) return;
    // Calculate progress based on Bud's efficiency
    const baseEfficiency = craftingStatus.efficiency;
    const levelBonus = 1 + (bud.level * 0.05); // 5% increase per level
    const efficiency = baseEfficiency * levelBonus;
    
    const adjustedCraftingTime = recipe.craftingTime / efficiency;
    const newProgress = craftingStatus.progress + (deltaTime * GameConfig.TICK.RATE.DEFAULT);

    if (newProgress >= adjustedCraftingTime) {
      // Verify resources are still available
      const hasResources = recipe.inputs.every(input => {
        const hasAny = input.itemIds.some(itemId => 
          (bankStore.items[itemId] || 0) >= input.amount
        );
        return hasAny;
      });

      if (!hasResources) {
        // Stop crafting if resources depleted
        stopBudSmithing(budId);
        return;
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

      // Reset progress and continue crafting
      smithingStore.updateBudCraftingProgress(budId, 0);
    } else {
      // Update progress
      smithingStore.updateBudCraftingProgress(budId, newProgress);
    }
  });
};


export const stopBudSmithing = (budId: string): void => {
  console.group('Stop Bud Smithing');
  const assignmentStore = useAssignmentStore.getState();
  const smithingStore = useSmithingStore.getState();
  
  const assignment = assignmentStore.getBudAssignment(budId);
  if (!assignment || assignment.assignment !== "smithing") {
    console.warn(`No active smithing operation for bud ${budId}`);
    console.groupEnd();
    return;
  }

  assignmentStore.clearTask(budId);
  assignmentStore.unassignBud(budId);
  smithingStore.stopBudCrafting(budId);
  console.log(`Stopped bud smithing for ${budId}`);
  console.groupEnd();
};