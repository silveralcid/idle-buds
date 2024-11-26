import { ResourceNode } from "../../types/resourceNode.types";
import { create } from "zustand";
import { useBankStore } from "../bank/bank.state";
import { convertNodesToRecord } from "../../utils/nodes-to-record";
import { miningNodes } from "../../data/nodes/mining.data";
import { BaseSkill } from "../../types/base-skill.types";
import { calculateXpToNextLevel } from "../../utils/experience";

export interface MiningState extends BaseSkill {
    currentNode: string | null;
    nodes: Record<string, ResourceNode>;
    ores: Record<string, number>;
    setXp: (xp: number) => void;
    setLevel: (level: number) => void;
    setProgress: (progress: number) => void;
    xpToNextLevel: () => number;
    setCurrentNode: (nodeId: string | null) => void;
    setOres: (newOres: Record<string, number>) => void;
    setNodes: (nodes: Record<string, ResourceNode>) => void; // Add this
    reset: () => void;
  }
  

  export const useMiningStore = create<MiningState>((set, get) => ({
    id: "mining",
    name: "Mining",
    description: "Extract valuable ores from the earth.",
    xp: 0,
    level: 1,
    progress: 0,
    xpToNextLevel: () => calculateXpToNextLevel(get().level), 
    isUnlocked: true,
    unlockRequirements: undefined,
    currentNode: null,
    nodes: convertNodesToRecord(miningNodes), // Use the utility to initialize nodes
    ores: {},
    setXp: (xp: number) => set(() => ({ xp })),
    setLevel: (level: number) => set(() => ({ level })),
    setProgress: (progress: number) => set(() => ({ progress })),
    setCurrentNode: (nodeId: string | null) => set(() => ({ currentNode: nodeId })),
    setOres: (newOres: Record<string, number>) =>
      set(() => {
        const bankStore = useBankStore.getState();
        Object.entries(newOres).forEach(([ore, quantity]) => {
          bankStore.addItem(ore, quantity);
        });
        return { ores: newOres };
      }),
    setNodes: (nodes: Record<string, ResourceNode>) => set(() => ({ nodes })), // Implement this
    reset: () =>
      set(() => ({
        xp: 0,
        level: 1,
        progress: 0,
        currentNode: null,
        nodes: convertNodesToRecord(miningNodes), // Reset nodes using the utility
        ores: {},
      })),
  }));
  