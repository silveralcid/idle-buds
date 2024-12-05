import { TaskManager } from "../../utils/task-manager";
import { useMiningStore } from "./mining.store";

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
  
    // Simulate mining progress
    const progress = node.gatherRate * deltaTime;
    const newOres: Record<string, number> = {};
  
    // Collect resources for the current node
    node.resourceNodeYields.forEach((ore) => {
      // Calculate only the difference instead of total
      const newQuantity = progress;
      newOres[ore] = (newOres[ore] || 0) + newQuantity;
    });

    // Update ores globally (flat structure)
    setOres(newOres);
  
    // Update node health immutably
    const updatedNode = { ...node, nodeHealth: Math.max(0, node.nodeHealth - progress) };
  
    // Update nodes immutably in the store
    setNodes({ ...nodes, [activeNode]: updatedNode });

  
    // Award XP
    const xpGain = node.experienceGain * deltaTime;
    const newXp = xp + xpGain;
    setXp(newXp);
  
    // Handle level-up
    const requiredXp = xpToNextLevel();
    if (newXp >= requiredXp) {
      const newLevel = level + 1;
      setLevel(newLevel);
      setXp(newXp - requiredXp); // Carry over excess XP
      console.group('Level Up!');
      console.log(`Congratulations! Reached level ${newLevel}.`);
      console.groupEnd();
    }
  
  // console.log(`Mined ${progress} from "${node.name}", gained ${xpGain} XP.`);
  
  console.groupCollapsed(`Mining ${node.name}`);
  console.log(`Progress: ${progress}`);
  console.log(`XP Gained: ${xpGain}`);
  console.groupEnd();

  
    // Handle depletion and regeneration
    if (updatedNode.nodeHealth <= 0) {
      console.log(`${node.name} is depleted!`);
      if (node.isRenewable) {
        setTimeout(() => {
          const regeneratedNode = { ...updatedNode, nodeHealth: node.maxHealth };
          setNodes({ ...nodes, [activeNode]: regeneratedNode });
          console.log(`${node.name} has regenerated.`);
        }, node.regenRate * 1000);
      }
      console.groupEnd();
    }
  console.groupEnd();
  };
  
  
  

/**
 * Stop mining action.
 */
export const stopMining = (): void => {
  TaskManager.stopCurrentTask();
};
  
