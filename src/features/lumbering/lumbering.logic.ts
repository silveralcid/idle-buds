import { TaskManager } from "../../utils/task-manager";
import { useLumberingStore } from "./lumbering.store";
import { useAssignmentStore } from "../assignment/assignment.store";
import { isMaxLevel } from "../../utils/experience";

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
      nodeHealth: Math.max(0, tree.nodeHealth - 0),
      currentProgress: newProgress % secondsPerResource // Keep remainder progress
    };
    setNodes({ ...nodes, [activeNode]: updatedTree });

    // Award XP for the single resource gathered
    const xpGain = tree.experienceGain;
    // Only award XP if not at max level
    if (!isMaxLevel(level)) {
      const newXp = xp + xpGain;
      setXp(newXp);

    // Handle level-up
    const requiredXp = xpToNextLevel();
    if (newXp >= requiredXp) {
      const newLevel = level + 1;
      // Double check we don't exceed max level
      if (!isMaxLevel(newLevel)) {
        setLevel(newLevel);
        setXp(newXp - requiredXp);
      } else {
        setLevel(newLevel);
        setXp(0); // At max level, no excess XP stored
      }
    }
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

/**
 * Start bud lumbering on a node.
 */
export const startBudLumbering = (budId: string, nodeId: string): void => {
  console.group('Bud Lumbering Operation');
  const { nodes } = useLumberingStore.getState();
  const node = nodes[nodeId];
  const assignmentStore = useAssignmentStore.getState();
  const bud = assignmentStore.getBud(budId);

  // Validation checks
  if (!node) {
    console.warn(`Node with ID "${nodeId}" does not exist.`);
    console.groupEnd();
    return;
  }

  if (!bud) {
    console.warn(`Bud with ID "${budId}" does not exist.`);
    console.groupEnd();
    return;
  }

  if (!node.isUnlocked) {
    console.warn(`Node "${node.name}" is locked.`);
    console.groupEnd();
    return;
  }

  if (bud.level < node.levelRequired) {
    console.warn(`Bud level ${node.levelRequired} required to chop "${node.name}".`);
    console.groupEnd();
    return;
  }

  // Assign the bud to lumbering task
  const success = assignmentStore.assignBud(budId, "lumbering", {
    taskType: "resourceNode",
    nodeID: nodeId
  });

  if (success) {
    console.log(`Started bud lumbering with "${bud.nickname || bud.name}" on "${node.name}".`);
  } else {
    console.warn(`Failed to assign bud "${bud.nickname || bud.name}" to lumbering task.`);
  }
  
  console.groupEnd();
};

/**
 * Process bud lumbering tick (progress and rewards).
 */
export const processBudLumberingTick = (deltaTime: number): void => {
  const { nodes, setLogs, setNodes } = useLumberingStore.getState();
  const assignmentStore = useAssignmentStore.getState();

  // Get all buds assigned to lumbering
  const lumberingBuds = assignmentStore.getBudsByAssignment("lumbering");

  lumberingBuds.forEach((budId) => {
    const assignment = assignmentStore.getBudAssignment(budId);
    if (!assignment || assignment.task?.taskType !== "resourceNode") return;

    const nodeId = assignment.task.nodeID;
    if (!nodeId) return;

    const node = nodes[nodeId];
    const bud = assignmentStore.getBud(budId);
    if (!node || !bud || node.nodeHealth <= 0) return;

    // Calculate progress based on Bud's efficiency
    const baseEfficiency = 1.0;
    const levelBonus = 1 + (bud.level * 0.05); // 5% increase per level
    const efficiency = baseEfficiency * levelBonus;
    
    const secondsPerResource = 1 / (node.gatherRate * efficiency);
    const currentProgress = node.currentProgress || 0;
    const newProgress = currentProgress + deltaTime;

    if (newProgress >= secondsPerResource) {
      // Award resources
      const newLogs: Record<string, number> = {};
      node.resourceNodeYields.forEach((log) => {
        newLogs[log] = 1;
      });
      setLogs(newLogs);

      // Update node health
      const updatedNode = {
        ...node,
        currentProgress: newProgress % secondsPerResource
      };
      setNodes({ ...nodes, [nodeId]: updatedNode });

      // Handle node depletion
      if (updatedNode.nodeHealth <= 0) {
        assignmentStore.clearTask(budId);
      }
    } else {
      // Just update progress
      const updatedNode = { ...node, currentProgress: newProgress };
      setNodes({ ...nodes, [nodeId]: updatedNode });
    }
  });
};

/**
 * Stop bud lumbering action.
 */
export const stopBudLumbering = (budId: string): void => {
  console.group('Stop Bud Lumbering');
  const assignmentStore = useAssignmentStore.getState();
  
  const assignment = assignmentStore.getBudAssignment(budId);
  if (!assignment || assignment.assignment !== "lumbering") {
    console.warn(`No active lumbering operation for bud ${budId}`);
    console.groupEnd();
    return;
  }

  assignmentStore.clearTask(budId);
  assignmentStore.unassignBud(budId);
  console.log(`Stopped bud lumbering for ${budId}`);
  console.groupEnd();
};
