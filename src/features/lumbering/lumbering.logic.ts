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

  const progress = tree.gatherRate * deltaTime;
  const newLogs: Record<string, number> = {};

  tree.resourceNodeYields.forEach((log) => {
    const newQuantity = progress;
    newLogs[log] = (newLogs[log] || 0) + newQuantity;
  });

  setLogs(newLogs);

  const updatedTree = { ...tree, nodeHealth: Math.max(0, tree.nodeHealth - progress) };
  setNodes({ ...nodes, [activeNode]: updatedTree });

  const xpGain = tree.experienceGain * deltaTime;
  const newXp = xp + xpGain;
  setXp(newXp);

  const requiredXp = xpToNextLevel();
  if (newXp >= requiredXp) {
    const newLevel = level + 1;
    setLevel(newLevel);
    setXp(newXp - requiredXp);
    console.group('Level Up!');
    console.log(`Congratulations! Reached level ${newLevel}.`);
    console.groupEnd();
  }

  console.groupCollapsed(`Chopping ${tree.name}`);
  console.log(`Progress: ${progress}`);
  console.log(`XP Gained: ${xpGain}`);
  console.groupEnd();

  if (updatedTree.nodeHealth <= 0) {
    console.log(`${tree.name} is depleted!`);
    if (tree.isRenewable) {
      setTimeout(() => {
        const regeneratedTree = { ...updatedTree, nodeHealth: tree.maxHealth };
        setNodes({ ...nodes, [activeNode]: regeneratedTree });
        console.log(`${tree.name} has regenerated.`);
      }, tree.regenRate * 1000);
    }
    console.groupEnd();
  }
  console.groupEnd();
};

/**
 * Stop lumbering action.
 */
export const stopLumbering = (): void => {
  TaskManager.stopCurrentTask();
};
