import { calculateTimeAway } from "../utils/offline-calculation";
import { useMiningStore } from "../features/mining/mining.store";
import { useLumberingStore } from "../features/lumbering/lumbering.store";
import { GameConfig } from "./constants/game-config";

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
