import { processMiningTick } from "../features/mining/mining.logic";
import { calculateTimeAway } from "../utils/offline-calculation";
import { useMiningStore } from "../features/mining/mining.store";
import { GameConfig } from "./constants/game-config";

export function processOfflineProgress(lastSaveTime: number): void {
  // Calculate and cap offline time
  const { timeAwayMilliseconds } = calculateTimeAway(lastSaveTime);
  const maxOfflineTime = GameConfig.SAVE.MAX_OFFLINE_TIME;
  const cappedTimeAway = Math.min(timeAwayMilliseconds, maxOfflineTime);
  const totalTimeAway = cappedTimeAway / 1000; // Convert to seconds
  
  console.group("Offline Progress");
  console.log(`Processing offline progress for ${totalTimeAway.toFixed(2)} seconds (capped from ${(timeAwayMilliseconds/1000).toFixed(2)})`);

  // Extract necessary state once
  const { activeNode, nodes, ores } = useMiningStore.getState();
  if (!activeNode || !nodes[activeNode].isUnlocked) {
    console.log("No active node or active node is locked.");
    console.groupEnd();
    return;
  }

  const node = nodes[activeNode];
  let totalXpGained = 0;
  const aggregatedOres: Record<string, number> = {};

  // Calculate total resources and XP for the active node
  const nodeGatherRate = node.gatherRate * GameConfig.EXPERIENCE.GATHER_RATE_MODIFIER;
  const totalGatherAmount = nodeGatherRate * totalTimeAway;
  const totalNodeXp = node.experienceGain * totalTimeAway;

  // Aggregate resources
  node.resourceNodeYields.forEach((ore) => {
    aggregatedOres[ore] = (aggregatedOres[ore] || 0) + totalGatherAmount;
  });

  totalXpGained += totalNodeXp;

  console.log(`Node "${node.name}": Gathered ${totalGatherAmount.toFixed(2)} resources, gained ${totalNodeXp.toFixed(2)} XP`);

  // Single state update for all resources
  useMiningStore.getState().setOres(aggregatedOres);
  
  // Update XP and handle level ups in a single operation
  const { xp, level } = useMiningStore.getState();
  const newXp = xp + totalXpGained;
  const xpToNextLevel = useMiningStore.getState().xpToNextLevel();
  
  if (newXp >= xpToNextLevel) {
    const newLevel = level + Math.floor(newXp / xpToNextLevel);
    useMiningStore.getState().setLevel(newLevel);
    useMiningStore.getState().setXp(newXp % xpToNextLevel);
  } else {
    useMiningStore.getState().setXp(newXp);
  }

  console.log(`Total Progress Summary:`);
  console.log(`- XP Gained: ${totalXpGained.toFixed(2)}`);
  console.log(`- Resources Gathered:`, aggregatedOres);
  console.groupEnd();
}