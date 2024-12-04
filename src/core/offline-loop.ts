import { processMiningTick } from "../features/mining/mining.logic";
import { calculateTimeAway } from "../utils/offline-calculation";
import { useMiningStore } from "../features/mining/mining.store";

/**
 * Simulates the game loop for offline progression.
 * @param lastSaveTime - The timestamp of the last save.
 */
export function processOfflineProgress(lastSaveTime: number): void {
  // Calculate time spent offline
  const { timeAwayMilliseconds } = calculateTimeAway(lastSaveTime);
  const timeAwaySeconds = Math.floor(timeAwayMilliseconds / 1000);

  console.group("Offline Progress");
  console.log(`Processing offline progress for ${timeAwaySeconds} seconds.`);

  // Define tick interval and compute the number of ticks to simulate
  const TICK_INTERVAL = 1; // Simulate 1-second ticks
  const ticksToSimulate = timeAwaySeconds;

  // Track total XP gained and nodes processed
  let totalXpGained = 0;

  // Log items mined
  const minedItems: Record<string, number> = {};

  for (let i = 0; i < ticksToSimulate; i++) {
    // Simulate a mining tick
    const { activeNode, nodes, ores } = useMiningStore.getState();
    if (!activeNode) continue; // Skip if no active node

    const node = nodes[activeNode];
    if (!node) continue; // Skip if the active node is invalid

    // Simulate mining tick
    processMiningTick(TICK_INTERVAL);

    // Track XP gain
    totalXpGained += node.experienceGain * TICK_INTERVAL;

    // Track items mined
    for (const [ore, quantity] of Object.entries(ores)) {
      minedItems[ore] = (minedItems[ore] || 0) + quantity;
    }
  }

  // Log XP gained
  console.group("Summary");
  console.log(`Total XP gained: ${totalXpGained}`);

  // Log mined items
  console.group("Mined Items");
  for (const [item, quantity] of Object.entries(minedItems)) {
    console.log(`${item}: ${quantity}`);
  }
  console.groupEnd(); // Mined Items

  // Unlock nodes if level-up occurred
  const { level, nodes } = useMiningStore.getState();
  console.group("Unlocked Nodes");
  Object.values(nodes).forEach((node) => {
    if (node.isUnlocked && node.levelRequired <= level) {
      console.log(`Unlocked node: ${node.name}`);
    }
  });
  console.groupEnd(); // Unlocked Nodes

  console.groupEnd(); // Summary
  console.groupEnd(); // Offline Progress
}
