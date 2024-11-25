import { useBankStore } from "../../stores/bank.store";
import { useGameStore } from "../../stores/game.store";
import { useHunterStore } from "../../stores/hunter.store";
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

  const itemsGained: Record<string, number> = {};
  const itemsLost: Record<string, number> = {};

  let xpGained = 0;

  // Simulate gathering and crafting tasks
  if (hunterStore.currentTask) {
    const { type, taskId } = hunterStore.currentTask;

    switch (type) {
      case "gathering":
        xpGained += processGatheringTask(offlineProgressTicks, hunterStore, bankStore, itemsGained);
        break;
      case "crafting":
        xpGained += processCraftingTask(
          offlineProgressTicks,
          hunterStore,
          bankStore,
          itemsGained,
          itemsLost
        );
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
  itemsGained: Record<string, number>
) {
  const taskDefinition = resourceRegistry[hunterStore.currentTask.taskId];
  if (!taskDefinition) {
    console.warn("Invalid gathering task ID:", hunterStore.currentTask.taskId);
    return 0;
  }

  let progress = hunterStore.progress;
  let totalXpGained = 0;

  for (let i = 0; i < ticks; i++) {
    progress += 100 / (taskDefinition.gatherRate / GameConfig.TICK.DURATION);

    if (progress >= 100) {
      const itemId = taskDefinition.resourceNodeYields[0];
      const quantity = 1;

      // Add to items gained
      itemsGained[itemId] = (itemsGained[itemId] || 0) + quantity;
      bankStore.addItem(itemId, quantity);

      // Gain XP
      const skillId = skillsConfig[taskDefinition.skillId]?.id; // Lookup skill ID
      if (skillId) {
        const xp = taskDefinition.experienceGain || 0;
        totalXpGained += xp;
        hunterStore.gainSkillXp(skillId, xp);
      }

      progress -= 100;
    }
  }

  hunterStore.updateTaskProgress(progress);
  console.log("Gathering task processed for offline progress.");
  return totalXpGained;
}

function processCraftingTask(
  ticks: number,
  hunterStore: any,
  bankStore: any,
  itemsGained: Record<string, number>,
  itemsLost: Record<string, number>
) {
  const recipe = recipeRegistry.find((r) => r.id === hunterStore.currentTask.taskId);
  if (!recipe) {
    console.warn("Invalid crafting task ID:", hunterStore.currentTask.taskId);
    return 0;
  }

  let progress = hunterStore.progress;
  let totalXpGained = 0;

  // Calculate crafting time per tick in terms of progress percentage
  const craftingTimeInTicks = recipe.craftingTime / GameConfig.TICK.DURATION;
  const progressPerTick = 100 / craftingTimeInTicks;

  for (let i = 0; i < ticks; i++) {
    progress += progressPerTick;

    // Process completed crafts
    while (progress >= 100) {
      // Check if sufficient materials exist
      const hasMaterials = recipe.inputs.every((input) =>
        input.itemIds.some((id) => (bankStore.items[id] || 0) >= input.amount)
      );

      if (!hasMaterials) {
        console.warn("Insufficient materials for crafting during offline progress.");
        hunterStore.stopTask();
        return totalXpGained;
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

      // Gain XP using skillsConfig
      const skillId = skillsConfig[recipe.skillId]?.id; // Lookup skill ID
      if (skillId) {
        const xp = recipe.experienceGain || 0;
        totalXpGained += xp;
        hunterStore.gainSkillXp(skillId, xp);
      }

      progress -= 100;
    }
  }

  hunterStore.updateTaskProgress(progress);
  console.log("Crafting task processed for offline progress.");
  return totalXpGained;
}

