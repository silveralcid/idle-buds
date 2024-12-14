import { calculateTimeAway } from "../utils/offline-calculation";
import { useMiningStore } from "../features/mining/mining.store";
import { useLumberingStore } from "../features/lumbering/lumbering.store";
import { GameConfig } from "./constants/game-config";
import { useBankStore } from "../features/bank/bank.store";
import { useSmithingStore } from "../features/smithing/smithing.store";

export function processOfflineProgress(lastSaveTime: number): void {
  // Calculate and cap offline time
  const { timeAwayMilliseconds } = calculateTimeAway(lastSaveTime);
  const maxOfflineTime = GameConfig.SAVE.MAX_OFFLINE_TIME;
  const cappedTimeAway = Math.min(timeAwayMilliseconds, maxOfflineTime);
  const totalTimeAway = cappedTimeAway / 1000; // Convert to seconds
  
  console.group("Offline Progress");
  console.log(`Processing offline progress for ${totalTimeAway.toFixed(2)} seconds (capped from ${(timeAwayMilliseconds/1000).toFixed(2)})`);

  // **Mining Offline Progress**
  const { activeNode: miningNode, nodes: miningNodes, ores } = useMiningStore.getState();
  if (miningNode && miningNodes[miningNode].isUnlocked) {
    const node = miningNodes[miningNode];
    let miningXpGained = 0;
    const miningAggregatedOres: Record<string, number> = {};

    const miningGatherRate = node.gatherRate * GameConfig.EXPERIENCE.GATHER_RATE_MODIFIER;
    const miningGatherAmount = miningGatherRate * totalTimeAway;
    const miningNodeXp = node.experienceGain * totalTimeAway;

    node.resourceNodeYields.forEach((ore) => {
      miningAggregatedOres[ore] = (miningAggregatedOres[ore] || 0) + miningGatherAmount;
    });

    miningXpGained += miningNodeXp;

    useMiningStore.getState().setOres(miningAggregatedOres);
    updateXpAndLevel(useMiningStore, miningXpGained);

    console.log(`Mining: Gathered ${miningGatherAmount.toFixed(2)} resources, gained ${miningNodeXp.toFixed(2)} XP`);
  } else {
    console.log("Mining: No active node or active node is locked.");
  }

  // **Lumbering Offline Progress**
  const { activeNode: lumberingNode, nodes: lumberingNodes, logs } = useLumberingStore.getState();
  if (lumberingNode && lumberingNodes[lumberingNode].isUnlocked) {
    const node = lumberingNodes[lumberingNode];
    let lumberingXpGained = 0;
    const lumberingAggregatedLogs: Record<string, number> = {};

    const lumberingGatherRate = node.gatherRate * GameConfig.EXPERIENCE.GATHER_RATE_MODIFIER;
    const lumberingGatherAmount = lumberingGatherRate * totalTimeAway;
    const lumberingNodeXp = node.experienceGain * totalTimeAway;

    node.resourceNodeYields.forEach((log) => {
      lumberingAggregatedLogs[log] = (lumberingAggregatedLogs[log] || 0) + lumberingGatherAmount;
    });

    lumberingXpGained += lumberingNodeXp;

    useLumberingStore.getState().setLogs(lumberingAggregatedLogs);
    updateXpAndLevel(useLumberingStore, lumberingXpGained);

    console.log(`Lumbering: Gathered ${lumberingGatherAmount.toFixed(2)} resources, gained ${lumberingNodeXp.toFixed(2)} XP`);
  } else {
    console.log("Lumbering: No active node or active node is locked.");
  }

  // **Smithing Offline Progress**
const smithingStore = useSmithingStore.getState();
const { workbenches } = smithingStore;

Object.entries(workbenches).forEach(([workbenchId, workbench]) => {
  if (!workbench.isActive || !workbench.recipe) return;

  const recipe = workbench.recipe;
  const bankStore = useBankStore.getState();
  
  // Calculate how many complete crafts can be done
  const craftTimePerItem = recipe.craftingTime / GameConfig.TICK.RATE.DEFAULT;
  const potentialCrafts = Math.floor(totalTimeAway / craftTimePerItem);
  
  // Check resource availability
  const maxCraftsFromResources = recipe.inputs.reduce((min, input) => {
    const availableResource = input.itemIds.reduce((sum, itemId) => 
      sum + (bankStore.items[itemId] || 0), 0);
    const possibleCrafts = Math.floor(availableResource / input.amount);
    return Math.min(min, possibleCrafts);
  }, Infinity);

  const actualCrafts = Math.min(potentialCrafts, maxCraftsFromResources);
  
  if (actualCrafts > 0) {
    // Consume inputs
    recipe.inputs.forEach(input => {
      const totalRequired = input.amount * actualCrafts;
      let remaining = totalRequired;
      
      input.itemIds.some(itemId => {
        const available = bankStore.items[itemId] || 0;
        if (available > 0) {
          const toConsume = Math.min(available, remaining);
          bankStore.removeItem(itemId, toConsume);
          remaining -= toConsume;
        }
        return remaining === 0;
      });
    });

    // Add outputs
    recipe.outputs.forEach(output => {
      bankStore.addItem(output.itemId, output.amount * actualCrafts);
    });

    // Calculate and award XP
    const totalXpGained = recipe.experienceGain * actualCrafts;
    updateXpAndLevel(smithingStore, totalXpGained);

    console.log(`${workbench.type}: Crafted ${actualCrafts}x ${recipe.name}, gained ${totalXpGained.toFixed(2)} XP`);
  } else {
    console.log(`${workbench.type}: No crafts completed due to insufficient resources or time.`);
  }
  });

  console.groupEnd();
}


// Helper to update XP and handle level-ups
function updateXpAndLevel(store: any, totalXpGained: number): void {
  const { xp, level } = store.getState();
  const newXp = xp + totalXpGained;
  const xpToNextLevel = store.getState().xpToNextLevel();
  
  if (newXp >= xpToNextLevel) {
    const newLevel = level + Math.floor(newXp / xpToNextLevel);
    store.getState().setLevel(newLevel);
    store.getState().setXp(newXp % xpToNextLevel);
  } else {
    store.getState().setXp(newXp);
  }
}
