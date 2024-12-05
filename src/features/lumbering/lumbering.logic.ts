import { useLumberingStore } from "./lumbering.store";

/**
 * Start lumbering on a tree.
 */
export const startLumbering = (treeId: string): void => {
  console.group('Lumbering Operation');
  const { nodes, level, activeNode, setActiveNode } = useLumberingStore.getState();
  const tree = nodes[treeId];

  if (!tree) {
    console.warn(`Tree with ID "${treeId}" does not exist.`);
    console.groupEnd();
    return;
  }
  if (!tree.isUnlocked) {
    console.warn(`Tree "${tree.name}" is locked.`);
    console.groupEnd();
    return;
  }
  if (level < tree.levelRequired) {
    console.warn(`Level ${tree.levelRequired} required to chop "${tree.name}".`);
    console.groupEnd();
    return;
  }

  if (activeNode && activeNode !== treeId) {
    console.log(`Switching from tree "${activeNode}" to "${treeId}".`);
    stopLumbering();
  }

  setActiveNode(treeId);
  console.log(`Started chopping "${tree.name}".`);
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
  console.group('Stop Lumbering');
  const { activeNode, setActiveNode, setNodes, nodes } = useLumberingStore.getState();

  if (activeNode) {
    const tree = nodes[activeNode];
    if (tree) {
      console.log(`Stopping lumbering on tree: "${tree.name}"`);
      const updatedTree = { ...tree };
      setNodes({ ...nodes, [activeNode]: updatedTree });
    }
  }

  setActiveNode(null);
  console.log("Lumbering has been stopped.");
  console.groupEnd();
};
