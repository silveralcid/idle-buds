import { useMiningStore } from "./mining.store";

/**
 * Start mining on a node.
 */

export const startMining = (nodeId: string): void => {
  console.group('Mining Operation');
  const { nodes, level, activeNode, setActiveNode } = useMiningStore.getState();
  const node = nodes[nodeId];

  // Validation
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

  // Stop mining the current node if it's different from the new one
  if (activeNode && activeNode !== nodeId) {
    console.log(`Switching from node "${activeNode}" to "${nodeId}".`);
    console.groupEnd();
    stopMining();
  }

  // Set the new current node
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
    console.group('Stop Mining');
    const { activeNode, setActiveNode, setNodes, nodes } = useMiningStore.getState();
  
    if (activeNode) {
      const node = nodes[activeNode];
      if (node) {
        console.log(`Stopping mining on node: "${node.name}"`);
        // Optionally reset node state if needed
        const updatedNode = { ...node };
        setNodes({ ...nodes, [activeNode]: updatedNode });
      }
    }
  
    // Clear the current node
    setActiveNode(null);
    console.log("Mining has been stopped.");
    console.groupEnd();
  };
  
