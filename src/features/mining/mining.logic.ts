import { TaskManager } from "../../utils/task-manager";
import { useMiningStore } from "./mining.store";
import { GameConfig } from "../../core/constants/game-config";
/**
 * Start mining on a node.
 */

export const startMining = (nodeId: string): void => {
  console.group('Mining Operation');
  const { nodes, level, setActiveNode } = useMiningStore.getState();
  const node = nodes[nodeId];

  // Validation checks...
  if (!node) {
    console.warn(`Node with ID "${nodeId}" does not exist.`);
    console.groupEnd();
    return;
  }
  if (!node.isUnlocked) {
    console.warn(`Node "${node.name}" is locked.`);
    console.groupEnd();
    return;
  }
  if (level < node.levelRequired) {
    console.warn(`Level ${node.levelRequired} required to mine "${node.name}".`);
    console.groupEnd();
    return;
  }

  TaskManager.startTask("mining");
  setActiveNode(nodeId);
  console.log(`Started mining "${node.name}".`);
  console.groupEnd();
};


/**
 * Process mining tick (progress and rewards).
 */
export const processMiningTick = (deltaTime: number): void => {
  const { activeNode, nodes, ores, setOres, setXp, xp, level, setLevel, setNodes, xpToNextLevel } =
    useMiningStore.getState();

  if (!activeNode) return;

  const node = nodes[activeNode];
  if (!node) return;

  // Calculate time-based progress
  const secondsPerResource = 1 / node.gatherRate; // Convert gather rate to seconds per resource
  const currentProgress = node.currentProgress || 0;
  const newProgress = currentProgress + deltaTime; // Accumulate actual seconds

  if (newProgress >= secondsPerResource) {
    // Only award one resource at a time
    const newOres: Record<string, number> = {};
    
    // Award exactly one unit of each resource
    node.resourceNodeYields.forEach((ore) => {
      newOres[ore] = 1;
    });

    // Update ores globally
    setOres(newOres);

    // Update node health (one point per resource gathered)
    const updatedNode = { 
      ...node, 
      nodeHealth: Math.max(0, node.nodeHealth - 1),
      currentProgress: newProgress % secondsPerResource // Keep remainder progress
    };
    setNodes({ ...nodes, [activeNode]: updatedNode });

    // Award XP for the single resource gathered
    const xpGain = node.experienceGain;
    const newXp = xp + xpGain;
    setXp(newXp);

    // Handle level-up
    const requiredXp = xpToNextLevel();
    if (newXp >= requiredXp) {
      const newLevel = level + 1;
      setLevel(newLevel);
      setXp(newXp - requiredXp);
    }

    // Handle depletion and regeneration
    if (updatedNode.nodeHealth <= 0) {
      console.log(`${node.name} is depleted!`);
      if (node.isRenewable) {
        setTimeout(() => {
          const regeneratedNode = { 
            ...updatedNode, 
            nodeHealth: node.maxHealth,
            currentProgress: 0 
          };
          setNodes({ ...nodes, [activeNode]: regeneratedNode });
          console.log(`${node.name} has regenerated.`);
        }, node.regenRate * 1000);
      }
    }
  } else {
    // Just update progress
    const updatedNode = { ...node, currentProgress: newProgress };
    setNodes({ ...nodes, [activeNode]: updatedNode });
  }
};


/**
 * Stop mining action.
 */
export const stopMining = (): void => {
  TaskManager.stopCurrentTask();
};
  
