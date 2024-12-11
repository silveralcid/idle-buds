import { useSmithingStore } from "./smithing.store";
import { GameConfig } from "../../core/constants/game-config";

export const processSmithingTick = (deltaTime: number): void => {
  const smithingStore = useSmithingStore.getState();
  const { workbenches, updateWorkbenchProgress } = smithingStore;

  Object.entries(workbenches).forEach(([workbenchId, workbench]) => {
    if (!workbench.isActive || !workbench.recipe) return;

    const tickProgress = deltaTime * GameConfig.TICK.RATE.DEFAULT;
    updateWorkbenchProgress(workbenchId, tickProgress);
  });
};