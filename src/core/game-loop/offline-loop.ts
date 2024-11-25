import { recipeRegistry } from "../../data/recipe-registry";
import { resourceRegistry } from "../../data/resource-registry";
import { useBankStore } from "../../stores/bank.store";
import { useGameStore } from "../../stores/game.store";
import { useHunterStore } from "../../stores/hunter.store";
import { GameConfig } from "../constants/game-config";

export function calculateOfflineProgress() {
  const currentTime = Date.now();
  const gameState = useGameStore.getState();
  const hunterStore = useHunterStore.getState();

  const { lastSaveTime, tickRate } = gameState;

  const deltaTime = currentTime - lastSaveTime;
  if (deltaTime <= 0) {
    console.warn("Invalid delta time for offline progress calculation.");
    return;
  }

  // Calculate offline ticks
  const offlineProgressTicks = Math.floor(deltaTime / (1000 / tickRate));
  console.log(`Processing ${offlineProgressTicks} offline ticks.`);

  // Track progress
  let itemsGained: Record<string, number> = {};
  let itemsLost: Record<string, number> = {};
  let xpGained = 0;

  if (hunterStore.currentTask) {
    const taskSummary = processTaskOffline(hunterStore, offlineProgressTicks);
  
    xpGained += taskSummary.xpGained;
    itemsGained = mergeItems(itemsGained, taskSummary.itemsGained);
    itemsLost = mergeItems(itemsLost, taskSummary.itemsLost);
  } else {
    console.log("No active task for hunter during offline progress.");
  }
  

  // Save updated state
  useGameStore.getState().saveGame();

  return {
    lastSaveTime,
    currentTime,
    xpGained,
    itemsGained,
    itemsLost,
  };
}

function processTaskOffline(
  hunterStore: ReturnType<typeof useHunterStore.getState>,
  offlineProgressTicks: number
) {
  const bankStore = useBankStore.getState();
  let itemsGained: Record<string, number> = {};
  let itemsLost: Record<string, number> = {};
  let xpGained = 0;

  for (let i = 0; i < offlineProgressTicks; i++) {
    const { currentTask } = hunterStore;

    if (!currentTask) {
      console.warn("No task found during offline processing.");
      break;
    }

    const { type, taskId } = currentTask;

    switch (type) {
      case "gathering":
        const gatheringResult = handleGatheringOffline(currentTask, hunterStore, bankStore);
        xpGained += gatheringResult.xpGained;
        itemsGained = mergeItems(itemsGained, gatheringResult.itemsGained);
        break;

      case "crafting":
        const craftingResult = handleCraftingOffline(currentTask, offlineProgressTicks, hunterStore, bankStore);
        xpGained += craftingResult.xpGained;
        itemsGained = mergeItems(itemsGained, craftingResult.itemsGained);
        itemsLost = mergeItems(itemsLost, craftingResult.itemsLost);
        break;
        

      default:
        console.warn(`Unknown task type: ${type}`);
    }
  }

  return { itemsGained, itemsLost, xpGained };
}

function handleGatheringOffline(
  task: any,
  hunterStore: ReturnType<typeof useHunterStore.getState>,
  bankStore: ReturnType<typeof useBankStore.getState>
) {
  const resource = resourceRegistry[task.taskId];
  if (!resource) {
    console.warn("Invalid gathering task ID:", task.taskId);
    return { xpGained: 0, itemsGained: {} };
  }

  const itemsGained: Record<string, number> = {};
  let xpGained = 0;

  hunterStore.updateTaskProgress(1); // Simulate a single tick

  const progressIncrement = (100 / (resource.gatherRate / GameConfig.TICK.DURATION)) * 1; // Simulate for one tick
  if (hunterStore.progress + progressIncrement >= 100) {
    const itemId = resource.resourceNodeYields[0];
    const quantity = 1;

    // Add item to bank
    bankStore.addItem(itemId, quantity);
    itemsGained[itemId] = (itemsGained[itemId] || 0) + quantity;

    // Gain XP
    const xp = resource.experienceGain || 0;
    xpGained += xp;
    hunterStore.gainSkillXp(resource.skillId, xp);

    hunterStore.updateTaskProgress(0); // Reset progress
  }

  return { xpGained, itemsGained };
}

function handleCraftingOffline(
  task: any,
  offlineProgressTicks: number,
  hunterStore: ReturnType<typeof useHunterStore.getState>,
  bankStore: ReturnType<typeof useBankStore.getState>
) {
  const recipe = recipeRegistry.find((r) => r.id === task.taskId);
  if (!recipe) {
    console.warn("Invalid crafting task ID:", task.taskId);
    return { xpGained: 0, itemsGained: {}, itemsLost: {} };
  }

  const itemsGained: Record<string, number> = {};
  const itemsLost: Record<string, number> = {};
  let xpGained = 0;

  let progress = hunterStore.progress; // Use current progress state
  const craftingTicksPerCycle = recipe.craftingTime / GameConfig.TICK.DURATION;

  // Process offline ticks
  for (let i = 0; i < offlineProgressTicks; i++) {
    progress += 100 / craftingTicksPerCycle;

    if (progress >= 100) {
      // Check if sufficient materials exist
      const hasMaterials = recipe.inputs.every((input) =>
        input.itemIds.some((id) => (bankStore.items[id] || 0) >= input.amount)
      );

      if (!hasMaterials) {
        console.warn("Insufficient materials for crafting during offline progress.");
        hunterStore.stopTask();
        break; // Exit the loop since we can't craft without materials
      }

      // Consume inputs
      recipe.inputs.forEach((input) => {
        input.itemIds.forEach((id) => {
          bankStore.removeItem(id, input.amount);
          itemsLost[id] = (itemsLost[id] || 0) + input.amount;
        });
      });

      // Produce outputs
      recipe.outputs.forEach((output) => {
        bankStore.addItem(output.itemId, output.amount);
        itemsGained[output.itemId] = (itemsGained[output.itemId] || 0) + output.amount;
      });

      // Gain XP
      const xp = recipe.experienceGain || 0;
      xpGained += xp;
      hunterStore.gainSkillXp(recipe.skillId, xp);

      progress -= 100; // Reset progress after a full crafting cycle
    }
  }

  // Update the hunter's task progress
  hunterStore.updateTaskProgress(progress);

  return { xpGained, itemsGained, itemsLost };
}



function mergeItems(
  existingItems: Record<string, number>,
  newItems: Record<string, number>
): Record<string, number> {
  for (const [itemId, quantity] of Object.entries(newItems)) {
    existingItems[itemId] = (existingItems[itemId] || 0) + quantity;
  }
  return existingItems;
}
