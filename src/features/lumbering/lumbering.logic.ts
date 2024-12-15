import { TaskManager } from "../../utils/task-manager";
import { useLumberingStore } from "./lumbering.store";

/**
 * Start lumbering on a tree.
 */
export const startLumbering = (nodeId: string): void => {
  console.group('Lumbering Operation');
  const { nodes, level, setActiveNode } = useLumberingStore.getState();
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
    console.warn(`Level ${node.levelRequired} required to chop "${node.name}".`);
    console.groupEnd();
    return;
  }

  TaskManager.startTask("lumbering");
  setActiveNode(nodeId);
  console.log(`Started chopping "${node.name}".`);
  console.groupEnd();
};


/**
 * Process lumbering tick (progress and rewards).
 */
export const processLumberingTick = (deltaTime: number): void => {
  const { activeNode, nodes, logs, setLogs, setXp, xp, level, setLevel, setNodes, xpToNextLevel } =
    useLumberingStore.getState();

  if (!activeNode) return;

  const tree = nodes[activeNode];
  if (!tree) return;

  // Calculate time-based progress
  const secondsPerResource = 1 / tree.gatherRate; // Convert gather rate to seconds per resource
  const currentProgress = tree.currentProgress || 0;
  const newProgress = currentProgress + deltaTime; // Accumulate actual seconds

  if (newProgress >= secondsPerResource) {
    // Only award one resource at a time
    const newLogs: Record<string, number> = {};
    
    // Award exactly one unit of each resource
    tree.resourceNodeYields.forEach((log) => {
      newLogs[log] = 1;
    });

    // Update logs globally
    setLogs(newLogs);

    // Update tree health (one point per resource gathered)
    const updatedTree = { 
      ...tree, 
      nodeHealth: Math.max(0, tree.nodeHealth - 1),
      currentProgress: newProgress % secondsPerResource // Keep remainder progress
    };
    setNodes({ ...nodes, [activeNode]: updatedTree });

    // Award XP for the single resource gathered
    const xpGain = tree.experienceGain;
    const newXp = xp + xpGain;
    setXp(newXp);

    // Handle level-up
    const requiredXp = xpToNextLevel();
    if (newXp >= requiredXp) {
      const newLevel = level + 1;
      setLevel(newLevel);
      setXp(newXp - requiredXp);
      console.group('Level Up!');
      console.log(`Congratulations! Reached level ${newLevel}.`);
      console.groupEnd();
    }

    // Handle depletion and regeneration
    if (updatedTree.nodeHealth <= 0) {
      console.log(`${tree.name} is depleted!`);
      if (tree.isRenewable) {
        setTimeout(() => {
          const regeneratedTree = { 
            ...updatedTree, 
            nodeHealth: tree.maxHealth,
            currentProgress: 0 
          };
          setNodes({ ...nodes, [activeNode]: regeneratedTree });
          console.log(`${tree.name} has regenerated.`);
        }, tree.regenRate * 1000);
      }
    }
  } else {
    // Just update progress
    const updatedTree = { ...tree, currentProgress: newProgress };
    setNodes({ ...nodes, [activeNode]: updatedTree });
  }
};

/**
 * Stop lumbering action.
 */
export const stopLumbering = (): void => {
  TaskManager.stopCurrentTask();
};
