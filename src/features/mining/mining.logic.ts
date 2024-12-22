import { TaskManager } from "../../utils/task-manager";
import { useMiningStore } from "./mining.store";
import { GameConfig } from "../../core/constants/game-config";
import { useAssignmentStore } from "../assignment/assignment.store";
import { usePartyStore } from "../party/party.store";
import { isMaxLevel } from "../../utils/experience";
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
      // nodeHealth: Math.max(0, node.nodeHealth - 1),
      currentProgress: newProgress % secondsPerResource // Keep remainder progress
    };
    setNodes({ ...nodes, [activeNode]: updatedNode });

    // Award XP for the single resource gathered
    const xpGain = node.experienceGain;
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

export const processBudMiningTick = (deltaTime: number): void => {
  const { nodes, setOres, setNodes } = useMiningStore.getState();
  const assignmentStore = useAssignmentStore.getState();

  // Get all buds assigned to mining
  const miningBuds = assignmentStore.getBudsByAssignment("mining");

  miningBuds.forEach((budId) => {
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
      const newOres: Record<string, number> = {};
      node.resourceNodeYields.forEach((ore) => {
        newOres[ore] = 1;
      });
      setOres(newOres);

      // Update node health
      const updatedNode = {
        ...node,
        // nodeHealth: Math.max(0, node.nodeHealth - 1),
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

export const startBudMining = (budId: string, nodeId: string): void => {
  console.group('Bud Mining Operation');
  const { nodes } = useMiningStore.getState();
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
    console.warn(`Bud level ${node.levelRequired} required to mine "${node.name}".`);
    console.groupEnd();
    return;
  }

  // Assign the bud to mining task
  const success = assignmentStore.assignBud(budId, "mining", {
    taskType: "resourceNode",
    nodeID: nodeId
  });

  if (success) {
    console.log(`Started bud mining with "${bud.nickname || bud.name}" on "${node.name}".`);
  } else {
    console.warn(`Failed to assign bud "${bud.nickname || bud.name}" to mining task.`);
  }
  
  console.groupEnd();
};

export const stopBudMining = (budId: string): void => {
  console.group('Stop Bud Mining');
  const assignmentStore = useAssignmentStore.getState();
  
  const assignment = assignmentStore.getBudAssignment(budId);
  if (!assignment || assignment.assignment !== "mining") {
    console.warn(`No active mining operation for bud ${budId}`);
    console.groupEnd();
    return;
  }

  assignmentStore.clearTask(budId);
  assignmentStore.unassignBud(budId);
  console.log(`Stopped bud mining for ${budId}`);
  console.groupEnd();
};
  
