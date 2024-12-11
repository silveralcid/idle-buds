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
  const { workbenches, updateWorkbenchProgress, xp, level, setXp, setLevel, xpToNextLevel } = smithingStore;

  // Process each active workbench
  Object.entries(workbenches).forEach(([workbenchId, workbench]) => {
    if (!workbench.isActive || !workbench.recipe) return;

    // Convert deltaTime to ticks based on game config
    const tickProgress = deltaTime * GameConfig.TICK.RATE.DEFAULT;
    updateWorkbenchProgress(workbenchId, tickProgress);

    // Handle XP gain
    if (workbench.recipe) {
      const xpGain = (workbench.recipe.experienceGain / workbench.recipe.craftingTime) * tickProgress;
      const newXp = xp + xpGain;
      setXp(newXp);

      // Handle level-up
      const requiredXp = xpToNextLevel();
      if (newXp >= requiredXp) {
        const newLevel = level + 1;
        setLevel(newLevel);
        setXp(newXp - requiredXp); // Carry over excess XP
        
        console.group('Level Up!');
        console.log(`Smithing level increased to ${newLevel}!`);
        console.groupEnd();
      }

      // Debug logging
      console.groupCollapsed(`Smithing Progress`);
      console.log(`Recipe: ${workbench.recipe.name}`);
      console.log(`Progress: ${tickProgress}`);
      console.log(`XP Gained: ${xpGain}`);
      console.groupEnd();
    }
  });
};