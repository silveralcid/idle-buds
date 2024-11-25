import { GameEvents } from "../core/game-events/game-events";
import { GameConfig } from "../core/constants/game-config";
import { resourceRegistry } from "../data/resource-registry";
import { useHunterStore } from "../stores/hunter.store";
import { useBankStore } from "../stores/bank.store";
import { recipeRegistry } from "../data/recipe-registry";

const gameEvents = GameEvents.getInstance();

gameEvents.on("gatheringOfflineTick", (event) => {
    const { task } = event;
    const hunterStore = useHunterStore.getState();
    const bankStore = useBankStore.getState();
  
    const resource = resourceRegistry[task.taskId];
    if (!resource) return;
  
    const progressIncrement = 100 / (resource.gatherRate / GameConfig.TICK.DURATION);
    hunterStore.updateTaskProgress(progressIncrement);
  
    if (hunterStore.progress >= 100) {
      const itemId = resource.resourceNodeYields[0];
      const quantity = 1;
  
      bankStore.addItem(itemId, quantity);
      gameEvents.emit("resourceGathered", { name: itemId, quantity });
  
      hunterStore.gainSkillXp(resource.skillId, resource.experienceGain);
      hunterStore.updateTaskProgress(0); // Reset progress
    }
  });
  

  gameEvents.on("craftingOfflineTick", (event) => {
    const { task } = event;
    const hunterStore = useHunterStore.getState();
    const bankStore = useBankStore.getState();
  
    const recipe = recipeRegistry.find((r) => r.id === task.taskId);
    if (!recipe) return;
  
    const progressIncrement = 100 / (recipe.craftingTime / GameConfig.TICK.DURATION);
    hunterStore.updateTaskProgress(progressIncrement);
  
    if (hunterStore.progress >= 100) {
      const hasMaterials = recipe.inputs.every((input) =>
        input.itemIds.some((id) => (bankStore.items[id] || 0) >= input.amount)
      );
  
      if (hasMaterials) {
        recipe.inputs.forEach((input) => {
          input.itemIds.forEach((id) => bankStore.removeItem(id, input.amount));
        });
        recipe.outputs.forEach((output) => bankStore.addItem(output.itemId, output.amount));
  
        hunterStore.gainSkillXp(recipe.skillId, recipe.experienceGain);
        hunterStore.updateTaskProgress(0); // Reset progress
      } else {
        hunterStore.stopTask();
      }
    }
  });
  