import { useBankStore } from "../../stores/bank.store";
import { useGameStore } from "../../stores/game.store";
import { useHunterStore } from "../../stores/hunter.store"; // Ensure you import the hunter store
import { GameConfig } from "../constants/game-config";
import { recipeRegistry } from "../../data/recipe-registry";
import { resourceRegistry } from "../../data/resource-registry";
import { skillsConfig } from "../../data/skills.data";

export function calculateOfflineProgress() {
  const currentTime = Date.now();
  const gameState = useGameStore.getState();
  const bankStore = useBankStore.getState();
  const hunterStore = useHunterStore.getState();

  const { lastSaveTime, tickRate } = gameState;

  const deltaTime = currentTime - lastSaveTime;
  if (deltaTime <= 0) {
    console.warn("Invalid delta time for offline progress calculation.");
    return;
  }

  const offlineProgressTicks = Math.floor(deltaTime / (1000 / tickRate));
  console.log(`Processing ${offlineProgressTicks} offline ticks.`);

  let xpGained = 0;
  const itemsGained: Record<string, number> = {};
  const itemsLost: Record<string, number> = {};

  // Simulate gathering and crafting tasks
  if (hunterStore.currentTask) {
    const { type, taskId } = hunterStore.currentTask;

    switch (type) {
      case "gathering":
        processGatheringTask(offlineProgressTicks, hunterStore, bankStore, xpGained, itemsGained);
        break;
      case "crafting":
        processCraftingTask(offlineProgressTicks, hunterStore, bankStore, xpGained, itemsGained, itemsLost);
        break;
      default:
        console.warn(`Unknown task type: ${type}`);
    }
  }

  return {
    lastSaveTime,
    currentTime,
    xpGained,
    itemsGained,
    itemsLost,
  };
}

function processGatheringTask(
    ticks: number,
    hunterStore: any,
    bankStore: any,
    xpGained: number,
    itemsGained: Record<string, number>
  ) {
    const taskDefinition = resourceRegistry[hunterStore.currentTask.taskId];
    if (!taskDefinition) {
      console.warn("Invalid gathering task ID:", hunterStore.currentTask.taskId);
      return;
    }
  
    let progress = hunterStore.progress;
  
    for (let i = 0; i < ticks; i++) {
      progress += (100 / (taskDefinition.gatherRate / GameConfig.TICK.DURATION));
  
      if (progress >= 100) {
        const itemId = taskDefinition.resourceNodeYields[0];
        const quantity = 1;
  
        // Add to items gained
        itemsGained[itemId] = (itemsGained[itemId] || 0) + quantity;
        bankStore.addItem(itemId, quantity);
  
        // Gain XP
        const skillId = skillsConfig[taskDefinition.id]?.id; // Example skill lookup
        if (skillId) {
          const xp = taskDefinition.experienceGain || 0;
          xpGained += xp;
          hunterStore.gainSkillXp(skillId, xp);
        }
  
        progress -= 100;
      }
    }
  
    hunterStore.updateTaskProgress(progress);
    console.log("Gathering task processed for offline progress.");
  }

  function processCraftingTask(
    ticks: number,
    hunterStore: any,
    bankStore: any,
    xpGained: number,
    itemsGained: Record<string, number>,
    itemsLost: Record<string, number>
  ) {
    const recipe = recipeRegistry.find((r) => r.id === hunterStore.currentTask.taskId);
    if (!recipe) {
      console.warn("Invalid crafting task ID:", hunterStore.currentTask.taskId);
      return;
    }
  
    let progress = hunterStore.progress;
    const craftingTime = recipe.craftingTime / GameConfig.TICK.DURATION;
  
    for (let i = 0; i < ticks; i++) {
      progress += (100 / craftingTime);
  
      if (progress >= 100) {
        // Check if sufficient materials exist
        const hasMaterials = recipe.inputs.every((input) =>
          input.itemIds.some((id) => (bankStore.items[id] || 0) >= input.amount)
        );
  
        if (!hasMaterials) {
          console.warn("Insufficient materials for crafting during offline progress.");
          hunterStore.stopTask();
          return;
        }
  
        // Consume inputs
        recipe.inputs.forEach((input) => {
          input.itemIds.forEach((id) => {
            bankStore.removeItem(id, input.amount);
            itemsLost[id] = (itemsLost[id] || 0) + input.amount;
          });
        });
  
        // Add outputs
        recipe.outputs.forEach((output) => {
          bankStore.addItem(output.itemId, output.amount);
          itemsGained[output.itemId] = (itemsGained[output.itemId] || 0) + output.amount;
        });
  
        // Gain XP using skillRegistry
        const skillId = skillsConfig[recipe.id]?.id; // Example: Look up skill for recipe
        if (skillId) {
          const xp = recipe.experienceGain || 0;
          xpGained += xp;
          hunterStore.gainSkillXp(skillId, xp);
        }
  
        progress -= 100;
      }
    }
  
    hunterStore.updateTaskProgress(progress);
    console.log("Crafting task processed for offline progress.");
  }
