import { calculateTimeAway } from "../utils/offline-calculation";
import { useMiningStore } from "../features/mining/mining.store";
import { useLumberingStore } from "../features/lumbering/lumbering.store";
import { GameConfig } from "./constants/game-config";
import { useBankStore } from "../features/bank/bank.store";
import { useSmithingStore } from "../features/smithing/smithing.store";
import { useTendingStore } from "../features/tending/tending.store";
import { completeHatching } from "../features/tending/tending.logic";
import { useAssignmentStore } from "../features/assignment/assignment.store";
import { usePartyStore } from "../features/party/party.store";

export function processOfflineProgress(lastSaveTime: number): void {
  // Get all store instances once at the start
  const miningStore = useMiningStore.getState();
  const lumberingStore = useLumberingStore.getState();
  const assignmentStore = useAssignmentStore.getState();
  const partyStore = usePartyStore.getState();
  const smithingStore = useSmithingStore.getState();
  const bankStore = useBankStore.getState();

  
  const { timeAwayMilliseconds } = calculateTimeAway(lastSaveTime);
  const maxOfflineTime = GameConfig.SAVE.MAX_OFFLINE_TIME;
  const cappedTimeAway = Math.min(timeAwayMilliseconds, maxOfflineTime);
  const totalTimeAway = cappedTimeAway / 1000; // Convert to seconds
  
  console.group("Offline Progress");
  console.log(`Processing offline progress for ${totalTimeAway.toFixed(2)} seconds`);

  // Process Bud Mining
  const miningBuds = assignmentStore.getBudsByAssignment("mining");
  
  miningBuds.forEach(budId => {
    const assignment = assignmentStore.getBudAssignment(budId);
    if (!assignment || assignment.task?.taskType !== "resourceNode") return;
    
    const nodeId = assignment.task.nodeID;
    if (!nodeId) return;
    
    const node = miningStore.nodes[nodeId];
    const bud = assignmentStore.getBud(budId);
    
    if (!node || !bud || !node.isUnlocked) return;
    
    // Calculate efficiency and resources gathered
    const baseEfficiency = 1.0;
    const levelBonus = 1 + (bud.level * 0.05); // 5% increase per level
    const efficiency = baseEfficiency * levelBonus;
    
    const secondsPerResource = 1 / (node.gatherRate * efficiency);
    const completedCycles = Math.floor(totalTimeAway / secondsPerResource);
    
    if (completedCycles > 0) {
      // Award resources
      const miningAggregatedOres: Record<string, number> = {};
      node.resourceNodeYields.forEach(ore => {
        miningAggregatedOres[ore] = completedCycles;
      });
      
      // Update bank with gathered resources
      miningStore.setOres(miningAggregatedOres);
      
      console.log(`Bud ${bud.nickname || bud.name} completed ${completedCycles} mining cycles at ${node.name}`);
    }
  });

  // Process Bud Lumbering
  const lumberingBuds = assignmentStore.getBudsByAssignment("lumbering");
  
  lumberingBuds.forEach(budId => {
    const assignment = assignmentStore.getBudAssignment(budId);
    if (!assignment || assignment.task?.taskType !== "resourceNode") return;
    
    const nodeId = assignment.task.nodeID;
    if (!nodeId) return;
    
    const node = lumberingStore.nodes[nodeId];
    const bud = assignmentStore.getBud(budId);
    
    if (!node || !bud || !node.isUnlocked) return;
    
    // Calculate efficiency and resources gathered
    const baseEfficiency = 1.0;
    const levelBonus = 1 + (bud.level * 0.05); // 5% increase per level
    const efficiency = baseEfficiency * levelBonus;
    
    const secondsPerResource = 1 / (node.gatherRate * efficiency);
    const completedCycles = Math.floor(totalTimeAway / secondsPerResource);
    
    if (completedCycles > 0) {
      // Award resources
      const lumberingAggregatedLogs: Record<string, number> = {};
      node.resourceNodeYields.forEach(log => {
        lumberingAggregatedLogs[log] = completedCycles;
      });
      
      // Update bank with gathered resources
      lumberingStore.setLogs(lumberingAggregatedLogs);
      
      console.log(`Bud ${bud.nickname || bud.name} completed ${completedCycles} lumbering cycles at ${node.name}`);
    }
  });

  // **Mining Offline Progress**
  const { activeNode: miningNode, nodes: miningNodes } = useMiningStore.getState();
  if (miningNode && miningNodes[miningNode].isUnlocked) {
    const node = miningNodes[miningNode];
    const secondsPerResource = 1 / node.gatherRate;
    const completedCycles = Math.floor(totalTimeAway / secondsPerResource);
    
    if (completedCycles > 0) {
      const miningAggregatedOres: Record<string, number> = {};
      
      // Award resources for completed cycles only
      node.resourceNodeYields.forEach((ore) => {
        miningAggregatedOres[ore] = completedCycles;
      });

      // Calculate XP for completed cycles
      const miningXpGained = node.experienceGain * completedCycles;

      useMiningStore.getState().setOres(miningAggregatedOres);
      updateXpAndLevel(useMiningStore, miningXpGained);

      console.log(`Mining: Completed ${completedCycles} cycles, gained ${miningXpGained.toFixed(2)} XP`);
    } else {
      console.log("Mining: Not enough time passed for a complete gathering cycle");
    }
  }

  // **Lumbering Offline Progress**
  const { activeNode: lumberingNode, nodes: lumberingNodes } = useLumberingStore.getState();
  if (lumberingNode && lumberingNodes[lumberingNode].isUnlocked) {
    const node = lumberingNodes[lumberingNode];
    const secondsPerResource = 1 / node.gatherRate;
    const completedCycles = Math.floor(totalTimeAway / secondsPerResource);
    
    if (completedCycles > 0) {
      const lumberingAggregatedLogs: Record<string, number> = {};
      
      // Award resources for completed cycles only
      node.resourceNodeYields.forEach((log) => {
        lumberingAggregatedLogs[log] = completedCycles;
      });

      // Calculate XP for completed cycles
      const lumberingXpGained = node.experienceGain * completedCycles;

      useLumberingStore.getState().setLogs(lumberingAggregatedLogs);
      updateXpAndLevel(useLumberingStore, lumberingXpGained);

      console.log(`Lumbering: Completed ${completedCycles} cycles, gained ${lumberingXpGained.toFixed(2)} XP`);
    } else {
      console.log("Lumbering: Not enough time passed for a complete gathering cycle");
    }
  }

  // **Tending Offline Progress**
  const { activeHatching } = useTendingStore.getState();
  if (activeHatching) {
    const currentTime = Date.now();
    const timeElapsedSinceLastProcess = (currentTime - activeHatching.lastProcessedTime) / 1000;
    const tickProgress = timeElapsedSinceLastProcess * GameConfig.TICK.RATE.DEFAULT;
    const totalProgress = activeHatching.progress + tickProgress;

    if (totalProgress >= activeHatching.totalTicks) {
      // Complete the hatching
      completeHatching(activeHatching.eggId);
      console.log(`Tending: Egg hatching completed while offline`);
    } else {
      // Update progress and last processed time
      useTendingStore.getState().updateHatchingProgress(totalProgress, currentTime);
      console.log(`Tending: Advanced egg hatching progress by ${tickProgress.toFixed(2)} ticks`);
    }
  }

  // Process Bud Smithing more efficiently
  const smithingBuds = assignmentStore.getBudsByAssignment("smithing");

  smithingBuds.forEach(budId => {
    const assignment = assignmentStore.getBudAssignment(budId);
    if (!assignment || assignment.task?.taskType !== "workbench") return;

    const workbenchId = assignment.task.nodeID;
    const recipeId = assignment.task.recipeId;
    if (!workbenchId || !recipeId) return;

    const recipe = smithingStore.recipes.find(r => r.id === recipeId);
    const bud = assignmentStore.getBud(budId);
    
    if (!recipe || !bud) return;

    // Calculate efficiency and completed cycles
    const baseEfficiency = 1.0;
    const levelBonus = 1 + (bud.level * 0.05); // 5% increase per level
    const efficiency = baseEfficiency * levelBonus;
    
    const adjustedCraftingTime = recipe.craftingTime / efficiency;
    const completedCycles = Math.floor(totalTimeAway / (adjustedCraftingTime / GameConfig.TICK.RATE.DEFAULT));

    if (completedCycles > 0) {
      // Calculate total resource requirements
      const totalInputs = recipe.inputs.map(input => ({
        ...input,
        amount: input.amount * completedCycles
      }));

      // Verify total resources
      const hasResources = totalInputs.every(input => {
        return input.itemIds.some(itemId => 
          (bankStore.items[itemId] || 0) >= input.amount
        );
      });

      if (!hasResources) return;

      // Consume all inputs at once
      totalInputs.forEach(input => {
        const availableItemId = input.itemIds.find(id => 
          (bankStore.items[id] || 0) >= input.amount
        );
        if (availableItemId) {
          bankStore.removeItem(availableItemId, input.amount);
        }
      });

      // Add all outputs at once
      recipe.outputs.forEach(output => {
        bankStore.addItem(output.itemId, output.amount * completedCycles);
      });

      console.log(`Bud ${bud.nickname || bud.name} completed ${completedCycles} smithing cycles while offline`);
    }
  });

  // player smithing
 // Process each active workbench
 Object.entries(smithingStore.workbenches).forEach(([workbenchId, workbench]) => {
  if (!workbench.isActive || !workbench.recipe) return;

  const recipe = workbench.recipe;
  const baseEfficiency = 1.0;
  const efficiency = baseEfficiency;
  
  // Calculate how many complete crafting cycles could have occurred
  const adjustedCraftingTime = recipe.craftingTime / efficiency;
  const completedCycles = Math.floor(totalTimeAway / (adjustedCraftingTime / GameConfig.TICK.RATE.DEFAULT));
  if (completedCycles > 0) {
   // Calculate total resource requirements for all cycles
   const totalInputs = recipe.inputs.map(input => ({
     ...input,
     amount: input.amount * completedCycles
   }));
    // Verify total resources are available
   const hasResources = totalInputs.every(input => {
     return input.itemIds.some(itemId => 
       (bankStore.items[itemId] || 0) >= input.amount
     );
   });
    

    if (!hasResources) {
     // If resources aren't available, deactivate the workbench
     smithingStore.updateWorkbenchProgress(workbenchId, 0);
     return;
   }
    // Consume all inputs at once
   totalInputs.forEach(input => {
     const availableItemId = input.itemIds.find(id => 
       (bankStore.items[id] || 0) >= input.amount
     );
     if (availableItemId) {
       bankStore.removeItem(availableItemId, input.amount);
     }
   });
    // Add all outputs at once
   recipe.outputs.forEach(output => {
     bankStore.addItem(output.itemId, output.amount * completedCycles);
   });
    // Calculate and award total XP
    const smithingXpGained = recipe.experienceGain * completedCycles;
    updateXpAndLevel(smithingStore, smithingXpGained);

    
    console.log(`Workbench ${workbenchId} completed ${completedCycles} crafting cycles while offline`);
 }
});







  console.groupEnd();
}


// Helper to update XP and handle level-ups

const MAX_LEVEL = GameConfig.EXPERIENCE.MAX_LEVEL;

function updateXpAndLevel(store: any, totalXpGained: number): void {
  const { xp, level } = store.getState();
  
  // If already at max level, don't process XP gains
  if (level >= MAX_LEVEL) {
    store.getState().setLevel(MAX_LEVEL);
    store.getState().setXp(0);
    return;
  }

  const newXp = xp + totalXpGained;
  const xpToNextLevel = store.getState().xpToNextLevel();
  
  if (newXp >= xpToNextLevel) {
    const levelsGained = Math.floor(newXp / xpToNextLevel);
    const newLevel = Math.min(level + levelsGained, MAX_LEVEL);
    
    // If we hit max level, discard remaining XP
    if (newLevel === MAX_LEVEL) {
      store.getState().setLevel(MAX_LEVEL);
      store.getState().setXp(0);
    } else {
      store.getState().setLevel(newLevel);
      store.getState().setXp(newXp % xpToNextLevel);
    }
  } else {
    store.getState().setXp(newXp);
  }
}
