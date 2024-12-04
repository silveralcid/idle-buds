import { processMiningTick } from "../features/mining/mining.logic";
import { calculateTimeAway } from "../utils/offline-calculation";
import { useMiningStore } from "../features/mining/mining.store";
import { GameConfig } from "./constants/game-config";

/**
 * Simulates the game loop for offline progression.
 * @param lastSaveTime - The timestamp of the last save.
 */
export function processOfflineProgress(lastSaveTime: number): void {
  // Calculate time spent offline
  const { timeAwayMilliseconds } = calculateTimeAway(lastSaveTime);
  const totalTimeAway = timeAwayMilliseconds / 1000; // Convert to seconds
  const TICK_DURATION = GameConfig.TICK.DURATION / 1000; // Convert from ms to seconds

  console.group("Offline Progress");
  console.log(`Processing offline progress for ${totalTimeAway.toFixed(2)} seconds.`);

  // Extract necessary state
  const { nodes, ores, setOres } = useMiningStore.getState();

  let totalXpGained = 0;
  const minedItems: Record<string, number> = {};

  // Process each node independently based on its gather rate
  Object.values(nodes).forEach((node) => {
    if (!node.isUnlocked) return;

    const nodeGatherRate = node.gatherRate * GameConfig.EXPERIENCE.GATHER_RATE_MODIFIER;
    const nodeTicks = Math.floor(totalTimeAway / (TICK_DURATION / nodeGatherRate));

    console.group(`Node: ${node.name}`);
    console.log(`Simulating ${nodeTicks} ticks for node "${node.name}" at gather rate: ${nodeGatherRate}.`);

    for (let i = 0; i < nodeTicks; i++) {
      // Simulate mining tick
      processMiningTick(TICK_DURATION);

      // Track XP gain
      totalXpGained += node.experienceGain * TICK_DURATION;

      // Track items mined
      for (const [ore, quantity] of Object.entries(ores)) {
        minedItems[ore] = (minedItems[ore] || 0) + quantity;
      }
    }
    console.groupEnd();
  });

  // Log total XP gained
  console.group("Summary");
  console.log(`Total XP gained: ${totalXpGained}`);

  // Log mined items
  console.group("Mined Items");
  for (const [item, quantity] of Object.entries(minedItems)) {
    console.log(`${item}: ${quantity}`);
  }
  console.groupEnd();

  // Unlock nodes if level-up occurred
  const { level } = useMiningStore.getState();
  console.group("Unlocked Nodes");
  Object.values(nodes).forEach((node) => {
    if (!node.isUnlocked && node.levelRequired <= level) {
      console.log(`Unlocked node: ${node.name}`);
    }
  });
  console.groupEnd();

  console.groupEnd(); // Summary
  console.groupEnd(); // Offline Progress
}
