import { calculateTimeAway } from "../utils/offline-calculation";
import { useMiningStore } from "../features/mining/mining.store";
import { useLumberingStore } from "../features/lumbering/lumbering.store";
import { GameConfig } from "./constants/game-config";
import { useBankStore } from "../features/bank/bank.store";
import { useSmithingStore } from "../features/smithing/smithing.store";

export function processOfflineProgress(lastSaveTime: number): void {
  const { timeAwayMilliseconds } = calculateTimeAway(lastSaveTime);
  const maxOfflineTime = GameConfig.SAVE.MAX_OFFLINE_TIME;
  const cappedTimeAway = Math.min(timeAwayMilliseconds, maxOfflineTime);
  const totalTimeAway = cappedTimeAway / 1000; // Convert to seconds
  
  console.group("Offline Progress");
  console.log(`Processing offline progress for ${totalTimeAway.toFixed(2)} seconds`);

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
