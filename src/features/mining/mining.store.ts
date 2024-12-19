import { create } from "zustand";
import { useBankStore } from "../bank/bank.store";
import { convertNodesToRecord } from "../../utils/nodes-to-record";
import { miningNodes } from "../../data/nodes/mining.data";
import { BaseSkill } from "../../types/base-skill.types";
import { calculateXpToNextLevel } from "../../utils/experience";
import { ResourceNode } from "../../types/resource-node.types";

export interface MiningState extends BaseSkill {
  activeNode: string | null;
  nodes: Record<string, ResourceNode>;
  ores: Record<string, number>;
  budMiningNodes: Record<string, {
    budId: string;
    nodeId: string;
    progress: number;
    efficiency: number;
  }>;
  
  // State setters
  setXp: (xp: number) => void;
  setLevel: (level: number) => void;
  setProgress: (progress: number) => void;
  setActiveNode: (nodeId: string | null) => void;
  setOres: (newOres: Record<string, number>) => void;
  setNodes: (nodes: Record<string, ResourceNode>) => void;
  
  // Bud mining methods
  startBudMining: (budId: string, nodeId: string) => void;
  stopBudMining: (budId: string) => void;
  updateBudMiningProgress: (budId: string, progress: number) => void;
  getBudMiningStatus: (budId: string) => {
    nodeId: string | null;
    progress: number;
    efficiency: number;
  } | null;
  
  // Utility methods
  xpToNextLevel: () => number;
  reset: () => void;
  isBudMiningActive: (budId: string) => boolean;
}

export const useMiningStore = create<MiningState>((set, get) => ({
  // Base state
  id: "mining",
  name: "Mining",
  description: "Extract valuable ores from the earth.",
  xp: 0,
  level: 1,
  progress: 0,
  isUnlocked: true,
  unlockRequirements: undefined,
  activeNode: null,
  nodes: convertNodesToRecord(miningNodes),
  ores: {},
  budMiningNodes: {},

  // State setters
  setXp: (xp: number) => set(() => ({ xp })),
  
  setLevel: (level: number) => {
    set((state) => {
      const updatedNodes = { ...state.nodes };
      Object.keys(updatedNodes).forEach((nodeId) => {
        const node = updatedNodes[nodeId];
        if (!node.isUnlocked && level >= node.levelRequired) {
          updatedNodes[nodeId] = { ...node, isUnlocked: true };
        }
      });
      return { level, nodes: updatedNodes };
    });
  },

  setProgress: (progress: number) => set(() => ({ progress })),
  
  setActiveNode: (nodeId: string | null) => set(() => ({ activeNode: nodeId })),
  
  setOres: (newOres: Record<string, number>) => set((state) => {
    const bankStore = useBankStore.getState();
    Object.entries(newOres).forEach(([ore, quantity]) => {
      bankStore.addItem(ore, quantity);
    });
    return { ores: newOres };
  }),

  setNodes: (nodes: Record<string, ResourceNode>) => set(() => ({ nodes })),

  // Bud mining methods
  startBudMining: (budId: string, nodeId: string) => set((state) => {
    const node = state.nodes[nodeId];
    if (!node || !node.isUnlocked) return state;

    return {
      budMiningNodes: {
        ...state.budMiningNodes,
        [budId]: {
          budId,
          nodeId,
          progress: 0,
          efficiency: 1.0 // Base efficiency, can be modified based on Bud stats
        }
      }
    };
  }),

  stopBudMining: (budId: string) => set((state) => ({
    budMiningNodes: Object.fromEntries(
      Object.entries(state.budMiningNodes).filter(([id]) => id !== budId)
    )
  })),

  updateBudMiningProgress: (budId: string, progress: number) => set((state) => ({
    budMiningNodes: {
      ...state.budMiningNodes,
      [budId]: {
        ...state.budMiningNodes[budId],
        progress
      }
    }
  })),

  getBudMiningStatus: (budId: string) => {
    const state = get();
    const miningData = state.budMiningNodes[budId];
    if (!miningData) return null;
    
    return {
      nodeId: miningData.nodeId,
      progress: miningData.progress,
      efficiency: miningData.efficiency
    };
  },

  // Utility methods
  xpToNextLevel: () => calculateXpToNextLevel(get().level),

  reset: () => set(() => ({
    xp: 0,
    level: 1,
    progress: 0,
    activeNode: null,
    nodes: convertNodesToRecord(miningNodes),
    ores: {},
    budMiningNodes: {}
  })),

  isBudMiningActive: (budId: string) => {
    const state = get();
    return !!state.budMiningNodes[budId];
  }
}));
  
  