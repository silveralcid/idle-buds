import { useMiningStore } from "./mining.state";

/**
 * Start mining on a node.
 */
export const startMining = (nodeId: string): void => {
  const { nodes, level, setCurrentNode } = useMiningStore.getState();
  const node = nodes[nodeId];

  // Validation
  if (!node) {
    console.warn(`Node with ID "${nodeId}" does not exist.`);
    return;
  }
  if (!node.isUnlocked) {
    console.warn(`Node "${node.name}" is locked.`);
    return;
  }
  if (level < node.levelRequired) {
    console.warn(`Level ${node.levelRequired} required to mine "${node.name}".`);
    return;
  }

  // Set the current node
  setCurrentNode(nodeId);
  console.log(`Started mining "${node.name}".`);
};

/**
 * Process mining tick (progress and rewards).
 */
export const processMiningTick = (deltaTime: number): void => {
    const { currentNode, nodes, ores, setOres, setXp, xp, setNodes } = useMiningStore.getState();
  
    if (!currentNode) return;
  
    const node = nodes[currentNode];
    if (!node) return;
  
    // Simulate mining progress
    const progress = node.gatherRate * deltaTime;
    const newOres: Record<string, number> = { ...ores };
  
    // Collect resources and deplete node health
    node.resourceNodeYields.forEach((ore) => {
      newOres[ore] = (newOres[ore] || 0) + progress;
    });
  
    // Update node health immutably
    const updatedNode = { ...node, nodeHealth: Math.max(0, node.nodeHealth - progress) };
  
    // Update nodes immutably in the store
    setNodes({ ...nodes, [currentNode]: updatedNode });
  
    // Update ores
    setOres(newOres);
  
    // Award XP
    const xpGain = node.experienceGain * deltaTime;
    setXp(xp + xpGain);
  
    console.log(`Mined ${progress} from "${node.name}", gained ${xpGain} XP.`);
  
    // Handle depletion and regeneration
    if (updatedNode.nodeHealth <= 0) {
      console.log(`${node.name} is depleted!`);
      if (node.isRenewable) {
        setTimeout(() => {
          const regeneratedNode = { ...updatedNode, nodeHealth: node.maxHealth };
          setNodes({ ...nodes, [currentNode]: regeneratedNode });
          console.log(`${node.name} has regenerated.`);
        }, node.regenRate * 1000);
      }
    }
  };
  

/**
 * Stop mining action.
 */
export const stopMining = (): void => {
  const { setCurrentNode } = useMiningStore.getState();
  setCurrentNode(null);
  console.log("Stopped mining.");
};
