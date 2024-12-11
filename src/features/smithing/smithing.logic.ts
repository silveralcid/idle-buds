import { useSmithingStore } from "./smithing.store";
import { GameConfig } from "../../core/constants/game-config";

export const startSmithing = (workbenchId: string, recipeId: string): void => {
  const smithingStore = useSmithingStore.getState();
  smithingStore.activateWorkbench(workbenchId, recipeId);
};

export const stopSmithing = (workbenchId: string): void => {
  const smithingStore = useSmithingStore.getState();
  const workbench = smithingStore.workbenches[workbenchId];
  
  if (workbench && workbench.isActive) {
    smithingStore.updateWorkbenchProgress(workbenchId, -workbench.progress);
  }
};

export const processSmithingTick = (deltaTime: number): void => {
  const smithingStore = useSmithingStore.getState();
  const { workbenches, updateWorkbenchProgress } = smithingStore;

  // Process each active workbench
  Object.entries(workbenches).forEach(([workbenchId, workbench]) => {
    if (!workbench.isActive || !workbench.recipe) return;

    // Convert deltaTime to ticks based on game config
    const tickProgress = deltaTime * GameConfig.TICK.RATE.DEFAULT;
    updateWorkbenchProgress(workbenchId, tickProgress);
  });
};