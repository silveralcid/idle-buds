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
  const { timeAwayMilliseconds } = calculateTimeAway(lastSaveTime);
  const maxOfflineTime = GameConfig.SAVE.MAX_OFFLINE_TIME;
  const cappedTimeAway = Math.min(timeAwayMilliseconds, maxOfflineTime);
  const totalTimeAway = cappedTimeAway / 1000; // Convert to seconds
  
  console.group("Offline Progress");
  console.log(`Processing offline progress for ${totalTimeAway.toFixed(2)} seconds`);

  // Process Bud Mining
  const miningStore = useMiningStore.getState();
  const assignmentStore = useAssignmentStore.getState();
  const partyStore = usePartyStore.getState();
  
  // Get all buds assigned to mining
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
